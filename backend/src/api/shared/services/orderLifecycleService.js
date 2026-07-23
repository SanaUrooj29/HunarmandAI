const { ORDER_STATUS } = require('../constants/enums');
const { ApiError } = require('../utils/apiError.util');
const { Seller, WalletTransaction } = require('../models');
const notificationService = require('./notificationService');
const credibilityScoreService = require('./credibilityScoreService');

/**
 * FR-3-01 — valid forward transitions. Cancellation is handled separately
 * (allowed only from `pending`, per FR-3-05 / UC-05 Alt Flow, buyer-side;
 * seller can also reject from `pending`, which is functionally the same
 * transition with a different actor).
 */
const ALLOWED_TRANSITIONS = Object.freeze({
  pending: ['accepted', 'cancelled'],
  accepted: ['preparing', 'cancelled'],
  preparing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
});

function assertValidTransition(currentStatus, nextStatus) {
  const allowed = ALLOWED_TRANSITIONS[currentStatus] || [];
  if (!allowed.includes(nextStatus)) {
    throw ApiError.badRequest(`Cannot transition order from "${currentStatus}" to "${nextStatus}"`);
  }
}

/**
 * Appends a status history event and updates the order's current status.
 * Does NOT save — caller controls the transaction boundary alongside any
 * side effects (wallet updates, notifications) via the `on*` hooks below.
 */
function applyTransition(order, nextStatus, note) {
  assertValidTransition(order.status, nextStatus);
  order.status = nextStatus;
  order.statusHistory.push({ status: nextStatus, changedAt: new Date(), note });
  return order;
}

/**
 * UC-06 step 6 — on delivery, move the order's credited amount from the
 * seller's pending wallet balance to their available balance, mark the
 * corresponding WalletTransaction completed, and increment
 * completedSalesCount (which gates withdrawal eligibility — FR-4-04).
 */
async function onDelivered(order) {
  const walletTxn = await WalletTransaction.findOne({ orderId: order._id, type: 'credit_sale' });
  const seller = await Seller.findById(order.sellerId);
  if (!seller) return;

  if (walletTxn && walletTxn.status === 'pending') {
    walletTxn.status = 'completed';
    walletTxn.paymentDate = new Date();
    await walletTxn.save();

    seller.wallet.pendingBalance = Math.max(0, seller.wallet.pendingBalance - walletTxn.amount);
    seller.wallet.availableBalance += walletTxn.amount;
  }

  seller.wallet.completedSalesCount += 1;
  if (seller.wallet.completedSalesCount >= 2) {
    seller.wallet.withdrawalEnabled = true;
  }
  await seller.save();

  await notificationService.notify({
    recipientType: 'seller',
    recipientId: seller._id,
    type: 'payment_received',
    title: 'Order delivered — funds released',
    body: `Your balance for order ${order.orderNumber} is now available for withdrawal.`,
    relatedEntity: { type: 'order', id: order._id },
  });

  await credibilityScoreService.recordSuccessfulOrder(order.buyerId);
}

/**
 * Reverses a pending wallet credit if the order is cancelled before
 * delivery (funds were never actually released to available balance, so
 * this simply voids the pending WalletTransaction rather than moving money).
 * Actual buyer payment refund is handled by paymentService (Phase 7, Buyer
 * module) — this hook only concerns the seller-side wallet bookkeeping.
 */
async function onCancelled(order, { reason, cancelledBy }) {
  order.cancellation = { reason, cancelledBy };

  const walletTxn = await WalletTransaction.findOne({ orderId: order._id, type: 'credit_sale', status: 'pending' });
  if (walletTxn) {
    walletTxn.status = 'rejected';
    await walletTxn.save();
  }

  await notificationService.notify({
    recipientType: 'seller',
    recipientId: order.sellerId,
    type: 'order_cancelled',
    title: 'Order cancelled',
    body: `Order ${order.orderNumber} was cancelled${reason ? `: ${reason}` : '.'}`,
    relatedEntity: { type: 'order', id: order._id },
  });
  await notificationService.notify({
    recipientType: 'buyer',
    recipientId: order.buyerId,
    type: 'order_cancelled',
    title: 'Order cancelled',
    body: `Your order ${order.orderNumber} was cancelled${reason ? `: ${reason}` : '.'}`,
    relatedEntity: { type: 'order', id: order._id },
  });

  await credibilityScoreService.recordCancelledOrder(order.buyerId);
}

async function notifyStatusChange(order) {
  await notificationService.notify({
    recipientType: 'buyer',
    recipientId: order.buyerId,
    type: 'order_status_changed',
    title: `Order ${order.orderNumber} is now "${order.status}"`,
    relatedEntity: { type: 'order', id: order._id },
  });
}

/**
 * Single entry point for every status change in the system. Handles the
 * transition, the appropriate side-effect hook, notification, and save —
 * so seller (accept/advance) and buyer (cancel) services never duplicate
 * this logic.
 */
async function transitionOrder(order, nextStatus, { note, reason, cancelledBy } = {}) {
  applyTransition(order, nextStatus, note);

  if (nextStatus === 'delivered') {
    await onDelivered(order);
  } else if (nextStatus === 'cancelled') {
    await onCancelled(order, { reason, cancelledBy });
  }

  await order.save();
  await notifyStatusChange(order);
  return order;
}

/**
 * Admin-only override (4.6 "Resolve disputes"). Unlike transitionOrder,
 * this deliberately bypasses ALLOWED_TRANSITIONS — an admin needs to be
 * able to cancel a dispute even from `shipped` (e.g. a lost/damaged
 * package), which is not a transition any normal actor should be able to
 * trigger. Still runs the same onCancelled side effects for consistency.
 */
async function adminForceCancel(order, { reason }) {
  if (['delivered', 'cancelled'].includes(order.status)) {
    throw ApiError.badRequest(`Order is already ${order.status} and cannot be modified`);
  }
  order.status = 'cancelled';
  order.statusHistory.push({ status: 'cancelled', changedAt: new Date(), note: `[Admin dispute resolution] ${reason || ''}`.trim() });

  await onCancelled(order, { reason, cancelledBy: 'system' });
  await order.save();
  await notifyStatusChange(order);
  return order;
}

/**
 * Admin-only override, complement to adminForceCancel — resolves a dispute
 * in the seller's favor (e.g. buyer claims non-delivery but seller has
 * proof of delivery) by force-completing the order and releasing wallet
 * funds, bypassing ALLOWED_TRANSITIONS for the same reason as above.
 */
async function adminForceDeliver(order, { note }) {
  if (['delivered', 'cancelled'].includes(order.status)) {
    throw ApiError.badRequest(`Order is already ${order.status} and cannot be modified`);
  }
  order.status = 'delivered';
  order.statusHistory.push({ status: 'delivered', changedAt: new Date(), note: `[Admin dispute resolution] ${note || ''}`.trim() });

  await onDelivered(order);
  await order.save();
  await notifyStatusChange(order);
  return order;
}

module.exports = {
  ORDER_STATUS,
  ALLOWED_TRANSITIONS,
  assertValidTransition,
  transitionOrder,
  adminForceCancel,
  adminForceDeliver,
};
