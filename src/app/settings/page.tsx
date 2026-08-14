'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { ShieldCheck, Trash2, Lock, Download, Check, AlertTriangle } from 'lucide-react';

export default function SettingsPage() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [erased, setErased] = useState(false);

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
              <ShieldCheck className="w-5 h-5 text-cyan-400" /> Security & Privacy Controls
            </h1>
            <p className="text-xs text-slate-400">
              Manage multi-factor authentication, export your ledger data, or execute GDPR one-click data deletion.
            </p>
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
