const checkoutService = require('../services/checkoutService');
const paymentService = require('../../shared/services/paymentService');
const { asyncHandler } = require('../../shared/utils/asyncHandler.util');
const { sendSuccess } = require('../../shared/utils/response.util');

const initiateCheckout = asyncHandler(async (req, res) => {
  const result = await checkoutService.initiateCheckout(req.auth.id, req.body);
  return sendSuccess(res, { message: 'Checkout initiated', data: result });
});

/**
 * Public, gateway-facing endpoint — the payment provider calls this
 * directly (no buyer session exists at this point), authenticated instead
 * by the HMAC signature verified inside paymentService (FR-4-02).
 */
const handleCallback = asyncHandler(async (req, res) => {
  const { method } = req.params;
  const { isSuccess, checkoutToken, transactionId } = paymentService.verifyCallback(method, req.body);
  const result = await checkoutService.finalizeCheckout({ checkoutToken, isSuccess, transactionId });
  return sendSuccess(res, {
    message: result.success ? 'Payment confirmed, order(s) created' : 'Payment failed',
    data: result,
  });
});

module.exports = { initiateCheckout, handleCallback };
