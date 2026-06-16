import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://htezwjuiboordwjclton.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0ZXp3anVpYm9vcmR3amNsdG9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1OTk2NTMsImV4cCI6MjA5NzE3NTY1M30.tcjpSqjMEGecLfPr_YSOTCkA0Rm5Imfw13JGikhwz1A';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
