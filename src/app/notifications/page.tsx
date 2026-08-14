'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { motion } from 'framer-motion';
import { Bell, CheckCircle2, AlertTriangle, Building2, Scissors, Clock, Check } from 'lucide-react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 'n1',
      title: 'New Subscription Detected',
      message: 'ChatGPT Plus ($20.00/mo) detected with 95% confidence.',
      type: 'DETECTION',
      timestamp: '10 minutes ago',
      read: false,
    },
    {
      id: 'n2',
      title: 'Upcoming Charge Alert',
      message: 'Adobe Creative Cloud ($54.99) will renew in 4 days.',
      type: 'UPCOMING',
      timestamp: '2 hours ago',
      read: false,
    },
    {
      id: 'n3',
      title: 'Bank Synchronization Completed',
      message: '88 transactions synced successfully from Chase Checking.',
      type: 'BANK',
      timestamp: '1 day ago',
      read: true,
    },
    {
      id: 'n4',
      title: 'AI Cancellation Message Generated',
      message: 'Formal cancellation letter prepared for Planet Fitness.',
      type: 'CANCELLATION',
      timestamp: '2 days ago',
      read: true,
    },
  ]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header title="Notification Center" />

        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          <div className="flex items-center justify-between dark-card p-5 rounded-2xl border border-slate-800">
            <div>
              <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <Bell className="w-5 h-5 text-cyan-400" /> Notifications & Security Alerts
              </h1>
              <p className="text-xs text-slate-400 mt-1">Real-time alerts for subscription detection and bank sync events.</p>
            </div>

            <button
              onClick={markAllRead}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-cyan-400 font-bold hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" /> Mark All as Read
            </button>
          </div>

          <div className="space-y-3">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                  notif.read
                    ? 'bg-[#0e1424]/40 border-slate-800/60 opacity-70'
                    : 'bg-[#0e1424] border-cyan-500/30 shadow-lg shadow-cyan-500/5'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5 border border-cyan-500/20">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200 flex items-center gap-2">
                      <span>{notif.title}</span>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{notif.message}</p>
                    <div className="text-[10px] text-slate-500 font-mono mt-1">{notif.timestamp}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
