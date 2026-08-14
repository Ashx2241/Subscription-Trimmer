'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scissors,
  PieChart,
  CreditCard,
  AlertOctagon,
  ShieldCheck,
  Shield,
  Layers,
  FileText,
  Lock,
  Zap,
  ChevronRight,
  LifeBuoy,
  Sparkles,
  Settings,
  Calendar,
  DollarSign,
  UserCheck,
  LogOut,
  ChevronDown,
  Receipt,
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [currentAccount, setCurrentAccount] = useState({
    name: 'Jane Doe',
    email: 'user@example.com',
    role: 'USER',
    bank: 'Chase Bank Linked',
    initials: 'JD',
  });

  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const primaryNav = [
    { href: '/', label: 'AI Detection Engine', icon: Zap },
    { href: '/subscriptions', label: 'Subscriptions Matrix', icon: Scissors },
    { href: '/cancellation-center', label: 'Cancellation Center', icon: AlertOctagon },
    { href: '/virtual-cards', label: 'Privacy Virtual Cards', icon: Lock },
    { href: '/negotiate', label: 'AI Bill Negotiator', icon: Sparkles },
    { href: '/bank-connections', label: 'Bank Connections', icon: CreditCard },
    { href: '/transactions', label: 'Transactions Ledger', icon: Receipt },
    { href: '/upcoming', label: 'Renewal Forecast', icon: Calendar },
    { href: '/savings', label: 'Savings Tracker', icon: DollarSign },
    { href: '/analytics', label: 'Financial Analytics', icon: PieChart },
    { href: '/billing', label: 'Billing & Plans', icon: ShieldCheck },
    { href: '/settings', label: 'Security & Settings', icon: Settings },
    { href: '/admin', label: 'Admin Portal', icon: Shield },
  ];

  const secondaryNav = [
    { label: 'Data Disclaimer', icon: Lock, href: '/settings' },
    { label: 'API & Webhooks', icon: Layers, href: '/settings' },
    { label: 'Terms & Compliance', icon: FileText, href: '/settings' },
    { label: 'Help Center', icon: LifeBuoy, href: '/settings' },
  ];

  const handleAccountSwitch = (name: string, email: string, role: string, initials: string) => {
    setCurrentAccount({
      name,
      email,
      role,
      bank: role === 'ADMIN' ? 'Admin Superuser' : 'Chase Bank Linked',
      initials,
    });
    setAccountMenuOpen(false);
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <aside className="w-64 dark-sidebar hidden lg:flex flex-col justify-between p-5 border-r border-slate-800/80 sticky top-0 h-screen select-none z-30">
      <div className="space-y-5 overflow-y-auto no-scrollbar">
        {/* Brand Header */}
        <Link href="/" className="flex items-center gap-3 group px-2 py-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-emerald-500 to-pink-500 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0b0f1d] rounded-[10px] flex items-center justify-center text-cyan-400">
              <Scissors className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
          <div>
            <div className="text-lg font-black tracking-tight text-white flex items-center gap-1">
              Trimmer<span className="text-cyan-400 font-extrabold">AI</span>
            </div>
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
              FinTech Co-Pilot
            </div>
          </div>
        </Link>

        {/* Interactive User Account Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setAccountMenuOpen(!accountMenuOpen)}
            className="w-full p-3 rounded-xl bg-[#0e1424] hover:bg-[#12192d] border border-slate-800/80 transition-all flex items-center justify-between text-left group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold flex items-center justify-center text-xs shadow-md shrink-0">
                {currentAccount.initials}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="text-xs font-bold text-slate-200 truncate flex items-center gap-1.5">
                  {currentAccount.name}
                  {currentAccount.role === 'ADMIN' && (
                    <span className="bg-cyan-500/20 text-cyan-400 text-[9px] px-1 rounded font-mono">ADMIN</span>
                  )}
                </div>
                <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  {currentAccount.bank}
                </div>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 group-hover:text-slate-200 transition-transform ${accountMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {accountMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 4, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                className="absolute top-full left-0 right-0 z-50 bg-[#0e1424] border border-slate-700/80 rounded-xl shadow-2xl p-2 space-y-1 backdrop-blur-xl"
              >
                <div className="text-[9px] font-mono uppercase text-slate-500 px-2 py-1 font-bold">Switch Account</div>

                <button
                  onClick={() => handleAccountSwitch('Jane Doe', 'user@example.com', 'USER', 'JD')}
                  className={`w-full text-left p-2 rounded-lg text-xs font-mono flex items-center gap-2 transition-colors ${
                    currentAccount.email === 'user@example.com' ? 'bg-cyan-500/15 text-cyan-300 font-bold' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <div className="truncate">
                    <div>Jane Doe</div>
                    <div className="text-[10px] text-slate-500">user@example.com</div>
                  </div>
                </button>

                <button
                  onClick={() => handleAccountSwitch('Alex Rivera (Admin)', 'admin@example.com', 'ADMIN', 'AR')}
                  className={`w-full text-left p-2 rounded-lg text-xs font-mono flex items-center gap-2 transition-colors ${
                    currentAccount.email === 'admin@example.com' ? 'bg-cyan-500/15 text-cyan-300 font-bold' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5 text-pink-400" />
                  <div className="truncate">
                    <div>Alex Rivera (Admin)</div>
                    <div className="text-[10px] text-slate-500">admin@example.com</div>
                  </div>
                </button>

                <div className="border-t border-slate-800 pt-1 mt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left p-2 rounded-lg text-xs font-mono text-rose-400 hover:bg-rose-500/10 transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out / Switch User
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Primary Navigation */}
        <div className="space-y-1">
          <div className="text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">
            Main Panel
          </div>
          {primaryNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className="relative block">
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/10 border-l-2 border-cyan-400 rounded-r-lg"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <div
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors relative z-10 ${
                    isActive ? 'text-cyan-300' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Secondary Links */}
        <div className="space-y-1 pt-4 border-t border-slate-800/80">
          <div className="text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">
            System & Support
          </div>
          {secondaryNav.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-300 cursor-pointer transition-colors"
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer Contact CTA Button */}
      <div className="pt-4 border-t border-slate-800/80 space-y-3">
        <Link
          href="/settings"
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-emerald-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
        >
          <ShieldCheck className="w-4 h-4 stroke-[2.5]" /> Contact Security Team
        </Link>
        <div className="text-[10px] text-center text-slate-600 font-mono">
          © 2026 Subscription Trimmer AI. All rights reserved.
        </div>
      </div>
    </aside>
  );
}
