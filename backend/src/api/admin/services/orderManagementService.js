const { Order } = require('../../shared/models');
const orderLifecycleService = require('../../shared/services/orderLifecycleService');
const { ApiError } = require('../../shared/utils/apiError.util');
const { paginationMeta } = require('../../shared/utils/response.util');

async function listOrders({ page = 1, limit = 20, status, buyerId, sellerId, orderNumber } = {}) {
  const filter = {};
  if (status) filter.status = status;
  if (buyerId) filter.buyerId = buyerId;
  if (sellerId) filter.sellerId = sellerId;
  if (orderNumber) filter.orderNumber = orderNumber;

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Order.countDocuments(filter),
  ]);
  return { items, meta: paginationMeta({ page, limit, total }) };
}

async function getOrderDetail(orderId) {
  const order = await Order.findById(orderId);
  if (!order) throw ApiError.notFound('Order not found');
  return order;
}

/**
 * 4.6 — "Resolve disputes". Admin can force-cancel an order regardless of
 * its current status (unlike the buyer's cancel, which is blocked after
 * seller acceptance) — this is exactly the kind of override an admin
 * dispute-resolution tool needs, still routed through the shared lifecycle
 * hook so wallet/notification/credibility side effects stay consistent.
 */
async function resolveDisputeByCancelling(orderId, reason) {
  const order = await Order.findById(orderId);
  if (!order) throw ApiError.notFound('Order not found');
  return orderLifecycleService.adminForceCancel(order, { reason });
}

/**
 * 4.6 — the complementary resolution: force-complete an order in the
 * seller's favor (e.g. buyer disputes non-delivery but seller has proof),
 * releasing wallet funds the same way a normal delivery would.
 */
async function resolveDisputeByDelivering(orderId, note) {
  const order = await Order.findById(orderId);
  if (!order) throw ApiError.notFound('Order not found');
  return orderLifecycleService.adminForceDeliver(order, { note });
}

module.exports = { listOrders, getOrderDetail, resolveDisputeByCancelling, resolveDisputeByDelivering };
