/**
 * Notification Service
 * Creates DB notification records and emits Socket.IO events.
 */

const Notification = require('../models/Notification');
const logger = require('../utils/logger');

let _io = null;

/**
 * Initialize with the Socket.IO server instance
 * Called from server.js after Socket.IO is set up.
 */
function initNotificationService(io) {
  _io = io;
}

/**
 * Create a notification and optionally emit it via Socket.IO
 * @param {object} params
 * @param {string}  params.userId     - ObjectId string of recipient
 * @param {string}  params.type
 * @param {string}  params.title
 * @param {string}  params.message
 * @param {string}  [params.incidentId]
 * @param {string}  [params.severity]
 * @param {boolean} [params.emit]     - Whether to emit Socket.IO event (default true)
 */
async function createNotification(params) {
  try {
    const notification = await Notification.create({
      userId: params.userId,
      type: params.type,
      title: params.title,
      message: params.message,
      incidentId: params.incidentId || null,
      severity: params.severity || 'INFO',
    });

    // Emit real-time event to the user's personal room
    if (_io && params.emit !== false) {
      _io.to(`user:${params.userId}`).emit('notification_created', {
        notification,
      });
    }

    return notification;
  } catch (err) {
    logger.error(`Notification creation failed: ${err.message}`);
    return null;
  }
}

/**
 * Emit a case status change event to relevant rooms
 */
function emitCaseStatusChange(io, incident, actorId) {
  const activeIo = io || _io;
  if (!activeIo) return;
  const payload = {
    incidentId: incident._id,
    complaintId: incident.complaintId,
    status: incident.status,
    severity: incident.severity,
    priority: incident.priority,
    actorId,
    timestamp: new Date().toISOString(),
  };

  // Emit to the incident owner's room
  activeIo.to(`user:${incident.userId}`).emit('case_status_changed', payload);

  // Emit to all investigators/admins
  activeIo.to('role:INVESTIGATOR').emit('case_status_changed', payload);
  activeIo.to('role:ADMIN').emit('case_status_changed', payload);
}

/**
 * Emit officer assignment event
 */
function emitOfficerAssigned(io, incident) {
  const activeIo = io || _io;
  if (!activeIo) return;
  const payload = {
    incidentId: incident._id,
    complaintId: incident.complaintId,
    assignedOfficerId: incident.assignedOfficerId,
    timestamp: new Date().toISOString(),
  };

  activeIo.to(`user:${incident.userId}`).emit('officer_assigned', payload);

  if (incident.assignedOfficerId) {
    activeIo.to(`user:${incident.assignedOfficerId}`).emit('case_assigned_to_you', payload);
  }
}

/**
 * Emit critical alert to all connected clients
 */
function emitCriticalAlert(io, alert) {
  const activeIo = io || _io;
  if (!activeIo) return;
  activeIo.emit('critical_alert', alert);
}

module.exports = {
  initNotificationService,
  createNotification,
  emitCaseStatusChange,
  emitOfficerAssigned,
  emitCriticalAlert,
};
