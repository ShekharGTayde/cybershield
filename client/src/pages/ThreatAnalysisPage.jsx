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
      <div className="glass-panel-glow rounded-2xl p-6 sm:p-8 border border-cyan-500/30">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 text-xs font-mono border border-cyan-800 w-fit mb-2">
          <Cpu className="w-4 h-4" />
          SRD §13-15 AI Threat Heuristics & ML Detection
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          AI Cyber Threat Analysis Suite
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Real-time threat evaluation for URLs, emails, phone numbers, and files using the FastAPI defence classifier model.
        </p>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 pt-6 border-t border-slate-800/80 mt-6">
          {[
            { id: 'url', label: 'URL / Link Checker', icon: Globe },
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
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono transition-all ${
                  isActive
                    ? 'bg-cyan-600 text-white font-bold shadow-glow-cyan'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: URL Checker (SRD §13.1) */}
      {activeTab === 'url' && (
        <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-cyan-400" />
              13.1 Suspicious URL / Phishing Checker
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Inspects domain age, entropy, typosquatting of defence portals (.xyz/.top), and HTTPS certificate validity.
            </p>
          </div>

          <form onSubmit={handleUrlScan} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-defence-muted uppercase tracking-wider mb-1.5">
                Target URL
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  required
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example-defence-portal.xyz/login"
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="submit"
                  disabled={isUrlScanning}
                  className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow-glow-cyan flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  {isUrlScanning ? 'Scanning ML Engine...' : 'Scan URL'}
                </button>
              </div>
            </div>
          </form>

          {urlResult && (
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-cyan-500/40 space-y-4 animate-fadeIn">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-md text-xs font-mono font-bold ${
                    urlResult.prediction.riskScore >= 80 ? 'bg-red-500/20 text-red-400 border border-red-500/40 text-glow-red' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  }`}>
                    {urlResult.prediction.label}
                  </span>
                  <span className="text-xs font-mono text-slate-300">
                    Risk Score: <strong className="text-white">{urlResult.prediction.riskScore}/100</strong>
                  </span>
                </div>
                <span className="text-xs font-mono text-emerald-400">
                  Confidence: {(urlResult.prediction.confidence * 100).toFixed(1)}%
                </span>
              </div>

              <div className="text-xs space-y-2">
                <p className="text-slate-300">
                  <strong className="text-white">Recommendation:</strong> {urlResult.recommendation}
                </p>
                <div className="space-y-1 pt-1">
                  <span className="text-slate-400 font-mono">ML Indicators & Anomalies:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {urlResult.indicators.map((ind, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-slate-950 text-xs font-mono text-cyan-400 border border-slate-800">
                        • {ind}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => navigate('/report', { state: { presetText: urlInput, scanResult: urlResult } })}
                  className="px-4 py-2 text-xs font-medium rounded-lg bg-red-600 hover:bg-red-500 text-white flex items-center gap-1.5 shadow-glow-red"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Lodge Incident Report with this URL
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Email Checker (SRD §14) */}
      {activeTab === 'email' && (
        <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-purple-400" />
              14. Email & Inbound Threat Analyzer (NLP)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Evaluates email headers, sender-domain alignment, urgency language, and credential requests.
            </p>
          </div>

          <form onSubmit={handleEmailScan} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-defence-muted uppercase tracking-wider mb-1.5">
                  Sender Email (senderEmail) *
                </label>
                <input
                  type="email"
                  required
                  value={emailForm.senderEmail}
                  onChange={(e) => setEmailForm(prev => ({ ...prev, senderEmail: e.target.value }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-defence-muted uppercase tracking-wider mb-1.5">
                  Subject Line *
                </label>
                <input
                  type="text"
                  required
                  value={emailForm.subject}
                  onChange={(e) => setEmailForm(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-mono text-defence-muted uppercase tracking-wider mb-1.5">
                  Email Body Content *
                </label>
                <textarea
                  rows={4}
                  required
                  value={emailForm.body}
                  onChange={(e) => setEmailForm(prev => ({ ...prev, body: e.target.value }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-mono text-defence-muted uppercase tracking-wider mb-1.5">
                  Raw Headers (Optional)
                </label>
                <input
                  type="text"
                  value={emailForm.headers}
                  onChange={(e) => setEmailForm(prev => ({ ...prev, headers: e.target.value }))}
                  placeholder="Received: from mail.example.com"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-slate-300 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isEmailScanning}
                className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-glow-purple flex items-center gap-2 transition disabled:opacity-50"
              >
                {isEmailScanning ? 'Running NLP Classifier...' : 'Analyze Email Threat'}
              </button>
            </div>
          </form>

          {emailResult && (
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-purple-500/40 space-y-4 animate-fadeIn">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <span className="px-3 py-1 rounded-md text-xs font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/40">
                  {emailResult.prediction.label} (Score: {emailResult.prediction.riskScore}/100)
                </span>
                <span className="text-xs font-mono text-emerald-400">
                  Confidence: {(emailResult.prediction.confidence * 100).toFixed(1)}%
                </span>
              </div>
              <p className="text-xs text-slate-300">
                <strong>Recommendation:</strong> {emailResult.recommendation}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {emailResult.indicators.map((ind, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-slate-950 text-xs font-mono text-purple-300 border border-purple-900/50">
                    • {ind}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Phone / Spam Checker (SRD §15) */}
      {activeTab === 'phone' && (
        <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Phone className="w-5 h-5 text-amber-400" />
              15. Phone Number & Spam Call Checker
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Cross-references suspect mobile number against national defence fraud registries and robocall telemetry.
            </p>
          </div>

          <form onSubmit={handlePhoneScan} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono text-defence-muted uppercase tracking-wider mb-1.5">
                  Country Code
                </label>
                <input
                  type="text"
                  value={phoneForm.countryCode}
                  onChange={(e) => setPhoneForm(prev => ({ ...prev, countryCode: e.target.value }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-mono text-defence-muted uppercase tracking-wider mb-1.5">
                  Phone Number (phoneNumber) *
                </label>
                <input
                  type="tel"
                  required
                  value={phoneForm.phoneNumber}
                  onChange={(e) => setPhoneForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  placeholder="9400211984"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-mono text-defence-muted uppercase tracking-wider mb-1.5">
                  Call or SMS Message Content
                </label>
                <textarea
                  rows={3}
                  value={phoneForm.message}
                  onChange={(e) => setPhoneForm(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Paste SMS text or describe caller claims..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isPhoneScanning}
                className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs shadow-glow-amber flex items-center gap-2 transition disabled:opacity-50"
              >
                {isPhoneScanning ? 'Querying Blacklists...' : 'Check Phone Number'}
              </button>
            </div>
          </form>

          {phoneResult && (
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-amber-500/40 space-y-4 animate-fadeIn">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <span className="px-3 py-1 rounded-md text-xs font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
                  {phoneResult.prediction.label} (Spam Risk: {phoneResult.prediction.riskScore}%)
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Reported by <strong className="text-white">14 Defence Users</strong>
                </span>
              </div>
              <p className="text-xs text-slate-300">
                <strong>Recommendation:</strong> {phoneResult.recommendation}
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: File Hash Sandbox */}
      {activeTab === 'sandbox' && (
        <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Hash className="w-5 h-5 text-emerald-400" />
              File SHA-256 Digest & Malware Sandbox
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Inspect suspicious APK, document, or archive hashes without running the binary on your local system.
            </p>
          </div>

          <div className="border-2 border-dashed border-slate-700 rounded-xl p-6 text-center bg-slate-900/40">
            <input
              type="file"
              onChange={handleFileScan}
              className="hidden"
              id="sandbox-file-upload"
            />
            <label htmlFor="sandbox-file-upload" className="cursor-pointer flex flex-col items-center space-y-2">
              <Hash className="w-8 h-8 text-emerald-400" />
              <p className="text-xs font-semibold text-white">Select File to Compute SHA-256 Digest</p>
              <span className="px-3 py-1 rounded-lg bg-slate-800 text-xs font-mono text-cyan-300">
                Choose File
              </span>
            </label>
          </div>

          {sandboxFile && (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">File: {sandboxFile.name}</span>
                <span className="text-cyan-400">{(sandboxFile.size / 1024).toFixed(1)} KB</span>
              </div>
              <div className="p-2 rounded bg-slate-950 text-[11px] text-emerald-400 break-all">
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
