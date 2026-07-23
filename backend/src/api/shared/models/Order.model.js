const mongoose = require('mongoose');
const {
  ORDER_STATUS,
  PAYMENT_METHOD,
  PAYMENT_STATUS,
  CANCELLED_BY,
} = require('../constants/enums');

const { Schema } = mongoose;

/**
 * Embedded junction realizing the Order <-> Product M:N relationship
 * (ERD §5.3). Snapshots title/price at purchase time so later product
 * edits never rewrite order history.
 */
const orderItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    titleSnapshot: { type: String, required: true },
    priceSnapshot: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    subtotal: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

/**
 * Append-only audit trail (FR-3-03). Embedded — small, bounded, always read
 * alongside its parent order for tracking / dispute resolution.
 */
const orderStatusEventSchema = new Schema(
  {
    status: { type: String, enum: ORDER_STATUS, required: true },
    changedAt: { type: Date, required: true, default: Date.now },
    note: { type: String },
  },
  { _id: false }
);

const shippingAddressSchema = new Schema(
  {
    addressLine: { type: String, required: true },
    city: { type: String, required: true },
  },
  { _id: false }
);

// 1:1 with order — never queried independently, so embedded (ERD §5.1).
const paymentSchema = new Schema(
  {
    method: { type: String, enum: PAYMENT_METHOD, required: true },
    status: { type: String, enum: PAYMENT_STATUS, default: 'pending', required: true },
    transactionId: { type: String },
    paidAt: { type: Date },
  },
  { _id: false }
);

const cancellationSchema = new Schema(
  {
    reason: { type: String },
    cancelledBy: { type: String, enum: CANCELLED_BY },
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    orderNumber: { type: String, required: true },
    buyerId: { type: Schema.Types.ObjectId, ref: 'Buyer', required: true, index: true },
    // One seller per order — a multi-seller cart is split into one order
    // per seller at checkout (UC-05 Alt Flow A1 / SRS §9 assumption).
    sellerId: { type: Schema.Types.ObjectId, ref: 'Seller', required: true, index: true },

    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length >= 1,
        message: 'An order must contain at least one item',
      },
    },

    productPrice: { type: Number, required: true, min: 0 },
    deliveryCharges: { type: Number, required: true, default: 0, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },

    shippingAddress: { type: shippingAddressSchema, required: true },

    status: { type: String, enum: ORDER_STATUS, default: 'pending', required: true, index: true },
    statusHistory: { type: [orderStatusEventSchema], default: [] },

    payment: { type: paymentSchema, required: true },
    cancellation: { type: cancellationSchema },
  },
  { timestamps: true }
);

orderSchema.index({ buyerId: 1, createdAt: -1 });
orderSchema.index({ sellerId: 1, status: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 }, { unique: true });

// Keep statusHistory append-only and consistent with `status` — enforced in
// fulfilmentService.transitionStatus(), not in the schema itself, since
// Mongoose pre-save hooks can't easily diff "what changed" for embedded arrays.

module.exports = mongoose.model('Order', orderSchema);
