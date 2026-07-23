const mongoose = require('mongoose');
const { WALLET_TRANSACTION_TYPE, WALLET_TRANSACTION_STATUS } = require('../constants/enums');

const { Schema } = mongoose;

/**
 * Append-only ledger — deliberately a separate collection from Seller
 * (unlike the wallet balance counters, which are embedded). This grows
 * unbounded and must be independently paginated/filtered/reported on
 * (ERD §5.2).
 */
const walletTransactionSchema = new Schema(
  {
    sellerId: { type: Schema.Types.ObjectId, ref: 'Seller', required: true, index: true },
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', default: null },

    type: { type: String, enum: WALLET_TRANSACTION_TYPE, required: true },
    amount: { type: Number, required: true, min: 0 },
    status: { type: String, enum: WALLET_TRANSACTION_STATUS, default: 'pending', required: true, index: true },

    paymentDate: { type: Date },
    // FR-4-03 — set only when platformSettings.walletSettings.manualApprovalRequired is true
    adminApprovedBy: { type: Schema.Types.ObjectId, ref: 'Admin', default: null },
  },
  { timestamps: true }
);

walletTransactionSchema.index({ sellerId: 1, createdAt: -1 });

module.exports = mongoose.model('WalletTransaction', walletTransactionSchema);
