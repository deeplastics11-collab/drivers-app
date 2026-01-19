import { supabase } from '@/lib/supabase';

export default async function DriversList() {
    const { data: drivers } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'driver');

    const driverList = drivers || [];

    return (
        <div>
            <h2 className="mb-4">Driver Management</h2>
            <div className="card">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid #ffffff20' }}>
                            <th style={{ padding: '12px' }}>ID</th>
                            <th style={{ padding: '12px' }}>Name</th>
                            <th style={{ padding: '12px' }}>Username</th>
                            <th style={{ padding: '12px' }}>Status</th>
                            <th style={{ padding: '12px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {driverList.map(driver => (
                            <tr key={driver.id} style={{ borderBottom: '1px solid #ffffff05' }}>
                                <td style={{ padding: '12px' }}>#{driver.id}</td>
                                <td style={{ padding: '12px', fontWeight: 'bold' }}>{driver.name}</td>
                                <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>@{driver.username}</td>
                                <td style={{ padding: '12px' }}><span style={{ color: 'var(--status-success)' }}>Active</span></td>
                                <td style={{ padding: '12px' }}>
                                    <button className="btn btn-secondary" style={{ padding: '4px 12px', fontSize: '0.8rem', width: 'auto' }}>View Logs</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {driverList.length === 0 && <p className="text-center text-secondary mt-4">No drivers found.</p>}
            </div>
        </div>
    );
}
