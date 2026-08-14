'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { ShieldCheck, Check, Zap, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function BillingPage() {
  const [upgraded, setUpgraded] = useState(false);

  function handleUpgrade() {
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    setUpgraded(true);
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/20">
            TRANSPARENT MONETIZATION MODEL
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-100">
            Choose Your Subscription Trimmer Plan
          </h1>
          <p className="text-xs text-slate-400">
            Unlock automated legal letter dispatches, certified postal mail hooks, and priority concierge cancellations.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto pt-6">
          {/* Free Tier */}
          <div className="glass-panel p-8 rounded-2xl border border-slate-800 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-mono font-bold text-slate-400 uppercase">Basic Tier</span>
                <h3 className="text-2xl font-black text-slate-100 mt-1">Trimmer Basic</h3>
                <div className="text-3xl font-black text-slate-100 mt-2">$0.00 <span className="text-xs font-normal text-slate-400">/ forever</span></div>
              </div>

              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" /> Link up to 2 Bank Accounts
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" /> Automatic Subscription Detection Engine
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" /> Spending Metrics & Analytics Dashboard
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" /> 1 Guided Self-Cancellation / month
                </li>
              </ul>
            </div>

            <button className="w-full py-3 rounded-xl bg-slate-800 text-slate-400 font-bold text-xs cursor-default">
              Current Active Plan
            </button>
          </div>

          {/* Premium Tier */}
          <div className="glass-panel p-8 rounded-2xl border border-emerald-500/40 bg-emerald-950/10 space-y-6 flex flex-col justify-between emerald-glow relative overflow-hidden">
            <div className="absolute top-3 right-3 px-2.5 py-1 bg-emerald-500 text-slate-950 font-black text-[10px] uppercase rounded-full tracking-wider">
              RECOMMENDED
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Premium Automation Tier
                </span>
                <h3 className="text-2xl font-black text-slate-100 mt-1">Trimmer Pro</h3>
                <div className="text-3xl font-black text-emerald-400 mt-2">
                  $5.99 <span className="text-xs font-normal text-slate-400">/ month ($49.99/yr)</span>
                </div>
              </div>

              <ul className="space-y-3 text-xs text-slate-200">
                <li className="flex items-center gap-2 font-medium">
                  <Check className="w-4 h-4 text-emerald-400" /> Unlimited Bank & Credit Card Links
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <Check className="w-4 h-4 text-emerald-400" /> Unlimited AI Legal Notice Generators
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <Check className="w-4 h-4 text-emerald-400" /> USPS Certified Mail Postal Dispatches (Lob API)
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <Check className="w-4 h-4 text-emerald-400" /> Concierge Phone Line Proxy Calls
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <Check className="w-4 h-4 text-emerald-400" /> Automated Bill Price Negotiation
                </li>
              </ul>
            </div>

            <button
              onClick={handleUpgrade}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-emerald-500/20"
            >
              {upgraded ? '✓ Upgraded to Trimmer Pro!' : 'Upgrade to Trimmer Pro ($5.99/mo)'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
