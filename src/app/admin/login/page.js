'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (res.ok) {
                if (data.user.role !== 'admin') {
                    setError('Access denied. Admins only.');
                    // Optional: logout if they logged in as driver but tried admin portal
                    return;
                }
                router.push('/admin/dashboard');
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ justifyContent: 'center' }}>
            <main className="card animate-fade-in" style={{ borderTop: '4px solid var(--accent-primary)' }}>
                <h1 className="text-center">Admin Portal</h1>
                <p className="text-center text-secondary mb-4">Management Access Only</p>

                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label className="label">Username</label>
                        <input
                            type="text"
                            className="input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label className="label">Password</label>
                        <input
                            type="password"
                            className="input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <div className="text-center" style={{ color: 'var(--status-error)', marginBottom: '16px' }}>{error}</div>}

                    <button type="submit" className="btn">
                        {loading ? 'Authenticating...' : 'Login to Dashboard'}
                    </button>
                </form>
            </main>
        </div>
    );
}
