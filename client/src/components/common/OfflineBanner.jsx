import React from 'react';
import { WifiOff, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useSync } from '../../context/SyncContext';

export function OfflineBanner() {
  const { isOnline, pendingCount, isSyncing, triggerSync, toggleSimulatedOffline } = useSync();

  if (isOnline && pendingCount === 0) return null;

  return (
    <div className={`px-4 py-2.5 text-xs font-mono flex flex-wrap items-center justify-between border-b transition-colors ${
      !isOnline 
        ? 'bg-amber-950/95 text-amber-200 border-amber-500/40' 
        : 'bg-red-950/95 text-red-200 border-red-500/40 shadow-glow-neon'
    }`}>
      <div className="flex items-center gap-2.5">
        {!isOnline ? (
          <>
            <WifiOff className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />
            <span>
              <strong className="text-white uppercase font-bold tracking-wider">OFFLINE MODE ACTIVE:</strong> Network disconnected. Incident reports will be locally encrypted (AES-256) & stored in IndexedDB.
            </span>
          </>
        ) : (
          <>
            <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0" />
            <span>
              <strong className="text-white uppercase font-bold tracking-wider">CONNECTIVITY RESTORED:</strong> {pendingCount} offline reports ready for cryptographic dispatch to CERT-Army backend.
            </span>
          </>
        )}
      </div>

      <div className="flex items-center gap-3 mt-1 sm:mt-0">
        {pendingCount > 0 && (
          <span className="bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/40 text-[10px] font-bold">
            {pendingCount} Pending Queue
          </span>
        )}

        <button
          onClick={triggerSync}
          disabled={!isOnline || isSyncing}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-medium border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition text-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'Synchronizing...' : 'Sync Now'}
        </button>

        {/* Demo Simulator Toggle */}
        <button
          onClick={toggleSimulatedOffline}
          className="text-xs text-slate-400 underline hover:text-white transition"
          title="Toggle online/offline mode for testing"
        >
          [{!isOnline ? 'Go Online' : 'Simulate Offline'}]
        </button>
      </div>
    </div>
  );
}
