import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
      <div className="p-5 rounded-3xl bg-red-950/80 border border-red-500/40 text-red-400 shadow-glow-red">
        <ShieldAlert className="w-12 h-12" />
      </div>
      <h1 className="text-3xl font-display font-black text-white uppercase tracking-wider">404 - RESTRICTED SECTOR</h1>
      <p className="text-xs sm:text-sm text-slate-400 max-w-sm">
        The requested tactical coordinate or page does not exist in the Defence Cyber Portal registry.
      </p>
      <Link
        to="/dashboard"
        className="px-6 py-3 rounded-2xl bg-red-500 hover:bg-red-400 text-slate-950 font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-glow-neon transition"
      >
        <ArrowLeft className="w-4 h-4" /> Return to Dashboard
      </Link>
    </div>
  );
}

