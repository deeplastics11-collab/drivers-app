import React, { useState } from 'react';
import { getGeminiResponse } from '../services/geminiService';
import BackButton from './BackButton';

interface DiagnosticsProps {
  onBack?: () => void;
}

const Diagnostics: React.FC<DiagnosticsProps> = ({ onBack }) => {
  const [code, setCode] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLookup = async () => {
    if (!code) return;
    setLoading(true);
    try {
      const prompt = `Provide a detailed diagnostic breakdown for the OBD-II code: ${code}. Include meaning, common symptoms, possible causes (ordered by probability), and suggested repair steps. Keep it professional and technical.`;
      const response = await getGeminiResponse(prompt);
      setResult(response);
    } catch (e: any) {
      setResult(e.message || "Could not fetch information for this code.");
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
            <i className="fa-solid fa-barcode text-amber-500"></i>
            DTC Library
          </h2>
        </div>
      </div>

      <div className="p-6 space-y-8 animate-in fade-in duration-500 overflow-y-auto flex-1">
        <div>
        <div className="w-14 h-14 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center mb-4 border border-rose-500/20">
            <i className="fa-solid fa-barcode text-2xl"></i>
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight leading-none mb-2">Code Scanner Aid</h2>
        <p className="text-slate-400 text-sm leading-relaxed">Enter a DTC to get a professional breakdown and troubleshooting steps.</p>
        </div>

      <div className="bg-slate-900 p-2 rounded-4xl border border-slate-800 shadow-2xl">
        <div className="flex items-center p-1">
          <input 
            id="dtc-input"
            type="text" 
            placeholder="P0420"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="flex-1 bg-transparent rounded-2xl px-5 py-4 text-white font-black text-xl placeholder:text-slate-600 outline-none uppercase"
          />
          <button 
            onClick={handleLookup}
            disabled={loading || !code}
            className="bg-amber-500 text-slate-950 w-16 h-16 rounded-2xl flex items-center justify-center font-bold active:scale-95 transition-all disabled:opacity-30 shadow-lg shadow-amber-500/20"
          >
            {loading ? <i className="fa-solid fa-spinner fa-spin text-xl"></i> : <i className="fa-solid fa-magnifying-glass text-xl"></i>}
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-slate-950/80 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
            <span className="text-white font-black text-sm uppercase tracking-tight">{code} Report</span>
            <button onClick={() => setResult(null)} className="text-slate-400 hover:text-white transition-colors">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div className="p-6 text-slate-200 text-sm leading-relaxed whitespace-pre-wrap max-h-112.5 overflow-y-auto">
            {result}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Quick References</h3>
        <div className="grid grid-cols-1 gap-3">
          {[
            { id: 'P', label: 'Powertrain', sub: 'Engine & Drive', color: 'amber' },
            { id: 'B', label: 'Body', sub: 'Safety & Comfort', color: 'sky' },
            { id: 'C', label: 'Chassis', sub: 'Braking & Steering', color: 'emerald' },
          ].map((ref) => (
            <button 
              key={ref.id} 
              onClick={() => {
                setCode(ref.id);
                document.getElementById('dtc-input')?.focus();
              }}
              className="w-full p-4 bg-slate-900/50 rounded-2xl border border-slate-800 flex items-center justify-between group shadow-sm hover:border-slate-700 transition-colors active:scale-95 text-left"
            >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 bg-${ref.color}-500/10 text-${ref.color}-400 rounded-xl flex items-center justify-center font-black text-lg border border-${ref.color}-500/20`}>
                    {ref.id}
                  </div>
                  <div>
                    <p className="text-sm font-black text-white uppercase tracking-tight">{ref.label} Codes</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{ref.sub}</p>
                  </div>
                </div>
                <i className="fa-solid fa-chevron-right text-slate-600"></i>
            </button>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
};

export default Diagnostics;