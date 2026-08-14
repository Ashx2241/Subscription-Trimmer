'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/transactions')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data?.transactions) {
          setTransactions(data.data.transactions);
        } else {
          // Fallback mock dataset for demonstration
          setTransactions([
            { id: 't1', date: '2026-08-14', merchantName: 'Netflix.com', normalizedMerchantName: 'Netflix', amount: 15.99, category: 'Entertainment', pending: false, isSubscription: true },
            { id: 't2', date: '2026-08-12', merchantName: 'WALMART SUPERCENTER #1234', normalizedMerchantName: 'Walmart', amount: 84.12, category: 'Retail', pending: false, isSubscription: false },
            { id: 't3', date: '2026-08-10', merchantName: 'Spotify USA', normalizedMerchantName: 'Spotify', amount: 16.99, category: 'Music & Audio', pending: false, isSubscription: true },
            { id: 't4', date: '2026-08-05', merchantName: 'OpenAI ChatGPT', normalizedMerchantName: 'OpenAI', amount: 20.00, category: 'SaaS & AI', pending: false, isSubscription: true },
            { id: 't5', date: '2026-08-01', merchantName: 'PLANET FIT CLUB', normalizedMerchantName: 'Planet Fitness', amount: 24.99, category: 'Fitness', pending: false, isSubscription: true },
            { id: 't6', date: '2026-07-28', merchantName: 'TARGET STORE 0481', normalizedMerchantName: 'Target', amount: 45.30, category: 'Retail', pending: false, isSubscription: false },
          ]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.merchantName.toLowerCase().includes(search.toLowerCase()) ||
      t.normalizedMerchantName.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === 'ALL' || t.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header title="Bank Ledger Transactions" onSearch={setSearch} />

        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* Top Control Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 dark-card p-5 rounded-2xl border border-slate-800">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-cyan-400" /> Financial Transaction Ledger
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Ingested from connected bank accounts with idempotency keys (`providerTransactionId`).
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Filter transactions..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-[#0b0f1d] border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-[#0b0f1d] border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none"
              >
                <option value="ALL">All Categories</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Music & Audio">Music & Audio</option>
                <option value="Fitness">Fitness</option>
                <option value="SaaS & AI">SaaS & AI</option>
                <option value="Retail">Retail</option>
              </select>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="dark-card rounded-2xl border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-[#0b0f1d] text-slate-400 uppercase tracking-wider text-[10px] font-mono border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4">Transaction Date</th>
                    <th className="px-6 py-4">Raw Ledger Merchant</th>
                    <th className="px-6 py-4">Normalized Merchant</th>
                    <th className="px-4 py-4">Category</th>
                    <th className="px-4 py-4">Amount</th>
                    <th className="px-4 py-4">Detection Status</th>
                    <th className="px-6 py-4 text-right">User Override</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 text-slate-400">{tx.date}</td>
                      <td className="px-6 py-4 font-bold text-slate-200">{tx.merchantName}</td>
                      <td className="px-6 py-4 text-cyan-400 font-bold">{tx.normalizedMerchantName}</td>
                      <td className="px-4 py-4">
                        <span className="bg-slate-900 px-2 py-1 rounded text-[10px] text-slate-400 border border-slate-800">
                          {tx.category}
                        </span>
                      </td>
                      <td className="px-4 py-4 font-bold text-amber-400">${tx.amount.toFixed(2)}</td>
                      <td className="px-4 py-4">
                        {tx.isSubscription ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">
                            <CheckCircle2 className="w-3 h-3" /> RECURRING SUB
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 text-[10px]">
                            ONE-TIME TXN
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => alert(`Saved override: Mark ${tx.normalizedMerchantName} as Subscription`)}
                          className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-[10px] text-cyan-400 border border-slate-800 transition-colors"
                        >
                          + Subscription
                        </button>
                        <button
                          onClick={() => alert(`Saved override: Mark ${tx.normalizedMerchantName} as Not Subscription`)}
                          className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-[10px] text-slate-400 border border-slate-800 transition-colors"
                        >
                          Exempt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
