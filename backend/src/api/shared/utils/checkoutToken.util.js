const jwt = require('jsonwebtoken');
const { env } = require('../config/env');
const { ApiError } = require('./apiError.util');

/**
 * UC-05 Main Flow — the order record is only created AFTER a verified
 * payment callback (step 7), not before. Until then, the "checkout intent"
 * (buyer, split-by-seller cart snapshot, shipping address, total) has to
 * travel to the payment gateway and back somehow, so it can be echoed in
 * the callback and used to actually create the order(s).
 *
 * Rather than persisting a separate "pending checkout" collection (not
 * part of the finalized schema), this intent is signed into a compact,
 * short-lived, opaque token and passed through the gateway as the
 * order/bill reference field — a common stateless-checkout pattern.
 */
function signCheckoutToken(payload) {
  return jwt.sign(payload, env.CHECKOUT_TOKEN_SECRET, { expiresIn: env.CHECKOUT_TOKEN_EXPIRES_IN });
}

function verifyCheckoutToken(token) {
  try {
    return jwt.verify(token, env.CHECKOUT_TOKEN_SECRET);
  } catch (err) {
    throw ApiError.badRequest('Checkout session has expired or is invalid. Please try again.', {
      code: 'CHECKOUT_TOKEN_INVALID',
    });
  }
}

module.exports = { signCheckoutToken, verifyCheckoutToken };
