const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 * Self-referencing category tree (max 2 levels per SRS FR-6-03, e.g.
 * Clothing -> Shawls/Kurtas/Dresses). A simple parent pointer is sufficient
 * at this depth — see ERD §5.2 justification.
 */
const categorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    parentCategory: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
    sortOrder: { type: Number, required: true, default: 0 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active', required: true },
  },
  { timestamps: true }
);

// A category name must be unique among siblings (same parent), not globally —
// e.g. two different top-level categories could each have a "Dresses" child
// in the future without colliding.
categorySchema.index({ name: 1, parentCategory: 1 }, { unique: true });
categorySchema.index({ parentCategory: 1, sortOrder: 1 });

module.exports = mongoose.model('Category', categorySchema);
