/**
 * Wraps an async Express handler so any rejected promise is forwarded to
 * next(), reaching errorHandler.middleware.js instead of crashing the
 * process or requiring a try/catch in every single controller.
 *
 * Usage: router.get('/x', asyncHandler(controller.getX));
 */
function asyncHandler(fn) {
  return function wrapped(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = { asyncHandler };
