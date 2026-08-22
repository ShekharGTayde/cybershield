import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  UploadCloud, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle, 
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Wizard Header */}
      <div className="glass-panel-glow rounded-2xl p-6 border border-cyan-500/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 text-xs font-mono border border-cyan-800 mb-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              SRD §9 Incident Reporting Wizard
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Report Cyber Threat / Security Incident
            </h1>
          </div>

          {/* Stepper Progress */}
          <div className="flex items-center gap-2 font-mono text-xs">
            <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 ${
              step >= 1 ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold' : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}>
              <span>1</span>
              <span className="hidden sm:inline">Incident Info</span>
            </div>
            <span className="text-slate-600">→</span>
            <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 ${
              step >= 2 ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold' : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}>
              <span>2</span>
              <span className="hidden sm:inline">Evidence Vault</span>
            </div>
            <span className="text-slate-600">→</span>
            <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 ${
              step >= 3 ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold' : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}>
              <span>3</span>
              <span className="hidden sm:inline">AI Review</span>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal / Result View */}
      {submissionResult && (
        <div className="glass-panel-glow rounded-2xl p-8 border border-emerald-500/40 text-center space-y-6 animate-fadeIn">
          <div className="inline-flex p-4 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 shadow-glow-emerald">
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
        <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-400" />
              Step 1: Incident Information & Characteristics
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Provide details of the suspected cyber fraud or security anomaly.
            </p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-5">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Incident Type */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1.5 font-semibold">
                  Incident Threat Category (incidentType) *
                </label>
                <select
                  name="incidentType"
                  value={formData.incidentType}
                  onChange={handleInputChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 font-medium"
                >
                  {INCIDENT_TYPES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-mono text-defence-muted uppercase tracking-wider mb-1.5">
                  Incident Title / Headline *
                </label>
                <input
                  type="text"
                  required
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Fraudulent SMS claiming SPARSH Pension locked with link to sparsh-update.xyz"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Incident Date */}
              <div>
                <label className="block text-xs font-mono text-defence-muted uppercase tracking-wider mb-1.5">
                  Date of Incident *
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="date"
                    required
                    name="incidentDate"
                    value={formData.incidentDate}
                    onChange={handleInputChange}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Incident Time */}
              <div>
                <label className="block text-xs font-mono text-defence-muted uppercase tracking-wider mb-1.5">
                  Approximate Time *
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="time"
                    required
                    name="incidentTime"
                    value={formData.incidentTime}
                    onChange={handleInputChange}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Channel */}
              <div>
                <label className="block text-xs font-mono text-defence-muted uppercase tracking-wider mb-1.5">
                  Attack / Delivery Channel *
                </label>
                <select
                  name="channel"
                  value={formData.channel}
                  onChange={handleInputChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="SMS">SMS Message</option>
                  <option value="WHATSAPP">WhatsApp Forward / Group</option>
                  <option value="EMAIL">Email / Official Inbound</option>
                  <option value="CALL">Phone Call / Vishing</option>
                  <option value="WEB">Web Browser / Malicious Link</option>
                  <option value="SOCIAL_MEDIA">Social Media (LinkedIn/FB/Insta)</option>
                  <option value="OTHER">Other / USB / Physical</option>
                </select>
              </div>

              {/* Suspected Source */}
              <div>
                <label className="block text-xs font-mono text-defence-muted uppercase tracking-wider mb-1.5">
                  Suspected Source (Phone / Email / URL / Handle)
                </label>
                <input
                  type="text"
                  name="suspectedSource"
                  value={formData.suspectedSource}
                  onChange={handleInputChange}
                  placeholder="e.g. +91 94002 11984 or http://fake-link.com"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Location */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-mono text-defence-muted uppercase tracking-wider mb-1.5">
                  Incident Geographic Location / Military Station
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g. Northern Command HQ / Pune Cantonment"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Financial Loss Section */}
              <div className="sm:col-span-2 p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="financialLoss"
                    checked={formData.financialLoss}
                    onChange={handleInputChange}
                    className="rounded bg-slate-950 border-slate-700 text-rose-500 focus:ring-rose-500/20"
                  />
                  <span className="text-xs font-semibold text-white">
                    Did this incident involve financial fraud or unauthorized money deduction?
                  </span>
                </label>

                {formData.financialLoss && (
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">Loss Amount</label>
                      <input
                        type="number"
                        name="lossAmount"
                        value={formData.lossAmount}
                        onChange={handleInputChange}
                        placeholder="e.g. 25000"
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-rose-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">Currency</label>
                      <select
                        name="currency"
                        value={formData.currency}
                        onChange={handleInputChange}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-rose-500"
                      >
                        <option value="INR">INR (₹)</option>
                        <option value="USD">USD ($)</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-mono text-defence-muted uppercase tracking-wider mb-1.5">
                  Detailed Incident Narrative & Context *
                </label>
                <textarea
                  required
                  rows={4}
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Explain exactly what happened, what message was received, what actions were taken, and any demands made by the suspect..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-cyan-500 leading-relaxed"
                />
              </div>

            </div>

            <div className="flex justify-end pt-4 border-t border-slate-800">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow-glow-cyan flex items-center gap-2 transition"
              >
                Proceed to Evidence Vault
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* STEP 2: Evidence Vault with SHA-256 Hashing */}
      {!submissionResult && step === 2 && (
        <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-cyan-400" />
              Step 2: Digital Evidence Upload & Blockchain Anchor (SRD §22)
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Upload screenshots, audio recordings, email headers, call logs, or suspicious APK files. Each item is hashed with SHA-256 in real-time.
            </p>
          </div>

          {/* Upload Dropzone */}
          <div className="border-2 border-dashed border-slate-700 hover:border-cyan-500/60 rounded-2xl p-8 text-center bg-slate-900/40 transition-colors">
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              id="evidence-file-input"
            />
            <label htmlFor="evidence-file-input" className="cursor-pointer flex flex-col items-center space-y-3">
              <div className="p-4 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-800 shadow-glow-cyan">
                <UploadCloud className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Click or drag files to upload as Evidence</p>
                <p className="text-xs text-slate-400 mt-1">
                  Supported formats: Screenshots (PNG/JPG), Audio recordings (MP3/WAV), PDFs, Call logs, Suspicious files
                </p>
              </div>
              <span className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-cyan-300 border border-slate-700">
                Browse Files
              </span>
            </label>
          </div>

          {isHashing && (
            <div className="p-3 rounded-xl bg-cyan-950/80 border border-cyan-800 text-cyan-300 text-xs flex items-center gap-2 font-mono">
              <div className="w-3.5 h-3.5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
              <span>Computing SHA-256 cryptographic digest via Web Crypto API...</span>
            </div>
          )}

          {/* List of uploaded evidences with SHA-256 and Blockchain status */}
          {evidences.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                Anchored Evidence Items ({evidences.length})
              </h3>
              <div className="space-y-2">
                {evidences.map((ev) => (
                  <div key={ev._id} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white truncate max-w-xs">{ev.fileName}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                          {ev.fileType} • {(ev.fileSize / 1024).toFixed(1)} KB
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                          AES-256-GCM
                        </span>
                      </div>
                      <div className="font-mono text-[10px] text-slate-400 truncate max-w-md">
                        SHA-256: <span className="text-cyan-300">{ev.sha256Hash}</span>
                      </div>
                      <div className="font-mono text-[9px] text-slate-500">
                        Blockchain Tx: {ev.blockchain?.transactionId?.substring(0, 24)}... (Block #{ev.blockchain?.blockNumber})
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeEvidence(ev._id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <button
              type="button"
              disabled={isEvaluating}
              onClick={handleProceedToReview}
              className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow-glow-cyan flex items-center gap-2 transition disabled:opacity-50"
            >
              {isEvaluating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Running AI Threat Engine...
                </>
              ) : (
                <>
                  Proceed to AI Review & Risk Score
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: AI Threat Classification & Final Confirmation */}
      {!submissionResult && step === 3 && (
        <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              Step 3: AI Threat Assessment & Final Submission
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Review automated AI classification, priority calculation, and submit to CERT-Army triage queue.
            </p>
          </div>

          {/* AI Analysis Card (SRD Section 31) */}
          {aiPreview && (
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-cyan-500/40 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-cyan-400" />
                  <span className="font-bold text-white text-sm">Automated AI Threat Assessment</span>
                </div>
                <div className="flex items-center gap-2">
                  <SeverityBadge severity={aiPreview.calculatedSeverity} />
                  <PriorityBadge priority={aiPreview.calculatedPriority} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Predicted Category:</span>
                  <span className="text-base font-bold text-cyan-300">{aiPreview.prediction.label}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Threat Risk Score:</span>
                  <span className={`text-base font-bold ${
                    aiPreview.prediction.riskScore >= 80 ? 'text-red-400' : 'text-amber-400'
                  }`}>
                    {aiPreview.prediction.riskScore} / 100
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">ML Confidence:</span>
                  <span className="text-base font-bold text-emerald-400">
                    {(aiPreview.prediction.confidence * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="text-xs space-y-2">
                <p className="text-slate-300">
                  <strong className="text-white">CERT Recommendation:</strong> {aiPreview.recommendation}
                </p>
                {aiPreview.indicators?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {aiPreview.indicators.map((ind, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-slate-950 text-[11px] font-mono text-cyan-400 border border-slate-800">
                        ✓ {ind}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Summary of Incident */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs">
            <h3 className="font-mono uppercase font-bold text-slate-400 text-[11px]">Submission Summary:</h3>
            <p><strong>Title:</strong> {formData.title}</p>
            <p><strong>Type:</strong> {formData.incidentType} | <strong>Channel:</strong> {formData.channel}</p>
            <p><strong>Date & Station:</strong> {formData.incidentDate} at {formData.incidentTime} ({formData.location})</p>
            <p><strong>Evidence Items:</strong> {evidences.length} files attached with SHA-256 integrity hashes</p>
          </div>

          {!isOnline && (
            <div className="p-3 rounded-xl bg-amber-950/80 border border-amber-800 text-amber-300 text-xs flex items-center gap-2 font-mono">
              <WifiOff className="w-4 h-4 shrink-0 text-amber-400" />
              <span>
                <strong>Offline Connectivity:</strong> This report will be encrypted and saved in your browser's IndexedDB and dispatched once online.
              </span>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmitFinal}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-glow-red flex items-center gap-2 transition disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting Report...
                </>
              ) : (
                <>
                  <ShieldAlert className="w-4 h-4" />
                  Confirm & Submit Incident to CERT-Army
                </>
              )}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
