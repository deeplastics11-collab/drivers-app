import React, { useState } from 'react';
import { getGeminiResponse } from '../services/geminiService';
import BackButton from './BackButton';

interface PrecisionSpecsProps {
  onBack?: () => void;
}

const PrecisionSpecs: React.FC<PrecisionSpecsProps> = ({ onBack }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [specs, setSpecs] = useState<string | null>(null);

  const handleFetch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const prompt = `Act as a master engine builder. Provide the exact torque sequence and patterns for: ${query}. Include: 1. Step-by-step Torque values (e.g. Step 1: 30Nm, Step 2: 60Nm, Step 3: +90 degrees), 2. Visual ASCII or description of the sequence (e.g. 1-10 numbering pattern), 3. Critical pre-installation checks (clean threads, oiling bolts, etc). Be extremely precise.`;
      const response = await getGeminiResponse(prompt);
      setSpecs(response);
    } catch (e) {
      setSpecs("Failed to retrieve sequences. Please be more specific.");
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
            <i className="fa-solid fa-bullseye text-amber-500"></i>
            Sequence Pro
          </h2>
        </div>
      </div>

      <div className="p-6 space-y-6 overflow-y-auto flex-1">

      <div className="bg-slate-900 p-6 rounded-[2.5rem] border border-slate-800 shadow-2xl space-y-5">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Engine / Component</label>
            <textarea 
              placeholder="e.g. 2012 BMW N55 Cylinder Head Bolts or 2018 Silverado Intake Manifold"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-sky-500 outline-none transition-all min-h-25 placeholder:text-slate-600"
            />
          </div>
        </div>
        <button 
          onClick={handleFetch}
          disabled={loading || !query}
          className="w-full bg-sky-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-sky-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          {loading ? <i className="fa-solid fa-wrench fa-spin"></i> : 'Retrieve Sequence'}
        </button>
      </div>

      {specs && (
        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
          <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
            <span className="text-sky-400 font-black text-[10px] uppercase tracking-widest">Master Assembly Data</span>
            <i className="fa-solid fa-list-ol text-slate-500"></i>
          </div>
          <div className="p-6 prose prose-invert prose-sm max-w-none text-slate-200 leading-relaxed whitespace-pre-wrap font-mono">
            {specs}
          </div>
          <button 
            onClick={() => setSpecs(null)}
            className="w-full bg-slate-800/50 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest border-t border-slate-800/50 hover:text-white transition-colors"
          >
            New Component
          </button>
        </div>
      )}
      </div>
    </div>
  );
};

export default PrecisionSpecs;