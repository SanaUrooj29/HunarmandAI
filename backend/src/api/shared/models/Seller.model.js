const mongoose = require('mongoose');
const {
  GENDER,
  VERIFICATION_STATUS,
  ACCOUNT_STATUS,
} = require('../constants/enums');

const { Schema } = mongoose;

/**
 * Embedded wallet subdocument.
 * Kept on the Seller document (not a separate collection) because these are
 * simple running counters read on nearly every seller-portal screen.
 * The append-only ledger lives separately in WalletTransaction.
 * Withdrawal gate: FR-4-04 — withdrawalEnabled flips true only once
 * completedSalesCount >= 2 (enforced in walletService, mirrored here as a cache).
 */
const walletSchema = new Schema(
  {
    availableBalance: { type: Number, required: true, default: 0, min: 0 },
    pendingBalance: { type: Number, required: true, default: 0, min: 0 },
    completedSalesCount: { type: Number, required: true, default: 0, min: 0 },
    withdrawalEnabled: { type: Boolean, required: true, default: false },
  },
  { _id: false }
);

const otpSchema = new Schema(
  {
    code: { type: String, select: false }, // stored hashed — see shared/services/otpService
    expiresAt: { type: Date },
  },
  { _id: false }
);

const sellerSchema = new Schema(
  {
    phone: {
      type: String,
      required: true,
      trim: true,
      match: [/^\+?92\d{10}$/, 'Phone must be a valid Pakistani mobile number'],
    },
    isPhoneVerified: { type: Boolean, required: true, default: false },
    otp: { type: otpSchema, default: () => ({}) },

    username: { type: String, trim: true, maxlength: 60 },
    gender: { type: String, enum: GENDER },
    dateOfBirth: { type: Date },
    // FR-1-04 — set at first registration, changeable later from account settings.
    preferredLanguage: { type: String, enum: ['ur', 'en'], default: 'ur' },

    // NFR-S-04 — encrypted at rest via a Mongoose setter/getter or field-level
    // encryption plugin (wired in shared/database); never returned by default.
    // NOT required at the schema level: per UC-01, an account is created from
    // just a phone number at OTP verification. CNIC and the rest of the
    // profile are completed afterwards in UC-02. `profileComplete` below is
    // the authoritative flag for "has this seller finished onboarding".
    cnic: {
      type: String,
      select: false,
    },

    shopName: { type: String, trim: true, maxlength: 100 },
    city: { type: String, trim: true, index: true },
    productCategory: { type: Schema.Types.ObjectId, ref: 'Category' },
    shopDescription: { type: String, maxlength: 1000 },
    socialMediaLinks: { type: [String], default: [] },
    profilePictureUrl: { type: String },
    // Binary profile picture stored directly in the document for simple/dev setups.
    // `data` holds the raw image buffer; `contentType` stores the MIME type.
    profilePicture: {
      data: { type: Buffer },
      contentType: { type: String },
    },

    // Set true by sellerProfileService once username/cnic/shopName/city/
    // productCategory are all present. Products can't be published (FR-2)
    // and profile can't be marked verified until this is true.
    profileComplete: { type: Boolean, required: true, default: false },

    verificationStatus: { type: String, enum: VERIFICATION_STATUS, default: 'pending', required: true },
    accountStatus: { type: String, enum: ACCOUNT_STATUS, default: 'active', required: true },

    wallet: { type: walletSchema, default: () => ({}) },

    ratingAvg: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

sellerSchema.index({ phone: 1 }, { unique: true });
sellerSchema.index({ cnic: 1 }, { unique: true, sparse: true });
sellerSchema.index({ city: 1, productCategory: 1 });
// TTL-style pruning of expired OTPs is handled by otpService rather than a
// TTL index here, since otp is a subdocument field, not a top-level date.

module.exports = mongoose.model('Seller', sellerSchema);
