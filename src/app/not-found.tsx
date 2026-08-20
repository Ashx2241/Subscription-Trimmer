import Link from 'next/link';
import { AlertOctagon, ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 flex flex-col items-center justify-center p-6 select-none">
      <div className="max-w-md w-full dark-card p-8 rounded-2xl border border-slate-800 text-center space-y-6 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto shadow-inner">
          <AlertOctagon className="w-8 h-8 stroke-[1.75]" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-500/20">
            HTTP 404
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-3">Page Not Found</h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            The resource or dashboard route you requested does not exist or has been relocated within the secure ledger environment.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-emerald-500 to-teal-400 text-slate-950 font-bold text-xs shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" /> Return to Dashboard
          </Link>
          <Link
            href="/subscriptions"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-medium text-xs border border-slate-800 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> View Subscriptions
          </Link>
        </div>
      </div>
    </div>
  );
}
