const mongoose = require('mongoose');
const { REVIEW_MODERATION_STATUS } = require('../constants/enums');

const { Schema } = mongoose;

// 1:1 with review — never queried independently, so embedded (ERD §5.1).
const sellerReplySchema = new Schema(
  {
    text: { type: String, required: true, maxlength: 1000 },
    repliedAt: { type: Date, required: true, default: Date.now },
  },
  { _id: false }
);

const reviewSchema = new Schema(
  {
    buyerId: { type: Schema.Types.ObjectId, ref: 'Buyer', required: true },
    sellerId: { type: Schema.Types.ObjectId, ref: 'Seller', required: true, index: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', index: true },
    // FR-6-04 — required to verify a genuine completed purchase before a
    // review can be written; enforced in reviewService, not just here.
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },

    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, maxlength: 1000 },

    sellerReply: { type: sellerReplySchema, default: null },

    isEditable: { type: Boolean, default: true },
    editWindowExpiresAt: { type: Date, required: true },

    moderationStatus: { type: String, enum: REVIEW_MODERATION_STATUS, default: 'visible', required: true },
  },
  { timestamps: true }
);

// A buyer may only leave one review per product per order.
reviewSchema.index({ buyerId: 1, productId: 1, orderId: 1 }, { unique: true, sparse: true });
reviewSchema.index({ sellerId: 1, createdAt: -1 });

module.exports = mongoose.model('Review', reviewSchema);
