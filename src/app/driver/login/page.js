'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DriverLogin() {
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
                // Redirect to dashboard
                router.push('/driver/dashboard');
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ justifyContent: 'center' }}>
            <main className="card animate-fade-in">
                <h1 className="text-center">Driver Login</h1>
                <p className="text-center text-secondary mb-4">Enter your credentials to access the fleet.</p>

                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label className="label">Username</label>
                        <input
                            type="text"
                            className="input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="e.g. driver"
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
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {error && <div className="text-center" style={{ color: 'var(--status-error)', marginBottom: '16px' }}>{error}</div>}

                    <button type="submit" className="btn" disabled={loading}>
                        {loading ? 'Logging in...' : 'Sign In'}
                    </button>
                </form>
            </main>
            <p className="text-center text-sm text-muted">
                Need help? Contact dispatch.
            </p>
        </div>
    );
}
