/**
 * Auth Input Validators — SRD Section 7
 * Uses express-validator chains.
 */

const { body } = require('express-validator');

const registerValidators = [
  body('fullName')
    .trim()
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Full name must be 2-100 characters'),

  body('serviceId')
    .trim()
    .notEmpty().withMessage('Service ID is required')
    .isLength({ min: 3, max: 30 }).withMessage('Service ID must be 3-30 characters')
    .matches(/^[A-Za-z0-9\-]+$/).withMessage('Service ID must contain only letters, numbers, and hyphens'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email address')
    .normalizeEmail(),

  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .isLength({ min: 7, max: 20 }).withMessage('Phone must be 7-20 characters'),

  body('userType')
    .notEmpty().withMessage('User type is required')
    .isIn(['DEFENCE_PERSONNEL', 'FAMILY_MEMBER', 'VETERAN', 'CIVILIAN_STAFF'])
    .withMessage('Invalid user type'),

  body('organization')
    .optional()
    .trim()
    .isLength({ max: 150 }).withMessage('Organization must not exceed 150 characters'),

  body('rank')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Rank must not exceed 50 characters'),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\-_#^()])/)
    .withMessage('Password must contain uppercase, lowercase, number, and special character'),

  body('confirmPassword')
    .notEmpty().withMessage('Confirm password is required')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),

  body('securityQuestion')
    .optional()
    .trim()
    .isLength({ max: 300 }).withMessage('Security question too long'),

  body('securityAnswer')
    .optional()
    .trim()
    .isLength({ max: 300 }).withMessage('Security answer too long'),
];

const loginValidators = [
  body('serviceId')
    .trim()
    .notEmpty().withMessage('Service ID is required'),

  body('password')
    .notEmpty().withMessage('Password is required'),
];

module.exports = { registerValidators, loginValidators };
