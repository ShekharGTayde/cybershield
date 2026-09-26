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
      <div className="glass-panel-glow rounded-2xl p-6 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-purple-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
              <Sliders className="w-4 h-4" />
              Defence Cyber Agency (DCA) Command Console
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              System Administration & Threat Intelligence Hub
            </h1>
            <p className="text-xs text-slate-300">
              Audit logging, ML model telemetry, threat blacklists, and role-based access control.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs">
            {[
              { id: 'ml-health', label: 'ML Model Telemetry', icon: Cpu },
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
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                    isActive ? 'bg-purple-600 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-white'
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
            <div className="p-4 rounded-2xl glass-card border border-slate-800">
              <span className="text-xs text-slate-400 font-mono">Accuracy</span>
              <p className="text-2xl font-mono font-bold text-cyan-400">{mlMetrics.overallAccuracy}%</p>
              <span className="text-[10px] text-slate-500 font-mono">Overall F1: {mlMetrics.f1Score}%</span>
            </div>

            <div className="p-4 rounded-2xl glass-card border border-slate-800">
              <span className="text-xs text-slate-400 font-mono">Precision</span>
              <p className="text-2xl font-mono font-bold text-emerald-400">{mlMetrics.precision}%</p>
              <span className="text-[10px] text-slate-500 font-mono">True Positives</span>
            </div>

            <div className="p-4 rounded-2xl glass-card border border-slate-800">
              <span className="text-xs text-slate-400 font-mono">Recall (Sensitivity)</span>
              <p className="text-2xl font-mono font-bold text-amber-400">{mlMetrics.recall}%</p>
              <span className="text-[10px] text-slate-500 font-mono">False Negative Minimization</span>
            </div>

            <div className="p-4 rounded-2xl glass-card border border-slate-800">
              <span className="text-xs text-slate-400 font-mono">Inference Latency</span>
              <p className="text-2xl font-mono font-bold text-purple-400">{mlMetrics.averageInferenceLatencyMs} ms</p>
              <span className="text-[10px] text-slate-500 font-mono">P99 SLA &lt; 500ms</span>
            </div>

            <div className="p-4 rounded-2xl glass-card border border-slate-800 col-span-2 lg:col-span-1">
              <span className="text-xs text-slate-400 font-mono">Total Threats Neutralized</span>
              <p className="text-2xl font-mono font-bold text-rose-400">{mlMetrics.threatsNeutralized}</p>
              <span className="text-[10px] text-slate-500 font-mono">From {mlMetrics.totalScansProcessed} Scans</span>
            </div>
          </div>

          {/* Model Architecture & Integration Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Architecture Pipeline Map */}
            <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                Decoupled ML Pipeline Architecture
              </h3>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs space-y-2.5">
                <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-cyan-400">1. Client / React PWA</span>
                  <span className="text-slate-500">Incident Form & Evidence</span>
                </div>
                <div className="text-center text-slate-600">↓ HTTPS Gateway</div>
                <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-blue-400">2. Node.js Express Gateway</span>
                  <span className="text-slate-500">JSON Contract Validation</span>
                </div>
                <div className="text-center text-slate-600">↓ REST Contract Service</div>
                <div className="flex items-center justify-between p-2 rounded bg-cyan-950/60 border border-cyan-700">
                  <span className="text-cyan-300 font-bold">3. Python FastAPI ML Service</span>
                  <span className="text-emerald-400">v{mlMetrics.modelVersion}</span>
                </div>
                <div className="text-center text-slate-600">↓ Prediction + Probabilities</div>
                <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-amber-400">4. Priority Engine & MongoDB</span>
                  <span className="text-slate-500">P1-P4 + Blockchain Hash</span>
                </div>
              </div>
            </div>

            {/* Confusion Matrix */}
            <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                Threat Classifier Confusion Matrix
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="text-[10px] text-slate-500 uppercase border-b border-slate-800">
                    <tr>
                      <th className="pb-2">Actual \ Pred</th>
                      <th className="pb-2 text-center text-cyan-400">Phishing</th>
                      <th className="pb-2 text-center text-amber-400">Malware</th>
                      <th className="pb-2 text-center text-slate-400">Spam</th>
                      <th className="pb-2 text-center text-rose-400">Espionage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {mlMetrics.confusionMatrix.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-900">
                        <td className="py-2 text-white font-bold">{row.actual}</td>
                        <td className="py-2 text-center">{row.predicted.Phishing}</td>
                        <td className="py-2 text-center">{row.predicted.Malware}</td>
                        <td className="py-2 text-center">{row.predicted.Spam}</td>
                        <td className="py-2 text-center">{row.predicted.Espionage}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="text-[11px] text-slate-400">
                Trained on defence-specific corpus with zero-trust validation for high-urgency OPSEC and credential harvesting attempts.
              </p>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: Immutable Audit Logs */}
      {activeTab === 'audit-logs' && (
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-sky-400" />
                Immutable System Audit Log Ledger
              </h3>
              <p className="text-xs text-slate-400">
                Every sensitive action, login, evidence download, and case modification is cryptographically recorded.
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Append-Only Log Ledger
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="text-[10px] text-slate-500 uppercase border-b border-slate-800">
                <tr>
                  <th className="pb-2">Timestamp</th>
                  <th className="pb-2">Actor</th>
                  <th className="pb-2">Role</th>
                  <th className="pb-2">Action</th>
                  <th className="pb-2">Resource</th>
                  <th className="pb-2">IP & Origin</th>
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
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-sky-300 border border-slate-700">
                        {log.actorRole}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="text-amber-400 font-bold">{log.action}</span>
                    </td>
                    <td className="py-3 text-slate-300">
                      {log.resourceType} : <span className="text-sky-400">{log.resourceId}</span>
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
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-rose-400" />
                Active Defence Threat Intelligence Registry
              </h3>
              <p className="text-xs text-slate-400">
                Shared Indicators of Compromise (IOCs) across Army, Navy, and Air Force command networks.
              </p>
            </div>
            <button className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold">
              + Add Indicator
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="text-[10px] text-slate-500 uppercase border-b border-slate-800">
                <tr>
                  <th className="pb-2">Type</th>
                  <th className="pb-2">Indicator Value</th>
                  <th className="pb-2">Classification</th>
                  <th className="pb-2">Risk Score</th>
                  <th className="pb-2">Source</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {threatIntel.map(ti => (
                  <tr key={ti._id} className="hover:bg-slate-900/60">
                    <td className="py-3 font-bold text-sky-400">{ti.indicatorType}</td>
                    <td className="py-3 text-white truncate max-w-xs">{ti.indicatorValue}</td>
                    <td className="py-3 text-amber-300">{ti.classification}</td>
                    <td className="py-3 font-bold text-rose-400">{ti.riskScore}/100</td>
                    <td className="py-3 text-slate-400 text-[11px]">{ti.source}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px]">
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
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4 animate-fadeIn">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              Role-Based Access Control & User Management
            </h3>
            <p className="text-xs text-slate-400">
              Manage Service IDs, roles (`USER`, `INVESTIGATOR`, `ADMIN`, `SUPER_ADMIN`), and operational clearance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <span className="text-slate-400 block font-mono">Total Registered Users</span>
              <span className="text-xl font-bold text-white">4,821 Personnel</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <span className="text-slate-400 block font-mono">Active Investigators</span>
              <span className="text-xl font-bold text-amber-400">28 CERT Officers</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <span className="text-slate-400 block font-mono">HQ Administrators</span>
              <span className="text-xl font-bold text-purple-400">6 Security Leads</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[10px] font-mono text-slate-500 uppercase border-b border-slate-800">
                <tr>
                  <th className="pb-2">Personnel / Name</th>
                  <th className="pb-2 font-mono">Service ID</th>
                  <th className="pb-2">Organization & Rank</th>
                  <th className="pb-2">User Category</th>
                  <th className="pb-2">Assigned Role</th>
                  <th className="pb-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {usersList.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-900/60">
                    <td className="py-3 font-semibold text-white">
                      {u.fullName}
                      <span className="block text-[10px] text-slate-400 font-mono">{u.email}</span>
                    </td>
                    <td className="py-3 font-mono font-bold text-cyan-400">{u.serviceId}</td>
                    <td className="py-3 text-slate-300">
                      {u.rank} • <span className="text-slate-400 text-[11px]">{u.organization}</span>
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-300">
                        {u.userType}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        u.role === 'ADMIN' ? 'bg-purple-950 text-purple-400 border border-purple-800' : u.role === 'INVESTIGATOR' ? 'bg-amber-950 text-amber-400 border border-amber-800' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <span className="text-[10px] font-mono text-emerald-400">ACTIVE</span>
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
