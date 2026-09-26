/**
 * Notification Model — SRD Section 33
 */

const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        'CASE_STATUS_CHANGE',
        'OFFICER_ASSIGNED',
        'INVESTIGATION_UPDATE',
        'CRITICAL_ALERT',
        'SECURITY_WARNING',
        'EVIDENCE_RECEIVED',
        'CASE_RESOLVED',
        'SYSTEM_NOTICE',
      ],
    },
    title: {
      type: String,
      required: true,
      maxlength: 200,
    },
    message: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    incidentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Incident',
      default: null,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    severity: {
      type: String,
      enum: ['INFO', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'INFO',
    },
  },
  {
    timestamps: true,
  }
);

NotificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', NotificationSchema);

module.exports = Notification;
