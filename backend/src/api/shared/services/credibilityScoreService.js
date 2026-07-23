const { Buyer } = require('../models');
const { calculateCredibilityScore } = require('../utils/credibilityScore.util');

/**
 * FR-7-03 — recalculates and persists a buyer's credibility score whenever
 * a relevant event fires. Each event bumps the appropriate raw counter
 * first, then recomputes the derived `value` from the full counter set —
 * so `value` is always consistent with the counters, never independently
 * mutated.
 */
async function recalculate(buyer) {
  buyer.credibilityScore.value = calculateCredibilityScore({
    successfulOrders: buyer.credibilityScore.successfulOrders,
    cancelledOrders: buyer.credibilityScore.cancelledOrders,
    paymentSuccessRate: buyer.credibilityScore.paymentSuccessRate,
    accountCreatedAt: buyer.createdAt,
  });
  buyer.credibilityScore.lastCalculatedAt = new Date();
  await buyer.save();
  return buyer.credibilityScore;
}

/** Event: order reached `delivered` (a "successful order" — FR-7-01). */
async function recordSuccessfulOrder(buyerId) {
  const buyer = await Buyer.findById(buyerId);
  if (!buyer) return;
  buyer.credibilityScore.successfulOrders += 1;
  await recalculate(buyer);
}

/** Event: order was cancelled. */
async function recordCancelledOrder(buyerId) {
  const buyer = await Buyer.findById(buyerId);
  if (!buyer) return;
  buyer.credibilityScore.cancelledOrders += 1;
  await recalculate(buyer);
}

/** Event: a payment attempt succeeded or failed at checkout. */
async function recordPaymentOutcome(buyerId, success) {
  const buyer = await Buyer.findById(buyerId);
  if (!buyer) return;

  buyer.credibilityScore.totalPaymentAttempts += 1;
  if (success) buyer.credibilityScore.successfulPaymentAttempts += 1;

  buyer.credibilityScore.paymentSuccessRate = Math.round(
    (buyer.credibilityScore.successfulPaymentAttempts / buyer.credibilityScore.totalPaymentAttempts) * 100
  );
  await recalculate(buyer);
}

module.exports = { recalculate, recordSuccessfulOrder, recordCancelledOrder, recordPaymentOutcome };
