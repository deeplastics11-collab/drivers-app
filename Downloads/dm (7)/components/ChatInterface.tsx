import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { getGeminiResponse } from '../services/geminiService';
import { resizeImage } from '../lib/imageUtils';
import BackButton from './BackButton';

interface ChatInterfaceProps {
  onBack?: () => void;
  isPremium?: boolean;
  onUpgrade?: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onBack, isPremium, onUpgrade }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I am your AI Mechanic Assistant. What can I help you troubleshoot today?',
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (messages.length > 1) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() && !selectedImage) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
      image: selectedImage || undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setSelectedImage(null);
    setIsLoading(true);

    try {
      // Convert messages to Gemini history format
      const history = messages.slice(1).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));

      // Apply free tier limitation
      let finalInput = input || "Analyze this image";
      if (!isPremium) {
        finalInput += "\n\n[SYSTEM INSTRUCTION: The user is currently on the FREE tier. You MUST strictly limit your response to 1 or 2 short sentences. Give a very brief and concise answer. Do NOT provide a full detailed explanation.]";
      }

      const response = await getGeminiResponse(finalInput, history, userMessage.image);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response || "I'm sorry, I couldn't process that.",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Error connecting to service: ${error.message || 'Unknown error'}`,
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        try {
          const optimized = await resizeImage(base64);
          setSelectedImage(optimized);
        } catch (err) {
          console.error("Resize error:", err);
          setSelectedImage(base64);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950">
      {/* Header with back button */}
      <div className="shrink-0 px-6 pt-4 pb-4 bg-slate-950 border-b border-slate-900 flex items-center gap-3">
        {onBack && <BackButton onClick={onBack} />}
        <div className="min-w-0">
          <h2 className="text-base font-black text-white uppercase tracking-tight leading-none flex items-center gap-2">
            <i className="fa-solid fa-comments text-amber-500"></i>
            Tech Advisor
          </h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-4xl p-5 shadow-sm ${
              msg.role === 'user' 
              ? 'bg-amber-500 text-slate-950 rounded-br-none font-bold' 
              : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-bl-none'
            }`}>
              {msg.image && (
                <img src={msg.image} alt="Uploaded part" className="rounded-2xl mb-3 max-h-60 w-full object-cover border border-slate-700" />
              )}
              <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</div>
              
              {!isPremium && msg.role === 'assistant' && msg.id !== '1' && (
                <button 
                  onClick={onUpgrade}
                  className="mt-3 text-[10px] font-black uppercase tracking-widest text-amber-500 bg-amber-500/10 px-3 py-2 rounded-full hover:bg-amber-500/20 active:scale-95 transition-all text-left flex items-center gap-2 w-full sm:w-fit"
                >
                  <i className="fa-solid fa-lock text-amber-500"></i> Unlock Pro for Full Detail <i className="fa-solid fa-arrow-right ml-auto sm:ml-0"></i>
                </button>
              )}

              <div className={`text-[10px] opacity-40 mt-2 text-right ${msg.role === 'user' ? 'text-slate-900' : 'text-slate-500'}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-900 rounded-4xl px-5 py-4 border border-slate-800 rounded-bl-none">
              <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce delay-100"></div>
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="p-6 bg-slate-950 border-t border-slate-900">
        <div className="flex items-end gap-3">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-4 rounded-2xl bg-slate-900 text-slate-500 hover:text-amber-500 transition-colors border border-slate-800"
          >
            <i className="fa-solid fa-camera text-xl"></i>
          </button>
          <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" capture="environment" className="hidden" />
          
          <div className="flex-1 bg-slate-900 rounded-3xl px-4 py-1 flex items-center border border-slate-800">
             <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Type a symptom or code..."
              className="flex-1 bg-transparent text-white text-sm py-3 focus:outline-none resize-none max-h-32 placeholder:text-slate-700"
              rows={1}
            />
          </div>

          <button 
            onClick={handleSend}
            disabled={(!input.trim() && !selectedImage) || isLoading}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
              (input.trim() || selectedImage) && !isLoading
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' 
              : 'bg-slate-900 text-slate-700'
            }`}
          >
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
