import React, { useState } from 'react';
import BackButton from './BackButton';
import { auth, upgradeUserPremium } from '../services/firebaseService';

interface PremiumUpgradeProps {
  onBack?: () => void;
  onSuccess?: () => void;
}

const PremiumUpgrade: React.FC<PremiumUpgradeProps> = ({ onBack, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpgrade = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!auth.currentUser) {
        // For testing/guest mode without a logged-in Firebase user, we instantly simulate success.
        setTimeout(() => {
          if (onSuccess) onSuccess();
        }, 1000);
        return;
      }
      
      const success = await upgradeUserPremium(auth.currentUser.uid);
      if (success && onSuccess) {
        onSuccess();
      } else {
        setError('Failed to apply upgrade. Please try again.');
      }
    } catch (e: any) {
      setError(e.message || 'Payment processing error');
    } finally {
      if (auth.currentUser) {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950">
      <div className="shrink-0 px-6 pt-4 pb-4 bg-slate-950 border-b border-slate-900 flex items-center gap-3">
        {onBack && <BackButton onClick={onBack} />}
        <div className="min-w-0">
          <h2 className="text-base font-black text-white uppercase tracking-tight leading-none flex items-center gap-2">
            <i className="fa-solid fa-crown text-amber-500"></i>
            Pro Access
          </h2>
        </div>
      </div>

      <div className="p-6 space-y-6 overflow-y-auto flex-1">
        <div className="text-center py-6">
          <div className="w-20 h-20 bg-amber-500/10 text-amber-500 rounded-4xl flex items-center justify-center text-4xl mx-auto mb-6">
            <i className="fa-solid fa-gem"></i>
          </div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight mb-2">Unlock DeeMech Pro</h1>
          <p className="text-slate-400 text-xs font-bold leading-relaxed mb-8">
            Get unlimited access to AI diagnostics, visual scans, labor times, TSBs, and the complete Master Mechanic toolkit.
          </p>

          <div className="space-y-3 text-left bg-slate-900 border border-slate-800 rounded-4xl p-6 mb-8">
            <div className="flex items-center gap-3">
              <i className="fa-solid fa-check text-emerald-500"></i>
              <span className="text-white text-xs font-bold">Live AI Chat & Diagnostic Support</span>
            </div>
            <div className="flex items-center gap-3">
              <i className="fa-solid fa-check text-emerald-500"></i>
              <span className="text-white text-xs font-bold">Image Recognition for Parts</span>
            </div>
            <div className="flex items-center gap-3">
              <i className="fa-solid fa-check text-emerald-500"></i>
              <span className="text-white text-xs font-bold">Smart Failure Prediction Algorithms</span>
            </div>
            <div className="flex items-center gap-3">
              <i className="fa-solid fa-check text-emerald-500"></i>
              <span className="text-white text-xs font-bold">Factory TSB & Labor Guides</span>
            </div>
            <div className="flex items-center gap-3">
              <i className="fa-solid fa-check text-emerald-500"></i>
              <span className="text-white text-xs font-bold">Torque Specs & Multi-stage Sequences</span>
            </div>
          </div>

          {error && <p className="text-red-500 text-xs font-bold mb-4">{error}</p>}

          <button 
            onClick={handleUpgrade}
            disabled={loading}
            className="w-full bg-amber-500 text-slate-950 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition-all text-center flex items-center justify-center gap-2"
          >
            {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : 'Upgrade Now'}
          </button>
          <p className="text-slate-500 text-[9px] mt-4 uppercase tracking-widest">Supports iOS / Android Billing</p>
        </div>
      </div>
    </div>
  );
};

export default PremiumUpgrade;