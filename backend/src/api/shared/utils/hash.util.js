const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { env } = require('../config/env');

const SALT_ROUNDS = 10;
const AES_ALGORITHM = 'aes-256-gcm';

/* ---------------------------------------------------------------------- *
 * Password hashing (Admin.passwordHash) — one-way, bcrypt.
 * ---------------------------------------------------------------------- */
async function hashPassword(plainPassword) {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
}
async function comparePassword(plainPassword, passwordHash) {
  return bcrypt.compare(plainPassword, passwordHash);
}

/* ---------------------------------------------------------------------- *
 * OTP hashing (Seller.otp.code / Buyer.otp.code) — one-way, bcrypt.
 * OTPs are short-lived and low-entropy (6 digits), so bcrypt with a lower
 * cost is sufficient and keeps verification fast under load.
 * ---------------------------------------------------------------------- */
const OTP_SALT_ROUNDS = 8;
async function hashOtp(code) {
  return bcrypt.hash(code, OTP_SALT_ROUNDS);
}
async function compareOtp(code, otpHash) {
  if (!otpHash) return false;
  return bcrypt.compare(code, otpHash);
}
function generateOtpCode() {
  return String(crypto.randomInt(100000, 1000000)); // 6-digit, no leading-zero ambiguity
}

/* ---------------------------------------------------------------------- *
 * CNIC field-level encryption (NFR-S-04) — reversible, AES-256-GCM, so the
 * plaintext CNIC can be recovered for verified regulatory/KYC purposes,
 * while never being stored in plaintext. The key is 32 bytes (64 hex chars).
 * ---------------------------------------------------------------------- */
function getEncryptionKey() {
  const key = Buffer.from(env.CNIC_ENCRYPTION_KEY, 'hex');
  if (key.length !== 32) {
    throw new Error('CNIC_ENCRYPTION_KEY must be a 32-byte (64 hex character) value');
  }
  return key;
}

function encryptCnic(plainCnic) {
  const iv = crypto.randomBytes(12);
  const key = getEncryptionKey();
  const cipher = crypto.createCipheriv(AES_ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(plainCnic, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  // Store iv + authTag + ciphertext together, base64, so it's a single string field.
  return Buffer.concat([iv, authTag, encrypted]).toString('base64');
}

function decryptCnic(encryptedValue) {
  const buf = Buffer.from(encryptedValue, 'base64');
  const iv = buf.subarray(0, 12);
  const authTag = buf.subarray(12, 28);
  const ciphertext = buf.subarray(28);
  const key = getEncryptionKey();
  const decipher = crypto.createDecipheriv(AES_ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return decrypted.toString('utf8');
}

/** NFR-S-04 — mask CNIC in every API response: show only the last 4 digits. */
function maskCnic(plainCnic) {
  if (!plainCnic || plainCnic.length < 4) return '****';
  return `${'*'.repeat(plainCnic.length - 4)}${plainCnic.slice(-4)}`;
}

module.exports = {
  hashPassword,
  comparePassword,
  hashOtp,
  compareOtp,
  generateOtpCode,
  encryptCnic,
  decryptCnic,
  maskCnic,
};
