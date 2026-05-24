import React, { useState, useEffect } from 'react';
import { Geolocation } from '@capacitor/geolocation';
import { getNearbyShops } from '../services/geminiService';

interface NearbyShopsProps {
  onBack?: () => void;
}

const NearbyShops: React.FC<NearbyShopsProps> = ({ onBack }) => {
  const [query, setQuery] = useState('Machine shops');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ text: string; chunks: any[] } | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | undefined>();

  useEffect(() => {
    const requestLocation = async () => {
      try {
        const permission = await Geolocation.requestPermissions();
        if (permission.location === 'granted' || permission.coarseLocation === 'granted') {
          const pos = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
          setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        } else {
          setError("Location access denied. Please enable location to find nearby shops.");
        }
      } catch (err) {
        console.error("Geolocation error", err);
        setError("Location access denied. Please enable location to find nearby shops.");
      }
    };
    requestLocation();
  }, []);

  const handleSearch = async (q: string) => {
    setQuery(q);
    setLoading(true);
    setError(null);
    try {
      const data = await getNearbyShops(q, location);
      setResult(data);
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Failed to search for nearby shops.");
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'parts', label: 'Parts Stores', icon: 'fa-box-open' },
    { id: 'machine', label: 'Machine Shops', icon: 'fa-gears' },
    { id: 'transmission', label: 'Trans Shops', icon: 'fa-cogs' },
    { id: 'electrical', label: 'Electrical/Electronics', icon: 'fa-bolt' },
    { id: 'food', label: 'Food', icon: 'fa-utensils' },
    { id: 'accommodation', label: 'Accommodation', icon: 'fa-bed' },
    { id: 'towing', label: 'Towing', icon: 'fa-truck-pickup' }
  ];

  return (
    <div className="flex flex-col h-full bg-slate-950">

      {/* FIXED HEADER + CATEGORIES */}
      <div className="shrink-0 px-6 pt-4 pb-4 bg-slate-950 border-b border-slate-900 space-y-4">
        {/* Back button + title */}
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="w-10 h-10 bg-amber-500 text-slate-950 rounded-2xl flex items-center justify-center active:scale-90 transition-all shadow-lg shadow-amber-500/20 shrink-0"
              aria-label="Go back"
            >
              <i className="fa-solid fa-chevron-left text-base"></i>
            </button>
          )}
          <div className="min-w-0">
            <h2 className="text-base font-black text-white uppercase tracking-tight leading-none flex items-center gap-2">
              <i className="fa-solid fa-location-dot text-amber-500"></i>
              Nearby Resources
            </h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1 truncate">
              {location ? 'Location acquired' : 'Acquiring location...'}
            </p>
          </div>
        </div>

        {/* Category grid — always visible */}
        <div className="grid grid-cols-2 gap-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleSearch(cat.label)}
              className={`flex items-center gap-2 p-3 rounded-2xl border transition-all active:scale-95 text-left ${
                query === cat.label && !loading
                  ? 'bg-amber-500 border-amber-400 text-slate-950'
                  : 'bg-slate-900 border-slate-800 text-white hover:border-amber-500/30'
              }`}
            >
              <div className={`p-1.5 rounded-lg shrink-0 ${
                query === cat.label && !loading ? 'bg-slate-950/20 text-slate-950' : 'bg-amber-500/10 text-amber-500'
              }`}>
                <i className={`fa-solid ${cat.icon} text-xs`}></i>
              </div>
              <span className="text-[10px] font-black uppercase truncate">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* SCROLLABLE RESULTS */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
            <p className="text-amber-500 text-xs font-bold uppercase animate-pulse">Scanning Area...</p>
          </div>
        )}

        {error && (
          <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-center space-y-3">
            <i className="fa-solid fa-triangle-exclamation text-red-500 text-2xl"></i>
            <p className="text-red-500 text-sm font-medium leading-relaxed">{error}</p>
          </div>
        )}

        {!result && !loading && !error && (
          <div className="flex flex-col items-center justify-center py-16 space-y-3 opacity-40">
            <i className="fa-solid fa-map-location-dot text-4xl text-slate-600"></i>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Select a category above</p>
          </div>
        )}

        {result && !loading && (
          <div className="space-y-4 animate-in fade-in duration-500">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <h3 className="text-amber-500 font-black mb-3 flex items-center gap-2 text-[10px] uppercase tracking-widest">
                <i className="fa-solid fa-map-pin"></i> Recommendations for {query}
              </h3>
              <p className="text-slate-300 text-xs leading-relaxed">{result.text}</p>
            </div>

            {result.chunks.filter((c: any) => c.maps).length > 0 && (
              <div className="space-y-2">
                <h4 className="text-slate-600 text-[10px] font-black uppercase tracking-widest">Locations Found</h4>
                {result.chunks.filter((c: any) => c.maps).map((chunk: any, idx: number) => (
                  <a
                    key={idx}
                    href={chunk.maps.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-3 p-4 bg-slate-900/60 border border-slate-800 rounded-2xl active:bg-slate-800 transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 bg-amber-500 rounded-xl flex items-center justify-center text-slate-950 shrink-0">
                        <i className="fa-solid fa-store text-sm"></i>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-black text-white truncate group-hover:text-amber-500 transition-colors">{chunk.maps.title}</p>
                        <p className="text-[9px] text-slate-600 font-bold uppercase mt-0.5">Open in Google Maps</p>
                      </div>
                    </div>
                    <i className="fa-solid fa-chevron-right text-slate-700 shrink-0"></i>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NearbyShops;
