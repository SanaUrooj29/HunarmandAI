/**
 * FR-7-01 — computes a buyer's credibility score (0-100) from successful
 * orders, cancelled orders, payment success rate, and account age.
 * Called by credibilityScoreService whenever a relevant event fires
 * (order completion, cancellation, payment failure — FR-7-03), never
 * computed live on every read.
 *
 * Weights are a product/business decision, not a schema decision (see SRS
 * §9 "Missing/Ambiguous Requirements") — exposed as named constants so
 * they can be tuned without touching the calculation logic.
 */

const WEIGHTS = Object.freeze({
  successfulOrders: 0.40,
  cancellationPenalty: 0.25,
  paymentSuccessRate: 0.25,
  accountAge: 0.10,
});

const ACCOUNT_AGE_FULL_CREDIT_DAYS = 180; // account age contributes full marks after ~6 months

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/**
 * @param {Object} input
 * @param {number} input.successfulOrders
 * @param {number} input.cancelledOrders
 * @param {number} input.paymentSuccessRate  0-100
 * @param {Date}   input.accountCreatedAt
 * @returns {number} score 0-100
 */
function calculateCredibilityScore({
  successfulOrders = 0,
  cancelledOrders = 0,
  paymentSuccessRate = 100,
  accountCreatedAt,
}) {
  const totalOrders = successfulOrders + cancelledOrders;

  // Successful-order component: saturates as the buyer accumulates a track record.
  const successComponent = totalOrders === 0 ? 50 : (successfulOrders / totalOrders) * 100;

  // Cancellation penalty component (inverted — fewer cancellations is better).
  const cancellationRate = totalOrders === 0 ? 0 : cancelledOrders / totalOrders;
  const cancellationComponent = (1 - cancellationRate) * 100;

  // Account age component.
  const ageDays = accountCreatedAt
    ? Math.max(0, (Date.now() - new Date(accountCreatedAt).getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  const ageComponent = clamp((ageDays / ACCOUNT_AGE_FULL_CREDIT_DAYS) * 100, 0, 100);

  const score =
    successComponent * WEIGHTS.successfulOrders +
    cancellationComponent * WEIGHTS.cancellationPenalty +
    paymentSuccessRate * WEIGHTS.paymentSuccessRate +
    ageComponent * WEIGHTS.accountAge;

  return Math.round(clamp(score, 0, 100));
}

module.exports = { calculateCredibilityScore, WEIGHTS, ACCOUNT_AGE_FULL_CREDIT_DAYS };
