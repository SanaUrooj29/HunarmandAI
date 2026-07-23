/**
 * End-to-end smoke test for Phase 7 (Buyer module): marketplace browse,
 * cart, checkout with signed payment-gateway callback verification,
 * multi-seller order splitting + wallet crediting, order cancellation,
 * reviews, and the buyer credibility score triggers.
 *
 * Run: node tests/buyer.e2e.test.js
 */
process.env.NODE_ENV = 'test';
process.env.CNIC_ENCRYPTION_KEY = require('crypto').randomBytes(32).toString('hex');
process.env.JWT_SECRET = 'test-secret';
process.env.JWT_ADMIN_SECRET = 'test-admin-secret';
process.env.CHECKOUT_TOKEN_SECRET = 'test-checkout-secret';
process.env.JAZZCASH_MERCHANT_ID = 'TESTMERCHANT';
process.env.JAZZCASH_PASSWORD = 'TESTPASS';
process.env.JAZZCASH_INTEGRITY_SALT = 'test-integrity-salt';

const crypto = require('crypto');
const request = require('supertest');
const { patchModelWithFakeStore } = require('./helpers/fakeMongoStore');
const { patchUploadService } = require('./helpers/fakeUploadService');

const results = [];
function check(label, condition, extra) {
  results.push({ label, pass: Boolean(condition) });
  console.log(`${condition ? '✓' : '✗'} ${label}${!condition && extra ? ` (${JSON.stringify(extra)})` : ''}`);
}

/** Mirrors paymentService's internal HMAC scheme so the test can act as the "gateway". */
function buildHmac(fields, secret) {
  const sortedString = Object.keys(fields)
    .sort()
    .filter((k) => fields[k] !== undefined && fields[k] !== null && fields[k] !== '')
    .map((k) => `${k}=${fields[k]}`)
    .join('&');
  return crypto.createHmac('sha256', secret).update(sortedString).digest('hex');
}

