import React from 'react';

export function StatusBadge({ status }) {
  const styles = {
    DRAFT: 'bg-slate-900/90 text-slate-300 border-slate-700/80',
    SUBMITTED: 'bg-red-950/70 text-[#F20D25] border-red-500/40 shadow-[0_0_8px_rgba(255,38,56,0.15)]',
    RECEIVED: 'bg-cyan-950/70 text-cyan-300 border-cyan-500/40',
    AI_ANALYSIS: 'bg-purple-950/70 text-purple-300 border-purple-500/40',
    UNDER_REVIEW: 'bg-blue-950/70 text-blue-300 border-blue-500/40',
    ASSIGNED: 'bg-amber-950/70 text-amber-300 border-amber-500/40',
    UNDER_INVESTIGATION: 'bg-red-950/70 text-[#F20D25] border-red-500/50 font-semibold',
    ESCALATED: 'bg-rose-950/70 text-rose-300 border-rose-500/50 font-semibold shadow-[0_0_8px_rgba(244,63,94,0.2)]',
    RESOLVED: 'bg-red-950/80 text-[#F20D25] border-[#F20D25]/70 font-semibold shadow-[0_0_10px_rgba(255,38,56,0.25)]',
    CLOSED: 'bg-slate-900/90 text-slate-400 border-slate-800',
    REJECTED: 'bg-red-950/80 text-red-300 border-red-500/50'
  };

  const dotStyles = {
    SUBMITTED: 'bg-[#F20D25]',
    RECEIVED: 'bg-cyan-400',
    AI_ANALYSIS: 'bg-purple-400 animate-pulse',
    UNDER_REVIEW: 'bg-blue-400',
    ASSIGNED: 'bg-amber-400',
    UNDER_INVESTIGATION: 'bg-[#F20D25] animate-pulse',
    ESCALATED: 'bg-rose-400 animate-pulse',
    RESOLVED: 'bg-[#F20D25]',
    CLOSED: 'bg-slate-500',
    REJECTED: 'bg-red-400',
    DRAFT: 'bg-slate-400'
  };

  const formatted = status ? status.replace(/_/g, ' ') : 'UNKNOWN';

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-cyber tracking-wider border ${styles[status] || styles.SUBMITTED}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotStyles[status] || 'bg-slate-400'}`}></span>
      {formatted}
    </span>
  );
}

export function SeverityBadge({ severity }) {
  const styles = {
    CRITICAL: 'bg-red-950/80 text-red-300 border-red-700/80 shadow-[0_0_8px_rgba(239,68,68,0.2)]',
    HIGH: 'bg-amber-950/80 text-amber-300 border-amber-700/80',
    MEDIUM: 'bg-cyan-950/80 text-cyan-300 border-cyan-700/80',
    LOW: 'bg-red-950/80 text-[#F20D25] border-red-600/80'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold border tracking-wider ${styles[severity] || styles.LOW}`}>
      {severity}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  const styles = {
    P1: 'bg-red-950/70 text-red-200 border-red-600/80 shadow-[0_0_6px_rgba(239,68,68,0.25)]',
    P2: 'bg-amber-950/70 text-amber-200 border-amber-600/80',
    P3: 'bg-cyan-950/70 text-cyan-200 border-cyan-600/80',
    P4: 'bg-slate-900/80 text-slate-300 border-slate-700'
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${styles[priority] || styles.P4}`}>
      {priority}
    </span>
  );
}

export function ThreatCategoryBadge({ type }) {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-cyber font-medium bg-black/60 text-[#F20D25] border border-red-500/30">
      {type?.replace(/_/g, ' ')}
    </span>
  );
}
