import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://orwrkjtufehdlnepkmjl.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase URL or Anon Key missing in environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
