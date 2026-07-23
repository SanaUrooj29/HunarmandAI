const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 * Junction collection resolving the Buyer <-> Seller M:N messaging
 * relationship (ERD §5.3). Referenced rather than embedded because each
 * pairing has its own unbounded, independently-paginated Message thread.
 */
const conversationSchema = new Schema(
  {
    buyerId: { type: Schema.Types.ObjectId, ref: 'Buyer', required: true },
    sellerId: { type: Schema.Types.ObjectId, ref: 'Seller', required: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', default: null },

    lastMessageSnapshot: { type: String },
    lastMessageAt: { type: Date },

    unreadCountBuyer: { type: Number, default: 0, min: 0 },
    unreadCountSeller: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

conversationSchema.index({ buyerId: 1, sellerId: 1, productId: 1 }, { unique: true });
conversationSchema.index({ sellerId: 1, lastMessageAt: -1 });

module.exports = mongoose.model('Conversation', conversationSchema);
