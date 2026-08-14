'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Scissors, ShieldCheck, CreditCard, PieChart, AlertOctagon, UserCheck, Shield } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Dashboard', icon: PieChart },
    { href: '/subscriptions', label: 'Subscriptions', icon: Scissors },
    { href: '/cancellation-center', label: 'Cancellation Center', icon: AlertOctagon },
    { href: '/bank-connections', label: 'Bank Accounts', icon: CreditCard },
    { href: '/analytics', label: 'Analytics', icon: PieChart },
    { href: '/billing', label: 'Billing / Plans', icon: ShieldCheck },
    { href: '/admin', label: 'Admin Portal', icon: Shield },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800">
      {/* Privacy & Read-Only Banner */}
      <div className="bg-slate-950/80 px-4 py-1.5 text-xs text-slate-400 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-medium text-[10px]">
            <ShieldCheck className="w-3 h-3" /> READ-ONLY BANK CONNECTION
          </span>
          <span className="hidden md:inline text-slate-500">|</span>
          <span className="hidden md:inline">No move-money permissions. Zero raw credential storage.</span>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-mono">
            MOCK DEMO DATA ACTIVE
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Scissors className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Subscription Trimmer
              </span>
              <span className="block text-[10px] text-emerald-400 font-mono tracking-wider uppercase">
                FinTech Co-Pilot
              </span>
            </div>
          </Link>

          {/* Nav Items */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-slate-800 text-emerald-400 border border-slate-700 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User Profile Badge */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <div className="w-6 h-6 rounded-full bg-emerald-600/30 text-emerald-400 flex items-center justify-center font-bold text-[10px]">
                JD
              </div>
              <span className="hidden sm:inline font-medium">Jane Doe</span>
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sub-Nav */}
      <div className="lg:hidden flex items-center overflow-x-auto px-4 py-2 bg-slate-950/60 border-t border-slate-800/50 gap-2 no-scrollbar">
        {navLinks.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-1.5 rounded-md text-xs whitespace-nowrap font-medium ${
                isActive ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 bg-slate-900/50'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
