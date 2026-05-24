
import React, { useState, useEffect } from 'react';
import { Wrench, Calendar, AlertTriangle, CheckCircle, Plus, Trash2, Settings, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import BackButton from './BackButton';

interface MaintenanceTool {
  id: string;
  name: string;
  type: string;
  lastMaintenance: string;
  nextMaintenance: string;
  status: 'good' | 'warning' | 'critical';
  notes: string;
}

const ToolMaintenance: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [tools, setTools] = useState<MaintenanceTool[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newTool, setNewTool] = useState({ name: '', type: '', lastMaintenance: '', interval: '6' });

  useEffect(() => {
    const savedTools = localStorage.getItem('deemech_tools');
    if (savedTools) {
      setTools(JSON.parse(savedTools));
    } else {
      // Default sample tools
      const initialTools: MaintenanceTool[] = [
        {
          id: '1',
          name: 'Autel MaxiSys Ultra',
          type: 'Diagnostic Scanner',
          lastMaintenance: '2024-01-15',
          nextMaintenance: '2024-07-15',
          status: 'good',
          notes: 'Software update and battery check.'
        },
        {
          id: '2',
          name: 'Snap-on Torque Wrench',
          type: 'Precision Tool',
          lastMaintenance: '2023-10-10',
          nextMaintenance: '2024-04-10',
          status: 'warning',
          notes: 'Calibration due soon.'
        }
      ];
      setTools(initialTools);
      localStorage.setItem('deemech_tools', JSON.stringify(initialTools));
    }
  }, []);

  const saveTools = (updatedTools: MaintenanceTool[]) => {
    setTools(updatedTools);
    localStorage.setItem('deemech_tools', JSON.stringify(updatedTools));
  };

  const handleAddTool = () => {
    if (!newTool.name || !newTool.lastMaintenance) return;

    const lastDate = new Date(newTool.lastMaintenance);
    const nextDate = new Date(lastDate);
    nextDate.setMonth(nextDate.getMonth() + parseInt(newTool.interval));

    const tool: MaintenanceTool = {
      id: Date.now().toString(),
      name: newTool.name,
      type: newTool.type || 'General Tool',
      lastMaintenance: newTool.lastMaintenance,
      nextMaintenance: nextDate.toISOString().split('T')[0],
      status: 'good',
      notes: `Scheduled every ${newTool.interval} months.`
    };

    saveTools([...tools, tool]);
    setIsAdding(false);
    setNewTool({ name: '', type: '', lastMaintenance: '', interval: '6' });
  };

  const deleteTool = (id: string) => {
    saveTools(tools.filter(t => t.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'warning': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      default: return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950">
      <div className="shrink-0 px-4 pt-4 pb-4 bg-slate-950 border-b border-slate-900 flex items-center gap-3">
        {onBack && <BackButton onClick={onBack} />}
        <div className="min-w-0">
          <h2 className="text-base font-black text-white uppercase tracking-tight leading-none flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            Tool Maintenance
          </h2>
        </div>
      </div>

      <div className="p-4 space-y-6 pb-24 overflow-y-auto flex-1">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-slate-400 text-sm">Keep your diagnostic gear in top spec</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="p-2 bg-amber-500 rounded-full text-slate-900 shadow-lg shadow-amber-500/20 active:scale-95 transition-transform"
        >
          <Plus size={24} />
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl space-y-4"
          >
            <h3 className="text-white font-semibold">Register New Tool</h3>
            <div className="grid grid-cols-1 gap-3">
              <input 
                type="text" 
                placeholder="Tool Name (e.g. Torque Wrench)"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-amber-500 outline-none"
                value={newTool.name}
                onChange={e => setNewTool({...newTool, name: e.target.value})}
              />
              <input 
                type="text" 
                placeholder="Tool Type"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-amber-500 outline-none"
                value={newTool.type}
                onChange={e => setNewTool({...newTool, type: e.target.value})}
              />
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs text-slate-500 ml-1">Last Calibration</label>
                  <input 
                    type="date" 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-amber-500 outline-none"
                    value={newTool.lastMaintenance}
                    onChange={e => setNewTool({...newTool, lastMaintenance: e.target.value})}
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-slate-500 ml-1">Interval (Months)</label>
                  <select 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-amber-500 outline-none"
                    value={newTool.interval}
                    onChange={e => setNewTool({...newTool, interval: e.target.value})}
                  >
                    <option value="3">3 Months</option>
                    <option value="6">6 Months</option>
                    <option value="12">12 Months</option>
                    <option value="24">24 Months</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setIsAdding(false)}
                className="flex-1 py-3 rounded-xl bg-slate-800 text-white font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddTool}
                className="flex-1 py-3 rounded-xl bg-amber-500 text-slate-900 font-bold"
              >
                Save Tool
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {tools.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/30 rounded-3xl border border-dashed border-slate-800">
            <Wrench className="mx-auto text-slate-700 mb-2" size={48} />
            <p className="text-slate-500">No tools registered yet.</p>
          </div>
        ) : (
          tools.map(tool => (
            <motion.div 
              layout
              key={tool.id}
              className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 flex gap-4 relative group"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${getStatusColor(tool.status)}`}>
                <Settings size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-white font-bold truncate">{tool.name}</h4>
                    <p className="text-slate-500 text-xs uppercase tracking-wider">{tool.type}</p>
                  </div>
                  <button 
                    onClick={() => deleteTool(tool.id)}
                    className="text-slate-600 hover:text-red-500 p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <div className="mt-3 grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-500 uppercase">Last Service</p>
                    <div className="flex items-center gap-1.5 text-slate-300 text-sm">
                      <Calendar size={14} className="text-slate-500" />
                      {tool.lastMaintenance}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-500 uppercase">Next Due</p>
                    <div className="flex items-center gap-1.5 text-amber-500 text-sm font-medium">
                      <AlertTriangle size={14} />
                      {tool.nextMaintenance}
                    </div>
                  </div>
                </div>

                {tool.notes && (
                  <p className="mt-3 text-xs text-slate-400 bg-slate-950/50 p-2 rounded-lg border border-slate-800/50">
                    {tool.notes}
                  </p>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <CheckCircle className="text-amber-500 shrink-0 mt-0.5" size={18} />
          <div>
            <h5 className="text-amber-500 font-bold text-sm">Pro Tip</h5>
            <p className="text-slate-400 text-xs mt-1 leading-relaxed">
              Regular calibration of torque wrenches and software updates for scanners ensure your diagnostics are 100% accurate. 
              Inaccurate tools lead to misdiagnosis and costly rework.
            </p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default ToolMaintenance;
