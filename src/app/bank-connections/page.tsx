'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import {
  CreditCard,
  Building,
  RefreshCw,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Lock,
} from 'lucide-react';

interface BankConnection {
  id: string;
  provider: string;
  institutionName: string;
  status: string;
  lastSyncAt: string;
  accounts: {
    id: string;
    name: string;
    maskedAccountNumber: string;
    type: string;
    balanceCurrent: number;
    _count?: { transactions: number };
  }[];
}

export default function BankConnectionsPage() {
  const [connections, setConnections] = useState<BankConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  const fetchConnections = async () => {
    try {
      const res = await fetch('/api/banks');
      const data = await res.json();
      if (data.success) {
        setConnections(data.data);
      }
    } catch (err) {
      console.error('Error loading bank connections:', err);
    }
  };

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        setLoading(true);
        const res = await fetch('/api/banks');
        const data = await res.json();
        if (active && data.success) {
          setConnections(data.data);
        }
      } catch (err) {
        console.error('Error loading bank connections:', err);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, []);

  async function handleSync(connId: string) {
    try {
      setSyncingId(connId);
      await fetch(`/api/banks/${connId}/sync`, { method: 'POST' });
      fetchConnections();
    } catch (err) {
      console.error('Sync error:', err);
    } finally {
      setSyncingId(null);
    }
  }

  async function handleAddMockBank() {
    try {
      const res = await fetch('/api/banks', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        fetchConnections();
      }
    } catch (err) {
      console.error('Add bank error:', err);
    }
  }

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-mono font-semibold border border-emerald-500/20">
                PLAID / MX OPEN BANKING
              </span>
              <span className="text-xs text-slate-500">• Tokenized OAuth 2.0</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
              Bank & Financial Connections
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Read-only transaction monitoring. Credentials and card numbers are never stored.
            </p>
          </div>

          <button
            onClick={handleAddMockBank}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-bold transition-all shadow-md active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" /> Link New Institution
          </button>
        </div>

        {/* Security Disclosures */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-card p-4 rounded-xl border border-slate-800 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-slate-200">Read-Only Scope</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Strict transaction monitoring. Money cannot be moved or transferred.</p>
            </div>
          </div>
          <div className="glass-card p-4 rounded-xl border border-slate-800 flex items-start gap-3">
            <Lock className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-slate-200">Zero Credential Storage</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Logins occur inside secure OAuth bank popups. We store encrypted tokens only.</p>
            </div>
          </div>
          <div className="glass-card p-4 rounded-xl border border-slate-800 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-slate-200">Continuous Delta Sync</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Automated 24-hour background scans for new recurring charges.</p>
            </div>
          </div>
        </div>

        {/* Connections List */}
        <div className="space-y-4">
          {loading ? (
            Array.from({ length: 2 }).map((_, idx) => (
              <div key={`skel-bank-${idx}`} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 animate-skeleton">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800/60" />
                    <div className="space-y-1.5">
                      <div className="w-36 h-4 bg-slate-800/60 rounded" />
                      <div className="w-48 h-3 bg-slate-800/40 rounded" />
                    </div>
                  </div>
                  <div className="w-36 h-8 bg-slate-800/50 rounded-xl" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="h-16 bg-slate-800/40 rounded-xl" />
                  <div className="h-16 bg-slate-800/40 rounded-xl" />
                </div>
              </div>
            ))
          ) : connections.length === 0 ? (
            <div className="glass-panel p-12 text-center rounded-2xl border border-slate-800 space-y-4 shadow-xl">
              <Building className="w-10 h-10 text-slate-600 mx-auto stroke-1" />
              <div className="max-w-sm mx-auto space-y-1.5">
                <h4 className="text-sm font-bold text-slate-200">No Financial Accounts Connected</h4>
                <p className="text-xs text-slate-400">
                  Connect your bank or credit card accounts to allow the AI Detection Engine to uncover hidden subscriptions.
                </p>
              </div>
              <button
                onClick={handleAddMockBank}
                className="px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30 transition-all inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Link Demo Bank Account
              </button>
            </div>
          ) : (
            connections.map((conn) => (
              <div key={conn.id} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0e1424] border border-slate-800 flex items-center justify-center text-emerald-400">
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">{conn.institutionName}</h3>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <span className="text-emerald-400 font-mono font-medium">• {conn.status}</span>
                        <span className="text-slate-600">|</span>
                        <span>Provider: {conn.provider}</span>
                        <span className="text-slate-600">|</span>
                        <span className="font-mono text-[11px]">Last sync: {new Date(conn.lastSyncAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSync(conn.id)}
                    disabled={syncingId === conn.id}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-medium border border-slate-800 transition-colors flex items-center gap-2 active:scale-95"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${syncingId === conn.id ? 'animate-spin text-emerald-400' : ''}`} />
                    {syncingId === conn.id ? 'Syncing...' : 'Sync Now'}
                  </button>
                </div>

                {/* Linked Accounts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {conn.accounts.map((acc) => (
                    <div key={acc.id} className="glass-card p-4 rounded-xl border border-slate-800/80 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-slate-400">
                          <CreditCard className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-200 text-xs">{acc.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">•••• {acc.maskedAccountNumber} ({acc.type})</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-bold text-slate-100 text-sm">${acc.balanceCurrent.toFixed(2)}</div>
                        <div className="text-[10px] text-slate-500 font-mono">Current Balance</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
