'use client';
import { useState, useEffect } from 'react';

export default function RoadsideAssistance() {
    const [active, setActive] = useState(false);
    const [status, setStatus] = useState('Idle');
    const [coords, setCoords] = useState(null);

    useEffect(() => {
        let watchId;
        if (active) {
            setStatus('Locating...');
            if (!navigator.geolocation) {
                setStatus('Geolocation not supported');
                return;
            }

            watchId = navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setCoords({ latitude, longitude });
                    setStatus('Broadcasting Location...');

                    // Send to server
                    fetch('/api/driver/location', {
                        method: 'POST',
                        body: JSON.stringify({ lat: latitude, lng: longitude })
                    });
                },
                (error) => {
                    setStatus('Error: ' + error.message);
                },
                { enableHighAccuracy: true }
            );
        } else {
            setStatus('Idle');
        }

        return () => {
            if (watchId) navigator.geolocation.clearWatch(watchId);
        };
    }, [active]);

    return (
        <div className="container" style={{ textAlign: 'center' }}>
            <h2 className="mb-4" style={{ color: 'var(--status-error)' }}>Roadside Assistance</h2>

            <div className="card">
                <p className="mb-4">
                    If you are stranded or in an emergency, activate this to share your live location with the Admin Dashboard.
                </p>

                <div style={{
                    width: '150px',
                    height: '150px',
                    borderRadius: '50%',
                    background: active ? 'var(--status-error)' : '#333',
                    margin: '0 auto 24px auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: active ? '0 0 30px var(--status-error)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                }} onClick={() => setActive(!active)}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                        {active ? 'STOP' : 'HELP'}
                    </span>
                </div>

                <p className="text-secondary">Status: <span style={{ color: 'white' }}>{status}</span></p>

                {coords && (
                    <p className="text-secondary text-sm mt-4">
                        Lat: {coords.latitude.toFixed(4)} <br />
                        Lng: {coords.longitude.toFixed(4)}
                    </p>
                )}
            </div>
        </div>
    );
}
