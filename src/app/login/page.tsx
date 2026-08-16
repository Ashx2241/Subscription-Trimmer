'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Scissors, Lock, Mail, Eye, EyeOff, ArrowRight, ShieldCheck, Check, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlError = searchParams.get('error');

  const initialError = urlError === 'google_auth_failed'
    ? 'Google sign-in could not be completed. Please try again.'
    : urlError === 'invalid_state'
    ? 'Security validation failed during Google sign-in. Please try again.'
    : '';

  const [email, setEmail] = useState('user@example.com');
  const [password, setPassword] = useState('Password123!');
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
        throw new Error(data.error?.message || 'Invalid login credentials');
      }

      router.push('/');
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
    <div className="min-h-screen bg-[#060913] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Ambient Mesh Gradient & Light Leakage */}
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
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[440px] bg-[#0c101d]/60 backdrop-blur-2xl p-8 sm:p-10 rounded-[32px] border border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] hover:border-cyan-500/30 transition-all duration-500 relative z-10 space-y-7 group"
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
          <h1 className="text-2xl font-bold tracking-tight text-white">Welcome Back</h1>
          <p className="text-xs text-slate-400">Access your privacy-first subscription co-pilot</p>
        </div>

        {/* Demo Credentials Alert Box */}
        <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-xs space-y-1 backdrop-blur-md">
          <div className="font-semibold text-cyan-400 flex items-center gap-1.5 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5" /> Demo Sandbox Credentials
          </div>
          <div className="text-[11px] font-mono text-slate-400 flex justify-between">
            <span>User: <code className="text-slate-200">user@example.com</code></span>
            <span>Pass: <code className="text-slate-200">Password123!</code></span>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Official "Continue with Google" Button */}
        <button
          type="button"
          onClick={handleContinueWithGoogle}
          disabled={googleLoading}
          className="w-full py-3.5 px-4 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 text-slate-100 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-3 relative overflow-hidden group/gbtn"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
            <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
            <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.4 0 15.3s.7 5.6 1.9 8l3.7-2.9c-.2-.7-.4-1.5-.4-2.3z" />
            <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z" />
          </svg>
          <span>{googleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
        </button>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-white/10 w-full" />
          <span className="bg-[#0c101d] px-3 text-[10px] font-mono text-slate-500 uppercase tracking-widest relative z-10 shrink-0">
            or sign in with email
          </span>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSignIn} className="space-y-5">
          {/* Email Input */}
          <div className="relative space-y-1">
            <label className="text-[11px] font-semibold text-slate-300 tracking-wide uppercase font-mono">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-4 top-3.5 text-slate-500 pointer-events-none transition-colors group-focus-within:text-cyan-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-[#080c18]/80 border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 font-medium"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="relative space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-semibold text-slate-300 tracking-wide uppercase font-mono">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors font-medium hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-4 top-3.5 text-slate-500 pointer-events-none transition-colors group-focus-within:text-cyan-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#080c18]/80 border border-white/10 rounded-2xl pl-11 pr-11 py-3 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-slate-500 hover:text-slate-200 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2.5 cursor-pointer select-none group/check">
              <div
                onClick={() => setRememberMe(!rememberMe)}
                className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                  rememberMe
                    ? 'bg-cyan-500 border-cyan-400 text-slate-950 shadow-sm shadow-cyan-500/50'
                    : 'border-slate-700 bg-slate-900/50'
                }`}
              >
                {rememberMe && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <span className="text-xs text-slate-400 group-hover/check:text-slate-300 transition-colors">
                Remember this device
              </span>
            </label>
          </div>

          {/* CTA Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-emerald-400 to-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden group/btn"
          >
            <span className="relative z-10 flex items-center gap-2">
              {loading ? 'Authenticating...' : 'Sign In'}
              <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover/btn:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
          </button>
        </form>

        {/* Register Link */}
        <div className="text-center text-xs text-slate-500 pt-2">
          Don&#x27;t have an account?{' '}
          <Link href="/register" className="text-cyan-400 font-bold hover:text-cyan-300 transition-colors hover:underline">
            Register now
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function GlassmorphicLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#060913] text-slate-100 flex items-center justify-center font-mono text-xs">Loading Subscription Trimmer Auth...</div>}>
      <LoginContent />
    </Suspense>
  );
}
