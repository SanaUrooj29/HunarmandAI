const { Order, Buyer } = require('../../shared/models');
const orderLifecycleService = require('../../shared/services/orderLifecycleService');
const { ApiError } = require('../../shared/utils/apiError.util');
const { paginationMeta } = require('../../shared/utils/response.util');

async function listMyOrders(sellerId, { page = 1, limit = 20, status } = {}) {
  const filter = { sellerId };
  if (status) filter.status = status;

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Order.countDocuments(filter),
  ]);
  return { items, meta: paginationMeta({ page, limit, total }) };
}

async function findOwnedOrder(sellerId, orderId) {
  const order = await Order.findOne({ _id: orderId, sellerId });
  if (!order) throw ApiError.notFound('Order not found');
  return order;
}

/** FR-7-02 — surfaces the buyer's credibility score alongside order detail. */
async function getMyOrderDetail(sellerId, orderId) {
  const order = await findOwnedOrder(sellerId, orderId);
  const buyer = await Buyer.findById(order.buyerId).select('name phone credibilityScore').lean();
  return { order, buyer };
}

/** UC-06 Main Flow step 1-2 */
async function acceptOrder(sellerId, orderId) {
  const order = await findOwnedOrder(sellerId, orderId);
  return orderLifecycleService.transitionOrder(order, 'accepted');
}

/** UC-06 Alt Flow A2 — seller rejects, triggering an automatic refund path (Buyer module, Phase 7). */
async function rejectOrder(sellerId, orderId, reason) {
  const order = await findOwnedOrder(sellerId, orderId);
  return orderLifecycleService.transitionOrder(order, 'cancelled', { reason, cancelledBy: 'seller' });
}

/** UC-06 Main Flow steps 3-5 — advance through preparing -> shipped -> delivered. */
async function advanceStatus(sellerId, orderId, nextStatus, { note, courierName, trackingReference } = {}) {
  const order = await findOwnedOrder(sellerId, orderId);

  // FR-3-04 — optional courier info, recorded only when marking as shipped.
  // Folded into the status-event note rather than bypassing the shared
  // transition helper, so validation and buyer notification still run.
  let combinedNote = note;
  if (nextStatus === 'shipped' && (courierName || trackingReference)) {
    const courierNote = [courierName && `Courier: ${courierName}`, trackingReference && `Tracking: ${trackingReference}`]
      .filter(Boolean)
      .join(' | ');
    combinedNote = [note, courierNote].filter(Boolean).join(' — ');
  }

  return orderLifecycleService.transitionOrder(order, nextStatus, { note: combinedNote });
}

module.exports = { listMyOrders, getMyOrderDetail, acceptOrder, rejectOrder, advanceStatus };
