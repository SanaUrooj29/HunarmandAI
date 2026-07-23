const { verifyUserToken, verifyAdminToken } = require('../utils/jwt.util');
const { ApiError } = require('../utils/apiError.util');
const { ROLES } = require('../constants/enums');

function extractBearerToken(req) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) {
    throw ApiError.unauthorized('Missing or malformed Authorization header');
  }
  return token;
}

/**
 * Verifies a buyer/seller session token and attaches `req.auth = { id, role }`.
 * Does NOT check which of buyer/seller it is — pair with requireRole() from
 * rbac.middleware.js for that.
 */
function authenticateUser(req, res, next) {
  try {
    const token = extractBearerToken(req);
    const payload = verifyUserToken(token);
    if (![ROLES.BUYER, ROLES.SELLER].includes(payload.role)) {
      throw ApiError.unauthorized('Token is not a valid buyer/seller session');
    }
    req.auth = { id: payload.sub, role: payload.role, jti: payload.jti, exp: payload.exp };
    return next();
  } catch (err) {
    return next(err);
  }
}

/** Verifies an admin session token and attaches `req.auth = { id, role, adminRole }`. */
function authenticateAdmin(req, res, next) {
  try {
    const token = extractBearerToken(req);
    const payload = verifyAdminToken(token);
    if (payload.role !== ROLES.ADMIN) {
      throw ApiError.unauthorized('Token is not a valid admin session');
    }
    req.auth = { id: payload.sub, role: ROLES.ADMIN, adminRole: payload.adminRole, jti: payload.jti, exp: payload.exp };
    return next();
  } catch (err) {
    return next(err);
  }
}

module.exports = { authenticateUser, authenticateAdmin };
