'use client';

import Link from 'next/link';
import { Scissors, ShieldCheck, Zap, ArrowRight, CheckCircle2, Lock, PieChart, CreditCard, AlertOctagon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Header Navigation */}
      <header className="max-w-7xl mx-auto px-6 h-20 w-full flex items-center justify-between border-b border-slate-800/80 sticky top-0 z-50 bg-[#070a13]/90 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-emerald-500 to-pink-500 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0b0f1d] rounded-[10px] flex items-center justify-center text-cyan-400">
              <Scissors className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
          <div>
            <span className="text-lg font-black tracking-tight text-white">Trimmer<span className="text-cyan-400">AI</span></span>
            <span className="block text-[10px] text-slate-400 font-mono">FinTech Co-Pilot</span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/login" className="text-xs font-bold text-slate-300 hover:text-cyan-400 transition-colors">
            Sign In
          </Link>
          <Link
            href="/register"
            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-emerald-500 to-teal-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-teal-400 transition-all flex items-center gap-2"
          >
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-16 space-y-24">
        <section className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-semibold">
            <ShieldCheck className="w-4 h-4" /> PRIVACY-FIRST BANKING CO-PILOT
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-100 leading-tight">
            Find the subscriptions <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-teal-300 bg-clip-text text-transparent">draining your money.</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Connect your accounts securely, discover forgotten recurring charges automatically, and take back control of subscriptions you no longer need.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/register"
              className="w-full sm:w-auto py-3.5 px-8 rounded-xl bg-gradient-to-r from-cyan-500 via-emerald-500 to-teal-500 text-slate-950 font-extrabold text-sm shadow-xl shadow-cyan-500/20 hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/onboarding"
              className="w-full sm:w-auto py-3.5 px-8 rounded-xl bg-[#0e1424] border border-slate-800 text-slate-200 font-bold text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
            >
              How It Works
            </Link>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="dark-card p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100">AI Subscription Engine</h3>
            <p className="text-xs text-slate-400">
              Scans historical bank transaction intervals to spot weekly, monthly, and annual recurring charges with 99% accuracy.
            </p>
          </div>

          <div className="dark-card p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Cancellation Center</h3>
            <p className="text-xs text-slate-400">
              Generates California ARL & FTC compliant AI cancellation emails with step-by-step merchant guides.
            </p>
          </div>

          <div className="dark-card p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center border border-pink-500/20">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Zero Credential Access</h3>
            <p className="text-xs text-slate-400">
              Read-only OAuth bank connectivity with no move-money permissions and zero raw credential storage.
            </p>
          </div>
        </section>
      </main>

      <footer className="max-w-7xl mx-auto px-6 py-8 w-full border-t border-slate-800/80 text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>© 2026 Subscription Trimmer AI. All rights reserved.</div>
        <div className="flex items-center gap-4 font-mono">
          <Link href="/privacy" className="hover:text-slate-300">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-slate-300">Terms of Service</Link>
          <Link href="/security" className="hover:text-slate-300">Security Architecture</Link>
        </div>
      </footer>
    </div>
  );
}
