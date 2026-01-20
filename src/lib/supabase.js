import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://orwrkjtufehdlnepkmjl.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Export a function slightly differently to avoid crashing during build
export const supabase = (typeof window !== 'undefined' || !!supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey || 'placeholder')
    : null;
