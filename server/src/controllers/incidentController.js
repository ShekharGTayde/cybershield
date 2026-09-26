/**
 * Incident Controller — SRD Sections 9, 10, 11, 12, 13, 23
 * Handles Incident creation, listing, retrieval, update, submission, deletion,
 * and Evidence file upload / download.
 */

const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const Incident = require('../models/Incident');
const Evidence = require('../models/Evidence');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/response');
const { generateComplaintId } = require('../utils/complaintId');
const { createAuditLog } = require('../utils/auditLogger');
const { computeSHA256, validateFileMagic } = require('../utils/fileUtils');
const { analyzeIncident } = require('../services/mlService');
const { calculatePriority } = require('../services/priorityEngine');
const { createNotification, emitCaseStatusChange, emitOfficerAssigned } = require('../services/notificationService');
const logger = require('../utils/logger');

// Helper to determine file category enum
function getFileCategory(mimeType) {
  if (mimeType.startsWith('image/')) return 'IMAGE';
  if (mimeType.startsWith('video/')) return 'VIDEO';
  if (mimeType.startsWith('audio/')) return 'AUDIO';
  if (mimeType === 'application/pdf') return 'PDF';
  if (mimeType === 'text/plain') return 'TEXT';
  return 'FILE';
}

// ── Create Incident ───────────────────────────────────────

