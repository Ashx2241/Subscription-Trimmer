'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Bell, Check } from 'lucide-react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Array<{ id: string; title: string; body?: string; message?: string; read: boolean; createdAt: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch('/api/notifications');
        const data = await res.json();
        if (active && data.success && data.data?.notifications) {
          setNotifications(data.data.notifications);
        }
      } catch (err) {
        console.error('Failed to load notifications:', err);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, []);

  const markAllRead = async () => {
    try {
      await fetch('/api/notifications', { method: 'PATCH' });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error('Failed to mark notifications read:', err);
    }
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
            {notifications.length === 0 && !loading ? (
              <div className="p-8 text-center text-xs text-slate-500 font-mono dark-card rounded-2xl border border-slate-800">
                No notifications found.
              </div>
            ) : (
              notifications.map((notif) => (
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
                      <p className="text-xs text-slate-400 mt-0.5">{notif.body || notif.message}</p>
                      <div className="text-[10px] text-slate-500 font-mono mt-1">
                        {new Date(notif.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

