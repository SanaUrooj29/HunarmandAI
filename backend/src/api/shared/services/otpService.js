const { Seller, Buyer } = require('../models');
const { hashOtp, compareOtp, generateOtpCode } = require('../utils/hash.util');
const { ApiError } = require('../utils/apiError.util');
const { ROLES } = require('../constants/enums');
const smsService = require('./smsService');

const OTP_EXPIRY_MS = 5 * 60 * 1000; // FR-1-02
const MAX_VERIFY_ATTEMPTS = 5; // FR-1-03
const LOCKOUT_MS = 15 * 60 * 1000;

// In-memory attempt tracker for the lockout rule (FR-1-03 / UC-01 E2).
// A single-process cache is acceptable at MVP scale; swap for Redis if the
// backend is horizontally scaled across multiple instances.
const failedAttempts = new Map(); // phone -> { count, lockedUntil }

function getModelForRole(role) {
  if (role === ROLES.SELLER) return Seller;
  if (role === ROLES.BUYER) return Buyer;
  throw ApiError.badRequest('role must be "seller" or "buyer"');
}

function assertNotLockedOut(phone) {
  const entry = failedAttempts.get(phone);
  if (entry?.lockedUntil && entry.lockedUntil > Date.now()) {
    const minutesLeft = Math.ceil((entry.lockedUntil - Date.now()) / 60000);
    throw ApiError.tooManyRequests(`Too many incorrect attempts. Try again in ${minutesLeft} minute(s).`);
  }
}

function registerFailedAttempt(phone) {
  const entry = failedAttempts.get(phone) || { count: 0, lockedUntil: null };
  entry.count += 1;
  if (entry.count >= MAX_VERIFY_ATTEMPTS) {
    entry.lockedUntil = Date.now() + LOCKOUT_MS;
    entry.count = 0;
  }
  failedAttempts.set(phone, entry);
}

function clearFailedAttempts(phone) {
  failedAttempts.delete(phone);
}

/**
 * Requests an OTP for a given phone + role. Creates the account record on
 * first contact (role selection happens client-side before this call —
 * UC-01 Main Flow step 5) but leaves it otherwise empty until profile setup.
 */
async function requestOtp({ phone, role, preferredLanguage }) {
  assertNotLockedOut(phone);
  const Model = getModelForRole(role);

  const code = generateOtpCode();
  const codeHash = await hashOtp(code);
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MS);

  let account = await Model.findOne({ phone });
  const isNewAccount = !account;
  if (!account) {
    account = new Model({ phone, preferredLanguage: preferredLanguage || 'ur' });
  }
  account.otp = { code: codeHash, expiresAt };
  await account.save();

  // FR-1-01 — sends a 6-digit OTP via SMS to a Pakistani mobile number.
  await smsService.sendSms(phone, `Your HunarmandAI verification code is ${code}. It expires in 5 minutes.`);

  return { isNewAccount, expiresAt };
}

/**
 * Verifies an OTP and returns the account document on success.
 * Throws on: expired code, incorrect code (registering a failed attempt),
 * or lockout already in effect.
 */
async function verifyOtp({ phone, role, code }) {
  assertNotLockedOut(phone);
  const Model = getModelForRole(role);

  const account = await Model.findOne({ phone }).select('+otp.code');
  if (!account || !account.otp?.code) {
    throw ApiError.badRequest('No OTP request found for this number. Please request a new code.');
  }
  if (account.otp.expiresAt < new Date()) {
    throw ApiError.badRequest('OTP has expired. Please request a new code.');
  }

  const isMatch = await compareOtp(code, account.otp.code);
  if (!isMatch) {
    registerFailedAttempt(phone);
    throw ApiError.badRequest('Incorrect verification code.');
  }

  clearFailedAttempts(phone);
  account.isPhoneVerified = true;
  account.otp = { code: undefined, expiresAt: undefined };
  await account.save();

  return account;
}

module.exports = { requestOtp, verifyOtp };
