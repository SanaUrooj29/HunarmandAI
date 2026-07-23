const { env } = require('./env');

/**
 * FR-4-01 — JazzCash, EasyPaisa, and Credit Card. Kept as one config object
 * per gateway so paymentService can select an adapter by `payment.method`
 * without conditional sprawl.
 */
module.exports = {
  jazzcash: {
    merchantId: env.JAZZCASH_MERCHANT_ID,
    password: env.JAZZCASH_PASSWORD,
    integritySalt: env.JAZZCASH_INTEGRITY_SALT, // used to build/verify the HMAC (FR-4-02)
    baseUrl: env.JAZZCASH_BASE_URL,
  },
  easypaisa: {
    storeId: env.EASYPAISA_STORE_ID,
    hashKey: env.EASYPAISA_HASH_KEY,
    baseUrl: env.EASYPAISA_BASE_URL,
  },
  credit_card: {
    apiKey: env.CARD_GATEWAY_API_KEY,
    baseUrl: env.CARD_GATEWAY_BASE_URL,
  },
  currency: 'PKR',
};
