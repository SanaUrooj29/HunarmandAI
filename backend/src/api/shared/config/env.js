require('dotenv').config();

/**
 * Single source of truth for environment variables. Fails fast at boot if a
 * required variable is missing, rather than surfacing a confusing runtime
 * error deep inside a service later.
 */

const REQUIRED_IN_PRODUCTION = [
  'MONGODB_URI',
  'JWT_SECRET',
  'JWT_ADMIN_SECRET',
  'CNIC_ENCRYPTION_KEY',
  'CLAUDE_API_KEY',
  'TWILIO_ACCOUNT_SID',
  'TWILIO_AUTH_TOKEN',
  'STORAGE_BUCKET',
  'STORAGE_ACCESS_KEY_ID',
  'STORAGE_SECRET_ACCESS_KEY',
  'JAZZCASH_MERCHANT_ID',
  'JAZZCASH_PASSWORD',
  'JAZZCASH_INTEGRITY_SALT',
  'EASYPAISA_STORE_ID',
  'EASYPAISA_HASH_KEY',
];

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 5000,

  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hunarmandai_dev',

  JWT_SECRET: process.env.JWT_SECRET || 'dev-only-buyer-seller-secret-change-me',
  JWT_ADMIN_SECRET: process.env.JWT_ADMIN_SECRET || 'dev-only-admin-secret-change-me',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  JWT_ADMIN_EXPIRES_IN: process.env.JWT_ADMIN_EXPIRES_IN || '12h',

  // Separate secret (not JWT_SECRET) for signing short-lived checkout
  // intents that travel through third-party payment gateways as an opaque
  // reference — kept distinct so a compromised checkout token can never be
  // replayed as a session token, or vice versa.
  CHECKOUT_TOKEN_SECRET: process.env.CHECKOUT_TOKEN_SECRET || 'dev-only-checkout-secret-change-me',
  CHECKOUT_TOKEN_EXPIRES_IN: process.env.CHECKOUT_TOKEN_EXPIRES_IN || '30m',

  // NFR-S-04 — CNIC field-level encryption key (AES-256, 32-byte hex string expected)
  CNIC_ENCRYPTION_KEY: process.env.CNIC_ENCRYPTION_KEY || '0'.repeat(64),

  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  GEMINI_MODEL: process.env.GEMINI_MODEL || 'gemini-3.5-flash',
  GEMINI_VISION_TIMEOUT_MS: parseInt(process.env.GEMINI_VISION_TIMEOUT_MS || '0', 10),
  GEMINI_MAX_IMAGE_SIZE_MB: parseInt(process.env.GEMINI_MAX_IMAGE_SIZE_MB || '1', 10),

  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID || '',
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN || '',
  // Either a purchased Twilio number (E.164, e.g. +15551234567) OR a
  // Messaging Service SID (starts with "MG...") — a Messaging Service is
  // Twilio's recommended setup for production (handles sender selection,
  // retries, and geographic permissions for sending to Pakistani numbers).
  // If both are set, the Messaging Service SID takes priority.
  TWILIO_FROM_NUMBER: process.env.TWILIO_FROM_NUMBER || '',
  TWILIO_MESSAGING_SERVICE_SID: process.env.TWILIO_MESSAGING_SERVICE_SID || '',
  // Used only for Admin password-reset emails (UC/FR do not name a specific
  // provider — generic REST-based transactional email API assumed, same
  // pattern as the SMS gateway).
  EMAIL_API_KEY: process.env.EMAIL_API_KEY || '',
  EMAIL_BASE_URL: process.env.EMAIL_BASE_URL || '',
  EMAIL_FROM_ADDRESS: process.env.EMAIL_FROM_ADDRESS || 'no-reply@hunarmandai.pk',
  ADMIN_RESET_PASSWORD_URL: process.env.ADMIN_RESET_PASSWORD_URL || 'http://localhost:3000/admin/reset-password',

  STORAGE_PROVIDER: process.env.STORAGE_PROVIDER || 's3-compatible',
  STORAGE_BUCKET: process.env.STORAGE_BUCKET || 'hunarmandai-dev',
  STORAGE_REGION: process.env.STORAGE_REGION || 'auto',
  STORAGE_ENDPOINT: process.env.STORAGE_ENDPOINT || '',
  STORAGE_ACCESS_KEY_ID: process.env.STORAGE_ACCESS_KEY_ID || '',
  STORAGE_SECRET_ACCESS_KEY: process.env.STORAGE_SECRET_ACCESS_KEY || '',
  STORAGE_CDN_BASE_URL: process.env.STORAGE_CDN_BASE_URL || '',

  JAZZCASH_MERCHANT_ID: process.env.JAZZCASH_MERCHANT_ID || '',
  JAZZCASH_PASSWORD: process.env.JAZZCASH_PASSWORD || '',
  JAZZCASH_INTEGRITY_SALT: process.env.JAZZCASH_INTEGRITY_SALT || '',
  JAZZCASH_BASE_URL: process.env.JAZZCASH_BASE_URL || 'https://sandbox.jazzcash.com.pk',

  EASYPAISA_STORE_ID: process.env.EASYPAISA_STORE_ID || '',
  EASYPAISA_HASH_KEY: process.env.EASYPAISA_HASH_KEY || '',
  EASYPAISA_BASE_URL: process.env.EASYPAISA_BASE_URL || 'https://sandbox.easypaisa.com.pk',

  CARD_GATEWAY_API_KEY: process.env.CARD_GATEWAY_API_KEY || '',
  CARD_GATEWAY_BASE_URL: process.env.CARD_GATEWAY_BASE_URL || '',

  CORS_ORIGINS: (process.env.CORS_ORIGINS || 'http://localhost:3000').split(',').map((s) => s.trim()),
};

function assertRequiredEnv() {
  if (env.NODE_ENV !== 'production') return;
  const missing = REQUIRED_IN_PRODUCTION.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables in production: ${missing.join(', ')}`);
  }
}

module.exports = { env, assertRequiredEnv };