async function run() {
  const {
    Seller, Buyer, Admin, Category, Product, Order, WalletTransaction,
    LessonCompletion, Notification, PlatformSettings, Cart, Review,
  } = require('../src/api/shared/models');
  [Seller, Buyer, Admin, Category, Product, Order, WalletTransaction, LessonCompletion, Notification, PlatformSettings, Cart, Review].forEach(
    patchModelWithFakeStore
  );
  patchUploadService();
  const app = require('../src/app');

  // --------------------------------------------------------------- SETUP
  const category = await Category.create({ name: 'Jewellery', parentCategory: null, sortOrder: 0 });

  // Two sellers, each with one approved, in-stock product.
  const sellerA = await Seller.create({
    phone: '+923001110001',
    username: 'Seller A',
    cnic: 'enc-placeholder-A',
    shopName: 'Shop A',
    city: 'Lahore',
    productCategory: category._id,
    profileComplete: true,
    verificationStatus: 'verified',
  });
  const sellerB = await Seller.create({
    phone: '+923001110002',
    username: 'Seller B',
    cnic: 'enc-placeholder-B',
    shopName: 'Shop B',
    city: 'Karachi',
    productCategory: category._id,
    profileComplete: true,
    verificationStatus: 'verified',
  });

  const productA = await Product.create({
    sellerId: sellerA._id,
    categoryId: category._id,
    categoryNameSnapshot: 'Jewellery',
    sellerCitySnapshot: 'Lahore',
    title: 'Silver Earrings',
    description: 'Handcrafted silver earrings with traditional design work.',
    images: ['https://fake-cdn.test/products/earrings.jpg'],
    price: 2000,
    quantity: 10,
    stockStatus: 'in_stock',
    approvalStatus: 'approved',
  });
  const productB = await Product.create({
    sellerId: sellerB._id,
    categoryId: category._id,
    categoryNameSnapshot: 'Jewellery',
    sellerCitySnapshot: 'Karachi',
    title: 'Gold-plated Bangles',
    description: 'A set of gold-plated bangles with intricate engravings.',
    images: ['https://fake-cdn.test/products/bangles.jpg'],
    price: 3000,
    quantity: 5,
    stockStatus: 'in_stock',
    approvalStatus: 'approved',
  });
  const outOfStockProduct = await Product.create({
    sellerId: sellerA._id,
    categoryId: category._id,
    categoryNameSnapshot: 'Jewellery',
    sellerCitySnapshot: 'Lahore',
    title: 'Sold Out Necklace',
    description: 'A beautiful necklace that is currently unavailable.',
    images: ['https://fake-cdn.test/products/necklace.jpg'],
    price: 1500,
    quantity: 0,
    stockStatus: 'out_of_stock',
    approvalStatus: 'approved',
  });

  // Register buyer via real OTP flow.
  let capturedLogs = [];
  const originalLog = console.log;
  const captureConsole = () => { capturedLogs = []; console.log = (...a) => { capturedLogs.push(a.join(' ')); originalLog(...a); }; };
  const restoreConsole = () => { console.log = originalLog; };
  const extractOtp = () => {
    const line = capturedLogs.find((l) => l.includes('verification code is'));
    return line && line.match(/verification code is (\d{6})/)[1];
  };

  captureConsole();
  await request(app).post('/api/buyer/auth/otp/request').send({ phone: '+923009998888' });
  restoreConsole();
  const otp = extractOtp();
  const verifyRes = await request(app).post('/api/buyer/auth/otp/verify').send({ phone: '+923009998888', code: otp });
  const token = verifyRes.body.data.token;
  const buyerId = verifyRes.body.data.buyer.id;
  const auth = (req) => req.set('Authorization', `Bearer ${token}`);

  // --------------------------------------------------------- MARKETPLACE
  console.log('\n--- MARKETPLACE BROWSE (FR-6) ---');
  const searchRes = await request(app).get('/api/marketplace').query({ categoryId: String(category._id) });
  check('search by category -> 200', searchRes.status === 200);
  check('search returns 3 approved products', searchRes.body.data.length === 3, searchRes.body);

  const cityFilterRes = await request(app).get('/api/marketplace').query({ city: 'Lahore' });
  check('city filter returns only Lahore products', cityFilterRes.body.data.every((p) => p.sellerCitySnapshot === 'Lahore'));

  const priceFilterRes = await request(app).get('/api/marketplace').query({ minPrice: 2500 });
  check('price filter excludes cheaper items', priceFilterRes.body.data.every((p) => p.price >= 2500));

  const detailRes = await request(app).get(`/api/marketplace/${productA._id}`);
  check('product detail -> 200', detailRes.status === 200);
  check('product detail includes seller info', detailRes.body.data.seller.shopName === 'Shop A');
  const viewCountAfter = (await Product.findById(productA._id)).viewCount;
  check('viewing product increments viewCount', viewCountAfter === 1, viewCountAfter);

  const storefrontRes = await request(app).get(`/api/marketplace/sellers/${sellerA._id}`);
  check('seller storefront -> 200', storefrontRes.status === 200);
  check('storefront lists sellerA products only', storefrontRes.body.data.products.every((p) => String(p.sellerId) === String(sellerA._id)));

  // -------------------------------------------------------------- CART
  console.log('\n--- CART ---');
  const addA = await auth(request(app).post('/api/buyer/cart/items')).send({ productId: String(productA._id), quantity: 2 });
  check('add item from seller A -> 200', addA.status === 200);
  const addB = await auth(request(app).post('/api/buyer/cart/items')).send({ productId: String(productB._id), quantity: 1 });
  check('add item from seller B -> 200', addB.status === 200);
  check('cart has 2 line items', addB.body.data.items.length === 2);

  const addOOS = await auth(request(app).post('/api/buyer/cart/items')).send({ productId: String(outOfStockProduct._id) });
  check('adding out-of-stock item -> 400', addOOS.status === 400);

  const updateQty = await auth(request(app).patch(`/api/buyer/cart/items/${productA._id}`)).send({ quantity: 3 });
  check('update quantity -> 200', updateQty.status === 200);
  check('quantity updated to 3', updateQty.body.data.items.find((i) => String(i.productId) === String(productA._id)).quantity === 3);

  // -------------------------------------------------------- CHECKOUT (UC-05)
  console.log('\n--- CHECKOUT (UC-05) ---');
  const initiateRes = await auth(request(app).post('/api/buyer/checkout/initiate')).send({
    shippingAddress: { addressLine: '456 Bazaar Road', city: 'Lahore' },
    paymentMethod: 'jazzcash',
  });
  check('initiate checkout -> 200', initiateRes.status === 200, initiateRes.body);
  check('total = 3x2000 + 1x3000 = 9000', initiateRes.body.data.totalAmount === 9000, initiateRes.body.data);
  check('gateway request built for jazzcash', initiateRes.body.data.gatewayRequest.gateway === 'jazzcash');
  const { checkoutToken, gatewayRequest } = initiateRes.body.data;

  // No orders should exist yet — UC-05 only creates them after a verified callback.
  const ordersBeforePayment = await Order.countDocuments({ buyerId });
  check('no orders created before payment confirmation', ordersBeforePayment === 0);

  // Simulate the gateway calling back with an INVALID signature.
  const tamperedCallback = { ...gatewayRequest.fields, pp_ResponseCode: '000', pp_TxnRefNo: 'TXN001', pp_SecureHash: 'not-a-real-hash' };
  const badSigRes = await request(app).post('/api/buyer/checkout/callback/jazzcash').send(tamperedCallback);
  check('tampered callback signature rejected -> 401', badSigRes.status === 401, badSigRes.body);

  // Simulate a genuine, correctly-signed FAILURE callback.
  const failFields = { ...gatewayRequest.fields, pp_ResponseCode: '999', pp_TxnRefNo: 'TXN002' };
  delete failFields.pp_SecureHash;
  const failHash = buildHmac(failFields, process.env.JAZZCASH_INTEGRITY_SALT);
  const failRes = await request(app).post('/api/buyer/checkout/callback/jazzcash').send({ ...failFields, pp_SecureHash: failHash });
  check('valid signature but failed payment -> 200, success false', failRes.status === 200 && failRes.body.data.success === false, failRes.body);

  const ordersAfterFailure = await Order.countDocuments({ buyerId });
  check('no orders created after failed payment', ordersAfterFailure === 0);

  // Now simulate a genuine SUCCESSFUL callback for a *fresh* checkout (the failed one consumed no token reuse issue, but tokens are single-purpose in spirit).
  const initiate2 = await auth(request(app).post('/api/buyer/checkout/initiate')).send({
    shippingAddress: { addressLine: '456 Bazaar Road', city: 'Lahore' },
    paymentMethod: 'jazzcash',
  });
  const successFields = { ...initiate2.body.data.gatewayRequest.fields, pp_ResponseCode: '000', pp_TxnRefNo: 'TXN003' };
  delete successFields.pp_SecureHash;
  const successHash = buildHmac(successFields, process.env.JAZZCASH_INTEGRITY_SALT);
  const successRes = await request(app)
    .post('/api/buyer/checkout/callback/jazzcash')
    .send({ ...successFields, pp_SecureHash: successHash });
  check('valid signature + successful payment -> 200, success true', successRes.status === 200 && successRes.body.data.success === true, successRes.body);
  check('two orders created (one per seller, UC-05 Alt Flow A1)', successRes.body.data.orders.length === 2);

  const cartAfterCheckout = await auth(request(app).get('/api/buyer/cart'));
  check('cart cleared after successful checkout', cartAfterCheckout.body.data.items.length === 0);

  const [orderForA, orderForB] = successRes.body.data.orders.sort((a, b) => (String(a.sellerId) === String(sellerA._id) ? -1 : 1));
  check('order A total = 6000 (3 x 2000)', orderForA.totalAmount === 6000, orderForA);
  check('order B total = 3000 (1 x 3000)', orderForB.totalAmount === 3000, orderForB);
  check('orders start at status pending', orderForA.status === 'pending' && orderForB.status === 'pending');
  check('payment marked paid on created orders', orderForA.payment.status === 'paid');

  const walletTxnA = await WalletTransaction.findOne({ orderId: orderForA._id });
  check('wallet credit transaction created for seller A (no commission configured)', walletTxnA.amount === 6000, walletTxnA);

  // ------------------------------------------------------- ORDER TRACKING
  console.log('\n--- ORDER TRACKING & CANCELLATION ---');
  const myOrders = await auth(request(app).get('/api/buyer/orders'));
  check('list my orders -> 2 orders', myOrders.body.data.length === 2);

  const orderDetailRes = await auth(request(app).get(`/api/buyer/orders/${orderForB._id}`));
  check('get order detail -> 200', orderDetailRes.status === 200);

  const cancelRes = await auth(request(app).post(`/api/buyer/orders/${orderForB._id}/cancel`)).send({ reason: 'Changed my mind' });
  check('cancel order before acceptance -> 200', cancelRes.status === 200, cancelRes.body);
  check('order status now cancelled', cancelRes.body.data.status === 'cancelled');

  // Simulate seller accepting order A, then try to cancel — should now be blocked.
  const orderADoc = await Order.findById(orderForA._id);
  orderADoc.status = 'accepted';
  orderADoc.statusHistory.push({ status: 'accepted', changedAt: new Date() });
  await orderADoc.save();
  const blockedCancel = await auth(request(app).post(`/api/buyer/orders/${orderForA._id}/cancel`));
  check('cancel blocked after seller acceptance -> 400', blockedCancel.status === 400, blockedCancel.body);

  // -------------------------------------------------- CREDIBILITY SCORE (FR-7)
  console.log('\n--- BUYER CREDIBILITY SCORE (FR-7) ---');
  const buyerAfterFlow = await Buyer.findById(buyerId);
  check('cancelledOrders incremented after cancellation', buyerAfterFlow.credibilityScore.cancelledOrders === 1, buyerAfterFlow.credibilityScore);
  check(
    'paymentSuccessRate reflects 1 success + 1 failure = 50%',
    buyerAfterFlow.credibilityScore.paymentSuccessRate === 50,
    buyerAfterFlow.credibilityScore
  );

  // Drive order A to delivered to check successfulOrders increments credibility.
  orderADoc.status = 'preparing';
  orderADoc.statusHistory.push({ status: 'preparing', changedAt: new Date() });
  await orderADoc.save();
  orderADoc.status = 'shipped';
  orderADoc.statusHistory.push({ status: 'shipped', changedAt: new Date() });
  await orderADoc.save();

  // Use the real seller-side endpoint for the final delivered transition
  // (exercises the shared orderLifecycleService the same way seller.e2e does).
  const sellerAToken = require('../src/api/shared/utils/jwt.util').signUserToken({ id: sellerA._id, role: 'seller' });
  const deliverRes = await request(app)
    .patch(`/api/seller/orders/${orderForA._id}/status`)
    .set('Authorization', `Bearer ${sellerAToken}`)
    .send({ nextStatus: 'delivered' });
  check('order A delivered via seller endpoint -> 200', deliverRes.status === 200, deliverRes.body);

  const buyerAfterDelivery = await Buyer.findById(buyerId);
  check('successfulOrders incremented on delivery (FR-7-03)', buyerAfterDelivery.credibilityScore.successfulOrders === 1);
  check('credibility value recalculated (not default 50)', buyerAfterDelivery.credibilityScore.value !== 50, buyerAfterDelivery.credibilityScore);

  // ------------------------------------------------------------- REVIEWS
  console.log('\n--- REVIEWS (FR-6-04) ---');
  const reviewBeforeDelivery = await auth(request(app).post('/api/reviews')).send({
    productId: String(productB._id),
    orderId: String(orderForB._id), // this order was cancelled, not delivered
    rating: 5,
  });
  check('review on non-delivered order rejected -> 403', reviewBeforeDelivery.status === 403, reviewBeforeDelivery.body);

  const reviewRes = await auth(request(app).post('/api/reviews')).send({
    productId: String(productA._id),
    orderId: String(orderForA._id),
    rating: 4,
    comment: 'Beautiful earrings, exactly as pictured!',
  });
  check('review on delivered order -> 201', reviewRes.status === 201, reviewRes.body);
  const reviewId = reviewRes.body.data._id;

  const duplicateReview = await auth(request(app).post('/api/reviews')).send({
    productId: String(productA._id),
    orderId: String(orderForA._id),
    rating: 3,
  });
  check('duplicate review for same order/product rejected -> 409', duplicateReview.status === 409);

  const productAfterReview = await Product.findById(productA._id);
  check('product ratingAvg updated', productAfterReview.ratingAvg === 4, productAfterReview.ratingAvg);
  const sellerAAfterReview = await Seller.findById(sellerA._id);
  check('seller ratingAvg updated', sellerAAfterReview.ratingAvg === 4);

  const editReviewRes = await auth(request(app).patch(`/api/reviews/${reviewId}`)).send({ rating: 5 });
  check('edit review within window -> 200', editReviewRes.status === 200);
  check('rating updated to 5', editReviewRes.body.data.rating === 5);

  const publicReviewsRes = await request(app).get(`/api/reviews/product/${productA._id}`);
  check('public review listing -> 200', publicReviewsRes.status === 200);
  check('review visible in public listing', publicReviewsRes.body.data.length === 1);

  // --------------------------------------------------------------- PROFILE
  console.log('\n--- BUYER PROFILE & ADDRESSES ---');
  const addAddrRes = await auth(request(app).post('/api/buyer/profile/addresses')).send({
    label: 'Home',
    addressLine: '789 Main Street',
    city: 'Lahore',
  });
  check('add address -> 201', addAddrRes.status === 201);
  check('first address auto-set as default', addAddrRes.body.data[0].isDefault === true);

  // --------------------------------------------------------------- SUMMARY
  const failed = results.filter((r) => !r.pass);
  console.log(`\n${results.length - failed.length}/${results.length} checks passed.`);
  if (failed.length > 0) {
    console.log('FAILED CHECKS:', failed.map((f) => f.label));
    process.exitCode = 1;
  } else {
    console.log('ALL BUYER MODULE E2E CHECKS PASSED.');
  }
}

run().catch((err) => {
  console.error('E2E TEST CRASHED:', err);
  process.exit(1);
});
