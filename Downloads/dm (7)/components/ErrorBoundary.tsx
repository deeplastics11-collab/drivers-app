
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-20 h-20 bg-rose-500/10 text-rose-500 rounded-3xl flex items-center justify-center mb-6 border border-rose-500/20">
            <i className="fa-solid fa-triangle-exclamation text-3xl"></i>
          </div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight mb-2">System Fault Detected</h1>
          <p className="text-slate-400 text-sm max-w-xs mb-8 leading-relaxed">
            The application encountered an unexpected error. This has been logged for the shop foreman.
          </p>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-8 w-full max-w-md text-left overflow-auto max-h-40">
            <p className="text-rose-400 font-mono text-xs break-all">
              {this.state.error?.message || 'Unknown Error'}
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-amber-500 text-slate-950 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
          >
            Restart Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
