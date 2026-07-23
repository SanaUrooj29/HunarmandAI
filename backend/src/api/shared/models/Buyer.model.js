const mongoose = require('mongoose');
const { ACCOUNT_STATUS } = require('../constants/enums');

const { Schema } = mongoose;

const otpSchema = new Schema(
  {
    code: { type: String, select: false },
    expiresAt: { type: Date },
  },
  { _id: false }
);

/**
 * Saved delivery addresses — not explicitly in the original SRS, but required
 * for checkout to function (see SRS §9 "Missing/Ambiguous Requirements").
 * Embedded because it's a small, bounded list always read with the buyer.
 */
const addressSchema = new Schema(
  {
    label: { type: String, trim: true, maxlength: 40 }, // e.g. "Home", "Office"
    addressLine: { type: String, required: true, trim: true, maxlength: 300 },
    city: { type: String, required: true, trim: true },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: false }
);

/**
 * Cached credibility score (FR-7). Recalculated by credibilityScore.util
 * whenever a relevant event fires: order completion, cancellation, or
 * payment failure (FR-7-03) — never computed live on every read.
 */
const credibilityScoreSchema = new Schema(
  {
    value: { type: Number, required: true, default: 50, min: 0, max: 100 },
    successfulOrders: { type: Number, required: true, default: 0, min: 0 },
    cancelledOrders: { type: Number, required: true, default: 0, min: 0 },
    paymentSuccessRate: { type: Number, required: true, default: 100, min: 0, max: 100 },
    // Internal counters backing paymentSuccessRate — not part of the
    // original ERD's public fields, but required to compute a running
    // rate incrementally (FR-7-03) rather than re-deriving it from a full
    // payment-history scan on every event.
    totalPaymentAttempts: { type: Number, required: true, default: 0, min: 0 },
    successfulPaymentAttempts: { type: Number, required: true, default: 0, min: 0 },
    lastCalculatedAt: { type: Date },
  },
  { _id: false }
);

const buyerSchema = new Schema(
  {
    phone: {
      type: String,
      required: true,
      trim: true,
      match: [/^\+?92\d{10}$/, 'Phone must be a valid Pakistani mobile number'],
    },
    isPhoneVerified: { type: Boolean, required: true, default: false },
    otp: { type: otpSchema, default: () => ({}) },

    name: { type: String, trim: true, maxlength: 60 },
    age: { type: Number, min: 13, max: 120 },
    // FR-1-04 — set at first registration, changeable later from account settings.
    preferredLanguage: { type: String, enum: ['ur', 'en'], default: 'ur' },
    addresses: { type: [addressSchema], default: [] },

    accountStatus: { type: String, enum: ACCOUNT_STATUS, default: 'active', required: true },

    credibilityScore: { type: credibilityScoreSchema, default: () => ({}) },
  },
  { timestamps: true }
);

buyerSchema.index({ phone: 1 }, { unique: true });

module.exports = mongoose.model('Buyer', buyerSchema);
