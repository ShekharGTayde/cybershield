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
      <div className="glass-panel-glow rounded-2xl p-6 sm:p-8 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-rose-400 text-xs font-medium uppercase tracking-wider mb-1">
              <CloudOff className="w-4 h-4" />
              Tactical Offline Storage & Forward Sync
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Offline Incident Queue Manager
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Guarantees zero data loss for personnel reporting in forward postings or low-connectivity zones.
            </p>
          </div>

          <button
            onClick={toggleSimulatedOffline}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
              !isOnline 
                ? 'bg-amber-950/80 text-amber-300 border-amber-600 shadow-sm' 
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {!isOnline ? 'Network: OFFLINE MODE (Click to Reconnect)' : 'Simulate Offline Mode'}
          </button>
        </div>
      </div>

      {/* Sync Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Network Status</span>
          <div className="flex items-center gap-2">
            {isOnline ? (
              <>
                <Wifi className="w-5 h-5 text-emerald-400" />
                <span className="text-base font-bold text-emerald-400">DEFENCE-NET ACTIVE</span>
              </>
            ) : (
              <>
                <WifiOff className="w-5 h-5 text-amber-400" />
                <span className="text-base font-bold text-amber-400">LOCAL STORAGE ONLY</span>
              </>
            )}
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Pending Local Queue</span>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-white">{pendingQueue.length}</span>
            <span className="text-xs text-slate-400">items awaiting sync</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Last Cloud Synchronization</span>
          <div className="text-xs text-slate-200 font-medium pt-1">
            {lastSyncTime ? new Date(lastSyncTime).toLocaleString() : 'Pending connection'}
          </div>
        </div>
      </div>

      {/* Queue Items Table / List */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-sky-400" />
            Local Encrypted Queue Records
          </h2>

          <button
            onClick={triggerSync}
            disabled={!isOnline || isSyncing || pendingQueue.length === 0}
            className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-sm flex items-center gap-2 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Synchronizing...' : 'Sync All Queue to Cloud'}
          </button>
        </div>

        {pendingQueue.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs space-y-2">
            <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500/60" />
            <p>Queue is completely synchronized. No pending offline records.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingQueue.map((record) => (
              <div key={record.localId} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sky-400 font-mono font-bold">{record.localId}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                      {record.operation}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      record.syncStatus === 'SYNCED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                      record.syncStatus === 'SYNCING' ? 'bg-sky-950 text-sky-400 border border-sky-800 animate-pulse' :
                      'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}>
                      {record.syncStatus}
                    </span>
                  </div>
                  <p className="text-white text-xs font-medium">
                    {record.payload?.title || 'Cyber Incident Draft'}
                  </p>
                  <span className="text-[10px] text-slate-500">
                    Created Locally: {new Date(record.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Complaint Ref:</span>
                  <span className="text-xs text-sky-300 font-mono font-bold">{record.payload?.complaintId}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Synchronization Protocol Architecture Card */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-3">
        <h3 className="text-xs font-mono uppercase text-slate-400 font-semibold">
          Offline Tactical Synchronization Lifecycle
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-slate-500 block text-[10px] uppercase font-mono">Stage 1</span>
            <span className="text-white font-medium">Local UUID & AES-256</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-slate-500 block text-[10px] uppercase font-mono">Stage 2</span>
            <span className="text-sky-300 font-medium">Network Detection</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-slate-500 block text-[10px] uppercase font-mono">Stage 3</span>
            <span className="text-purple-300 font-medium">Automated Triage</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-slate-500 block text-[10px] uppercase font-mono">Stage 4</span>
            <span className="text-emerald-300 font-medium">Evidence Ledger Anchor</span>
          </div>
        </div>
      </div>
    </div>
  );
}
