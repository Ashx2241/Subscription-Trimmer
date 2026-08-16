'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { TrendingDown, Target, Plus } from 'lucide-react';

interface SavingsGoalItem {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  status: string;
}

interface BudgetItem {
  id: string;
  category: string;
  amount: number;
  spent: number;
}

export default function SavingsPage() {
  const [goals, setGoals] = useState<SavingsGoalItem[]>([]);
  const [budgets, setBudgets] = useState<BudgetItem[]>([]);
  const [, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');

  const fetchData = async () => {
    try {
      const [goalsRes, budgetsRes] = await Promise.all([
        fetch('/api/goals'),
        fetch('/api/budgets'),
      ]);
      const gData = await goalsRes.json();
      const bData = await budgetsRes.json();

      if (gData.success && gData.data) setGoals(gData.data);
      if (bData.success && bData.data) setBudgets(bData.data);
    } catch (err) {
      console.error('Failed to load savings data:', err);
    }
  };

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const [goalsRes, budgetsRes] = await Promise.all([
          fetch('/api/goals'),
          fetch('/api/budgets'),
        ]);
        const gData = await goalsRes.json();
        const bData = await budgetsRes.json();

        if (active) {
          if (gData.success && gData.data) setGoals(gData.data);
          if (bData.success && bData.data) setBudgets(bData.data);
        }
      } catch (err) {
        console.error('Failed to load savings data:', err);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, []);

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !targetAmount) return;

    try {
      const res = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, targetAmount: Number(targetAmount) }),
      });
      const data = await res.json();
      if (data.success) {
        setName('');
        setTargetAmount('');
        setShowForm(false);
        fetchData();
      }
    } catch (err) {
      console.error('Failed to add goal:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header title="Financial Savings Tracker" />

        <main className="flex-1 p-6 space-y-6 overflow-y-auto max-w-6xl">
          {/* Header Card */}
          <div className="dark-card p-6 rounded-2xl border border-slate-800 space-y-2 flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-emerald-400" /> Subscription Savings & Financial Goals
              </h1>
              <p className="text-xs text-slate-400">
                Track confirmed savings, target budget allocations, and custom savings goals.
              </p>
            </div>

            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold text-xs shadow-lg flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Savings Goal
            </button>
          </div>

          {/* New Goal Form */}
          {showForm && (
            <form onSubmit={handleAddGoal} className="dark-card p-5 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-xs font-bold text-slate-200">Create New Savings Target</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <label className="text-slate-400 block mb-1">Goal Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. New Macbook Pro"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#0b0f1d] border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Target Amount ($)</label>
                  <input
                    type="number"
                    required
                    placeholder="2500"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    className="w-full bg-[#0b0f1d] border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl"
              >
                Save Goal
              </button>
            </form>
          )}

          {/* Savings Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="dark-card p-5 rounded-2xl border border-slate-800 space-y-1">
              <div className="text-xs font-mono text-slate-400">Potential Annual Savings</div>
              <div className="text-2xl font-black text-emerald-400 font-mono">$299.88 / yr</div>
              <div className="text-[10px] text-slate-500 font-mono">1 subscription flagged for cancellation</div>
            </div>

            <div className="dark-card p-5 rounded-2xl border border-slate-800 space-y-1">
              <div className="text-xs font-mono text-slate-400">Confirmed Annualized Reduction</div>
              <div className="text-2xl font-black text-cyan-400 font-mono">$299.88 / yr</div>
              <div className="text-[10px] text-emerald-400 font-mono">Verified cancellation notices sent</div>
            </div>

            <div className="dark-card p-5 rounded-2xl border border-slate-800 space-y-1">
              <div className="text-xs font-mono text-slate-400">Monthly Expense Reduction</div>
              <div className="text-2xl font-black text-amber-400 font-mono">$24.99 / mo</div>
              <div className="text-[10px] text-slate-500 font-mono">Spotify Premium ($11.99/mo) + Planet Fitness</div>
            </div>
          </div>

          {/* Savings Goals Section */}
          <div className="dark-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Target className="w-4 h-4 text-cyan-400" /> Active Savings Goals
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {goals.map((g) => {
                const pct = Math.min(100, (g.currentAmount / g.targetAmount) * 100);
                return (
                  <div key={g.id} className="p-4 rounded-xl bg-[#0b0f1d] border border-slate-800 space-y-3 font-mono">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-xs font-bold text-slate-200">{g.name}</div>
                        <div className="text-[10px] text-slate-500">Status: {g.status}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-emerald-400">${g.currentAmount.toFixed(2)}</div>
                        <div className="text-[10px] text-slate-500">of ${g.targetAmount.toFixed(2)}</div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Progress</span>
                        <span>{pct.toFixed(1)}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Category Budgets Section */}
          <div className="dark-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-200">Monthly Category Budgets</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
              {budgets.map((b) => (
                <div key={b.id} className="p-4 rounded-xl bg-[#0b0f1d] border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-200">{b.category}</span>
                    <span className="text-cyan-400">${b.spent.toFixed(2)} / ${b.amount.toFixed(2)}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-400 rounded-full"
                      style={{ width: `${Math.min(100, (b.spent / b.amount) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

