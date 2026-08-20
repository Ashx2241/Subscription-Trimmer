'use client';

import { useEffect } from 'react';
import { ShieldAlert, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log sanitized error message without exposing stack traces to end-users
    console.error('Unhandled Application Error:', error.message);
  }, [error]);

  return (
    <div className="min-h-[70vh] bg-[#070a13] text-slate-100 flex flex-col items-center justify-center p-6 select-none">
      <div className="max-w-md w-full dark-card p-8 rounded-2xl border border-slate-800 text-center space-y-6 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto shadow-inner">
          <ShieldAlert className="w-8 h-8 stroke-[1.75]" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-widest bg-rose-500/10 px-2.5 py-1 rounded border border-rose-500/20">
            SYSTEM EXCEPTION
          </span>
          <h2 className="text-xl font-bold tracking-tight text-white mt-3">An Unexpected Error Occurred</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            The secure ledger caught an unexpected application error. Your data and bank credentials remain safe and protected.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Retry Request
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-medium text-xs border border-slate-800 transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" /> Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
