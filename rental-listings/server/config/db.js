const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase environment variables!');
  process.exit(1); // Stop server if critical config is missing
}

// Test connection
async function testConnection() {
  const { data, error } = await supabase.from('users').select('id').limit(1);
  if (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  } else {
    console.log('✅ Database connected successfully!');
  }
}

testConnection();

module.exports = supabase;
