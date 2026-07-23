const mongoose = require('mongoose');
const { ADMIN_ROLE } = require('../constants/enums');

const { Schema } = mongoose;

const adminSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Must be a valid email address'],
    },
    passwordHash: { type: String, required: true, select: false },
    name: { type: String, required: true, trim: true },
    role: { type: String, enum: ADMIN_ROLE, default: 'admin', required: true },

    passwordResetToken: { type: String, select: false },
    passwordResetExpiresAt: { type: Date },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

adminSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('Admin', adminSchema);
