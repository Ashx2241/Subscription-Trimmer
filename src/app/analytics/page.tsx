'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface AnalyticsData {
  metrics: {
    totalActiveSubscriptions: number;
    totalMonthlySpend: number;
    totalAnnualSpend: number;
    potentialAnnualSavings: number;
    confirmedAnnualSavings: number;
  };
  categoryBreakdown: { category: string; monthlyCost: number; count: number }[];
  spendTrend: { month: string; spend: number }[];
}

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899', '#64748b'];

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);
        const res = await fetch('/api/analytics');
        const result = await res.json();
        if (result.success) {
          setData(result.data);
        }
      } catch (err) {
        console.error('Error loading analytics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 text-xs font-mono font-semibold border border-indigo-500/20">
              FINANCIAL ANALYTICS
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
            Spending Insights & Projections
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Comprehensive breakdown of recurring cost concentration, category distributions, and annual projections.
          </p>
        </div>

        {/* Hero Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {loading ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <div key={`skel-metric-${idx}`} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2 animate-skeleton">
                <div className="w-24 h-3 bg-slate-800/60 rounded" />
                <div className="w-32 h-7 bg-slate-800/60 rounded" />
                <div className="w-40 h-2.5 bg-slate-800/40 rounded" />
              </div>
            ))
          ) : (
            <>
              <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider font-mono">Monthly Equivalent</span>
                <div className="text-2xl font-bold font-mono text-white">₹{data?.metrics.totalMonthlySpend.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</div>
                <p className="text-[10px] text-slate-500">Calculated across all active cadences</p>
              </div>

              <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider font-mono">Annual Expenditure</span>
                <div className="text-2xl font-bold font-mono text-white">₹{data?.metrics.totalAnnualSpend.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</div>
                <p className="text-[10px] text-slate-500">Annualized recurring projection</p>
              </div>

              <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider font-mono">Targeted Cancellations</span>
                <div className="text-2xl font-bold font-mono text-amber-400">₹{data?.metrics.potentialAnnualSavings.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</div>
                <p className="text-[10px] text-slate-500">Pending cancellation requests</p>
              </div>

              <div className="glass-card p-5 rounded-2xl border border-emerald-500/20 bg-emerald-950/10 space-y-1">
                <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider font-mono">Confirmed Savings</span>
                <div className="text-2xl font-bold font-mono text-emerald-400">₹{data?.metrics.confirmedAnnualSavings.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</div>
                <p className="text-[10px] text-emerald-300/80 font-medium">Locked annual savings</p>
              </div>
            </>
          )}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Historical Monthly Spend Trend</h3>
            <div className="h-72 w-full">
              {loading ? (
                <div className="h-full w-full bg-slate-800/20 rounded-xl animate-skeleton" />
              ) : data?.spendTrend && data.spendTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.spendTrend}>
                    <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0e1424', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                      formatter={(val: unknown) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Monthly Spend']}
                    />
                    <Bar dataKey="spend" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-500 font-mono">No historical spend data yet.</div>
              )}
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Category Concentration</h3>
            <div className="h-72 w-full flex items-center justify-center">
              {loading ? (
                <div className="h-full w-full bg-slate-800/20 rounded-xl animate-skeleton" />
              ) : data?.categoryBreakdown && data.categoryBreakdown.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.categoryBreakdown}
                      dataKey="monthlyCost"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={50}
                    >
                      {data.categoryBreakdown.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0e1424', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                      formatter={(val: unknown) => [`₹${Number(val).toLocaleString('en-IN')}/mo`, 'Cost']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-xs text-slate-500 font-mono">No category breakdown available.</div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
