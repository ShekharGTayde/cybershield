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
  AlertTriangle, 
  ArrowRight,
  FileText,
  ShieldCheck,
  CreditCard,
  Lock,
  ArrowUpRight,
  LifeBuoy,
  PhoneCall
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

  const isInvestigator = user?.role === 'INVESTIGATOR' || user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  const myReports = incidents.filter(i => {
    if (!user?._id) return true;
    const itemUserId = i.userId?._id ? i.userId._id.toString() : i.userId?.toString();
    const currentUserId = user._id?.toString();
    return itemUserId === currentUserId || (isInvestigator && incidents.length <= 4);
  });

  // Calculate personal metrics for the reporter
  const totalReportsCount = myReports.length;
  const activeCasesCount = myReports.filter(i => ['SUBMITTED', 'RECEIVED', 'AI_ANALYSIS', 'UNDER_REVIEW', 'ASSIGNED', 'UNDER_INVESTIGATION', 'ESCALATED'].includes(i.status)).length;
  const resolvedCount = myReports.filter(i => ['RESOLVED', 'CLOSED'].includes(i.status)).length;
  
  // Compute total disputed financial funds reported
  const totalDisputedAmount = myReports
    .filter(i => i.financialLoss)
    .reduce((sum, item) => sum + (Number(item.lossAmount) || 0), 0);

  // Latest active case for spotlight
  const activeCase = myReports.find(i => ['UNDER_INVESTIGATION', 'ESCALATED', 'ASSIGNED', 'UNDER_REVIEW', 'SUBMITTED'].includes(i.status)) || myReports[0];

  return (
    <div className="space-y-6">
      
      {/* Investigator Quick Redirect Banner (Only shown if officer is viewing user portal) */}
      {isInvestigator && (
        <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-amber-300">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Investigator Notice:</strong> You are viewing the Citizen Reporting view. Access your master triage workbench here:
            </span>
          </div>
          <Link
            to="/investigator"
            className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-medium flex items-center gap-1.5 shrink-0 transition"
          >
            <span>Open Forensic Case Queue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Humanized Welcome Banner */}
      <div className="glass-panel-glow rounded-2xl p-6 sm:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-sky-400">
              Citizen Grievance & Cyber Security Desk
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] font-mono border border-slate-700">
              {user?.organization || 'Indian Armed Forces'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Welcome, {user?.fullName || 'User'}
          </h1>
          <p className="text-xs text-slate-300">
            Service ID / Ref: <span className="font-mono text-sky-300 font-semibold">{user?.serviceId}</span>
            {user?.rank && <> • Designation: <span className="text-white">{user?.rank}</span></>}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <Link
            to="/report"
            className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-semibold text-xs shadow-sm flex items-center justify-center gap-2 transition"
          >
            <ShieldAlert className="w-4 h-4" />
            Report New Scam / Fraud
          </Link>
          <Link
            to="/track"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700/80 flex items-center justify-center gap-1.5 transition"
          >
            <Search className="w-4 h-4 text-sky-400" />
            Track Case ID
          </Link>
        </div>
      </div>

      {/* Citizen Personal Case Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-2xl glass-card border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">My Filed Reports</span>
            <FileText className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-2xl font-bold text-white">{totalReportsCount}</p>
          <span className="text-[11px] text-slate-400">Submitted by your account</span>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Active Investigations</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-300">{activeCasesCount}</p>
          <span className="text-[11px] text-slate-400">Assigned to Cyber Cell</span>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Resolved Cases</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-300">{resolvedCount}</p>
          <span className="text-[11px] text-slate-400">Action taken & closed</span>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Disputed Funds Tracked</span>
            <CreditCard className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100">
            {totalDisputedAmount > 0 ? `₹${totalDisputedAmount.toLocaleString('en-IN')}` : 'Nil'}
          </p>
          <span className="text-[11px] text-slate-400">Under bank lien / freeze</span>
        </div>

      </div>

      {/* Active Case Highlight Spotlight */}
      {activeCase && (
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
              <h2 className="text-sm font-bold text-white">
                Active Case Progress: <span className="font-mono text-sky-400">{activeCase.complaintId}</span>
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={activeCase.status} />
              <Link
                to={`/track?id=${activeCase.complaintId}`}
                className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium"
              >
                View Full Timeline <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-white">{activeCase.title}</h3>
            <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
              {activeCase.description}
            </p>
          </div>

          {/* Officer Latest Update Note */}
          {activeCase.officerNotes?.length > 0 && (
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span className="font-semibold text-amber-300">
                  Officer Action Update ({activeCase.officerNotes[0].author}):
                </span>
                <span>{activeCase.officerNotes[0].date}</span>
              </div>
              <p className="text-slate-200">{activeCase.officerNotes[0].text}</p>
            </div>
          )}

          {/* Quick Progress Bar for Citizen */}
          <div className="pt-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
              <span>Report Lodged</span>
              <span>Cyber Cell Triage</span>
              <span>Officer Assigned</span>
              <span>Recovery & Neutralized</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full"
                style={{
                  width: activeCase.status === 'RESOLVED' ? '100%' :
                         activeCase.status === 'UNDER_INVESTIGATION' ? '70%' :
                         activeCase.status === 'ASSIGNED' ? '50%' : '25%'
                }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Citizen Protection Tools */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            Quick Self-Protection Tools
          </h2>
          <span className="text-xs text-slate-400">Instant verification before you click</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          
          <Link
            to="/report"
            className="p-4 rounded-xl glass-card border border-slate-800 hover:border-red-500/40 hover:bg-slate-800/60 transition flex flex-col items-center text-center space-y-2 group"
          >
            <div className="p-2.5 rounded-lg bg-red-950/70 text-red-400 group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-white">Report Scam</span>
            <span className="text-[10px] text-slate-400">Step-by-step grievance</span>
          </Link>

          <Link
            to="/analyze?tab=url"
            className="p-4 rounded-xl glass-card border border-slate-800 hover:border-sky-500/40 hover:bg-slate-800/60 transition flex flex-col items-center text-center space-y-2 group"
          >
            <div className="p-2.5 rounded-lg bg-sky-950/70 text-sky-400 group-hover:scale-105 transition-transform">
              <Globe className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-white">Check URL</span>
            <span className="text-[10px] text-slate-400">Verify suspicious links</span>
          </Link>

          <Link
            to="/analyze?tab=phone"
            className="p-4 rounded-xl glass-card border border-slate-800 hover:border-amber-500/40 hover:bg-slate-800/60 transition flex flex-col items-center text-center space-y-2 group"
          >
            <div className="p-2.5 rounded-lg bg-amber-950/70 text-amber-400 group-hover:scale-105 transition-transform">
              <Phone className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-white">Check Number</span>
            <span className="text-[10px] text-slate-400">Defence spam registry</span>
          </Link>

          <Link
            to="/analyze?tab=email"
            className="p-4 rounded-xl glass-card border border-slate-800 hover:border-purple-500/40 hover:bg-slate-800/60 transition flex flex-col items-center text-center space-y-2 group"
          >
            <div className="p-2.5 rounded-lg bg-purple-950/70 text-purple-400 group-hover:scale-105 transition-transform">
              <Mail className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-white">Check Email</span>
            <span className="text-[10px] text-slate-400">Sender spoofing analysis</span>
          </Link>

          <Link
            to="/track"
            className="p-4 rounded-xl glass-card border border-slate-800 hover:border-blue-500/40 hover:bg-slate-800/60 transition flex flex-col items-center text-center space-y-2 group"
          >
            <div className="p-2.5 rounded-lg bg-blue-950/70 text-blue-400 group-hover:scale-105 transition-transform">
              <Search className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-white">Track Case</span>
            <span className="text-[10px] text-slate-400">Live complaint status</span>
          </Link>

          <Link
            to="/awareness"
            className="p-4 rounded-xl glass-card border border-slate-800 hover:border-teal-500/40 hover:bg-slate-800/60 transition flex flex-col items-center text-center space-y-2 group"
          >
            <div className="p-2.5 rounded-lg bg-teal-950/70 text-teal-400 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-white">Safety Guides</span>
            <span className="text-[10px] text-slate-400">OPSEC & prevention</span>
          </Link>

        </div>
      </div>

      {/* Split View: My Filed Complaints & Emergency Advisory Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* My Filed Complaints Table (2 Cols) */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-sky-400" />
              My Registered Grievances & Cases
            </h2>
            <Link to="/track" className="text-xs text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1">
              Search by ID <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {myReports.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs space-y-3">
              <ShieldCheck className="w-8 h-8 text-slate-500 mx-auto" />
              <p>You have not lodged any cyber fraud complaints yet.</p>
              <Link
                to="/report"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 text-white text-xs"
              >
                Report an incident now
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-[11px] font-mono text-slate-400 uppercase border-b border-slate-800">
                  <tr>
                    <th className="pb-2.5">Case Reference</th>
                    <th className="pb-2.5">Threat Type</th>
                    <th className="pb-2.5">Status</th>
                    <th className="pb-2.5">Severity</th>
                    <th className="pb-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {myReports.map((inc) => (
                    <tr key={inc._id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 font-mono font-medium text-sky-300">
                        {inc.complaintId}
                        <span className="block text-[10px] text-slate-400 font-normal font-sans">{inc.incidentDate}</span>
                      </td>
                      <td className="py-3">
                        <div className="font-medium text-white truncate max-w-[220px]">{inc.title}</div>
                        <span className="text-[10px] text-slate-400">{inc.incidentType}</span>
                      </td>
                      <td className="py-3">
                        <StatusBadge status={inc.status} />
                      </td>
                      <td className="py-3">
                        <SeverityBadge severity={inc.severity} />
                      </td>
                      <td className="py-3 text-right">
                        <Link
                          to={`/track?id=${inc.complaintId}`}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 text-xs transition font-medium"
                        >
                          Track
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Actionable Safety Checklist & Advisory (1 Col) */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Safety Action Checklist
            </h2>
          </div>

          {/* Step-by-step checklist */}
          <div className="space-y-2.5 text-xs text-slate-300">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-white font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>1. Freeze Compromised Accounts</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Call helpline 1930 immediately to put an inter-bank lien on fraudulent UPI transfers.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-white font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>2. Secure Defence Credentials</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Reset your SPARSH portal password and enable two-factor authentication.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-white font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>3. Preserve Digital Evidence</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Keep SMS receipts, call recordings, and APK files intact for forensic hash submission.
              </p>
            </div>
          </div>

          <Link
            to="/awareness"
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 text-xs flex items-center justify-center gap-1.5 border border-slate-700/80 transition font-medium"
          >
            <BookOpen className="w-3.5 h-3.5" /> Read All Prevention Guides
          </Link>
        </div>

      </div>

    </div>
  );
}
