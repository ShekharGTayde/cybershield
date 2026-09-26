import React from 'react';

export function StatusBadge({ status }) {
  const styles = {
    DRAFT: 'bg-slate-800/80 text-slate-300 border-slate-700/80',
    SUBMITTED: 'bg-sky-950/70 text-sky-300 border-sky-800/60',
    RECEIVED: 'bg-blue-950/70 text-blue-300 border-blue-800/60',
    AI_ANALYSIS: 'bg-purple-950/70 text-purple-300 border-purple-800/60',
    UNDER_REVIEW: 'bg-indigo-950/70 text-indigo-300 border-indigo-800/60',
    ASSIGNED: 'bg-amber-950/70 text-amber-300 border-amber-800/60',
    UNDER_INVESTIGATION: 'bg-orange-950/70 text-orange-300 border-orange-800/60',
    ESCALATED: 'bg-rose-950/70 text-rose-300 border-rose-800/60 font-semibold',
    RESOLVED: 'bg-emerald-950/70 text-emerald-300 border-emerald-800/60 font-semibold',
    CLOSED: 'bg-slate-900/80 text-slate-400 border-slate-800',
    REJECTED: 'bg-red-950/70 text-red-300 border-red-800/60'
  };

  const dotStyles = {
    SUBMITTED: 'bg-sky-400',
    RECEIVED: 'bg-blue-400',
    AI_ANALYSIS: 'bg-purple-400 animate-pulse',
    UNDER_REVIEW: 'bg-indigo-400',
    ASSIGNED: 'bg-amber-400',
    UNDER_INVESTIGATION: 'bg-orange-400 animate-pulse',
    ESCALATED: 'bg-rose-400 animate-pulse',
    RESOLVED: 'bg-emerald-400',
    CLOSED: 'bg-slate-500',
    REJECTED: 'bg-red-400',
    DRAFT: 'bg-slate-400'
  };

  const formatted = status ? status.replace(/_/g, ' ') : 'UNKNOWN';

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border tracking-wide ${styles[status] || styles.SUBMITTED}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotStyles[status] || 'bg-slate-400'}`}></span>
      {formatted}
    </span>
  );
}

export function SeverityBadge({ severity }) {
  const styles = {
    CRITICAL: 'bg-red-950/80 text-red-300 border-red-800/80',
    HIGH: 'bg-amber-950/80 text-amber-300 border-amber-800/80',
    MEDIUM: 'bg-sky-950/80 text-sky-300 border-sky-800/80',
    LOW: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80'
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono font-semibold border ${styles[severity] || styles.LOW}`}>
      {severity}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  const styles = {
    P1: 'bg-red-900/50 text-red-200 border-red-700/80',
    P2: 'bg-amber-900/50 text-amber-200 border-amber-700/80',
    P3: 'bg-sky-900/50 text-sky-200 border-sky-700/80',
    P4: 'bg-slate-800/80 text-slate-300 border-slate-700'
  };

  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border ${styles[priority] || styles.P4}`}>
      {priority}
    </span>
  );
}

export function ThreatCategoryBadge({ type }) {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-slate-800/90 text-sky-300 border border-slate-700/80">
      {type?.replace(/_/g, ' ')}
    </span>
  );
}
