/**
 * Evidence Model — SRD Section 13 & 46
 * Stores evidence file metadata after upload.
 * Blockchain fields are nullable — prepared for future integration.
 */

const mongoose = require('mongoose');

const BlockchainSchema = new mongoose.Schema(
  {
    network: { type: String, default: null },
    transactionId: { type: String, default: null },
    blockNumber: { type: Number, default: null },
    timestamp: { type: Date, default: null },
    status: {
      type: String,
      enum: ['PENDING', 'CONFIRMED', 'FAILED', null],
      default: null,
    },
  },
  { _id: false }
);

const EvidenceSchema = new mongoose.Schema(
  {
    incidentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Incident',
      required: true,
      index: true,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Original filename (sanitized for display only — never used for filesystem ops)
    fileName: {
      type: String,
      required: true,
    },

    fileType: {
      type: String,
      enum: ['IMAGE', 'VIDEO', 'AUDIO', 'PDF', 'TEXT', 'FILE'],
      required: true,
    },

    mimeType: {
      type: String,
      required: true,
    },

    fileSize: {
      type: Number,
      required: true,
      min: 1,
    },

    // Safe server-side storage path (never exposed as-is to clients)
    storagePath: {
      type: String,
      required: true,
      select: false, // Never returned in public queries
    },

    // SHA-256 of the uploaded file (computed server-side)
    sha256Hash: {
      type: String,
      required: true,
    },

    // AES-256-GCM label for future encrypted storage
    encryptionAlgorithm: {
      type: String,
      default: 'NONE', // 'AES-256-GCM' when encryption is enabled
    },

    // Blockchain anchor (nullable — SRD Section 46)
    blockchain: {
      type: BlockchainSchema,
      default: () => ({
        network: null,
        transactionId: null,
        blockNumber: null,
        timestamp: null,
        status: null,
      }),
    },

    uploadedAt: {
      type: Date,
      default: () => new Date(),
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.storagePath; // Never expose storage path
        delete ret.__v;
        return ret;
      },
    },
  }
);

EvidenceSchema.index({ incidentId: 1, uploadedAt: -1 });
EvidenceSchema.index({ sha256Hash: 1 }); // Detect duplicate uploads

const Evidence = mongoose.model('Evidence', EvidenceSchema);

module.exports = Evidence;
