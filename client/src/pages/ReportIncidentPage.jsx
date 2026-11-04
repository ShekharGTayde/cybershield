import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  UploadCloud, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle,
  FileText, 
  Lock, 
  Key, 
  Trash2, 
  Link as LinkIcon, 
  ArrowRight, 
  ArrowLeft,
  Coins,
  MapPin,
  Calendar,
  Clock,
  Sparkles,
  WifiOff
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { useSync } from '../context/SyncContext';
import { calculateSHA256, generateBlockchainRecord } from '../services/crypto';
import { api, analyzeThreat, calculatePriorityScore } from '../services/api';
import { queueOfflineIncident } from '../services/db';
import { SeverityBadge, PriorityBadge, ThreatCategoryBadge } from '../components/common/Badge';

const INCIDENT_TYPES = [
  { value: 'PHISHING', label: 'Phishing (Fake SPARSH / ECHS / Banking Link)' },
  { value: 'ESPIONAGE', label: 'Espionage / Honeytrap / OPSEC Breach Attempt' },
  { value: 'MALWARE', label: 'Malware / Malicious Defence APK / Trojan' },
  { value: 'FINANCIAL_FRAUD', label: 'Financial Fraud (CSD Canteen / Welfare Loan)' },
  { value: 'IDENTITY_THEFT', label: 'Identity Theft / Defence Impersonation' },
  { value: 'SOCIAL_ENGINEERING', label: 'Social Engineering / Manipulation' },
  { value: 'OPSEC_RISK', label: 'OPSEC Risk / Troop Movement Inquiries' },
  { value: 'MALICIOUS_URL', label: 'Malicious URL / Suspicious Web Link' },
  { value: 'FAKE_EMAIL', label: 'Fake Email / Spoofed Defence Order' },
  { value: 'FAKE_CALL', label: 'Fake Call / Robocaller / Vishing' },
  { value: 'SPAM', label: 'Spam / Harassment' },
  { value: 'OTHER', label: 'Other Cyber Security Threat' }
];

