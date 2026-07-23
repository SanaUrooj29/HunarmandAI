/**
 * Standard error shape thrown from services/controllers. errorHandler
 * middleware knows how to serialize this consistently; anything else
 * thrown is treated as an unexpected 500.
 */
class ApiError extends Error {
  constructor(statusCode, message, { code, details } = {}) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code || defaultCodeForStatus(statusCode);
    this.details = details;
    this.isOperational = true; // distinguishes expected failures from bugs
    Error.captureStackTrace(this, ApiError);
  }

  static badRequest(message, opts) { return new ApiError(400, message, opts); }
  static unauthorized(message = 'Unauthorized', opts) { return new ApiError(401, message, opts); }
  static forbidden(message = 'Forbidden', opts) { return new ApiError(403, message, opts); }
  static notFound(message = 'Not found', opts) { return new ApiError(404, message, opts); }
  static conflict(message, opts) { return new ApiError(409, message, opts); }
  static tooManyRequests(message = 'Too many requests', opts) { return new ApiError(429, message, opts); }
  static internal(message = 'Internal server error', opts) { return new ApiError(500, message, opts); }
}

function defaultCodeForStatus(statusCode) {
  const map = {
    400: 'BAD_REQUEST',
    401: 'UNAUTHORIZED',
    403: 'FORBIDDEN',
    404: 'NOT_FOUND',
    409: 'CONFLICT',
    429: 'TOO_MANY_REQUESTS',
    500: 'INTERNAL_ERROR',
  };
  return map[statusCode] || 'ERROR';
}

module.exports = { ApiError };
