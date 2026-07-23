const { Seller, Buyer, Product, Order, WalletTransaction } = require('../../shared/models');

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

async function getStats() {
  const todayStart = startOfToday();

  const [
    totalBuyers,
    totalSellers,
    activeSellers,
    pendingSellerVerifications,
    totalProducts,
    activeProducts,
    pendingProducts,
    ordersToday,
    totalOrders,
    completedOrders,
    cancelledOrders,
    pendingWithdrawals,
  ] = await Promise.all([
    Buyer.countDocuments({ accountStatus: { $ne: 'deleted' } }),
    Seller.countDocuments({ accountStatus: { $ne: 'deleted' } }),
    Seller.countDocuments({ accountStatus: 'active' }),
    Seller.countDocuments({ verificationStatus: 'pending' }),
    Product.countDocuments({}),
    Product.countDocuments({ approvalStatus: 'approved' }),
    Product.countDocuments({ approvalStatus: 'pending' }),
    Order.countDocuments({ createdAt: { $gte: todayStart } }),
    Order.countDocuments({}),
    Order.countDocuments({ status: 'delivered' }),
    Order.countDocuments({ status: 'cancelled' }),
    WalletTransaction.countDocuments({ type: 'withdrawal', status: 'pending' }),
  ]);

  const deliveredOrders = await Order.find({ status: 'delivered' }).select('totalAmount').lean();
  const totalRevenue = deliveredOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  return {
    users: { totalBuyers, totalSellers, activeSellers, pendingSellerVerifications },
    products: { totalProducts, activeProducts, pendingProducts },
    orders: { ordersToday, totalOrders, completedOrders, cancelledOrders },
    revenue: { totalRevenue },
    wallet: { pendingWithdrawals },
  };
}

module.exports = { getStats };