export function ReportIncidentPage() {
  const { user } = useAuth();
  const { isOnline, refreshQueue } = useSync();
  const location = useLocation();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  // Form State matching SRD Section 9
  const [formData, setFormData] = useState({
    incidentType: 'PHISHING',
    title: '',
    description: '',
    incidentDate: new Date().toISOString().split('T')[0],
    incidentTime: '14:00',
    channel: 'SMS',
    suspectedSource: '',
    financialLoss: false,
    lossAmount: '',
    currency: 'INR',
    location: 'Military Station / Cantonment'
  });

  // Evidence state matching SRD Section 22
  const [evidences, setEvidences] = useState([]);
  const [isHashing, setIsHashing] = useState(false);

  // AI Threat Evaluation Preview state
  const [aiPreview, setAiPreview] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submissionResult, setSubmissionResult] = useState(null);

  // Prepopulate if navigated from Quick Scanner
  useEffect(() => {
    if (location.state?.presetText) {
      setFormData(prev => ({
        ...prev,
        title: 'Report: ' + location.state.presetText.substring(0, 40),
        description: location.state.presetText,
        suspectedSource: location.state.presetText.startsWith('http') ? location.state.presetText : ''
      }));
    }
  }, [location.state]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Real-time Evidence File Upload with SHA-256 computation
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setIsHashing(true);
    for (const file of files) {
      const sha256 = await calculateSHA256(file);
      const evidenceId = `EV-${Math.floor(1000 + Math.random() * 9000)}`;
      const blockchain = generateBlockchainRecord(evidenceId, 'PENDING-INCIDENT', sha256);

      const evidenceItem = {
        _id: 'ev-' + Date.now() + Math.random(),
        evidenceId,
        fileName: file.name,
        fileType: file.type.includes('image') ? 'IMAGE' : file.type.includes('audio') ? 'AUDIO' : file.type.includes('video') ? 'VIDEO' : 'FILE',
        mimeType: file.type || 'application/octet-stream',
        fileSize: file.size,
        sha256Hash: sha256,
        encryptionAlgorithm: 'AES-256-GCM',
        blockchain,
        uploadedAt: new Date().toISOString()
      };

      setEvidences(prev => [...prev, evidenceItem]);
    }
    setIsHashing(false);
  };

  const removeEvidence = (id) => {
    setEvidences(prev => prev.filter(e => e._id !== id));
  };

  // Evaluate AI Classification before final step
  const handleProceedToReview = async () => {
    setIsEvaluating(true);
    try {
      const textToAnalyze = `${formData.title} ${formData.description} ${formData.suspectedSource}`;
      const result = await analyzeThreat({
        text: textToAnalyze,
        inputType: formData.channel === 'SMS' || formData.channel === 'CALL' ? 'PHONE' : 'TEXT'
      });

      const { severity, priority } = calculatePriorityScore(
        formData.incidentType,
        result.prediction.riskScore,
        formData.financialLoss,
        Number(formData.lossAmount) || 0
      );

      setAiPreview({
        ...result,
        calculatedSeverity: severity,
        calculatedPriority: priority
      });
      setStep(3);
    } catch (err) {
      console.error(err);
      setStep(3);
    } finally {
      setIsEvaluating(false);
    }
  };

  // Final Submit Action (Handles Online and Offline)
  const handleSubmitFinal = async () => {
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const payload = {
        ...formData,
        evidences
      };

      if (!isOnline) {
        // Offline Mode: Queue into IndexedDB
        const offlineRecord = await queueOfflineIncident(payload);
        await refreshQueue();
        setSubmissionResult({
          offline: true,
          complaintId: offlineRecord.payload.complaintId,
          message: 'Saved locally in Encrypted IndexedDB Vault. Will auto-sync when online.'
        });
      } else {
        // Online Mode: Submit via API
        const res = await api.incidents.create(payload, user);
        if (res.success) {
          setSubmissionResult({
            offline: false,
            ...res.data
          });
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      }
    } catch (err) {
      console.error('Submission error:', err);
      setSubmitError(err.message || 'Submission failed. Please verify your details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Wizard Header */}
      <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 border border-red-500/25 shadow-xl relative overflow-hidden">
        <div className="pointer-events-none absolute -top-20 -right-20 w-60 h-60 rounded-full bg-[#F20D25]/10 blur-3xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 text-[#F20D25] text-xs font-cyber font-bold border border-red-500/30 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#F20D25] animate-pulse shadow-[0_0_8px_#F20D25]" />
              OFFICIAL GRIEVANCE // CERT-ARMY DESK
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight uppercase">
              Report Cyber Threat / Fraud Incident
            </h1>
            <p className="text-xs text-[#869F90] font-mono">
              Heuristic classification & SHA-256 tamper-proof evidence preservation
            </p>
          </div>

          {/* Stepper Progress */}
          <div className="flex items-center gap-2 text-xs font-cyber">
            <div className={`px-3.5 py-1.5 rounded-full border flex items-center gap-1.5 transition ${
              step >= 1 ? 'bg-[#F20D25] border-[#F20D25] text-black font-bold shadow-[0_0_12px_rgba(255,38,56,0.35)]' : 'bg-black/40 border-red-500/20 text-[#869F90]'
            }`}>
              <span>1</span>
              <span className="hidden sm:inline">INCIDENT INFO</span>
            </div>
            <span className="text-red-500/40">―</span>
            <div className={`px-3.5 py-1.5 rounded-full border flex items-center gap-1.5 transition ${
              step >= 2 ? 'bg-[#F20D25] border-[#F20D25] text-black font-bold shadow-[0_0_12px_rgba(255,38,56,0.35)]' : 'bg-black/40 border-red-500/20 text-[#869F90]'
            }`}>
              <span>2</span>
              <span className="hidden sm:inline">EVIDENCE VAULT</span>
            </div>
            <span className="text-red-500/40">―</span>
            <div className={`px-3.5 py-1.5 rounded-full border flex items-center gap-1.5 transition ${
              step >= 3 ? 'bg-[#F20D25] border-[#F20D25] text-black font-bold shadow-[0_0_12px_rgba(255,38,56,0.35)]' : 'bg-black/40 border-red-500/20 text-[#869F90]'
            }`}>
              <span>3</span>
              <span className="hidden sm:inline">AI TRIAGE & SUBMIT</span>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal / Result View */}
      {submissionResult && (
        <div className="glass-panel-glow rounded-2xl p-8 border border-red-500/40 text-center space-y-6 animate-fadeIn">
          <div className="inline-flex p-4 rounded-full bg-red-950 text-red-400 border border-red-800 shadow-glow-emerald">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <h2 className="text-2xl font-bold text-white">
              {submissionResult.offline ? 'Report Queued in Offline Vault' : 'Incident Report Lodged Successfully!'}
            </h2>
            <p className="text-xs text-slate-300">
              {submissionResult.offline 
                ? 'Your incident has been securely recorded with SHA-256 cryptographic hashes on this device and will be synced to CERT-Army upon connection.'
                : 'Your complaint has undergone AI threat classification and priority assignment. A CERT-Army cyber officer has been notified.'}
            </p>
          </div>

          {/* Reference Card */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 max-w-md mx-auto space-y-3 font-mono">
            <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
              <span className="text-slate-400">Official Complaint ID:</span>
              <span className="text-base font-extrabold text-cyan-400">{submissionResult.complaintId}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Assigned Severity & Priority:</span>
              <div className="flex items-center gap-2">
                <SeverityBadge severity={submissionResult.severity || 'CRITICAL'} />
                <PriorityBadge priority={submissionResult.priority || 'P1'} />
              </div>
            </div>
            {submissionResult.aiAnalysis && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">AI Classification:</span>
                <span className="font-bold text-amber-400">{submissionResult.aiAnalysis.classification}</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => navigate(`/track?id=${submissionResult.complaintId}`)}
              className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow-glow-cyan transition"
            >
              Track Case Live Timeline
            </button>
            <button
              onClick={() => {
                setSubmissionResult(null);
                setStep(1);
                setFormData({
                  incidentType: 'PHISHING',
                  title: '',
                  description: '',
                  incidentDate: new Date().toISOString().split('T')[0],
                  incidentTime: '14:00',
                  channel: 'SMS',
                  suspectedSource: '',
                  financialLoss: false,
                  lossAmount: '',
                  currency: 'INR',
                  location: 'Military Station'
                });
                setEvidences([]);
              }}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
            >
              Lodge Another Report
            </button>
          </div>
        </div>
      )}

      {/* STEP 1: Incident Information */}
      {!submissionResult && step === 1 && (
        <div className="glass-panel-glow rounded-3xl p-6 sm:p-9 border border-red-500/25 space-y-6 shadow-2xl">
          <div className="border-b border-red-500/15 pb-4">
            <h2 className="text-lg font-display font-bold text-white flex items-center gap-2 uppercase">
              <FileText className="w-5 h-5 text-[#F20D25]" />
              STEP 1: Incident Characteristics & Context
            </h2>
            <p className="text-xs text-[#869F90] mt-1 font-mono">
              Provide verifiable parameters of the suspected cyber fraud, honeytrap, or OPSEC anomaly.
            </p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-5">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Incident Type */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-cyber text-[#F20D25] uppercase tracking-wider mb-1.5 font-bold">
                  INCIDENT THREAT CATEGORY (incidentType) *
                </label>
                <select
                  name="incidentType"
                  value={formData.incidentType}
                  onChange={handleInputChange}
                  className="w-full bg-black/60 border border-red-500/25 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#F20D25] focus:ring-1 focus:ring-[#F20D25]/40 font-cyber font-semibold"
                >
                  {INCIDENT_TYPES.map(t => (
                    <option key={t.value} value={t.value} className="bg-[#0A100C]">{t.label}</option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-cyber text-[#869F90] uppercase tracking-wider mb-1.5 font-bold">
                  INCIDENT HEADLINE / SUMMARY *
                </label>
                <input
                  type="text"
                  required
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Fraudulent SMS claiming SPARSH Pension locked with link to sparsh-update.xyz"
                  className="w-full bg-black/60 border border-red-500/25 rounded-2xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-[#F20D25] focus:ring-1 focus:ring-[#F20D25]/40 transition"
                />
              </div>

              {/* Incident Date */}
              <div>
                <label className="block text-xs font-cyber text-[#869F90] uppercase tracking-wider mb-1.5 font-bold">
                  DATE OF INCIDENT *
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-[#869F90] absolute left-3.5 top-3" />
                  <input
                    type="date"
                    required
                    name="incidentDate"
                    value={formData.incidentDate}
                    onChange={handleInputChange}
                    className="w-full bg-black/60 border border-red-500/25 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-[#F20D25]"
                  />
                </div>
              </div>

              {/* Incident Time */}
              <div>
                <label className="block text-xs font-cyber text-[#869F90] uppercase tracking-wider mb-1.5 font-bold">
                  APPROXIMATE TIME *
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-[#869F90] absolute left-3.5 top-3" />
                  <input
                    type="time"
                    required
                    name="incidentTime"
                    value={formData.incidentTime}
                    onChange={handleInputChange}
                    className="w-full bg-black/60 border border-red-500/25 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-[#F20D25]"
                  />
                </div>
              </div>

              {/* Channel */}
              <div>
                <label className="block text-xs font-cyber text-[#869F90] uppercase tracking-wider mb-1.5 font-bold">
                  ATTACK / DELIVERY CHANNEL *
                </label>
                <select
                  name="channel"
                  value={formData.channel}
                  onChange={handleInputChange}
                  className="w-full bg-black/60 border border-red-500/25 rounded-2xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-[#F20D25]"
                >
                  <option value="SMS" className="bg-[#0A100C]">SMS Message</option>
                  <option value="WHATSAPP" className="bg-[#0A100C]">WhatsApp Forward / Group</option>
                  <option value="EMAIL" className="bg-[#0A100C]">Email / Official Inbound</option>
                  <option value="CALL" className="bg-[#0A100C]">Phone Call / Vishing</option>
                  <option value="WEB" className="bg-[#0A100C]">Web Browser / Malicious Link</option>
                  <option value="SOCIAL_MEDIA" className="bg-[#0A100C]">Social Media (LinkedIn/FB/Insta)</option>
                  <option value="OTHER" className="bg-[#0A100C]">Other / USB / Physical</option>
                </select>
              </div>

              {/* Suspected Source */}
              <div>
                <label className="block text-xs font-cyber text-[#869F90] uppercase tracking-wider mb-1.5 font-bold">
                  SUSPECTED SENDER (PHONE / URL / EMAIL)
                </label>
                <input
                  type="text"
                  name="suspectedSource"
                  value={formData.suspectedSource}
                  onChange={handleInputChange}
                  placeholder="e.g. +91 94002 11984 or http://fake-link.xyz"
                  className="w-full bg-black/60 border border-red-500/25 rounded-2xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-[#F20D25]"
                />
              </div>

              {/* Location */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-cyber text-[#869F90] uppercase tracking-wider mb-1.5 font-bold">
                  STATION LOCATION / CANTONMENT
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#869F90] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g. Northern Command HQ / Pune Cantonment"
                    className="w-full bg-black/60 border border-red-500/25 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-[#F20D25]"
                  />
                </div>
              </div>

              {/* Financial Loss Section */}
              <div className="sm:col-span-2 p-4.5 rounded-2xl bg-black/50 border border-red-500/20 space-y-3">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name="financialLoss"
                    checked={formData.financialLoss}
                    onChange={handleInputChange}
                    className="rounded bg-black border-red-500/40 text-rose-500 focus:ring-rose-500/30"
                  />
                  <span className="text-xs font-cyber font-bold text-white uppercase tracking-wide">
                    Did this incident involve financial fraud or unauthorized funds deduction?
                  </span>
                </label>

                {formData.financialLoss && (
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-[11px] font-mono text-[#869F90] mb-1">Loss Amount</label>
                      <input
                        type="number"
                        name="lossAmount"
                        value={formData.lossAmount}
                        onChange={handleInputChange}
                        placeholder="e.g. 25000"
                        className="w-full bg-black/80 border border-rose-500/40 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-rose-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-[#869F90] mb-1">Currency</label>
                      <select
                        name="currency"
                        value={formData.currency}
                        onChange={handleInputChange}
                        className="w-full bg-black/80 border border-red-500/25 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-[#F20D25]"
                      >
                        <option value="INR" className="bg-[#0A100C]">INR (₹)</option>
                        <option value="USD" className="bg-[#0A100C]">USD ($)</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-cyber text-[#869F90] uppercase tracking-wider mb-1.5 font-bold">
                  INCIDENT NARRATIVE & SEQUENCE OF EVENTS *
                </label>
                <textarea
                  required
                  rows={4}
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Explain exactly what happened, what message was received, what link was clicked, and any OTP demands made..."
                  className="w-full bg-black/60 border border-red-500/25 rounded-2xl p-4 text-sm text-white font-mono focus:outline-none focus:border-[#F20D25] leading-relaxed"
                />
              </div>

            </div>

            <div className="flex justify-end pt-4 border-t border-red-500/15">
              <button
                type="submit"
                className="px-6 py-3 rounded-full bg-[#F20D25] hover:bg-[#34d399] text-black font-cyber font-bold text-xs shadow-[0_0_20px_rgba(255,38,56,0.4)] flex items-center gap-2 transition cursor-pointer uppercase tracking-wider"
              >
                PROCEED TO EVIDENCE VAULT
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* STEP 2: Evidence Vault with SHA-256 Hashing */}
      {!submissionResult && step === 2 && (
        <div className="glass-panel-glow rounded-3xl p-6 sm:p-9 border border-red-500/25 space-y-6 shadow-2xl">
          <div className="border-b border-red-500/15 pb-4">
            <h2 className="text-lg font-display font-bold text-white flex items-center gap-2 uppercase">
              <UploadCloud className="w-5 h-5 text-[#F20D25]" />
              STEP 2: Digital Evidence Upload & Cryptographic Anchoring
            </h2>
            <p className="text-xs text-[#869F90] mt-1 font-mono">
              Upload screenshots, audio clips, email headers, or APK files. Each file is verified with SHA-256 for legal chain of custody.
            </p>
          </div>

          {/* Upload Dropzone */}
          <div className="border-2 border-dashed border-red-500/30 hover:border-[#F20D25] rounded-3xl p-8 text-center bg-black/40 transition-all group">
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              id="evidence-file-input"
            />
            <label htmlFor="evidence-file-input" className="cursor-pointer flex flex-col items-center space-y-3">
              <div className="p-4 rounded-2xl bg-[#F20D25]/10 text-[#F20D25] border border-[#F20D25]/40 shadow-[0_0_20px_rgba(255,38,56,0.25)] group-hover:scale-105 transition-transform">
                <UploadCloud className="w-8 h-8 stroke-[2.2]" />
              </div>
              <div>
                <p className="text-sm font-cyber font-bold text-white uppercase tracking-wider">CLICK OR DRAG FILES TO ANCHOR AS EVIDENCE</p>
                <p className="text-xs text-[#869F90] mt-1 font-mono">
                  Supported: Screenshots (PNG/JPG), Audio (MP3/WAV), PDFs, Call logs, Suspicious APKs
                </p>
              </div>
              <span className="pill-glass px-5 py-2 text-xs font-cyber tracking-wider hover:border-[#F20D25]">
                BROWSE SECURE FILES
              </span>
            </label>
          </div>

          {isHashing && (
            <div className="p-3.5 rounded-2xl bg-black/80 border border-red-500/40 text-[#F20D25] text-xs flex items-center gap-2 font-mono">
              <div className="w-3.5 h-3.5 border-2 border-[#F20D25] border-t-transparent rounded-full animate-spin"></div>
              <span>COMPUTING SHA-256 CRYPTOGRAPHIC DIGEST VIA WEB CRYPTO API…</span>
            </div>
          )}

          {/* List of uploaded evidences with SHA-256 and Blockchain status */}
          {evidences.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-cyber uppercase tracking-widest text-[#F20D25] font-bold">
                ANCHORED EVIDENCE ITEMS ({evidences.length})
              </h3>
              <div className="space-y-2.5">
                {evidences.map((ev) => (
                  <div key={ev._id} className="p-4 rounded-2xl bg-black/60 border border-red-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-cyber font-bold text-white truncate max-w-xs">{ev.fileName}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black text-[#F20D25] border border-red-500/30">
                          {ev.fileType} • {(ev.fileSize / 1024).toFixed(1)} KB
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-950 text-[#F20D25] border border-red-600/40">
                          AES-256-GCM
                        </span>
                      </div>
                      <div className="font-mono text-[10px] text-[#869F90] truncate max-w-md">
                        SHA-256: <span className="text-[#F20D25]">{ev.sha256Hash}</span>
                      </div>
                      <div className="font-mono text-[9px] text-slate-500">
                        Blockchain Tx: {ev.blockchain?.transactionId?.substring(0, 24)}... (Block #{ev.blockchain?.blockNumber})
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeEvidence(ev._id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-950/20 border border-transparent hover:border-red-500/30 transition cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-red-500/15">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="pill-glass px-5 py-2.5 rounded-full text-xs font-cyber tracking-wider"
            >
              <ArrowLeft className="w-4 h-4" />
              BACK
            </button>

            <button
              type="button"
              disabled={isEvaluating}
              onClick={handleProceedToReview}
              className="px-6 py-3 rounded-full bg-[#F20D25] hover:bg-[#34d399] text-black font-cyber font-bold text-xs shadow-[0_0_20px_rgba(255,38,56,0.4)] flex items-center gap-2 transition disabled:opacity-50 cursor-pointer uppercase tracking-wider"
            >
              {isEvaluating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  RUNNING AI HEURISTIC ENGINE…
                </>
              ) : (
                <>
                  PROCEED TO AI REVIEW & RISK SCORE
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: AI Threat Classification & Final Confirmation */}
      {!submissionResult && step === 3 && (
        <div className="glass-panel-glow rounded-3xl p-6 sm:p-9 border border-red-500/25 space-y-6 shadow-2xl">
          <div className="border-b border-red-500/15 pb-4">
            <h2 className="text-lg font-display font-bold text-white flex items-center gap-2 uppercase">
              <Sparkles className="w-5 h-5 text-[#F20D25]" />
              STEP 3: AI Threat Assessment & Final Grievance Dispatch
            </h2>
            <p className="text-xs text-[#869F90] mt-1 font-mono">
              Review automated AI classification, calculated priority level, and dispatch to CERT-Army triage radar.
            </p>
          </div>

          {submitError && (
            <div className="p-4 rounded-2xl bg-red-950/80 border border-red-500/50 text-red-300 text-xs flex items-center gap-3 font-mono">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          {/* AI Analysis Card (SRD Section 31) */}
          {aiPreview && (
            <div className="p-6 rounded-3xl bg-black/70 border border-red-500/35 space-y-4 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-red-500/15">
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-[#F20D25]" />
                  <span className="font-cyber font-bold text-white text-sm uppercase tracking-wide">AUTOMATED AI THREAT ASSESSMENT</span>
                </div>
                <div className="flex items-center gap-2">
                  <SeverityBadge severity={aiPreview.calculatedSeverity} />
                  <PriorityBadge priority={aiPreview.calculatedPriority} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                <div className="p-3.5 rounded-2xl bg-black border border-red-500/20">
                  <span className="text-[#869F90] block text-[10px] uppercase">PREDICTED CATEGORY:</span>
                  <span className="text-base font-bold text-[#F20D25] font-cyber">{aiPreview.prediction.label}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-black border border-red-500/20">
                  <span className="text-[#869F90] block text-[10px] uppercase">THREAT RISK SCORE:</span>
                  <span className={`text-base font-bold font-display ${
                    aiPreview.prediction.riskScore >= 80 ? 'text-red-400' : 'text-amber-400'
                  }`}>
                    {aiPreview.prediction.riskScore} / 100
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-black border border-red-500/20">
                  <span className="text-[#869F90] block text-[10px] uppercase">ML ENGINE CONFIDENCE:</span>
                  <span className="text-base font-bold text-red-400 font-display">
                    {(aiPreview.prediction.confidence * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="text-xs space-y-2">
                <p className="text-slate-200">
                  <strong className="text-[#F20D25] font-cyber uppercase tracking-wider">CERT Recommendation:</strong> {aiPreview.recommendation}
                </p>
                {aiPreview.indicators?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {aiPreview.indicators.map((ind, i) => (
                      <span key={i} className="px-2.5 py-0.5 rounded-full bg-white/[0.05] text-[11px] font-mono text-[#F20D25] border border-red-500/25">
                        ✓ {ind}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Summary of Incident */}
          <div className="p-5 rounded-2xl bg-black/40 border border-red-500/20 space-y-2 text-xs font-mono">
            <h3 className="font-cyber uppercase font-bold text-[#F20D25] text-xs tracking-wider">SUBMISSION SUMMARY:</h3>
            <p><strong className="text-white">Title:</strong> {formData.title}</p>
            <p><strong className="text-white">Type:</strong> {formData.incidentType} | <strong className="text-white">Channel:</strong> {formData.channel}</p>
            <p><strong className="text-white">Station:</strong> {formData.incidentDate} at {formData.incidentTime} ({formData.location})</p>
            <p><strong className="text-white">Evidence:</strong> {evidences.length} files attached with SHA-256 hashes</p>
          </div>

          {!isOnline && (
            <div className="p-3.5 rounded-2xl bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs flex items-center gap-2 font-mono">
              <WifiOff className="w-4 h-4 shrink-0 text-amber-400" />
              <span>
                <strong>OFFLINE MODE:</strong> This report will be encrypted in IndexedDB and dispatched to CERT-Army upon connectivity.
              </span>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-red-500/15">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="pill-glass px-5 py-2.5 rounded-full text-xs font-cyber tracking-wider"
            >
              <ArrowLeft className="w-4 h-4" />
              BACK
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmitFinal}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-cyber font-bold text-xs shadow-[0_0_20px_rgba(239,68,68,0.4)] flex items-center gap-2 transition disabled:opacity-50 cursor-pointer uppercase tracking-wider"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  SUBMITTING TO CERT-ARMY…
                </>
              ) : (
                <>
                  <ShieldAlert className="w-4 h-4" />
                  CONFIRM & DISPATCH INCIDENT TO CERT-ARMY ↗
                </>
              )}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
