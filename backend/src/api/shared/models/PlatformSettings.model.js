const mongoose = require('mongoose');

const { Schema } = mongoose;

const paymentMethodsSchema = new Schema(
  {
    creditCard: { type: Boolean, default: true },
    jazzCash: { type: Boolean, default: true },
    easyPaisa: { type: Boolean, default: true },
  },
  { _id: false }
);

const walletSettingsSchema = new Schema(
  {
    minWithdrawalAmount: { type: Number, default: 500, min: 0 },
    // FR-4-04
    requiredSuccessfulSalesForWithdrawal: { type: Number, default: 2, min: 0 },
    manualApprovalRequired: { type: Boolean, default: false },
  },
  { _id: false }
);

const otpSettingsSchema = new Schema(
  {
    expiryMinutes: { type: Number, default: 5, min: 1 },
    maxAttempts: { type: Number, default: 5, min: 1 },
  },
  { _id: false }
);

const aiSettingsSchema = new Schema(
  {
    autoGenerateEnabled: { type: Boolean, default: true },
  },
  { _id: false }
);

const notificationTemplateSchema = new Schema(
  {
    eventType: { type: String, required: true },
    title: { type: String, required: true },
    body: { type: String },
  },
  { _id: false }
);

/**
 * Singleton document — enforced at the application layer (settingsService
 * always upserts a single well-known _id) rather than via a unique index,
 * since MongoDB has no native "exactly one document" constraint.
 */
const platformSettingsSchema = new Schema(
  {
    paymentMethods: { type: paymentMethodsSchema, default: () => ({}) },
    walletSettings: { type: walletSettingsSchema, default: () => ({}) },
    otpSettings: { type: otpSettingsSchema, default: () => ({}) },
    aiSettings: { type: aiSettingsSchema, default: () => ({}) },

    // FR-4-03 — optional; 0/undefined means commission is effectively disabled
    platformCommissionPercentage: { type: Number, default: 0, min: 0, max: 100 },

    notificationTemplates: { type: [notificationTemplateSchema], default: [] },

    termsAndConditions: { type: String },
    privacyPolicy: { type: String },
  },
  { timestamps: { createdAt: false, updatedAt: true } }
);

module.exports = mongoose.model('PlatformSettings', platformSettingsSchema);
