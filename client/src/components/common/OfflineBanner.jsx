import React from 'react';
import { WifiOff, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useSync } from '../../context/SyncContext';

export function OfflineBanner() {
  const { isOnline, pendingCount, isSyncing, triggerSync, toggleSimulatedOffline } = useSync();

  if (isOnline && pendingCount === 0) return null;

  return (
    <div className={`px-4 py-2.5 text-xs font-mono flex flex-wrap items-center justify-between border-b transition-colors ${
      !isOnline 
        ? 'bg-amber-950/90 text-amber-200 border-amber-800/80' 
        : 'bg-cyan-950/90 text-cyan-200 border-cyan-800/80'
    }`}>
      <div className="flex items-center gap-2">
        {!isOnline ? (
          <>
            <WifiOff className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>
              <strong>OFFLINE MODE ACTIVE:</strong> You are currently disconnected. Incident reports will be safely encrypted & queued locally in IndexedDB.
            </span>
          </>
        ) : (
          <>
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>
              <strong>CONNECTIVITY RESTORED:</strong> {pendingCount} offline reports ready for synchronized dispatch to CERT-Army backend.
            </span>
          </>
        )}
      </div>

      <div className="flex items-center gap-3 mt-1 sm:mt-0">
        {pendingCount > 0 && (
          <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
            {pendingCount} Pending Queue
          </span>
        )}

        <button
          onClick={triggerSync}
          disabled={!isOnline || isSyncing}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white font-medium border border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'Synchronizing...' : 'Sync Now'}
        </button>

        {/* Demo Simulator Toggle */}
        <button
          onClick={toggleSimulatedOffline}
          className="text-xs text-slate-400 underline hover:text-white"
          title="Toggle online/offline mode for testing"
        >
          [{!isOnline ? 'Go Online' : 'Simulate Offline'}]
        </button>
      </div>
    </div>
  );
}
