import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getSession } from '@/lib/auth';

// Helper for session check
async function getUser() {
    const user = await getSession();
    if (!user || user.role !== 'driver') return null;
    return user;
}

export async function POST(req) {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const json = await req.json();
        const type = req.nextUrl.pathname.split('/').pop();

        let result;
        if (type === 'inspection') {
            result = await supabase.from('inspections').insert({
                user_id: user.id,
                date: json.date,
                tires_ok: json.tires_ok,
                lights_ok: json.lights_ok,
                brakes_ok: json.brakes_ok,
                fluids_ok: json.fluids_ok,
                notes: json.notes
            });
        }
        else if (type === 'fuel') {
            result = await supabase.from('fuel_logs').insert({
                user_id: user.id,
                date: json.date,
                liters: json.liters,
                cost: json.cost
            });
        }
        else if (type === 'mileage') {
            result = await supabase.from('mileage_logs').insert({
                user_id: user.id,
                date: json.date,
                start_km: json.start_km,
                end_km: json.end_km
            });
        }
        else if (type === 'location') {
            result = await supabase.from('locations').insert({
                user_id: user.id,
                lat: json.lat,
                lng: json.lng
            });
        }

        if (result?.error) {
            throw result.error;
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}
