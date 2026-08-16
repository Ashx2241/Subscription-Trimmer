import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 space-y-8">
        <div>
          <h1 className="text-3xl font-black text-slate-100 tracking-tight">Privacy Policy</h1>
          <p className="text-sm text-slate-400 mt-2">Last updated: August 16, 2026</p>
        </div>

        <section className="space-y-4 text-slate-300 leading-relaxed text-sm">
          <h2 className="text-lg font-bold text-cyan-400">1. Information We Collect</h2>
          <p>
            Subscription Trimmer (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) collects information to provide privacy-first subscription management and spending insights:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-400">
            <li><strong>Account Data:</strong> Name, email address, password hash, and OAuth profile details when you register.</li>
            <li><strong>Financial Data:</strong> Read-only transaction amounts, dates, and merchant descriptions retrieved via authorized bank data aggregators (e.g. Plaid, MX). We <em>never</em> see or store your bank login credentials.</li>
            <li><strong>Subscription Decisions:</strong> User-provided input regarding subscription status, custom categories, and cancellation requests.</li>
          </ul>
        </section>

        <section className="space-y-4 text-slate-300 leading-relaxed text-sm">
          <h2 className="text-lg font-bold text-cyan-400">2. How We Use Information</h2>
          <p>We use collected data strictly to:</p>
          <ul className="list-disc pl-6 space-y-2 text-slate-400">
            <li>Detect recurring subscription payments and estimate renewal dates.</li>
            <li>Generate authorized cancellation notices on your explicit instruction.</li>
            <li>Send billing alerts, price hike notifications, and spending reports.</li>
            <li>Maintain application security, rate limiting, and audit logging.</li>
          </ul>
        </section>

        <section className="space-y-4 text-slate-300 leading-relaxed text-sm">
          <h2 className="text-lg font-bold text-cyan-400">3. Data Security & Storage</h2>
          <p>
            All data in transit is encrypted using TLS 1.3/HTTPS. Sensitive data at rest (including API keys and OAuth tokens) is hashed using SHA-256 or encrypted with AES-256. Access tokens are stored exclusively in secure, HttpOnly cookies to prevent Cross-Site Scripting (XSS) attacks.
          </p>
        </section>

        <section className="space-y-4 text-slate-300 leading-relaxed text-sm">
          <h2 className="text-lg font-bold text-cyan-400">4. Data Sharing & Third Parties</h2>
          <p>
            We do <strong>not</strong> sell, rent, or monetize your personal or financial data. Data is shared with third parties only when necessary to fulfill core services:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-400">
            <li><strong>Bank Aggregators (Plaid/MX):</strong> Secure transaction data synchronization.</li>
            <li><strong>Payment Processors (Stripe):</strong> Premium subscription billing.</li>
            <li><strong>Postal Services (Lob):</strong> Certified physical mail delivery for merchant cancellations when explicitly requested.</li>
          </ul>
        </section>

        <section className="space-y-4 text-slate-300 leading-relaxed text-sm">
          <h2 className="text-lg font-bold text-cyan-400">5. Your Privacy Rights & Data Deletion</h2>
          <p>
            You have the right to export or permanently delete your account and associated financial data at any time via your Account Settings page or by contacting <code>privacy@subscriptiontrimmer.com</code>.
          </p>
        </section>

        <div className="pt-6 border-t border-slate-800 flex justify-between items-center text-xs text-slate-500">
          <p>© 2026 Subscription Trimmer Inc. All rights reserved.</p>
          <Link href="/terms" className="text-cyan-400 hover:underline">Terms of Service →</Link>
        </div>
      </main>
    </div>
  );
}
