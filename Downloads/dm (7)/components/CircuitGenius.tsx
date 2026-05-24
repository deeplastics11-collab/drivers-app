import React, { useState } from 'react';
import { getGeminiResponse } from '../services/geminiService';
import BackButton from './BackButton';

interface CircuitGeniusProps {
  onBack?: () => void;
}

const CircuitGenius: React.FC<CircuitGeniusProps> = ({ onBack }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [logic, setLogic] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const prompt = `Act as a senior master auto electrician. Analyze the following wiring/electrical issue: "${query}". Provide: 1. A logical troubleshooting flow chart (text-based), 2. Expected voltage/resistance values at key connectors, 3. Possible ground point failures, 4. Common short-to-power or short-to-ground locations for this specific circuit. Use professional terminology (B+, 5V Ref, Signal Return, etc).`;
      const response = await getGeminiResponse(prompt);
      setLogic(response);
    } catch (e) {
      setLogic("Circuit analysis failed. Please provide more details.");
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
            <i className="fa-solid fa-microchip text-amber-500"></i>
            Circuit Logic
          </h2>
        </div>
      </div>

      <div className="p-6 space-y-6 overflow-y-auto flex-1">

      <div className="bg-slate-900 p-6 rounded-[2.5rem] border border-slate-800 shadow-2xl space-y-5">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Circuit Symptom or System</label>
            <textarea 
              placeholder="e.g. 2015 Silverdo Brake lights stay on. Replaced switch, still no fix. Likely a BCM or Ground issue?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-indigo-500 outline-none transition-all min-h-[120px] placeholder:text-slate-600"
            />
          </div>
        </div>
        <button 
          onClick={handleAnalyze}
          disabled={loading || !query}
          className="w-full bg-indigo-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-indigo-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          {loading ? <i className="fa-solid fa-bolt fa-spin"></i> : 'Analyze Circuit Path'}
        </button>
      </div>

      {logic && (
        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
          <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
            <span className="text-indigo-400 font-black text-[10px] uppercase tracking-widest">Logic Blueprint</span>
            <i className="fa-solid fa-wave-square text-slate-600"></i>
          </div>
          <div className="p-6 prose prose-invert prose-sm max-w-none text-slate-200 leading-relaxed whitespace-pre-wrap font-mono">
            {logic}
          </div>
          <button 
            onClick={() => setLogic(null)}
            className="w-full bg-slate-800/50 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest border-t border-slate-800/50 hover:text-white transition-colors"
          >
            Start New Logic Trace
          </button>
        </div>
      )}
      
      {!logic && (
        <div className="p-5 border border-dashed border-slate-800 rounded-2xl flex items-center gap-4 opacity-70">
           <i className="fa-solid fa-shield-bolt text-indigo-500"></i>
           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Uses adaptive electrical patterns to predict wiring fault locations.</p>
        </div>
      )}
      </div>
    </div>
  );
};

export default CircuitGenius;