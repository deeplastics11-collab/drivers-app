
import React, { useState } from 'react';
import { getDiagnosticQuestions, getFinalDiagnosticReport } from '../services/geminiService';
import BackButton from './BackButton';

enum Step {
  INITIAL = 0,
  QUESTIONS = 1,
  REPORT = 2
}

interface GuidedDiagnosticProps {
  onBack?: () => void;
}

const GuidedDiagnostic: React.FC<GuidedDiagnosticProps> = ({ onBack }) => {
  const [step, setStep] = useState<Step>(Step.INITIAL);
  const [vehicle, setVehicle] = useState('');
  const [symptom, setSymptom] = useState('');
  const [questions, setQuestions] = useState<string>('');
  const [answers, setAnswers] = useState('');
  const [report, setReport] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    if (!vehicle || !symptom) return;
    setLoading(true);
    setQuestions('');
    try {
      const q = await getDiagnosticQuestions(symptom, vehicle);
      setQuestions(q || "No questions generated.");
      setStep(Step.QUESTIONS);
    } catch (e: any) {
      setQuestions(e.message || "Failed to generate questions.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!answers) return;
    setLoading(true);
    setReport('');
    try {
      const r = await getFinalDiagnosticReport(symptom, vehicle, answers);
      setReport(r || "Failed to generate report.");
      setStep(Step.REPORT);
    } catch (e: any) {
      setReport(e.message || "Failed to generate diagnostic report.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep(Step.INITIAL);
    setSymptom('');
    setAnswers('');
    setReport('');
    setQuestions('');
  };

  return (
    <div className="flex flex-col h-full bg-slate-950">
      <div className="shrink-0 px-6 pt-4 pb-4 bg-slate-950 border-b border-slate-900 flex items-center gap-3">
        {onBack && <BackButton onClick={onBack} />}
        <div className="min-w-0">
          <h2 className="text-base font-black text-white uppercase tracking-tight leading-none flex items-center gap-2">
            <i className="fa-solid fa-wand-magic-sparkles text-amber-500"></i>
            Smart Assistant
          </h2>
        </div>
      </div>

      <div className="p-6 space-y-6 animate-in fade-in duration-700 bg-slate-950 overflow-y-auto flex-1">
      <div className="relative">
        {/* Progress Dots */}
        <div className="flex items-center gap-2 mb-6">
          {[0, 1, 2].map((i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-500 ${step === i ? 'w-8 bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'w-2 bg-slate-800'}`}
            />
          ))}
        </div>

        {step === Step.INITIAL && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Vehicle Details</label>
                <input 
                  type="text" 
                  placeholder="e.g. 2018 Jeep Wrangler 3.6L"
                  value={vehicle}
                  onChange={(e) => setVehicle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-amber-500 outline-none transition-all placeholder:text-slate-700"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Primary Symptom</label>
                <textarea 
                  placeholder="e.g. Squealing noise from front left when braking at low speeds..."
                  value={symptom}
                  onChange={(e) => setSymptom(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-amber-500 outline-none transition-all min-h-30 placeholder:text-slate-700"
                />
              </div>
            </div>
            <button 
              onClick={handleStart}
              disabled={loading || !vehicle || !symptom}
              className="w-full bg-amber-500 text-slate-950 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <i className="fa-solid fa-cog fa-spin"></i> : 'Begin Assessment'}
            </button>
          </div>
        )}

        {step === Step.QUESTIONS && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
            <div className="bg-slate-900/50 p-6 rounded-4xl border border-slate-800">
              <h3 className="text-amber-500 text-[10px] font-black uppercase tracking-widest mb-4">Shop Foreman Questions:</h3>
              <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                {questions}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1 text-wrap">Your Answers</label>
              <textarea 
                placeholder="1. It's a high pitched chirp. 2. Only after driving 10 km. 3. No recent work done..."
                value={answers}
                onChange={(e) => setAnswers(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-amber-500 outline-none transition-all min-h-37.5 placeholder:text-slate-700"
              />
            </div>
            <button 
              onClick={handleGenerateReport}
              disabled={loading || !answers}
              className="w-full bg-amber-500 text-slate-950 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <i className="fa-solid fa-cog fa-spin"></i> : 'Generate Report'}
            </button>
          </div>
        )}

        {step === Step.REPORT && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
            <div className="bg-slate-900 border border-slate-800 rounded-4xl overflow-hidden shadow-2xl">
              <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
                <span className="text-amber-500 font-black text-[10px] uppercase tracking-widest">Diagnostic Verdict</span>
                <i className="fa-solid fa-clipboard-check text-slate-700"></i>
              </div>
              <div className="p-6 prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed whitespace-pre-wrap">
                {report}
              </div>
            </div>
            <button 
              onClick={reset}
              className="w-full bg-slate-900 border border-slate-800 text-slate-400 py-4 rounded-2xl font-black uppercase tracking-widest text-xs active:scale-95 transition-all"
            >
              Start New Diagnostic
            </button>
          </div>
        )}
      </div>

      {/* Helper Card */}
      {step !== Step.REPORT && (
        <div className="p-4 bg-slate-900/30 rounded-2xl border border-dashed border-slate-800 flex items-center gap-4">
          <i className="fa-solid fa-info-circle text-slate-700"></i>
          <p className="text-[11px] text-slate-600 font-medium">This workflow uses logic from millions of technician reports to narrow down the cause before you even touch a wrench.</p>
        </div>
      )}
      </div>
    </div>
  );
};

export default GuidedDiagnostic;