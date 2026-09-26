/**
 * ThreatIntelligence Model — SRD Section 31
 * Internal threat indicator database.
 * Ready to consume real external feeds in future.
 */

const mongoose = require('mongoose');

const ThreatIntelligenceSchema = new mongoose.Schema(
  {
    indicatorType: {
      type: String,
      required: true,
      enum: ['URL', 'EMAIL', 'PHONE', 'IP', 'DOMAIN', 'FILE_HASH'],
      index: true,
    },
    indicatorValue: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    classification: {
      type: String,
      required: true,
      enum: [
        'PHISHING', 'FINANCIAL_FRAUD', 'MALWARE', 'MALWARE_C2', 'SPAM',
        'ESPIONAGE', 'SOCIAL_ENGINEERING', 'IDENTITY_THEFT', 'UNKNOWN',
      ],
    },
    riskScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    confidence: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
    },
    source: {
      type: String,
      default: 'INTERNAL',
      // Possible values: 'INTERNAL', 'USER_REPORT', 'CERT-ARMY', 'NCIIPC', etc.
    },
    reportedCount: {
      type: Number,
      default: 0,
    },
    firstSeen: {
      type: Date,
      default: () => new Date(),
    },
    lastSeen: {
      type: Date,
      default: () => new Date(),
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    linkedIncidents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Incident',
      },
    ],
    notes: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Compound unique index — one record per indicator value per type
ThreatIntelligenceSchema.index(
  { indicatorType: 1, indicatorValue: 1 },
  { unique: true }
);

ThreatIntelligenceSchema.index({ isActive: 1, riskScore: -1 });

const ThreatIntelligence = mongoose.model('ThreatIntelligence', ThreatIntelligenceSchema);

module.exports = ThreatIntelligence;
