import React, { useState } from 'react';
import { getGeminiResponse } from '../services/geminiService';
import BackButton from './BackButton';

interface ADASGuideProps {
  onBack?: () => void;
}

const ADASGuide: React.FC<ADASGuideProps> = ({ onBack }) => {
  const [vehicle, setVehicle] = useState('');
  const [repair, setRepair] = useState('');
  const [loading, setLoading] = useState(false);
  const [guidance, setGuidance] = useState<string | null>(null);

  const handleFetch = async () => {
    if (!vehicle || !repair) return;
    setLoading(true);
    try {
      const prompt = `Act as a certified ADAS specialist. For a ${vehicle} after a ${repair}, determine: 1. Which ADAS sensors require calibration (Radar, Camera, Ultrasonic), 2. Static vs Dynamic calibration requirements, 3. Specialized targets or road conditions needed, 4. Critical DTCs that prevent calibration. Be technical and safety-focused.`;
      const response = await getGeminiResponse(prompt);
      setGuidance(response);
    } catch (e) {
      setGuidance("Failed to retrieve ADAS requirements.");
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
            <i className="fa-solid fa-eye text-amber-500"></i>
            ADAS Calibrator
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
              placeholder="e.g. 2021 Toyota Camry with TSS 2.5"
              value={vehicle}
              onChange={(e) => setVehicle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-emerald-500 outline-none transition-all placeholder:text-slate-600"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Repair Performed</label>
            <textarea 
              placeholder="e.g. Windshield replacement or Front bumper removal"
              value={repair}
              onChange={(e) => setRepair(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-emerald-500 outline-none transition-all min-h-[100px] placeholder:text-slate-600"
            />
          </div>
        </div>
        <button 
          onClick={handleFetch}
          disabled={loading || !vehicle || !repair}
          className="w-full bg-emerald-500 text-slate-950 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          {loading ? <i className="fa-solid fa-eye fa-spin"></i> : 'Identify Calibration Needs'}
        </button>
      </div>

      {guidance && (
        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
          <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
            <span className="text-emerald-400 font-black text-[10px] uppercase tracking-widest">Safety System Guidance</span>
            <i className="fa-solid fa-shield-halved text-slate-500"></i>
          </div>
          <div className="p-6 prose prose-invert prose-sm max-w-none text-slate-200 leading-relaxed whitespace-pre-wrap">
            {guidance}
          </div>
          <button 
            onClick={() => setGuidance(null)}
            className="w-full bg-slate-800/50 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest border-t border-slate-800/50 hover:text-white transition-colors"
          >
            New Assessment
          </button>
        </div>
      )}
      </div>
    </div>
  );
};

export default ADASGuide;