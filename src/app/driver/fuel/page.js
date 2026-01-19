'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function FuelForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.target);
        const data = {
            liters: parseFloat(formData.get('liters')),
            cost: parseFloat(formData.get('cost')),
            date: new Date().toISOString()
        };

        await fetch('/api/driver/fuel', {
            method: 'POST',
            body: JSON.stringify(data)
        });

        setLoading(false);
        router.push('/driver/dashboard');
    };

    return (
        <div className="container">
            <h2 className="mb-4">Fuel Log</h2>
            <form onSubmit={handleSubmit} className="card">
                <div className="input-group">
                    <label className="label">Liters Filled</label>
                    <input type="number" step="0.01" name="liters" className="input" placeholder="0.00" required />
                </div>

                <div className="input-group">
                    <label className="label">Total Cost ($)</label>
                    <input type="number" step="0.01" name="cost" className="input" placeholder="0.00" required />
                </div>

                <div className="input-group">
                    <label className="label">Receipt Photo (Optional)</label>
                    <input type="file" className="input" accept="image/*" />
                </div>

                <button type="submit" className="btn mt-4">
                    {loading ? 'Saving...' : 'Save Fuel Log'}
                </button>
            </form>
        </div>
    );
}
