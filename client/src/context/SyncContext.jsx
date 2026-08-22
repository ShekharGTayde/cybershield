import React, { createContext, useContext, useState, useEffect } from 'react';
import { getPendingSyncRecords, updateOfflineRecord, removeOfflineRecord } from '../services/db';
import { api } from '../services/api';

const SyncContext = createContext(null);

export function SyncProvider({ children }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingQueue, setPendingQueue] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);

  // Refresh pending queue
  const refreshQueue = async () => {
    try {
      const records = await getPendingSyncRecords();
      setPendingQueue(records || []);
    } catch (err) {
      console.error('Error fetching sync queue:', err);
    }
  };

  useEffect(() => {
    refreshQueue();

    const handleOnline = () => {
      setIsOnline(true);
      triggerSync();
    };
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Process offline sync queue
  const triggerSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    try {
      const records = await getPendingSyncRecords();
      for (const record of records) {
        if (record.operation === 'CREATE_INCIDENT' && record.syncStatus === 'PENDING') {
          await updateOfflineRecord(record.localId, { syncStatus: 'SYNCING' });
          try {
            // Submit to backend
            const res = await api.incidents.create(record.payload);
            if (res.success) {
              await updateOfflineRecord(record.localId, {
                syncStatus: 'SYNCED',
                serverIncidentId: res.data.incidentId,
                complaintId: res.data.complaintId
              });
              // Auto-remove after short delay
              setTimeout(() => removeOfflineRecord(record.localId), 3000);
            } else {
              await updateOfflineRecord(record.localId, { syncStatus: 'FAILED' });
            }
          } catch (err) {
            await updateOfflineRecord(record.localId, { syncStatus: 'FAILED' });
          }
        }
      }
      setLastSyncTime(new Date().toLocaleTimeString());
      await refreshQueue();
    } catch (err) {
      console.error('Sync error:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  // Toggle offline simulator for easy testing
  const toggleSimulatedOffline = () => {
    setIsOnline(prev => !prev);
  };

  return (
    <SyncContext.Provider value={{
      isOnline,
      pendingQueue,
      pendingCount: pendingQueue.filter(r => r.syncStatus === 'PENDING').length,
      isSyncing,
      lastSyncTime,
      triggerSync,
      refreshQueue,
      toggleSimulatedOffline
    }}>
      {children}
    </SyncContext.Provider>
  );
}

export function useSync() {
  const context = useContext(SyncContext);
  if (!context) throw new Error('useSync must be used within a SyncProvider');
  return context;
}
