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
    <div className="space-y-8">
      
      {/* Investigator Quick Redirect Banner (Only shown if officer is viewing user portal) */}
      {isInvestigator && (
        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-2.5 text-amber-300 font-mono">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>INVESTIGATOR HUD ACTIVE:</strong> Viewing Citizen Grievance Portal. Access forensic triage workbench:
            </span>
          </div>
          <Link
            to="/investigator"
            className="px-4 py-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-cyber font-bold flex items-center gap-1.5 shrink-0 transition shadow-[0_0_12px_rgba(245,158,11,0.3)]"
          >
            <span>OPEN FORENSIC QUEUE</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Humanized Welcome Banner - Cyber Command Header */}
      <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden border border-red-500/25">
        <div className="pointer-events-none absolute -right-20 -top-20 w-64 h-64 rounded-full bg-[#F20D25]/10 blur-3xl" />
        
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-cyber font-bold tracking-widest uppercase text-[#F20D25] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#F20D25] animate-pulse shadow-[0_0_8px_#F20D25]" />
              CITIZEN CYBER DEFENCE DESK
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-black/60 text-[#869F90] text-[10px] font-mono border border-red-500/20">
              {user?.organization || 'Indian Armed Forces'}
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight uppercase">
            OPERATIONAL DESK // <span className="text-[#F20D25]">{user?.fullName || 'User'}</span>
          </h1>
          <p className="text-xs text-[#869F90] font-mono">
            SERVICE ID: <span className="text-white font-bold">{user?.serviceId}</span>
            {user?.rank && <> • RANK: <span className="text-[#F20D25]">{user?.rank}</span></>}
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3 w-full md:w-auto">
          <Link
            to="/report"
            className="flex-1 md:flex-initial px-5 py-2.5 rounded-full bg-[#F20D25] hover:bg-[#34d399] text-black font-cyber font-bold text-xs shadow-[0_0_20px_rgba(255,38,56,0.35)] flex items-center justify-center gap-2 transition"
          >
            <ShieldAlert className="w-4 h-4" />
            REPORT FRAUD / SCAM ↗
          </Link>
          <Link
            to="/track"
            className="pill-glass px-5 py-2.5 rounded-full text-xs font-cyber tracking-wider flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4 text-[#F20D25]" />
            TRACK CASE ID
          </Link>
        </div>
      </div>

      {/* Citizen Personal Case Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        <div className="p-5 rounded-3xl glass-card border border-red-500/20 bg-gradient-to-b from-[#0C140F] to-[#060907] space-y-2">
          <div className="flex items-center justify-between text-[#869F90]">
            <span className="text-[11px] font-cyber font-bold uppercase tracking-wider">FILED REPORTS</span>
            <FileText className="w-4 h-4 text-[#F20D25]" />
          </div>
          <p className="font-display text-3xl font-extrabold text-white">{totalReportsCount}</p>
          <span className="text-[10px] text-[#869F90] font-mono block">Submitted by your account</span>
        </div>

        <div className="p-5 rounded-3xl glass-card border border-red-500/20 bg-gradient-to-b from-[#0C140F] to-[#060907] space-y-2">
          <div className="flex items-center justify-between text-[#869F90]">
            <span className="text-[11px] font-cyber font-bold uppercase tracking-wider">ACTIVE TRIAGE</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="font-display text-3xl font-extrabold text-amber-300">{activeCasesCount}</p>
          <span className="text-[10px] text-[#869F90] font-mono block">Assigned to Cyber Cell</span>
        </div>

        <div className="p-5 rounded-3xl glass-card border border-red-500/20 bg-gradient-to-b from-[#0C140F] to-[#060907] space-y-2">
          <div className="flex items-center justify-between text-[#869F90]">
            <span className="text-[11px] font-cyber font-bold uppercase tracking-wider">RESOLVED CASES</span>
            <CheckCircle2 className="w-4 h-4 text-[#F20D25]" />
          </div>
          <p className="font-display text-3xl font-extrabold text-[#F20D25] text-glow-neon">{resolvedCount}</p>
          <span className="text-[10px] text-[#869F90] font-mono block">Mitigated & verified</span>
        </div>

        <div className="p-5 rounded-3xl glass-card border border-red-500/20 bg-gradient-to-b from-[#0C140F] to-[#060907] space-y-2">
          <div className="flex items-center justify-between text-[#869F90]">
            <span className="text-[11px] font-cyber font-bold uppercase tracking-wider">DISPUTED FUNDS</span>
            <CreditCard className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="font-display text-2xl sm:text-3xl font-extrabold text-white">
            {totalDisputedAmount > 0 ? `₹${totalDisputedAmount.toLocaleString('en-IN')}` : '₹0'}
          </p>
          <span className="text-[10px] text-[#869F90] font-mono block">Under bank lien / freeze</span>
        </div>

      </div>

      {/* Active Case Highlight Spotlight */}
      {activeCase && (
        <div className="p-6 rounded-3xl glass-panel border border-red-500/25 space-y-5 bg-gradient-to-b from-[#0A120E] to-[#050806] shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-red-500/15">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F20D25] animate-pulse shadow-[0_0_8px_#F20D25]"></span>
              <h2 className="text-sm font-cyber font-bold text-white uppercase tracking-wider">
                ACTIVE CASE SPOTLIGHT // <span className="font-mono text-[#F20D25]">{activeCase.complaintId}</span>
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={activeCase.status} />
              <Link
                to={`/track?id=${activeCase.complaintId}`}
                className="text-xs text-[#F20D25] hover:underline flex items-center gap-1 font-cyber font-bold"
              >
                TIMELINE RADAR <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-bold text-white font-cyber">{activeCase.title}</h3>
            <p className="text-xs text-[#869F90] line-clamp-2 leading-relaxed font-sans">
              {activeCase.description}
            </p>
          </div>

          {/* Officer Latest Update Note */}
          {activeCase.officerNotes?.length > 0 && (
            <div className="p-4 rounded-2xl bg-black/60 border border-red-500/20 text-xs space-y-1 font-mono">
              <div className="flex items-center justify-between text-[#869F90] text-[11px]">
                <span className="font-bold text-amber-300 font-cyber">
                  OFFICER ACTION NOTE ({activeCase.officerNotes[0].author}):
                </span>
                <span>{activeCase.officerNotes[0].date}</span>
              </div>
              <p className="text-slate-200">{activeCase.officerNotes[0].text}</p>
            </div>
          )}

          {/* Quick Progress Bar for Citizen */}
          <div className="pt-2">
            <div className="flex items-center justify-between text-[10px] font-mono text-[#869F90] mb-2 uppercase">
              <span>Report Lodged</span>
              <span>Heuristic Triage</span>
              <span>Officer Assigned</span>
              <span>Mitigated</span>
            </div>
            <div className="w-full h-2 bg-black/80 border border-red-500/20 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-red-500 via-[#F20D25] to-cyan-400 rounded-full shadow-[0_0_10px_#F20D25]"
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
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-display font-bold text-white flex items-center gap-2 uppercase tracking-wide">
            <ShieldCheck className="w-5 h-5 text-[#F20D25]" />
            Active Defence Toolkits
          </h2>
          <span className="text-xs text-[#869F90] font-mono">Instant threat verification</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          
          <Link
            to="/report"
            className="p-4 rounded-2xl glass-card border border-red-500/20 hover:border-[#F20D25] hover:bg-[#F20D25]/05 transition flex flex-col items-center text-center space-y-2 group"
          >
            <div className="p-3 rounded-xl bg-red-950/70 text-red-400 group-hover:scale-105 transition-transform border border-red-500/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <span className="text-xs font-cyber font-bold text-white">REPORT SCAM</span>
            <span className="text-[10px] text-[#869F90] font-mono">Step-by-step audit</span>
          </Link>

          <Link
            to="/analyze?tab=url"
            className="p-4 rounded-2xl glass-card border border-red-500/20 hover:border-[#F20D25] hover:bg-[#F20D25]/05 transition flex flex-col items-center text-center space-y-2 group"
          >
            <div className="p-3 rounded-xl bg-cyan-950/70 text-cyan-400 group-hover:scale-105 transition-transform border border-cyan-500/30">
              <Globe className="w-5 h-5" />
            </div>
            <span className="text-xs font-cyber font-bold text-white">CHECK URL</span>
            <span className="text-[10px] text-[#869F90] font-mono">Phishing detector</span>
          </Link>

          <Link
            to="/analyze?tab=phone"
            className="p-4 rounded-2xl glass-card border border-red-500/20 hover:border-[#F20D25] hover:bg-[#F20D25]/05 transition flex flex-col items-center text-center space-y-2 group"
          >
            <div className="p-3 rounded-xl bg-amber-950/70 text-amber-400 group-hover:scale-105 transition-transform border border-amber-500/30">
              <Phone className="w-5 h-5" />
            </div>
            <span className="text-xs font-cyber font-bold text-white">CHECK NUMBER</span>
            <span className="text-[10px] text-[#869F90] font-mono">Spam & robocalls</span>
          </Link>

          <Link
            to="/analyze?tab=email"
            className="p-4 rounded-2xl glass-card border border-red-500/20 hover:border-[#F20D25] hover:bg-[#F20D25]/05 transition flex flex-col items-center text-center space-y-2 group"
          >
            <div className="p-3 rounded-xl bg-purple-950/70 text-purple-400 group-hover:scale-105 transition-transform border border-purple-500/30">
              <Mail className="w-5 h-5" />
            </div>
            <span className="text-xs font-cyber font-bold text-white">CHECK EMAIL</span>
            <span className="text-[10px] text-[#869F90] font-mono">Header spoofing</span>
          </Link>

          <Link
            to="/track"
            className="p-4 rounded-2xl glass-card border border-red-500/20 hover:border-[#F20D25] hover:bg-[#F20D25]/05 transition flex flex-col items-center text-center space-y-2 group"
          >
            <div className="p-3 rounded-xl bg-red-950/70 text-[#F20D25] group-hover:scale-105 transition-transform border border-red-500/30">
              <Search className="w-5 h-5" />
            </div>
            <span className="text-xs font-cyber font-bold text-white">TRACK CASE</span>
            <span className="text-[10px] text-[#869F90] font-mono">Cryptographic audit</span>
          </Link>

          <Link
            to="/awareness"
            className="p-4 rounded-2xl glass-card border border-red-500/20 hover:border-[#F20D25] hover:bg-[#F20D25]/05 transition flex flex-col items-center text-center space-y-2 group"
          >
            <div className="p-3 rounded-xl bg-teal-950/70 text-teal-400 group-hover:scale-105 transition-transform border border-teal-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-xs font-cyber font-bold text-white">OPSEC GUIDES</span>
            <span className="text-[10px] text-[#869F90] font-mono">Field protocols</span>
          </Link>

        </div>
      </div>

      {/* Split View: My Filed Complaints & Emergency Advisory Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* My Filed Complaints Table (2 Cols) */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 border border-red-500/20 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-red-500/15">
            <h2 className="text-sm font-cyber font-bold text-white flex items-center gap-2 uppercase tracking-wider">
              <Activity className="w-4 h-4 text-[#F20D25]" />
              MY GRIEVANCES & FORENSIC CASES
            </h2>
            <Link to="/track" className="text-xs text-[#F20D25] hover:underline font-cyber font-bold flex items-center gap-1">
              SEARCH BY ID <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {myReports.length === 0 ? (
            <div className="text-center py-12 text-[#869F90] text-xs space-y-3 font-mono">
              <ShieldCheck className="w-10 h-10 text-red-500/40 mx-auto" />
              <p>NO ACTIVE CYBER FRAUD COMPLAINTS LODGED YET</p>
              <Link
                to="/report"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#F20D25] text-black font-cyber font-bold text-xs shadow-[0_0_12px_#F20D25]"
              >
                REPORT AN INCIDENT NOW
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-[11px] font-mono text-[#869F90] uppercase border-b border-red-500/15">
                  <tr>
                    <th className="pb-3">Case Reference</th>
                    <th className="pb-3">Threat Category</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Severity</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-red-500/10">
                  {myReports.map((inc) => (
                    <tr key={inc._id} className="hover:bg-red-500/05 transition">
                      <td className="py-3.5 font-mono font-medium text-[#F20D25]">
                        {inc.complaintId}
                        <span className="block text-[10px] text-[#869F90] font-normal">{inc.incidentDate}</span>
                      </td>
                      <td className="py-3.5">
                        <div className="font-medium text-white truncate max-w-[200px] font-cyber">{inc.title}</div>
                        <span className="text-[10px] text-[#869F90] font-mono">{inc.incidentType}</span>
                      </td>
                      <td className="py-3.5">
                        <StatusBadge status={inc.status} />
                      </td>
                      <td className="py-3.5">
                        <SeverityBadge severity={inc.severity} />
                      </td>
                      <td className="py-3.5 text-right">
                        <Link
                          to={`/track?id=${inc.complaintId}`}
                          className="pill-glass px-3 py-1 text-[11px] font-cyber tracking-wider hover:border-[#F20D25]"
                        >
                          TRACK
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
        <div className="glass-panel rounded-3xl p-6 border border-red-500/20 space-y-4">
          <div className="pb-2 border-b border-red-500/15">
            <h2 className="text-sm font-cyber font-bold text-white flex items-center gap-2 uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              SAFETY ACTION CHECKLIST
            </h2>
          </div>

          {/* Step-by-step checklist */}
          <div className="space-y-3 text-xs text-slate-300">
            <div className="p-3.5 rounded-2xl bg-black/50 border border-red-500/15 space-y-1">
              <div className="flex items-center gap-2 text-white font-cyber font-bold">
                <CheckCircle2 className="w-4 h-4 text-[#F20D25] shrink-0" />
                <span>1. FREEZE COMPROMISED ACCOUNTS</span>
              </div>
              <p className="text-[11px] text-[#869F90] font-sans leading-relaxed">
                Dial 1930 immediately to place an inter-bank lien on fraudulent UPI transfers.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/50 border border-red-500/15 space-y-1">
              <div className="flex items-center gap-2 text-white font-cyber font-bold">
                <CheckCircle2 className="w-4 h-4 text-[#F20D25] shrink-0" />
                <span>2. SECURE DEFENCE LOGINS</span>
              </div>
              <p className="text-[11px] text-[#869F90] font-sans leading-relaxed">
                Reset your SPARSH portal password and enable two-factor OTP authentication.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/50 border border-red-500/15 space-y-1">
              <div className="flex items-center gap-2 text-white font-cyber font-bold">
                <CheckCircle2 className="w-4 h-4 text-[#F20D25] shrink-0" />
                <span>3. PRESERVE DIGITAL EVIDENCE</span>
              </div>
              <p className="text-[11px] text-[#869F90] font-sans leading-relaxed">
                Retain SMS receipts, APK files, and bank statements for cryptographic hash generation.
              </p>
            </div>
          </div>

          <Link
            to="/awareness"
            className="w-full py-2.5 rounded-full bg-black/60 hover:bg-red-500/10 text-[#F20D25] text-xs flex items-center justify-center gap-1.5 border border-red-500/25 transition font-cyber font-bold uppercase tracking-wider"
          >
            <BookOpen className="w-3.5 h-3.5" /> READ ALL OPSEC PROTOCOLS
          </Link>
        </div>

      </div>

    </div>
  );
}
