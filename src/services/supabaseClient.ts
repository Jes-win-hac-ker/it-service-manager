// src/services/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

// Replace with your actual Supabase Project URL and Anon Key
const supabaseUrl = 'https://supabase.com/dashboard/project/xszifdmhjmeylagxedon';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzemlmZG1oam1leWxhZ3hlZG9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0NzY0MTIsImV4cCI6MjA3MDA1MjQxMn0.buLP-VoCXr8OBII61fGI4QAdtE9JoGtaF-Rd0sG_37Y';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
