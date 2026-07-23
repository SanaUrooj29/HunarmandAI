const crypto = require('crypto');
const paymentConfig = require('../config/payment.config');
const { ApiError } = require('../utils/apiError.util');
const { PAYMENT_METHOD } = require('../constants/enums');

/**
 * FR-4-01/02 — JazzCash and EasyPaisa integration. The SRS names these two
 * gateways but does not specify field-level formats (that's third-party
 * API documentation, not a requirements artifact) — this implements the
 * general pattern both use in practice: build a sorted key=value string
 * from the request fields, HMAC-SHA256 it with the merchant's integrity
 * secret, and compare that same computation against the gateway's
 * signature on the way back. A real integration would follow each
 * gateway's exact published field list; this is a structurally faithful
 * placeholder pending real sandbox credentials.
 */

function buildHmac(fields, secret) {
  const sortedString = Object.keys(fields)
    .sort()
    .filter((k) => fields[k] !== undefined && fields[k] !== null && fields[k] !== '')
    .map((k) => `${k}=${fields[k]}`)
    .join('&');
  return crypto.createHmac('sha256', secret).update(sortedString).digest('hex');
}

function assertKnownMethod(method) {
  if (!PAYMENT_METHOD.includes(method)) {
    throw ApiError.badRequest(`Unsupported payment method "${method}"`);
  }
}

/**
 * Builds the signed, gateway-specific field set the client will use to
 * redirect the buyer to the hosted payment page. `checkoutToken` is
 * embedded as the gateway's order/bill reference so it round-trips back
 * in the callback (see checkoutToken.util.js).
 */
function buildGatewayRequest(method, { amount, checkoutToken, description }) {
  assertKnownMethod(method);

  if (method === 'jazzcash') {
    const cfg = paymentConfig.jazzcash;
    const fields = {
      pp_MerchantID: cfg.merchantId,
      pp_Password: cfg.password,
      pp_Amount: Math.round(amount * 100), // JazzCash expects amount in paisa
      pp_TxnCurrency: paymentConfig.currency,
      pp_BillReference: checkoutToken,
      pp_Description: description,
    };
    const pp_SecureHash = buildHmac(fields, cfg.integritySalt);
    return { gateway: 'jazzcash', baseUrl: cfg.baseUrl, fields: { ...fields, pp_SecureHash } };
  }

  if (method === 'easypaisa') {
    const cfg = paymentConfig.easypaisa;
    const fields = {
      storeId: cfg.storeId,
      amount: amount.toFixed(2),
      orderRefNum: checkoutToken,
      postBackURL: description,
    };
    const hash = buildHmac(fields, cfg.hashKey);
    return { gateway: 'easypaisa', baseUrl: cfg.baseUrl, fields: { ...fields, hash } };
  }

  // credit_card
  const cfg = paymentConfig.credit_card;
  const fields = { amount: amount.toFixed(2), currency: paymentConfig.currency, reference: checkoutToken };
  const signature = buildHmac(fields, cfg.apiKey || 'unset-dev-key');
  return { gateway: 'credit_card', baseUrl: cfg.baseUrl, fields: { ...fields, signature } };
}

/**
 * FR-4-02 — verifies the gateway's callback signature before any order is
 * created or marked paid. Returns the extracted checkoutToken and success
 * flag; throws if the signature itself is invalid (distinct from a valid,
 * signed "payment failed" callback, which is not an error — see below).
 */
function verifyCallback(method, payload) {
  assertKnownMethod(method);

  if (method === 'jazzcash') {
    const cfg = paymentConfig.jazzcash;
    const { pp_SecureHash: providedHash, ...fields } = payload;
    const expectedHash = buildHmac(fields, cfg.integritySalt);
    if (providedHash !== expectedHash) {
      throw ApiError.unauthorized('Invalid payment callback signature', { code: 'PAYMENT_SIGNATURE_INVALID' });
    }
    return {
      isSuccess: payload.pp_ResponseCode === '000',
      checkoutToken: payload.pp_BillReference,
      transactionId: payload.pp_TxnRefNo,
    };
  }

  if (method === 'easypaisa') {
    const cfg = paymentConfig.easypaisa;
    const { hash: providedHash, ...fields } = payload;
    const expectedHash = buildHmac(fields, cfg.hashKey);
    if (providedHash !== expectedHash) {
      throw ApiError.unauthorized('Invalid payment callback signature', { code: 'PAYMENT_SIGNATURE_INVALID' });
    }
    return {
      isSuccess: payload.status === 'SUCCESS',
      checkoutToken: payload.orderRefNum,
      transactionId: payload.transactionId,
    };
  }

  // credit_card
  const cfg = paymentConfig.credit_card;
  const { signature: providedSignature, ...fields } = payload;
  const expectedSignature = buildHmac(fields, cfg.apiKey || 'unset-dev-key');
  if (providedSignature !== expectedSignature) {
    throw ApiError.unauthorized('Invalid payment callback signature', { code: 'PAYMENT_SIGNATURE_INVALID' });
  }
  return {
    isSuccess: payload.status === 'succeeded',
    checkoutToken: payload.reference,
    transactionId: payload.transactionId,
  };
}

module.exports = { buildGatewayRequest, verifyCallback };
