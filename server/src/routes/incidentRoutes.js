/**
 * Incident Routes — SRD Sections 9, 10, 11, 12, 13
 * Mounts: /api/v1/incidents
 */

const express = require('express');
const router = express.Router();
const incidentController = require('../controllers/incidentController');
const {
  createIncidentValidators,
  updateIncidentValidators,
  incidentIdParam,
  listQueryValidators,
} = require('../validators/incidentValidators');
const validate = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const { uploadMultiple } = require('../middleware/upload');
const { apiRateLimiter } = require('../middleware/rateLimiter');

// All incident routes require authentication
router.use(authenticate);

// Incident CRUD
router.post(
  '/',
  apiRateLimiter,
  createIncidentValidators,
  validate,
  incidentController.createIncident
);

router.get(
  '/',
  listQueryValidators,
  validate,
  incidentController.getIncidents
);

router.get(
  '/:id',
  incidentIdParam,
  validate,
  incidentController.getIncidentById
);

router.patch(
  '/:id',
  incidentIdParam,
  updateIncidentValidators,
  validate,
  incidentController.updateIncident
);

router.post(
  '/:id/submit',
  incidentIdParam,
  validate,
  incidentController.submitIncident
);

router.delete(
  '/:id',
  incidentIdParam,
  validate,
  incidentController.deleteIncident
);

// Evidence Sub-routes (SRD Section 13)
router.post(
  '/:id/evidence',
  incidentIdParam,
  validate,
  uploadMultiple,
  incidentController.uploadEvidence
);

router.get(
  '/:id/evidence',
  incidentIdParam,
  validate,
  incidentController.getIncidentEvidence
);

router.get(
  '/:id/evidence/:evidenceId/download',
  incidentController.downloadEvidence
);

router.delete(
  '/:id/evidence/:evidenceId',
  incidentController.deleteEvidence
);

module.exports = router;
