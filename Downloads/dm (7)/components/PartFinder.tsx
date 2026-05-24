
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { searchParts, analyzeComponentVision } from '../services/geminiService';
import { GroundingChunk } from '../types';
import Markdown from 'react-markdown';
import { Camera, X, RefreshCw, Search, MapPin } from 'lucide-react';
import { resizeImage } from '../lib/imageUtils';
import BackButton from './BackButton';

interface PartFinderProps {
  onBack?: () => void;
}

const PartFinder: React.FC<PartFinderProps> = ({ onBack }) => {
  const [vehicle, setVehicle] = useState('');
  const [partDescription, setPartDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ text: string, sources: GroundingChunk[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Camera states
  const [isStreaming, setIsStreaming] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      setIsStreaming(true);
    } catch (err) {
      console.error("Camera error:", err);
      setError("Could not access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsStreaming(false);
  };

  useEffect(() => {
    if (isStreaming && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [isStreaming, stream]);

  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      const base64 = canvas.toDataURL('image/jpeg', 0.8);
      stopCamera();
      
      setLoading(true);
      try {
        const optimized = await resizeImage(base64);
        setPreviewImage(optimized);
        const identification = await analyzeComponentVision(optimized);
        setPartDescription(identification);
      } catch (err: any) {
        setError("Failed to identify part. You can still type it manually.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicle || !partDescription) return;

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      let location = undefined;
      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
        });
        location = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
      } catch (e) {
        console.warn("Location access denied or timed out", e);
      }

      const data = await searchParts(vehicle, partDescription, location);
      setResult(data as any);
    } catch (err: any) {
      setError(err.message || 'Failed to find part information. Please try again.');
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
            <Search size={16} className="text-amber-500" />
            Part Finder
          </h2>
        </div>
      </div>

      <div className="space-y-6 animate-in fade-in duration-500 pb-32 h-full overflow-y-auto no-scrollbar p-6">
      <div className="bg-slate-900/50 p-6 rounded-[2.5rem] border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center text-xl shadow-inner">
            <Search size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-tighter italic leading-none">Part Finder</h2>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Direct ID & Sourcing</p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Vehicle Details</label>
            <input 
              type="text" 
              placeholder="e.g. 2018 BMW 330i G20"
              value={vehicle}
              onChange={(e) => setVehicle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white text-sm focus:border-amber-500 outline-none placeholder:text-slate-700 transition-all shadow-inner"
              required
            />
          </div>

          <div className="space-y-2 relative">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Part Description</label>
            <div className="relative">
              <textarea 
                placeholder="e.g. Front brake pads with wear sensor"
                value={partDescription}
                onChange={(e) => setPartDescription(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 pr-14 text-white text-sm focus:border-amber-500 outline-none placeholder:text-slate-700 transition-all shadow-inner min-h-25"
                required
              />
              <button 
                type="button"
                onClick={startCamera}
                className="absolute right-3 top-3 w-10 h-10 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-amber-500 hover:bg-amber-500 hover:text-slate-950 transition-all active:scale-95"
                title="Scan Part"
              >
                <Camera size={18} />
              </button>
            </div>
            {previewImage && (
              <div className="mt-2 flex items-center gap-3 bg-slate-950 p-2 rounded-xl border border-slate-800">
                <img src={previewImage} alt="Scan Preview" className="w-12 h-12 rounded-lg object-cover" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Captured Sample</span>
                <button type="button" onClick={() => setPreviewImage(null)} className="ml-auto text-slate-700 hover:text-rose-500">
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${
              loading 
              ? 'bg-slate-800 text-slate-600 cursor-not-allowed' 
              : 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-[0_10px_30px_rgba(245,158,11,0.2)] active:scale-[0.98]'
            }`}
          >
            {loading ? (
              <>
                <RefreshCw className="animate-spin" size={16} />
                Searching...
              </>
            ) : (
              <>
                <Search size={16} />
                Identify & Locate
              </>
            )}
          </button>
        </form>
      </div>

      {/* Camera Overlay */}
      <AnimatePresence>
        {isStreaming && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex flex-col pt-safe"
          >
            <div className="flex justify-between items-center p-6 border-b border-slate-900">
              <h3 className="text-white font-black uppercase tracking-widest text-xs italic">Visual Part Identifier</h3>
              <button onClick={stopCamera} className="p-2 bg-slate-900 rounded-xl text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 relative">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              <div className="absolute inset-0 border-60 border-black/40 pointer-events-none flex items-center justify-center">
                <div className="w-64 h-64 border-2 border-amber-500/50 rounded-3xl"></div>
              </div>
            </div>
            <div className="p-8 flex justify-center bg-black">
              <button 
                onClick={captureImage}
                className="w-20 h-20 rounded-full bg-white border-8 border-amber-500/30 flex items-center justify-center shadow-2xl active:scale-90 transition-all"
              >
                <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center">
                  <Camera size={24} className="text-slate-950" />
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-5 bg-rose-500/10 border border-rose-500/20 rounded-4xl flex items-center gap-4"
          >
            <div className="w-10 h-10 bg-rose-500 rounded-full flex items-center justify-center text-white shrink-0 shadow-lg">
              <MapPin size={18} />
            </div>
            <p className="text-[11px] font-bold text-rose-200 uppercase tracking-wide leading-relaxed">{error}</p>
          </motion.div>
        )}

        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
              
              <div className="prose prose-invert prose-slate max-w-none">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px flex-1 bg-linear-to-r from-transparent to-slate-800"></div>
                  <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em]">Technical ID Report</span>
                  <div className="h-px flex-1 bg-linear-to-l from-transparent to-slate-800"></div>
                </div>
                <div className="markdown-body">
                  <Markdown>{result.text}</Markdown>
                </div>
              </div>

              {result.sources && result.sources.length > 0 && (
                <div className="mt-8 pt-8 border-t border-slate-800">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 ml-2">Verification Sources</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.sources.map((source, idx) => (
                      <a 
                        key={idx}
                        href={source.web?.uri || source.maps?.uri}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-[9px] font-bold text-slate-400 hover:text-amber-500 hover:border-amber-500/30 transition-all truncate max-w-50"
                      >
                        <i className={`fa-solid ${source.maps ? 'fa-location-dot' : 'fa-link'}`}></i>
                        {source.web?.title || source.maps?.title || 'Source'}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default PartFinder;
