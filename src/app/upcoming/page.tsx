'use client';

import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, AlertCircle, Clock, ArrowRight, ShieldAlert } from 'lucide-react';

export default function UpcomingPage() {
  const upcomingEvents = [
    { id: 'u1', merchant: 'ChatGPT Plus (OpenAI)', amount: 20.00, date: 'Tomorrow (Aug 15)', daysLeft: 1, category: 'SaaS & AI', status: 'REVIEW' },
    { id: 'u2', merchant: 'Adobe Creative Cloud', amount: 54.99, date: 'In 4 days (Aug 18)', daysLeft: 4, category: 'SaaS & Productivity', status: 'REVIEW' },
    { id: 'u3', merchant: 'Planet Fitness', amount: 24.99, date: 'In 6 days (Aug 20)', daysLeft: 6, category: 'Fitness & Health', status: 'CANCEL' },
    { id: 'u4', merchant: 'Spotify USA', amount: 16.99, date: 'In 18 days (Sep 1)', daysLeft: 18, category: 'Music & Audio', status: 'KEEP' },
    { id: 'u5', merchant: 'Netflix', amount: 15.99, date: 'In 31 days (Sep 14)', daysLeft: 31, category: 'Entertainment', status: 'REVIEW' },
  ];

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header title="Upcoming Renewal Forecast" />

        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* Header Banner */}
          <div className="dark-card p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <CalendarIcon className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-100">Upcoming Charge Forecast</h1>
                <p className="text-xs text-slate-400">Predicted recurring renewal dates derived from 12-month transaction deltas.</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 flex items-center gap-2 font-mono">
              <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Upcoming dates are estimates calculated from previous billing cadence patterns.</span>
            </div>
          </div>

          {/* Forecast Cards */}
          <div className="space-y-4">
            {upcomingEvents.map((evt, idx) => (
              <motion.div
                key={evt.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.08 }}
                className="dark-card p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center font-mono">
                    <span className="text-[10px] text-cyan-400 uppercase font-bold">DAYS</span>
                    <span className="text-base font-black text-slate-100">{evt.daysLeft}</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">{evt.merchant}</h3>
                    <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5 font-mono">
                      <span>{evt.category}</span>
                      <span>•</span>
                      <span className="text-cyan-400 font-semibold">{evt.date}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 justify-between sm:justify-end">
                  <div className="text-right font-mono">
                    <div className="text-base font-black text-amber-400">${evt.amount.toFixed(2)}</div>
                    <div className="text-[10px] text-slate-500">Estimated Charge</div>
                  </div>

                  {evt.status === 'CANCEL' ? (
                    <span className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-mono font-bold">
                      FLAGGED TO CANCEL
                    </span>
                  ) : (
                    <span className="px-3 py-1.5 rounded-lg bg-slate-900 text-slate-400 border border-slate-800 text-xs font-mono">
                      {evt.status}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
