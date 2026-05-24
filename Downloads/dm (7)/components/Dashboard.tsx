
import React, { useState, useEffect } from 'react';
import { AppView, ServiceRecord } from '../types';
import MaintenanceBanner from './MaintenanceBanner';
import { auth } from '../services/firebaseService';

interface DashboardProps {
  onAction: (view: AppView) => void;
  onBack?: () => void;
  isPremium?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ onAction, isPremium = false }) => {
  const [history, setHistory] = useState<ServiceRecord[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newService, setNewService] = useState({ 
    type: '', 
    vehicle: ''
  });

  const isAdmin = auth.currentUser?.email === 'deeplastics11@gmail.com';

  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('deemacai_service_history');
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        if (Array.isArray(parsed)) {
          setHistory(parsed);
        } else {
          console.error("DeeMech: Service history is not an array, resetting.");
          localStorage.removeItem('deemacai_service_history');
        }
      }
    } catch (e) {
      console.error("DeeMech: Failed to load service history:", e);
    }
  }, []);

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService.type || !newService.vehicle) return;
    const record: ServiceRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      notes: '',
      regNo: '',
      engineRef: '',
      ...newService
    };
    const updatedHistory = [record, ...history];
    setHistory(updatedHistory);
    localStorage.setItem('deemacai_service_history', JSON.stringify(updatedHistory));
    setNewService({ type: '', vehicle: '' });
    setShowForm(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-6">
      
      {/* MAINTENANCE ALERT BANNER */}
      <MaintenanceBanner onAction={onAction} />
      
      {/* MEGA HERO - ASK A QUESTION */}
      <section className="px-6 pt-6">
        <button 
          onClick={() => onAction(AppView.CHAT)}
          className="w-full group relative overflow-hidden flex flex-col items-center justify-center p-8 bg-linear-to-br from-amber-500 to-amber-600 text-slate-950 rounded-[3rem] shadow-[0_20px_50px_rgba(245,158,11,0.3)] active:scale-[0.96] transition-all border-b-8 border-amber-700"
        >
          {!isPremium && <div className="absolute top-4 right-6 bg-slate-900 text-amber-500 text-[9px] font-black px-2 py-1 rounded-full uppercase tracking-widest"><i className="fa-solid fa-lock mr-1"></i>PRO</div>}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 -mr-8 -mt-8 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 -ml-6 -mb-6 rounded-full blur-xl"></div>
          
          <div className="w-20 h-20 bg-slate-950 rounded-3xl flex items-center justify-center text-amber-500 text-4xl mb-4 shadow-xl shadow-black/20 group-hover:scale-110 transition-transform duration-500">
            <i className="fa-solid fa-comment-dots"></i>
          </div>
          
          <h2 className="text-2xl font-black tracking-tighter uppercase italic leading-none">Ask Master Mech</h2>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] mt-2 opacity-80">Instant Repair Advice</p>
          
          <div className="mt-6 bg-slate-950/20 px-4 py-2 rounded-full flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-slate-950 animate-pulse"></div>
            <span className="text-[9px] font-black uppercase">Smart Assistant Online</span>
          </div>
        </button>
      </section>

      {/* QUICK ACTIONS GRID */}
      <section className="px-6 space-y-3">
        <div>
          <h3 className="text-white font-black text-[12px] uppercase tracking-widest">Quick Actions</h3>
          <p className="text-[9px] text-slate-400 mt-1 uppercase tracking-wider">Fast access to diagnostic tools & lookups</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => onAction(AppView.DIAGNOSTICS)}
          className="flex flex-col items-start p-5 bg-slate-900 border border-slate-800 rounded-4xl active:scale-95 transition-all group"
        >
          <div className="w-10 h-10 bg-rose-500/10 text-rose-500 rounded-xl flex items-center justify-center mb-3 group-hover:bg-rose-500 group-hover:text-white transition-all">
            <i className="fa-solid fa-barcode"></i>
          </div>
          <span className="text-xs font-black text-white uppercase">DTC Lookups</span>
          <span className="text-[8px] text-slate-500 font-bold uppercase mt-1">Check Engine Codes</span>
        </button>

        <button 
          onClick={() => isPremium ? onAction(AppView.AI_VISION) : onAction(AppView.PREMIUM_UPGRADE)}
          className="relative flex flex-col items-start p-5 bg-slate-900 border border-slate-800 rounded-4xl active:scale-95 transition-all group"
        >
          {!isPremium && <i className="fa-solid fa-lock absolute top-4 right-4 text-slate-600 text-[10px]"></i>}
          <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center mb-3 group-hover:bg-emerald-500 group-hover:text-white transition-all">
            <i className="fa-solid fa-camera"></i>
          </div>
          <span className="text-xs font-black text-white uppercase">Visual Scan</span>
          <span className="text-[8px] text-slate-500 font-bold uppercase mt-1">Identify Any Part</span>
        </button>
        </div>
      </section>

      {/* TOOLS CATEGORIES */}
      <section className="px-6 space-y-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-white font-black text-[12px] uppercase tracking-widest">Precision Toolkit</h3>
            <div className="h-px flex-1 bg-slate-900"></div>
          </div>
          <p className="text-[9px] text-slate-400 uppercase tracking-wider">Specialized modules for advanced diagnostics and repair</p>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {[
            { view: AppView.GUIDED_DIAGNOSTIC, icon: 'fa-wand-magic-sparkles', label: 'Smart Assist', desc: 'AI Troubleshooting', color: 'amber', isPro: true },
            { view: AppView.REPAIR_GUIDE, icon: 'fa-screwdriver-wrench', label: 'Repair Guide', desc: 'Step-by-step instr.', color: 'emerald', isPro: true },
            { view: AppView.LABOR_ESTIMATOR, icon: 'fa-clock', label: 'Labor Guide', desc: 'Time & cost est.', color: 'sky', isPro: true },
            { view: AppView.TORQUE_SPECS, icon: 'fa-wrench', label: 'Torque Master', desc: 'Fastener specs', color: 'blue', isPro: true },
            { view: AppView.CIRCUIT_GENIUS, icon: 'fa-bolt', label: 'Wiring', desc: 'Schematics', color: 'indigo', isPro: true },
            { view: AppView.TSB_RADAR, icon: 'fa-bullseye', label: 'TSB Radar', desc: 'Service bulletins', color: 'rose', isPro: true },
            { view: AppView.COMPONENT_TESTER, icon: 'fa-vial', label: 'Test Lab', desc: 'Testing procedures', color: 'emerald', isPro: true },
            { view: AppView.FAILURE_PREDICTOR, icon: 'fa-chart-line', label: 'Failure Prediction', desc: 'Predict wear issues', color: 'orange', isPro: true },
            { view: AppView.ADAS_GUIDE, icon: 'fa-crosshairs', label: 'ADAS Cal', desc: 'Sensor cal data', color: 'blue', isPro: true },
            { view: AppView.TOOL_MAINTENANCE, icon: 'fa-shield-halved', label: 'Tool Care', desc: 'Equipment upkeep', color: 'rose', isPro: false },
            { view: AppView.UNIT_CONVERTER, icon: 'fa-ruler', label: 'Converter', desc: 'Metric/Imperial', color: 'slate', isPro: false },
            { view: AppView.QUICK_SPECS, icon: 'fa-table-list', label: 'Quick Specs', desc: 'Fluids & caps', color: 'amber', isPro: false },
            { view: AppView.PART_FINDER, icon: 'fa-magnifying-glass-location', label: 'Part Finder', desc: 'Locate parts', color: 'blue', isPro: false },
            { view: AppView.NEARBY_SHOPS, icon: 'fa-location-dot', label: 'Nearby', desc: 'Local shops', color: 'emerald', isPro: false },
          ].map((tool) => (
            <button 
              key={tool.label}
              onClick={() => (!tool.isPro || isPremium) ? onAction(tool.view) : onAction(AppView.PREMIUM_UPGRADE)}
              className="relative flex items-center gap-3 p-3 bg-slate-900/50 border border-slate-800/50 rounded-2xl active:scale-95 transition-all group hover:border-amber-500/30 text-left overflow-hidden"
            >
              {tool.isPro && !isPremium && <i className="fa-solid fa-lock absolute right-3 text-[10px] text-slate-700"></i>}
              <div className={`shrink-0 w-8 h-8 rounded-lg bg-${tool.color}-500/10 text-${tool.color}-500 flex items-center justify-center text-xs group-hover:bg-${tool.color}-500 group-hover:text-white transition-all`}>
                <i className={`fa-solid ${tool.icon}`}></i>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-black text-white uppercase truncate">{tool.label}</span>
                <span className="text-[8px] text-slate-500 font-bold uppercase truncate mt-0.5">{tool.desc}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* JOB JOURNAL */}
      <section className="px-6 space-y-3">
        <div>
          <h3 className="text-white font-black text-[12px] uppercase tracking-widest">Workshop Journal</h3>
          <p className="text-[9px] text-slate-400 mt-1 uppercase tracking-wider">Log and track current repair jobs</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-[8px] font-black text-slate-700 uppercase tracking-widest">v1.1-PRO</div>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="text-amber-500 text-[9px] font-black uppercase tracking-wider bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20"
          >
            {showForm ? 'Cancel' : '+ Log Job'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleAddService} className="bg-slate-900 p-5 rounded-4xl border border-amber-500/20 shadow-2xl space-y-4 animate-in zoom-in-95 duration-300">
            <input 
              type="text" 
              placeholder="Vehicle Model"
              value={newService.vehicle}
              onChange={(e) => setNewService({...newService, vehicle: e.target.value})}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs focus:border-amber-500 outline-none placeholder:text-slate-700"
              required
            />
            <div className="grid grid-cols-2 gap-2">
              <input 
                type="text" 
                placeholder="Job Type"
                value={newService.type}
                onChange={(e) => setNewService({...newService, type: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs focus:border-amber-500 outline-none placeholder:text-slate-700"
                required
              />
              <button type="submit" className="bg-amber-500 text-slate-950 rounded-xl font-black uppercase text-[10px]">Save Job</button>
            </div>
          </form>
        )}

        <div className="space-y-2">
          {history.length === 0 ? (
            <div className="p-8 bg-slate-900/20 border border-slate-800 border-dashed rounded-4xl text-center">
              <p className="text-slate-600 text-[8px] font-black uppercase tracking-widest">No active repairs</p>
            </div>
          ) : (
            history.slice(0, 3).map((record) => (
              <div key={record.id} className="bg-slate-900/40 rounded-2xl p-4 border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-[10px] font-black text-white uppercase">{record.vehicle}</h4>
                  <p className="text-amber-500 text-[8px] font-bold uppercase mt-0.5">{record.type}</p>
                </div>
                <div className="text-[8px] text-slate-600 font-bold uppercase">{record.date}</div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* ADMIN & REFRESH */}
      <section className="px-6 space-y-3">
        {isAdmin && (
          <button 
            onClick={() => onAction(AppView.ADMIN_DASHBOARD)}
            className="w-full py-4 bg-red-600 text-white rounded-4xl font-black uppercase text-[9px] tracking-widest shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all outline-2 outline-white/20"
          >
            <i className="fa-solid fa-shield-halved"></i>
            ADMIN PANEL - VIEW USERS
          </button>
        )}
        
        <button 
          onClick={() => window.location.reload()}
          className="w-full py-3 border border-slate-800 text-slate-500 rounded-4xl font-black uppercase text-[8px] tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <i className="fa-solid fa-rotate"></i>
          Refresh App
        </button>
      </section>
    </div>
  );
};

export default Dashboard;
