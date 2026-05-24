
import React, { useRef, useState } from 'react';
import { analyzeComponentVision } from '../services/geminiService';
import { Camera, Upload, RefreshCw, X, Info, AlertTriangle, Settings, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { resizeImage } from '../lib/imageUtils';
import Markdown from 'react-markdown';
import BackButton from './BackButton';

interface VisualDiagnosticProps {
  onBack?: () => void;
}

const VisualDiagnostic: React.FC<VisualDiagnosticProps> = ({ onBack }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [camError, setCamError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
    setCamError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      setStream(mediaStream);
      setIsStreaming(true);
      setPreviewImage(null);
    } catch (err: any) {
      console.error("Camera error:", err);
      if (window.self !== window.top) {
        setCamError("Camera access is blocked in preview. Please open the app in a new tab to use the scanner.");
      } else {
        setCamError("Could not access camera. Please ensure permissions are granted.");
      }
    }
  };

  // Effect to attach stream when video element becomes available
  React.useEffect(() => {
    if (isStreaming && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [isStreaming, stream]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      try {
        const optimized = await resizeImage(base64);
        setPreviewImage(optimized);
        stopCamera();
        analyzeImage(optimized);
      } catch (err) {
        console.error("Scale error:", err);
        setPreviewImage(base64);
        stopCamera();
        analyzeImage(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      const base64 = canvas.toDataURL('image/jpeg', 0.8);
      
      resizeImage(base64).then(optimized => {
        setPreviewImage(optimized);
        stopCamera();
        analyzeImage(optimized);
      }).catch(() => {
        setPreviewImage(base64);
        stopCamera();
        analyzeImage(base64);
      });
    }
  };

  const analyzeImage = async (base64: string) => {
    setLoading(true);
    setResult(null);
    try {
      const data = await analyzeComponentVision(base64);
      setResult(data);
    } catch (e: any) {
      setResult(e.message || "Analysis failed. Please ensure the part is clearly visible and well-lit.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setPreviewImage(null);
    setIsStreaming(false);
    setCamError(null);
  };

  const openInNewTab = () => {
    window.open(window.location.href, '_blank');
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-900 bg-slate-950/50 backdrop-blur-xl flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          {onBack && <BackButton onClick={onBack} />}
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
              <Camera className="text-amber-500" size={20} />
              AI Part Scanner
            </h2>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">Visual Identification Engine</p>
          </div>
        </div>
        {(previewImage || isStreaming || camError) && (
          <button onClick={reset} className="p-2 bg-slate-900 rounded-xl text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        )}
      </div>

      <div className="flex-1 relative overflow-hidden flex flex-col">
        <AnimatePresence mode="wait">
          {camError ? (
            <motion.div 
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col items-center justify-center p-8 space-y-6 text-center"
            >
              <div className="w-20 h-20 bg-rose-500/10 text-rose-500 rounded-3xl flex items-center justify-center shadow-2xl">
                <AlertTriangle size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">Access Denied</h3>
                <p className="text-slate-400 text-sm max-w-[280px] mx-auto leading-relaxed">
                  {camError}
                </p>
              </div>
              <button 
                onClick={openInNewTab}
                className="bg-amber-500 text-slate-950 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-amber-500/20 flex items-center gap-3"
              >
                <ExternalLink size={16} />
                Open in New Tab
              </button>
              <button onClick={reset} className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Cancel</button>
            </motion.div>
          ) : !isStreaming && !previewImage ? (
            <motion.div 
              key="initial"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="flex-1 flex flex-col items-center justify-center p-8 space-y-8 text-center"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-amber-500/20 blur-3xl rounded-full"></div>
                <div className="relative w-32 h-32 bg-slate-900 border-2 border-slate-800 rounded-[2.5rem] flex items-center justify-center shadow-2xl">
                  <Camera size={48} className="text-amber-500" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">Identify Any Part</h3>
                <p className="text-slate-400 text-sm max-w-[280px] mx-auto leading-relaxed">
                  Upload a photo or use your camera to get instant specs, failure symptoms, and repair advice.
                </p>
              </div>

              <div className="w-full max-w-xs space-y-3">
                <button 
                  onClick={startCamera}
                  className="w-full bg-amber-500 text-slate-950 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-amber-500/20 flex items-center justify-center gap-3 active:scale-95 transition-all"
                >
                  <Camera size={18} />
                  Use Camera
                </button>
                
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs border border-slate-800 flex items-center justify-center gap-3 active:scale-95 transition-all"
                >
                  <Upload size={18} />
                  Upload Image
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  capture="environment"
                  onChange={handleFileUpload} 
                />
              </div>
            </motion.div>
          ) : isStreaming ? (
            <motion.div 
              key="camera"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 relative bg-black"
            >
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none flex items-center justify-center">
                <div className="w-64 h-64 border-2 border-amber-500/50 rounded-3xl relative">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-amber-500 -mt-1 -ml-1 rounded-tl-lg"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-amber-500 -mt-1 -mr-1 rounded-tr-lg"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-amber-500 -ml-1 -mb-1 rounded-bl-lg"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-amber-500 -mr-1 -mb-1 rounded-br-lg"></div>
                </div>
              </div>
              
              <div className="absolute bottom-12 left-0 right-0 flex justify-center items-center gap-8">
                <button 
                  onClick={stopCamera}
                  className="w-12 h-12 rounded-2xl bg-slate-900/80 backdrop-blur-md text-white flex items-center justify-center border border-slate-700"
                >
                  <X size={20} />
                </button>
                <button 
                  onClick={captureImage}
                  className="w-20 h-20 rounded-full bg-white border-8 border-amber-500/30 flex items-center justify-center shadow-2xl active:scale-90 transition-all"
                >
                  <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center">
                    <Camera size={24} className="text-slate-950" />
                  </div>
                </button>
                <div className="w-12 h-12"></div> {/* Spacer */}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              <div className="relative h-64 bg-slate-900 shrink-0">
                <img src={previewImage!} alt="Preview" className="w-full h-full object-contain" />
                {loading && (
                  <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm flex flex-col items-center justify-center space-y-4">
                    <RefreshCw className="text-amber-500 animate-spin" size={40} />
                    <p className="text-amber-500 font-black uppercase tracking-[0.2em] text-[10px]">Analyzing Component...</p>
                  </div>
                )}
              </div>

              <div className="flex-1 bg-slate-950 p-6 overflow-y-auto no-scrollbar pb-32">
                {result ? (
                  <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-slate-900/50 border border-slate-800 rounded-[2rem] p-6 shadow-2xl">
                       <div className="flex items-center gap-2 text-amber-500 mb-6 font-black uppercase tracking-[0.2em] text-[10px]">
                          <Info size={14} />
                          Identification Report
                       </div>
                       <div className="markdown-body">
                          <Markdown>{result}</Markdown>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-rose-500/5 border border-rose-500/10 p-4 rounded-2xl">
                        <AlertTriangle className="text-rose-500 mb-2" size={18} />
                        <h5 className="text-white font-bold text-[10px] uppercase tracking-wider">Safety First</h5>
                        <p className="text-slate-400 text-[10px] mt-1">Always use jack stands and wear eye protection.</p>
                      </div>
                      <div className="bg-sky-500/5 border border-sky-500/10 p-4 rounded-2xl">
                        <Settings className="text-sky-500 mb-2" size={18} />
                        <h5 className="text-white font-bold text-[10px] uppercase tracking-wider">Pro Tip</h5>
                        <p className="text-slate-400 text-[10px] mt-1">Check for TSBs related to this part before replacing.</p>
                      </div>
                    </div>

                    <button 
                      onClick={reset}
                      className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs border border-slate-800 active:scale-95 transition-all"
                    >
                      Scan Another Part
                    </button>
                  </div>
                ) : !loading && (
                  <div className="text-center py-12">
                    <p className="text-slate-500 text-sm">Something went wrong. Please try again.</p>
                    <button onClick={reset} className="mt-4 text-amber-500 font-bold uppercase text-xs">Go Back</button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default VisualDiagnostic;
