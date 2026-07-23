const mongoose = require('mongoose');
const { SENDER_TYPE, REPORT_TARGET_TYPE, REPORT_STATUS } = require('../constants/enums');

const { Schema } = mongoose;

/**
 * Polymorphic moderation entity covering reported products, users, reviews,
 * and messages — a single collection rather than four near-identical ones
 * (ERD §8, Design Decision 5).
 */
const reportSchema = new Schema(
  {
    reporterType: { type: String, enum: SENDER_TYPE, required: true },
    reporterId: { type: Schema.Types.ObjectId, required: true },

    targetType: { type: String, enum: REPORT_TARGET_TYPE, required: true },
    targetId: { type: Schema.Types.ObjectId, required: true },

    reason: { type: String, required: true, maxlength: 500 },
    status: { type: String, enum: REPORT_STATUS, default: 'open', required: true },

    reviewedBy: { type: Schema.Types.ObjectId, ref: 'Admin', default: null },
    resolutionNote: { type: String },
  },
  { timestamps: true }
);

reportSchema.index({ targetType: 1, targetId: 1, status: 1 });

module.exports = mongoose.model('Report', reportSchema);
