import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

let supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
let supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Add debug logging
console.log("Environment variables check:");
console.log(`SUPABASE_URL: ${supabaseUrl ? "✓ Present" : "✗ Missing"}`);
console.log(`SUPABASE_ANON_KEY: ${supabaseAnonKey ? "✓ Present" : "✗ Missing"}`);

// Provide fallback values for development only
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials missing - using fallback for development");
  // These are just placeholder values to prevent crashes during development
  supabaseUrl = 'https://fallback-url.supabase.co';
  supabaseAnonKey = 'fallback-key';
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Add error handling for the client initialization
try {
  // Test connection to verify credentials are working
  supabase.auth.getSession().then(({ data, error }) => {
    if (error) {
      console.error('Supabase authentication error:', error);
    } else {
      console.log('Supabase connection successful');
    }
  });
} catch (error) {
  console.error('Supabase initialization error:', error);
} 