'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import {
  Scissors,
  FileText,
  Send,
  CheckCircle2,
  AlertOctagon,
  Copy,
  Download,
  ShieldCheck,
  ExternalLink,
  Mail,
  Building,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { jsPDF } from 'jspdf';

interface CancellationItem {
  id: string;
  status: string;
  method: string;
  generatedContent?: string;
  authorizedAt?: string;
  confirmedAt?: string;
  subscription: {
    id: string;
    amount: number;
    frequency: string;
    monthlyCost: number;
    annualizedCost: number;
    merchant: {
      normalizedName: string;
      category: string;
      cancellationUrl?: string;
      cancellationPhone?: string;
      cancellationEmail?: string;
      cancellationInstructions?: string;
    };
  };
}

export default function CancellationCenterPage() {
  const [cancellations, setCancellations] = useState<CancellationItem[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<CancellationItem | null>(null);
  const [generating, setGenerating] = useState(false);
  const [authorizing, setAuthorizing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [copied, setCopied] = useState(false);

  async function loadCancellations() {
    try {
      const res = await fetch('/api/subscriptions');
      const data = await res.json();
      if (data.success) {
        // Collect all subscriptions marked for CANCEL or with requests
        const cancelSubs = data.data.subscriptions.filter(
          (s: any) => s.userStatus === 'CANCEL' || s.status === 'CANCELLED'
        );

        const requestList: CancellationItem[] = cancelSubs.map((s: any) => {
          const req = s.cancellationRequests[0];
          return {
            id: req?.id || `temp-req-${s.id}`,
            status: req?.status || 'NOT_STARTED',
            method: req?.method || (s.merchant.cancellationUrl ? 'GUIDED_LINK' : 'AI_EMAIL'),
            generatedContent: req?.generatedContent,
            authorizedAt: req?.authorizedAt,
            confirmedAt: req?.confirmedAt,
            subscription: s,
          };
        });

        setCancellations(requestList);
        if (requestList.length > 0 && !selectedRequest) {
          setSelectedRequest(requestList[0]);
        }
      }
    } catch (err) {
      console.error('Error loading cancellation center:', err);
    }
  }

  useEffect(() => {
    loadCancellations();
  }, []);

  async function handleGenerateMessage(reqId: string) {
    try {
      setGenerating(true);
      const res = await fetch(`/api/cancellations/${reqId}/generate-message`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        loadCancellations();
        setSelectedRequest((prev) => (prev ? { ...prev, ...data.data } : null));
      }
    } catch (err) {
      console.error('Generate error:', err);
    } finally {
      setGenerating(false);
    }
  }

  async function handleAuthorize(reqId: string) {
    try {
      setAuthorizing(true);
      const res = await fetch(`/api/cancellations/${reqId}/authorize`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        loadCancellations();
        setSelectedRequest((prev) => (prev ? { ...prev, ...data.data } : null));
      }
    } catch (err) {
      console.error('Authorize error:', err);
    } finally {
      setAuthorizing(false);
    }
  }

  async function handleConfirm(reqId: string) {
    try {
      setConfirming(true);
      const res = await fetch(`/api/cancellations/${reqId}/confirm`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        loadCancellations();
        setSelectedRequest((prev) => (prev ? { ...prev, ...data.data.cancellation } : null));
      }
    } catch (err) {
      console.error('Confirm error:', err);
    } finally {
      setConfirming(false);
    }
  }

  function handleCopyText(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownloadPDF(merchantName: string, text: string) {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(`Cancellation Notice - ${merchantName}`, 14, 20);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const splitLines = doc.splitTextToSize(text, 180);
    doc.text(splitLines, 14, 30);
    doc.save(`cancellation-notice-${merchantName.toLowerCase().replace(/\s+/g, '-')}.pdf`);
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-400 text-xs font-mono font-semibold border border-rose-500/20">
                ACTION CENTER
              </span>
              <span className="text-xs text-slate-400">• Explicit User Consent Required</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-100 mt-1">
              Cancellation Execution Engine
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              State-machine tracked cancellation workflows, AI legal notice generators, and certified postal mail hooks.
            </p>
          </div>
        </div>

        {cancellations.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-2xl border border-slate-800 space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-200">No Pending Cancellations</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              You currently have no services marked for cancellation. Visit your Subscriptions matrix to mark services you want to cut.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Queue Sidebar */}
            <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
                Cancellation Queue ({cancellations.length})
              </h3>
              <div className="space-y-2">
                {cancellations.map((item) => {
                  const isSelected = selectedRequest?.id === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedRequest(item)}
                      className={`w-full text-left p-3.5 rounded-xl transition-all border ${
                        isSelected
                          ? 'bg-slate-800 text-slate-100 border-emerald-500/40 shadow-sm'
                          : 'bg-slate-900/40 text-slate-400 border-slate-800 hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs">{item.subscription.merchant.normalizedName}</span>
                        <span className="font-mono text-xs text-emerald-400">
                          ${item.subscription.annualizedCost.toFixed(2)}/yr
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[10px] text-slate-500">{item.subscription.merchant.category}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-slate-900 text-slate-300 border border-slate-800">
                          {item.status}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Execution Workspace */}
            {selectedRequest && (
              <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
                {/* Header & Status Indicator */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div>
                    <h2 className="text-xl font-bold text-slate-100">
                      {selectedRequest.subscription.merchant.normalizedName}
                    </h2>
                    <p className="text-xs text-slate-400">
                      Amount: ${selectedRequest.subscription.amount.toFixed(2)} / {selectedRequest.subscription.frequency.toLowerCase()} (${selectedRequest.subscription.annualizedCost.toFixed(2)}/yr savings)
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-mono">Status:</span>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold">
                      {selectedRequest.status}
                    </span>
                  </div>
                </div>

                {/* State Machine Tracker */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Workflow Progress</span>
                  <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono">
                    <div className={`p-2 rounded-lg border ${selectedRequest.status !== 'NOT_STARTED' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-slate-900 text-slate-500 border-slate-800'}`}>
                      1. Init
                    </div>
                    <div className={`p-2 rounded-lg border ${['MESSAGE_GENERATED', 'USER_SENT', 'CONFIRMED'].includes(selectedRequest.status) ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-slate-900 text-slate-500 border-slate-800'}`}>
                      2. Draft
                    </div>
                    <div className={`p-2 rounded-lg border ${['USER_SENT', 'CONFIRMED'].includes(selectedRequest.status) ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-slate-900 text-slate-500 border-slate-800'}`}>
                      3. Authorized
                    </div>
                    <div className={`p-2 rounded-lg border ${selectedRequest.status === 'CONFIRMED' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-slate-900 text-slate-500 border-slate-800'}`}>
                      4. Confirmed
                    </div>
                  </div>
                </div>

                {/* Channel 1: Guided Self-Cancellation */}
                {selectedRequest.subscription.merchant.cancellationUrl && (
                  <div className="glass-card p-4 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                        <ExternalLink className="w-3.5 h-3.5 text-blue-400" /> Channel 1: Guided Self-Cancellation
                      </span>
                      <a
                        href={selectedRequest.subscription.merchant.cancellationUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-slate-950 font-bold text-xs transition-colors inline-flex items-center gap-1"
                      >
                        Open Cancellation Portal <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    {selectedRequest.subscription.merchant.cancellationInstructions && (
                      <p className="text-xs text-slate-400 pt-1 border-t border-slate-800">
                        <strong className="text-slate-300">Guide:</strong> {selectedRequest.subscription.merchant.cancellationInstructions}
                      </p>
                    )}
                  </div>
                )}

                {/* Channel 2: AI Legal Cancellation Email Generator */}
                <div className="glass-card p-5 rounded-xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-emerald-400" /> Channel 2: AI Legal Cancellation Notice
                    </span>
                    {!selectedRequest.generatedContent && (
                      <button
                        onClick={() => handleGenerateMessage(selectedRequest.id)}
                        disabled={generating}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors disabled:opacity-50"
                      >
                        {generating ? 'Generating Notice...' : 'Generate AI Legal Notice'}
                      </button>
                    )}
                  </div>

                  {selectedRequest.generatedContent && (
                    <div className="space-y-3">
                      <div className="relative">
                        <textarea
                          readOnly
                          rows={8}
                          value={selectedRequest.generatedContent}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-300 focus:outline-none"
                        />
                        <div className="absolute top-2 right-2 flex items-center gap-2">
                          <button
                            onClick={() => handleCopyText(selectedRequest.generatedContent!)}
                            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[10px] flex items-center gap-1 border border-slate-700"
                          >
                            <Copy className="w-3 h-3" /> {copied ? 'Copied!' : 'Copy'}
                          </button>
                          <button
                            onClick={() =>
                              handleDownloadPDF(
                                selectedRequest.subscription.merchant.normalizedName,
                                selectedRequest.generatedContent!
                              )
                            }
                            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[10px] flex items-center gap-1 border border-slate-700"
                          >
                            <Download className="w-3 h-3" /> Download PDF
                          </button>
                        </div>
                      </div>

                      {/* Explicit User Authorization Action Button */}
                      {selectedRequest.status !== 'USER_SENT' && selectedRequest.status !== 'CONFIRMED' && (
                        <div className="p-3 bg-amber-950/20 border border-amber-500/20 rounded-xl space-y-2">
                          <div className="flex items-center gap-2 text-xs text-amber-300">
                            <ShieldCheck className="w-4 h-4 text-amber-400" />
                            <span>FinTech Security Guard: Explicit User Authorization Required</span>
                          </div>
                          <button
                            onClick={() => handleAuthorize(selectedRequest.id)}
                            disabled={authorizing}
                            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/20 disabled:opacity-50"
                          >
                            {authorizing ? 'Recording Authorization...' : 'I Authorize Dispatch of This Cancellation Notice'}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Final Confirmation Action */}
                {selectedRequest.status === 'USER_SENT' && (
                  <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-emerald-300">Did the merchant confirm your cancellation?</h4>
                      <p className="text-[10px] text-slate-400">Lock in your annualized savings in your financial metrics.</p>
                    </div>
                    <button
                      onClick={() => handleConfirm(selectedRequest.id)}
                      disabled={confirming}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition-colors shadow-lg"
                    >
                      {confirming ? 'Confirming...' : 'Yes, Confirm Cancellation'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
