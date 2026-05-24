import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Logo from './Logo';
import { User, LogIn, ChevronRight, Mail, Key, User as UserIcon, MapPin, Wrench } from 'lucide-react';
import { signInWithGoogle, registerWithEmail, loginWithEmail, registerUser } from '../services/firebaseService';
import BackButton from './BackButton';

interface RegistrationProps {
  onComplete: () => void;
  onBack?: () => void;
}

const Registration: React.FC<RegistrationProps> = ({ onComplete, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'AUTH_CHOICE' | 'LOGIN' | 'REGISTER' | 'DETAILS'>('AUTH_CHOICE');
  
  const [authData, setAuthData] = useState({ email: '', password: '', name: '' });
  
  const [userData, setUserData] = useState({
    userId: '',
    email: '',
    displayName: '',
    expertise: 'Enthusiast',
    location: ''
  });

  const handleGoogleLogin = async () => {
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
      setError(err.message || 'Google Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const user = await loginWithEmail(authData.email, authData.password);
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
      setError(err.message || 'Login failed. Check conditions.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const user = await registerWithEmail(authData.email, authData.password, authData.name);
      if (user) {
        setUserData({
          ...userData,
          userId: user.uid,
          email: user.email || authData.email,
          displayName: user.displayName || authData.name
        });
        setStep('DETAILS');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleFinalizeDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await registerUser(userData);
      onComplete();
    } catch (err: any) {
      setError(err.message || 'Failed to save user details to database');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-y-auto">
      <div className="shrink-0 px-6 pt-4 pb-4 bg-slate-950 border-b border-slate-900 flex items-center gap-3">
        {onBack && <BackButton onClick={() => step === 'AUTH_CHOICE' ? onBack() : setStep('AUTH_CHOICE')} />}
        <div className="min-w-0">
          <h2 className="text-base font-black text-white uppercase tracking-tight leading-none flex items-center gap-2">
            <User className="w-4 h-4 text-amber-500" />
            {step === 'REGISTER' ? 'Create Account' : step === 'LOGIN' ? 'Sign In' : step === 'DETAILS' ? 'Complete Profile' : 'Authentication'}
          </h2>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-slate-900/50 p-8 rounded-3xl border border-slate-800 backdrop-blur-xl shadow-xl shadow-black"
        >
          <div className="text-center mb-8 flex flex-col items-center">
            <div className="mb-6"><Logo size="lg" /></div>
            <h2 className="text-2xl font-black text-slate-100 uppercase tracking-tight">Join DeeMech Pro</h2>
            <p className="text-slate-400 text-sm mt-2">Powered by Firebase DB</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs text-center font-bold">
              {error}
            </div>
          )}

          {step === 'AUTH_CHOICE' && (
            <div className="space-y-4">
              <button onClick={() => setStep('LOGIN')} className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white font-black rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 border border-slate-700">
                <LogIn className="w-5 h-5 text-amber-500" /> SIGN IN (EXISTING USER)
              </button>
              <button onClick={() => setStep('REGISTER')} className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-amber-500/20">
                <UserIcon className="w-5 h-5" /> CREATE NEW ACCOUNT
              </button>
              
              <div className="relative py-4 flex items-center">
                <div className="flex-grow border-t border-slate-800"></div>
                <span className="shrink-0 mx-4 text-slate-500 text-[10px] uppercase font-bold">OR</span>
                <div className="flex-grow border-t border-slate-800"></div>
              </div>

              <button onClick={handleGoogleLogin} disabled={loading} className="w-full py-4 bg-white hover:bg-gray-100 text-slate-900 font-black rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95">
                <i className="fa-brands fa-google text-lg"></i> CONTINUE WITH GOOGLE
              </button>
            </div>
          )}

          {step === 'LOGIN' && (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input type="email" required placeholder="Email Address" value={authData.email} onChange={(e) => setAuthData({...authData, email: e.target.value})} className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-slate-200 outline-none" />
              </div>
              <div className="relative group">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input type="password" required placeholder="Password" value={authData.password} onChange={(e) => setAuthData({...authData, password: e.target.value})} className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-slate-200 outline-none" />
              </div>
              <button type="submit" disabled={loading} className="w-full py-4 bg-amber-500 text-slate-950 font-black rounded-2xl flex justify-center gap-2 mt-4">{loading ? "PROCESSING..." : "SIGN IN"}</button>
            </form>
          )}

          {step === 'REGISTER' && (
            <form onSubmit={handleEmailRegister} className="space-y-4">
              <div className="relative group">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input type="text" required placeholder="Full Name" value={authData.name} onChange={(e) => setAuthData({...authData, name: e.target.value})} className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-slate-200 outline-none" />
              </div>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input type="email" required placeholder="Email Address" value={authData.email} onChange={(e) => setAuthData({...authData, email: e.target.value})} className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-slate-200 outline-none" />
              </div>
              <div className="relative group">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input type="password" required placeholder="Create Password" value={authData.password} onChange={(e) => setAuthData({...authData, password: e.target.value})} className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-slate-200 outline-none" />
              </div>
              <button type="submit" disabled={loading} className="w-full py-4 bg-amber-500 text-slate-950 font-black rounded-2xl flex justify-center gap-2 mt-4">{loading ? "CREATING DB ACCOUNT..." : "CREATE ACCOUNT"}</button>
            </form>
          )}

          {step === 'DETAILS' && (
            <form onSubmit={handleFinalizeDetails} className="space-y-4">
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl mb-4 text-[10px] text-emerald-400 font-black tracking-widest text-center uppercase">
                <i className="fa-solid fa-check mr-2"></i> Auth Successful! Complete DB Profile.
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest px-2">Expertise</label>
                <div className="relative group">
                  <Wrench className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <select value={userData.expertise} onChange={(e) => setUserData({ ...userData, expertise: e.target.value })} className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-slate-200 outline-none appearance-none">
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
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input type="text" required placeholder="e.g. London, UK" value={userData.location} onChange={(e) => setUserData({ ...userData, location: e.target.value })} className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-slate-200 outline-none" />
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full py-4 bg-amber-500 text-slate-950 font-black rounded-2xl flex justify-center items-center gap-2 mt-6">
                {loading ? "SAVING TO DB..." : <><ChevronRight className="w-5 h-5" /> FINISH SETUP</>}
              </button>
            </form>
          )}

        </motion.div>
      </div>
    </div>
  );
};
export default Registration;
