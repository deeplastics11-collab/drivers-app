import { createClient } from '@supabase/supabase-js';

// Hardcoding the anon key to guarantee the cloud build succeeds immediately.
// Note: This is an 'anon public' key, which is safe to be visible.
const supabaseUrl = 'https://orwrkjtufehdlnepkmjl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yd3JranR1ZmVoZGxuZXBrbWpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4NTUxNTQsImV4cCI6MjA4NDQzMTE1NH0.n7tThEH2wCNqChJ6VhRuoQjnFp8UnEK8MqOVXM5-bCQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
