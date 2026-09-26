/**
 * Standard API Response Helpers
 * Every route must use these instead of calling res.json() directly.
 * Guarantees consistent response envelope across the entire API.
 */

const { v4: uuidv4 } = require('uuid');

/**
 * Send a success response
 * @param {object} res - Express response
 * @param {*}      data - Payload to return
 * @param {number} statusCode - HTTP status (default 200)
 * @param {string} message - Optional human-readable message
 */
function sendSuccess(res, data, statusCode = 200, message = null) {
  const body = { success: true, data };
  if (message) body.message = message;
  return res.status(statusCode).json(body);
}

/**
 * Send an error response
 * @param {object} res      - Express response
 * @param {number} statusCode
 * @param {string} code     - Machine-readable error code
 * @param {string} message
 * @param {Array}  details  - Validation errors etc.
 */
function sendError(res, statusCode, code, message, details = []) {
  const body = {
    success: false,
    error: {
      code,
      message,
      ...(details.length > 0 ? { details } : {}),
    },
    requestId: uuidv4(),
  };
  return res.status(statusCode).json(body);
}

module.exports = { sendSuccess, sendError };
