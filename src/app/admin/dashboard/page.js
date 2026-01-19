import { supabase } from '@/lib/supabase';

async function getStats() {
    const { count: driverCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'driver');

    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count: inspectionsCount } = await supabase
        .from('inspections')
        .select('*', { count: 'exact', head: true })
        .gt('created_at', last24h);

    const { count: issuesCount } = await supabase
        .from('inspections')
        .select('*', { count: 'exact', head: true })
        .or('tires_ok.eq.false,lights_ok.eq.false,brakes_ok.eq.false,fluids_ok.eq.false');

    const lastHour = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    // For distinct user count in the last hour
    const { data: activeData } = await supabase
        .from('locations')
        .select('user_id')
        .gt('timestamp', lastHour);

    const activeCount = new Set(activeData?.map(d => d.user_id)).size;

    return {
        drivers: driverCount || 0,
        inspections: inspectionsCount || 0,
        issues: issuesCount || 0,
        active: activeCount || 0
    };
}

export default async function AdminDashboard() {
    const stats = await getStats();

    return (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                <div className="card text-center">
                    <h3 style={{ margin: 0, fontSize: '2.5rem', color: 'var(--accent-primary)' }}>{stats.drivers}</h3>
                    <p className="text-secondary">Total Drivers</p>
                </div>
                <div className="card text-center">
                    <h3 style={{ margin: 0, fontSize: '2.5rem', color: 'var(--status-success)' }}>{stats.inspections}</h3>
                    <p className="text-secondary">Inspections (24h)</p>
                </div>
                <div className="card text-center">
                    <h3 style={{ margin: 0, fontSize: '2.5rem', color: 'var(--status-error)' }}>{stats.issues}</h3>
                    <p className="text-secondary">Vehicle Issues</p>
                </div>
                <div className="card text-center">
                    <h3 style={{ margin: 0, fontSize: '2.5rem', color: '#f59e0b' }}>{stats.active}</h3>
                    <p className="text-secondary">Active on Road</p>
                </div>
            </div>

            <div className="card">
                <h3>Recent Inspections with Issues</h3>
                {stats.issues === 0 ? (
                    <p className="text-secondary">No current vehicle issues reported.</p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid #ffffff20' }}>
                                <th style={{ padding: '8px' }}>Driver</th>
                                <th style={{ padding: '8px' }}>Issue(s)</th>
                                <th style={{ padding: '8px' }}>Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* In a real app we would map the issues here. For now just placeholder if stats.issues > 0 */}
                            <tr>
                                <td style={{ padding: '8px' }}>John Doe</td>
                                <td style={{ padding: '8px', color: 'var(--status-error)' }}>Brakes Checks Failed</td>
                                <td style={{ padding: '8px' }}>10:30 AM</td>
                            </tr>
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
