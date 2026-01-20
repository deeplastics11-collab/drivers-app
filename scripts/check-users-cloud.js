const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://orwrkjtufehdlnepkmjl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yd3JranR1ZmVoZGxuZXBrbWpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4NTUxNTQsImV4cCI6MjA4NDQzMTE1NH0.n7tThEH2wCNqChJ6VhRuoQjnFp8UnEK8MqOVXM5-bCQ';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkUsers() {
    console.log('Checking users in Supabase...');
    const { data, error } = await supabase.from('users').select('username, role, name');
    if (error) {
        console.error('Error fetching users:', error);
    } else {
        console.log('Users in database:', data);
    }
}

checkUsers();
