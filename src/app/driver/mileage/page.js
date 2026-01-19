'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MileageForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.target);
        const data = {
            start_km: parseInt(formData.get('start_km')),
            end_km: parseInt(formData.get('end_km')),
            date: new Date().toISOString()
        };

        if (data.end_km < data.start_km) {
            alert('End KM cannot be less than Start KM');
            setLoading(false);
            return;
        }

        await fetch('/api/driver/mileage', {
            method: 'POST',
            body: JSON.stringify(data)
        });

        setLoading(false);
        router.push('/driver/dashboard');
    };

    return (
        <div className="container">
            <h2 className="mb-4">Mileage Log</h2>
            <form onSubmit={handleSubmit} className="card">
                <div className="input-group">
                    <label className="label">Start KM</label>
                    <input type="number" name="start_km" className="input" placeholder="e.g. 120500" required />
                </div>

                <div className="input-group">
                    <label className="label">End KM</label>
                    <input type="number" name="end_km" className="input" placeholder="e.g. 120650" required />
                </div>

                <button type="submit" className="btn mt-4">
                    {loading ? 'Saving...' : 'Submit Log'}
                </button>
            </form>
        </div>
    );
}
