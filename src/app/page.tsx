'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import {
  Scissors,
  CreditCard,
  Building,
  FileSpreadsheet,
  Camera,
  AlertOctagon,
  Sparkles,
  Lock,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  Plus,
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

interface AnalyticsData {
  metrics: {
    totalActiveSubscriptions: number;
    totalMonthlySpend: number;
    totalAnnualSpend: number;
    potentialAnnualSavings: number;
    confirmedAnnualSavings: number;
    totalBalance: number;
    totalVolume: number;
    transactionCount: number;
    lastTransactionDate: string | null;
  };
  categoryBreakdown: { category: string; monthlyCost: number; count: number }[];
  spendTrend: { month: string; spend: number }[];
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
    id: string;
    normalizedName: string;
    category: string;
  };
}

const CATEGORY_COLORS = ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b', '#ec4899', '#3b82f6'];

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, subsRes] = await Promise.all([
        fetch('/api/analytics'),
        fetch('/api/subscriptions'),
      ]);

      const [analyticsJson, subsJson] = await Promise.all([
        analyticsRes.json(),
        subsRes.json(),
      ]);

      if (analyticsJson.success) {
        setAnalytics(analyticsJson.data);
      }
      if (subsJson.success && subsJson.data?.subscriptions) {
        setSubscriptions(subsJson.data.subscriptions);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleDecision = async (subId: string, decision: string) => {
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
      console.error('Error updating subscription decision:', err);
    }
  };

  const metrics = analytics?.metrics || {
    totalActiveSubscriptions: 0,
    totalMonthlySpend: 0,
    totalAnnualSpend: 0,
    potentialAnnualSavings: 0,
    confirmedAnnualSavings: 0,
    totalBalance: 0,
    totalVolume: 0,
    transactionCount: 0,
    lastTransactionDate: null,
  };

  const quickActions = [
    {
      title: 'Bank Accounts',
      desc: 'Connect bank via Plaid',
      href: '/bank-connections',
      icon: Building,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/20',
    },
    {
      title: 'Import Statement',
      desc: 'Analyze CSV transactions',
      href: '/bank-connections/upload',
      icon: FileSpreadsheet,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      title: 'Receipt Scanner',
      desc: 'AI OCR receipt capture',
      href: '/receipt-scanner',
      icon: Camera,
      color: 'text-violet-400',
      bg: 'bg-violet-500/10 border-violet-500/20',
    },
    {
      title: 'Cancel Service',
      desc: '1-Click cancellation letters',
      href: '/cancellation-center',
      icon: AlertOctagon,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10 border-rose-500/20',
    },
    {
      title: 'Bill Negotiator',
      desc: 'AI retention co-pilot',
      href: '/negotiate',
      icon: Sparkles,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      title: 'Virtual Cards',
      desc: 'Zero-overcharge burner cards',
      href: '/virtual-cards',
      icon: Lock,
      color: 'text-teal-400',
      bg: 'bg-teal-500/10 border-teal-500/20',
    },
  ];

  return (
    <div suppressHydrationWarning className="min-h-screen bg-[#070a13] text-slate-100 flex flex-col font-sans">
      {/* Top Application Navbar */}
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Page Header */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-mono font-semibold border border-emerald-500/20">
                FINANCIAL INTELLIGENCE
              </span>
              <span className="text-xs text-slate-500 font-mono">Live Ledger & Detection Matrix</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
              Subscription & Expense Overview
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Automated cadence detection, price tracking, and user-authorized cancellation workflows.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/bank-connections/upload"
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-2 shadow-sm"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Import CSV</span>
            </Link>
            <Link
              href="/bank-connections"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-xs font-extrabold shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-400 transition-all flex items-center gap-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Connect Bank</span>
            </Link>
          </div>
        </div>

        {/* Hero KPI Metric Cards */}
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
              {/* Card 1: Monthly Spend */}
              <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1 hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider font-mono">Monthly Spend</span>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded">
                    {metrics.totalActiveSubscriptions} active
                  </span>
                </div>
                <div className="text-2xl font-bold font-mono text-white">
                  ₹{metrics.totalMonthlySpend.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <p className="text-[10px] text-slate-500">Across all active recurring services</p>
              </div>

              {/* Card 2: Annual Run-Rate */}
              <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1 hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider font-mono">Annualized Spend</span>
                  <span className="text-[10px] font-mono text-slate-400">Projection</span>
                </div>
                <div className="text-2xl font-bold font-mono text-white">
                  ₹{metrics.totalAnnualSpend.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <p className="text-[10px] text-slate-500">Projected 12-month recurring cost</p>
              </div>

              {/* Card 3: Potential Savings */}
              <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1 hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider font-mono">Potential Savings</span>
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">Review</span>
                </div>
                <div className="text-2xl font-bold font-mono text-amber-400">
                  ₹{metrics.potentialAnnualSavings.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  <span className="text-xs font-normal text-slate-400">/yr</span>
                </div>
                <p className="text-[10px] text-slate-500">Flagged subscriptions ready to cancel</p>
              </div>

              {/* Card 4: Confirmed Reductions */}
              <div className="glass-card p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/10 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider font-mono">Confirmed Savings</span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded">Locked</span>
                </div>
                <div className="text-2xl font-bold font-mono text-emerald-400">
                  +₹{metrics.confirmedAnnualSavings.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  <span className="text-xs font-normal text-emerald-300/80">/yr</span>
                </div>
                <p className="text-[10px] text-emerald-300/80 font-medium">Saved from confirmed cancellations</p>
              </div>
            </>
          )}
        </div>

        {/* Quick Action Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className={`p-3.5 rounded-2xl border ${action.bg} hover:scale-[1.02] active:scale-[0.98] transition-all flex flex-col justify-between space-y-2 group shadow-sm`}
              >
                <div className="flex items-center justify-between">
                  <Icon className={`w-5 h-5 ${action.color}`} />
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-200 transition-colors" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors">{action.title}</div>
                  <div className="text-[10px] text-slate-400 leading-tight">{action.desc}</div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Historical Spend Trend */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Monthly Spend Trend</h3>
                <p className="text-[10px] text-slate-500">Calculated from connected bank accounts & uploaded statements</p>
              </div>
              <Link href="/analytics" className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1">
                <span>Detailed Analytics</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="h-72 w-full">
              {loading ? (
                <div className="h-full w-full bg-slate-800/20 rounded-xl animate-skeleton" />
              ) : analytics?.spendTrend && analytics.spendTrend.some((t) => t.spend > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.spendTrend}>
                    <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0e1424',
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        fontSize: '12px',
                        color: '#fff',
                      }}
                      formatter={(val: unknown) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Monthly Spend']}
                    />
                    <Bar dataKey="spend" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                  <TrendingUp className="w-10 h-10 text-slate-700" />
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-slate-300">No Historical Spend Data Recorded</p>
                    <p className="text-[11px] text-slate-500 max-w-sm">
                      Connect your bank account or upload a CSV statement to automatically populate monthly spending trends.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <Link
                      href="/bank-connections/upload"
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono border border-slate-700 transition-colors"
                    >
                      Import CSV
                    </Link>
                    <Link
                      href="/bank-connections"
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-xs font-mono border border-emerald-500/20 transition-colors"
                    >
                      Connect Bank
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Category Concentration */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Category Breakdown</h3>
            <div className="h-72 w-full flex items-center justify-center">
              {loading ? (
                <div className="h-full w-full bg-slate-800/20 rounded-xl animate-skeleton" />
              ) : analytics?.categoryBreakdown && analytics.categoryBreakdown.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.categoryBreakdown}
                      dataKey="monthlyCost"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={50}
                    >
                      {analytics.categoryBreakdown.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0e1424',
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        fontSize: '12px',
                        color: '#fff',
                      }}
                      formatter={(val: unknown) => [`₹${Number(val).toLocaleString('en-IN')}/mo`, 'Cost']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-6 space-y-2">
                  <Layers className="w-8 h-8 text-slate-700" />
                  <p className="text-xs font-semibold text-slate-400">No Category Breakdown</p>
                  <p className="text-[10px] text-slate-500">Categories will appear automatically when subscriptions are detected.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Subscriptions Matrix Quick Table */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <Scissors className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Detected Subscriptions</h3>
                <p className="text-[10px] text-slate-500">Live recurring charges identified from banking transactions</p>
              </div>
            </div>
            <Link
              href="/subscriptions"
              className="text-xs text-emerald-400 hover:text-emerald-300 font-mono flex items-center gap-1"
            >
              <span>View Full Matrix</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-2 py-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-14 bg-slate-800/30 rounded-xl animate-skeleton" />
              ))}
            </div>
          ) : subscriptions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] text-slate-400">
                    <th className="pb-3 font-semibold">Service</th>
                    <th className="pb-3 font-semibold">Category</th>
                    <th className="pb-3 font-semibold">Billing Cadence</th>
                    <th className="pb-3 font-semibold">Cost</th>
                    <th className="pb-3 font-semibold">Posture Status</th>
                    <th className="pb-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {subscriptions.slice(0, 5).map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 font-bold text-slate-200">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-emerald-400">
                            {sub.merchant.normalizedName.slice(0, 2).toUpperCase()}
                          </div>
                          <span>{sub.merchant.normalizedName}</span>
                        </div>
                      </td>
                      <td className="py-3.5 text-slate-400">{sub.merchant.category}</td>
                      <td className="py-3.5 text-slate-300">{sub.frequency}</td>
                      <td className="py-3.5 font-bold text-white">
                        ₹{sub.monthlyCost.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        <span className="text-[10px] font-normal text-slate-400">/mo</span>
                      </td>
                      <td className="py-3.5">
                        {sub.userStatus === 'KEEP' ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">
                            KEEP
                          </span>
                        ) : sub.userStatus === 'CANCEL' ? (
                          <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px]">
                            CANCEL
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px]">
                            REVIEW
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 text-right space-x-1">
                        <button
                          onClick={() => handleDecision(sub.id, 'KEEP')}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] transition-colors"
                        >
                          Keep
                        </button>
                        <button
                          onClick={() => handleDecision(sub.id, 'CANCEL')}
                          className="px-2.5 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-[10px] transition-colors"
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10 space-y-3">
              <Scissors className="w-10 h-10 text-slate-700 mx-auto" />
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-300">No Subscriptions Detected Yet</p>
                <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                  Import a bank statement or connect an account to let the AI detection engine discover your recurring memberships.
                </p>
              </div>
              <div className="pt-2 flex items-center justify-center gap-3">
                <Link
                  href="/bank-connections/upload"
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                >
                  Import CSV Statement
                </Link>
                <Link
                  href="/bank-connections"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-xs font-extrabold shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-400 transition-all"
                >
                  Connect Bank Account
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
