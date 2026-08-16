'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Neon Ring Colors matching BlockAI UI
const NEON_ALLOCATION = [
  { name: 'SaaS & Productivity', value: 34, color: '#ec4899' }, // Magenta/Pink
  { name: 'Fitness & Health', value: 29, color: '#06b6d4' }, // Cyan
  { name: 'SaaS & AI', value: 21, color: '#10b981' }, // Lime Green
  { name: 'Music & Audio', value: 12, color: '#f59e0b' }, // Yellow/Amber
  { name: 'Entertainment', value: 4, color: '#8b5cf6' }, // Violet
];

const NEON_VOLATILITY = [
  { name: 'High Risk / Unused', value: 42, color: '#06b6d4' }, // Cyan
  { name: 'Medium Stable', value: 28, color: '#3b82f6' }, // Blue
  { name: 'Low Risk Essential', value: 30, color: '#8b5cf6' }, // Violet
];

const NEON_POPULARITY = [
  { name: 'Top Tier (Netflix/Spotify)', value: 37, color: '#10b981' }, // Emerald
  { name: 'Medium Popularity', value: 42, color: '#06b6d4' }, // Cyan
  { name: 'Long Tail Services', value: 21, color: '#f59e0b' }, // Amber
];

// Area Chart Trend Dataset
const HISTORICAL_ROI_DATA = [
  { time: '3:00 AM', roi: 6.43, val: 3.2 },
  { time: '4:00 AM', roi: 4.12, val: 2.1 },
  { time: '5:00 AM', roi: 7.85, val: 5.4 },
  { time: '6:00 AM', roi: 5.20, val: 3.8 },
  { time: '7:00 AM', roi: 8.90, val: 6.1 },
  { time: '8:00 AM', roi: 6.10, val: 4.2 },
  { time: '9:00 AM', roi: 10.40, val: 7.9 },
  { time: '10:00 AM', roi: 8.15, val: 5.8 },
  { time: '11:00 AM', roi: 11.20, val: 8.3 },
  { time: '12:00 PM', roi: 9.80, val: 6.7 },
  { time: '1:00 PM', roi: 12.45, val: 9.1 },
  { time: '2:00 PM', roi: 10.90, val: 7.6 },
  { time: '3:00 PM', roi: 14.80, val: 11.2 },
  { time: '4:00 PM', roi: 12.30, val: 9.0 },
  { time: '5:00 PM', roi: 15.60, val: 12.4 },
  { time: '6:00 PM', roi: 13.90, val: 10.1 },
  { time: '7:00 PM', roi: 16.45, val: 13.8 },
  { time: '8:00 PM', roi: 14.20, val: 11.0 },
  { time: '9:00 PM', roi: 15.10, val: 12.2 },
];

type TabType = 'ROI' | 'TXN' | 'VOL';
type TimeframeType = '1D' | '7D' | '1M' | '3M' | '1Y' | 'ALL';

