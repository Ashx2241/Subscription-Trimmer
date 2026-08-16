'use client';

import { use, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import {
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Copy,
  Check,
  FileText,
} from 'lucide-react';

interface MerchantGuide {
  name: string;
  category: string;
  avgCost: string;
  officialUrl: string;
  steps: string[];
  template?: string;
  californiaArlNotice?: string;
}

const MERCHANT_GUIDES: Record<string, MerchantGuide> = {
  'planet-fitness': {
    name: 'Planet Fitness',
    category: 'Fitness & Health',
    avgCost: '$24.99 / month',
    officialUrl: 'https://www.planetfitness.com/about-planet-fitness/customer-service',
    steps: [
      'Planet Fitness requires written notice or in-person cancellation at your home club.',
      'Prepare a written cancellation letter including your Full Name, Member ID, and signature.',
      'Send via Certified Mail with tracking, or hand-deliver to your club manager.',
      'Request written confirmation of membership termination and revocation of ACH auto-debit permissions.',
    ],
    californiaArlNotice: 'Under California ARL § 17600 and FTC Click-to-Cancel rules, California consumers who enrolled online have the legal right to cancel online without requiring in-person visits.',
  },
  netflix: {
    name: 'Netflix',
    category: 'Entertainment',
    avgCost: '$15.99 / month',
    officialUrl: 'https://www.netflix.com/youraccount',
    steps: [
      'Log into your Netflix account at Netflix.com.',
      'Click your profile icon in the top right and select "Account".',
      'Under the Membership & Billing section, click the "Cancel Membership" button.',
      'Click "Finish Cancellation" to confirm. Access remains active until your current billing period ends.',
    ],
    californiaArlNotice: 'Under California ARL § 17600, recurring auto-renewals must provide a prominent, one-click online cancellation mechanism.',
  },
  adobe: {
    name: 'Adobe Creative Cloud',
    category: 'SaaS & Productivity',
    avgCost: '$54.99 / month',
    officialUrl: 'https://account.adobe.com/plans',
    steps: [
      'Log into your Adobe account at account.adobe.com/plans.',
      'Select "Manage plan" or "Cancel your plan" for Creative Cloud.',
      'Indicate your reason for cancellation.',
      'Review any early termination fee warnings (switch to a cheaper plan or request fee waiver under FTC rules).',
      'Confirm cancellation to receive your confirmation email.',
    ],
    californiaArlNotice: 'Under FTC Click-to-Cancel guidance, cancellation friction and hidden early termination fees must be disclosed prominently prior to signup.',
  },
  spotify: {
    name: 'Spotify',
    category: 'Music & Audio',
    avgCost: '$16.99 / month',
    officialUrl: 'https://www.spotify.com/account/change-plan/',
    steps: [
      'Log into Spotify.com/account.',
      'Under "Your plan", click "Change plan".',
      'Scroll down to "Cancel Spotify" and click "Cancel Premium".',
      'Confirm until you see the confirmation screen.',
    ],
    californiaArlNotice: 'California ARL § 17600 requires clear pre-cancellation confirmation disclosures.',
  },
};

export default function SEOCancellationGuidePage({ params }: { params: Promise<{ merchant: string }> }) {
  const { merchant } = use(params);
  const guideKey = merchant.toLowerCase();
  const guide = MERCHANT_GUIDES[guideKey] || {
    name: merchant.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    category: 'Subscription Service',
    avgCost: '$19.99 / month',
    officialUrl: `https://${guideKey}.com`,
    steps: [
      'Log into your account settings on the official merchant website.',
      'Locate Billing or Membership settings.',
      'Select Cancel Subscription and confirm.',
    ],
    californiaArlNotice: 'Protected by California ARL § 17600 & FTC Click-to-Cancel rules.',
  };

  const [generatedLetter, setGeneratedLetter] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerateAI = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedLetter(
        `SUBJECT: LEGAL FORMAL NOTICE OF CANCELLATION & REVOCATION OF PAYMENT AUTHORIZATION — ${guide.name.toUpperCase()}\n\n` +
          `Date: ${new Date().toLocaleDateString('en-US')}\n` +
          `To: ${guide.name} Customer Support & Billing Department\n\n` +
          `I am writing to formally request the immediate cancellation of my recurring subscription membership for ${guide.name}, effective as of today.\n\n` +
          `Pursuant to California Automatic Renewal Law (ARL § 17600) and FTC rules, please consider this notice as explicit revocation of any authorization for ${guide.name} or its billing intermediaries to charge my credit card, debit card, or bank account for any future billing cycles.\n\n` +
          `Please reply to this communication within three (3) business days confirming:\n` +
          `1. The effective termination date of my subscription.\n` +
          `2. Confirmation that no further recurring charges will be processed.\n\n` +
          `Sincerely,\n` +
          `Jane Doe\n` +
          `Account Email: user@example.com`
      );
      setIsGenerating(false);
    }, 1000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header title={`Cancellation Guide / ${guide.name}`} />

        <main className="flex-1 p-6 space-y-6 overflow-y-auto max-w-5xl">
          {/* Header Banner */}
          <div className="dark-card p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-slate-100">How to Cancel {guide.name}</h1>
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold">
                    VERIFIED GUIDE 2026
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Official step-by-step cancellation instructions & legal consumer rights.
                </p>
              </div>

              <a
                href={guide.officialUrl}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-emerald-500 to-teal-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-teal-400 transition-all flex items-center justify-center gap-2"
              >
                Open Official Cancellation Page <ExternalLink className="w-4 h-4 stroke-[2.5]" />
              </a>
            </div>

            {/* California ARL Rights Box */}
            <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300 flex items-start gap-2.5 font-mono">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-cyan-400" />
              <span>{guide.californiaArlNotice}</span>
            </div>
          </div>

          {/* Cancellation Steps Card */}
          <div className="dark-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <h2 className="text-base font-bold text-slate-200 flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-400" /> Step-by-Step Cancellation Process
            </h2>

            <div className="space-y-3 font-mono text-xs">
              {guide.steps.map((stepText: string, idx: number) => (
                <div key={idx} className="p-4 rounded-xl bg-[#0b0f1d] border border-slate-800 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center font-bold text-xs shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-slate-300 leading-relaxed pt-0.5">{stepText}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Legal Letter Generator */}
          <div className="dark-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-400" /> Generate AI Cancellation Letter
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Pre-formatted formal notice incorporating California ARL § 17600 and FTC rules.
                </p>
              </div>

              <button
                onClick={handleGenerateAI}
                disabled={isGenerating}
                className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-emerald-400 font-bold hover:bg-slate-800 transition-all flex items-center gap-2"
              >
                {isGenerating ? 'Generating...' : 'Generate Letter'} <Sparkles className="w-4 h-4" />
              </button>
            </div>

            {generatedLetter && (
              <div className="space-y-3">
                <div className="relative">
                  <textarea
                    rows={12}
                    readOnly
                    value={generatedLetter}
                    className="w-full bg-[#0b0f1d] border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-200 focus:outline-none leading-relaxed"
                  />
                  <button
                    onClick={handleCopy}
                    className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-mono text-cyan-400 border border-slate-700 hover:bg-slate-700 transition-colors flex items-center gap-1.5"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied!' : 'Copy Notice'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
