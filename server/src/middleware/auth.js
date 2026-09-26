/**
 * Authentication & Authorization Middleware
 * authenticate — verifies JWT access token
 * authorize    — enforces role-based access control
 */

const { verifyAccessToken } = require('../utils/jwt');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

/**
 * authenticate
 * Reads Bearer token from Authorization header,
 * verifies it, and attaches req.user.
 */
async function authenticate(req, res, next) {
  try {
    // 1. Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(AppError.unauthorized('No authentication token provided.'));
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return next(AppError.unauthorized('Malformed authorization header.'));
    }

    // 2. Verify token
    const payload = verifyAccessToken(token);

    // 3. Fetch fresh user from DB (catches deactivated/deleted accounts)
    const user = await User.findById(payload.sub).select(
      '+isActive +role +serviceId +fullName'
    );

    if (!user) {
      return next(AppError.unauthorized('User account not found.'));
    }

    if (!user.isActive) {
      return next(AppError.unauthorized('Your account has been deactivated. Contact administration.'));
    }

    // 4. Attach to request
    req.user = user;
    next();
  } catch (err) {
    // AppErrors from verifyAccessToken pass through; unexpected errors get wrapped
    if (err.isOperational) return next(err);
    logger.error(`authenticate middleware error: ${err.message}`);
    return next(AppError.unauthorized('Authentication failed.'));
  }
}

/**
 * authorize(...roles)
 * Middleware factory — only allows users with specified roles.
 * Must be used AFTER authenticate.
 *
 * Usage: router.get('/admin', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), handler)
 */
function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(AppError.unauthorized('Authentication required.'));
    }

    if (!roles.includes(req.user.role)) {
      logger.warn(
        `RBAC denied: user ${req.user.serviceId} (role=${req.user.role}) attempted ${req.method} ${req.originalUrl}`
      );
      return next(
        AppError.forbidden(
          `Access denied. Required role: ${roles.join(' or ')}.`
        )
      );
    }

    next();
  };
}

/**
 * optionalAuth
 * Tries to authenticate but does not fail if no token is present.
 * Used on routes that work for both guests and authenticated users.
 */
async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      return next();
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub);
    req.user = user || null;
  } catch {
    req.user = null;
  }
  next();
}

module.exports = { authenticate, authorize, optionalAuth };
