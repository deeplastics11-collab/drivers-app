import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getSession } from '@/lib/auth';

export async function GET() {
  const user = await getSession();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const lastHour = new Date(Date.now() - 60 * 60 * 1000).toISOString();

  const { data: rawLocations, error } = await supabase
    .from('locations')
    .select(`
            *,
            users (
                name
            )
        `)
    .gt('timestamp', lastHour)
    .order('id', { ascending: false });

  if (error) {
    console.error('Fetch locations error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }

  // Filter to keep only the newest location per driver in JS
  const latestMap = new Map();
  rawLocations?.forEach(loc => {
    if (!latestMap.has(loc.user_id)) {
      latestMap.set(loc.user_id, {
        ...loc,
        driver_name: loc.users?.name
      });
    }
  });

  const locations = Array.from(latestMap.values());

  return NextResponse.json({ locations });
}
