const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { env } = require('../config/env');
const { ROLES } = require('../constants/enums');
const { ApiError } = require('./apiError.util');
const tokenBlacklistService = require('../services/tokenBlacklistService');

/**
 * Two separate signing secrets/expiries for (buyer|seller) vs admin tokens
 * (SRS §2 assumption: OTP+JWT for buyer/seller, email/password+JWT for
 * admin, kept cryptographically separate so a leaked storefront token can
 * never be replayed against the admin API).
 *
 * Every token carries a `jti` so it can be individually revoked on logout
 * via tokenBlacklistService, rather than relying purely on natural expiry.
 */

function signUserToken({ id, role }) {
  if (![ROLES.BUYER, ROLES.SELLER].includes(role)) {
    throw new Error(`signUserToken called with invalid role: ${role}`);
  }
  const jti = crypto.randomUUID();
  return jwt.sign({ sub: id, role, jti }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
}

function signAdminToken({ id, role }) {
  const jti = crypto.randomUUID();
  return jwt.sign({ sub: id, role: ROLES.ADMIN, adminRole: role, jti }, env.JWT_ADMIN_SECRET, {
    expiresIn: env.JWT_ADMIN_EXPIRES_IN,
  });
}

function verifyUserToken(token) {
  let payload;
  try {
    payload = jwt.verify(token, env.JWT_SECRET);
  } catch (err) {
    throw ApiError.unauthorized('Invalid or expired session token');
  }
  if (tokenBlacklistService.isRevoked(payload.jti)) {
    throw ApiError.unauthorized('This session has been logged out');
  }
  return payload;
}

function verifyAdminToken(token) {
  let payload;
  try {
    payload = jwt.verify(token, env.JWT_ADMIN_SECRET);
  } catch (err) {
    throw ApiError.unauthorized('Invalid or expired admin session token');
  }
  if (tokenBlacklistService.isRevoked(payload.jti)) {
    throw ApiError.unauthorized('This admin session has been logged out');
  }
  return payload;
}

/** Decodes without verifying — used only to read jti/exp during logout, after
 * authenticateUser/authenticateAdmin has already verified the token is valid. */
function decodeToken(token) {
  return jwt.decode(token);
}

module.exports = { signUserToken, signAdminToken, verifyUserToken, verifyAdminToken, decodeToken };
