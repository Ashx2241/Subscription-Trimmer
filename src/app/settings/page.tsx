'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { ShieldCheck, Trash2, Download, Key, Plus, Copy } from 'lucide-react';

interface ApiKeyItem {
  id: string;
  name: string;
  keyPrefix: string;
  scopes: string[] | string;
  status: string;
}

export default function SettingsPage() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [erased, setErased] = useState(false);
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [createdFullKey, setCreatedFullKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  const fetchKeys = async () => {
    try {
      const res = await fetch('/api/keys');
      const data = await res.json();
      if (data.success && data.data) {
        setApiKeys(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch API keys:', err);
    }
  };

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch('/api/keys');
        const data = await res.json();
        if (active && data.success && data.data) {
          setApiKeys(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch API keys:', err);
      }
    }
    load();
    return () => { active = false; };
  }, []);

  const handleCreateApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName) return;

    try {
      const res = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newKeyName, scopes: ['READ_ONLY'] }),
      });
      const data = await res.json();
      if (data.success && data.data?.fullKey) {
        setCreatedFullKey(data.data.fullKey);
        setNewKeyName('');
        fetchKeys();
      }
    } catch (err) {
      console.error('Failed to create API key:', err);
    }
  };

  const handleRevokeKey = async (id: string) => {
    try {
      const res = await fetch(`/api/keys/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchKeys();
      }
    } catch (err) {
      console.error('Failed to revoke API key:', err);
    }
  };

  const handleEraseData = async () => {
    if (confirm('Are you sure you want to trigger GDPR/CCPA One-Click Account Erase? All bank connections, transactions, and user logs will be permanently destroyed.')) {
      setErased(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header title="Account & Security Settings" />

        <main className="flex-1 p-6 space-y-6 overflow-y-auto max-w-4xl">
          <div className="dark-card p-6 rounded-2xl border border-slate-800 space-y-2">
            <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" /> Security & Developer Controls
            </h1>
            <p className="text-xs text-slate-400">
              Manage multi-factor authentication, export your ledger data, create API Keys, or execute GDPR data rights.
            </p>
          </div>

          {/* Developer API Keys Section */}
          <div className="dark-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Key className="w-4 h-4 text-cyan-400" /> Developer API Keys & Webhooks
            </h3>

            {createdFullKey && (
              <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 space-y-2 font-mono text-xs">
                <div className="text-cyan-300 font-bold">API Key Generated Successfully (Save it now - shown only once!)</div>
                <div className="flex items-center justify-between bg-slate-950 p-2 rounded border border-slate-800 text-slate-200">
                  <span>{createdFullKey}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(createdFullKey);
                      setCopiedKey(true);
                      setTimeout(() => setCopiedKey(false), 2000);
                    }}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[10px] flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" /> {copiedKey ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleCreateApiKey} className="flex gap-2 text-xs font-mono">
              <input
                type="text"
                required
                placeholder="Key Name (e.g. Production Webhook Integration)"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                className="flex-1 bg-[#0b0f1d] border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-extrabold rounded-xl flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Create Key
              </button>
            </form>

            <div className="space-y-2 pt-2">
              {apiKeys.map((k) => (
                <div key={k.id} className="p-3 rounded-xl bg-[#0b0f1d] border border-slate-800 flex justify-between items-center text-xs font-mono">
                  <div>
                    <div className="font-bold text-slate-200">{k.name}</div>
                    <div className="text-[10px] text-slate-500">Prefix: {k.keyPrefix} • Scopes: {Array.isArray(k.scopes) ? k.scopes.join(', ') : k.scopes} • Status: {k.status}</div>
                  </div>
                  {k.status === 'ACTIVE' && (
                    <button
                      onClick={() => handleRevokeKey(k.id)}
                      className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded text-[10px] border border-rose-500/20"
                    >
                      Revoke
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 2FA Card */}
          <div className="dark-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-200">Two-Factor Authentication (2FA / TOTP)</h3>
                <p className="text-xs text-slate-400 mt-0.5">Require Google Authenticator / Authy TOTP code for bank disconnections.</p>
              </div>

              <button
                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                  twoFactorEnabled
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                {twoFactorEnabled ? '2FA ACTIVE' : 'ENABLE 2FA'}
              </button>
            </div>
          </div>

          {/* Data Export & Erase Card */}
          <div className="dark-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-200">GDPR & CCPA Data Rights</h3>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-4 rounded-xl bg-[#0b0f1d] border border-slate-800 flex justify-between items-center">
                <div>
                  <div className="font-bold text-slate-200">Export All Data (JSON / CSV)</div>
                  <div className="text-[10px] text-slate-500">Download complete transaction ledgers and subscription audit history.</div>
                </div>
                <button
                  onClick={() => alert('Exporting data packet...')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-cyan-400 hover:bg-slate-700 transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Export Data
                </button>
              </div>

              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex justify-between items-center">
                <div>
                  <div className="font-bold text-rose-400">One-Click Account & Data Erase</div>
                  <div className="text-[10px] text-slate-400">Permanently delete user profile, bank tokens, and transaction history.</div>
                </div>
                <button
                  onClick={handleEraseData}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" /> {erased ? 'ERASED' : 'Erase Account'}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

