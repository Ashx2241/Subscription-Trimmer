'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Database } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CSVImportResult {
  success: boolean;
  message?: string;
  importedCount?: number;
  detectedSubscriptionsCount?: number;
  sampleSubscriptions?: Array<{ merchant: string; amount: number }>;
}

export default function BankCSVUploadPage() {
  const router = useRouter();
  const [csvText, setCsvText] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CSVImportResult | null>(null);
  const [error, setError] = useState<string>('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      setError('');
      setResult(null);

      const reader = new FileReader();
      reader.onload = (event) => {
        setCsvText(event.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const handleProcessCSV = async () => {
    if (!csvText) {
      setError('Please select a valid CSV bank statement file first.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/banks/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csvText }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || 'Failed to import CSV statement');
      }

      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error processing CSV file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#070a13] text-slate-100 font-sans overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-emerald-900/20 via-teal-900/10 to-transparent p-6 rounded-3xl border border-white/10 backdrop-blur-xl">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                <FileSpreadsheet className="w-4 h-4" /> Bank Statement Importer
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Import CSV Bank Export
              </h1>
              <p className="text-xs text-slate-400">
                Upload your bank or credit card transaction export file for offline subscription detection.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Direct Ledger Sync
              </div>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upload Box */}
            <div className="bg-[#0b0f19] border border-slate-800 rounded-3xl p-6 space-y-5">
              <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wide font-mono flex items-center gap-2">
                <Upload className="w-4 h-4 text-emerald-400" /> Upload Bank Statement CSV
              </h2>

              <div className="relative border-2 border-dashed border-slate-700 hover:border-emerald-500/50 rounded-2xl p-8 text-center transition-all bg-slate-900/30 group">
                <input
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                {fileName ? (
                  <div className="space-y-2">
                    <FileSpreadsheet className="w-10 h-10 text-emerald-400 mx-auto" />
                    <p className="text-xs font-mono font-bold text-slate-200">{fileName}</p>
                    <p className="text-[10px] font-mono text-slate-400">Ready to parse transaction records</p>
                  </div>
                ) : (
                  <div className="space-y-3 pointer-events-none">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                      <FileSpreadsheet className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-slate-300">
                        Drag & drop your CSV file here, or <span className="text-emerald-400">browse</span>
                      </p>
                      <p className="text-[10px] text-slate-500 font-mono">Supports Chase, Bank of America, Wells Fargo, Citi exports</p>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleProcessCSV}
                disabled={loading || !csvText}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 hover:shadow-emerald-400/40 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Parsing Transactions & Running Detection Engine...' : 'Import Statement & Detect Subscriptions'}
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {/* Results Box */}
            <div className="bg-[#0b0f19] border border-slate-800 rounded-3xl p-6 space-y-5 flex flex-col">
              <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wide font-mono flex items-center gap-2">
                <Database className="w-4 h-4 text-cyan-400" /> Ingestion & Detection Status
              </h2>

              {result ? (
                <div className="space-y-4 flex-1">
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> {result.message}
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 font-mono text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Imported Rows:</span>
                      <span className="font-bold text-emerald-400">{result.importedCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Detection Engine Status:</span>
                      <span className="font-bold text-cyan-400">COMPLETE</span>
                    </div>
                  </div>

                  <button
                    onClick={() => router.push('/subscriptions')}
                    className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-bold font-mono transition-colors flex items-center justify-center gap-2"
                  >
                    View Updated Subscriptions Matrix <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-500 space-y-2 border border-slate-800/50 rounded-2xl">
                  <FileSpreadsheet className="w-10 h-10 stroke-1 text-slate-600" />
                  <p className="text-xs">No CSV imported yet.</p>
                  <p className="text-[10px]">Upload a CSV file on the left and click Import to run offline subscription detection.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
