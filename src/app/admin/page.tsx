'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import {
  Users,
  Building,
  Activity,
  Lock,
} from 'lucide-react';

interface AdminUserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  _count: {
    bankConnections: number;
    subscriptions: number;
  };
}

interface AdminMerchantItem {
  id: string;
  normalizedName: string;
  category: string;
  _count: {
    subscriptions: number;
  };
}

interface AdminAuditLogItem {
  id: string;
  timestamp: string;
  action: string;
  resource: string;
  ipAddress: string | null;
  actor?: {
    name: string;
  };
}

interface AdminDashboardData {
  systemKpis: {
    totalUsers: number;
    totalBankConnections: number;
    totalTransactionsProcessed: number;
    totalSubscriptionsDetected: number;
    activeSubscriptions: number;
    cancelledSubscriptions: number;
    aggregateConfirmedAnnualSavings: number;
  };
  users: AdminUserItem[];
  merchants: AdminMerchantItem[];
  recentAuditLogs: AdminAuditLogItem[];
}

export default function AdminPage() {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdminData() {
      try {
        setLoading(true);
        const res = await fetch('/api/admin/dashboard');
        const result = await res.json();
        if (result.success) {
          setData(result.data);
        }
      } catch (err) {
        console.error('Error loading admin data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAdminData();
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-400 text-xs font-mono font-semibold border border-purple-500/20">
                SYSTEM OPERATIONS & SECURITY
              </span>
              <span className="text-xs text-slate-400">• Role: ADMIN</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-100 mt-1">
              Admin Portal & System Monitor
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Real-time audit log stream, merchant catalog management, and system-wide savings metrics.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 bg-purple-500/10 px-3 py-1.5 rounded-xl border border-purple-500/20">
            <Lock className="w-3.5 h-3.5" /> SECURE AUDIT LOGGING ENABLED
          </div>
        </div>

        {/* System KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-xs font-medium text-slate-400 uppercase">Registered Users</span>
            <div className="text-2xl font-black text-slate-100">{data?.systemKpis.totalUsers || 0}</div>
            <p className="text-[10px] text-slate-500">Active platform accounts</p>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-xs font-medium text-slate-400 uppercase">Transactions Ingested</span>
            <div className="text-2xl font-black text-blue-400">{data?.systemKpis.totalTransactionsProcessed || 0}</div>
            <p className="text-[10px] text-slate-500">Normalized records</p>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-xs font-medium text-slate-400 uppercase">Active Subscriptions</span>
            <div className="text-2xl font-black text-slate-100">{data?.systemKpis.activeSubscriptions || 0}</div>
            <p className="text-[10px] text-slate-500">Monitored services</p>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/10 space-y-1 emerald-glow">
            <span className="text-xs font-semibold text-emerald-400 uppercase">Aggregate Savings</span>
            <div className="text-2xl font-black text-emerald-400">${data?.systemKpis.aggregateConfirmedAnnualSavings.toFixed(2) || '0.00'}</div>
            <p className="text-[10px] text-emerald-300 font-medium">All-time confirmed user savings</p>
          </div>
        </div>

        {/* User Management & Merchant Catalog */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Directory */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" /> Platform User Directory
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 font-mono text-[10px] uppercase">
                  <tr>
                    <th className="p-2">User</th>
                    <th className="p-2">Role</th>
                    <th className="p-2">Banks</th>
                    <th className="p-2">Subs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {data?.users.map((u) => (
                    <tr key={u.id}>
                      <td className="p-2 font-medium text-slate-100">{u.name} ({u.email})</td>
                      <td className="p-2 font-mono text-purple-400">{u.role}</td>
                      <td className="p-2 font-mono">{u._count.bankConnections}</td>
                      <td className="p-2 font-mono">{u._count.subscriptions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Merchant Catalog */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Building className="w-4 h-4 text-blue-400" /> Master Merchant Catalog
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 font-mono text-[10px] uppercase">
                  <tr>
                    <th className="p-2">Merchant Name</th>
                    <th className="p-2">Category</th>
                    <th className="p-2">Active Subs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {data?.merchants.map((m) => (
                    <tr key={m.id}>
                      <td className="p-2 font-bold text-slate-100">{m.normalizedName}</td>
                      <td className="p-2 text-slate-400">{m.category}</td>
                      <td className="p-2 font-mono text-emerald-400">{m._count.subscriptions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Audit Log Stream */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-400" /> Immutable Security Audit Logs
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 font-mono">
              <thead className="bg-slate-900 text-slate-400 text-[10px] uppercase border-b border-slate-800">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Actor</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Resource</th>
                  <th className="p-3">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {data?.recentAuditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-900/40">
                    <td className="p-3 text-slate-400">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="p-3 text-emerald-400">{log.actor?.name || 'System'}</td>
                    <td className="p-3 font-bold text-slate-200">{log.action}</td>
                    <td className="p-3 text-slate-400">{log.resource}</td>
                    <td className="p-3 text-slate-500">{log.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