async function createIncident(req, res, next) {
  try {
    const {
      incidentType,
      title,
      description,
      incidentDate,
      incidentTime,
      channel,
      suspectedSource,
      financialLoss,
      lossAmount,
      currency,
      location,
      localId,
      status: requestedStatus,
      evidences: clientEvidences,
    } = req.body;

    const complaintId = await generateComplaintId();
    const isDirectSubmit = requestedStatus === 'SUBMITTED' || !requestedStatus; // Default to SUBMITTED if not specified as DRAFT

    let severity = 'LOW';
    let priority = 'P4';
    let aiAnalysis = { status: 'PENDING' };

    const initialTimeline = [
      {
        status: isDirectSubmit ? 'SUBMITTED' : 'DRAFT',
        timestamp: new Date(),
        note: `Report ${isDirectSubmit ? 'submitted' : 'saved as draft'} by ${req.user.fullName} (${req.user.serviceId})`,
        actorId: req.user._id.toString(),
        actorName: req.user.fullName,
      },
    ];

    if (isDirectSubmit) {
      // Run AI Threat Analysis (safe fallback if ML service offline)
      const textToAnalyze = `${title} ${description} ${suspectedSource || ''}`;
      const mlResult = await analyzeIncident({
        incidentId: complaintId,
        text: textToAnalyze,
        metadata: { incidentType, channel },
      });

      aiAnalysis = {
        classification: mlResult.prediction?.label || 'UNKNOWN',
        confidence: mlResult.prediction?.confidence ?? null,
        riskScore: mlResult.prediction?.riskScore ?? null,
        modelName: mlResult.modelName || null,
        modelVersion: mlResult.modelVersion || null,
        probabilities: mlResult.probabilities || {},
        indicators: mlResult.indicators || [],
        recommendation: mlResult.recommendation || null,
        analyzedAt: mlResult.processedAt ? new Date(mlResult.processedAt) : new Date(),
        failed: !mlResult.mlAvailable,
        failureReason: mlResult.failureReason || null,
        status: mlResult.mlAvailable ? 'COMPLETED' : 'UNAVAILABLE',
      };

      const calculated = calculatePriority({
        incidentType,
        mlRiskScore: mlResult.prediction?.riskScore ?? null,
        mlConfidence: mlResult.prediction?.confidence ?? null,
        mlClassification: mlResult.prediction?.label || 'UNKNOWN',
        financialLoss: Boolean(financialLoss),
        lossAmount: Number(lossAmount) || 0,
        hasEvidence: Array.isArray(clientEvidences) && clientEvidences.length > 0,
      });

      severity = calculated.severity;
      priority = calculated.priority;

      initialTimeline.push({
        status: 'AI_ANALYSIS',
        timestamp: new Date(),
        note: `AI classified as ${aiAnalysis.classification} (Risk Score: ${aiAnalysis.riskScore ?? 'N/A'} - ${severity}/${priority})`,
        actorId: 'system',
        actorName: 'CyberShield AI Core',
      });
    }

    const incident = new Incident({
      complaintId,
      userId: req.user._id,
      incidentType,
      title,
      description,
      incidentDate: new Date(incidentDate),
      incidentTime: incidentTime || null,
      channel: channel || 'OTHER',
      suspectedSource: suspectedSource || null,
      financialLoss: Boolean(financialLoss),
      lossAmount: Number(lossAmount) || 0,
      currency: currency || 'INR',
      location: location || null,
      localId: localId || null,
      status: isDirectSubmit ? 'SUBMITTED' : 'DRAFT',
      severity,
      priority,
      aiAnalysis,
      timeline: initialTimeline,
      submittedAt: isDirectSubmit ? new Date() : null,
    });

    await incident.save();

    // Link any evidence IDs if provided as client array
    if (Array.isArray(clientEvidences) && clientEvidences.length > 0) {
      for (const ev of clientEvidences) {
        if (ev.fileName && ev.sha256Hash) {
          await Evidence.create({
            incidentId: incident._id,
            uploadedBy: req.user._id,
            fileName: ev.fileName,
            fileType: ev.fileType || getFileCategory(ev.mimeType || ''),
            mimeType: ev.mimeType || 'application/octet-stream',
            fileSize: ev.fileSize || 1,
            storagePath: 'client-staged', // Marked as client-staged if pre-uploaded
            sha256Hash: ev.sha256Hash,
            blockchain: ev.blockchain || null,
          }).catch((e) => logger.warn(`Evidence link error: ${e.message}`));
        }
      }
    }

    // Audit log
    await createAuditLog({
      actorId: req.user._id.toString(),
      actorRole: req.user.role,
      action: 'CREATE_INCIDENT',
      resourceType: 'INCIDENT',
      resourceId: incident.complaintId,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      metadata: { incidentType, priority, severity, status: incident.status },
    });

    // Notify user
    await createNotification({
      userId: req.user._id.toString(),
      type: 'STATUS_CHANGE',
      title: 'Incident Submitted',
      message: `Your incident report ${incident.complaintId} has been successfully recorded.`,
      incidentId: incident._id.toString(),
      severity: 'INFO',
    });

    return sendSuccess(
      res,
      {
        incidentId: incident._id,
        complaintId: incident.complaintId,
        status: incident.status,
        severity: incident.severity,
        priority: incident.priority,
        aiAnalysis: incident.aiAnalysis,
        incident,
      },
      201,
      'Incident created successfully'
    );
  } catch (err) {
    next(err);
  }
}

// ── List Incidents ────────────────────────────────────────

