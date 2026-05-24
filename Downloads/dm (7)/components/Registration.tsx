
import React, { useState } from 'react';
import { motion } from 'motion/react';
import Logo from './Logo';
import { User, LogIn, ChevronRight, Mail, MapPin, Wrench } from 'lucide-react';
import { signInWithGoogle, registerUser } from '../services/firebaseService';
import BackButton from './BackButton';

interface RegistrationProps {
  onComplete: () => void;
  onBack?: () => void;
}

const Registration: React.FC<RegistrationProps> = ({ onComplete, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'LOGIN' | 'DETAILS'>('LOGIN');
  const [userData, setUserData] = useState({
    userId: '',
    email: '',
    displayName: '',
    expertise: 'Enthusiast',
    location: ''
  });

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const user = await signInWithGoogle();
      if (user) {
        setUserData({
          ...userData,
          userId: user.uid,
          email: user.email || '',
          displayName: user.displayName || ''
        });
        setStep('DETAILS');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await registerUser(userData);
      onComplete();
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950">
      <div className="shrink-0 px-6 pt-4 pb-4 bg-slate-950 border-b border-slate-900 flex items-center gap-3">
        {onBack && <BackButton onClick={onBack} />}
        <div className="min-w-0">
          <h2 className="text-base font-black text-white uppercase tracking-tight leading-none flex items-center gap-2">
            <User className="w-4 h-4 text-amber-500" />
            Registration
          </h2>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-slate-900/50 p-8 rounded-3xl border border-slate-800 backdrop-blur-xl"
      >
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="mb-6">
            <Logo size="lg" />
          </div>
          <h2 className="text-2xl font-black text-slate-100 uppercase tracking-tight">
            Join DeeMech Pro
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            Secure your service history and access premium diagnostic tools.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs text-center">
            {error}
          </div>
        )}

        {step === 'LOGIN' ? (
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-4 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95"
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                SIGN IN WITH GOOGLE
              </>
            )}
          </button>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest px-2">Expertise</label>
              <div className="relative group">
                <Wrench className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-amber-500 transition-colors" />
                <select
                  value={userData.expertise}
                  onChange={(e) => setUserData({ ...userData, expertise: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-slate-200 outline-none transition-all appearance-none"
                >
                  <option value="Enthusiast">Enthusiast</option>
                  <option value="Apprentice">Apprentice</option>
                  <option value="Professional">Professional</option>
                  <option value="Master Mechanic">Master Mechanic</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest px-2">Location</label>
              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-amber-500 transition-colors" />
                <input
                  type="text"
                  placeholder="e.g. London, UK"
                  value={userData.location}
                  onChange={(e) => setUserData({ ...userData, location: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-slate-200 outline-none transition-all"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    COMPLETE REGISTRATION
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        <p className="text-[10px] text-slate-500 text-center mt-8 uppercase tracking-widest leading-relaxed">
          By registering, you agree to our <span className="text-amber-500/50">Terms of Service</span> and <span className="text-amber-500/50">Privacy Policy</span>. Data is stored securely in europe-west2.
        </p>
      </motion.div>
      </div>
    </div>
  );
};

export default Registration;
