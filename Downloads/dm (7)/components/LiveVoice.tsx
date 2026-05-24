
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import { createPcmBlob, decodeAudioData, decodeBase64 } from '../services/geminiService';
import BackButton from './BackButton';

interface LiveVoiceProps {
  onBack?: () => void;
}

const LiveVoice: React.FC<LiveVoiceProps> = ({ onBack }) => {
  const [isActive, setIsActive] = useState(false);
  const [transcription, setTranscription] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const sessionRef = useRef<any>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef<number>(0);

  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  const stopSession = () => {
    setIsActive(false);
    if (sessionRef.current) {
      try {
        sessionRef.current.close?.();
      } catch (e) {
        console.error("Error closing session:", e);
      }
      sessionRef.current = null;
    }
    
    if (scriptProcessorRef.current) {
      scriptProcessorRef.current.disconnect();
      scriptProcessorRef.current = null;
    }
    if (mediaStreamSourceRef.current) {
      mediaStreamSourceRef.current.disconnect();
      mediaStreamSourceRef.current = null;
    }

    inputAudioContextRef.current?.close();
    outputAudioContextRef.current?.close();
    inputAudioContextRef.current = null;
    outputAudioContextRef.current = null;
  };

  const startSession = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ai = new GoogleGenAI({ apiKey: "AIzaSyA6HB7aWNr9PV7J2Tng0WDkdWuy6o0_ISA" });
      
      inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-3.1-flash-live-preview',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Charon' } }
          },
          systemInstruction: "You are a hands-free mechanic assistant. Be concise. Provide step-by-step instructions. If the mechanic asks for a torque spec, provide it immediately. Safety is your top priority.",
          inputAudioTranscription: {},
          outputAudioTranscription: {},
        },
        callbacks: {
          onopen: () => {
            setIsActive(true);
            const source = inputAudioContextRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
            
            mediaStreamSourceRef.current = source;
            scriptProcessorRef.current = scriptProcessor;

            scriptProcessor.onaudioprocess = (e) => {
              if (sessionRef.current && isActive) {
                const inputData = e.inputBuffer.getChannelData(0);
                const pcmBlob = createPcmBlob(inputData);
                sessionRef.current.sendRealtimeInput({ audio: pcmBlob });
              }
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContextRef.current!.destination);
          },
          onmessage: async (message) => {
            // Handle Transcription
            if (message.serverContent?.inputTranscription?.text) {
              setTranscription(prev => prev + ' ' + message.serverContent?.inputTranscription?.text);
            }
            if (message.serverContent?.outputTranscription?.text) {
              setAiResponse(prev => prev + ' ' + message.serverContent?.outputTranscription?.text);
            }
            if (message.serverContent?.turnComplete) {
              setTranscription('');
              setAiResponse('');
            }

            // Handle Audio
            const audioData = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audioData && outputAudioContextRef.current) {
              const ctx = outputAudioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              
              try {
                const buffer = await decodeAudioData(decodeBase64(audioData), ctx, 24000, 1);
                const source = ctx.createBufferSource();
                source.buffer = buffer;
                source.connect(ctx.destination);
                source.addEventListener('ended', () => sourcesRef.current.delete(source));
                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += buffer.duration;
                sourcesRef.current.add(source);
              } catch (e) {
                console.error("Error decoding audio:", e);
              }
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            console.error("Live Session Error:", e);
            const errorMessage = e?.message || String(e);
            if (errorMessage.includes("403") || errorMessage.includes("PERMISSION_DENIED")) {
              setError("Access Denied (403): Your API key may not have permission for the Live API. Please use the \"Select API Key\" button on the dashboard to provide your own key.");
            } else if (errorMessage.includes("429") || errorMessage.includes("RESOURCE_EXHAUSTED")) {
              setError("Rate Limit Exceeded (429): Too many requests. Please wait a moment.");
            } else {
              setError("Connection error. Ensure your microphone is allowed and your internet is stable.");
            }
            stopSession();
          },
          onclose: () => {
            console.log("Live Session Closed");
            stopSession();
          }
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setError("Failed to start voice session. Check permissions and API key.");
      setIsActive(false);
    }
  };

  useEffect(() => {
    return () => stopSession();
  }, []);

  return (
    <div className="flex flex-col h-full bg-slate-950">
      {/* Header with back button */}
      <div className="shrink-0 px-6 pt-4 pb-4 bg-slate-950 border-b border-slate-900 flex items-center gap-3">
        {onBack && <BackButton onClick={onBack} />}
        <div className="min-w-0">
          <h2 className="text-base font-black text-white uppercase tracking-tight leading-none flex items-center gap-2">
            <i className="fa-solid fa-microphone text-amber-500"></i>
            Hands-Free Assist
          </h2>
        </div>
      </div>

      <div className="h-full p-6 flex flex-col items-center justify-center text-center space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Hands-Free Assist</h2>
        <p className="text-slate-400 text-sm max-w-xs mx-auto">
          Talk to me while you work. Ask for torque specs, wiring colors, or troubleshooting steps without touching your phone.
        </p>
      </div>

      <div className="relative">
        <button 
          onClick={isActive ? stopSession : startSession}
          className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl relative z-10 ${
            isActive ? 'bg-red-500 animate-pulse' : 'bg-amber-500'
          }`}
        >
          <i className={`fa-solid ${isActive ? 'fa-stop' : 'fa-microphone'} text-slate-900 text-4xl`}></i>
        </button>
        {isActive && (
          <div className="absolute inset-0 w-32 h-32 rounded-full border-4 border-red-500/50 animate-ping"></div>
        )}
      </div>

      <div className="w-full space-y-4">
        {isActive ? (
          <div className="space-y-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700 min-h-30">
            <p className="text-amber-400 text-xs font-bold uppercase tracking-widest">Live Status: Listening...</p>
            {transcription && (
              <p className="text-slate-300 text-sm italic">"{transcription}"</p>
            )}
            {aiResponse && (
              <p className="text-white text-base font-medium">{aiResponse}</p>
            )}
          </div>
        ) : (
          <div className="text-slate-500 text-sm">
            Tap the button to start a voice conversation.
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-500/10 text-red-500 p-4 rounded-lg border border-red-500/20 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 w-full">
        <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
          <p className="text-[10px] text-slate-500 mb-1">TRY ASKING</p>
          <p className="text-xs text-slate-300">"What is the torque spec for a 2018 Camry lug nut?"</p>
        </div>
        <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
          <p className="text-[10px] text-slate-500 mb-1">TRY ASKING</p>
          <p className="text-xs text-slate-300">"Troubleshoot a P0300 misfire on a Ford F-150."</p>
        </div>
      </div>
      </div>
    </div>
  );
};

export default LiveVoice;
