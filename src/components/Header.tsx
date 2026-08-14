'use client';

import { useState } from 'react';
import { Search, Bell, ShieldCheck, Heart, ArrowLeft, RefreshCw } from 'lucide-react';

interface HeaderProps {
  onSearch?: (query: string) => void;
  title?: string;
}

export default function Header({ onSearch, title = 'Address details' }: HeaderProps) {
  const [search, setSearch] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  return (
    <header className="h-16 dark-header px-6 flex items-center justify-between sticky top-0 z-20 border-b border-slate-800/80">
      {/* Title & Navigation */}
      <div className="flex items-center gap-4">
        <button className="w-8 h-8 rounded-lg bg-[#0e1424] border border-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <div className="text-xs font-bold text-slate-200 flex items-center gap-2">
            <span className="text-cyan-400">⚡ Subscription Trimmer AI</span>
            <span className="text-slate-600">/</span>
            <span>{title}</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono hidden sm:block">
            0xd649c6d8048655ff184EBB57f94D8d54e0C6bA7BC (OAuth Verified)
          </div>
        </div>
      </div>

      {/* Right Controls & Search */}
      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="relative w-64 sm:w-80 hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search merchant, pair, category or token..."
            value={search}
            onChange={handleSearchChange}
            className="w-full bg-[#0e1424] border border-slate-800/80 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
        </div>

        {/* Icons */}
        <button className="w-9 h-9 rounded-xl bg-[#0e1424] border border-slate-800 flex items-center justify-center text-slate-400 hover:text-cyan-400 transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-cyan-400" />
        </button>

        <button className="w-9 h-9 rounded-xl bg-[#0e1424] border border-slate-800 flex items-center justify-center text-slate-400 hover:text-pink-400 transition-colors">
          <Heart className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
