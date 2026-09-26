/**
 * Auth Routes — SRD Section 7
 * Mounts: /api/v1/auth
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { registerValidators, loginValidators } = require('../validators/authValidators');
const validate = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const { authRateLimiter } = require('../middleware/rateLimiter');

// Public routes (rate limited)
router.post('/register', authRateLimiter, registerValidators, validate, authController.register);
router.post('/login', authRateLimiter, loginValidators, validate, authController.login);
router.post('/refresh', authController.refresh);

// Protected routes
router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.getMe);

module.exports = router;
