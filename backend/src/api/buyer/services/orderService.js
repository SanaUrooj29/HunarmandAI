const { Order } = require('../../shared/models');
const orderLifecycleService = require('../../shared/services/orderLifecycleService');
const { ApiError } = require('../../shared/utils/apiError.util');
const { paginationMeta } = require('../../shared/utils/response.util');
const { BUYER_CANCELLABLE_STATUSES } = require('../../shared/constants/enums');

async function listMyOrders(buyerId, { page = 1, limit = 20, status } = {}) {
  const filter = { buyerId };
  if (status) filter.status = status;

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Order.countDocuments(filter),
  ]);
  return { items, meta: paginationMeta({ page, limit, total }) };
}

async function getMyOrderDetail(buyerId, orderId) {
  const order = await Order.findOne({ _id: orderId, buyerId });
  if (!order) throw ApiError.notFound('Order not found');
  return order;
}

/** FR-3-05 / UC-05 Alt Flow — buyer may cancel only before the seller accepts. */
async function cancelMyOrder(buyerId, orderId, reason) {
  const order = await Order.findOne({ _id: orderId, buyerId });
  if (!order) throw ApiError.notFound('Order not found');

  if (!BUYER_CANCELLABLE_STATUSES.includes(order.status)) {
    throw ApiError.badRequest('This order can no longer be cancelled — the seller has already accepted it', {
      code: 'ORDER_NOT_CANCELLABLE',
    });
  }

  return orderLifecycleService.transitionOrder(order, 'cancelled', { reason, cancelledBy: 'buyer' });
}

module.exports = { listMyOrders, getMyOrderDetail, cancelMyOrder };
