'use client';

import { ShieldAlert, RefreshCw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className="h-full bg-[#070a13] text-slate-100">
      <body className="min-h-full flex items-center justify-center p-6 select-none bg-[#070a13]">
        <div className="max-w-md w-full p-8 rounded-2xl bg-[#0e1424] border border-slate-800 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto shadow-inner">
            <ShieldAlert className="w-8 h-8 stroke-[1.75]" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-widest bg-rose-500/10 px-2.5 py-1 rounded border border-rose-500/20">
              GLOBAL EXCEPTION
            </span>
            <h2 className="text-xl font-bold tracking-tight text-white mt-3">Critical Application Error</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              A critical root component error occurred. Sensitive data remains shielded and secure.
            </p>
          </div>

          <div className="pt-2 flex justify-center">
            <button
              onClick={() => reset()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs shadow-md transition-transform active:scale-95 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Reload Application
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
