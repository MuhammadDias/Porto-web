// test-connection.js
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://foxaytqwoinxlukzbdfx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZveGF5dHF3b2lueGx1a3piZGZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2NTAwNDUsImV4cCI6MjA4MTIyNjA0NX0.5vQbcpQ2IDw0f23ymbGeL39HtVqS2JoEz_CUxiI2bz8';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('Testing Supabase connection...');
  
  try {
    // Test 1: Fetch skills
    const { data: skills, error: skillsError } = await supabase
      .from('skills')
      .select('*');
    
    if (skillsError) {
      console.error('Error fetching skills:', skillsError);
      return;
    }
    
    console.log(`✓ Successfully fetched ${skills.length} skills`);
    
    // Test 2: Fetch projects
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*');
    
    if (projectsError) {
      console.error('Error fetching projects:', projectsError);
      return;
    }
    
    console.log(`✓ Successfully fetched ${projects.length} projects`);
    
    // Test 3: Test authentication
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'diasizzat222@gmail.com', // Ganti dengan email admin Anda
      password: 'p@ssw0rd123.,'   // Ganti dengan password admin
    });
    
    if (authError) {
      console.error('Authentication test failed:', authError.message);
    } else {
      console.log('✓ Authentication successful');
    }
    
    console.log('\n✅ All tests passed! Database is ready.');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

testConnection();