const dns = require('dns');
const https = require('https');

// Google DNS resolver (fixes ISP DNS issues during local testing)
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

      const bodyStr = options.body || '';
      const reqOptions = {
        hostname: ip,
        port: 443,
        path: urlObj.pathname + urlObj.search,
        method: options.method || 'GET',
        headers: {
          ...options.headers,
          Host: hostname,
          ...(bodyStr ? { 'Content-Length': Buffer.byteLength(bodyStr) } : {}),
        },
        servername: hostname,
      };

      const req = https.request(reqOptions, (res) => {
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

      req.on('error', reject);
      if (bodyStr) req.write(bodyStr);
      req.end();
    } catch (err) {
      reject(err);
    }
  });
}

export default async function handler(req, res) {
  // Set CORS headers for local development
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const HF_API_KEY = process.env.HF_API_KEY;

  if (!HF_API_KEY) {
    return res.status(500).json({ error: 'HF_API_KEY not configured on server' });
  }

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

    const truncatedReadme = readme.substring(0, 2000);
    console.log(`📄 README length: ${truncatedReadme.length} chars`);

    // --- STEP 3: Send to HuggingFace ---
    const hfUrl = 'https://router.huggingface.co/hf-inference/models/facebook/bart-large-cnn';

    let aiRes = await safeFetch(hfUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: `Summarize this GitHub project into a long professional portfolio description :\n\n${truncatedReadme}`,
        parameters: { max_length: 100, min_length: 20 },
      }),
    });

    // --- STEP 4: Handle HuggingFace Response ---
    if (!aiRes.ok) {
      const errorText = await aiRes.text();
      console.error('❌ HF HTTP ERROR:', aiRes.status, errorText);

      if (aiRes.status === 503) {
        // Retry once for serverless function but careful with timeout
        console.log('⏳ Model is loading, retrying in 3s...');
        await new Promise((r) => setTimeout(r, 3000));

        aiRes = await safeFetch(hfUrl, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${HF_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: `Summarize this GitHub project into a long professional portfolio description :\n\n${truncatedReadme}`,
            parameters: { max_length: 100, min_length: 20 },
          }),
        });

        if (!aiRes.ok) {
           return res.status(200).json({ description: 'AI model is still loading. Please try again in 10 seconds.' });
        }
      } else {
        return res.status(500).json({ error: 'AI request failed' });
      }
    }

    const aiData = await aiRes.json();
    
    let description = 'No description generated';
    if (Array.isArray(aiData) && aiData.length > 0 && aiData[0].summary_text) {
      description = aiData[0].summary_text;
    }

    return res.status(200).json({ description });
  } catch (err) {
    console.error('❌ Error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
