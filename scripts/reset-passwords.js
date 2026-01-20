const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const supabaseUrl = 'https://orwrkjtufehdlnepkmjl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yd3JranR1ZmVoZGxuZXBrbWpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4NTUxNTQsImV4cCI6MjA4NDQzMTE1NH0.n7tThEH2wCNqChJ6VhRuoQjnFp8UnEK8MqOVXM5-bCQ';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function resetPasswords() {
    console.log('Resetting passwords for admin and driver...');

    const adminPassword = await bcrypt.hash('admin123', 10);
    const driverPassword = await bcrypt.hash('driver123', 10);

    const { error: adminError } = await supabase
        .from('users')
        .update({ password: adminPassword })
        .eq('username', 'admin');

    const { error: driverError } = await supabase
        .from('users')
        .update({ password: driverPassword })
        .eq('username', 'driver');

    if (adminError || driverError) {
        console.error('Error resetting passwords:', adminError || driverError);
    } else {
        console.log('Passwords reset successfully!');
    }
}

resetPasswords();
