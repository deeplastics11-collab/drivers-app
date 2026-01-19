import Link from 'next/link';

export default function Home() {
  return (
    <div className="container" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Fleet Manager</h1>
      <p className="text-secondary" style={{ marginBottom: '2rem' }}>Secure. Fast. Reliable.</p>

      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Link href="/driver/login" className="btn">
          Driver Login
        </Link>

        <Link href="/admin/login" className="btn btn-secondary">
          Admin Login
        </Link>
      </div>
    </div>
  );
}
