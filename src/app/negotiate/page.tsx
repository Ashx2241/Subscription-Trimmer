'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Sparkles, Copy, Check, FileText } from 'lucide-react';

export default function NegotiatePage() {
  const [merchant, setMerchant] = useState('Comcast Xfinity');
  const [currentBill, setCurrentBill] = useState(120);
  const [script, setScript] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setScript(
        `[RETENTION DISCOUNT NEGOTIATION SCRIPT — ${merchant.toUpperCase()}]\n\n` +
          `Step 1: Call Customer Service at 1-800-XFINITY and select "Cancel Service" on the phone menu (this routes you to Retention).\n\n` +
          `Step 2: Use this exact spoken script with the retention agent:\n\n` +
          `"Hi, I have been a loyal customer for over 2 years, but my monthly bill recently jumped to $${currentBill}/month. ` +
          `I noticed competitor promotional offers in my area for $45/month with similar speeds. ` +
          `I would love to stay with ${merchant}, but I need to reduce my bill today. ` +
          `What promotional rates or loyalty discounts can you apply to bring my monthly rate back down to $45-$50?"\n\n` +
          `Step 3: If they offer $20 off, say: "Thank you, is there any additional loyalty credit or free speed upgrade you can bundle to make this a 12-month agreement?"`
      );
      setIsGenerating(false);
    }, 800);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header title="AI Bill Negotiation Co-Pilot" />

        <main className="flex-1 p-6 space-y-6 overflow-y-auto max-w-4xl">
          <div className="dark-card p-6 rounded-2xl border border-slate-800 space-y-2">
            <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" /> Retention Discount Script Generator
            </h1>
            <p className="text-xs text-slate-400">
              Generate proven retention scripts to lower your cable, internet, or phone bills by 30-50% without cancelling.
            </p>
          </div>

          <div className="dark-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-slate-400">Provider Name</label>
                <input
                  type="text"
                  value={merchant}
                  onChange={(e) => setMerchant(e.target.value)}
                  className="w-full bg-[#0b0f1d] border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Current Monthly Bill ($)</label>
                <input
                  type="number"
                  value={currentBill}
                  onChange={(e) => setCurrentBill(Number(e.target.value))}
                  className="w-full bg-[#0b0f1d] border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-cyan-500 via-emerald-500 to-teal-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-teal-400 transition-all inline-flex items-center gap-2"
            >
              {isGenerating ? 'Generating Script...' : 'Generate Retention Script'} <Sparkles className="w-4 h-4" />
            </button>
          </div>

          {script && (
            <div className="dark-card p-6 rounded-2xl border border-slate-800 space-y-3 relative">
              <textarea
                rows={12}
                readOnly
                value={script}
                className="w-full bg-[#0b0f1d] border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-200 focus:outline-none leading-relaxed"
              />
              <button
                onClick={handleCopy}
                className="absolute top-8 right-8 px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-mono text-cyan-400 border border-slate-700 hover:bg-slate-700 transition-colors flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy Script'}
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
