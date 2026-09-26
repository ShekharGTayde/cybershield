/**
 * Rate Limiters — SRD Section 36
 * Separate limiters for auth routes and general API routes.
 */

const rateLimit = require('express-rate-limit');
const { sendError } = require('../utils/response');
const config = require('../config');

const rateLimitHandler = (req, res) => {
  sendError(
    res,
    429,
    'RATE_LIMITED',
    'Too many requests from this IP. Please try again later.'
  );
};

/**
 * Strict limiter for authentication routes
 * Prevents brute-force credential attacks
 */
const authRateLimiter = rateLimit({
  windowMs: config.rateLimit.authWindowMs, // 15 minutes
  max: config.rateLimit.authMax,            // 20 attempts
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
  skipSuccessfulRequests: false,
});

/**
 * General API rate limiter
 */
const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: config.rateLimit.apiMax, // 200 requests
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
  skipSuccessfulRequests: true,
});

/**
 * Strict limiter for ML analysis endpoints
 * Prevents abuse of the ML service
 */
const mlRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

module.exports = { authRateLimiter, apiRateLimiter, mlRateLimiter };
