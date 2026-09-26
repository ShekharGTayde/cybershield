import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Shield, 
  ShieldAlert, 
  Lock, 
  Cpu, 
  Search, 
  FileText, 
  AlertTriangle, 
  ArrowRight, 
  Radio, 
  CheckCircle2, 
  Smartphone, 
  Layers, 
  Database,
  Award,
  PhoneCall,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { api } from '../services/api';

const STATS = [
  { value: '97.4%', label: 'Classification Precision', color: '#E05C1A' },
  { value: '< 45ms', label: 'Heuristic Triage Speed', color: '#10B981' },
  { value: 'SHA-256', label: 'Tamper-Proof Evidence', color: '#F59E0B' },
  { value: '100%', label: 'Offline-Ready PWA', color: '#6366F1' },
];

const FEATURES = [
  {
    num: '01',
    icon: Cpu,
    title: 'Automated Threat Triage',
    desc: 'Immediate heuristic detection for Phishing, Honeytraps, Trojan APKs, and CSD Canteen scams with automated priority classification.',
    accent: '#E05C1A',
    bg: 'rgba(224,92,26,0.08)',
    border: 'rgba(224,92,26,0.18)',
  },
  {
    num: '02',
    icon: Award,
    title: 'Tamper-Proof Evidence Vault',
    desc: 'Screenshots, call logs, and payment slips hashed with SHA-256 for legal integrity and verifiable chain of custody.',
    accent: '#10B981',
    bg: 'rgba(16,185,129,0.08)',
    border: 'rgba(16,185,129,0.18)',
  },
  {
    num: '03',
    icon: Database,
    title: 'Tactical Offline Drafts',
    desc: 'Remote border or high-altitude personnel can lodge complaints offline; auto-syncs encrypted files when connectivity returns.',
    accent: '#F59E0B',
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.18)',
  },
];

