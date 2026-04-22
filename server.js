require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns');
const https = require('https');

const app = express();
app.use(cors());
app.use(express.json());

// Google DNS resolver (fixes ISP DNS issues)
const resolver = new dns.Resolver();
resolver.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

function dnsResolve(hostname) {
  return new Promise((resolve, reject) => {
    resolver.resolve4(hostname, (err, addresses) => {
      if (err) reject(err);
      else resolve(addresses[0]);
    });
  });
}

// HTTPS fetch with Google DNS + proper TLS SNI
function safeFetch(url, options = {}) {
  return new Promise(async (resolve, reject) => {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname;
      const ip = await dnsResolve(hostname);
      console.log(`🌐 DNS: ${hostname} -> ${ip}`);

      const bodyStr = options.body || '';
      const reqOptions = {
        hostname: ip,
        port: 443,
        path: urlObj.pathname + urlObj.search,
        method: options.method || 'GET',
        headers: {
          ...options.headers,
          Host: hostname,
          Connection: 'close',
          ...(bodyStr ? { 'Content-Length': Buffer.byteLength(bodyStr) } : {}),
        },
        servername: hostname,
      };

      const req = https.request(reqOptions, (res) => {
        console.log(`📡 Response Status: ${res.statusCode}`);
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          resolve({
            ok: res.statusCode >= 200 && res.statusCode < 300,
            status: res.statusCode,
            json: () => Promise.resolve(JSON.parse(data)),
            text: () => Promise.resolve(data),
          });
        });
      });

      req.setTimeout(30000, () => {
        req.destroy();
        reject(new Error('Request Timeout (30s)'));
      });

      req.on('error', (err) => {
        console.error('❌ Request Error:', err.message);
        reject(err);
      });
      if (bodyStr) req.write(bodyStr);
      req.end();
    } catch (err) {
      reject(err);
    }
  });
}

// HuggingFace API Key
const HF_API_KEY = process.env.HF_API_KEY;

if (!HF_API_KEY || HF_API_KEY === 'YOUR_HF_TOKEN_HERE') {
  console.error('❌ HF_API_KEY NOT SET!');
}

app.post('/generate-description', async (req, res) => {
  try {
    const { github_url } = req.body;

    if (!github_url || !github_url.includes('github.com/')) {
      return res.status(400).json({ error: 'Invalid GitHub URL' });
    }

    const parts = github_url.split('github.com/')[1].split('/');
    const owner = parts[0];
    const repo = parts[1];

    console.log(`\n📦 Fetching README for ${owner}/${repo}...`);

    // --- STEP 1: Get README from GitHub ---
    let readme = '';

    const readmeRes = await safeFetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
      headers: { Accept: 'application/vnd.github.v3.raw', 'User-Agent': 'porto-web-server' },
    });

    if (!readmeRes.ok) {
      console.warn('⚠️  README not found, falling back to repo info...');

      const repoRes = await safeFetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: { Accept: 'application/vnd.github.v3+json', 'User-Agent': 'porto-web-server' },
      });
      const repoData = await repoRes.json();
      readme = `Repository: ${repoData.name}\nDescription: ${repoData.description || 'No description'}\nLanguage: ${repoData.language || 'Unknown'}\nTopics: ${(repoData.topics || []).join(', ') || 'None'}`;
    } else {
      readme = await readmeRes.text();
    }

    // --- STEP 2: Validate README ---
    if (!readme || readme.length < 20) {
      readme = `GitHub project called ${repo} by ${owner}. No detailed README available.`;
    }

    // HuggingFace BART has a strict token limit. Keep input around ~2000 chars.
    const truncatedReadme = readme.substring(0, 2000);
    console.log(`📄 README length: ${truncatedReadme.length} chars`);

    // --- STEP 3: Send to HuggingFace ---
    console.log('🤖 Sending to HuggingFace AI...');

    // Use a FASTER distilbart model
    const hfUrl = 'https://router.huggingface.co/hf-inference/models/sshleifer/distilbart-cnn-12-6';

    let aiRes = await safeFetch(hfUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: `Summarize this GitHub project into a long professional portfolio description :\n\n${truncatedReadme}`
      }),
    });

    // --- STEP 4: Handle HuggingFace Response ---
    if (!aiRes.ok) {
      const errorText = await aiRes.text();
      console.error('❌ HF HTTP ERROR:', aiRes.status, errorText);

      // Model loading (503) - wait and retry once
      if (aiRes.status === 503) {
        console.log('⏳ Model is loading, retrying in 10s...');
        await new Promise((r) => setTimeout(r, 10000));

        aiRes = await safeFetch(hfUrl, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${HF_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: `Summarize this GitHub project into a long professional portfolio description :\n\n${truncatedReadme}`
          }),
        });

        if (!aiRes.ok) {
          return res.json({ description: 'AI model is loading. Please try again in a few seconds.' });
        }
      } else {
        return res.json({ description: 'AI request failed: HTTP ' + aiRes.status });
      }
    }

    const aiData = await aiRes.json();
    console.log('🔍 HF RESPONSE:', JSON.stringify(aiData, null, 2));

    if (aiData.error) {
      console.error('❌ HF ERROR:', aiData.error);
      return res.json({ description: 'AI error: ' + aiData.error });
    }

    // --- STEP 5: Parse response ---
    let description = 'No description generated';

    // HuggingFace returns an array: [{ "summary_text": "..." }]
    if (Array.isArray(aiData) && aiData.length > 0 && aiData[0].summary_text) {
      description = aiData[0].summary_text;
    }

    console.log('✅ Description:', description);
    res.json({ description });
  } catch (err) {
    console.error('❌ Error:', err);
    res.status(500).json({ error: 'Failed to generate description' });
  }
});

app.listen(5000, () => {
  console.log('🚀 Server running on http://localhost:5000');
  console.log('🔑 HuggingFace Key:', HF_API_KEY && HF_API_KEY !== 'YOUR_HF_TOKEN_HERE' ? 'SET ✅' : 'MISSING ❌');
  console.log('🌐 DNS: Google (8.8.8.8)');
  console.log('🧠 Model: facebook/bart-large-cnn (via new HF router)');
});