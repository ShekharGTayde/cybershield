import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Globe, 
  Mail, 
  Phone, 
  Cpu, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  FileCode, 
  Search, 
  Hash, 
  Lock,
  ArrowRight
} from 'lucide-react';
import { api, analyzeThreat } from '../services/api';
import { calculateSHA256 } from '../services/crypto';
import { SeverityBadge, PriorityBadge } from '../components/common/Badge';

export function ThreatAnalysisPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'url';
  const [activeTab, setActiveTab] = useState(initialTab);
  const navigate = useNavigate();

  // URL Scanner State (SRD §13)
  const [urlInput, setUrlInput] = useState('https://sparsh-defence-update-portal.xyz/login');
  const [urlResult, setUrlResult] = useState(null);
  const [isUrlScanning, setIsUrlScanning] = useState(false);

  // Email Scanner State (SRD §14)
  const [emailForm, setEmailForm] = useState({
    senderEmail: 'support@pension-sparsh-update.com',
    subject: 'Urgent: Submit Digital Life Certificate immediately or pension will freeze',
    body: 'Dear Defence Veteran, Your SPARSH pension account is blocked due to non-submission of annual DLC. Click http://sparsh-kyc-update.xyz to verify your Aadhaar and OTP immediately.',
    headers: 'Received: from mail-spoof.net (unknown [185.220.101.5])'
  });
  const [emailResult, setEmailResult] = useState(null);
  const [isEmailScanning, setIsEmailScanning] = useState(false);

  // Phone / Spam Checker State (SRD §15)
  const [phoneForm, setPhoneForm] = useState({
    phoneNumber: '9400211984',
    countryCode: '+91',
    message: 'Army CSD Canteen AFD quota token approved. Pay Rs 4,500 advance via UPI to confirm delivery.',
    callType: 'CALL'
  });
  const [phoneResult, setPhoneResult] = useState(null);
  const [isPhoneScanning, setIsPhoneScanning] = useState(false);

  // File Sandbox State
  const [sandboxFile, setSandboxFile] = useState(null);
  const [sandboxHash, setSandboxHash] = useState('');
  const [sandboxResult, setSandboxResult] = useState(null);
  const [isSandboxScanning, setIsSandboxScanning] = useState(false);

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // URL Scan Submit
  const handleUrlScan = async (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    setIsUrlScanning(true);
    try {
      const res = await api.threatDetection.analyzeUrl(urlInput);
      setUrlResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUrlScanning(false);
    }
  };

  // Email Scan Submit
  const handleEmailScan = async (e) => {
    e.preventDefault();
    setIsEmailScanning(true);
    try {
      const res = await api.threatDetection.analyzeEmail(emailForm);
      setEmailResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsEmailScanning(false);
    }
  };

  // Phone Scan Submit
  const handlePhoneScan = async (e) => {
    e.preventDefault();
    setIsPhoneScanning(true);
    try {
      const res = await api.threatDetection.analyzePhone(phoneForm);
      setPhoneResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsPhoneScanning(false);
    }
  };

  // File Sandbox Submit
  const handleFileScan = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSandboxFile(file);
    setIsSandboxScanning(true);
    try {
      const sha256 = await calculateSHA256(file);
      setSandboxHash(sha256);
      const res = await analyzeThreat({
        text: `Filename: ${file.name} Size: ${file.size} Hash: ${sha256}`,
        inputType: 'FILE'
      });
      setSandboxResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSandboxScanning(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 border border-red-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-500/40 text-[10px] font-mono text-red-300 uppercase tracking-wider mb-3">
          <Cpu className="w-3.5 h-3.5 text-red-400" />
          Real-time Heuristic Threat Detection Engine
        </div>
        <h1 className="text-2xl sm:text-3xl font-display font-black text-white tracking-wide uppercase">
          Cyber Threat Analysis Suite
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          Automated multi-vector threat evaluation for suspicious URLs, spear-phishing emails, malicious caller IDs, and file SHA-256 hashes.
        </p>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 pt-6 border-t border-slate-800/80 mt-6">
          {[
            { id: 'url', label: 'URL / Link Scanner', icon: Globe },
            { id: 'email', label: 'Email Threat Analyzer', icon: Mail },
            { id: 'phone', label: 'Phone & Spam Checker', icon: Phone },
            { id: 'sandbox', label: 'File Hash Sandbox', icon: Hash }
          ].map(t => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => handleTabSwitch(t.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-mono uppercase tracking-wider transition-all ${
                  isActive
                    ? 'bg-red-500 text-slate-950 font-bold shadow-glow-neon'
                    : 'bg-slate-950/80 text-slate-400 border border-slate-800 hover:text-red-300 hover:border-red-500/40'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: URL Checker */}
      {activeTab === 'url' && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
          <div className="border-b border-slate-800/80 pb-4">
            <h2 className="text-base sm:text-lg font-display font-bold text-white uppercase tracking-wider flex items-center gap-2.5">
              <Globe className="w-4 h-4 text-red-400" />
              Suspicious URL & Phishing Link Scanner
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Inspects domain entropy, typosquatting of Indian defence domains, brand spoofing (.xyz, .top, .online), and HTTPS cipher strength.
            </p>
          </div>

          <form onSubmit={handleUrlScan} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2">
                Target URL or Domain
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  required
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example-defence-portal.xyz/login"
                  className="flex-1 bg-slate-950/90 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400/50 transition placeholder:text-slate-600"
                />
                <button
                  type="submit"
                  disabled={isUrlScanning}
                  className="px-8 py-3 rounded-2xl bg-red-500 hover:bg-red-400 text-slate-950 font-display font-black text-xs uppercase tracking-wider shadow-glow-neon flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  {isUrlScanning ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                      Scanning ML...
                    </>
                  ) : (
                    'Scan URL'
                  )}
                </button>
              </div>
            </div>
          </form>

          {urlResult && (
            <div className="p-6 rounded-3xl bg-slate-950/90 border border-red-500/40 space-y-4 animate-fadeIn">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
                    urlResult.prediction.riskScore >= 80 ? 'bg-red-950 text-red-400 border border-red-500/40 text-glow-red' : 'bg-red-950 text-red-400 border border-red-500/40'
                  }`}>
                    {urlResult.prediction.label}
                  </span>
                  <span className="text-xs font-mono text-slate-300">
                    Risk Score: <strong className="text-white font-bold">{urlResult.prediction.riskScore}/100</strong>
                  </span>
                </div>
                <span className="text-xs font-mono text-red-400">
                  Confidence: {(urlResult.prediction.confidence * 100).toFixed(1)}%
                </span>
              </div>

              <div className="text-xs space-y-2.5">
                <p className="text-slate-300 leading-relaxed">
                  <strong className="text-white">Recommendation:</strong> {urlResult.recommendation}
                </p>
                <div className="space-y-1.5 pt-1">
                  <span className="text-slate-400 font-mono text-[11px] uppercase tracking-wider">ML Indicators & Anomalies:</span>
                  <div className="flex flex-wrap gap-2">
                    {urlResult.indicators.map((ind, i) => (
                      <span key={i} className="px-3 py-1 rounded-full bg-slate-900 text-xs font-mono text-red-400 border border-red-500/30">
                        • {ind}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex justify-end">
                <button
                  onClick={() => navigate('/report', { state: { presetText: urlInput, scanResult: urlResult } })}
                  className="px-5 py-2.5 text-xs font-display font-bold uppercase tracking-wider rounded-2xl bg-red-600 hover:bg-red-500 text-white flex items-center gap-2 shadow-glow-red transition"
                >
                  <ShieldAlert className="w-4 h-4" />
                  Lodge Incident Report with this URL
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Email Checker */}
      {activeTab === 'email' && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
          <div className="border-b border-slate-800/80 pb-4">
            <h2 className="text-base sm:text-lg font-display font-bold text-white uppercase tracking-wider flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-red-400" />
              Email & Inbound Threat Analyzer
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Evaluates email headers, sender-domain SPF/DKIM alignment, urgency tactics, and credential harvesting hooks.
            </p>
          </div>

          <form onSubmit={handleEmailScan} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                  Sender Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={emailForm.senderEmail}
                  onChange={(e) => setEmailForm(prev => ({ ...prev, senderEmail: e.target.value }))}
                  placeholder="e.g. notice-verify@indian-army-advisory.org"
                  className="w-full bg-slate-950/90 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-400 font-mono transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                  Email Subject Line *
                </label>
                <input
                  type="text"
                  required
                  value={emailForm.subject}
                  onChange={(e) => setEmailForm(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="e.g. URGENT: Verify SPARSH Digital Life Certificate within 24h"
                  className="w-full bg-slate-950/90 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-400 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                Email Body Text Content *
              </label>
              <textarea
                rows={4}
                required
                value={emailForm.body}
                onChange={(e) => setEmailForm(prev => ({ ...prev, body: e.target.value }))}
                placeholder="Paste the full body text of the suspicious email..."
                className="w-full bg-slate-950/90 border border-slate-800 rounded-2xl p-4 text-xs text-white focus:outline-none focus:border-red-400 transition"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isEmailScanning}
                className="px-6 py-2.5 rounded-2xl bg-red-500 hover:bg-red-400 text-slate-950 font-display font-bold text-xs uppercase tracking-wider shadow-glow-neon flex items-center gap-2 transition disabled:opacity-50"
              >
                {isEmailScanning ? 'Evaluating NLP...' : 'Analyze Email Threats'}
              </button>
            </div>
          </form>

          {/* Email Result */}
          {emailResult && (
            <div className="p-6 rounded-3xl bg-slate-950/90 border border-red-500/40 space-y-4 animate-fadeIn">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
                    emailResult.prediction.riskScore >= 80 ? 'bg-red-950 text-red-300 border border-red-800' : 'bg-red-950 text-red-300 border border-red-800'
                  }`}>
                    {emailResult.prediction.label}
                  </span>
                  <span className="text-xs font-mono text-slate-300">
                    Risk Score: <strong className="text-white">{emailResult.prediction.riskScore}/100</strong>
                  </span>
                </div>
                <span className="text-[11px] font-mono text-red-400">Confidence: {(emailResult.prediction.confidence * 100).toFixed(0)}%</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed"><strong>Recommendation:</strong> {emailResult.recommendation}</p>

              {emailResult.indicators?.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-xs text-slate-400 font-mono">Threat Indicators:</span>
                  <div className="flex flex-wrap gap-2">
                    {emailResult.indicators.map((ind, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-full bg-slate-900 text-[11px] font-mono text-red-300 border border-red-500/30">
                        • {ind}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Phone / Spam Checker */}
      {activeTab === 'phone' && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
          <div className="border-b border-slate-800/80 pb-4">
            <h2 className="text-base sm:text-lg font-display font-bold text-white uppercase tracking-wider flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-red-400" />
              Phone Number & Spam Registry Checker
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Cross-references suspect mobile numbers against national defence fraud registries and scam telemetry.
            </p>
          </div>

          <form onSubmit={handlePhoneScan} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                  Country Code
                </label>
                <input
                  type="text"
                  value={phoneForm.countryCode}
                  onChange={(e) => setPhoneForm(prev => ({ ...prev, countryCode: e.target.value }))}
                  className="w-full bg-slate-950/90 border border-slate-800 rounded-2xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-red-400 transition"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phoneForm.phoneNumber}
                  onChange={(e) => setPhoneForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  placeholder="9400211984"
                  className="w-full bg-slate-950/90 border border-slate-800 rounded-2xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-red-400 transition"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                  Call or SMS Message Content
                </label>
                <textarea
                  rows={3}
                  value={phoneForm.message}
                  onChange={(e) => setPhoneForm(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Paste SMS text or describe caller claims..."
                  className="w-full bg-slate-950/90 border border-slate-800 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-red-400 transition"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isPhoneScanning}
                className="px-6 py-2.5 rounded-2xl bg-red-500 hover:bg-red-400 text-slate-950 font-display font-bold text-xs uppercase tracking-wider shadow-glow-neon flex items-center gap-2 transition disabled:opacity-50"
              >
                {isPhoneScanning ? 'Querying Registries...' : 'Check Phone Number'}
              </button>
            </div>
          </form>

          {phoneResult && (
            <div className="p-6 rounded-3xl bg-slate-950/90 border border-red-500/40 space-y-4 animate-fadeIn">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
                  {phoneResult.prediction.label} (Spam Risk: {phoneResult.prediction.riskScore}%)
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Flagged by <strong className="text-white">14 Defence Users</strong>
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Recommendation:</strong> {phoneResult.recommendation}
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: File Hash Sandbox */}
      {activeTab === 'sandbox' && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
          <div className="border-b border-slate-800/80 pb-4">
            <h2 className="text-base sm:text-lg font-display font-bold text-white uppercase tracking-wider flex items-center gap-2.5">
              <Hash className="w-4 h-4 text-red-400" />
              File SHA-256 Digest & Malware Sandbox
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Inspect suspicious APK, document, or archive hashes without running the binary on your local system.
            </p>
          </div>

          <div className="border-2 border-dashed border-red-500/30 rounded-3xl p-8 text-center bg-slate-950/60 hover:border-red-400/60 transition">
            <input
              type="file"
              onChange={handleFileScan}
              className="hidden"
              id="sandbox-file-upload"
            />
            <label htmlFor="sandbox-file-upload" className="cursor-pointer flex flex-col items-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-red-950/80 border border-red-500/40 flex items-center justify-center text-red-400 shadow-glow-neon">
                <Hash className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-white">Select File to Compute SHA-256 Digest</p>
              <span className="pill-glass px-4 py-1.5 text-xs font-mono text-red-300">
                Choose Local File
              </span>
            </label>
          </div>

          {sandboxFile && (
            <div className="p-5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-3 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">File: {sandboxFile.name}</span>
                <span className="text-red-400 font-bold">{(sandboxFile.size / 1024).toFixed(1)} KB</span>
              </div>
              <div className="p-3 rounded-xl bg-black/60 border border-slate-800 text-[11px] text-red-400 break-all">
                SHA-256: {sandboxHash}
              </div>
              {sandboxResult && (
                <div className="pt-2 text-slate-300">
                  Status: <strong className="text-white">{sandboxResult.prediction.label}</strong> • Risk Score: {sandboxResult.prediction.riskScore}/100
                </div>
              )}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
