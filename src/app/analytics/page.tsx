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
  const [, setLoading] = useState(true);

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
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-400 text-xs font-mono font-semibold border border-indigo-500/20">
              FINANCIAL ANALYTICS
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-100 mt-1">
            Personal Spending Insights & Projections
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Comprehensive breakdown of recurring cost concentration, category distributions, and annual projections.
          </p>
        </div>

        {/* Hero Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-xs font-medium text-slate-400 uppercase">Monthly Equivalent</span>
            <div className="text-2xl font-black text-slate-100">${data?.metrics.totalMonthlySpend.toFixed(2) || '0.00'}</div>
            <p className="text-[10px] text-slate-500">Calculated across all active cadences</p>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-xs font-medium text-slate-400 uppercase">Annual Expenditure</span>
            <div className="text-2xl font-black text-slate-100">${data?.metrics.totalAnnualSpend.toFixed(2) || '0.00'}</div>
            <p className="text-[10px] text-slate-500">Annualized projection</p>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-xs font-medium text-slate-400 uppercase">Targeted Cancellations</span>
            <div className="text-2xl font-black text-amber-400">${data?.metrics.potentialAnnualSavings.toFixed(2) || '0.00'}</div>
            <p className="text-[10px] text-slate-500">Pending cancellation requests</p>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/10 space-y-1 emerald-glow">
            <span className="text-xs font-semibold text-emerald-400 uppercase">Confirmed Savings</span>
            <div className="text-2xl font-black text-emerald-400">${data?.metrics.confirmedAnnualSavings.toFixed(2) || '0.00'}</div>
            <p className="text-[10px] text-emerald-300 font-medium">Locked annual savings</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-slate-100">Historical Monthly Spend Trend</h3>
            <div className="h-72 w-full">
              {data?.spendTrend ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.spendTrend}>
                    <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                      formatter={(val: unknown) => [`$${val}`, 'Monthly Spend']}
                    />
                    <Bar dataKey="spend" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-500">Loading charts...</div>
              )}
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-slate-100">Category Concentration</h3>
            <div className="h-56 w-full flex items-center justify-center">
              {data?.categoryBreakdown ? (
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
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                      formatter={(val: unknown) => [`$${val}/mo`, 'Cost']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-xs text-slate-500">Loading breakdown...</div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
