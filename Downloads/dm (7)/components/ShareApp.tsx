
import React, { useState } from 'react';
import { motion } from 'motion/react';

interface ShareAppProps {
  onBack: () => void;
}

const ShareApp: React.FC<ShareAppProps> = ({ onBack }) => {
  const [copied, setCopied] = useState(false);
  const appUrl = window.location.origin;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(appUrl)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-700 bg-slate-950 min-h-full pb-40 overflow-y-auto no-scrollbar">
      
      {/* BRANDING */}
      <div className="text-center space-y-1 mb-4">
        <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">SHARE APP</h1>
        <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em]">Expand the Network</p>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-3xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[10px] font-black text-white uppercase tracking-widest">Team Deployment</span>
        </div>
        <button 
          onClick={onBack}
          className="bg-slate-800 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase border border-slate-700 active:scale-95 transition-all"
        >
          Back
        </button>
      </div>

      {/* QR CODE SECTION */}
      <section className="bg-slate-900 rounded-[2.5rem] border border-slate-800 p-8 shadow-2xl text-center space-y-6">
        <div className="w-48 h-48 bg-white p-4 rounded-3xl mx-auto shadow-2xl shadow-emerald-500/10 border-4 border-slate-800">
          <img 
            src={qrUrl} 
            alt="App QR Code" 
            className="w-full h-full"
            referrerPolicy="no-referrer"
          />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-white font-black text-xs uppercase tracking-widest">Scan to Install</h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase leading-relaxed">
            Point your camera here to open the app on any device instantly.
          </p>
        </div>
      </section>

      {/* COPY LINK SECTION */}
      <section className="bg-slate-900 rounded-[2.5rem] border border-slate-800 p-8 shadow-2xl space-y-4">
        <div className="flex items-center gap-3 mb-2">
           <div className="w-8 h-8 bg-sky-500 text-slate-950 rounded-full flex items-center justify-center font-black text-xs">
             <i className="fa-solid fa-link"></i>
           </div>
           <h3 className="text-white font-black text-xs uppercase tracking-widest">Direct Link</h3>
        </div>

        <div className="relative group">
          <div className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-sky-400 font-mono text-[10px] overflow-hidden truncate pr-20">
            {appUrl}
          </div>
          <button 
            onClick={handleCopy}
            className={`absolute right-2 top-2 bottom-2 px-4 rounded-xl font-black uppercase text-[9px] transition-all ${
              copied ? 'bg-emerald-500 text-white' : 'bg-sky-500 text-slate-950'
            }`}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </section>

      {/* TEAM INSTRUCTIONS */}
      <section className="bg-amber-500/10 rounded-[2.5rem] border border-amber-500/30 p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
           <div className="w-8 h-8 bg-amber-500 text-slate-950 rounded-full flex items-center justify-center font-black text-xs">
             <i className="fa-solid fa-users"></i>
           </div>
           <h3 className="text-white font-black text-xs uppercase tracking-widest">Deployment Steps</h3>
        </div>

        <div className="space-y-6">
           <div className="flex gap-4">
             <div className="w-6 h-6 rounded-lg bg-slate-800 text-white flex items-center justify-center text-[10px] font-black shrink-0">1</div>
             <p className="text-[11px] text-slate-300 leading-relaxed">
               <span className="text-white font-bold">Share the link</span> via SMS, WhatsApp, or Email to your team members.
             </p>
           </div>
           
           <div className="flex gap-4">
             <div className="w-6 h-6 rounded-lg bg-slate-800 text-white flex items-center justify-center text-[10px] font-black shrink-0">2</div>
             <p className="text-[11px] text-slate-300 leading-relaxed">
               Instruct them to open it in <span className="text-amber-500 font-bold">Chrome</span> (Android) or <span className="text-sky-400 font-bold">Safari</span> (iOS).
             </p>
           </div>

           <div className="flex gap-4">
             <div className="w-6 h-6 rounded-lg bg-slate-800 text-white flex items-center justify-center text-[10px] font-black shrink-0">3</div>
             <p className="text-[11px] text-slate-300 leading-relaxed">
               Tell them to select <span className="text-white font-bold">"Add to Home Screen"</span> to install the professional tool.
             </p>
           </div>
        </div>
      </section>

      <div className="text-center pt-8 opacity-20">
        <p className="text-[7px] font-bold text-slate-600 uppercase tracking-[0.5em]">
          DEEMECH GLOBAL NETWORK
        </p>
      </div>
    </div>
  );
};

export default ShareApp;
