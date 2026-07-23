const { ApiError } = require('../utils/apiError.util');
const { sendError } = require('../utils/response.util');
const { env } = require('../config/env');

/** 404 fallback — mounted after all routes. */
function notFoundHandler(req, res, next) {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}

/**
 * Central error handler. Normalizes Mongoose validation/cast errors and
 * duplicate-key errors into the same ApiError envelope as hand-thrown
 * application errors, so every error response has an identical shape.
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  let apiError = err;

  if (err.name === 'ValidationError') {
    // Mongoose schema validation failure
    const details = Object.values(err.errors).map((e) => e.message);
    apiError = ApiError.badRequest('Validation failed', { details });
  } else if (err.name === 'CastError') {
    apiError = ApiError.badRequest(`Invalid value for field "${err.path}"`);
  } else if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    apiError = ApiError.conflict(`A record with this ${field} already exists`);
  } else if (!(err instanceof ApiError)) {
    apiError = ApiError.internal(env.NODE_ENV === 'production' ? 'Something went wrong' : err.message);
  }

  if (!apiError.isOperational) {
    // eslint-disable-next-line no-console
    console.error('[unexpected error]', err);
  }

  return sendError(res, {
    statusCode: apiError.statusCode,
    message: apiError.message,
    code: apiError.code,
    details: apiError.details,
  });
}

module.exports = { notFoundHandler, errorHandler };
