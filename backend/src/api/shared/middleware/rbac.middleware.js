const { ApiError } = require('../utils/apiError.util');

/**
 * Role gate — use after authenticateUser/authenticateAdmin.
 * Example: router.post('/products', authenticateUser, requireRole('seller'), ...)
 */
function requireRole(...allowedRoles) {
  return function roleGate(req, res, next) {
    if (!req.auth) {
      return next(ApiError.unauthorized('Authentication required'));
    }
    if (!allowedRoles.includes(req.auth.role)) {
      return next(ApiError.forbidden(`This action requires one of the following roles: ${allowedRoles.join(', ')}`));
    }
    return next();
  };
}

/**
 * Ownership gate — ensures req.auth.id matches a resource-owning field the
 * caller resolved earlier in the chain (e.g. req.resourceOwnerId set by a
 * prior "load the resource" middleware). Prevents a seller reading/writing
 * another seller's product, order, or wallet record (NFR-S-03).
 */
function requireOwnership(getOwnerId) {
  return function ownershipGate(req, res, next) {
    const ownerId = typeof getOwnerId === 'function' ? getOwnerId(req) : req.resourceOwnerId;
    if (!ownerId || String(ownerId) !== String(req.auth.id)) {
      return next(ApiError.forbidden('You do not have access to this resource'));
    }
    return next();
  };
}

module.exports = { requireRole, requireOwnership };
