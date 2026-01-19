import Link from 'next/link';
import { getSession } from '@/lib/auth'; // We'll assume server component usage or fetch user

export default async function DriverDashboard() {
    const user = await getSession();

    const menuItems = [
        { label: 'Daily Inspection', href: '/driver/inspection', color: '#10b981' },
        { label: 'Fuel Capture', href: '/driver/fuel', color: '#3b82f6' },
        { label: 'Mileage Log', href: '/driver/mileage', color: '#f59e0b' },
        { label: 'Roadside Assist', href: '/driver/roadside', color: '#ef4444' },
    ];

    return (
        <div className="container">
            <header className="flex-between mb-4">
                <div>
                    <h2 style={{ marginBottom: 0 }}>Hello, {user?.name || 'Driver'}</h2>
                    <p className="text-secondary text-sm">Vehicle: Toyota Hilux (XYZ-123)</p>
                </div>
                <form action="/api/auth/logout" method="POST">
                    <button type="submit" className="text-sm text-muted" style={{ background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Logout</button>
                </form>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {menuItems.map((item) => (
                    <Link href={item.href} key={item.label} style={{ textDecoration: 'none' }}>
                        <div className="card" style={{
                            height: '140px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderTop: `4px solid ${item.color}`,
                            textAlign: 'center',
                            margin: 0
                        }}>
                            <span style={{ fontWeight: '600', color: 'white' }}>{item.label}</span>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="card mt-4">
                <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Recent Activity</h3>
                <p className="text-secondary text-sm">No recent logs found.</p>
            </div>
        </div>
    );
}
