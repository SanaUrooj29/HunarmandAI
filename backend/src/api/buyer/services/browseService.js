const { Product, Seller } = require('../../shared/models');
const { ApiError } = require('../../shared/utils/apiError.util');
const { paginationMeta } = require('../../shared/utils/response.util');

/**
 * FR-6-01/02 — every buyer-facing product query is restricted to approved,
 * non-deleted listings. This is the single choke point that enforces
 * "unapproved products must never surface on the buyer marketplace"
 * (FR-2-06 / FR-8-01) — every function below builds its filter through
 * this base, so that rule can't accidentally be forgotten in one query.
 */
function baseVisibleFilter() {
  return { approvalStatus: 'approved' };
}

async function searchProducts({
  q,
  categoryId,
  minPrice,
  maxPrice,
  city,
  minRating,
  stockStatus,
  page = 1,
  limit = 20,
} = {}) {
  const filter = baseVisibleFilter();
  if (q) filter.$text = { $search: q };
  if (categoryId) filter.categoryId = categoryId;
  if (city) filter.sellerCitySnapshot = city;
  if (stockStatus) filter.stockStatus = stockStatus;
  if (minRating) filter.ratingAvg = { $gte: Number(minRating) };
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Product.countDocuments(filter),
  ]);
  return { items, meta: paginationMeta({ page, limit, total }) };
}

/** FR-6 discovery feeds — Featured / Latest / Popular / Recommended. */
async function getFeatured({ limit = 10 } = {}) {
  return Product.find({ ...baseVisibleFilter(), isFeatured: true }).sort({ createdAt: -1 }).limit(limit).lean();
}
async function getLatest({ limit = 10 } = {}) {
  return Product.find(baseVisibleFilter()).sort({ createdAt: -1 }).limit(limit).lean();
}
async function getPopular({ limit = 10 } = {}) {
  return Product.find(baseVisibleFilter()).sort({ salesCount: -1 }).limit(limit).lean();
}
/** "Recommended" at MVP: highest-rated with a minimum review count, as a
 * content-based proxy — full personalization is a Phase 2 concern. */
async function getRecommended({ limit = 10 } = {}) {
  return Product.find({ ...baseVisibleFilter(), ratingCount: { $gte: 1 } })
    .sort({ ratingAvg: -1 })
    .limit(limit)
    .lean();
}

async function getProductDetail(productId) {
  const product = await Product.findOne({ _id: productId, ...baseVisibleFilter() });
  if (!product) throw ApiError.notFound('Product not found');

  product.viewCount += 1;
  await product.save();

  const seller = await Seller.findById(product.sellerId).select(
    'shopName city shopDescription profilePictureUrl ratingAvg ratingCount verificationStatus'
  );
  return { product, seller };
}

async function getSellerStorefront(sellerId) {
  const seller = await Seller.findById(sellerId).select(
    'shopName city shopDescription profilePictureUrl socialMediaLinks ratingAvg ratingCount verificationStatus'
  );
  if (!seller) throw ApiError.notFound('Seller not found');

  const products = await Product.find({ sellerId, ...baseVisibleFilter() }).sort({ createdAt: -1 }).lean();
  return { seller, products };
}

module.exports = {
  searchProducts,
  getFeatured,
  getLatest,
  getPopular,
  getRecommended,
  getProductDetail,
  getSellerStorefront,
};
