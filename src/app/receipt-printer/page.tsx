"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  TactileReceiptPrinter,
  ReceiptPrinterStage,
  ReceiptFeedMotion,
} from "@/components/ReceiptPrinter";
import {
  Play,
  RotateCcw,
  Sparkles,
  Home,
  Calendar,
  Mail,
  Moon,
  CheckCircle2,
  ArrowRight,
  Zap,
} from "lucide-react";

import {
  TactileButton,
  TactileButtonShowcase,
  ArrowRightIcon,
} from "@/components/TactileButton";
import { LogoTraceLoader } from "@/components/LogoTraceLoader";

export default function ReceiptPrinterShowcasePage() {
  const [stage, setStage] = useState<ReceiptPrinterStage>("complete");
  const [feedMotion, setFeedMotion] = useState<ReceiptFeedMotion>("stepped");
  const [isPlayingSequence, setIsPlayingSequence] = useState(false);

  // Play realistic simulation
  const startSimulation = () => {
    setIsPlayingSequence(true);
    setStage("processing");

    setTimeout(() => {
      setStage("printing");
      setTimeout(() => {
        setStage("complete");
        setIsPlayingSequence(false);
      }, 2000);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 flex flex-col items-center justify-between p-4 sm:p-8 relative overflow-hidden selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[400px] h-[300px] bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Top Header info */}
      <header className="relative z-10 w-full max-w-2xl flex items-center justify-between py-2 mb-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold tracking-wide">
          <Sparkles className="w-3.5 h-3.5" />
          <span>TACTILE HARDWARE UI</span>
        </div>
      </header>

      {/* Main Interactive Container */}
      <main className="relative z-10 w-full max-w-2xl flex flex-col items-center space-y-8">
        {/* The Receipt Printer Widget matching screenshot */}
        <div className="w-full flex justify-center py-2">
          <TactileReceiptPrinter
            stage={stage}
            feedMotion={feedMotion}
            planName="Pro plan"
            planDescription="Annual subscription"
            subtotal="£192.00"
            tax="£38.40"
            total="£230.40"
            orderNumber="ORD-2048"
            paidWith="Visa •••• 4242"
            date="11 AUG 2026 · 14:32"
          />
        </div>

        {/* Interactive Controls & Stage Switchers */}
        <div className="w-full max-w-sm p-4 rounded-2xl bg-[#0f1424]/90 border border-white/10 backdrop-blur-md shadow-2xl space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Interactive Simulator</span>
            <span className="font-mono text-emerald-400 uppercase text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Stage: {stage}
            </span>
          </div>

          {/* Tactile Simulation Trigger Button */}
          <TactileButton
            variant="emerald"
            size="md"
            className="w-full"
            onClick={startSimulation}
            disabled={isPlayingSequence}
            isLoading={isPlayingSequence}
            rightIcon={<ArrowRightIcon size={14} />}
          >
            <span>{isPlayingSequence ? "Printing Receipt..." : "Play Checkout & Print Sequence"}</span>
          </TactileButton>

          {/* Manual Stage Selector */}
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-black/40 border border-white/5 text-xs font-semibold">
            {(["processing", "printing", "complete"] as ReceiptPrinterStage[]).map(
              (s) => (
                <TactileButton
                  key={s}
                  size="xs"
                  variant={stage === s ? "primary" : "ghost"}
                  onClick={() => {
                    setIsPlayingSequence(false);
                    setStage(s);
                  }}
                  className={`capitalize ${
                    stage === s ? "text-white font-bold" : "text-slate-400"
                  }`}
                >
                  {s}
                </TactileButton>
              )
            )}
          </div>

          {/* Feed Motion Toggle */}
          <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
            <span className="text-slate-400 font-medium">Paper Feed Motion</span>
            <div className="flex gap-1">
              <TactileButton
                size="xs"
                variant={feedMotion === "stepped" ? "emerald" : "secondary"}
                onClick={() => setFeedMotion("stepped")}
              >
                Stepped
              </TactileButton>
              <TactileButton
                size="xs"
                variant={feedMotion === "smooth" ? "emerald" : "secondary"}
                onClick={() => setFeedMotion("smooth")}
              >
                Smooth
              </TactileButton>
            </div>
          </div>
        </div>

        {/* Logo Trace Loader Showcase */}
        <div className="w-full rounded-2xl bg-[#090d16] border border-white/10 p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-1">
            <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
              Continuous Vector Trace
            </span>
            <h3 className="text-lg font-bold text-white">SVG Logo Trace Loader</h3>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 py-4">
            <div className="flex flex-col items-center gap-2">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-[#121624] border border-white/10 shadow-inner text-cyan-400">
                <LogoTraceLoader
                  size={36}
                  loading={stage !== "complete"}
                  isComplete={stage === "complete"}
                  strokeWidth={2.2}
                />
              </div>
              <span className="text-[10px] font-mono text-slate-400">Cyan 36px</span>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-[#121624] border border-white/10 shadow-inner text-emerald-400">
                <LogoTraceLoader
                  size={36}
                  loading={stage !== "complete"}
                  isComplete={stage === "complete"}
                  strokeWidth={2.2}
                />
              </div>
              <span className="text-[10px] font-mono text-slate-400">Emerald 36px</span>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-[#121624] border border-white/10 shadow-inner text-white">
                <LogoTraceLoader
                  size={48}
                  loading={stage !== "complete"}
                  isComplete={stage === "complete"}
                  strokeWidth={2}
                />
              </div>
              <span className="text-[10px] font-mono text-slate-400">White 48px</span>
            </div>
          </div>
        </div>

        {/* Tactile Buttons System Showcase */}
        <div className="w-full">
          <TactileButtonShowcase />
        </div>
      </main>

      {/* Bottom Floating Dock matching the photo */}
      <footer className="relative z-20 mt-8 mb-2">
        <div className="flex items-center gap-4 sm:gap-5 px-6 py-2.5 rounded-full bg-[#161822]/90 border border-white/10 shadow-2xl backdrop-blur-xl text-slate-400">
          <button
            title="Home"
            aria-label="Home"
            className="hover:text-white transition-colors"
          >
            <Home className="w-4 h-4" />
          </button>
          {/* X / Twitter */}
          <button
            title="X (Twitter)"
            aria-label="X"
            className="hover:text-white transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </button>
          {/* GitHub */}
          <button
            title="GitHub"
            aria-label="GitHub"
            className="hover:text-white transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </button>
          <button
            title="Calendar"
            aria-label="Calendar"
            className="hover:text-white transition-colors"
          >
            <Calendar className="w-4 h-4" />
          </button>
          <button
            title="Mail"
            aria-label="Mail"
            className="hover:text-white transition-colors"
          >
            <Mail className="w-4 h-4" />
          </button>
          <button
            title="Dark mode"
            aria-label="Dark mode"
            className="hover:text-white transition-colors"
          >
            <Moon className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </div>
  );
}
