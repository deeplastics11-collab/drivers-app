
import React, { useState, useEffect } from 'react';

const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);

  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if it's iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    const isStandalone = (window.navigator as any).standalone === true;
    
    if (isIOSDevice && !isStandalone) {
      setIsIOS(true);
      setShowBanner(true);
    }

    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      setShowBanner(true);
    });

    window.addEventListener('appinstalled', () => {
      setShowBanner(false);
      setDeferredPrompt(null);
      console.log('App was installed');
    });
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setShowBanner(false);
  };

  if (!showBanner) return null;

  if (isIOS) {
    return (
      <div className="fixed top-20 left-4 right-4 z-50 animate-in slide-in-from-top-10 duration-500">
        <div className="bg-amber-500 rounded-2xl p-4 shadow-2xl flex items-center justify-between border border-amber-400">
          <div className="flex items-center gap-3">
            <div className="bg-slate-900 p-2 rounded-lg text-amber-500">
              <i className="fa-solid fa-share-from-square text-lg"></i>
            </div>
            <div>
              <p className="text-slate-900 font-bold text-sm">Install on iOS</p>
              <p className="text-slate-800 text-[10px] font-medium">Tap Share then "Add to Home Screen".</p>
            </div>
          </div>
          <button 
            onClick={() => setShowBanner(false)}
            className="px-3 py-1.5 text-slate-800 text-xs font-bold"
          >
            Dismiss
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-20 left-4 right-4 z-50 animate-in slide-in-from-top-10 duration-500">
      <div className="bg-amber-500 rounded-2xl p-4 shadow-2xl flex items-center justify-between border border-amber-400">
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 p-2 rounded-lg text-amber-500">
            <i className="fa-solid fa-mobile-screen-button text-lg"></i>
          </div>
          <div>
            <p className="text-slate-900 font-bold text-sm">Install App</p>
            <p className="text-slate-800 text-[10px] font-medium">Add to your home screen for quick access.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowBanner(false)}
            className="px-3 py-1.5 text-slate-800 text-xs font-bold"
          >
            Later
          </button>
          <button 
            onClick={handleInstallClick}
            className="bg-slate-900 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-lg active:scale-95 transition-transform"
          >
            Install
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;
