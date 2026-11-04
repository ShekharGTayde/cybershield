import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FilePlus, 
  Search, 
  BookOpen, 
  ShieldCheck, 
  Sliders, 
  CloudOff, 
  Cpu,
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
    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-[12px] font-medium transition-all cursor-pointer ${
      isActive
        ? 'bg-[#F20D25]/12 text-[#F20D25] border border-[#F20D25]/35 font-semibold shadow-[0_0_15px_rgba(255,38,56,0.15)]'
        : 'text-slate-400 hover:text-white hover:bg-red-500/08 hover:border hover:border-red-500/15'
    }`;

  return (
    <aside className="w-64 shrink-0 hidden md:flex flex-col bg-[#080D0A]/90 backdrop-blur-xl border-r border-red-500/15 min-h-[calc(100vh-6rem)] p-4 gap-6">

      {/* Main Navigation */}
      <div>
        <p className="px-3 mb-2 text-[10px] font-bold tracking-widest uppercase text-[#869F90] font-cyber">
          {isInvestigator ? 'DEFENCE TACTICAL PORTAL' : 'CITIZEN DEFENCE SERVICES'}
        </p>
        <nav className="space-y-1">
          <NavLink to="/dashboard" className={navClass}>
            <LayoutDashboard className="w-4 h-4 shrink-0 text-[#F20D25]" />
            <span>{isInvestigator ? 'Dashboard Overview' : 'My Grievances & Cases'}</span>
          </NavLink>
          <NavLink to="/report" className={navClass}>
            <FilePlus className="w-4 h-4 shrink-0 text-[#F20D25]" />
            <span>Report Cyber Scam</span>
          </NavLink>
          <NavLink to="/track" className={navClass}>
            <Search className="w-4 h-4 shrink-0 text-[#F20D25]" />
            <span>Track My Complaint</span>
          </NavLink>
          <NavLink to="/analyze" className={navClass}>
            <Cpu className="w-4 h-4 shrink-0 text-[#F20D25]" />
            <span>Threat Link Scanner</span>
          </NavLink>
          <NavLink to="/awareness" className={navClass}>
            <BookOpen className="w-4 h-4 shrink-0 text-[#F20D25]" />
            <span>Safety Guides & OPSEC</span>
          </NavLink>
        </nav>
      </div>

      {/* Offline Sync */}
      <div>
        <p className="px-3 mb-2 text-[10px] font-bold tracking-widest uppercase text-[#869F90] font-cyber">
          TACTICAL READINESS
        </p>
        <nav>
          <NavLink to="/sync" className={navClass}>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <CloudOff className="w-4 h-4 shrink-0 text-cyan-400" />
                <span>Offline Sync Queue</span>
              </div>
              {pendingCount > 0 && (
                <span className="px-2 py-0.5 text-[10px] rounded-full bg-[#F20D25] text-black font-extrabold shadow-[0_0_8px_#F20D25]">
                  {pendingCount}
                </span>
              )}
            </div>
          </NavLink>
        </nav>
      </div>

      {/* CERT-Army Section */}
      {isInvestigator && (
        <div>
          <p className="px-3 mb-2 flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase text-amber-400 font-cyber">
            CERT-ARMY FORENSICS
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          </p>
          <nav>
            <NavLink to="/investigator" className={navClass}>
              <ShieldCheck className="w-4 h-4 shrink-0 text-amber-400" />
              <span>Forensic Case Queue</span>
            </NavLink>
          </nav>
        </div>
      )}

      {/* Admin Section */}
      {isAdmin && (
        <div>
          <p className="px-3 mb-2 text-[10px] font-bold tracking-widest uppercase text-cyan-400 font-cyber">
            HQ ADMINISTRATION
          </p>
          <nav>
            <NavLink to="/admin" className={navClass}>
              <Sliders className="w-4 h-4 shrink-0 text-cyan-400" />
              <span>Admin & ML Health</span>
            </NavLink>
          </nav>
        </div>
      )}

      {/* Emergency Helpline */}
      <div className="mt-auto pt-4 border-t border-red-500/15">
        <div className="p-3.5 rounded-2xl bg-black/40 border border-red-500/20 shadow-[0_0_15px_rgba(255,38,56,0.05)]">
          <div className="flex items-center gap-1.5 text-[#F20D25] font-bold text-[11px] mb-1 font-cyber uppercase tracking-wider">
            <PhoneCall className="w-3.5 h-3.5" />
            National Helpline
          </div>
          <p className="text-[10px] text-[#869F90] mb-2 leading-snug">
            Immediate cyber fraud & bank lien freeze:
          </p>
          <div className="text-center py-1.5 px-2 rounded-xl bg-black/80 border border-red-500/30 text-[11px] font-bold text-white tracking-widest font-mono shadow-[0_0_10px_rgba(255,38,56,0.1)]">
            1930 &nbsp;/&nbsp; 011-26701700
          </div>
        </div>
      </div>

    </aside>
  );
}
