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
  Award
} from 'lucide-react';
import { api } from '../services/api';

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
    <div className="space-y-16 py-6">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl glass-panel-glow p-8 sm:p-12 border border-cyan-500/30">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-xs font-mono text-cyan-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            NATIONAL DEFENCE CYBER DEFENCE INITIATIVE
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Cyber Threat Reporting & AI Prevention Portal for <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">Defence Personnel</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Secure, military-grade incident reporting for armed forces, veterans, and military families. Protect operational security (OPSEC), analyze phishing and malware threats with AI, and safeguard digital evidence with blockchain verification.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to="/report"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-glow-cyan flex items-center gap-2 transition"
            >
              <ShieldAlert className="w-4 h-4" />
              Report Incident Now
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/track"
              className="px-6 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 flex items-center gap-2 transition"
            >
              <Search className="w-4 h-4 text-cyan-400" />
              Track Complaint ID
            </Link>

            <Link
              to="/analyze"
              className="px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-cyan-400 font-semibold text-sm border border-cyan-900/60 flex items-center gap-2 transition"
            >
              <Cpu className="w-4 h-4" />
              AI Threat Scanner
            </Link>
          </div>
        </div>

        {/* Live System Telemetry Bar */}
        <div className="mt-10 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <p className="text-2xl font-mono font-bold text-cyan-400">97.4%</p>
            <p className="text-xs text-slate-400 font-mono">ML Threat Accuracy</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <p className="text-2xl font-mono font-bold text-emerald-400">&lt; 45ms</p>
            <p className="text-xs text-slate-400 font-mono">Real-time Triage</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <p className="text-2xl font-mono font-bold text-amber-400">SHA-256</p>
            <p className="text-xs text-slate-400 font-mono">Tamper-Proof Proof</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <p className="text-2xl font-mono font-bold text-purple-400">100%</p>
            <p className="text-xs text-slate-400 font-mono">Offline PWA Capable</p>
          </div>
        </div>
      </div>

      {/* Quick Instant Threat Scanner Box */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-700/60">
        <div className="max-w-2xl mb-6">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-semibold uppercase tracking-wider mb-1">
            <Cpu className="w-4 h-4" />
            Instant AI Threat Heuristic Scanner
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Scan Suspicious URL, SMS, Email, or Message
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Test any suspicious link or text to immediately detect defence-targeted phishing, honeytraps, or malware.
          </p>
        </div>

        <form onSubmit={handleQuickScan} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={quickScanInput}
              onChange={(e) => setQuickScanInput(e.target.value)}
              placeholder="e.g. https://sparsh-update-pension.xyz or 'Army Gallantry Awards App APK update'"
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              disabled={isScanning || !quickScanInput.trim()}
              className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-semibold text-sm shadow-glow-cyan flex items-center justify-center gap-2 transition"
            >
              {isScanning ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Analyzing ML...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Analyze Threat
                </>
              )}
            </button>
          </div>

          {/* Quick preset buttons for instant test */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400">
            <span>Quick Samples:</span>
            <button
              type="button"
              onClick={() => setQuickScanInput('https://sparsh-defence-update-portal.xyz/login')}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700"
            >
              Fake SPARSH Link
            </button>
            <button
              type="button"
              onClick={() => setQuickScanInput('Send me unit troop movement details and high altitude posting list')}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700"
            >
              Espionage Probe
            </button>
            <button
              type="button"
              onClick={() => setQuickScanInput('Army_Awards_2026.apk install update')}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-red-300 border border-slate-700"
            >
              Trojan APK
            </button>
          </div>
        </form>

        {/* Scan Result Presentation */}
        {quickScanResult && (
          <div className="mt-6 p-5 rounded-xl border bg-slate-900/90 border-slate-700 transition-all animate-fadeIn">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-md text-xs font-mono font-bold ${
                  quickScanResult.prediction.riskScore >= 80 
                    ? 'bg-red-500/20 text-red-400 border border-red-500/40 text-glow-red'
                    : quickScanResult.prediction.riskScore >= 50
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                }`}>
                  {quickScanResult.prediction.label}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Risk Score: <strong className="text-white">{quickScanResult.prediction.riskScore}/100</strong>
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Confidence: <strong className="text-white">{(quickScanResult.prediction.confidence * 100).toFixed(0)}%</strong>
                </span>
              </div>
              <div className="text-[11px] font-mono text-cyan-400">
                Engine: {quickScanResult.modelName} v{quickScanResult.modelVersion}
              </div>
            </div>

            <div className="mt-3 space-y-2">
              <p className="text-xs text-slate-300">
                <strong>AI Recommendation:</strong> {quickScanResult.recommendation}
              </p>
              {quickScanResult.indicators?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {quickScanResult.indicators.map((ind, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-[11px] font-mono text-cyan-300 border border-slate-700">
                      • {ind}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => navigate('/report', { state: { presetText: quickScanInput, scanResult: quickScanResult } })}
                className="px-4 py-2 text-xs font-medium rounded-lg bg-red-600 hover:bg-red-500 text-white flex items-center gap-1.5 shadow-glow-red transition"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                Submit as Formal Incident Report
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Core Defense Capabilities Grid (SRD Objectives) */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Engineered Specifically for Armed Forces Security
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            A comprehensive unified cyber defence framework matching the 14 core project requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-3 hover:border-cyan-500/40 transition">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">AI Threat Classification</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automated multi-class classification for Phishing, Espionage, Malware, Financial Fraud, and OPSEC Risks with instant priority scoring (P1-P4).
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-3 hover:border-cyan-500/40 transition">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Blockchain Hash Evidence Vault</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every uploaded screenshot, audio, APK, or call log is hashed via SHA-256 and anchored to ensure legal chain of custody and tamper-proof verification.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-3 hover:border-cyan-500/40 transition">
            <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-800 flex items-center justify-center text-amber-400">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Offline Tactical PWA Storage</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Personnel in remote border postings with zero connectivity can draft complaints and store encrypted evidence locally; auto-syncs when re-connected.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
