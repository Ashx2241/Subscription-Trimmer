'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Scissors, Lock, Mail, Eye, EyeOff, ArrowRight, ShieldCheck, Check, AlertCircle, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlError = searchParams.get('error');
  const urlEmail = searchParams.get('email') || '';
  const isRegistered = searchParams.get('registered') === 'true';

  const initialError = urlError === 'google_auth_failed'
    ? 'Google sign-in could not be completed. Please try again.'
    : urlError === 'invalid_state'
    ? 'Security validation failed during Google sign-in. Please try again.'
    : '';

  const [email, setEmail] = useState(urlEmail);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState(initialError);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || 'Invalid email or password');
      }

      const redirectPath = searchParams.get('redirect') || '/';
      window.location.href = redirectPath;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to authenticate user');
    } finally {
      setLoading(false);
    }
  };

  const handleContinueWithGoogle = () => {
    setGoogleLoading(true);
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.href = '/api/auth/google';
  };

  return (
    <div suppressHydrationWarning className="min-h-screen bg-[#060913] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Ambient Mesh Gradient */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-violet-600/20 via-indigo-600/10 to-transparent rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-tl from-cyan-500/20 via-teal-500/10 to-transparent rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-950/30 rounded-full blur-[160px] pointer-events-none" />

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Frosted Glass Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[440px] bg-[#0c101d]/80 backdrop-blur-2xl p-8 sm:p-10 rounded-[32px] border border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] hover:border-cyan-500/30 transition-all duration-500 relative z-10 space-y-7 group"
      >
        {/* Glowing Top-Border Highlight */}
        <div className="absolute top-0 left-12 right-12 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

        {/* Card Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-3 group/logo mb-1">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-emerald-400 to-violet-500 p-[1.5px] shadow-lg shadow-cyan-500/25 group-hover/logo:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-[#080b15] rounded-[14px] flex items-center justify-center text-cyan-400">
                <Scissors className="w-6 h-6 stroke-[2.5]" />
              </div>
            </div>
            <div className="text-left">
              <div className="text-xl font-black tracking-tight text-white flex items-center gap-1">
                Trimmer<span className="text-cyan-400 font-black">AI</span>
              </div>
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                FinTech Co-Pilot
              </div>
            </div>
          </Link>
          <h1 className="text-xl font-bold tracking-tight text-slate-100">Welcome Back</h1>
          <p className="text-xs text-slate-400">Sign in to access your financial intelligence dashboard</p>
        </div>

        {isRegistered && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2.5">
            <Check className="w-4 h-4 shrink-0" />
            <span>Account created successfully! Please sign in with your credentials.</span>
          </div>
        )}

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 4. Continue with Google */}
        <div>
          <button
            type="button"
            onClick={handleContinueWithGoogle}
            disabled={googleLoading}
            className="w-full py-3.5 px-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-3 transition-all shadow-sm group/btn disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
              <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.4 0 15.3s.7 5.6 1.9 8l3.7-2.9c-.2-.7-.4-1.5-.4-2.3z" />
              <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z" />
            </svg>
            <span>{googleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
          </button>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-white/10 w-full" />
          <span className="bg-[#0c101d] px-3 text-[10px] font-mono text-slate-500 uppercase tracking-widest relative z-10 shrink-0">
            or sign in with email
          </span>
        </div>

        {/* 5-9. Email / Password Form */}
        <form onSubmit={handleSignIn} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 ml-1">Email Address</label>
            <div className="relative group/input">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within/input:text-cyan-400 transition-colors">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-[#080b15]/80 border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between ml-1">
              <label className="text-xs font-semibold text-slate-300">Password</label>
              <Link
                href="/forgot-password"
                className="text-[11px] font-semibold text-cyan-400/80 hover:text-cyan-300 hover:underline transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative group/input">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within/input:text-cyan-400 transition-colors">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-[#080b15]/80 border border-white/10 rounded-2xl pl-10 pr-10 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono tracking-wide"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between py-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded-lg bg-[#080b15] border-white/10 text-cyan-500 focus:ring-0 focus:ring-offset-0 transition-all cursor-pointer"
              />
              <span className="text-xs text-slate-400">Remember this device</span>
            </label>
            <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
              <ShieldCheck className="w-3.5 h-3.5" /> Zero-Trust
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-emerald-500 to-teal-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-teal-300 hover:shadow-cyan-500/40 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* 10. Footer Registration Link */}
        <div className="text-center text-xs text-slate-400">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-cyan-400 font-bold hover:text-cyan-300 transition-colors hover:underline">
            Register now
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#060913] flex items-center justify-center text-xs text-slate-500 font-mono">
          Loading authentication gateway...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
