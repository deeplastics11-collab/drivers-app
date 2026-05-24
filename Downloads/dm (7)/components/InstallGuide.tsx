
import React from 'react';

interface InstallGuideProps {
  onBack: () => void;
}

const InstallGuide: React.FC<InstallGuideProps> = ({ onBack }) => {
  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-700 bg-slate-950 min-h-full pb-40 overflow-y-auto no-scrollbar">
      
      {/* INSTALLER BRANDING */}
      <div className="text-center space-y-1 mb-4">
        <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">INSTALLER</h1>
        <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em]">Professional Tool</p>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-3xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
          <span className="text-[10px] font-black text-white uppercase tracking-widest">Technical Support</span>
        </div>
        <button 
          onClick={onBack}
          className="bg-amber-500 text-slate-950 px-5 py-2 rounded-xl text-[10px] font-black uppercase shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
        >
          Back
        </button>
      </div>

      <header className="text-center pt-4">
        <div className="w-20 h-20 bg-rose-500 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-rose-500/20 border-b-4 border-rose-700">
            <i className="fa-solid fa-bug-slash text-3xl text-slate-950"></i>
        </div>
        <h2 className="text-3xl font-black text-white tracking-tight leading-none mb-2 uppercase italic">Error Resolver</h2>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em]">Bypassing Terminal Blocks</p>
      </header>

      {/* ANDROID APK BUILD */}
      <section className="bg-emerald-500/10 rounded-[2.5rem] border border-emerald-500/30 p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
           <div className="w-8 h-8 bg-emerald-500 text-slate-950 rounded-full flex items-center justify-center font-black text-xs">
             <i className="fa-solid fa-android"></i>
           </div>
           <h3 className="text-white font-black text-xs uppercase tracking-widest">Android APK Build</h3>
        </div>

        <div className="space-y-6">
           <div className="p-4 bg-slate-900/80 rounded-2xl border border-emerald-500/20 mb-4">
             <p className="text-[11px] text-white font-black uppercase mb-2">Native Android Ready</p>
             <p className="text-[10px] text-slate-400 leading-relaxed">
               I have already initialized the <span className="text-emerald-500">Capacitor Android</span> platform and synced the latest web assets. The project is ready to be built into a native APK.
             </p>
           </div>

           <div className="space-y-4">
             <p className="text-[11px] text-slate-300 font-bold uppercase">How to build your APK:</p>
             <ol className="space-y-3 list-decimal list-inside text-[10px] text-slate-400">
               <li>Use the <span className="text-white font-bold">"Export to ZIP"</span> feature in the settings menu to download the full source code.</li>
               <li>Extract the ZIP on a computer with <span className="text-white font-bold">Android Studio</span> installed.</li>
               <li>Open the <span className="text-emerald-500">"android"</span> folder in Android Studio.</li>
               <li>Go to <span className="text-white font-bold">Build &gt; Build Bundle(s) / APK(s) &gt; Build APK(s)</span>.</li>
               <li>Your APK will be generated in <code className="text-slate-300">android/app/build/outputs/apk/debug/</code>.</li>
             </ol>
           </div>
        </div>
      </section>

      {/* MOBILE INSTALL INSTRUCTIONS */}
      <section className="bg-amber-500/10 rounded-[2.5rem] border border-amber-500/30 p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
           <div className="w-8 h-8 bg-amber-500 text-slate-950 rounded-full flex items-center justify-center font-black text-xs">
             <i className="fa-solid fa-mobile-screen-button"></i>
           </div>
           <h3 className="text-white font-black text-xs uppercase tracking-widest">Mobile App Install</h3>
        </div>

        <div className="space-y-6">
           <div className="p-4 bg-slate-900/80 rounded-2xl border border-amber-500/20 mb-4">
             <p className="text-[11px] text-white font-black uppercase mb-2">No APK Needed</p>
             <p className="text-[10px] text-slate-400 leading-relaxed">
               DeeMech Pro is a <span className="text-amber-500">Progressive Web App (PWA)</span>. It installs directly to your home screen without a 100MB download. It works offline and provides a full native app experience.
             </p>
           </div>

           <div className="space-y-2">
             <p className="text-amber-500 font-black text-[10px] uppercase flex items-center gap-2">
               <i className="fa-brands fa-android"></i> For Android (Chrome)
             </p>
             <p className="text-[11px] text-slate-300">Tap the <i className="fa-solid fa-ellipsis-vertical mx-1"></i> menu and select <span className="text-white font-bold">"Install App"</span> or <span className="text-white font-bold">"Add to Home screen"</span>.</p>
           </div>
           
           <div className="space-y-2">
             <p className="text-sky-400 font-black text-[10px] uppercase flex items-center gap-2">
               <i className="fa-brands fa-apple"></i> For iOS (Safari)
             </p>
             <p className="text-[11px] text-slate-300">Tap the <i className="fa-solid fa-share-from-square mx-1"></i> share button and select <span className="text-white font-bold">"Add to Home Screen"</span>.</p>
           </div>
        </div>
      </section>

      {/* MISSING SCRIPT FIX */}
      <section className="bg-rose-500/10 rounded-[2.5rem] border-2 border-rose-500/30 p-8 shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-3 mb-6">
           <div className="w-8 h-8 bg-rose-500 text-white rounded-full flex items-center justify-center font-black text-xs">!</div>
           <h3 className="text-white font-black text-xs uppercase tracking-widest">Missing Script Fix</h3>
        </div>

        <div className="space-y-4">
           <p className="text-[11px] text-slate-300 font-bold uppercase leading-relaxed">
             If <code className="text-white">npm start</code> fails, your computer doesn't see the new configuration yet. Use the <span className="text-emerald-400">Master Key</span>:
           </p>
           
           <div className="p-5 bg-black/60 rounded-2xl border border-emerald-500/50">
              <p className="text-emerald-500 font-black text-[10px] uppercase mb-2">The Universal Start Command</p>
              <code className="text-white bg-slate-800 px-3 py-1 rounded block mb-2 font-mono text-xs">npm run dev</code>
              <p className="text-[10px] text-slate-400">This command is built into the engine and bypasses the "Missing Script" error entirely.</p>
           </div>
        </div>
      </section>

      {/* DIRECTORY CHECK */}
      <section className="bg-slate-900 rounded-[2.5rem] border border-slate-800 p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
           <div className="w-8 h-8 bg-sky-500 text-slate-950 rounded-full flex items-center justify-center font-black text-xs">2</div>
           <h3 className="text-white font-black text-xs uppercase tracking-widest">Verify Folder</h3>
        </div>

        <div className="space-y-4">
           <p className="text-[11px] text-slate-300">Ensure PowerShell is inside the <span className="text-sky-400 font-bold">EXACT</span> folder. Type this to check:</p>
           
           <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
              <code className="text-sky-400 text-[10px] font-mono">ls</code>
              <p className="text-[9px] text-slate-500 mt-2 italic">If you don't see "package.json" in the list, you are in the wrong folder!</p>
           </div>

           <p className="text-[11px] text-slate-400 italic">
             "If you are in 'Downloads' but the files are in 'Downloads/copy-of-deemach', the commands won't work."
           </p>
        </div>
      </section>

      <div className="text-center pt-8 space-y-4">
        <button 
          onClick={() => window.location.reload()}
          className="w-full py-3 border border-slate-800 text-slate-500 rounded-[2rem] font-black uppercase text-[8px] tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <i className="fa-solid fa-rotate"></i>
          Refresh App
        </button>
        
        <div className="opacity-20">
          <p className="text-[7px] font-bold text-slate-600 uppercase tracking-[0.5em]">
            DEEMECH PRO v8.8
          </p>
        </div>
      </div>
    </div>
  );
};

export default InstallGuide;
