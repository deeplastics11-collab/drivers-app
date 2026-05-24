
import React, { useState } from 'react';
import { getComponentTestSteps } from '../services/geminiService';
import VoiceDictation from './VoiceDictation';
import BackButton from './BackButton';

interface ComponentTesterProps {
  onBack?: () => void;
}

const ComponentTester: React.FC<ComponentTesterProps> = ({ onBack }) => {
  const [component, setComponent] = useState('');
  const [loading, setLoading] = useState(false);
  const [steps, setSteps] = useState<string | null>(null);

  const handleFetchSteps = async (val: string = component) => {
    if (!val) return;
    setComponent(val);
    setLoading(true);
    try {
      const data = await getComponentTestSteps(val);
      setSteps(data);
    } catch (e) {
      setSteps("Failed to fetch test procedures.");
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
            <i className="fa-solid fa-gauge text-amber-500"></i>
            Test Lab
          </h2>
        </div>
      </div>

      <div className="p-6 space-y-6 animate-in fade-in duration-500 overflow-y-auto flex-1">

      <div className="bg-slate-800/40 p-1 rounded-3xl border border-slate-700 shadow-xl">
        <div className="flex flex-col p-4 gap-4">
          <div className="relative flex items-center">
            <i className="fa-solid fa-plug absolute left-4 text-slate-500"></i>
            <input 
              type="text" 
              placeholder="e.g. 2012 BMW 328i MAF Sensor"
              value={component}
              onChange={(e) => setComponent(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-700 rounded-2xl pl-11 pr-12 py-4 text-white focus:ring-2 focus:ring-amber-500/30 outline-none"
            />
            <VoiceDictation 
              onTranscript={(t) => {
                setComponent(t);
                handleFetchSteps(t);
              }}
              className="absolute right-3 p-2.5 rounded-xl hover:bg-slate-800 transition-colors"
            />
          </div>
          <button 
            onClick={() => handleFetchSteps()}
            disabled={loading || !component}
            className="w-full bg-amber-500 text-slate-900 py-4 rounded-2xl font-black uppercase tracking-widest text-xs active:scale-[0.97] transition-all disabled:opacity-50"
          >
            {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : 'Load Test Procedure'}
          </button>
        </div>
      </div>

      {steps && (
        <div className="space-y-4 animate-in slide-in-from-bottom-6 duration-700">
           <div className="bg-slate-900/80 border border-slate-800 rounded-[2rem] p-6 shadow-2xl">
             <div className="flex items-center gap-3 mb-4">
               <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-500">
                 <i className="fa-solid fa-magnifying-glass-chart"></i>
               </div>
               <h3 className="text-sm font-black text-white uppercase tracking-widest">Pinout & Test Spec</h3>
             </div>
             <div className="prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed whitespace-pre-wrap">
                {steps}
             </div>
           </div>

           <div className="grid grid-cols-2 gap-3">
             <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-800 text-center">
               <i className="fa-solid fa-bolt text-amber-500/40 mb-2"></i>
               <p className="text-[10px] font-black text-slate-500 uppercase">Input Voltage</p>
             </div>
             <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-800 text-center">
               <i className="fa-solid fa-wave-square text-blue-500/40 mb-2"></i>
               <p className="text-[10px] font-black text-slate-500 uppercase">Duty Cycle</p>
             </div>
           </div>
        </div>
      )}

      {!steps && !loading && (
        <div className="flex flex-col items-center py-12 text-center space-y-4 opacity-40">
           <i className="fa-solid fa-microchip text-5xl text-slate-700"></i>
           <p className="text-xs text-slate-500 max-w-[200px]">Search for any electrical component to see its test procedure.</p>
        </div>
      )}
      </div>
    </div>
  );
};

export default ComponentTester;
