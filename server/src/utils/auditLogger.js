/**
 * Audit Logger Utility
 * Creates structured audit log entries in MongoDB.
 * Called from controllers, not from middleware, to keep audit semantics explicit.
 *
 * NEVER logs: passwords, JWTs, refresh tokens, encryption keys, or secrets.
 */

const AuditLog = require('../models/AuditLog');
const logger = require('./logger');

/**
 * Write an audit log entry to MongoDB.
 * Fire-and-forget — does not block the request.
 *
 * @param {object} params
 * @param {string} params.actorId      - User _id (or 'SYSTEM')
 * @param {string} params.actorRole    - Role string
 * @param {string} params.action       - Audit action constant (see AuditLog model)
 * @param {string} params.resourceType - 'INCIDENT' | 'EVIDENCE' | 'USER' | 'SYSTEM_CONFIG' | ...
 * @param {string} params.resourceId   - ID or complaint ID of the affected resource
 * @param {string} params.ipAddress    - Remote IP
 * @param {string} params.userAgent    - User-Agent header
 * @param {object} params.metadata     - Safe extra context (no secrets)
 */
async function createAuditLog(params) {
  try {
    const entry = new AuditLog({
      actorId: params.actorId || 'SYSTEM',
      actorRole: params.actorRole || 'SYSTEM',
      action: params.action,
      resourceType: params.resourceType || 'UNKNOWN',
      resourceId: params.resourceId || null,
      ipAddress: params.ipAddress || 'UNKNOWN',
      userAgent: params.userAgent || 'UNKNOWN',
      metadata: params.metadata || {},
    });
    await entry.save();
  } catch (err) {
    // Audit log failure must not crash the main request
    logger.error(`Audit log write failed: ${err.message}`);
  }
}

module.exports = { createAuditLog };
