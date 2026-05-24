
import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { AppView } from '../types';
import { motion, AnimatePresence } from 'motion/react';

import Logo from './Logo';

interface LayoutProps {
  children: React.ReactNode;
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  onBack: () => void;
  onForward?: () => void;
  canGoBack?: boolean;
  canGoForward?: boolean;
  historyIndex: number;
  historyLength: number;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeView, 
  setActiveView, 
  onBack,
  onForward,
  canGoBack,
  canGoForward,
  historyIndex,
  historyLength
}) => {
  const isDashboard = activeView === AppView.DASHBOARD;
  const isRegister = activeView === AppView.REGISTER;
  const scrollRef = useRef<HTMLElement>(null);
  const appFlowViews: AppView[] = [
    AppView.DASHBOARD,
    AppView.CHAT,
    AppView.DIAGNOSTICS,
    AppView.GUIDED_DIAGNOSTIC,
    AppView.LABOR_ESTIMATOR,
    AppView.CIRCUIT_GENIUS,
    AppView.FAILURE_PREDICTOR,
    AppView.PRECISION_SPECS,
    AppView.ADAS_GUIDE,
    AppView.AI_VISION,
    AppView.COMPONENT_TESTER,
    AppView.TSB_RADAR,
    AppView.LIVE_VOICE,
    AppView.UNIT_CONVERTER,
    AppView.QUICK_SPECS,
    AppView.NEARBY_SHOPS,
    AppView.INSTALL_GUIDE,
    AppView.TOOL_MAINTENANCE,
    AppView.TORQUE_SPECS,
    AppView.REPAIR_GUIDE,
    AppView.PART_FINDER,
    AppView.SHARE_APP
  ];
  const sectionProgressIndex = Math.max(0, appFlowViews.indexOf(activeView)) + 1;
  const sectionProgressTotal = appFlowViews.length;
  const sectionProgressPercent = Math.min(
    100,
    Math.round((sectionProgressIndex / sectionProgressTotal) * 100)
  );

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  const getPageTitle = (view: AppView) => {
    switch (view) {
      case AppView.REGISTER: return "DeeMech-";
      case AppView.DASHBOARD: return "DeeMech";
      case AppView.GUIDED_DIAGNOSTIC: return "SMART ASSISTANT";
      case AppView.LABOR_ESTIMATOR: return "SMART LABOUR";
      case AppView.CIRCUIT_GENIUS: return "CIRCUIT LOGIC";
      case AppView.FAILURE_PREDICTOR: return "FAILURE PREDICTION";
      case AppView.PRECISION_SPECS: return "SEQUENCE PRO";
      case AppView.ADAS_GUIDE: return "ADAS CALIBRATOR";
      case AppView.AI_VISION: return "PART SCAN";
      case AppView.CHAT: return "TECH ADVISOR";
      case AppView.DIAGNOSTICS: return "DTC LIBRARY";
      case AppView.QUICK_SPECS: return "QUICK SPECS";
      case AppView.NEARBY_SHOPS: return "NEARBY RESOURCES";
      case AppView.COMPONENT_TESTER: return "TEST LAB";
      case AppView.TSB_RADAR: return "TSB RADAR";
      case AppView.LIVE_VOICE: return "HANDS-FREE";
      case AppView.UNIT_CONVERTER: return "CONVERTER";
      case AppView.INSTALL_GUIDE: return "INSTALLER";
      case AppView.TORQUE_SPECS: return "TORQUE MASTER";
      case AppView.REPAIR_GUIDE: return "REPAIR GUIDE";
      case AppView.PART_FINDER: return "PART FINDER";
      case AppView.ADMIN_DASHBOARD: return "ADMIN CONTROL";
      default: return (view as string).replace('_', ' ');
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-950">
      {/* VERSION BANNER */}
      <div className="bg-amber-500 text-slate-950 text-[8px] font-black uppercase tracking-[0.3em] text-center py-1 z-50">
        DeeMech Pro v2.0 - BUILT FOR SUCCESS
      </div>
      {/* Premium Header */}
      <header className="px-6 py-5 flex items-center justify-between bg-slate-950/90 backdrop-blur-xl z-20 border-b border-slate-900 shrink-0">
        <div className="flex items-center gap-4">
          {!isRegister && (
            <div className="flex items-center gap-2">
              <button 
                onClick={onBack}
                disabled={!canGoBack && isDashboard}
                className={`p-2.5 rounded-2xl w-11 h-11 flex items-center justify-center transition-all border shadow-lg ${
                  isDashboard && !canGoBack 
                    ? 'bg-slate-900 border-slate-800 text-slate-700 opacity-50 cursor-not-allowed'
                    : 'bg-amber-500 text-slate-950 border-amber-400 active:scale-90 shadow-amber-500/20'
                }`}
                aria-label="Go back"
              >
                <i className="fa-solid fa-chevron-left text-lg"></i>
              </button>
              
              {!isDashboard && (
                <button 
                  onClick={onForward}
                  disabled={!canGoForward}
                  className={`p-2.5 rounded-2xl w-11 h-11 flex items-center justify-center transition-all border shadow-lg ${
                    !canGoForward 
                      ? 'bg-slate-900 border-slate-800 text-slate-700 opacity-50 cursor-not-allowed'
                      : 'bg-slate-800 text-amber-500 border-slate-700 active:scale-90 shadow-slate-950/50'
                  }`}
                  aria-label="Go forward"
                >
                  <i className="fa-solid fa-chevron-right text-lg"></i>
                </button>
              )}
            </div>
          )}
          {(isDashboard || isRegister) && !canGoBack && (
            <Logo size="md" />
          )}
          <div>
            <h1 className="text-sm font-black text-white tracking-[0.15em] leading-none uppercase">
              {getPageTitle(activeView)}
            </h1>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1.5 opacity-60">
              {isRegister ? "Smart Assistant" : isDashboard ? "Shop Command" : "Professional Tool"}
            </p>
          </div>
        </div>
        {!isRegister && (
          <div className="flex items-center gap-2">
              <button className="w-11 h-11 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 active:scale-95 transition-all">
                  <i className="fa-solid fa-signal text-xs text-emerald-500"></i>
              </button>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main 
        ref={scrollRef}
        className="flex-1 overflow-y-auto no-scrollbar relative bg-slate-950 pb-20"
      >
        {!isRegister && !isDashboard && (
          <div className="sticky top-0 z-10 px-4 py-2 border-b border-slate-900 bg-slate-950/95 backdrop-blur-md">
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={onBack}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-900 text-amber-400 text-[10px] font-black uppercase tracking-wider"
                aria-label="Back to previous section"
              >
                <i className="fa-solid fa-arrow-left"></i>
                Back
              </button>
              <div className="text-right">
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.18em]">
                  Section {sectionProgressIndex} of {sectionProgressTotal}
                </p>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mt-1">
                  History {historyIndex + 1} of {historyLength}
                </p>
              </div>
            </div>
            <div className="mt-2 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-300"
                style={{ width: `${sectionProgressPercent}%` }}
                aria-hidden="true"
              />
            </div>
          </div>
        )}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ 
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: 0.3
            }}
            onAnimationStart={() => {
              if (scrollRef.current) {
                scrollRef.current.scrollTop = 0;
              }
              window.scrollTo(0, 0);
            }}
            className="w-full min-h-full flex flex-col"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation Bar */}
      {!isRegister && (
        <nav className="fixed bottom-0 left-0 right-0 bg-slate-950/90 backdrop-blur-xl border-t border-slate-900 z-50 pb-safe">
          <div className="flex items-center justify-around px-2 py-3">
            <button 
              onClick={() => setActiveView(AppView.DASHBOARD)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${activeView === AppView.DASHBOARD ? 'text-amber-500' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <i className="fa-solid fa-house text-lg"></i>
              <span className="text-[9px] font-black uppercase tracking-widest">Home</span>
            </button>
            
            <button 
              onClick={() => setActiveView(AppView.CHAT)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${activeView === AppView.CHAT ? 'text-amber-500' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <i className="fa-solid fa-comment-dots text-lg"></i>
              <span className="text-[9px] font-black uppercase tracking-widest">Ask Mech</span>
            </button>

            <button 
              onClick={() => setActiveView(AppView.DIAGNOSTICS)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${activeView === AppView.DIAGNOSTICS ? 'text-amber-500' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <i className="fa-solid fa-barcode text-lg"></i>
              <span className="text-[9px] font-black uppercase tracking-widest">DTC</span>
            </button>
          </div>
        </nav>
      )}

      {/* Attribution Footer */}
      <footer className="hidden">
        <div className="flex flex-col items-center justify-center gap-1">
          <p className="text-[7px] font-black text-slate-600 uppercase tracking-[0.3em]">
            © 2025 Deon86Van03Vuuren21
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
