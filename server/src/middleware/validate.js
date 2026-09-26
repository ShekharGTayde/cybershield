/**
 * Validation middleware helper
 * Checks express-validator results and returns 400 on failure.
 */

const { validationResult } = require('express-validator');
const { sendError } = require('../utils/response');

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const details = errors.array().map((e) => ({
      field: e.path,
      message: e.msg,
      value: e.value,
    }));
    return sendError(res, 400, 'VALIDATION_ERROR', 'Validation failed', details);
  }
  next();
}

module.exports = validate;
