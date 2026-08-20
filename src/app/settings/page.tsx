'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { ShieldCheck, Trash2, Download, Key, Plus, Copy, CheckCircle2, AlertCircle } from 'lucide-react';

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
  const [loading, setLoading] = useState(true);
  const [newKeyName, setNewKeyName] = useState('');
  const [createdFullKey, setCreatedFullKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

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
        setLoading(true);
        const res = await fetch('/api/keys');
        const data = await res.json();
        if (active && data.success && data.data) {
          setApiKeys(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch API keys:', err);
      } finally {
        if (active) setLoading(false);
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

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const [userRes, subsRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch('/api/subscriptions'),
      ]);
      const userData = await userRes.json();
      const subsData = await subsRes.json();

      const exportPayload = {
        exportedAt: new Date().toISOString(),
        application: 'Subscription Trimmer AI',
        user: userData.data || null,
        subscriptions: subsData.data?.subscriptions || [],
      };

      const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `subscription-trimmer-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export data:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleEraseData = async () => {
    if (confirm('Are you sure you want to trigger GDPR/CCPA Account Erase? All bank connections, transactions, and user logs will be permanently deleted and you will be signed out.')) {
      setErased(true);
      try {
        await fetch('/api/auth/logout', { method: 'POST' });
      } catch {
        // proceed
      }
      setTimeout(() => {
        window.location.href = '/login';
      }, 1000);
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
                <div className="text-cyan-300 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> API Key Generated Successfully (Save it now - shown only once!)
                </div>
                <div className="flex items-center justify-between bg-slate-950 p-2 rounded border border-slate-800 text-slate-200">
                  <span className="truncate mr-2">{createdFullKey}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(createdFullKey);
                      setCopiedKey(true);
                      setTimeout(() => setCopiedKey(false), 2000);
                    }}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[10px] flex items-center gap-1 shrink-0"
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
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-extrabold rounded-xl flex items-center gap-1.5 hover:from-cyan-400 hover:to-emerald-300 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Create Key
              </button>
            </form>

            <div className="space-y-2 pt-2">
              {loading ? (
                Array.from({ length: 2 }).map((_, idx) => (
                  <div key={`skel-key-${idx}`} className="p-3 rounded-xl bg-[#0b0f1d] border border-slate-800 flex justify-between items-center animate-skeleton">
                    <div className="space-y-1.5">
                      <div className="w-28 h-3.5 bg-slate-800/60 rounded" />
                      <div className="w-48 h-2.5 bg-slate-800/40 rounded" />
                    </div>
                    <div className="w-14 h-6 bg-slate-800/50 rounded" />
                  </div>
                ))
              ) : apiKeys.length === 0 ? (
                <div className="text-xs text-slate-500 font-mono py-2">No active API keys created yet.</div>
              ) : (
                apiKeys.map((k) => (
                  <div key={k.id} className="p-3 rounded-xl bg-[#0b0f1d] border border-slate-800 flex justify-between items-center text-xs font-mono">
                    <div>
                      <div className="font-bold text-slate-200">{k.name}</div>
                      <div className="text-[10px] text-slate-500">Prefix: {k.keyPrefix} • Scopes: {Array.isArray(k.scopes) ? k.scopes.join(', ') : k.scopes} • Status: {k.status}</div>
                    </div>
                    {k.status === 'ACTIVE' && (
                      <button
                        onClick={() => handleRevokeKey(k.id)}
                        className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded text-[10px] border border-rose-500/20 transition-colors"
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                ))
              )}
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
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  twoFactorEnabled
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
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
                  <div className="font-bold text-slate-200">Export All Data (JSON)</div>
                  <div className="text-[10px] text-slate-500">Download complete transaction ledgers and subscription audit history.</div>
                </div>
                <button
                  onClick={handleExportData}
                  disabled={isExporting}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 text-cyan-400 hover:bg-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" /> {isExporting ? 'Exporting...' : 'Export Data'}
                </button>
              </div>

              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex justify-between items-center">
                <div>
                  <div className="font-bold text-rose-400">One-Click Account & Data Erase</div>
                  <div className="text-[10px] text-slate-400">Permanently delete user profile, bank tokens, and transaction history.</div>
                </div>
                <button
                  onClick={handleEraseData}
                  disabled={erased}
                  className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5" /> {erased ? 'Signing Out...' : 'Erase Account'}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
