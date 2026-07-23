const { Review, Order } = require('../../shared/models');
const { ApiError } = require('../../shared/utils/apiError.util');
const { recalculateAggregateRatings } = require('../../shared/services/ratingAggregationService');
const reportingService = require('../../shared/services/reportingService');

const EDIT_WINDOW_HOURS = 48; // SRS §9 assumption — configurable, no duration was specified

/**
 * FR-6-04 — a buyer may only review a product tied to a completed
 * (delivered) order they placed. This is the purchase-verification gate.
 */
async function createReview(buyerId, { productId, orderId, rating, comment }) {
  const order = await Order.findOne({ _id: orderId, buyerId, status: 'delivered' });
  if (!order) {
    throw ApiError.forbidden('You can only review products from a delivered order you placed', {
      code: 'REVIEW_NOT_ELIGIBLE',
    });
  }
  const purchasedProduct = order.items.find((item) => String(item.productId) === String(productId));
  if (!purchasedProduct) {
    throw ApiError.badRequest('This product was not part of the specified order');
  }

  const existing = await Review.findOne({ buyerId, productId, orderId });
  if (existing) {
    throw ApiError.conflict('You have already reviewed this product for this order');
  }

  const review = await Review.create({
    buyerId,
    sellerId: order.sellerId,
    productId,
    orderId,
    rating,
    comment,
    editWindowExpiresAt: new Date(Date.now() + EDIT_WINDOW_HOURS * 60 * 60 * 1000),
  });

  await recalculateAggregateRatings(order.sellerId, productId);
  return review;
}

/** FR-6-04 — editable "within limited time" (48h, see constant above). */
async function editReview(buyerId, reviewId, { rating, comment }) {
  const review = await Review.findOne({ _id: reviewId, buyerId });
  if (!review) throw ApiError.notFound('Review not found');

  if (!review.isEditable || review.editWindowExpiresAt < new Date()) {
    throw ApiError.forbidden('The edit window for this review has expired', { code: 'REVIEW_EDIT_WINDOW_EXPIRED' });
  }

  if (rating !== undefined) review.rating = rating;
  if (comment !== undefined) review.comment = comment;
  await review.save();

  await recalculateAggregateRatings(review.sellerId, review.productId);
  return review;
}

async function listForProduct(productId) {
  return Review.find({ productId, moderationStatus: 'visible' }).sort({ createdAt: -1 }).lean();
}

async function listForSeller(sellerId) {
  return Review.find({ sellerId, moderationStatus: 'visible' }).sort({ createdAt: -1 }).lean();
}

async function reportReview(buyerId, reviewId, reason) {
  const review = await Review.findById(reviewId);
  if (!review) throw ApiError.notFound('Review not found');
  // Files into the admin moderation queue (Report collection) — does not
  // unilaterally hide the review. Actual removal happens only if an admin
  // actions the report (Admin module, reportService.resolveReport).
  return reportingService.fileReport({
    reporterType: 'buyer',
    reporterId: buyerId,
    targetType: 'review',
    targetId: reviewId,
    reason: reason || 'Reported by buyer',
  });
}

module.exports = { createReview, editReview, listForProduct, listForSeller, reportReview };
