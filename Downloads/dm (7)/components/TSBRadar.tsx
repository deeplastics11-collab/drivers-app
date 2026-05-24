
import React, { useState } from 'react';
import { searchTSBs } from '../services/geminiService';
import BackButton from './BackButton';

interface TSBRadarProps {
  onBack?: () => void;
}

const TSBRadar: React.FC<TSBRadarProps> = ({ onBack }) => {
  const [vehicle, setVehicle] = useState('');
  const [problem, setProblem] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ text: string, sources: any[] } | null>(null);

  const handleSearch = async () => {
    if (!vehicle || !problem) return;
    setLoading(true);
    try {
      const data = await searchTSBs(vehicle, problem);
      if (!data || !data.text || data.text.trim().length === 0) {
        setResult({ text: "No TSBs or pattern failures were found linking to this specific symptom.", sources: [] });
      } else {
        setResult(data);
      }
    } catch (e: any) {
      console.error(e);
      setResult({ text: e.message || "Failed to search for TSBs. No results found.", sources: [] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950">
      <div className="shrink-0 px-6 pt-4 pb-4 bg-slate-950 border-b border-slate-900 flex items-center gap-3">
        {onBack && <BackButton onClick={onBack} />}
        <div className="min-w-0">
          <h2 className="text-base font-black text-white uppercase tracking-tight leading-none flex items-center gap-2">
            <i className="fa-solid fa-tower-broadcast text-amber-500"></i>
            TSB Radar
          </h2>
        </div>
      </div>

      <div className="p-6 space-y-6 animate-in fade-in duration-500 overflow-y-auto flex-1">

      <div className="bg-slate-800/40 p-6 rounded-3xl border border-slate-700 shadow-xl space-y-4">
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Vehicle Info</label>
          <input 
            type="text" 
            placeholder="e.g. 2015 Ford F-150 3.5L Ecoboost"
            value={vehicle}
            onChange={(e) => setVehicle(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-amber-500/30 outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Symptom/Problem</label>
          <input 
            type="text" 
            placeholder="e.g. Cold start rattle"
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-amber-500/30 outline-none"
          />
        </div>
        <button 
          onClick={handleSearch}
          disabled={loading || !vehicle || !problem}
          className="w-full bg-amber-500 text-slate-900 py-4 rounded-2xl font-black uppercase tracking-widest text-xs active:scale-95 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
        >
          {loading ? <i className="fa-solid fa-radar fa-spin"></i> : 'Scan For TSBs & Pattern Failures'}
        </button>

        {loading && (
          <div className="space-y-2 mt-4 animate-in fade-in">
            <div className="flex justify-between items-center px-1">
              <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest animate-pulse">Running Deep Scan...</span>
              <span className="text-[10px] font-bold text-slate-500">Searching records</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
               <div className="bg-amber-500 h-1.5 rounded-full w-full origin-left animate-pulse transition-all duration-1000"></div>
            </div>
          </div>
        )}
      </div>

      {result && !loading && (
        <div className="space-y-6 animate-in slide-in-from-bottom-6 duration-700">
           <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none rotate-12">
               <i className="fa-solid fa-triangle-exclamation text-7xl text-amber-500"></i>
             </div>
             <h3 className="text-amber-500 font-black mb-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em]">
               <i className="fa-solid fa-file-contract"></i> Deep Search Findings
             </h3>
             <div className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
                {result.text}
             </div>
           </div>

           {result.sources.length > 0 && (
             <div className="space-y-3">
                <h4 className="text-slate-500 text-[10px] font-black uppercase tracking-widest px-1">Source Documentation</h4>
                {result.sources.map((s, i) => (
                  <a 
                    key={i} 
                    href={s.web.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-slate-800/40 border border-slate-800 rounded-2xl group hover:border-amber-500/30 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-slate-900 p-2 rounded-lg text-amber-500 group-hover:bg-amber-500 group-hover:text-slate-900 transition-all">
                        <i className="fa-solid fa-link text-xs"></i>
                      </div>
                      <p className="text-xs font-bold text-white group-hover:text-amber-500 truncate max-w-50">{s.web.title}</p>
                    </div>
                    <i className="fa-solid fa-chevron-right text-slate-700 group-hover:text-amber-500 transition-all"></i>
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

export default TSBRadar;
