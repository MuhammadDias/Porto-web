import { createClient } from '@supabase/supabase-js';

const cleanEnvValue = (value) => {
  if (!value || typeof value !== 'string') return '';
  return value.replace(/\u0000/g, '').replace(/^\uFEFF/, '').trim();
};

const supabaseUrl = cleanEnvValue(process.env.REACT_APP_SUPABASE_URL || process.env.SUPABASE_URL);
const supabaseAnonKey = cleanEnvValue(process.env.REACT_APP_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY);

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase env config is missing. Check REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
