'use client';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const MapInner = dynamic(() => import('@/components/MapInner'), {
    ssr: false,
    loading: () => <div style={{ height: '500px', background: '#1e2532', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Map...</div>
});

export default function AdminMapPage() {
    const [locations, setLocations] = useState([]);

    const fetchLocations = async () => {
        try {
            const res = await fetch('/api/admin/locations');
            if (res.ok) {
                const data = await res.json();
                setLocations(data.locations);
            }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchLocations();
        const interval = setInterval(fetchLocations, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <h2 className="mb-4">Live Fleet Tracking</h2>
            <div className="card" style={{ padding: '4px' }}>
                <MapInner locations={locations} />
            </div>
            <p className="text-secondary mt-4">
                Showing active drivers from the last hour. Updates every 10 seconds.
            </p>
        </div>
    );
}
