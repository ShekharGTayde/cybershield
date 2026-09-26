/**
 * Custom Application Error Class
 * Extends Error to carry HTTP status codes and error codes.
 */

class AppError extends Error {
  /**
   * @param {string} message - Human-readable error message
   * @param {number} statusCode - HTTP status code
   * @param {string} code - Machine-readable error code (e.g. 'VALIDATION_ERROR')
   * @param {Array}  details - Additional validation detail array
   */
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR', details = []) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true; // Distinguishes expected errors from programming bugs
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message, details = []) {
    return new AppError(message, 400, 'VALIDATION_ERROR', details);
  }

  static unauthorized(message = 'Authentication required') {
    return new AppError(message, 401, 'AUTH_REQUIRED');
  }

  static forbidden(message = 'Access denied') {
    return new AppError(message, 403, 'FORBIDDEN');
  }

  static notFound(resource = 'Resource') {
    return new AppError(`${resource} not found`, 404, 'RESOURCE_NOT_FOUND');
  }

  static conflict(message) {
    return new AppError(message, 409, 'DUPLICATE_RESOURCE');
  }

  static rateLimited() {
    return new AppError('Too many requests. Please try again later.', 429, 'RATE_LIMITED');
  }

  static mlServiceError(message = 'ML service unavailable') {
    return new AppError(message, 503, 'ML_SERVICE_ERROR');
  }

  static internal(message = 'An internal server error occurred') {
    return new AppError(message, 500, 'INTERNAL_ERROR');
  }
}

module.exports = AppError;
