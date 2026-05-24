
import React, { useState, useEffect } from 'react';

const UpdatePrompt: React.FC = () => {
  const [show, setShow] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then(reg => {
        if (reg) {
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setWaitingWorker(newWorker);
                  setShow(true);
                }
              });
            }
          });

          // Check if there is already a waiting worker
          if (reg.waiting) {
            setWaitingWorker(reg.waiting);
            setShow(true);
          }
        }
      });
    }
  }, []);

  const handleUpdate = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    }
    setShow(false);
    window.location.reload();
  };

  if (!show) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-[100] animate-in slide-in-from-top duration-500">
      <div className="bg-amber-500 text-slate-950 p-4 rounded-2xl shadow-2xl flex items-center justify-between border border-amber-400">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-950/10 rounded-xl flex items-center justify-center">
            <i className="fa-solid fa-cloud-arrow-down text-lg"></i>
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-wider leading-none">Update Available</p>
            <p className="text-[9px] font-bold opacity-80 uppercase tracking-widest mt-1">New features are ready</p>
          </div>
        </div>
        <button 
          onClick={handleUpdate}
          className="bg-slate-950 text-amber-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-lg"
        >
          Refresh Now
        </button>
      </div>
    </div>
  );
};

export default UpdatePrompt;
