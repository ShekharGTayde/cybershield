/**
 * JWT Utilities
 * Access token (short-lived) + Refresh token (long-lived, stored in httpOnly cookie)
 */

const jwt = require('jsonwebtoken');
const config = require('../config');
const AppError = require('./AppError');

/**
 * Sign an access token for a user
 */
function signAccessToken(payload) {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.accessExpiresIn,
    issuer: 'cybershield',
    audience: 'cybershield-client',
  });
}

/**
 * Sign a refresh token for a user
 */
function signRefreshToken(payload) {
  return jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
    issuer: 'cybershield',
    audience: 'cybershield-client',
  });
}

/**
 * Verify an access token
 * @throws {AppError} 401 if invalid or expired
 */
function verifyAccessToken(token) {
  try {
    return jwt.verify(token, config.jwt.secret, {
      issuer: 'cybershield',
      audience: 'cybershield-client',
    });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw AppError.unauthorized('Access token has expired. Please refresh.');
    }
    throw AppError.unauthorized('Invalid access token.');
  }
}

/**
 * Verify a refresh token
 * @throws {AppError} 401 if invalid or expired
 */
function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, config.jwt.refreshSecret, {
      issuer: 'cybershield',
      audience: 'cybershield-client',
    });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw AppError.unauthorized('Session expired. Please log in again.');
    }
    throw AppError.unauthorized('Invalid refresh token.');
  }
}

/**
 * Build a minimal JWT payload from a User document
 */
function buildTokenPayload(user) {
  return {
    sub: user._id.toString(),
    role: user.role,
    serviceId: user.serviceId,
  };
}

/**
 * Set the refresh token as an httpOnly cookie on the response
 */
function setRefreshTokenCookie(res, token) {
  res.cookie('cybershield_refresh', token, {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    path: '/api/v1/auth',
  });
}

/**
 * Clear the refresh token cookie
 */
function clearRefreshTokenCookie(res) {
  res.clearCookie('cybershield_refresh', { path: '/api/v1/auth' });
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  buildTokenPayload,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
};
