import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  Cpu, 
  Users, 
  ShieldCheck, 
  Activity, 
  Database, 
  FileText, 
  Lock, 
  CheckCircle2, 
  AlertTriangle,
  Layers,
  Terminal,
  Zap,
  Award
} from 'lucide-react';
import { api } from '../services/api';
import { MOCK_USERS, MOCK_ML_METRICS } from '../services/mockData';
import { SeverityBadge, PriorityBadge } from '../components/common/Badge';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('ml-health');
  const [mlMetrics, setMlMetrics] = useState(MOCK_ML_METRICS);
  const [auditLogs, setAuditLogs] = useState([]);
  const [threatIntel, setThreatIntel] = useState([]);
  const [usersList, setUsersList] = useState(MOCK_USERS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdminData() {
      try {
        const [logsRes, intelRes] = await Promise.all([
          api.intelligence.getAuditLogs(),
          api.intelligence.getAll()
        ]);
        if (logsRes.success) setAuditLogs(logsRes.data);
        if (intelRes.success) setThreatIntel(intelRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadAdminData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="glass-panel-glow rounded-3xl p-6 sm:p-7 border border-red-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-red-400 text-[10px] font-mono font-bold uppercase tracking-widest mb-1.5">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
              Defence Cyber Agency (DCA) Command Console
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-black text-white tracking-wide uppercase">
              System Administration & Threat Intel Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Append-only audit logs, neural network model telemetry, multi-branch threat blacklists, and role-based clearance access.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 p-1.5 bg-slate-950/80 border border-slate-800 rounded-2xl text-xs">
            {[
              { id: 'ml-health', label: 'ML Telemetry', icon: Cpu },
              { id: 'audit-logs', label: 'Audit Log Ledger', icon: Terminal },
              { id: 'threat-intel', label: 'Threat Intel Feed', icon: Activity },
              { id: 'users', label: 'User & RBAC', icon: Users }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all ${
                    isActive ? 'bg-red-500 text-slate-950 font-bold shadow-glow-neon' : 'text-slate-400 hover:text-red-300'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* TAB 1: ML Model Health & Telemetry */}
      {activeTab === 'ml-health' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Top Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-5 rounded-3xl glass-card border border-red-500/20">
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Accuracy</span>
              <p className="text-2xl sm:text-3xl font-display font-bold text-red-400 mt-1">{mlMetrics.overallAccuracy}%</p>
              <span className="text-[10px] text-slate-500 font-mono mt-1 block">F1 Score: {mlMetrics.f1Score}%</span>
            </div>

            <div className="p-5 rounded-3xl glass-card border border-red-500/20">
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Precision</span>
              <p className="text-2xl sm:text-3xl font-display font-bold text-red-300 mt-1">{mlMetrics.precision}%</p>
              <span className="text-[10px] text-slate-500 font-mono mt-1 block">True Positives</span>
            </div>

            <div className="p-5 rounded-3xl glass-card border border-red-500/20">
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Recall (Sensitivity)</span>
              <p className="text-2xl sm:text-3xl font-display font-bold text-amber-400 mt-1">{mlMetrics.recall}%</p>
              <span className="text-[10px] text-slate-500 font-mono mt-1 block">Zero False Negatives</span>
            </div>

            <div className="p-5 rounded-3xl glass-card border border-red-500/20">
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Inference Latency</span>
              <p className="text-2xl sm:text-3xl font-display font-bold text-cyan-400 mt-1">{mlMetrics.averageInferenceLatencyMs} ms</p>
              <span className="text-[10px] text-slate-500 font-mono mt-1 block">P99 SLA &lt; 500ms</span>
            </div>

            <div className="p-5 rounded-3xl glass-card border border-red-500/20 col-span-2 lg:col-span-1">
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Threats Neutralized</span>
              <p className="text-2xl sm:text-3xl font-display font-bold text-red-400 mt-1 text-glow-red">{mlMetrics.threatsNeutralized}</p>
              <span className="text-[10px] text-slate-500 font-mono mt-1 block">From {mlMetrics.totalScansProcessed} Scans</span>
            </div>
          </div>

          {/* Model Architecture & Integration Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Architecture Pipeline Map */}
            <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-slate-800 space-y-4">
              <h3 className="text-xs sm:text-sm font-display font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Cpu className="w-4 h-4 text-red-400" />
                Decoupled ML Pipeline Architecture
              </h3>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 font-mono text-xs space-y-2.5">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-red-400">1. Client / React PWA</span>
                  <span className="text-slate-500">Incident Form & Evidence</span>
                </div>
                <div className="text-center text-slate-600">↓ HTTPS Gateway</div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-blue-400">2. Node.js Express Gateway</span>
                  <span className="text-slate-500">JSON Contract Validation</span>
                </div>
                <div className="text-center text-slate-600">↓ REST Contract Service</div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-red-950/60 border border-red-500/40">
                  <span className="text-red-300 font-bold">3. Python FastAPI ML Service</span>
                  <span className="text-red-400">v{mlMetrics.modelVersion}</span>
                </div>
                <div className="text-center text-slate-600">↓ Prediction + Probabilities</div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-amber-400">4. Priority Engine & MongoDB</span>
                  <span className="text-slate-500">P1-P4 + Blockchain Hash</span>
                </div>
              </div>
            </div>

            {/* Confusion Matrix */}
            <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-slate-800 space-y-4">
              <h3 className="text-xs sm:text-sm font-display font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-red-400" />
                Threat Classifier Confusion Matrix
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="text-[10px] text-slate-500 uppercase border-b border-slate-800">
                    <tr>
                      <th className="pb-2.5">Actual \ Pred</th>
                      <th className="pb-2.5 text-center text-red-400">Phishing</th>
                      <th className="pb-2.5 text-center text-amber-400">Malware</th>
                      <th className="pb-2.5 text-center text-slate-400">Spam</th>
                      <th className="pb-2.5 text-center text-red-400">Espionage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {mlMetrics.confusionMatrix.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-900/50">
                        <td className="py-2.5 text-white font-bold">{row.actual}</td>
                        <td className="py-2.5 text-center">{row.predicted.Phishing}</td>
                        <td className="py-2.5 text-center">{row.predicted.Malware}</td>
                        <td className="py-2.5 text-center">{row.predicted.Spam}</td>
                        <td className="py-2.5 text-center font-bold text-red-400">{row.predicted.Espionage}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                Trained on defence-specific corpus with zero-trust validation for high-urgency OPSEC and credential harvesting attempts.
              </p>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: Immutable Audit Logs */}
      {activeTab === 'audit-logs' && (
        <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-slate-800 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div>
              <h3 className="text-base font-display font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Terminal className="w-4 h-4 text-red-400" />
                Immutable System Audit Log Ledger
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Every sensitive action, authentication token, evidence download, and case modification is cryptographically signed.
              </p>
            </div>
            <span className="text-xs font-mono text-red-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Append-Only Ledger
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="text-[10px] text-slate-500 uppercase border-b border-slate-800">
                <tr>
                  <th className="pb-3">Timestamp</th>
                  <th className="pb-3">Actor</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3">Action</th>
                  <th className="pb-3">Resource</th>
                  <th className="pb-3">IP & Origin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {auditLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-900/60">
                    <td className="py-3 text-slate-400 text-[11px] whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 text-white font-bold">
                      {log.actorName}
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full bg-slate-900 text-[10px] text-red-300 border border-red-500/30">
                        {log.actorRole}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="text-amber-400 font-bold">{log.action}</span>
                    </td>
                    <td className="py-3 text-slate-300">
                      {log.resourceType} : <span className="text-red-400">{log.resourceId}</span>
                    </td>
                    <td className="py-3 text-slate-500 text-[10px] truncate max-w-[150px]">
                      {log.ipAddress}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Threat Intelligence Indicators */}
      {activeTab === 'threat-intel' && (
        <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-slate-800 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div>
              <h3 className="text-base font-display font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-red-400" />
                Active Defence Threat Intelligence Registry
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Shared Indicators of Compromise (IOCs) across Army, Navy, and Air Force command networks.
              </p>
            </div>
            <button className="pill-glass px-4 py-2 text-xs font-mono text-red-300 hover:text-white flex items-center gap-1.5 transition">
              + Add Indicator
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="text-[10px] text-slate-500 uppercase border-b border-slate-800">
                <tr>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Indicator Value</th>
                  <th className="pb-3">Classification</th>
                  <th className="pb-3">Risk Score</th>
                  <th className="pb-3">Source</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {threatIntel.map(ti => (
                  <tr key={ti._id} className="hover:bg-slate-900/60">
                    <td className="py-3 font-bold text-red-400">{ti.indicatorType}</td>
                    <td className="py-3 text-white truncate max-w-xs">{ti.indicatorValue}</td>
                    <td className="py-3 text-amber-300">{ti.classification}</td>
                    <td className="py-3 font-bold text-red-400">{ti.riskScore}/100</td>
                    <td className="py-3 text-slate-400 text-[11px]">{ti.source}</td>
                    <td className="py-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-red-950 text-red-400 border border-red-500/40 text-[10px] font-bold">
                        BLOCKED
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: User & Role-Based Access Control */}
      {activeTab === 'users' && (
        <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-slate-800 space-y-5 animate-fadeIn">
          <div className="border-b border-slate-800/80 pb-4">
            <h3 className="text-base font-display font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-red-400" />
              Role-Based Access Control & Clearance Management
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Manage Service IDs, operational roles (`USER`, `INVESTIGATOR`, `ADMIN`, `SUPER_ADMIN`), and active permissions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs">
              <span className="text-slate-500 block font-mono text-[10px] uppercase">Total Registered Users</span>
              <span className="text-xl font-display font-bold text-white mt-0.5 block">4,821 Personnel</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs">
              <span className="text-slate-500 block font-mono text-[10px] uppercase">Active Investigators</span>
              <span className="text-xl font-display font-bold text-amber-400 mt-0.5 block">28 CERT Officers</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs">
              <span className="text-slate-500 block font-mono text-[10px] uppercase">HQ Administrators</span>
              <span className="text-xl font-display font-bold text-red-400 mt-0.5 block">6 Security Leads</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[10px] font-mono text-slate-500 uppercase border-b border-slate-800">
                <tr>
                  <th className="pb-3">Personnel / Name</th>
                  <th className="pb-3 font-mono">Service ID</th>
                  <th className="pb-3">Organization & Rank</th>
                  <th className="pb-3">User Category</th>
                  <th className="pb-3">Assigned Role</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {usersList.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-900/60">
                    <td className="py-3 font-semibold text-white">
                      {u.fullName}
                      <span className="block text-[10px] text-slate-500 font-mono mt-0.5">{u.email}</span>
                    </td>
                    <td className="py-3 font-mono font-bold text-red-400">{u.serviceId}</td>
                    <td className="py-3 text-slate-300">
                      {u.rank} • <span className="text-slate-400 text-[11px]">{u.organization}</span>
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full bg-slate-900 text-[10px] font-mono text-slate-400 border border-slate-800">
                        {u.userType}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        u.role === 'ADMIN' ? 'bg-purple-950 text-purple-400 border border-purple-800' : u.role === 'INVESTIGATOR' ? 'bg-amber-950 text-amber-400 border border-amber-800' : 'bg-slate-900 text-red-400 border border-red-500/30'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <span className="text-[10px] font-mono text-red-400 font-bold">ACTIVE</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
