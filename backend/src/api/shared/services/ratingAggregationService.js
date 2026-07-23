const { Review, Product, Seller } = require('../models');

/** Recomputes ratingAvg/ratingCount on both the product and the seller from
 * currently-visible reviews. Called after any review create/edit/removal
 * from either the Buyer module (submit/edit) or Admin module (moderate). */
async function recalculateAggregateRatings(sellerId, productId) {
  const productReviews = await Review.find({ productId, moderationStatus: 'visible' }).lean();
  const product = await Product.findById(productId);
  if (product) {
    product.ratingCount = productReviews.length;
    product.ratingAvg = productReviews.length
      ? Math.round((productReviews.reduce((s, r) => s + r.rating, 0) / productReviews.length) * 10) / 10
      : 0;
    await product.save();
  }

  const sellerReviews = await Review.find({ sellerId, moderationStatus: 'visible' }).lean();
  const seller = await Seller.findById(sellerId);
  if (seller) {
    seller.ratingCount = sellerReviews.length;
    seller.ratingAvg = sellerReviews.length
      ? Math.round((sellerReviews.reduce((s, r) => s + r.rating, 0) / sellerReviews.length) * 10) / 10
      : 0;
    await seller.save();
  }
}

module.exports = { recalculateAggregateRatings };
