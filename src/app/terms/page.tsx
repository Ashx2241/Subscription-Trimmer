import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 space-y-8">
        <div>
          <h1 className="text-3xl font-black text-slate-100 tracking-tight">Terms of Service</h1>
          <p className="text-sm text-slate-400 mt-2">Last updated: August 16, 2026</p>
        </div>

        <section className="space-y-4 text-slate-300 leading-relaxed text-sm">
          <h2 className="text-lg font-bold text-cyan-400">1. Agreement to Terms</h2>
          <p>
            By accessing or using Subscription Trimmer (&quot;Service&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the Service.
          </p>
        </section>

        <section className="space-y-4 text-slate-300 leading-relaxed text-sm">
          <h2 className="text-lg font-bold text-cyan-400">2. Service Description</h2>
          <p>
            Subscription Trimmer is a financial co-pilot tool that analyzes financial transaction data to detect recurring payments, forecast billing dates, provide spend metrics, and assist users in generating and delivering cancellation requests to merchants.
          </p>
        </section>

        <section className="space-y-4 text-slate-300 leading-relaxed text-sm">
          <h2 className="text-lg font-bold text-cyan-400">3. User Representation & Cancellation Authorization</h2>
          <p>
            When you request an AI-generated cancellation letter or authorize a cancellation email through the Service, you grant Subscription Trimmer permission to transmit the notice on your behalf to the merchant specified. You represent that you are the lawful account holder of the subscription being cancelled.
          </p>
        </section>

        <section className="space-y-4 text-slate-300 leading-relaxed text-sm">
          <h2 className="text-lg font-bold text-cyan-400">4. Financial Advice Disclaimer</h2>
          <p>
            Subscription Trimmer is an automated software utility and does <strong>not</strong> provide legal, tax, or professional financial advice. All recurring payment predictions and cost calculations are estimates based on historical data.
          </p>
        </section>

        <section className="space-y-4 text-slate-300 leading-relaxed text-sm">
          <h2 className="text-lg font-bold text-cyan-400">5. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by applicable law, Subscription Trimmer Inc. shall not be liable for indirect, incidental, or consequential damages resulting from merchant delays in processing cancellation requests, merchant billing disputes, or service outages.
          </p>
        </section>

        <div className="pt-6 border-t border-slate-800 flex justify-between items-center text-xs text-slate-500">
          <p>© 2026 Subscription Trimmer Inc. All rights reserved.</p>
          <Link href="/privacy" className="text-cyan-400 hover:underline">← Privacy Policy</Link>
        </div>
      </main>
    </div>
  );
}
