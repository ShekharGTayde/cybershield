/**
 * Incident Input Validators — SRD Section 9 & 10
 */

const { body, param, query } = require('express-validator');

const createIncidentValidators = [
  body('incidentType')
    .notEmpty().withMessage('Incident type is required')
    .isIn([
      'PHISHING', 'FINANCIAL_FRAUD', 'MALWARE', 'IDENTITY_THEFT',
      'SPAM', 'SOCIAL_ENGINEERING', 'ESPIONAGE', 'OPSEC_RISK',
      'MALICIOUS_URL', 'FAKE_EMAIL', 'FAKE_CALL', 'OTHER',
    ]).withMessage('Invalid incident type'),

  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 10, max: 200 }).withMessage('Title must be 10-200 characters'),

  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 20, max: 10000 }).withMessage('Description must be 20-10000 characters'),

  body('incidentDate')
    .notEmpty().withMessage('Incident date is required')
    .isISO8601().withMessage('Incident date must be a valid date (YYYY-MM-DD)'),

  body('incidentTime')
    .optional()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Time must be in HH:MM format'),

  body('channel')
    .optional()
    .isIn(['SMS', 'EMAIL', 'CALL', 'WHATSAPP', 'TELEGRAM', 'WEB', 'APP', 'OTHER'])
    .withMessage('Invalid channel'),

  body('suspectedSource')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Suspected source too long'),

  body('financialLoss')
    .optional()
    .isBoolean().withMessage('financialLoss must be boolean'),

  body('lossAmount')
    .optional()
    .isFloat({ min: 0 }).withMessage('Loss amount must be a positive number'),

  body('currency')
    .optional()
    .isIn(['INR', 'USD', 'EUR', 'GBP']).withMessage('Unsupported currency'),

  body('location')
    .optional()
    .trim()
    .isLength({ max: 300 }).withMessage('Location must not exceed 300 characters'),

  // Offline sync fields
  body('localId').optional().isString(),
];

const updateIncidentValidators = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 10, max: 200 }).withMessage('Title must be 10-200 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ min: 20, max: 10000 }).withMessage('Description must be 20-10000 characters'),

  body('incidentDate')
    .optional()
    .isISO8601().withMessage('Must be a valid date'),

  body('status')
    .optional()
    .isIn([
      'DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'ASSIGNED',
      'INVESTIGATING', 'ACTION_TAKEN', 'RESOLVED', 'CLOSED', 'REJECTED',
    ])
    .withMessage('Invalid incident status'),

  body('note')
    .optional()
    .trim()
    .isLength({ max: 5000 }).withMessage('Note too long'),

  body('assignedOfficerId')
    .optional()
    .isMongoId().withMessage('Invalid officer ID'),
];

const incidentIdParam = [
  param('id')
    .notEmpty().withMessage('Incident ID is required'),
];

const listQueryValidators = [
  query('status').optional().isString(),
  query('priority').optional().isIn(['P1', 'P2', 'P3', 'P4']),
  query('severity').optional().isIn(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be 1-100'),
];

module.exports = {
  createIncidentValidators,
  updateIncidentValidators,
  incidentIdParam,
  listQueryValidators,
};
