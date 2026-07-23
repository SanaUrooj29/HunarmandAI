const mongoose = require('mongoose');
const { PRODUCT_APPROVAL_STATUS, STOCK_STATUS } = require('../constants/enums');

const { Schema } = mongoose;

const productSchema = new Schema(
  {
    sellerId: { type: Schema.Types.ObjectId, ref: 'Seller', required: true, index: true },
    // Denormalized alongside categoryNameSnapshot for the same reason: the
    // buyer marketplace filters by city (FR-6-02) on every browse request,
    // and a Product->Seller join on that hot path is exactly what these
    // snapshots exist to avoid.
    sellerCitySnapshot: { type: String, required: true, index: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    // Denormalized for fast filter rendering without a join — kept in sync
    // via a Mongoose pre-save hook / categoryService whenever categoryId changes.
    categoryNameSnapshot: { type: String, required: true },

    title: { type: String, required: true, trim: true, maxlength: 150 },
    description: { type: String, required: true, maxlength: 3000 },
    isAiGenerated: { type: Boolean, required: true, default: false },

    images: {
      type: [String],
      required: true,
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length >= 1,
        message: 'At least one product image is required',
      },
    },
    videoUrl: { type: String },

    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, default: 0, min: 0 },
    stockStatus: { type: String, enum: STOCK_STATUS, default: 'in_stock', required: true },

    tags: { type: [String], default: [] },

    approvalStatus: { type: String, enum: PRODUCT_APPROVAL_STATUS, default: 'pending', required: true },
    rejectionReason: { type: String },

    isFeatured: { type: Boolean, default: false },
    viewCount: { type: Number, default: 0, min: 0 },
    salesCount: { type: Number, default: 0, min: 0 },

    ratingAvg: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

// FR-6-01 — full-text search across title/description/tags (Urdu + English)
productSchema.index({ title: 'text', description: 'text', tags: 'text' });
// FR-6-02 — compound filter: category + price + availability, restricted to approved listings
productSchema.index({ categoryId: 1, approvalStatus: 1, stockStatus: 1, price: 1 });
productSchema.index({ sellerCitySnapshot: 1, approvalStatus: 1 });
productSchema.index({ isFeatured: 1, createdAt: -1 });
productSchema.index({ salesCount: -1 });

// Business rule (FR-2-06 / FR-8-01): unapproved products must never surface
// on the buyer marketplace. Enforced at the query layer (buyer services
// always filter approvalStatus: 'approved'), not by hiding the field itself.

module.exports = mongoose.model('Product', productSchema);
