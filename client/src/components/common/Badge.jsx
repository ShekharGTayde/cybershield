import React from 'react';

export function StatusBadge({ status }) {
  const styles = {
    DRAFT: 'bg-slate-800/80 text-slate-300 border-slate-700',
    SUBMITTED: 'bg-blue-950/80 text-blue-400 border-blue-800',
    RECEIVED: 'bg-cyan-950/80 text-cyan-400 border-cyan-800',
    AI_ANALYSIS: 'bg-purple-950/80 text-purple-400 border-purple-800 animate-pulse',
    UNDER_REVIEW: 'bg-indigo-950/80 text-indigo-400 border-indigo-800',
    ASSIGNED: 'bg-amber-950/80 text-amber-400 border-amber-800',
    UNDER_INVESTIGATION: 'bg-orange-950/80 text-orange-400 border-orange-800',
    ESCALATED: 'bg-rose-950/80 text-rose-400 border-rose-800 font-semibold',
    RESOLVED: 'bg-emerald-950/80 text-emerald-400 border-emerald-800',
    CLOSED: 'bg-slate-900/80 text-slate-400 border-slate-800',
    REJECTED: 'bg-red-950/80 text-red-400 border-red-800'
  };

  const formatted = status ? status.replace(/_/g, ' ') : 'UNKNOWN';

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono font-medium border ${styles[status] || styles.SUBMITTED}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></span>
      {formatted}
    </span>
  );
}

export function SeverityBadge({ severity }) {
  const styles = {
    CRITICAL: 'bg-red-500/10 text-red-400 border-red-500/30 text-glow-red',
    HIGH: 'bg-amber-500/10 text-amber-400 border-amber-500/30 text-glow-amber',
    MEDIUM: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    LOW: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-mono font-bold border ${styles[severity] || styles.LOW}`}>
      {severity}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  const styles = {
    P1: 'bg-red-900/40 text-red-300 border-red-600',
    P2: 'bg-amber-900/40 text-amber-300 border-amber-600',
    P3: 'bg-cyan-900/40 text-cyan-300 border-cyan-600',
    P4: 'bg-slate-800 text-slate-400 border-slate-700'
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-bold border ${styles[priority] || styles.P4}`}>
      {priority}
    </span>
  );
}

export function ThreatCategoryBadge({ type }) {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-slate-800 text-cyan-300 border border-cyan-900/40">
      {type?.replace(/_/g, ' ')}
    </span>
  );
}
