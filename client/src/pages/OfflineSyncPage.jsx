import React from 'react';
import { 
  CloudOff, 
  RefreshCw, 
  Wifi, 
  WifiOff, 
  CheckCircle2, 
  AlertTriangle, 
  Database, 
  ShieldAlert, 
  FileText, 
  ArrowRight 
} from 'lucide-react';
import { useSync } from '../context/SyncContext';
import { StatusBadge } from '../components/common/Badge';

export function OfflineSyncPage() {
  const { 
    isOnline, 
    pendingQueue, 
    isSyncing, 
    lastSyncTime, 
    triggerSync, 
    toggleSimulatedOffline 
  } = useSync();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 border border-red-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-500/40 text-[10px] font-mono text-red-300 uppercase tracking-wider mb-3">
              <CloudOff className="w-3.5 h-3.5 text-red-400" />
              Tactical Offline Storage & Forward Sync
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-black text-white tracking-wide uppercase">
              Offline Incident Queue Manager
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Guarantees zero data loss for personnel reporting in forward operational postings or denied connectivity sectors.
            </p>
          </div>

          <button
            onClick={toggleSimulatedOffline}
            className={`pill-glass px-4 py-2.5 text-xs font-mono uppercase tracking-wider transition-all ${
              !isOnline 
                ? 'bg-amber-950/80 text-amber-300 border-amber-500 shadow-glow-amber' 
                : 'text-slate-300 hover:text-white'
            }`}
          >
            {!isOnline ? 'Network: OFFLINE MODE [Reconnect]' : 'Simulate Offline Mode'}
          </button>
        </div>
      </div>

      {/* Sync Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl glass-card border border-red-500/20 space-y-1">
          <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Network Status</span>
          <div className="flex items-center gap-2 pt-1">
            {isOnline ? (
              <>
                <Wifi className="w-5 h-5 text-red-400" />
                <span className="text-sm sm:text-base font-display font-bold text-red-400">DEFENCE-NET ACTIVE</span>
              </>
            ) : (
              <>
                <WifiOff className="w-5 h-5 text-amber-400 animate-pulse" />
                <span className="text-sm sm:text-base font-display font-bold text-amber-400">LOCAL STORAGE ONLY</span>
              </>
            )}
          </div>
        </div>

        <div className="p-5 rounded-3xl glass-card border border-red-500/20 space-y-1">
          <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Pending Local Queue</span>
          <div className="flex items-center gap-2 pt-1">
            <span className="text-2xl sm:text-3xl font-display font-bold text-white">{pendingQueue.length}</span>
            <span className="text-xs text-slate-400 font-mono">items queued</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl glass-card border border-red-500/20 space-y-1">
          <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Last Cloud Sync</span>
          <div className="text-xs text-slate-200 font-mono pt-2">
            {lastSyncTime ? new Date(lastSyncTime).toLocaleString() : 'Awaiting connection'}
          </div>
        </div>
      </div>

      {/* Queue Items Table / List */}
      <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <h2 className="text-base sm:text-lg font-display font-bold text-white uppercase tracking-wider flex items-center gap-2.5">
            <Database className="w-4 h-4 text-red-400" />
            Local Encrypted Queue Records
          </h2>

          <button
            onClick={triggerSync}
            disabled={!isOnline || isSyncing || pendingQueue.length === 0}
            className="px-6 py-2.5 rounded-2xl bg-red-500 hover:bg-red-400 text-slate-950 font-display font-bold text-xs uppercase tracking-wider shadow-glow-neon flex items-center justify-center gap-2 transition disabled:opacity-40"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Synchronizing Queue...' : 'Sync All Queue to Cloud'}
          </button>
        </div>

        {pendingQueue.length === 0 ? (
          <div className="text-center py-14 text-slate-400 text-xs space-y-2">
            <CheckCircle2 className="w-10 h-10 mx-auto text-red-400/70" />
            <p className="font-mono text-sm text-slate-300">Queue is completely synchronized with CERT-Army backend.</p>
            <span className="text-[11px] text-slate-500">Zero pending offline entries detected in IndexedDB storage.</span>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingQueue.map((record) => (
              <div key={record.localId} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-red-400 font-mono font-bold">{record.localId}</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 text-[10px] font-mono border border-slate-800">
                      {record.operation}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      record.syncStatus === 'SYNCED' ? 'bg-red-950 text-red-400 border border-red-500/40' :
                      record.syncStatus === 'SYNCING' ? 'bg-sky-950 text-sky-400 border border-sky-800 animate-pulse' :
                      'bg-amber-950 text-amber-400 border border-amber-600'
                    }`}>
                      {record.syncStatus}
                    </span>
                  </div>
                  <p className="text-white text-xs font-semibold">
                    {record.payload?.title || 'Cyber Incident Draft'}
                  </p>
                  <span className="text-[10px] font-mono text-slate-500">
                    Created Locally: {new Date(record.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-mono">Complaint Ref:</span>
                  <span className="text-xs text-red-400 font-mono font-bold">{record.payload?.complaintId}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Synchronization Protocol Architecture Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-slate-800 space-y-4">
        <h3 className="text-xs font-mono uppercase text-slate-400 font-semibold tracking-wider">
          Offline Tactical Synchronization Lifecycle
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
            <span className="text-red-400 block text-[10px] uppercase font-mono font-bold">Stage 1</span>
            <span className="text-white font-medium mt-1 block">Local UUID & AES-256</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
            <span className="text-red-400 block text-[10px] uppercase font-mono font-bold">Stage 2</span>
            <span className="text-slate-200 font-medium mt-1 block">Network Detection</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
            <span className="text-red-400 block text-[10px] uppercase font-mono font-bold">Stage 3</span>
            <span className="text-slate-200 font-medium mt-1 block">Automated Triage</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
            <span className="text-red-400 block text-[10px] uppercase font-mono font-bold">Stage 4</span>
            <span className="text-red-400 font-medium mt-1 block font-bold">Evidence Ledger Anchor</span>
          </div>
        </div>
      </div>
    </div>
  );
}
