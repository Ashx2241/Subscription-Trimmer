'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Bell, Heart, ArrowLeft } from 'lucide-react';

interface HeaderProps {
  onSearch?: (query: string) => void;
  title?: string;
}

export default function Header({ onSearch, title = 'Address details' }: HeaderProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [liked, setLiked] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  return (
    <header className="h-16 dark-header px-6 flex items-center justify-between sticky top-0 z-20 border-b border-slate-800/80">
      {/* Title & Navigation */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          aria-label="Go back to previous page"
          className="w-8 h-8 rounded-lg bg-[#0e1424] border border-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <div className="text-xs font-bold text-slate-200 flex items-center gap-2">
            <span className="text-cyan-400">⚡ Subscription Trimmer AI</span>
            <span className="text-slate-600">/</span>
            <span>{title}</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono hidden sm:block">
            Verified Zero-Trust Session
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
            placeholder="Search merchant, category or charge..."
            value={search}
            onChange={handleSearchChange}
            aria-label="Global search input"
            className="w-full bg-[#0e1424] border border-slate-800/80 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
        </div>

        {/* Notifications Icon Button */}
        <Link
          href="/notifications"
          aria-label="View notifications and alerts"
          className="w-9 h-9 rounded-xl bg-[#0e1424] border border-slate-800 flex items-center justify-center text-slate-400 hover:text-cyan-400 transition-colors relative"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-cyan-400" />
        </Link>

        {/* Favorites / Pin Button */}
        <button
          onClick={() => setLiked(!liked)}
          aria-label="Toggle pin favorite dashboard"
          className={`w-9 h-9 rounded-xl bg-[#0e1424] border border-slate-800 flex items-center justify-center transition-colors ${
            liked ? 'text-pink-500 bg-pink-500/10 border-pink-500/30' : 'text-slate-400 hover:text-pink-400'
          }`}
        >
          <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
        </button>
      </div>
    </header>
  );
}