export default function BlockAIDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('ROI');
  const [timeframe, setTimeframe] = useState<TimeframeType>('1M');

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 flex">
      {/* Left Sidebar Component */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header title="Address details" />

        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* Top Row: Summary Table + 3 Radial Ring Donut Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {/* Panel 1: Summary Table Card */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="dark-card p-5 rounded-2xl flex flex-col justify-between space-y-3"
            >
              <div className="text-xs font-bold text-slate-200 border-b border-slate-800/80 pb-3 flex items-center justify-between">
                <span>Summary</span>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  Live Sync
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Transactions</span>
                  <span className="text-slate-200 font-bold">147</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Volume</span>
                  <span className="text-amber-400 font-bold">$1,101.64</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Monthly Subscriptions</span>
                  <span className="text-slate-200 font-bold">$132.96</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Balance</span>
                  <span className="text-emerald-400 font-bold">$4,850.25</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Active Services</span>
                  <span className="text-emerald-400 font-bold">5 Services</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Asset Volatility</span>
                  <span className="text-rose-400 font-bold">Low</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Asset Popularity</span>
                  <span className="text-cyan-400 font-bold">High</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Investment Use Rate</span>
                  <span className="text-slate-200 font-bold">1.87</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Analyzed Ratio</span>
                  <span className="text-slate-200 font-bold">3.68%</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-800">
                  <span className="text-slate-400 font-bold">Total ROI / Savings</span>
                  <span className="text-emerald-400 font-extrabold">+17.45%</span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 pt-1">
                  <span>Last TXN Sent</span>
                  <span>35 days 7 hrs ago</span>
                </div>
              </div>
            </motion.div>

            {/* Panel 2: Asset Allocation Pie Chart (Neon Ring 1) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="dark-card p-5 rounded-2xl flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-200">Asset allocation pie chart</h4>
                  <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500">
                    <button className="p-1 rounded hover:bg-slate-800">
                      <ChevronLeft className="w-3 h-3" />
                    </button>
                    <span>1</span>
                    <button className="p-1 rounded hover:bg-slate-800">
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500">As of August 14, 2026</p>
              </div>

              {/* Radial Donut Ring Chart */}
              <div className="h-44 w-full relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={NEON_ALLOCATION}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={52}
                      outerRadius={68}
                      strokeWidth={0}
                    >
                      {NEON_ALLOCATION.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xl font-black text-emerald-400 font-mono">34.00%</span>
                  <span className="text-[10px] font-mono text-slate-400">SaaS</span>
                </div>
              </div>

              {/* Legend List */}
              <div className="space-y-1.5 text-[11px] font-mono border-t border-slate-800/80 pt-3">
                {NEON_ALLOCATION.slice(0, 4).map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-300 truncate max-w-[110px]">{item.name}</span>
                    </div>
                    <span className="text-slate-400 font-bold">{item.value}.00%</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Panel 3: Asset Volatility Pie Chart (Neon Ring 2) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="dark-card p-5 rounded-2xl flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-200">Asset volatility pie chart</h4>
                  <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500">
                    <button className="p-1 rounded hover:bg-slate-800">
                      <ChevronLeft className="w-3 h-3" />
                    </button>
                    <span>1</span>
                    <button className="p-1 rounded hover:bg-slate-800">
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500">As of August 14, 2026</p>
              </div>

              {/* Radial Donut Ring Chart */}
              <div className="h-44 w-full relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={NEON_VOLATILITY}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={52}
                      outerRadius={68}
                      strokeWidth={0}
                    >
                      {NEON_VOLATILITY.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xl font-black text-cyan-400 font-mono">42.00%</span>
                  <span className="text-[10px] font-mono text-slate-400">High</span>
                </div>
              </div>

              {/* Legend List */}
              <div className="space-y-1.5 text-[11px] font-mono border-t border-slate-800/80 pt-3">
                {NEON_VOLATILITY.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-300 truncate max-w-[110px]">{item.name}</span>
                    </div>
                    <span className="text-slate-400 font-bold">{item.value}.00%</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Panel 4: Asset Popularity Pie Chart (Neon Ring 3) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="dark-card p-5 rounded-2xl flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-200">Asset popularity pie chart</h4>
                  <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500">
                    <button className="p-1 rounded hover:bg-slate-800">
                      <ChevronLeft className="w-3 h-3" />
                    </button>
                    <span>1</span>
                    <button className="p-1 rounded hover:bg-slate-800">
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500">As of August 14, 2026</p>
              </div>

              {/* Radial Donut Ring Chart */}
              <div className="h-44 w-full relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={NEON_POPULARITY}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={52}
                      outerRadius={68}
                      strokeWidth={0}
                    >
                      {NEON_POPULARITY.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xl font-black text-emerald-400 font-mono">37.00%</span>
                  <span className="text-[10px] font-mono text-slate-400">Medium</span>
                </div>
              </div>

              {/* Legend List */}
              <div className="space-y-1.5 text-[11px] font-mono border-t border-slate-800/80 pt-3">
                {NEON_POPULARITY.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-300 truncate max-w-[110px]">{item.name}</span>
                    </div>
                    <span className="text-slate-400 font-bold">{item.value}.00%</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Lower Panel: Large Interactive Area / Line Chart matching BlockAI UI */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="dark-card p-6 rounded-2xl space-y-6"
          >
            {/* Chart Header Bar with Tabs & Timeframe Resolution */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
              {/* Category Tabs */}
              <div className="flex items-center gap-4 text-xs font-semibold">
                {[
                  { id: 'ROI' as TabType, label: 'Daily ROI' },
                  { id: 'TXN' as TabType, label: 'Daily transactions' },
                  { id: 'VOL' as TabType, label: 'Daily volume' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-1 transition-colors relative ${
                      activeTab === tab.id ? 'text-slate-100 font-bold' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeTabUnderline"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-full"
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Timeframe Buttons */}
              <div className="flex items-center gap-1 bg-[#0b0f1d] p-1 rounded-xl border border-slate-800 text-[11px] font-mono">
                {(['1D', '7D', '1M', '3M', '1Y', 'ALL'] as TimeframeType[]).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                      timeframe === tf
                        ? 'bg-slate-800 text-cyan-300 shadow-sm border border-slate-700'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            {/* Neon Area & Trend Chart */}
            <div className="h-72 w-full pt-2 relative">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={HISTORICAL_ROI_DATA}>
                  <defs>
                    <linearGradient id="colorRoi" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ec4899" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#ec4899" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#475569" fontSize={10} tickLine={false} />
                  <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} orientation="right" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0b0f1d',
                      borderColor: '#1e293b',
                      borderRadius: '12px',
                      fontSize: '11px',
                      color: '#f8fafc',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
                    }}
                    formatter={(value: unknown, name: unknown) => [
                      `${value}%`,
                      name === 'roi' ? 'Daily ROI' : 'Vol 24h',
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="val"
                    stroke="#ec4899"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorVal)"
                  />
                  <Area
                    type="monotone"
                    dataKey="roi"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorRoi)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
