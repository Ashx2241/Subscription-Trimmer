'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import {
  Scissors,
  Search,
  ShieldAlert,
} from 'lucide-react';

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
  lastBillingDate: string;
  merchant: {
    id: string;
    normalizedName: string;
    category: string;
    website?: string;
    cancellationUrl?: string;
  };
}

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchSubscriptions = async () => {
    try {
      const res = await fetch('/api/subscriptions');
      const data = await res.json();
      if (data.success) {
        setSubscriptions(data.data.subscriptions);
      }
    } catch (err) {
      console.error('Error loading subscriptions:', err);
    }
  };

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        setLoading(true);
        const res = await fetch('/api/subscriptions');
        const data = await res.json();
        if (active && data.success) {
          setSubscriptions(data.data.subscriptions);
        }
      } catch (err) {
        console.error('Error loading subscriptions:', err);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
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
        fetchSubscriptions();
      }
    } catch (err) {
      console.error('Error updating decision:', err);
    }
  }

  const filteredSubs = subscriptions.filter((sub) => {
    const matchesSearch = sub.merchant.normalizedName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (filterStatus === 'ALL') return true;
    if (filterStatus === 'KEEP') return sub.userStatus === 'KEEP';
    if (filterStatus === 'REVIEW') return sub.userStatus === 'REVIEW';
    if (filterStatus === 'CANCEL') return sub.userStatus === 'CANCEL';
    if (filterStatus === 'CANCELLED') return sub.status === 'CANCELLED';
    return true;
  });

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-slate-800">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Subscription Matrix
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Audit recurring charges, set Keep / Cancel decisions, or mark exceptions.
            </p>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search merchant..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0b0f1d] border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
              />
            </div>

            <div className="flex items-center gap-1 bg-[#0b0f1d] p-1 rounded-xl border border-slate-800 text-xs overflow-x-auto max-w-full no-scrollbar">
              {['ALL', 'REVIEW', 'KEEP', 'CANCEL', 'CANCELLED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all text-xs whitespace-nowrap ${
                    filterStatus === st
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Matrix Table */}
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs text-slate-300 min-w-[700px]">
              <thead className="bg-[#0b0f1d] text-slate-400 uppercase tracking-wider text-[10px] font-mono border-b border-slate-800">
                <tr>
                  <th className="px-6 py-3.5">Merchant & Service</th>
                  <th className="px-4 py-3.5">Category</th>
                  <th className="px-4 py-3.5">Billing Amount</th>
                  <th className="px-4 py-3.5">Annualized Cost</th>
                  <th className="px-4 py-3.5">Confidence</th>
                  <th className="px-4 py-3.5">Decision State</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {loading ? (
                  // Skeleton Rows
                  Array.from({ length: 4 }).map((_, idx) => (
                    <tr key={`skel-${idx}`} className="animate-skeleton">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-800/60" />
                          <div className="space-y-1.5">
                            <div className="w-24 h-3.5 bg-slate-800/60 rounded" />
                            <div className="w-16 h-2.5 bg-slate-800/40 rounded" />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4"><div className="w-20 h-3 bg-slate-800/50 rounded" /></td>
                      <td className="px-4 py-4"><div className="w-16 h-3 bg-slate-800/50 rounded" /></td>
                      <td className="px-4 py-4"><div className="w-20 h-3 bg-slate-800/50 rounded" /></td>
                      <td className="px-4 py-4"><div className="w-16 h-4 bg-slate-800/50 rounded-full" /></td>
                      <td className="px-4 py-4"><div className="w-20 h-4 bg-slate-800/50 rounded-full" /></td>
                      <td className="px-6 py-4 text-right"><div className="w-24 h-6 bg-slate-800/50 rounded ml-auto" /></td>
                    </tr>
                  ))
                ) : filteredSubs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="max-w-xs mx-auto space-y-2">
                        <Scissors className="w-8 h-8 text-slate-600 mx-auto stroke-1" />
                        <h4 className="text-sm font-semibold text-slate-300">No Subscriptions Found</h4>
                        <p className="text-xs text-slate-500">
                          {searchQuery || filterStatus !== 'ALL'
                            ? 'No subscriptions match your active search or filter criteria.'
                            : 'No recurring subscriptions detected yet. Connect a bank account or import statements to begin.'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredSubs.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-800/30 transition-colors">
                      {/* Merchant */}
                      <td className="px-6 py-4 font-semibold text-white">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#0e1424] border border-slate-800 flex items-center justify-center font-bold text-emerald-400 text-xs">
                            {sub.merchant.normalizedName.charAt(0)}
                          </div>
                          <div>
                            <div className="text-white text-xs">{sub.merchant.normalizedName}</div>
                            {sub.merchant.website && (
                              <a
                                href={sub.merchant.website}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[10px] text-slate-500 hover:text-slate-400 font-mono"
                              >
                                {sub.merchant.website.replace('https://', '')}
                              </a>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-4 text-slate-400 text-xs">{sub.merchant.category}</td>

                      {/* Amount & Frequency */}
                      <td className="px-4 py-4 font-mono font-semibold text-slate-200">
                        ₹{sub.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
                        <span className="text-[10px] text-slate-500">/ {sub.frequency.toLowerCase()}</span>
                      </td>

                      {/* Annual Cost */}
                      <td className="px-4 py-4 font-mono font-bold text-emerald-400">
                        ₹{sub.annualizedCost.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/yr
                      </td>

                      {/* Confidence */}
                      <td className="px-4 py-4">
                        <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono text-[10px] text-slate-300">
                          {(sub.confidenceScore * 100).toFixed(0)}% Match
                        </span>
                      </td>

                      {/* Decision */}
                      <td className="px-4 py-4">
                        {sub.status === 'CANCELLED' ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-slate-400 font-mono text-[10px] border border-slate-800">
                            CANCELLED
                          </span>
                        ) : sub.userStatus === 'KEEP' ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono text-[10px] border border-emerald-500/20">
                            KEEPING
                          </span>
                        ) : sub.userStatus === 'CANCEL' ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 font-mono text-[10px] border border-rose-500/20">
                            MARKED TO CANCEL
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-mono text-[10px] border border-amber-500/20">
                            NEEDS REVIEW
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleDecision(sub.id, 'KEEP')}
                            title="Keep Subscription"
                            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-800 transition-colors active:scale-95"
                          >
                            Keep
                          </button>
                          <button
                            onClick={() => handleDecision(sub.id, 'CANCEL')}
                            title="Mark for Cancellation"
                            className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-medium border border-rose-500/20 transition-colors flex items-center gap-1 active:scale-95"
                          >
                            <Scissors className="w-3 h-3 text-rose-400" /> Cancel
                          </button>
                          <button
                            onClick={() => handleDecision(sub.id, 'NOT_A_SUBSCRIPTION')}
                            title="Not a subscription (Override)"
                            className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-500 hover:text-slate-300 text-xs border border-slate-800 transition-colors"
                          >
                            <ShieldAlert className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
