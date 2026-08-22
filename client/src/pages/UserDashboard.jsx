import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldAlert, 
  Search, 
  Globe, 
  Mail, 
  Phone, 
  UploadCloud, 
  BookOpen, 
  Activity, 
  CheckCircle2, 
  Clock, 
  AlertOctagon, 
  AlertTriangle, 
  ArrowRight,
  TrendingUp,
  FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { api } from '../services/api';
import { StatusBadge, SeverityBadge, PriorityBadge } from '../components/common/Badge';

export function UserDashboard() {
  const { user } = useAuth();
  const { notifications } = useNotifications();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.incidents.getAll();
        if (res.success) {
          setIncidents(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Compute metrics specified in SRD Section 8
  const totalReports = incidents.length;
  const openCases = incidents.filter(i => ['SUBMITTED', 'RECEIVED', 'AI_ANALYSIS', 'UNDER_REVIEW'].includes(i.status)).length;
  const underInvestigation = incidents.filter(i => ['ASSIGNED', 'UNDER_INVESTIGATION', 'ESCALATED'].includes(i.status)).length;
  const resolvedCases = incidents.filter(i => ['RESOLVED', 'CLOSED'].includes(i.status)).length;
  const criticalAlerts = incidents.filter(i => i.severity === 'CRITICAL').length;

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="glass-panel-glow rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-cyan-500/30">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
              Defence Incident Command Center
            </span>
            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 text-[10px] font-mono border border-cyan-800">
              {user?.organization || 'HQ Command'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Jai Hind, {user?.fullName || 'Personnel'}
          </h1>
          <p className="text-xs text-slate-300">
            Service ID: <span className="font-mono text-cyan-400 font-bold">{user?.serviceId}</span> | Rank: <span className="text-white">{user?.rank}</span>
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Link
            to="/report"
            className="flex-1 md:flex-initial px-5 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-semibold text-xs shadow-glow-red flex items-center justify-center gap-2 transition"
          >
            <ShieldAlert className="w-4 h-4" />
            Report New Cyber Fraud
          </Link>
          <Link
            to="/track"
            className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center justify-center gap-1.5 transition"
          >
            <Search className="w-4 h-4 text-cyan-400" />
            Track Case
          </Link>
        </div>
      </div>

      {/* Metrics Row (SRD Section 8) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-4 rounded-2xl glass-card border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono">Total Reports</span>
            <FileText className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-mono font-bold text-white">{totalReports}</p>
          <span className="text-[10px] text-slate-500">All registered incidents</span>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono">Open Cases</span>
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-mono font-bold text-indigo-300">{openCases}</p>
          <span className="text-[10px] text-slate-500">Awaiting triage / review</span>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono">Under Investigation</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-mono font-bold text-amber-300">{underInvestigation}</p>
          <span className="text-[10px] text-slate-500">Active CERT-Army forensic cases</span>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono">Resolved Cases</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-mono font-bold text-emerald-300">{resolvedCases}</p>
          <span className="text-[10px] text-slate-500">Threat neutralized / closed</span>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-red-900/30 bg-red-950/20 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-red-400 mb-2">
            <span className="text-xs font-mono font-bold">Critical Alerts</span>
            <AlertOctagon className="w-4 h-4 text-red-400 animate-pulse" />
          </div>
          <p className="text-2xl font-mono font-bold text-red-400 text-glow-red">{criticalAlerts}</p>
          <span className="text-[10px] text-red-300/70">P1 High-Risk Incidents</span>
        </div>
      </div>

      {/* Quick Actions Grid (SRD Section 8) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white tracking-wide uppercase font-mono flex items-center gap-2">
            <span className="w-2 h-2 rounded bg-cyan-400"></span>
            Quick Action Tools (SRD §8)
          </h2>
          <span className="text-xs text-slate-400 font-mono">Instant Defence Threat Defense</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          
          <Link
            to="/report"
            className="p-4 rounded-xl glass-card border border-slate-800 hover:border-red-500/50 hover:bg-red-950/20 transition flex flex-col items-center text-center space-y-2 group"
          >
            <div className="p-2.5 rounded-lg bg-red-950/80 text-red-400 group-hover:scale-110 transition-transform">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-white">Report Fraud</span>
            <span className="text-[10px] text-slate-400">Multi-step wizard</span>
          </Link>

          <Link
            to="/analyze?tab=url"
            className="p-4 rounded-xl glass-card border border-slate-800 hover:border-cyan-500/50 hover:bg-cyan-950/20 transition flex flex-col items-center text-center space-y-2 group"
          >
            <div className="p-2.5 rounded-lg bg-cyan-950/80 text-cyan-400 group-hover:scale-110 transition-transform">
              <Globe className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-white">Check URL</span>
            <span className="text-[10px] text-slate-400">Phishing link scanner</span>
          </Link>

          <Link
            to="/analyze?tab=email"
            className="p-4 rounded-xl glass-card border border-slate-800 hover:border-purple-500/50 hover:bg-purple-950/20 transition flex flex-col items-center text-center space-y-2 group"
          >
            <div className="p-2.5 rounded-lg bg-purple-950/80 text-purple-400 group-hover:scale-110 transition-transform">
              <Mail className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-white">Check Email</span>
            <span className="text-[10px] text-slate-400">Header & body NLP</span>
          </Link>

          <Link
            to="/analyze?tab=phone"
            className="p-4 rounded-xl glass-card border border-slate-800 hover:border-amber-500/50 hover:bg-amber-950/20 transition flex flex-col items-center text-center space-y-2 group"
          >
            <div className="p-2.5 rounded-lg bg-amber-950/80 text-amber-400 group-hover:scale-110 transition-transform">
              <Phone className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-white">Check Number</span>
            <span className="text-[10px] text-slate-400">Spam / scam blacklist</span>
          </Link>

          <Link
            to="/report?step=2"
            className="p-4 rounded-xl glass-card border border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-950/20 transition flex flex-col items-center text-center space-y-2 group"
          >
            <div className="p-2.5 rounded-lg bg-emerald-950/80 text-emerald-400 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-white">Upload Evidence</span>
            <span className="text-[10px] text-slate-400">SHA-256 hash vault</span>
          </Link>

          <Link
            to="/track"
            className="p-4 rounded-xl glass-card border border-slate-800 hover:border-blue-500/50 hover:bg-blue-950/20 transition flex flex-col items-center text-center space-y-2 group"
          >
            <div className="p-2.5 rounded-lg bg-blue-950/80 text-blue-400 group-hover:scale-110 transition-transform">
              <Search className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-white">Track Case</span>
            <span className="text-[10px] text-slate-400">Live investigation status</span>
          </Link>

          <Link
            to="/awareness"
            className="p-4 rounded-xl glass-card border border-slate-800 hover:border-teal-500/50 hover:bg-teal-950/20 transition flex flex-col items-center text-center space-y-2 group col-span-2 sm:col-span-1"
          >
            <div className="p-2.5 rounded-lg bg-teal-950/80 text-teal-400 group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-white">Cyber OPSEC</span>
            <span className="text-[10px] text-slate-400">Defence advisories</span>
          </Link>

        </div>
      </div>

      {/* Main Content Split: Recent Cases & Active Threat Bulletin */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Incidents Table (2 Cols) */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              Recent Incidents & Complaints
            </h2>
            <Link to="/track" className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] font-mono text-slate-400 uppercase border-b border-slate-800">
                <tr>
                  <th className="pb-2">Complaint ID</th>
                  <th className="pb-2">Incident Type</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">Severity</th>
                  <th className="pb-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {incidents.slice(0, 4).map((inc) => (
                  <tr key={inc._id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 font-mono font-bold text-cyan-400">
                      {inc.complaintId}
                      <span className="block text-[10px] text-slate-500 font-normal">{inc.incidentDate}</span>
                    </td>
                    <td className="py-3">
                      <div className="font-semibold text-white truncate max-w-[200px]">{inc.title}</div>
                      <span className="text-[10px] font-mono text-slate-400">{inc.incidentType}</span>
                    </td>
                    <td className="py-3">
                      <StatusBadge status={inc.status} />
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-1.5">
                        <SeverityBadge severity={inc.severity} />
                        <PriorityBadge priority={inc.priority} />
                      </div>
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        to={`/track?id=${inc.complaintId}`}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-mono transition"
                      >
                        Track
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Active Threat Advisories (1 Col) */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Threat Bulletin (CERT-Army)
            </h2>
          </div>

          <div className="space-y-3">
            {notifications.slice(0, 3).map((notif) => (
              <div key={notif._id} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    notif.severity === 'CRITICAL' ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                  }`}>
                    {notif.severity}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {new Date(notif.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white leading-snug">{notif.title}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                  {notif.message}
                </p>
              </div>
            ))}
          </div>

          <Link
            to="/awareness"
            className="w-full py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-cyan-400 text-xs font-mono flex items-center justify-center gap-1.5 border border-slate-700 transition"
          >
            <BookOpen className="w-3.5 h-3.5" /> Read All Prevention Guides
          </Link>
        </div>

      </div>

    </div>
  );
}
