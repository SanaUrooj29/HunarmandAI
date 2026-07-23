const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 * Embedded junction realizing the Buyer <-> Product M:N relationship for
 * cart contents (ERD §5.3). Always read/written as a whole with the cart,
 * so it's embedded rather than a separate collection.
 */
const cartItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    sellerId: { type: Schema.Types.ObjectId, ref: 'Seller', required: true },
    titleSnapshot: { type: String, required: true },
    priceSnapshot: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    imageSnapshot: { type: String },
  },
  { timestamps: false }
);

const cartSchema = new Schema(
  {
    buyerId: { type: Schema.Types.ObjectId, ref: 'Buyer', required: true },
    items: { type: [cartItemSchema], default: [] },
  },
  { timestamps: true }
);

cartSchema.index({ buyerId: 1 }, { unique: true });

module.exports = mongoose.model('Cart', cartSchema);
