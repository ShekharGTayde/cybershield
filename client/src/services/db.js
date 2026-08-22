import { openDB } from 'idb';

const DB_NAME = 'CyberShieldDB';
const DB_VERSION = 1;

/**
 * Initializes IndexedDB stores for Offline Support (SRD Section 18 & 44)
 */
export async function getDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Store for offline queued operations (CREATE_INCIDENT, UPLOAD_EVIDENCE)
      if (!db.objectStoreNames.contains('syncQueue')) {
        const syncStore = db.createObjectStore('syncQueue', { keyPath: 'localId' });
        syncStore.createIndex('syncStatus', 'syncStatus', { unique: false });
        syncStore.createIndex('createdAt', 'createdAt', { unique: false });
      }

      // Store for locally cached incidents
      if (!db.objectStoreNames.contains('incidents')) {
        const incidentStore = db.createObjectStore('incidents', { keyPath: 'id' });
        incidentStore.createIndex('status', 'status', { unique: false });
      }

      // Store for draft reports
      if (!db.objectStoreNames.contains('drafts')) {
        db.createObjectStore('drafts', { keyPath: 'id' });
      }

      // Store for cached threat intelligence indicators
      if (!db.objectStoreNames.contains('threatCache')) {
        db.createObjectStore('threatCache', { keyPath: 'indicatorValue' });
      }
    },
  });
}

/**
 * Save an offline incident creation record
 */
export async function queueOfflineIncident(payload) {
  const db = await getDB();
  const localId = 'offline-' + crypto.randomUUID();
  const record = {
    localId,
    operation: 'CREATE_INCIDENT',
    payload: {
      ...payload,
      localId,
      complaintId: `CRF-OFFLINE-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'DRAFT',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    syncStatus: 'PENDING',
    retryCount: 0,
  };
  await db.put('syncQueue', record);
  return record;
}

/**
 * Get all queued offline records
 */
export async function getPendingSyncRecords() {
  const db = await getDB();
  return db.getAll('syncQueue');
}

/**
 * Update an offline record status
 */
export async function updateOfflineRecord(localId, updates) {
  const db = await getDB();
  const existing = await db.get('syncQueue', localId);
  if (existing) {
    const updated = { ...existing, ...updates, updatedAt: new Date().toISOString() };
    await db.put('syncQueue', updated);
    return updated;
  }
}

/**
 * Remove an offline record once synced
 */
export async function removeOfflineRecord(localId) {
  const db = await getDB();
  return db.delete('syncQueue', localId);
}

/**
 * Save or retrieve drafts
 */
export async function saveDraft(draft) {
  const db = await getDB();
  return db.put('drafts', { ...draft, updatedAt: new Date().toISOString() });
}

export async function getDraft(id = 'current_draft') {
  const db = await getDB();
  return db.get('drafts', id);
}

export async function clearDraft(id = 'current_draft') {
  const db = await getDB();
  return db.delete('drafts', id);
}