export function LandingPage() {
  const [quickScanInput, setQuickScanInput] = useState('');
  const [quickScanResult, setQuickScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const navigate = useNavigate();

  const handleQuickScan = async (e) => {
    e.preventDefault();
    if (!quickScanInput.trim()) return;
    setIsScanning(true);
    try {
      const isUrl = quickScanInput.startsWith('http') || quickScanInput.includes('.com') || quickScanInput.includes('.xyz') || quickScanInput.includes('.in');
      const res = await api.analyzeThreat({
        text: quickScanInput,
        url: isUrl ? quickScanInput : undefined,
        inputType: isUrl ? 'URL' : 'TEXT'
      });
      setQuickScanResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-10 py-4">
      
      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#111420] px-8 sm:px-14 py-12 sm:py-16">
        {/* Decorative corner glow */}
        <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#E05C1A] opacity-[0.06] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-indigo-500 opacity-[0.06] blur-3xl" />

        <div className="relative z-10 max-w-3xl space-y-7">
          {/* Badge */}
          <div className="inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E05C1A] animate-pulse" />
            <span className="text-[11px] font-bold tracking-widest uppercase text-[#E05C1A]">
              National Defence Cyber Protection Initiative
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-[1.1] tracking-[-0.03em] text-white">
            Cyber Threat Reporting &<br />
            <span style={{ color: '#E05C1A' }}>Fraud Prevention</span>{' '}
            <span className="text-slate-300">for Armed Forces</span>
          </h1>

          <p className="text-[13px] sm:text-sm text-slate-400 leading-relaxed max-w-xl">
            A trusted, citizen-first cybersecurity portal to report online fraud, verify suspicious links, protect military OPSEC, and preserve cryptographic evidence for swift cyber cell recovery.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link
              to="/report"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-[13px] text-white transition"
              style={{ background: '#E05C1A' }}
            >
              <ShieldAlert className="w-4 h-4" />
              Report Cyber Scam
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              to="/track"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-[13px] text-slate-300 border border-white/[0.1] bg-white/[0.04] hover:bg-white/[0.07] transition"
            >
              <Search className="w-4 h-4 text-slate-400" />
              Track Complaint ID
            </Link>

            <Link
              to="/analyze"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-[13px] text-slate-300 border border-white/[0.1] bg-white/[0.04] hover:bg-white/[0.07] transition"
            >
              <Cpu className="w-4 h-4 text-slate-400" />
              Threat Scanner
            </Link>
          </div>
        </div>

        {/* ── Stats Bar ── */}
        <div className="relative z-10 mt-12 pt-8 border-t border-white/[0.06] grid grid-cols-2 sm:grid-cols-4 gap-5">
          {STATS.map(({ value, label, color }) => (
            <div key={label} className="space-y-1">
              <p className="text-2xl font-extrabold leading-none tracking-tighter" style={{ color }}>{value}</p>
              <p className="text-[11px] text-slate-500 font-medium leading-snug">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Quick Threat Scanner ─────────────────────────────── */}
      <div className="rounded-2xl border border-white/[0.07] bg-[#111420] p-7 sm:p-9 space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Cpu className="w-4 h-4 text-[#E05C1A]" />
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#E05C1A]">Heuristic Threat Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight">
            Verify a Suspicious Link, SMS, or Message
          </h2>
          <p className="text-[12px] text-slate-500 mt-1">
            Analyze any suspicious domain, email text, or message to detect phishing, credential harvesting, or mobile malware.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleQuickScan} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={quickScanInput}
              onChange={(e) => setQuickScanInput(e.target.value)}
              placeholder="e.g. https://sparsh-update-pension.xyz or 'Received SMS asking for OTP for Army CSD smart card'"
              className="flex-1 bg-[#0B0D14] border border-white/[0.08] rounded-xl px-4 py-2.5 text-[13px] text-white placeholder-slate-600 focus:outline-none focus:border-[#E05C1A]/50 transition"
            />
            <button
              type="submit"
              disabled={isScanning || !quickScanInput.trim()}
              className="px-6 py-2.5 rounded-xl font-semibold text-[13px] text-white flex items-center justify-center gap-2 disabled:opacity-40 transition"
              style={{ background: '#E05C1A' }}
            >
              {isScanning ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analyzing…
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Analyze Threat
                </>
              )}
            </button>
          </div>

          {/* Sample presets */}
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
            <span>Try samples:</span>
            {[
              { label: 'Fake SPARSH Link', val: 'https://sparsh-defence-update-portal.xyz/login', c: 'text-[#E05C1A]' },
              { label: 'Espionage Inquiry', val: 'Send me unit troop movement details and high altitude posting list', c: 'text-amber-400' },
              { label: 'Trojan APK Forward', val: 'Army_Awards_2026.apk install update', c: 'text-rose-400' },
            ].map(({ label, val, c }) => (
              <button
                key={label}
                type="button"
                onClick={() => setQuickScanInput(val)}
                className={`px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/[0.07] hover:bg-white/[0.09] transition ${c}`}
              >
                {label}
              </button>
            ))}
          </div>
        </form>

        {/* Scan Result */}
        {quickScanResult && (
          <div className="p-5 rounded-xl border border-white/[0.08] bg-[#0B0D14] animate-fadeIn space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-[11px] font-semibold ${
                  quickScanResult.prediction.riskScore >= 80
                    ? 'bg-red-950/70 text-red-300 border border-red-800/60'
                    : quickScanResult.prediction.riskScore >= 50
                    ? 'bg-amber-950/70 text-amber-300 border border-amber-800/60'
                    : 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/60'
                }`}>
                  {quickScanResult.prediction.label}
                </span>
                <span className="text-[11px] text-slate-400">
                  Risk: <strong className="text-white">{quickScanResult.prediction.riskScore}/100</strong>
                </span>
                <span className="text-[11px] text-slate-400">
                  Confidence: <strong className="text-white">{(quickScanResult.prediction.confidence * 100).toFixed(0)}%</strong>
                </span>
              </div>
              <span className="text-[10px] text-slate-600 font-mono">Engine: {quickScanResult.modelName}</span>
            </div>

            <p className="text-[12px] text-slate-200">
              <strong>Recommended Action:</strong> {quickScanResult.recommendation}
            </p>
            {quickScanResult.indicators?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {quickScanResult.indicators.map((ind, i) => (
                  <span key={i} className="px-2.5 py-0.5 rounded-md bg-white/[0.04] text-[11px] text-slate-300 border border-white/[0.07]">
                    • {ind}
                  </span>
                ))}
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-white/[0.05]">
              <button
                onClick={() => navigate('/report', { state: { presetText: quickScanInput, scanResult: quickScanResult } })}
                className="px-4 py-2 text-[11px] font-semibold rounded-xl bg-rose-600 hover:bg-rose-500 text-white flex items-center gap-1.5 transition"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                Submit Formal Incident Grievance
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Features Grid ────────────────────────────────────── */}
      <div className="space-y-6">
        {/* Section header */}
        <div className="flex items-center gap-4">
          <div>
            <p className="text-[10px] font-bold tracking-widest uppercase text-[#E05C1A] mb-1">Core Capabilities</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
              Security Features Built for Defence Personnel
            </h2>
          </div>
          <div className="flex-1 h-px bg-white/[0.06] hidden sm:block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {FEATURES.map(({ num, icon: Icon, title, desc, accent, bg, border }) => (
            <div
              key={num}
              className="rounded-2xl p-6 space-y-4 card-hover-accent border transition"
              style={{ background: bg, borderColor: border }}
            >
              <div className="flex items-start justify-between">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${accent}18`, border: `1px solid ${accent}30` }}
                >
                  <Icon className="w-5 h-5" style={{ color: accent }} />
                </div>
                <span className="card-number">{num}</span>
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-white mb-2">{title}</h3>
                <p className="text-[12px] text-slate-400 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
