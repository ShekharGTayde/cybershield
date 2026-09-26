/**
 * Global Error Handler Middleware
 * Centralizes all error responses.
 * Production mode strips stack traces.
 */

const { sendError } = require('../utils/response');
const logger = require('../utils/logger');
const config = require('../config');

function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return sendError(res, 400, 'VALIDATION_ERROR', 'Validation failed', details);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    return sendError(
      res,
      409,
      'DUPLICATE_RESOURCE',
      `A record with ${field} '${value}' already exists.`
    );
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    return sendError(res, 400, 'VALIDATION_ERROR', `Invalid ${err.path}: ${err.value}`);
  }

  // JWT errors (shouldn't reach here — caught in middleware, but safety net)
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, 401, 'AUTH_REQUIRED', 'Invalid token.');
  }
  if (err.name === 'TokenExpiredError') {
    return sendError(res, 401, 'AUTH_REQUIRED', 'Token has expired.');
  }

  // Multer file errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return sendError(
      res,
      413,
      'FILE_TOO_LARGE',
      `File exceeds maximum allowed size of ${config.maxFileSizeMB}MB.`
    );
  }
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return sendError(res, 400, 'VALIDATION_ERROR', 'Unexpected file field in upload.');
  }

  // Our operational AppError
  if (err.isOperational) {
    return sendError(res, err.statusCode, err.code, err.message, err.details || []);
  }

  // Unknown / programming error — log it but don't expose internals
  logger.error(`Unhandled error: ${err.message}`, { stack: err.stack, url: req.originalUrl });

  const message = config.isProduction
    ? 'An internal server error occurred.'
    : err.message;

  return sendError(res, 500, 'INTERNAL_ERROR', message);
}

module.exports = errorHandler;
