'use client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in Next.js
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function MapInner({ locations }) {
    // Default center (e.g., somewhere neutral or the first driver's location)
    const defaultCenter = [51.505, -0.09];
    const center = locations.length > 0 ? [locations[0].lat, locations[0].lng] : defaultCenter;

    return (
        <MapContainer center={center} zoom={13} style={{ height: '500px', width: '100%', borderRadius: '12px' }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {locations.map((loc) => (
                <Marker key={loc.id} position={[loc.lat, loc.lng]}>
                    <Popup>
                        <strong>{loc.driver_name}</strong><br />
                        Last seen: {new Date(loc.timestamp).toLocaleTimeString()}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
