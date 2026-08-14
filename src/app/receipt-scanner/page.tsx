'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Upload, FileText, CheckCircle2, Sparkles, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReceiptScannerPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any | null>(null);
  const [error, setError] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setError('');
      setScanResult(null);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScanReceipt = async () => {
    if (!previewUrl || !selectedFile) {
      setError('Please select or drag a receipt image first.');
      return;
    }

    setScanning(true);
    setError('');

    try {
      const res = await fetch('/api/receipt-scanner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: previewUrl,
          fileName: selectedFile.name,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || 'Failed to scan receipt');
      }

      setScanResult(data.data);
    } catch (err: any) {
      setError(err.message || 'Error processing receipt OCR');
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#070a13] text-slate-100 font-sans overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-violet-900/20 via-indigo-900/10 to-transparent p-6 rounded-3xl border border-white/10 backdrop-blur-xl">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                <Sparkles className="w-4 h-4" /> AI Computer Vision OCR
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Bill & Receipt Scanner
              </h1>
              <p className="text-xs text-slate-400">
                Upload paper invoices or receipt screenshots to automatically register subscriptions.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono text-xs flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> 94% OCR Accuracy
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
            {/* Upload Dropzone Card */}
            <div className="bg-[#0b0f19] border border-slate-800 rounded-3xl p-6 space-y-5">
              <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wide font-mono flex items-center gap-2">
                <Upload className="w-4 h-4 text-cyan-400" /> Upload Invoice or Receipt Image
              </h2>

              <div className="relative border-2 border-dashed border-slate-700 hover:border-cyan-500/50 rounded-2xl p-8 text-center transition-all bg-slate-900/30 group">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                {previewUrl ? (
                  <div className="space-y-3">
                    <img
                      src={previewUrl}
                      alt="Receipt Preview"
                      className="max-h-48 mx-auto rounded-xl border border-white/10 object-contain shadow-lg"
                    />
                    <p className="text-xs font-mono text-cyan-400 truncate">{selectedFile?.name}</p>
                  </div>
                ) : (
                  <div className="space-y-3 pointer-events-none">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-slate-300">
                        Drag & drop your receipt image here, or <span className="text-cyan-400">browse</span>
                      </p>
                      <p className="text-[10px] text-slate-500 font-mono">Supports PNG, JPG, WEBP, or PDF up to 10MB</p>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleScanReceipt}
                disabled={scanning || !selectedFile}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-emerald-400 to-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {scanning ? 'Scanning with AI Vision...' : 'Analyze Receipt & Extract Subscription'}
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {/* Extracted Subscription Details Card */}
            <div className="bg-[#0b0f19] border border-slate-800 rounded-3xl p-6 space-y-5 flex flex-col">
              <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wide font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Extracted OCR Results
              </h2>

              {scanResult ? (
                <div className="space-y-4 flex-1">
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Successfully Registered Subscription to Trimmer AI Matrix!
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                      <div className="text-slate-400 text-[10px]">Merchant Name</div>
                      <div className="font-bold text-white text-sm">{scanResult.merchantName}</div>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                      <div className="text-slate-400 text-[10px]">Monthly Amount</div>
                      <div className="font-bold text-cyan-400 text-sm">${scanResult.monthlyAmount} / mo</div>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                      <div className="text-slate-400 text-[10px]">Billing Frequency</div>
                      <div className="font-bold text-slate-200">{scanResult.frequency}</div>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                      <div className="text-slate-400 text-[10px]">Next Billing Date</div>
                      <div className="font-bold text-slate-200">{scanResult.billingDate}</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 font-mono text-[11px]">
                    <div className="text-slate-400 text-[10px] uppercase font-bold">Extracted Raw Text Payload</div>
                    <pre className="text-slate-300 whitespace-pre-wrap">{scanResult.extractedTextSample}</pre>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-500 space-y-2 border border-slate-800/50 rounded-2xl">
                  <FileText className="w-10 h-10 stroke-1 text-slate-600" />
                  <p className="text-xs">No receipt scanned yet.</p>
                  <p className="text-[10px]">Upload an image on the left and click Analyze to view extracted subscription details.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
