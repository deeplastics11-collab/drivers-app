
import React, { useState, useRef } from 'react';

interface VoiceDictationProps {
  onTranscript: (text: string) => void;
  className?: string;
}

const VoiceDictation: React.FC<VoiceDictationProps> = ({ onTranscript, className }) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("SpeechRecognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  return (
    <button
      onClick={isListening ? stopListening : startListening}
      className={`${className} transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-amber-500'}`}
    >
      <i className={`fa-solid ${isListening ? 'fa-stop' : 'fa-microphone'}`}></i>
    </button>
  );
};

export default VoiceDictation;