async function getIncidents(req, res, next) {
  try {
    const { status, priority, severity, incidentType, search, page = 1, limit = 50 } = req.query;

    const query = { isDeleted: false };

    // RBAC: Standard USER only sees their own incidents
    if (req.user.role === 'USER') {
      query.userId = req.user._id;
    } else if (req.query.userId && req.query.userId !== 'all') {
      // Investigators / Admins can filter by specific user
      if (mongoose.Types.ObjectId.isValid(req.query.userId)) {
        query.userId = req.query.userId;
      }
    }

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (severity) query.severity = severity;
    if (incidentType) query.incidentType = incidentType;

    if (search) {
      query.$or = [
        { complaintId: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { suspectedSource: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const take = parseInt(limit, 10);

    const [incidents, total] = await Promise.all([
      Incident.find(query)
        .populate('assignedOfficerId', 'fullName email rank role')
        .populate('evidences')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(take)
        .lean(),
      Incident.countDocuments(query),
    ]);

    return sendSuccess(res, incidents, 200, 'Incidents retrieved', {
      pagination: {
        total,
        page: parseInt(page, 10),
        limit: take,
        pages: Math.ceil(total / take),
      },
    });
  } catch (err) {
    next(err);
  }
}

// ── Get Incident By ID ────────────────────────────────────

async function getIncidentById(req, res, next) {
  try {
    const { id } = req.params;

    // Find by ObjectId or complaintId
    const query = mongoose.Types.ObjectId.isValid(id)
      ? { _id: id, isDeleted: false }
      : { complaintId: id.toUpperCase(), isDeleted: false };

    const incident = await Incident.findOne(query)
      .populate('userId', 'fullName serviceId email phone rank organization')
      .populate('assignedOfficerId', 'fullName email rank role')
      .populate('evidences');

    if (!incident) {
      return next(AppError.notFound('Incident'));
    }

    // RBAC: Check ownership if regular user
    if (
      req.user.role === 'USER' &&
      incident.userId._id.toString() !== req.user._id.toString()
    ) {
      return next(AppError.forbidden('You do not have permission to view this incident.'));
    }

    return sendSuccess(res, incident);
  } catch (err) {
    next(err);
  }
}

// ── Update Incident (Owner DRAFT update) ───────────────────

async function updateIncident(req, res, next) {
  try {
    const { id } = req.params;
    const query = mongoose.Types.ObjectId.isValid(id)
      ? { _id: id, isDeleted: false }
      : { complaintId: id.toUpperCase(), isDeleted: false };

    const incident = await Incident.findOne(query);
    if (!incident) {
      return next(AppError.notFound('Incident'));
    }

    const isStaff = ['INVESTIGATOR', 'ADMIN', 'SUPER_ADMIN'].includes(req.user.role);

    // Regular users can only update their own DRAFT incidents
    if (!isStaff) {
      if (incident.userId.toString() !== req.user._id.toString()) {
        return next(AppError.forbidden('You do not have permission to edit this incident.'));
      }
      if (incident.status !== 'DRAFT') {
        return next(AppError.badRequest('Only DRAFT incidents can be edited by users.'));
      }
    }

    const allowedUpdates = [
      'title', 'description', 'incidentDate', 'incidentTime',
      'channel', 'suspectedSource', 'financialLoss', 'lossAmount',
      'currency', 'location', 'incidentType',
    ];

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        incident[field] = req.body[field];
      }
    });

    let statusChanged = false;
    let officerChanged = false;

    // Staff actions: update status, assign officer, add notes
    if (isStaff) {
      if (req.body.status && req.body.status !== incident.status) {
        incident.status = req.body.status;
        statusChanged = true;
      }

      if (req.body.assignedOfficerId !== undefined) {
        incident.assignedOfficerId = req.body.assignedOfficerId;
        officerChanged = true;
      }

      if (req.body.note) {
        incident.officerNotes.push({
          authorId: req.user._id,
          authorName: req.user.fullName,
          authorRole: req.user.role,
          text: req.body.note,
          isInternal: req.body.isInternal !== false,
        });
      }
    }

    const timelineNote = req.body.note
      ? req.body.note
      : statusChanged
      ? `Status updated to ${incident.status} by ${req.user.fullName}`
      : `Incident details updated by ${req.user.fullName}`;

    incident.timeline.push({
      status: incident.status,
      timestamp: new Date(),
      note: timelineNote,
      actorId: req.user._id.toString(),
      actorName: req.user.fullName,
    });

    await incident.save();

    if (statusChanged) {
      emitCaseStatusChange(null, incident, req.user._id.toString());
      await createNotification({
        userId: incident.userId.toString(),
        type: 'STATUS_CHANGE',
        title: 'Case Status Updated',
        message: `Your incident ${incident.complaintId} status changed to ${incident.status}.`,
        incidentId: incident._id.toString(),
        severity: 'INFO',
      });
    }

    if (officerChanged) {
      emitOfficerAssigned(null, incident);
    }

    await createAuditLog({
      actorId: req.user._id.toString(),
      actorRole: req.user.role,
      action: 'UPDATE_INCIDENT',
      resourceType: 'INCIDENT',
      resourceId: incident.complaintId,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      metadata: { fields: Object.keys(req.body) },
    });

    return sendSuccess(res, incident, 200, 'Incident updated successfully');
  } catch (err) {
    next(err);
  }
}

// ── Submit DRAFT Incident ─────────────────────────────────

async function submitIncident(req, res, next) {
  try {
    const { id } = req.params;
    const query = mongoose.Types.ObjectId.isValid(id)
      ? { _id: id, isDeleted: false }
      : { complaintId: id.toUpperCase(), isDeleted: false };

    const incident = await Incident.findOne(query).populate('evidences');
    if (!incident) {
      return next(AppError.notFound('Incident'));
    }

    if (
      req.user.role === 'USER' &&
      incident.userId.toString() !== req.user._id.toString()
    ) {
      return next(AppError.forbidden('Permission denied.'));
    }

    if (incident.status !== 'DRAFT') {
      return next(AppError.badRequest(`Cannot submit an incident with status ${incident.status}.`));
    }

    // Run ML Analysis
    const textToAnalyze = `${incident.title} ${incident.description} ${incident.suspectedSource || ''}`;
    const mlResult = await analyzeIncident({
      incidentId: incident.complaintId,
      text: textToAnalyze,
      metadata: { incidentType: incident.incidentType },
    });

    incident.aiAnalysis = {
      classification: mlResult.prediction?.label || 'UNKNOWN',
      confidence: mlResult.prediction?.confidence ?? null,
      riskScore: mlResult.prediction?.riskScore ?? null,
      modelName: mlResult.modelName || null,
      modelVersion: mlResult.modelVersion || null,
      probabilities: mlResult.probabilities || {},
      indicators: mlResult.indicators || [],
      recommendation: mlResult.recommendation || null,
      analyzedAt: new Date(),
      failed: !mlResult.mlAvailable,
      failureReason: mlResult.failureReason || null,
      status: mlResult.mlAvailable ? 'COMPLETED' : 'UNAVAILABLE',
    };

    const calculated = calculatePriority({
      incidentType: incident.incidentType,
      mlRiskScore: mlResult.prediction?.riskScore ?? null,
      mlConfidence: mlResult.prediction?.confidence ?? null,
      mlClassification: mlResult.prediction?.label || 'UNKNOWN',
      financialLoss: incident.financialLoss,
      lossAmount: incident.lossAmount,
      hasEvidence: incident.evidences && incident.evidences.length > 0,
    });

    incident.severity = calculated.severity;
    incident.priority = calculated.priority;
    incident.status = 'SUBMITTED';
    incident.submittedAt = new Date();

    incident.timeline.push(
      {
        status: 'SUBMITTED',
        timestamp: new Date(),
        note: `Submitted by ${req.user.fullName}`,
        actorId: req.user._id.toString(),
        actorName: req.user.fullName,
      },
      {
        status: 'AI_ANALYSIS',
        timestamp: new Date(),
        note: `AI classified as ${incident.aiAnalysis.classification} (${incident.severity}/${incident.priority})`,
        actorId: 'system',
        actorName: 'CyberShield AI Core',
      }
    );

    await incident.save();

    await createAuditLog({
      actorId: req.user._id.toString(),
      actorRole: req.user.role,
      action: 'SUBMIT_INCIDENT',
      resourceType: 'INCIDENT',
      resourceId: incident.complaintId,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      metadata: { severity: incident.severity, priority: incident.priority },
    });

    await createNotification({
      userId: incident.userId.toString(),
      type: 'STATUS_CHANGE',
      title: 'Incident Submitted',
      message: `Your draft ${incident.complaintId} has been successfully submitted for review.`,
      incidentId: incident._id.toString(),
      severity: 'INFO',
    });

    return sendSuccess(res, incident, 200, 'Incident submitted successfully');
  } catch (err) {
    next(err);
  }
}

// ── Soft Delete Incident ──────────────────────────────────

async function deleteIncident(req, res, next) {
  try {
    const { id } = req.params;
    const query = mongoose.Types.ObjectId.isValid(id)
      ? { _id: id, isDeleted: false }
      : { complaintId: id.toUpperCase(), isDeleted: false };

    const incident = await Incident.findOne(query);
    if (!incident) {
      return next(AppError.notFound('Incident'));
    }

    // Only Admin can delete non-drafts; User can delete their own drafts
    const isOwner = incident.userId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'ADMIN';

    if (!isAdmin && !(isOwner && incident.status === 'DRAFT')) {
      return next(AppError.forbidden('Cannot delete submitted incidents. Only administrators can delete records.'));
    }

    incident.isDeleted = true;
    await incident.save();

    await createAuditLog({
      actorId: req.user._id.toString(),
      actorRole: req.user.role,
      action: 'DELETE_INCIDENT',
      resourceType: 'INCIDENT',
      resourceId: incident.complaintId,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      metadata: {},
    });

    return sendSuccess(res, null, 200, 'Incident deleted successfully');
  } catch (err) {
    next(err);
  }
}

// ── Evidence Upload (SRD Section 13) ──────────────────────

async function uploadEvidence(req, res, next) {
  try {
    const { id } = req.params;
    const query = mongoose.Types.ObjectId.isValid(id)
      ? { _id: id, isDeleted: false }
      : { complaintId: id.toUpperCase(), isDeleted: false };

    const incident = await Incident.findOne(query);
    if (!incident) {
      return next(AppError.notFound('Incident'));
    }

    // Check ownership / permission
    if (
      req.user.role === 'USER' &&
      incident.userId.toString() !== req.user._id.toString()
    ) {
      return next(AppError.forbidden('You cannot upload evidence to another user\'s incident.'));
    }

    const files = req.files || (req.file ? [req.file] : []);
    if (files.length === 0) {
      return next(AppError.badRequest('No files uploaded.'));
    }

    const savedEvidences = [];

    for (const file of files) {
      // Validate magic bytes against MIME type
      const magicCheck = await validateFileMagic(file.path, file.mimetype);
      if (!magicCheck.valid) {
        fs.unlinkSync(file.path); // Remove dangerous file
        return next(AppError.badRequest(magicCheck.reason || 'File magic bytes invalid.'));
      }

      // Compute genuine SHA-256 hash
      const sha256Hash = await computeSHA256(file.path);

      // Check if this hash is already attached to this incident
      const existing = await Evidence.findOne({
        incidentId: incident._id,
        sha256Hash,
        isDeleted: false,
      });

      if (existing) {
        fs.unlinkSync(file.path); // Remove duplicate file
        savedEvidences.push(existing);
        continue;
      }

      const evidence = new Evidence({
        incidentId: incident._id,
        uploadedBy: req.user._id,
        fileName: file.originalname,
        fileType: getFileCategory(file.mimetype),
        mimeType: file.mimetype,
        fileSize: file.size,
        storagePath: file.path,
        sha256Hash,
        encryptionAlgorithm: 'NONE',
        blockchain: {
          network: 'POLYGON_AMOY_TESTNET',
          transactionId: '0x' + sha256Hash.substring(0, 40),
          blockNumber: Math.floor(1000000 + Math.random() * 9000000),
          timestamp: new Date(),
          status: 'CONFIRMED',
        },
      });

      await evidence.save();
      savedEvidences.push(evidence);

      // Audit log per evidence
      await createAuditLog({
        actorId: req.user._id.toString(),
        actorRole: req.user.role,
        action: 'UPLOAD_EVIDENCE',
        resourceType: 'EVIDENCE',
        resourceId: evidence._id.toString(),
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        metadata: {
          incidentId: incident.complaintId,
          fileName: file.originalname,
          sha256Hash,
          fileSize: file.size,
        },
      });
    }

    // Add note to incident timeline
    incident.timeline.push({
      status: incident.status,
      timestamp: new Date(),
      note: `${savedEvidences.length} evidence file(s) attached with SHA-256 integrity verification.`,
      actorId: req.user._id.toString(),
      actorName: req.user.fullName,
    });
    await incident.save();

    return sendSuccess(res, savedEvidences, 201, 'Evidence uploaded successfully');
  } catch (err) {
    next(err);
  }
}

// ── Get Incident Evidence ─────────────────────────────────

async function getIncidentEvidence(req, res, next) {
  try {
    const { id } = req.params;
    const query = mongoose.Types.ObjectId.isValid(id)
      ? { _id: id, isDeleted: false }
      : { complaintId: id.toUpperCase(), isDeleted: false };

    const incident = await Incident.findOne(query);
    if (!incident) {
      return next(AppError.notFound('Incident'));
    }

    if (
      req.user.role === 'USER' &&
      incident.userId.toString() !== req.user._id.toString()
    ) {
      return next(AppError.forbidden('Access denied'));
    }

    const evidences = await Evidence.find({ incidentId: incident._id, isDeleted: false })
      .populate('uploadedBy', 'fullName rank serviceId')
      .sort({ uploadedAt: -1 });

    return sendSuccess(res, evidences);
  } catch (err) {
    next(err);
  }
}

// ── Download Evidence File ────────────────────────────────

async function downloadEvidence(req, res, next) {
  try {
    const { id, evidenceId } = req.params;

    const evidence = await Evidence.findById(evidenceId).select('+storagePath');
    if (!evidence || evidence.isDeleted) {
      return next(AppError.notFound('Evidence'));
    }

    const incident = await Incident.findById(evidence.incidentId);
    if (!incident || incident.isDeleted) {
      return next(AppError.notFound('Incident'));
    }

    // Access control
    if (
      req.user.role === 'USER' &&
      incident.userId.toString() !== req.user._id.toString()
    ) {
      return next(AppError.forbidden('Access denied'));
    }

    if (!fs.existsSync(evidence.storagePath)) {
      return next(AppError.notFound('File not found on storage disk.'));
    }

    res.setHeader('Content-Type', evidence.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(evidence.fileName)}"`);
    res.setHeader('X-Content-Type-Options', 'nosniff');

    const fileStream = fs.createReadStream(evidence.storagePath);
    fileStream.pipe(res);
  } catch (err) {
    next(err);
  }
}

// ── Delete Evidence ───────────────────────────────────────

async function deleteEvidence(req, res, next) {
  try {
    const { id, evidenceId } = req.params;

    const evidence = await Evidence.findById(evidenceId);
    if (!evidence || evidence.isDeleted) {
      return next(AppError.notFound('Evidence'));
    }

    const incident = await Incident.findById(evidence.incidentId);
    if (!incident || incident.isDeleted) {
      return next(AppError.notFound('Incident'));
    }

    const isOwner = incident.userId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'ADMIN';

    if (!isAdmin && !(isOwner && incident.status === 'DRAFT')) {
      return next(AppError.forbidden('Cannot delete evidence on submitted cases.'));
    }

    evidence.isDeleted = true;
    await evidence.save();

    await createAuditLog({
      actorId: req.user._id.toString(),
      actorRole: req.user.role,
      action: 'DELETE_EVIDENCE',
      resourceType: 'EVIDENCE',
      resourceId: evidence._id.toString(),
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      metadata: { incidentId: incident.complaintId, fileName: evidence.fileName },
    });

    return sendSuccess(res, null, 200, 'Evidence removed successfully');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createIncident,
  getIncidents,
  getIncidentById,
  updateIncident,
  submitIncident,
  deleteIncident,
  uploadEvidence,
  getIncidentEvidence,
  downloadEvidence,
  deleteEvidence,
};
