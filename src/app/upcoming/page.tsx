'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, AlertCircle, RefreshCw } from 'lucide-react';

interface UpcomingEvent {
  id: string;
  merchant: string;
  amount: number;
  date: string;
  daysLeft: number;
  category: string;
  status: string;
}

export default function UpcomingPage() {
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUpcoming = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/calendar');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setUpcomingEvents(data.data);
      }
    } catch (err) {
      console.error('Failed to load upcoming renewals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpcoming();
  }, []);

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header title="Upcoming Renewal Forecast" />

        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* Header Banner */}
          <div className="dark-card p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-100">Upcoming Charge Forecast</h1>
                  <p className="text-xs text-slate-400">Predicted recurring renewal dates derived from transaction cadence.</p>
                </div>
              </div>

              <button
                onClick={fetchUpcoming}
                disabled={loading}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-cyan-400 font-bold hover:bg-slate-800 transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 flex items-center gap-2 font-mono">
              <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Upcoming dates are estimates calculated from previous billing cadence patterns.</span>
            </div>
          </div>

          {/* Forecast Cards */}
          <div className="space-y-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={`skel-evt-${idx}`}
                  className="dark-card p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-skeleton"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-800/60" />
                    <div className="space-y-2">
                      <div className="w-32 h-4 bg-slate-800/60 rounded" />
                      <div className="w-44 h-3 bg-slate-800/40 rounded" />
                    </div>
                  </div>
                  <div className="flex items-center gap-4 justify-between sm:justify-end">
                    <div className="w-20 h-5 bg-slate-800/50 rounded" />
                    <div className="w-24 h-7 bg-slate-800/50 rounded-lg" />
                  </div>
                </div>
              ))
            ) : upcomingEvents.length === 0 ? (
              <div className="p-12 text-center dark-card rounded-2xl border border-slate-800 space-y-3 shadow-xl">
                <CalendarIcon className="w-10 h-10 text-slate-600 mx-auto stroke-1" />
                <h4 className="text-sm font-bold text-slate-200">No Upcoming Renewals Forecasted</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  No recurring subscription renewals detected in the upcoming 30-day forecast window.
                </p>
              </div>
            ) : (
              upcomingEvents.map((evt, idx) => (
                <motion.div
                  key={evt.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="dark-card p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#0b0f1d] border border-slate-800 flex flex-col items-center justify-center font-mono shrink-0 shadow-inner">
                      <span className="text-[9px] text-cyan-400 uppercase font-bold tracking-wider">DAYS</span>
                      <span className="text-base font-extrabold text-white">{evt.daysLeft}</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{evt.merchant}</h3>
                      <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5 font-mono">
                        <span>{evt.category}</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-cyan-400 font-medium">{evt.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 justify-between sm:justify-end">
                    <div className="text-right font-mono">
                      <div className="text-base font-bold text-amber-400">₹{evt.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                      <div className="text-[10px] text-slate-500">Estimated Charge</div>
                    </div>

                    {evt.status === 'CANCEL' ? (
                      <span className="px-3 py-1 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-mono font-bold">
                        FLAGGED TO CANCEL
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-lg bg-[#0b0f1d] text-slate-300 border border-slate-800 text-xs font-mono">
                        {evt.status}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
