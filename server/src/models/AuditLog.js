/**
 * AuditLog Model — SRD Section 34
 * Immutable audit trail for all significant system actions.
 * Inserts only — no updates, no deletes.
 */

const mongoose = require('mongoose');

const AUDIT_ACTIONS = [
  'LOGIN',
  'LOGOUT',
  'REGISTER',
  'CREATE_INCIDENT',
  'UPDATE_INCIDENT',
  'VIEW_INCIDENT',
  'SUBMIT_INCIDENT',
  'DELETE_INCIDENT',
  'UPLOAD_EVIDENCE',
  'DOWNLOAD_EVIDENCE',
  'VIEW_EVIDENCE',
  'ASSIGN_CASE',
  'CHANGE_STATUS',
  'ADD_NOTE',
  'AI_ANALYSIS',
  'ANALYZE_URL',
  'ANALYZE_EMAIL',
  'ANALYZE_PHONE',
  'ANALYZE_FILE',
  'ADMIN_ACTION',
  'USER_DEACTIVATED',
  'USER_ACTIVATED',
  'ROLE_CHANGED',
  'TOKEN_REFRESH',
];

const AuditLogSchema = new mongoose.Schema(
  {
    actorId: {
      type: String, // Can be User ObjectId string or 'SYSTEM' / 'SYSTEM_AI'
      required: true,
      index: true,
    },
    actorRole: {
      type: String,
      default: 'SYSTEM',
    },
    action: {
      type: String,
      required: true,
      enum: AUDIT_ACTIONS,
      index: true,
    },
    resourceType: {
      type: String,
      required: true,
      enum: [
        'INCIDENT',
        'EVIDENCE',
        'USER',
        'NOTIFICATION',
        'AI_ANALYSIS',
        'SYSTEM_CONFIG',
        'AUTH',
        'UNKNOWN',
      ],
    },
    resourceId: {
      type: String,
      default: null,
      index: true,
    },
    ipAddress: {
      type: String,
      default: 'UNKNOWN',
    },
    userAgent: {
      type: String,
      default: 'UNKNOWN',
    },
    // Flexible safe metadata — callers must NOT put secrets here
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    // No timestamps option — we use a single immutable `timestamp` field
    timestamps: false,
  }
);

// Manual timestamp so it is always set at insertion time and never modified
AuditLogSchema.add({
  timestamp: {
    type: Date,
    default: () => new Date(),
    index: true,
    immutable: true,
  },
});

// Compound index for actor+action queries (admin audit view)
AuditLogSchema.index({ actorId: 1, timestamp: -1 });
AuditLogSchema.index({ resourceId: 1, timestamp: -1 });

// Prevent updates — audit logs are append-only
AuditLogSchema.pre('findOneAndUpdate', function () {
  throw new Error('AuditLog is immutable — no updates allowed.');
});
AuditLogSchema.pre('updateOne', function () {
  throw new Error('AuditLog is immutable — no updates allowed.');
});

const AuditLog = mongoose.model('AuditLog', AuditLogSchema);

module.exports = AuditLog;
module.exports.AUDIT_ACTIONS = AUDIT_ACTIONS;
