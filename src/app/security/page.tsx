import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { ShieldCheck, Lock, Key, Server, EyeOff, CheckCircle2, HelpCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Security Architecture & FAQ',
  description: 'Learn about Subscription Trimmer zero-trust privacy architecture, data encryption standards, and frequently asked questions.',
};

export default function SecurityArchitecturePage() {
  const securityPillars = [
    {
      icon: EyeOff,
      title: 'Read-Only Bank Aggregation',
      description: 'Bank account linkages via Plaid and MX use strict read-only scopes. Subscription Trimmer has zero move-money capabilities and never sees or stores your bank login credentials.',
    },
    {
      icon: Lock,
      title: 'End-to-End Encryption',
      description: 'All traffic is encrypted in transit using TLS 1.3. Sensitive access tokens and database records are encrypted at rest using industry-standard AES-256-GCM encryption.',
    },
    {
      icon: Key,
      title: 'Cryptographic API Keys & Tokens',
      description: 'Developer API keys are salted and hashed using SHA-256 prior to database storage. Session tokens use signed JSON Web Tokens (JWT) stored in Secure, HttpOnly, SameSite=Lax cookies.',
    },
    {
      icon: Server,
      title: 'Enterprise Edge Protection',
      description: 'Edge proxy middleware enforces Strict-Transport-Security (HSTS), Content-Security-Policy (CSP), and X-Frame-Options: DENY to prevent clickjacking, XSS, and CSRF attacks.',
    },
  ];

  const faqs = [
    {
      question: 'What does Subscription-Trimmer do?',
      answer: 'Subscription Trimmer is a financial co-pilot that aggregates read-only transaction feeds to identify recurring charges, calculate annualized costs, forecast renewal dates, and assist in user-directed cancellation workflows.',
    },
    {
      question: 'How are subscriptions detected?',
      answer: 'Our detection engine analyzes transaction cadence, merchant metadata, and price periodicity to calculate a confidence score and flag recurring charges automatically.',
    },
    {
      question: 'Is my financial data stored?',
      answer: 'Only read-only transaction ledgers (merchant, amount, date, category) required for cadence analysis are stored. Bank login credentials and full credit card account numbers are never received or stored on our servers.',
    },
    {
      question: 'How does Google Sign-In work?',
      answer: 'Google Sign-In uses standard OAuth 2.0 PKCE authentication. Google verifies your identity and returns a verified email token. We never have access to your Google account password.',
    },
    {
      question: 'How can I cancel a subscription?',
      answer: 'Visit the Subscriptions Matrix to mark any service for cancellation. The Action Center then generates an AI cancellation notice or directs you to the verified merchant cancellation portal with explicit authorization steps.',
    },
    {
      question: 'How can I delete my data?',
      answer: 'You can trigger a complete one-click GDPR/CCPA Account & Data Erase from your Settings page at any time, which permanently removes all connected accounts, transactions, and user logs.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-6 py-12 space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-semibold">
            <ShieldCheck className="w-4 h-4" /> PRIVACY & COMPLIANCE ARCHITECTURE
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-100 tracking-tight">
            Built from the ground up for <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">financial data security.</span>
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            Subscription Trimmer is designed to provide subscription insights while maintaining zero access to your funds or sensitive credentials.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {securityPillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div key={pillar.title} className="dark-card p-6 rounded-2xl border border-slate-800 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
                  <Icon className="w-5 h-5" />
                </div>
                <h2 className="text-base font-bold text-slate-100">{pillar.title}</h2>
                <p className="text-xs text-slate-400 leading-relaxed">{pillar.description}</p>
              </div>
            );
          })}
        </div>

        {/* Zero-Trust Checklist */}
        <section className="dark-card p-8 rounded-3xl border border-slate-800 space-y-6">
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            Zero-Trust Data Protection Checklist
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>No raw banking credentials stored</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>Session tokens protected by HttpOnly & Secure flags</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>Role-Based Access Control (RBAC) on all admin APIs</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>Continuous IP rate-limiting on authentication endpoints</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>Immutable audit logs for sensitive operations</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>GDPR/CCPA compliant data deletion workflows</span>
            </div>
          </div>
        </section>

        {/* Frequently Asked Questions */}
        <section className="dark-card p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-cyan-400" /> Frequently Asked Questions
            </h2>
            <p className="text-xs text-slate-400">
              Clear answers regarding privacy, data access, and subscription cancellation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-[#0b0f1d] border border-slate-800/80 space-y-2">
                <h3 className="text-sm font-bold text-slate-200">{faq.question}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© 2026 Subscription Trimmer Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-cyan-400 hover:underline">Privacy Policy</Link>
            <Link href="/terms" className="text-cyan-400 hover:underline">Terms of Service</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
