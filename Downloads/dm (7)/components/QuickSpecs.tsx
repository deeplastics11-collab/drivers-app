
import React, { useState, useEffect } from 'react';
import { getQuickSpecs } from '../services/geminiService';
import { AppView } from '../types';
import VoiceDictation from './VoiceDictation';
import BackButton from './BackButton';

interface QuickSpecsProps {
  onAction?: (view: AppView) => void;
  onBack?: () => void;
}

const QuickSpecs: React.FC<QuickSpecsProps> = ({ onAction, onBack }) => {
  const [vehicle, setVehicle] = useState('');
  const [loading, setLoading] = useState(false);
  const [specs, setSpecs] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('specs_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const saveToHistory = (v: string) => {
    const updated = [v, ...history.filter(h => h.toLowerCase() !== v.toLowerCase())].slice(0, 5);
    setHistory(updated);
    localStorage.setItem('specs_history', JSON.stringify(updated));
  };

  const handleFetch = async (v: string = vehicle) => {
    if (!v) return;
    setVehicle(v);
    setLoading(true);
    try {
      const data = await getQuickSpecs(v);
      setSpecs(data.text);
      saveToHistory(v);
    } catch (e: any) {
      setSpecs(e.message || "Failed to retrieve specs.");
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
            <i className="fa-solid fa-table-list text-amber-500"></i>
            Quick Specs
          </h2>
        </div>
      </div>

      <div className="p-6 space-y-6 animate-in fade-in duration-700 overflow-y-auto flex-1">
      <header className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-black text-white mb-1 flex items-center gap-3">
            <span className="text-amber-500">Quick</span> Specs
          </h2>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Instant Factory Clearances</p>
        </div>
        <div className="bg-slate-800/50 p-3 rounded-2xl border border-slate-700">
          <i className="fa-solid fa-list-check text-amber-500 text-xl"></i>
        </div>
      </header>

      <div className="bg-slate-800/40 p-1 rounded-3xl border border-slate-700 shadow-xl">
        <div className="flex flex-col p-4 gap-4">
          <div className="relative flex items-center group">
            <i className="fa-solid fa-car absolute left-4 text-slate-500 group-focus-within:text-amber-500 transition-colors"></i>
            <input 
              type="text" 
              placeholder="e.g. 2020 Honda Civic"
              value={vehicle}
              onChange={(e) => setVehicle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleFetch()}
              className="w-full bg-slate-900/80 border border-slate-700 rounded-2xl pl-11 pr-12 py-4 text-white focus:ring-2 focus:ring-amber-500/30 outline-none transition-all"
            />
            <VoiceDictation 
              onTranscript={(text) => {
                setVehicle(text);
                handleFetch(text);
              }}
              className="absolute right-3 p-2.5 rounded-xl hover:bg-slate-800 transition-colors"
            />
          </div>
          <button 
            onClick={() => handleFetch()}
            disabled={loading || !vehicle}
            className="w-full bg-amber-500 text-slate-900 py-4 rounded-2xl font-black uppercase tracking-widest text-xs active:scale-[0.97] transition-all disabled:opacity-50 shadow-xl shadow-amber-500/10 flex items-center justify-center gap-2"
          >
            {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <><i className="fa-solid fa-bolt"></i> Extract Specifications</>}
          </button>
        </div>
      </div>

      {!specs && history.length > 0 && (
        <div className="space-y-3 animate-in slide-in-from-left-4 duration-500">
          <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2 px-1">Recent Vehicles</h3>
          <div className="grid grid-cols-1 gap-2">
            {history.map((h, i) => (
              <button 
                key={i}
                onClick={() => handleFetch(h)}
                className="w-full p-4 bg-slate-800/30 border border-slate-700/50 rounded-2xl text-left hover:bg-slate-800 hover:border-amber-500/30 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-history text-slate-500 text-xs"></i>
                  <span className="text-sm font-bold text-slate-300 group-hover:text-white">{h}</span>
                </div>
                <i className="fa-solid fa-chevron-right text-slate-700 group-hover:text-amber-500 transition-colors"></i>
              </button>
            ))}
          </div>
        </div>
      )}

      {specs && (
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-4xl p-6 shadow-2xl animate-in fade-in slide-in-from-bottom-6 duration-700 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
             <i className="fa-solid fa-clipboard-check text-7xl text-amber-500"></i>
           </div>
           <div className="prose prose-invert prose-sm max-w-none prose-table:border prose-table:border-slate-800 prose-th:bg-slate-800/50 prose-th:p-3 prose-th:text-amber-500 prose-th:text-[10px] prose-th:font-black prose-th:uppercase prose-td:p-3 prose-td:border-b prose-td:border-slate-800/50 whitespace-pre-wrap text-slate-300 leading-relaxed">
              {specs}
           </div>
           <button 
            onClick={() => setSpecs(null)} 
            className="mt-6 w-full py-3 bg-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
           >
             Look up another vehicle
           </button>
        </div>
      )}

      {!specs && !loading && history.length === 0 && (
        <div className="grid grid-cols-2 gap-4 animate-in fade-in delay-300">
           <button 
              onClick={() => handleFetch("Common Oil Capacities")}
              className="p-6 bg-slate-800/20 rounded-3xl border border-slate-800 text-center flex flex-col items-center active:scale-95 transition-all hover:bg-slate-800/40"
           >
              <div className="bg-amber-500/10 p-4 rounded-2xl mb-4">
                <i className="fa-solid fa-oil-can text-amber-500 text-2xl"></i>
              </div>
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider">Oil Capacities</span>
           </button>
           <button 
              onClick={() => onAction ? onAction(AppView.TORQUE_SPECS) : handleFetch("Common Torque Data")}
              className="p-6 bg-slate-800/20 rounded-3xl border border-slate-800 text-center flex flex-col items-center active:scale-95 transition-all hover:bg-slate-800/40"
           >
              <div className="bg-blue-500/10 p-4 rounded-2xl mb-4">
                <i className="fa-solid fa-bolt-lightning text-blue-500 text-2xl"></i>
              </div>
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider">Torque Data</span>
           </button>
        </div>
      )}
      </div>
    </div>
  );
};

export default QuickSpecs;
