const { validationResult } = require('express-validator');
const { ApiError } = require('../utils/apiError.util');

/**
 * Runs after an array of express-validator chains (defined per-panel in
 * each module's validators/ directory) and converts failures into a single
 * ApiError, so controllers never need to call validationResult() themselves.
 *
 * Usage: router.post('/x', [body('email').isEmail()], validate, controller.x)
 */
function validate(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  const details = result.array().map((e) => ({ field: e.path, message: e.msg }));
  console.log('[validate.middleware] VALIDATION FAILED for', req.method, req.path);
  console.log('[validate.middleware] Request body:', JSON.stringify(req.body, null, 2));
  console.log('[validate.middleware] Validation errors:', JSON.stringify(details, null, 2));
  return next(ApiError.badRequest('Request validation failed', { details }));
}

module.exports = { validate };
