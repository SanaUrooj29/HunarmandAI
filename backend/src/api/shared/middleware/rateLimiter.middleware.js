const { rateLimit, ipKeyGenerator } = require('express-rate-limit');
const { sendError } = require('../utils/response.util');

/** Keys by phone number when present (the meaningful identity for OTP abuse),
 * falling back to an IPv6-safe IP key so the limiter never throws on mixed
 * IPv4/IPv6 traffic. */
function phoneOrIpKey(req) {
  return req.body?.phone || ipKeyGenerator(req.ip);
}

/**
 * FR-1-03 / UC-01 Alt Flow A2 — resend OTP capped at 3 requests per 10
 * minutes per phone number (keyed by request body, falling back to IP).
 */
const otpRequestLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: phoneOrIpKey,
  handler: (req, res) =>
    sendError(res, {
      statusCode: 429,
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many OTP requests. Please wait before requesting another code.',
    }),
});

/**
 * FR-1-03 — OTP verification lockout after 5 consecutive incorrect
 * attempts within a 15-minute window, keyed by phone number.
 * This is a coarse IP/phone-based guard; the authoritative lockout state
 * (per SRS UC-01 Exception E2) is enforced in otpService against the
 * stored attempt counter, not just this middleware.
 */
const otpVerifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: phoneOrIpKey,
  handler: (req, res) =>
    sendError(res, {
      statusCode: 429,
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many incorrect attempts. Please try again in 15 minutes.',
    }),
});

/** General-purpose API limiter — coarse abuse protection on all routes. */
const generalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { otpRequestLimiter, otpVerifyLimiter, generalApiLimiter };
