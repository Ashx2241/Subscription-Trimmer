'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { motion } from 'framer-motion';
import { ShieldCheck, CreditCard, Lock, Sparkles, Plus, Check } from 'lucide-react';

export default function VirtualCardsPage() {
  const [merchant, setMerchant] = useState('');
  const [limit, setLimit] = useState(20);
  const [cards, setCards] = useState<
    Array<{ id: string; merchant: string; number: string; exp: string; limit: string; status: string }>
  >([]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchant) return;
    const newCard = {
      id: `vc-${Date.now()}`,
      merchant,
      number: `4111 22${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`,
      exp: '12/28',
      limit: `₹${limit}.00`,
      status: 'AUTO_LOCKED',
    };
    setCards([newCard, ...cards]);
    setMerchant('');
  };

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header title="Privacy Virtual Card Generator" />

        <main className="flex-1 p-6 space-y-6 overflow-y-auto max-w-5xl">
          <div className="dark-card p-6 rounded-2xl border border-slate-800 space-y-2">
            <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" /> Free Trial Virtual Card Defense
            </h1>
            <p className="text-xs text-slate-400">
              Generate merchant-locked virtual debit cards that auto-pause after free trials so services can never accidentally charge your real card.
            </p>
          </div>

          <form onSubmit={handleCreate} className="dark-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-200">Create New Protected Virtual Card</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-slate-400">Merchant Name</label>
                <input
                  type="text"
                  required
                  value={merchant}
                  onChange={(e) => setMerchant(e.target.value)}
                  className="w-full bg-[#0b0f1d] border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Monthly Spend Limit (₹)</label>
                <input
                  type="number"
                  required
                  value={limit}
                  onChange={(e) => setLimit(Number(e.target.value))}
                  className="w-full bg-[#0b0f1d] border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <button
              type="submit"
              className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-cyan-500 via-emerald-500 to-teal-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-teal-400 transition-all inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Issue Virtual Card
            </button>
          </form>

          {/* Virtual Cards Grid */}
          {cards.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {cards.map((c) => (
                <div key={c.id} className="dark-card p-5 rounded-2xl border border-slate-800 space-y-4 relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-xs font-bold text-slate-200">{c.merchant}</div>
                      <div className="text-[10px] text-cyan-400 font-mono">Limit: {c.limit}</div>
                    </div>
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1">
                      <Lock className="w-3 h-3" /> {c.status}
                    </span>
                  </div>

                  <div className="font-mono text-sm font-bold tracking-wider text-slate-300 pt-2">{c.number}</div>

                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 border-t border-slate-800/80 pt-2">
                    <span>EXP: {c.exp}</span>
                    <span>CVV: ***</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="dark-card p-8 rounded-2xl border border-slate-800 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mx-auto">
                <CreditCard className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-200">No virtual cards created</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                  Issue a merchant-locked virtual card above to sign up for trials safely without risking auto-renewal charges.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
