/**
 * Incident Model — SRD Sections 9, 10, 11, 12
 * Central document for all cyber fraud reports.
 */

const mongoose = require('mongoose');

// ── Sub-schemas ──────────────────────────────────────────

const AIAnalysisSchema = new mongoose.Schema(
  {
    classification: {
      type: String,
      enum: [
        'PHISHING', 'FINANCIAL_FRAUD', 'MALWARE', 'IDENTITY_THEFT',
        'SPAM', 'SOCIAL_ENGINEERING', 'ESPIONAGE', 'OPSEC_RISK',
        'MALICIOUS_URL', 'FAKE_EMAIL', 'FAKE_CALL', 'OTHER',
        'LEGITIMATE', 'UNKNOWN',
      ],
      default: 'UNKNOWN',
    },
    confidence: { type: Number, min: 0, max: 1, default: null },
    riskScore: { type: Number, min: 0, max: 100, default: null },
    modelName: { type: String, default: null },
    modelVersion: { type: String, default: null },
    probabilities: { type: mongoose.Schema.Types.Mixed, default: {} },
    indicators: { type: [String], default: [] },
    recommendation: { type: String, default: null },
    analyzedAt: { type: Date, default: null },
    // ML service failure tracking
    failed: { type: Boolean, default: false },
    failureReason: { type: String, default: null },
    status: {
      type: String,
      enum: ['PENDING', 'COMPLETED', 'FAILED', 'UNAVAILABLE'],
      default: 'PENDING',
    },
  },
  { _id: false }
);

const TimelineEntrySchema = new mongoose.Schema(
  {
    status: { type: String, required: true },
    timestamp: { type: Date, default: () => new Date() },
    note: { type: String, default: '' },
    actorId: { type: String, default: null },
    actorName: { type: String, default: null },
  },
  { _id: false }
);

const OfficerNoteSchema = new mongoose.Schema(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    authorName: { type: String, required: true },
    authorRole: { type: String, required: true },
    text: { type: String, required: true, maxlength: 5000 },
    isInternal: { type: Boolean, default: true }, // internal = not shown to user
  },
  { timestamps: true }
);

// ── Main Incident Schema ─────────────────────────────────

const IncidentSchema = new mongoose.Schema(
  {
    // Unique human-readable complaint reference
    complaintId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // Ownership
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    // Classification
    incidentType: {
      type: String,
      required: [true, 'Incident type is required'],
      enum: {
        values: [
          'PHISHING', 'FINANCIAL_FRAUD', 'MALWARE', 'IDENTITY_THEFT',
          'SPAM', 'SOCIAL_ENGINEERING', 'ESPIONAGE', 'OPSEC_RISK',
          'MALICIOUS_URL', 'FAKE_EMAIL', 'FAKE_CALL', 'OTHER',
        ],
        message: '{VALUE} is not a valid incident type',
      },
    },

    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [10, 'Title must be at least 10 characters'],
      maxlength: [200, 'Title must not exceed 200 characters'],
    },

    description: {
      type: String,
      required: [true, 'Description is required'],
      minlength: [20, 'Description must be at least 20 characters'],
      maxlength: [10000, 'Description must not exceed 10000 characters'],
    },

    // Incident details
    incidentDate: {
      type: Date,
      required: [true, 'Incident date is required'],
    },
    incidentTime: {
      type: String, // "HH:MM"
      default: null,
    },
    channel: {
      type: String,
      enum: ['SMS', 'EMAIL', 'CALL', 'WHATSAPP', 'TELEGRAM', 'WEB', 'APP', 'OTHER'],
      default: 'OTHER',
    },
    suspectedSource: {
      type: String,
      trim: true,
      default: null,
    },

    // Financial loss
    financialLoss: {
      type: Boolean,
      default: false,
    },
    lossAmount: {
      type: Number,
      min: 0,
      default: 0,
    },
    currency: {
      type: String,
      default: 'INR',
    },

    location: {
      type: String,
      trim: true,
      default: null,
    },

    // Workflow state
    status: {
      type: String,
      enum: [
        'DRAFT', 'SUBMITTED', 'RECEIVED', 'AI_ANALYSIS', 'UNDER_REVIEW',
        'ASSIGNED', 'UNDER_INVESTIGATION', 'ESCALATED', 'RESOLVED', 'CLOSED', 'REJECTED',
      ],
      default: 'DRAFT',
      index: true,
    },

    severity: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'LOW',
      index: true,
    },

    priority: {
      type: String,
      enum: ['P1', 'P2', 'P3', 'P4'],
      default: 'P4',
      index: true,
    },

    // ML analysis result
    aiAnalysis: {
      type: AIAnalysisSchema,
      default: () => ({ status: 'PENDING' }),
    },

    // Assignment
    assignedOfficerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },

    // Sub-documents
    timeline: { type: [TimelineEntrySchema], default: [] },
    officerNotes: { type: [OfficerNoteSchema], default: [] },

    // Offline sync support (SRD Section 45)
    localId: { type: String, default: null },
    syncStatus: {
      type: String,
      enum: ['PENDING', 'SYNCING', 'SYNCED', 'FAILED', 'CONFLICT'],
      default: 'SYNCED',
    },
    version: { type: Number, default: 1 },

    // Soft delete
    isDeleted: { type: Boolean, default: false, index: true },

    // Timestamps
    submittedAt: { type: Date, default: null },
    resolvedAt: { type: Date, default: null },
  },
  {
    timestamps: true, // createdAt, updatedAt
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// ── Indexes ──────────────────────────────────────────────
IncidentSchema.index({ userId: 1, status: 1, createdAt: -1 });
IncidentSchema.index({ status: 1, priority: 1, createdAt: -1 });
IncidentSchema.index({ assignedOfficerId: 1, status: 1 });
IncidentSchema.index({ isDeleted: 1, status: 1 });

// ── Virtuals ─────────────────────────────────────────────
IncidentSchema.virtual('evidences', {
  ref: 'Evidence',
  localField: '_id',
  foreignField: 'incidentId',
});

const Incident = mongoose.model('Incident', IncidentSchema);

module.exports = Incident;
