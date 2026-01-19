const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Load .env.local
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('YOUR_')) {
    console.error('Please update .env.local with your real Supabase keys first!');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seed() {
    console.log('Seeding Supabase with default users...');

    const users = [
        {
            username: 'admin',
            password: await bcrypt.hash('admin123', 10),
            role: 'admin',
            name: 'System Admin'
        },
        {
            username: 'driver',
            password: await bcrypt.hash('driver123', 10),
            role: 'driver',
            name: 'John Doe'
        }
    ];

    for (const user of users) {
        const { error } = await supabase.from('users').insert(user);
        if (error) {
            if (error.code === '23505') {
                console.log(`User ${user.username} already exists.`);
            } else {
                console.error(`Error creating ${user.username}:`, error.message);
            }
        } else {
            console.log(`Created user: ${user.username}`);
        }
    }

    console.log('Seeding complete!');
}

seed();
