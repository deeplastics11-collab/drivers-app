
import React, { useState, useEffect } from 'react';
import { AlertTriangle, ChevronRight, X, Wrench } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AppView } from '../types';

interface MaintenanceTool {
  id: string;
  name: string;
  nextMaintenance: string;
}

interface MaintenanceBannerProps {
  onAction: (view: AppView) => void;
}

const MaintenanceBanner: React.FC<MaintenanceBannerProps> = ({ onAction }) => {
  const [dueTools, setDueTools] = useState<MaintenanceTool[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const checkMaintenance = () => {
      const savedTools = localStorage.getItem('deemech_tools');
      if (savedTools) {
        const tools: MaintenanceTool[] = JSON.parse(savedTools);
        const today = new Date();
        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(today.getDate() + 7);

        const upcoming = tools.filter(tool => {
          const dueDate = new Date(tool.nextMaintenance);
          // Tool is due within the next 7 days (including today or overdue)
          return dueDate <= sevenDaysFromNow;
        });

        setDueTools(upcoming);
      }
    };

    checkMaintenance();
    // Refresh every hour or when component mounts
    const interval = setInterval(checkMaintenance, 3600000);
    return () => clearInterval(interval);
  }, []);

  if (!isVisible || dueTools.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="px-6 pt-4 overflow-hidden"
      >
        <div className="bg-gradient-to-r from-amber-500/20 to-rose-500/20 border border-amber-500/30 rounded-2xl p-4 relative shadow-lg shadow-amber-500/5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20">
              <AlertTriangle className="text-slate-950" size={20} />
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="text-amber-500 font-black text-xs uppercase tracking-wider">Maintenance Alert</h4>
              <div className="mt-1 space-y-1">
                {dueTools.slice(0, 2).map(tool => (
                  <p key={tool.id} className="text-white text-sm font-bold truncate">
                    {tool.name} <span className="text-slate-400 font-normal text-xs ml-1">due {tool.nextMaintenance}</span>
                  </p>
                ))}
                {dueTools.length > 2 && (
                  <p className="text-slate-400 text-[10px] font-bold uppercase">
                    + {dueTools.length - 2} more tools require attention
                  </p>
                )}
              </div>
              
              <button 
                onClick={() => onAction(AppView.TOOL_MAINTENANCE)}
                className="mt-3 flex items-center gap-1 text-amber-500 text-[10px] font-black uppercase tracking-widest hover:gap-2 transition-all"
              >
                Manage Inventory <ChevronRight size={12} />
              </button>
            </div>

            <button 
              onClick={() => setIsVisible(false)}
              className="text-slate-500 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MaintenanceBanner;
