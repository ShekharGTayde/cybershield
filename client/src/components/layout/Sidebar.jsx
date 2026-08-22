import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FilePlus, 
  Search, 
  Binary, 
  BookOpen, 
  ShieldCheck, 
  Sliders, 
  CloudOff, 
  Cpu,
  Layers,
  HelpCircle,
  PhoneCall
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSync } from '../../context/SyncContext';

export function Sidebar() {
  const { user } = useAuth();
  const { pendingCount } = useSync();

  const isInvestigator = user?.role === 'INVESTIGATOR' || user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
      isActive
        ? 'bg-gradient-to-r from-cyan-950/90 to-blue-950/60 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan font-semibold'
        : 'text-defence-muted hover:text-white hover:bg-slate-800/60'
    }`;

  return (
    <aside className="w-64 shrink-0 hidden md:block bg-defence-slate/70 border-r border-defence-border min-h-[calc(100vh-6.5rem)] p-4">
      <div className="space-y-6">
        
        {/* User Portal Section */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
            Defence Services
          </div>
          <nav className="space-y-1">
            <NavLink to="/dashboard" className={navClass}>
              <LayoutDashboard className="w-4 h-4 text-cyan-400" />
              <span>Dashboard Overview</span>
            </NavLink>
            <NavLink to="/report" className={navClass}>
              <FilePlus className="w-4 h-4 text-emerald-400" />
              <span>Report Cyber Fraud</span>
            </NavLink>
            <NavLink to="/track" className={navClass}>
              <Search className="w-4 h-4 text-amber-400" />
              <span>Track Complaint</span>
            </NavLink>
            <NavLink to="/analyze" className={navClass}>
              <Cpu className="w-4 h-4 text-purple-400" />
              <span>AI Threat Scanner</span>
            </NavLink>
            <NavLink to="/awareness" className={navClass}>
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span>OPSEC & Awareness</span>
            </NavLink>
          </nav>
        </div>

        {/* Tactical / Offline Operations */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
            Tactical & Offline
          </div>
          <nav className="space-y-1">
            <NavLink to="/sync" className={navClass}>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <CloudOff className="w-4 h-4 text-rose-400" />
                  <span>Offline Sync Queue</span>
                </div>
                {pendingCount > 0 && (
                  <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-amber-500 text-slate-950 font-bold">
                    {pendingCount}
                  </span>
                )}
              </div>
            </NavLink>
          </nav>
        </div>

        {/* CERT-Army Investigator Section */}
        {isInvestigator && (
          <div>
            <div className="px-3 mb-2 text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1">
              <span>CERT-Army Wing</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
            </div>
            <nav className="space-y-1">
              <NavLink to="/investigator" className={navClass}>
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Case Queue & Triage</span>
              </NavLink>
            </nav>
          </div>
        )}

        {/* DCA / HQ Admin Section */}
        {isAdmin && (
          <div>
            <div className="px-3 mb-2 text-[10px] font-mono uppercase tracking-wider text-purple-400 font-bold">
              HQ Administration
            </div>
            <nav className="space-y-1">
              <NavLink to="/admin" className={navClass}>
                <Sliders className="w-4 h-4 text-purple-400" />
                <span>Admin & ML Health</span>
              </NavLink>
            </nav>
          </div>
        )}

        {/* Emergency Assistance Box */}
        <div className="pt-4 border-t border-slate-800">
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs mb-1">
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Defence Cyber SOS</span>
            </div>
            <p className="text-[11px] text-slate-400 mb-2">
              Immediate triage for espionage or ransomware incidents:
            </p>
            <div className="font-mono text-xs text-white font-bold bg-slate-800 p-1.5 rounded text-center border border-slate-700">
              1930 / 011-26701700
            </div>
          </div>
        </div>

      </div>
    </aside>
  );
}
