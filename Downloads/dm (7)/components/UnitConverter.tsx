
import React, { useState } from 'react';
import BackButton from './BackButton';

interface UnitConverterProps {
  onBack?: () => void;
}

const UnitConverter: React.FC<UnitConverterProps> = ({ onBack }) => {
  const [val, setVal] = useState<string>('');
  const [mode, setMode] = useState<'T' | 'P' | 'L' | 'TEMP'>('T'); // Torque, Pressure, Length, Temp

  const convert = (v: string) => {
    const n = parseFloat(v);
    if (isNaN(n)) return { a: '0', b: '0' };
    switch (mode) {
      case 'T': return { a: `${n} Nm`, b: `${(n * 0.73756).toFixed(1)} lb-ft` };
      case 'P': return { a: `${n} PSI`, b: `${(n / 14.5038).toFixed(2)} Bar` };
      case 'L': return { a: `${n} mm`, b: `${(n / 25.4).toFixed(3)} in` };
      case 'TEMP': return { a: `${n} °C`, b: `${((n * 9/5) + 32).toFixed(1)} °F` };
    }
  };

  const results = convert(val);

  return (
    <div className="flex flex-col h-full bg-slate-950">
      {/* Header with back button */}
      <div className="shrink-0 px-6 pt-4 pb-4 bg-slate-950 border-b border-slate-900 flex items-center gap-3">
        {onBack && <BackButton onClick={onBack} />}
        <div className="min-w-0">
          <h2 className="text-base font-black text-white uppercase tracking-tight leading-none flex items-center gap-2">
            <i className="fa-solid fa-ruler-combined text-amber-500"></i>
            Converter
          </h2>
        </div>
      </div>

      <div className="p-6 space-y-6 overflow-y-auto flex-1">
      <header>
        <h2 className="text-2xl font-bold text-white mb-2">Unit Converter</h2>
        <p className="text-slate-400 text-sm">Quick reference for torque, pressure, and more.</p>
      </header>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {[
          { id: 'T', icon: 'fa-rotate-right', label: 'Torque' },
          { id: 'P', icon: 'fa-gauge-high', label: 'Pressure' },
          { id: 'L', icon: 'fa-ruler-combined', label: 'Length' },
          { id: 'TEMP', icon: 'fa-temperature-half', label: 'Temp' },
        ].map(m => (
          <button
            key={m.id}
            onClick={() => setMode(m.id as any)}
            className={`shrink-0 px-4 py-3 rounded-xl border transition-all flex items-center gap-2 font-bold text-sm ${
              mode === m.id ? 'bg-amber-500 border-amber-500 text-slate-900' : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            <i className={`fa-solid ${m.icon}`}></i>
            {m.label}
          </button>
        ))}
      </div>

      <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700 space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest ml-1">Input Value</label>
          <input 
            type="number" 
            value={val}
            onChange={(e) => setVal(e.target.value)}
            className="w-full bg-slate-900 text-3xl font-mono p-4 rounded-2xl border border-slate-700 text-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            placeholder="0.00"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800/50 text-center">
            <p className="text-[10px] text-slate-500 mb-1">UNIT A</p>
            <p className="text-xl font-bold text-white">{results.a}</p>
          </div>
          <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800/50 text-center">
            <p className="text-[10px] text-slate-500 mb-1">UNIT B</p>
            <p className="text-xl font-bold text-amber-500">{results.b}</p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default UnitConverter;
