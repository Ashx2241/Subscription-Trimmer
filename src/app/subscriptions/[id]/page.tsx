'use client';

import { use } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import {
  ArrowLeft,
  Info,
  ExternalLink,
  History,
} from 'lucide-react';

interface SubscriptionTx {
  date: string;
  amount: string;
  status: string;
}

interface SubscriptionDetail {
  merchant: string;
  category: string;
  amount: string;
  frequency: string;
  monthlyCost: string;
  annualizedCost?: string;
  annualCost?: string;
  confidenceScore?: number | string;
  confidence?: number | string;
  explanation: string;
  website: string;
  txs: SubscriptionTx[];
}

export default function SubscriptionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  // Dynamic explanation lookup based on subscription id
  const detailsMap: Record<string, SubscriptionDetail> = {
    'sub-netflix-1': {
      merchant: 'Netflix',
      category: 'Entertainment',
      amount: '$15.99',
      frequency: 'Monthly',
      monthlyCost: '$15.99',
      annualCost: '$191.88',
      confidence: '99%',
      explanation: 'Netflix was detected as recurring because 4 consecutive payments of $15.99 occurred approximately every 30 days between May and August 2026.',
      website: 'https://netflix.com',
      txs: [
        { date: '2026-08-14', amount: '$15.99', status: 'SETTLED' },
        { date: '2026-07-14', amount: '$15.99', status: 'SETTLED' },
        { date: '2026-06-14', amount: '$15.99', status: 'SETTLED' },
        { date: '2026-05-14', amount: '$15.99', status: 'SETTLED' },
      ],
    },
    'sub-planetfitness-3': {
      merchant: 'Planet Fitness',
      category: 'Fitness & Health',
      amount: '$24.99',
      frequency: 'Monthly',
      monthlyCost: '$24.99',
      annualCost: '$299.88',
      confidence: '92%',
      explanation: 'Planet Fitness was detected as recurring because 4 payments of $24.99 occurred regularly on the 20th of each month.',
      website: 'https://planetfitness.com',
      txs: [
        { date: '2026-08-20', amount: '$24.99', status: 'ESTIMATED' },
        { date: '2026-07-20', amount: '$24.99', status: 'SETTLED' },
        { date: '2026-06-20', amount: '$24.99', status: 'SETTLED' },
        { date: '2026-05-20', amount: '$24.99', status: 'SETTLED' },
      ],
    },
  };

  const sub = detailsMap[id] || detailsMap['sub-netflix-1'];

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header title={`Subscription / ${sub.merchant}`} />

        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* Back Navigation */}
          <Link
            href="/subscriptions"
            className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-slate-200 font-bold transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400" /> Back to Subscriptions Matrix
          </Link>

          {/* Main Info Card */}
          <div className="dark-card p-6 rounded-2xl border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-slate-100">{sub.merchant}</h1>
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold">
                    {sub.confidence} Confidence Score
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{sub.category} • {sub.frequency} Subscription</p>
              </div>

              <a
                href={sub.website}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-cyan-400 font-bold hover:bg-slate-800 transition-all inline-flex items-center gap-2 self-start sm:self-auto"
              >
                Visit Official Merchant Site <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
              <div className="p-3 rounded-xl bg-[#0b0f1d] border border-slate-800">
                <div className="text-slate-500">Billing Amount</div>
                <div className="text-base font-bold text-amber-400 mt-1">{sub.amount}</div>
              </div>
              <div className="p-3 rounded-xl bg-[#0b0f1d] border border-slate-800">
                <div className="text-slate-500">Monthly Equivalent</div>
                <div className="text-base font-bold text-slate-200 mt-1">{sub.monthlyCost}</div>
              </div>
              <div className="p-3 rounded-xl bg-[#0b0f1d] border border-slate-800">
                <div className="text-slate-500">Annualized Spend</div>
                <div className="text-base font-bold text-slate-200 mt-1">{sub.annualCost}</div>
              </div>
              <div className="p-3 rounded-xl bg-[#0b0f1d] border border-slate-800">
                <div className="text-slate-500">Cadence Delta</div>
                <div className="text-base font-bold text-cyan-400 mt-1">~30.4 Days</div>
              </div>
            </div>

            {/* Detection Explanation Box */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-cyan-400 flex items-center gap-2">
                <Info className="w-4 h-4 text-cyan-400" /> Detection Engine Explanation
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-mono">{sub.explanation}</p>
            </div>

            {/* Transaction History Table */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-2">
                <History className="w-4 h-4 text-slate-400" /> Linked Transaction Evidence
              </h3>

              <div className="rounded-xl border border-slate-800 overflow-hidden text-xs font-mono">
                <table className="w-full text-left">
                  <thead className="bg-[#0b0f1d] text-slate-400 uppercase text-[10px]">
                    <tr>
                      <th className="px-4 py-3">Payment Date</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {sub.txs.map((tx: SubscriptionTx, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-800/30">
                        <td className="px-4 py-2.5 text-slate-300">{tx.date}</td>
                        <td className="px-4 py-2.5 font-bold text-amber-400">{tx.amount}</td>
                        <td className="px-4 py-2.5 text-right text-emerald-400">{tx.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
