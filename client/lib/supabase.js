import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://htezwjuiboordwjclton.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0ZXp3anVpYm9vcmR3amNsdG9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1OTk2NTMsImV4cCI6MjA5NzE3NTY1M30.tcjpSqjMEGecLfPr_YSOTCkA0Rm5Imfw13JGikhwz1A';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
