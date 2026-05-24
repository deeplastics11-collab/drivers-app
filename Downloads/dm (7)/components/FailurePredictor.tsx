import React, { useState } from 'react';
import { getGeminiResponse } from '../services/geminiService';
import BackButton from './BackButton';

interface FailurePredictorProps {
  onBack?: () => void;
}

const FailurePredictor: React.FC<FailurePredictorProps> = ({ onBack }) => {
  const [vehicle, setVehicle] = useState('');
  const [kilometers, setKilometers] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<string | null>(null);

  const handlePredict = async () => {
    if (!vehicle || !kilometers) return;
    setLoading(true);
    try {
      const prompt = `Act as a master diagnostic strategist. For a ${vehicle} with ${kilometers} km, predict the next 5 likely component failures based on known pattern failures and high-wear trends. Provide: 1. Failure Probability (%), 2. Warning Signs (Sounds/Smells/Codes), 3. Preventive Maintenance Action, 4. Criticality Level. Importantly, each section of the report should have a brief explanation of what its use is so the user understands the context. Format as a professional technical outlook.`;
      const response = await getGeminiResponse(prompt);
      setReport(response);
    } catch (e) {
      setReport("Predictive analysis failed. Please refine your input.");
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
            <i className="fa-solid fa-chart-line text-amber-500"></i>
            Failure Prediction
          </h2>
          <p className="text-[10px] text-slate-400 mt-1 leading-tight text-wrap">
            Analyze known pattern failures and high-wear trends to predict the next likely component issues and prevent them.
          </p>
        </div>
      </div>

      <div className="p-6 space-y-6 overflow-y-auto flex-1">

      <div className="bg-slate-900 p-6 rounded-[2.5rem] border border-slate-800 shadow-2xl space-y-5">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-wrap">Vehicle Details</label>
            <input 
              type="text" 
              placeholder="e.g. 2014 Ford F-150 5.0L"
              value={vehicle}
              onChange={(e) => setVehicle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-rose-500 outline-none transition-all placeholder:text-slate-600"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-wrap">Current Kilometers</label>
            <input 
              type="number" 
              placeholder="e.g. 125000"
              value={kilometers}
              onChange={(e) => setKilometers(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-rose-500 outline-none transition-all placeholder:text-slate-600"
            />
          </div>
        </div>
        <button 
          onClick={handlePredict}
          disabled={loading || !vehicle || !kilometers}
          className="w-full bg-rose-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-rose-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          {loading ? <i className="fa-solid fa-radar fa-spin"></i> : 'Run Predictive Scan'}
        </button>
      </div>

      {report && (
        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
          <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
            <span className="text-rose-400 font-black text-[10px] uppercase tracking-widest">Failure Probability Matrix</span>
            <i className="fa-solid fa-microchip text-slate-500"></i>
          </div>
          <div className="p-6 prose prose-invert prose-sm max-w-none text-slate-200 leading-relaxed whitespace-pre-wrap">
            {report}
          </div>
          <button 
            onClick={() => setReport(null)}
            className="w-full bg-slate-800/50 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest border-t border-slate-800/50 hover:text-white transition-colors"
          >
            New Analysis
          </button>
        </div>
      )}
      </div>
    </div>
  );
};

export default FailurePredictor;