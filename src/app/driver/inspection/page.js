'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function InspectionForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.target);
        const data = {
            tires_ok: formData.get('tires') === 'on',
            lights_ok: formData.get('lights') === 'on',
            brakes_ok: formData.get('brakes') === 'on',
            fluids_ok: formData.get('fluids') === 'on',
            notes: formData.get('notes'),
            date: new Date().toISOString()
        };

        // Simulate API call
        await fetch('/api/driver/inspection', {
            method: 'POST',
            body: JSON.stringify(data)
        });

        setLoading(false);
        router.push('/driver/dashboard');
    };

    return (
        <div className="container">
            <h2 className="mb-4">Daily Inspection</h2>
            <form onSubmit={handleSubmit}>
                <div className="card">
                    <h3 style={{ fontSize: '1rem' }}>Vehicle Check</h3>

                    {['tires', 'lights', 'brakes', 'fluids'].map((item) => (
                        <div key={item} className="input-group" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #ffffff10' }}>
                            <label style={{ textTransform: 'capitalize' }}>{item} OK?</label>
                            <input type="checkbox" name={item} style={{ transform: 'scale(1.5)' }} defaultChecked />
                        </div>
                    ))}

                    <div className="input-group mt-4">
                        <label className="label">Notes / Issues</label>
                        <textarea name="notes" className="input" rows="3" placeholder="Describe any damage..."></textarea>
                    </div>
                </div>

                <button type="submit" className="btn" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Inspection'}
                </button>
            </form>
        </div>
    );
}
