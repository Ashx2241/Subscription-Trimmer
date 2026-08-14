'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scissors,
  CheckCircle2,
  Building2,
  RefreshCw,
  Search,
  PieChart,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSyncing, setIsSyncing] = useState(false);

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 7));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSyncBank = async () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      nextStep();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header title="Onboarding Wizard" />

        <main className="flex-1 p-6 flex flex-col justify-center items-center relative overflow-hidden">
          {/* Progress Indicator */}
          <div className="w-full max-w-xl mb-8 flex items-center justify-between px-4">
            {[1, 2, 3, 4, 5, 6, 7].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs font-mono transition-all ${
                    s === step
                      ? 'bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-400/30 scale-110'
                      : s < step
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-slate-900 text-slate-600 border border-slate-800'
                  }`}
                >
                  {s < step ? <CheckCircle2 className="w-4 h-4" /> : s}
                </div>
              </div>
            ))}
          </div>

          <div className="w-full max-w-xl dark-card p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl relative">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6 text-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-400 p-0.5 mx-auto shadow-xl shadow-cyan-500/20">
                    <div className="w-full h-full bg-[#0b0f1d] rounded-[14px] flex items-center justify-center text-cyan-400">
                      <Scissors className="w-8 h-8 stroke-[2.5]" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-100">Welcome to Subscription Trimmer</h2>
                    <p className="text-xs text-slate-400 mt-2">
                      Your privacy-first FinTech co-pilot for detecting, analyzing, and trimming forgotten recurring charges.
                    </p>
                  </div>
                  <button
                    onClick={nextStep}
                    className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-emerald-300 transition-all flex items-center justify-center gap-2"
                  >
                    Start Setup <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <h2 className="text-xl font-bold text-slate-100">How Subscription Trimmer Works</h2>
                    <p className="text-xs text-slate-400 mt-1">3 simple steps to financial savings</p>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                      <Building2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-slate-200">1. Connect Read-Only Banking</div>
                        <p className="text-[11px] text-slate-400">OAuth encrypted read-only connection via Plaid or MX Sandbox.</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                      <Search className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-slate-200">2. AI Detection Engine</div>
                        <p className="text-[11px] text-slate-400">Scans historical transaction intervals to spot recurring subscriptions.</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                      <Scissors className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-slate-200">3. Guided Cancellation</div>
                        <p className="text-[11px] text-slate-400">Generate legally compliant AI cancellation letters and track savings.</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={prevStep}
                      className="py-3 px-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 font-bold text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <button
                      onClick={nextStep}
                      className="flex-1 py-3 px-6 rounded-xl bg-cyan-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-400/20 hover:bg-cyan-300 transition-all flex items-center justify-center gap-2"
                    >
                      Continue <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6 text-center"
                >
                  <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mx-auto">
                    <Building2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-100">Connect Sandbox Bank Account</h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Simulate connecting a checking account with 88 historical transactions.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-left text-xs space-y-2">
                    <div className="flex justify-between items-center text-slate-300 font-semibold">
                      <span>Chase Checking (Demo)</span>
                      <span className="text-emerald-400 font-mono">**** 4321</span>
                    </div>
                    <div className="text-[11px] text-slate-400">Balance: $4,850.25 (Read-Only)</div>
                  </div>

                  <button
                    onClick={handleSyncBank}
                    disabled={isSyncing}
                    className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-emerald-300 transition-all flex items-center justify-center gap-2"
                  >
                    {isSyncing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" /> Synchronizing...
                      </>
                    ) : (
                      <>
                        Connect Chase Sandbox <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6 text-center"
                >
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto">
                    <RefreshCw className="w-7 h-7 animate-spin" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-100">Synchronizing Transactions...</h2>
                    <p className="text-xs text-slate-400 mt-1">Ingesting 88 financial ledger entries across 12 months.</p>
                  </div>

                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full w-4/5 animate-pulse" />
                  </div>

                  <button
                    onClick={nextStep}
                    className="w-full py-3 px-6 rounded-xl bg-cyan-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-400/20 hover:bg-cyan-300 transition-all flex items-center justify-center gap-2"
                  >
                    Analysis Complete <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}

              {step === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6 text-center"
                >
                  <div className="w-14 h-14 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 mx-auto">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-100">AI Subscription Engine Analysis</h2>
                    <p className="text-xs text-slate-400 mt-1">Calculating payment intervals, confidence metrics, & false positives.</p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono space-y-2 text-left">
                    <div className="text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> 5 Recurring Subscriptions Identified
                    </div>
                    <div className="text-cyan-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Walmart / Target Exempted (False Positive Filtering)
                    </div>
                  </div>

                  <button
                    onClick={nextStep}
                    className="w-full py-3 px-6 rounded-xl bg-cyan-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-400/20 hover:bg-cyan-300 transition-all flex items-center justify-center gap-2"
                  >
                    View Subscriptions <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}

              {step === 6 && (
                <motion.div
                  key="step6"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <h2 className="text-xl font-bold text-slate-100">Detected Subscriptions</h2>
                    <p className="text-xs text-slate-400 mt-1">Review active services detected from your bank data</p>
                  </div>

                  <div className="space-y-2 text-xs font-mono">
                    {[
                      { name: 'Netflix', cost: '$15.99/mo', conf: '99%' },
                      { name: 'Spotify', cost: '$16.99/mo', conf: '98%' },
                      { name: 'Planet Fitness', cost: '$24.99/mo', conf: '92%' },
                      { name: 'ChatGPT Plus', cost: '$20.00/mo', conf: '95%' },
                      { name: 'Adobe Creative Cloud', cost: '$54.99/mo', conf: '97%' },
                    ].map((sub) => (
                      <div key={sub.name} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex justify-between items-center">
                        <span className="font-bold text-slate-200">{sub.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-amber-400">{sub.cost}</span>
                          <span className="text-emerald-400 text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            {sub.conf} Conf
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={nextStep}
                    className="w-full py-3 px-6 rounded-xl bg-cyan-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-400/20 hover:bg-cyan-300 transition-all flex items-center justify-center gap-2"
                  >
                    View Potential Savings <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}

              {step === 7 && (
                <motion.div
                  key="step7"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6 text-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-500 p-0.5 mx-auto shadow-xl shadow-emerald-400/20">
                    <div className="w-full h-full bg-[#0b0f1d] rounded-[14px] flex items-center justify-center text-emerald-400">
                      <PieChart className="w-8 h-8 stroke-[2.5]" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-100">Setup Complete!</h2>
                    <p className="text-xs text-slate-400 mt-1">
                      You have <span className="text-emerald-400 font-bold">$299.88 / year</span> in potential recurring savings ready for cancellation triage.
                    </p>
                  </div>

                  <button
                    onClick={() => router.push('/')}
                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 via-emerald-500 to-teal-500 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-teal-400 transition-all flex items-center justify-center gap-2"
                  >
                    Go to Dashboard <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
