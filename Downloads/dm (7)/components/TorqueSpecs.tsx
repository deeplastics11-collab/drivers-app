
import React, { useState, useEffect } from 'react';
import { getTorqueSpecs } from '../services/geminiService';
import VoiceDictation from './VoiceDictation';
import BackButton from './BackButton';

interface TorqueSpecsProps {
  onBack?: () => void;
}

const TorqueSpecs: React.FC<TorqueSpecsProps> = ({ onBack }) => {
  const [vehicle, setVehicle] = useState('');
  const [component, setComponent] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [history, setHistory] = useState<{vehicle: string, component: string}[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('torque_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const saveToHistory = (v: string, c: string) => {
    const newItem = { vehicle: v, component: c };
    const updated = [newItem, ...history.filter(h => !(h.vehicle === v && h.component === c))].slice(0, 5);
    setHistory(updated);
    localStorage.setItem('torque_history', JSON.stringify(updated));
  };

  const handleFetch = async (v: string = vehicle, c: string = component) => {
    if (!v || !c) return;
    setVehicle(v);
    setComponent(c);
    setLoading(true);
    try {
      const data = await getTorqueSpecs(v, c);
      setResult(data.text);
      saveToHistory(v, c);
    } catch (e: any) {
      setResult(e.message || "Failed to retrieve torque specifications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950">
      {/* Header with back button */}
      <div className="shrink-0 px-6 pt-4 pb-4 bg-slate-950 border-b border-slate-900 flex items-center gap-3">
        {onBack && <BackButton onClick={onBack} />}
        <div className="min-w-0">
          <h2 className="text-base font-black text-white uppercase tracking-tight leading-none flex items-center gap-2">
            <i className="fa-solid fa-wrench text-amber-500"></i>
            Torque Master
          </h2>
        </div>
      </div>

      <div className="p-6 space-y-6 animate-in fade-in duration-700 overflow-y-auto flex-1">

      <div className="bg-slate-800/40 p-1 rounded-3xl border border-slate-700 shadow-xl">
        <div className="flex flex-col p-4 gap-4">
          <div className="relative flex items-center group">
            <i className="fa-solid fa-car absolute left-4 text-slate-500 group-focus-within:text-blue-500 transition-colors"></i>
            <input 
              type="text" 
              placeholder="Vehicle (e.g. 2018 Ford F-150 5.0L)"
              value={vehicle}
              onChange={(e) => setVehicle(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-700 rounded-2xl pl-11 pr-4 py-4 text-white focus:ring-2 focus:ring-blue-500/30 outline-none transition-all"
            />
          </div>
          
          <div className="relative flex items-center group">
            <i className="fa-solid fa-gears absolute left-4 text-slate-500 group-focus-within:text-blue-500 transition-colors"></i>
            <input 
              type="text" 
              placeholder="Component (e.g. Cylinder Head Bolts)"
              value={component}
              onChange={(e) => setComponent(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleFetch()}
              className="w-full bg-slate-900/80 border border-slate-700 rounded-2xl pl-11 pr-12 py-4 text-white focus:ring-2 focus:ring-blue-500/30 outline-none transition-all"
            />
            <VoiceDictation 
              onTranscript={(text) => {
                setComponent(text);
                if (vehicle) handleFetch(vehicle, text);
              }}
              className="absolute right-3 p-2.5 rounded-xl hover:bg-slate-800 transition-colors"
            />
          </div>

          <button 
            onClick={() => handleFetch()}
            disabled={loading || !vehicle || !component}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs active:scale-[0.97] transition-all disabled:opacity-50 shadow-xl shadow-blue-500/10 flex items-center justify-center gap-2"
          >
            {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <><i className="fa-solid fa-magnifying-glass"></i> Get Torque Specs</>}
          </button>
        </div>
      </div>

      {!result && history.length > 0 && (
        <div className="space-y-3 animate-in slide-in-from-left-4 duration-500">
          <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2 px-1">Recent Lookups</h3>
          <div className="grid grid-cols-1 gap-2">
            {history.map((h, i) => (
              <button 
                key={i}
                onClick={() => handleFetch(h.vehicle, h.component)}
                className="w-full p-4 bg-slate-800/30 border border-slate-700/50 rounded-2xl text-left hover:bg-slate-800 hover:border-blue-500/30 transition-all flex items-center justify-between group"
              >
                <div className="flex flex-col">
                  <span className="text-xs font-black text-blue-500 uppercase tracking-tighter">{h.component}</span>
                  <span className="text-sm font-bold text-slate-300 group-hover:text-white">{h.vehicle}</span>
                </div>
                <i className="fa-solid fa-chevron-right text-slate-700 group-hover:text-blue-500 transition-colors"></i>
              </button>
            ))}
          </div>
        </div>
      )}

      {result && (
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-4xl p-6 shadow-2xl animate-in fade-in slide-in-from-bottom-6 duration-700 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
             <i className="fa-solid fa-wrench text-7xl text-blue-500"></i>
           </div>
           <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap text-slate-300 leading-relaxed">
              {result}
           </div>
           <button 
            onClick={() => setResult(null)} 
            className="mt-6 w-full py-3 bg-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
           >
             New Lookup
           </button>
        </div>
      )}

      {!result && !loading && (
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-slate-800/20 rounded-2xl border border-slate-800/50">
            <i className="fa-solid fa-circle-info text-blue-500 mb-2"></i>
            <p className="text-[10px] text-slate-500 leading-tight">Always verify TTY (Torque-to-Yield) status before reusing fasteners.</p>
          </div>
          <div className="p-4 bg-slate-800/20 rounded-2xl border border-slate-800/50">
            <i className="fa-solid fa-triangle-exclamation text-amber-500 mb-2"></i>
            <p className="text-[10px] text-slate-500 leading-tight">Incorrect torque can lead to component failure or safety hazards.</p>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default TorqueSpecs;
