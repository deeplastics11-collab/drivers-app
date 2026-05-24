import React, { useState } from 'react';
import { getGeminiResponse } from '../services/geminiService';
import BackButton from './BackButton';

interface LaborEstimatorProps {
  onBack?: () => void;
}

const LaborEstimator: React.FC<LaborEstimatorProps> = ({ onBack }) => {
  const [vehicle, setVehicle] = useState('');
  const [job, setJob] = useState('');
  const [loading, setLoading] = useState(false);
  const [estimate, setEstimate] = useState<string | null>(null);

  const handleEstimate = async () => {
    if (!vehicle || !job) return;
    setLoading(true);
    try {
      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const prompt = `Act as a professional flat-rate labor manual. Provide a detailed labor estimate for: ${job} on a ${vehicle}. Include: 1. Estimated Labor Hours (Flat Rate), 2. Essential Parts List, 3. Specialized Tools Needed, 4. Difficulty Rating (1-10). Keep it purely technical and formatted as a professional shop quote. VERY IMPORTANT: Detect the user's local currency based on this timezone: ${userTimeZone}, and provide all pricing/cost estimates strictly using their local currency symbol and standard local rates.`;
      const response = await getGeminiResponse(prompt);
      setEstimate(response);
    } catch (e) {
      setEstimate("Estimation failed. Please refine your input.");
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
            <i className="fa-solid fa-calculator text-amber-500"></i>
            Smart Labour
          </h2>
        </div>
      </div>

      <div className="p-6 space-y-6 bg-slate-950 overflow-y-auto flex-1 animate-in fade-in duration-500">

      <div className="bg-slate-900 p-6 rounded-[2.5rem] border border-slate-800 shadow-2xl space-y-5">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Vehicle Info</label>
            <input 
              type="text" 
              placeholder="e.g. 2017 Mercedes-Benz C300"
              value={vehicle}
              onChange={(e) => setVehicle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-amber-500 outline-none transition-all placeholder:text-slate-600"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Job Description</label>
            <textarea 
              placeholder="e.g. Replace turbocharger and associated gaskets"
              value={job}
              onChange={(e) => setJob(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-amber-500 outline-none transition-all min-h-25 placeholder:text-slate-600"
            />
          </div>
        </div>
        <button 
          onClick={handleEstimate}
          disabled={loading || !vehicle || !job}
          className="w-full bg-amber-500 text-slate-950 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          {loading ? <i className="fa-solid fa-cog fa-spin"></i> : 'Generate Labour Quote'}
        </button>
      </div>

      {estimate && (
        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
          <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
            <span className="text-amber-500 font-black text-[10px] uppercase tracking-widest">Technical Quote</span>
            <i className="fa-solid fa-file-invoice-dollar text-slate-500"></i>
          </div>
          <div className="p-6 prose prose-invert prose-sm max-w-none text-slate-200 leading-relaxed whitespace-pre-wrap">
            {estimate}
          </div>
          <button 
            onClick={() => setEstimate(null)}
            className="w-full bg-slate-800/50 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest border-t border-slate-800/50 hover:text-white transition-colors"
          >
            New Estimation
          </button>
        </div>
      )}
      </div>
    </div>
  );
};

export default LaborEstimator;