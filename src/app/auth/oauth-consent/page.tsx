'use client';

import { use, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ShieldCheck, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

function OAuthConsentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const provider = searchParams.get('provider') || 'Google';
  const [authorizing, setAuthorizing] = useState(false);

  const getProviderIcon = () => {
    if (provider.toLowerCase() === 'google') {
      return (
        <svg className="w-8 h-8" viewBox="0 0 24 24">
          <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
          <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
          <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.4 0 15.3s.7 5.6 1.9 8l3.7-2.9c-.2-.7-.4-1.5-.4-2.3z" />
          <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z" />
        </svg>
      );
    } else if (provider.toLowerCase() === 'apple') {
      return (
        <svg className="w-8 h-8 fill-current text-white" viewBox="0 0 24 24">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.35c.67-.82 1.13-1.96.99-3.1-.98.04-2.18.66-2.88 1.48-.62.72-1.16 1.88-1.01 3 .1.01 2.22.61 2.9-1.38z" />
        </svg>
      );
    }
    return (
      <svg className="w-8 h-8 fill-current text-white" viewBox="0 0 24 24">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    );
  };

  const handleAuthorize = async () => {
    setAuthorizing(true);
    try {
      await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: `user+${provider.toLowerCase()}@example.com`, password: 'Password123!' }),
      });
      router.push('/');
    } catch (e) {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-[#0e1424] border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl relative text-center"
      >
        <div className="flex justify-center">{getProviderIcon()}</div>

        <div className="space-y-1">
          <h1 className="text-xl font-bold text-slate-100">Sign in with {provider}</h1>
          <p className="text-xs text-slate-400">
            Subscription Trimmer AI wants to access your account details
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#070a13] border border-slate-800/80 text-left space-y-2 text-xs font-mono text-slate-300">
          <div className="font-semibold text-cyan-400 flex items-center gap-1.5 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-cyan-400" /> OAuth 2.0 Authorized Permissions
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Read your primary email address</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Read basic profile information (Name & Avatar)</span>
          </div>
        </div>

        <button
          onClick={handleAuthorize}
          disabled={authorizing}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-emerald-500 to-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-teal-400 transition-all flex items-center justify-center gap-2"
        >
          {authorizing ? 'Authenticating...' : `Authorize with ${provider}`} <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => router.push('/login')}
          className="text-xs text-slate-500 hover:text-slate-400 font-mono underline"
        >
          Cancel and return to Login
        </button>
      </motion.div>
    </div>
  );
}

export default function OAuthConsentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#070a13] text-slate-100 flex items-center justify-center font-mono text-xs">Loading OAuth Consent Screen...</div>}>
      <OAuthConsentContent />
    </Suspense>
  );
}
