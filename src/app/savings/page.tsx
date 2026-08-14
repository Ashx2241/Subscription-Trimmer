'use client';

import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { motion } from 'framer-motion';
import { TrendingDown, ShieldCheck, DollarSign, CheckCircle2, Scissors, ArrowRight } from 'lucide-react';

export default function SavingsPage() {
  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header title="Financial Savings Tracker" />

        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* Header Card */}
          <div className="dark-card p-6 rounded-2xl border border-slate-800 space-y-2">
            <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-emerald-400" /> Subscription Savings Tracker
            </h1>
            <p className="text-xs text-slate-400">
              Track confirmed savings and potential annualized cost reductions from completed cancellation workflows.
            </p>
          </div>

          {/* Savings Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="dark-card p-5 rounded-2xl border border-slate-800 space-y-1">
              <div className="text-xs font-mono text-slate-400">Potential Annual Savings</div>
              <div className="text-2xl font-black text-emerald-400 font-mono">$299.88 / yr</div>
              <div className="text-[10px] text-slate-500 font-mono">1 subscription flagged for cancellation</div>
            </div>

            <div className="dark-card p-5 rounded-2xl border border-slate-800 space-y-1">
              <div className="text-xs font-mono text-slate-400">Confirmed Annualized Reduction</div>
              <div className="text-2xl font-black text-cyan-400 font-mono">$299.88 / yr</div>
              <div className="text-[10px] text-emerald-400 font-mono">Verified cancellation notices sent</div>
            </div>

            <div className="dark-card p-5 rounded-2xl border border-slate-800 space-y-1">
              <div className="text-xs font-mono text-slate-400">Monthly Expense Reduction</div>
              <div className="text-2xl font-black text-amber-400 font-mono">$24.99 / mo</div>
              <div className="text-[10px] text-slate-500 font-mono">Planet Fitness ($24.99/mo)</div>
            </div>
          </div>

          {/* Cancelled Services List */}
          <div className="dark-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-200">Cancelled Subscriptions History</h3>

            <div className="p-4 rounded-xl bg-[#0b0f1d] border border-slate-800 flex justify-between items-center text-xs font-mono">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-200">Planet Fitness</div>
                  <div className="text-[10px] text-slate-500">Notice authorized on Aug 14, 2026</div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-bold text-emerald-400">+$299.88 Annual Savings</div>
                <div className="text-[10px] text-slate-500">$24.99 / month</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
