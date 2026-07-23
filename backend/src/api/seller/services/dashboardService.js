const { Product, Order, Seller, Review } = require('../../shared/models');
const { ApiError } = require('../../shared/utils/apiError.util');

/**
 * FR-7 — Seller dashboard aggregating KPIs for the current month:
 * revenue, orders, products, and average rating.
 */
async function getDashboard(sellerId) {
  const seller = await Seller.findById(sellerId);
  if (!seller) throw ApiError.notFound('Seller not found');

  // Current month range
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  // This week range (last 7 days)
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - 7);

  // Fetch aggregated data
  const [
    allProducts,
    monthlyOrders,
    weeklyOrdersCount,
    reviews,
  ] = await Promise.all([
    Product.find({ sellerId }).select('stockStatus'),
    Order.find({
      sellerId,
      createdAt: { $gte: monthStart, $lte: monthEnd },
    }).select('totalAmount'),
    Order.countDocuments({
      sellerId,
      createdAt: { $gte: weekStart },
    }),
    Review.find({ sellerId }).select('rating'),
  ]);

  const thisMonthRevenuePkr = monthlyOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const productStats = {
    total: allProducts.length,
    active: allProducts.filter(p => p.stockStatus === 'in_stock').length,
    inactive: allProducts.filter(p => p.stockStatus === 'out_of_stock').length,
    outOfStock: allProducts.filter(p => p.stockStatus === 'out_of_stock').length,
    drafts: 0, // Drafts are typically unsaved products, not stored in DB
  };

  const averageRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length : 0;
  const reviewCount = reviews.length;

  return {
    thisMonthRevenuePkr,
    revenueGrowthRate: 0, // Can be calculated by comparing to previous month if needed
    pendingPayoutPkr: seller.wallet?.pendingBalance || 0,
    ordersThisWeek: weeklyOrdersCount,
    products: productStats,
    averageRating: Math.round(averageRating * 10) / 10,
    reviewCount,
  };
}

module.exports = { getDashboard };
