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
      <div className="glass-panel-glow rounded-2xl p-6 sm:p-8 border border-rose-500/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-rose-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
              <CloudOff className="w-4 h-4" />
              SRD §18 & §44 Offline Tactical Synchronization Engine
            </div>
            <h1 className="text-2xl font-bold text-white">
              Tactical Offline Queue & IndexedDB Manager
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Guarantees zero data loss for personnel reporting in forward postings or low-connectivity zones.
            </p>
          </div>

          <button
            onClick={toggleSimulatedOffline}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold border transition-all ${
              !isOnline 
                ? 'bg-amber-950 text-amber-300 border-amber-600 shadow-glow-amber' 
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {!isOnline ? 'Network: SIMULATED OFFLINE (Click to Restore)' : 'Click to Simulate Offline Mode'}
          </button>
        </div>
      </div>

      {/* Sync Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-2">
          <span className="text-xs font-mono text-slate-400">Current Network Status:</span>
          <div className="flex items-center gap-2">
            {isOnline ? (
              <span className="flex items-center gap-1.5 text-sm font-bold text-emerald-400 font-mono">
                <Wifi className="w-4 h-4" /> SECURE NETWORK ONLINE
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-sm font-bold text-amber-400 font-mono animate-pulse">
                <WifiOff className="w-4 h-4" /> DISCONNECTED / OFFLINE
              </span>
            )}
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-2">
          <span className="text-xs font-mono text-slate-400">Queued Offline Records:</span>
          <p className="text-2xl font-mono font-bold text-white">
            {pendingQueue.length} <span className="text-xs text-slate-400 font-normal">items</span>
          </p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-2">
          <span className="text-xs font-mono text-slate-400">Last Sync Timestamp:</span>
          <p className="text-sm font-mono font-bold text-cyan-300">
            {lastSyncTime || 'Pending connection'}
          </p>
        </div>

      </div>

      {/* Queue Table */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" />
            IndexedDB Local Sync Records (SRD §14, §44)
          </h2>

          <button
            onClick={triggerSync}
            disabled={!isOnline || isSyncing || pendingQueue.length === 0}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-semibold shadow-glow-cyan flex items-center gap-2 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Synchronizing...' : 'Force Sync All to CERT-Army'}
          </button>
        </div>

        {pendingQueue.length === 0 ? (
          <div className="text-center py-12 text-slate-500 font-mono text-xs space-y-2">
            <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500/50" />
            <p>IndexedDB Sync Queue is completely synchronized. No pending offline records.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingQueue.map((record) => (
              <div key={record.localId} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400 font-bold">{record.localId}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                      {record.operation}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      record.syncStatus === 'SYNCED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                      record.syncStatus === 'SYNCING' ? 'bg-cyan-950 text-cyan-400 border border-cyan-800 animate-pulse' :
                      'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}>
                      {record.syncStatus}
                    </span>
                  </div>
                  <p className="text-white font-sans text-xs">
                    {record.payload?.title || 'Cyber Incident Draft'}
                  </p>
                  <span className="text-[10px] text-slate-500">
                    Created Locally: {new Date(record.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Complaint Ref:</span>
                  <span className="text-xs text-cyan-300 font-bold">{record.payload?.complaintId}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Synchronization Protocol Architecture Card (SRD Section 14) */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-3">
        <h3 className="text-xs font-mono uppercase text-slate-400 font-bold">
          SRD §14 Offline Synchronization Flow Architecture
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-slate-500 block text-[10px]">Phase 1</span>
            <span className="text-white font-bold">Local UUID & AES-256</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-slate-500 block text-[10px]">Phase 2</span>
            <span className="text-cyan-400 font-bold">Network Detection</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-slate-500 block text-[10px]">Phase 3</span>
            <span className="text-purple-400 font-bold">POST & ML Triage</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-slate-500 block text-[10px]">Phase 4</span>
            <span className="text-emerald-400 font-bold">Blockchain Anchor</span>
          </div>
        </div>
      </div>

    </div>
  );
}
