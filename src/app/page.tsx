'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import {
  DollarSign,
  TrendingDown,
  Calendar,
  AlertTriangle,
  ArrowRight,
  Scissors,
  RefreshCw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Zap,
} from 'lucide-react';
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

interface Metrics {
  totalActiveCount: number;
  totalMonthlySpend: number;
  totalAnnualSpend: number;
  confirmedAnnualSavings: number;
}

interface SubscriptionItem {
  id: string;
  amount: number;
  frequency: string;
  monthlyCost: number;
  annualizedCost: number;
  confidenceScore: number;
  status: string;
  userStatus: 'KEEP' | 'REVIEW' | 'CANCEL';
  nextBillingDate: string;
  merchant: {
    normalizedName: string;
    category: string;
    logoUrl?: string;
  };
}

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

export default function Dashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  async function loadDashboardData() {
    try {
      setLoading(true);
      const [subRes, analyticsRes, calRes] = await Promise.all([
        fetch('/api/subscriptions').then((r) => r.json()),
        fetch('/api/analytics').then((r) => r.json()),
        fetch('/api/calendar').then((r) => r.json()),
      ]);

      if (subRes.success) {
        setSubscriptions(subRes.data.subscriptions);
        setMetrics(subRes.data.metrics);
      }
      if (analyticsRes.success) {
        setAnalytics(analyticsRes.data);
      }
      if (calRes.success) {
        setCalendarEvents(calRes.data);
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function handleDecision(subId: string, decision: string) {
    try {
      const res = await fetch(`/api/subscriptions/${subId}/decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision }),
      });
      const data = await res.json();
      if (data.success) {
        loadDashboardData();
      }
    } catch (err) {
      console.error('Error updating decision:', err);
    }
  }

  async function handleTriggerSync() {
    try {
      setSyncing(true);
      const connRes = await fetch('/api/banks').then((r) => r.json());
      if (connRes.success && connRes.data.length > 0) {
        const connId = connRes.data[0].id;
        await fetch(`/api/banks/${connId}/sync`, { method: 'POST' });
        await loadDashboardData();
      }
    } catch (err) {
      console.error('Error triggering sync:', err);
    } finally {
      setSyncing(false);
    }
  }

  const reviewQueue = subscriptions.filter((s) => s.userStatus === 'REVIEW');

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-mono font-semibold border border-emerald-500/20">
                FINANCIAL OVERVIEW
              </span>
              <span className="text-slate-400 text-xs">• Live Scan Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              Recurring Expense Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Real-time monitoring of your active subscriptions, price changes, and cancellation savings.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleTriggerSync}
              disabled={syncing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all disabled:opacity-50 shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin text-emerald-400' : ''}`} />
              {syncing ? 'Syncing Bank...' : 'Sync Bank Now'}
            </button>
            <Link
              href="/cancellation-center"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-emerald-500/20"
            >
              <Scissors className="w-4 h-4 stroke-[2.5]" />
              Cancellation Center
            </Link>
          </div>
        </div>

        {/* Hero Spending Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Annual Spend */}
          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Annualized Spend</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
              ${metrics?.totalAnnualSpend.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-1">
              <span>Average ${metrics?.totalMonthlySpend.toFixed(2) || '0.00'} / month</span>
            </div>
          </div>

          {/* Card 2: Active Subscriptions */}
          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active Subscriptions</span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
              {metrics?.totalActiveCount || 0} <span className="text-xs text-slate-400 font-normal">services</span>
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-1">
              <span className="text-amber-400 font-medium">{reviewQueue.length} needs review</span>
            </div>
          </div>

          {/* Card 3: Potential Annual Savings */}
          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Targeted Savings</span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <TrendingDown className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-400 tracking-tight">
              ${analytics?.metrics.potentialAnnualSavings.toFixed(2) || '0.00'}
            </div>
            <div className="text-xs text-slate-400">Marked for cancellation</div>
          </div>

          {/* Card 4: Confirmed Annual Savings Locked */}
          <div className="glass-card p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/10 space-y-2 emerald-glow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Confirmed Savings</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">
              ${metrics?.confirmedAnnualSavings.toFixed(2) || '0.00'} <span className="text-xs font-normal text-slate-400">/ yr</span>
            </div>
            <div className="text-xs text-emerald-300 font-medium">Money saved from cancelled charges</div>
          </div>
        </div>

        {/* Quick Triage Section */}
        {reviewQueue.length > 0 && (
          <div className="glass-panel p-6 rounded-2xl border border-amber-500/20 bg-amber-950/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <h2 className="text-base font-bold text-slate-100">
                  Quick Triage Queue ({reviewQueue.length} Services Need Your Decision)
                </h2>
              </div>
              <Link href="/subscriptions" className="text-xs text-amber-400 hover:underline font-medium flex items-center gap-1">
                View All <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reviewQueue.slice(0, 3).map((sub) => (
                <div key={sub.id} className="glass-card p-4 rounded-xl border border-slate-800 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-100 text-sm">{sub.merchant.normalizedName}</h3>
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        ${sub.amount.toFixed(2)} / {sub.frequency.toLowerCase()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{sub.merchant.category}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                        {(sub.confidenceScore * 100).toFixed(0)}% Confidence
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        ${sub.annualizedCost.toFixed(2)} / yr
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                    <button
                      onClick={() => handleDecision(sub.id, 'KEEP')}
                      className="flex-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors flex items-center justify-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Keep
                    </button>
                    <button
                      onClick={() => handleDecision(sub.id, 'CANCEL')}
                      className="flex-1 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-medium border border-rose-500/30 transition-colors flex items-center justify-center gap-1"
                    >
                      <Scissors className="w-3 h-3 text-rose-400" /> Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart 1: 12-Month Spending Trend */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-100">12-Month Recurring Spend Trend</h3>
                <p className="text-xs text-slate-400">Monthly subscription expenditure history</p>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                Normalized
              </span>
            </div>

            <div className="h-64 w-full pt-4">
              {analytics?.spendTrend ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.spendTrend}>
                    <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                      formatter={(val: any) => [`$${val}`, 'Monthly Spend']}
                    />
                    <Bar dataKey="spend" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-500">Loading chart...</div>
              )}
            </div>
          </div>

          {/* Chart 2: Category Breakdown Pie Chart */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-100">Spend by Category</h3>
              <p className="text-xs text-slate-400">Distribution across service types</p>
            </div>

            <div className="h-48 w-full flex items-center justify-center">
              {analytics?.categoryBreakdown ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.categoryBreakdown}
                      dataKey="monthlyCost"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={75}
                      innerRadius={45}
                    >
                      {analytics.categoryBreakdown.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                      formatter={(val: any) => [`$${val}/mo`, 'Category Cost']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-xs text-slate-500">Loading breakdown...</div>
              )}
            </div>

            <div className="space-y-1.5 pt-2 border-t border-slate-800 text-xs">
              {analytics?.categoryBreakdown.slice(0, 4).map((cat, idx) => (
                <div key={cat.category} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                    <span className="text-slate-300 font-medium">{cat.category}</span>
                  </div>
                  <span className="font-mono text-slate-400">${cat.monthlyCost.toFixed(2)}/mo</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Renewal Charges Forecast Calendar */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-400" />
              <div>
                <h3 className="text-base font-bold text-slate-100">Upcoming Renewal Forecast</h3>
                <p className="text-xs text-slate-400">Scheduled charges detected for the next 30 days</p>
              </div>
            </div>
            <span className="text-xs font-mono text-slate-400">{calendarEvents.length} Upcoming Events</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {calendarEvents.slice(0, 4).map((evt) => (
              <div key={evt.id} className="glass-card p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>{new Date(evt.nextBillingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">{evt.frequency}</span>
                </div>
                <div className="font-bold text-sm text-slate-100">{evt.merchantName}</div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">{evt.category}</span>
                  <span className="text-sm font-black font-mono text-emerald-400">${evt.amount.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
