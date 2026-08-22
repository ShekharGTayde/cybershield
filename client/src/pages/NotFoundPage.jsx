import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
      <div className="p-4 rounded-2xl bg-red-950/80 border border-red-800 text-red-400">
        <ShieldAlert className="w-12 h-12" />
      </div>
      <h1 className="text-3xl font-mono font-extrabold text-white">404 - RESTRICTED SECTOR</h1>
      <p className="text-xs text-slate-400 max-w-sm">
        The requested tactical coordinate or page does not exist in the Defence Cyber Portal registry.
      </p>
      <Link
        to="/dashboard"
        className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center gap-2 shadow-glow-cyan transition"
      >
        <ArrowLeft className="w-4 h-4" /> Return to Dashboard
      </Link>
    </div>
  );
}
