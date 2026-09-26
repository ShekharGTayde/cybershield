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
    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-[12px] font-medium transition-all ${
      isActive
        ? 'bg-[#E05C1A]/12 text-[#F0804A] border border-[#E05C1A]/20 font-semibold'
        : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
    }`;

  return (
    <aside className="w-60 shrink-0 hidden md:flex flex-col bg-[#0D0F1C]/80 border-r border-white/[0.05] min-h-[calc(100vh-6rem)] p-4 gap-6">

      {/* Main Navigation */}
      <div>
        <p className="px-3 mb-2 text-[9px] font-bold tracking-widest uppercase text-slate-600">
          {isInvestigator ? 'Defence Portal' : 'Citizen Services'}
        </p>
        <nav className="space-y-0.5">
          <NavLink to="/dashboard" className={navClass}>
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            <span>{isInvestigator ? 'Dashboard Overview' : 'My Grievances & Cases'}</span>
          </NavLink>
          <NavLink to="/report" className={navClass}>
            <FilePlus className="w-4 h-4 shrink-0" />
            <span>Report Cyber Scam</span>
          </NavLink>
          <NavLink to="/track" className={navClass}>
            <Search className="w-4 h-4 shrink-0" />
            <span>Track My Complaint</span>
          </NavLink>
          <NavLink to="/analyze" className={navClass}>
            <Cpu className="w-4 h-4 shrink-0" />
            <span>Threat Link Scanner</span>
          </NavLink>
          <NavLink to="/awareness" className={navClass}>
            <BookOpen className="w-4 h-4 shrink-0" />
            <span>Safety Guides & OPSEC</span>
          </NavLink>
        </nav>
      </div>

      {/* Offline Sync */}
      <div>
        <p className="px-3 mb-2 text-[9px] font-bold tracking-widest uppercase text-slate-600">
          Tactical Support
        </p>
        <nav>
          <NavLink to="/sync" className={navClass}>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <CloudOff className="w-4 h-4 shrink-0" />
                <span>Offline Sync Queue</span>
              </div>
              {pendingCount > 0 && (
                <span className="px-1.5 py-0.5 text-[9px] rounded bg-[#E05C1A] text-white font-bold">
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
          <p className="px-3 mb-2 flex items-center gap-1.5 text-[9px] font-bold tracking-widest uppercase text-amber-500">
            CERT-Army Wing
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
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
          <p className="px-3 mb-2 text-[9px] font-bold tracking-widest uppercase text-purple-500">
            HQ Administration
          </p>
          <nav>
            <NavLink to="/admin" className={navClass}>
              <Sliders className="w-4 h-4 shrink-0 text-purple-400" />
              <span>Admin & ML Health</span>
            </NavLink>
          </nav>
        </div>
      )}

      {/* Emergency Helpline */}
      <div className="mt-auto pt-4 border-t border-white/[0.05]">
        <div className="p-3 rounded-xl bg-[#E05C1A]/08 border border-[#E05C1A]/15">
          <div className="flex items-center gap-1.5 text-[#F0804A] font-semibold text-[11px] mb-1">
            <PhoneCall className="w-3.5 h-3.5" />
            National Cyber Helpline
          </div>
          <p className="text-[10px] text-slate-500 mb-2 leading-snug">
            Immediate bank lien & account freeze:
          </p>
          <div className="text-center py-1.5 px-2 rounded-lg bg-[#0B0D14] border border-white/[0.07] text-[11px] font-bold text-white tracking-wider">
            1930 &nbsp;/&nbsp; 011-26701700
          </div>
        </div>
      </div>

    </aside>
  );
}
