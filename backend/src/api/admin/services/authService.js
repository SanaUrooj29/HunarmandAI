const crypto = require('crypto');
const { Admin } = require('../../shared/models');
const { hashPassword, comparePassword } = require('../../shared/utils/hash.util');
const { signAdminToken, decodeToken } = require('../../shared/utils/jwt.util');
const tokenBlacklistService = require('../../shared/services/tokenBlacklistService');
const emailService = require('../../shared/services/emailService');
const { ApiError } = require('../../shared/utils/apiError.util');

const RESET_TOKEN_TTL_MS = 30 * 60 * 1000;

/** Reset tokens are stored hashed (sha256) — same principle as OTP hashing,
 * so a database read alone never yields a usable token. */
function hashResetToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

async function login({ email, password }) {
  const admin = await Admin.findOne({ email }).select('+passwordHash');
  // Constant-shape response whether the email exists or not, to avoid
  // leaking which admin emails are registered.
  if (!admin) throw ApiError.unauthorized('Invalid email or password');

  const isMatch = await comparePassword(password, admin.passwordHash);
  if (!isMatch) throw ApiError.unauthorized('Invalid email or password');

  admin.lastLoginAt = new Date();
  await admin.save();

  const token = signAdminToken({ id: admin._id, role: admin.role });
  return {
    token,
    admin: { id: admin._id, email: admin.email, name: admin.name, role: admin.role },
  };
}

function logout(rawToken) {
  const decoded = decodeToken(rawToken);
  if (decoded?.jti && decoded?.exp) {
    tokenBlacklistService.revoke(decoded.jti, decoded.exp);
  }
}

async function requestPasswordReset({ email }) {
  const admin = await Admin.findOne({ email });
  // Always resolve successfully from the caller's perspective — do not
  // reveal whether the email exists (standard reset-flow practice).
  if (!admin) return;

  const rawToken = crypto.randomBytes(32).toString('hex');
  admin.passwordResetToken = hashResetToken(rawToken);
  admin.passwordResetExpiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);
  await admin.save();

  await emailService.sendPasswordResetEmail({ to: admin.email, resetToken: rawToken });
}

async function resetPassword({ token, newPassword }) {
  const hashedToken = hashResetToken(token);
  const admin = await Admin.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpiresAt: { $gt: new Date() },
  }).select('+passwordHash');

  if (!admin) throw ApiError.badRequest('Password reset token is invalid or has expired');

  admin.passwordHash = await hashPassword(newPassword);
  admin.passwordResetToken = undefined;
  admin.passwordResetExpiresAt = undefined;
  await admin.save();
}

module.exports = { login, logout, requestPasswordReset, resetPassword };
