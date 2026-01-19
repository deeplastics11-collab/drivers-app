import Link from 'next/link';
import { getSession } from '@/lib/auth';

export default async function AdminLayout({ children }) {
    const user = await getSession();

    return (
        <div className="admin-container">
            <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', borderBottom: '1px solid #ffffff10', paddingBottom: '16px' }}>
                <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Admin Portal</h1>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <Link href="/admin/dashboard" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
                    <Link href="/admin/map" style={{ color: 'white', textDecoration: 'none' }}>Live Map</Link>
                    <Link href="/admin/drivers" style={{ color: 'white', textDecoration: 'none' }}>Drivers</Link>

                    <form action="/api/auth/logout" method="POST">
                        <button type="submit" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Logout</button>
                    </form>
                </div>
            </nav>
            {children}
        </div>
    );
}
