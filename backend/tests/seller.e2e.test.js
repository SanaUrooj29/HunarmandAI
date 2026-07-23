/**
 * End-to-end smoke test for Phase 6 (Seller module): profile completion,
 * AI listing + manual product CRUD, order fulfilment lifecycle + wallet
 * crediting, withdrawal gating, and micro-learning triggers.
 *
 * Run: node tests/seller.e2e.test.js
 */
process.env.NODE_ENV = 'test';
process.env.CNIC_ENCRYPTION_KEY = require('crypto').randomBytes(32).toString('hex');
process.env.JWT_SECRET = 'test-secret';
process.env.JWT_ADMIN_SECRET = 'test-admin-secret';

const request = require('supertest');
const { patchModelWithFakeStore } = require('./helpers/fakeMongoStore');
const { patchUploadService } = require('./helpers/fakeUploadService');

let capturedLogs = [];
const originalLog = console.log;
function captureConsole() {
  capturedLogs = [];
  console.log = (...args) => {
    capturedLogs.push(args.join(' '));
    originalLog(...args);
  };
}
function restoreConsole() { console.log = originalLog; }
function extractOtpFromLogs() {
  const line = capturedLogs.find((l) => l.includes('verification code is'));
  const match = line && line.match(/verification code is (\d{6})/);
  return match ? match[1] : null;
}

const results = [];
function check(label, condition, extra) {
  results.push({ label, pass: Boolean(condition) });
  console.log(`${condition ? '✓' : '✗'} ${label}${!condition && extra ? ` (${JSON.stringify(extra)})` : ''}`);
}

async function run() {
  const { Seller, Buyer, Admin, Category, Product, Order, WalletTransaction, LessonCompletion, Notification, PlatformSettings } =
    require('../src/api/shared/models');
  [Seller, Buyer, Admin, Category, Product, Order, WalletTransaction, LessonCompletion, Notification, PlatformSettings].forEach(
    patchModelWithFakeStore
  );
  patchUploadService();

  const app = require('../src/app');

  // --------------------------------------------------------------- SETUP
  const category = await Category.create({ name: 'Handicrafts', parentCategory: null, sortOrder: 0 });

  const sellerPhone = '+923001112222';
  captureConsole();
  await request(app).post('/api/seller/auth/otp/request').send({ phone: sellerPhone });
  restoreConsole();
  const otp = extractOtpFromLogs();
  const verifyRes = await request(app).post('/api/seller/auth/otp/verify').send({ phone: sellerPhone, code: otp });
  const token = verifyRes.body.data.token;
  const sellerId = verifyRes.body.data.seller.id;
  const auth = (req) => req.set('Authorization', `Bearer ${token}`);

  // ------------------------------------------------------------ CATEGORY
  console.log('\n--- CATEGORIES (public) ---');
  const catList = await request(app).get('/api/categories');
  check('categories list -> 200', catList.status === 200);
  check('seeded category present', catList.body.data.some((c) => c.name === 'Handicrafts'));

  // -------------------------------------------------------------- PROFILE
  console.log('\n--- SELLER PROFILE (UC-02) ---');
  const freshProfile = await auth(request(app).get('/api/seller/profile'));
  check('get profile -> 200', freshProfile.status === 200);
  check('profileComplete false initially', freshProfile.body.data.profileComplete === false);

  const partialUpdate = await auth(request(app).patch('/api/seller/profile')).send({ username: 'Amina Crafts' });
  check('partial profile update -> 200', partialUpdate.status === 200);
  check('still incomplete after partial update', partialUpdate.body.data.profileComplete === false);

  // Product creation should be blocked before profile completion.
  const blockedProduct = await auth(request(app).post('/api/seller/products')).send({
    categoryId: String(category._id),
    title: 'Hand-embroidered Cushion Cover',
    description: 'A beautiful hand-embroidered cushion cover made with traditional thread work.',
    images: ['https://fake-cdn.test/products/seed.jpg'],
    price: 1500,
  });
  check('product creation blocked pre-profile-completion -> 403', blockedProduct.status === 403, blockedProduct.body);

  const fullUpdate = await auth(request(app).patch('/api/seller/profile')).send({
    username: 'Amina Crafts',
    cnic: '3520112223334',
    shopName: 'Amina Handicrafts',
    city: 'Lahore',
    productCategory: String(category._id),
  });
  check('full profile update -> 200', fullUpdate.status === 200);
  check('profileComplete true after full update', fullUpdate.body.data.profileComplete === true);
  check('cnic masked in response', fullUpdate.body.data.cnicMasked === '*********3334', fullUpdate.body.data);

  const picUpload = await auth(request(app).post('/api/seller/profile/picture')).attach(
    'picture',
    Buffer.from('fake-image-bytes'),
    { filename: 'pic.jpg', contentType: 'image/jpeg' }
  );
  check('profile picture upload -> 200', picUpload.status === 200);
  check('profile picture URL returned', picUpload.body.data.profilePictureUrl.includes('fake-cdn.test'));

  // ------------------------------------------------------- AI LISTING (UC-03)
  console.log('\n--- AI LISTING (UC-03, no API key configured) ---');
  const aiListing = await auth(request(app).post('/api/seller/products/ai-listing')).attach(
    'image',
    Buffer.from('fake-product-photo'),
    { filename: 'product.jpg', contentType: 'image/jpeg' }
  );
  check('AI listing endpoint -> 200 (graceful fallback)', aiListing.status === 200, aiListing.body);
  check('AI listing returns image URL', Boolean(aiListing.body.data.imageUrl));
  check('AI suggestion null (no API key) -> manual fallback', aiListing.body.data.suggestion === null);

  // --------------------------------------------------------- PRODUCTS (UC-04)
  console.log('\n--- PRODUCT / INVENTORY MANAGEMENT (UC-04) ---');
  const createRes = await auth(request(app).post('/api/seller/products')).send({
    categoryId: String(category._id),
    title: 'Hand-embroidered Cushion Cover',
    description: 'A beautiful hand-embroidered cushion cover made with traditional thread work.',
    images: ['https://fake-cdn.test/products/seed.jpg'],
    price: 1500,
    quantity: 5,
  });
  check('create product -> 201', createRes.status === 201, createRes.body);
  check('new product approvalStatus pending', createRes.body.data.approvalStatus === 'pending');
  const productId = createRes.body.data._id;

  const lessonsAfterFirstProduct = await auth(request(app).get('/api/seller/learning'));
  check(
    'first-product micro-learning lesson queued (FR-5-01)',
    lessonsAfterFirstProduct.body.data.some((l) => l.lessonId === 'introduction-to-selling' && l.status === 'queued')
  );

  const listRes = await auth(request(app).get('/api/seller/products'));
  check('list my products -> 1 item', listRes.body.data.length === 1);

  // Simulate admin approval directly (Admin module is Phase 8) to test the re-review rule.
  const productDoc = await Product.findById(productId);
  productDoc.approvalStatus = 'approved';
  await productDoc.save();

  const editRes = await auth(request(app).patch(`/api/seller/products/${productId}`)).send({
    title: 'Hand-embroidered Cushion Cover (Updated)',
  });
  check('edit approved product -> 200', editRes.status === 200);
  check('material edit resets approvalStatus to pending (UC-04 E2)', editRes.body.data.approvalStatus === 'pending');

  const stockRes = await auth(request(app).patch(`/api/seller/products/${productId}/stock`)).send({
    stockStatus: 'out_of_stock',
  });
  check('toggle stock status -> 200', stockRes.status === 200);
  check('stock status now out_of_stock', stockRes.body.data.stockStatus === 'out_of_stock');

  const bulkStockRes = await auth(request(app).patch('/api/seller/products/stock/bulk')).send({
    productIds: [productId],
    stockStatus: 'in_stock',
  });
  check('bulk stock update -> 200', bulkStockRes.status === 200);
  check('bulk update applied', bulkStockRes.body.data[0].stockStatus === 'in_stock');

  // ------------------------------------------------------------- BUYER FIXTURE
  const buyer = await Buyer.create({ phone: '+923005556666', name: 'Test Buyer' });

  // --------------------------------------------------------- ORDERS (UC-06)
  console.log('\n--- ORDER FULFILMENT (UC-06) ---');

  async function makeOrderFixture(orderNumber, amount) {
    const order = await Order.create({
      orderNumber,
      buyerId: buyer._id,
      sellerId,
      items: [{ productId, titleSnapshot: 'Cushion Cover', priceSnapshot: amount, quantity: 1, subtotal: amount }],
      productPrice: amount,
      deliveryCharges: 0,
      totalAmount: amount,
      shippingAddress: { addressLine: '123 Test Street', city: 'Lahore' },
      status: 'pending',
      payment: { method: 'jazzcash', status: 'paid', transactionId: 'TXN123' },
    });
    await WalletTransaction.create({ sellerId, orderId: order._id, type: 'credit_sale', amount, status: 'pending' });
    return order;
  }

  // Delete-blocked-by-open-order check
  const openOrderForDeleteTest = await makeOrderFixture('HMD-TEST-DEL', 500);
  const blockedDelete = await auth(request(app).delete(`/api/seller/products/${productId}`));
  check('delete blocked while order open -> 409', blockedDelete.status === 409, blockedDelete.body);
  await Order.deleteOne({ _id: openOrderForDeleteTest._id });
  await WalletTransaction.deleteOne({ orderId: openOrderForDeleteTest._id });

  // Invalid transition check
  const orderA = await makeOrderFixture('HMD-TEST-A', 1000);
  const invalidJump = await auth(request(app).patch(`/api/seller/orders/${orderA._id}/status`)).send({
    nextStatus: 'shipped',
  });
  check('invalid direct pending->shipped transition -> 400', invalidJump.status === 400, invalidJump.body);

  // Full happy-path lifecycle -> delivered, twice, to cross the 2-sale withdrawal threshold.
  async function deliverOrder(order) {
    const acc = await auth(request(app).post(`/api/seller/orders/${order._id}/accept`));
    check(`order ${order.orderNumber} accept -> 200`, acc.status === 200, acc.body);
    const prep = await auth(request(app).patch(`/api/seller/orders/${order._id}/status`)).send({ nextStatus: 'preparing' });
    check(`order ${order.orderNumber} -> preparing`, prep.status === 200 && prep.body.data.status === 'preparing');
    const ship = await auth(request(app).patch(`/api/seller/orders/${order._id}/status`)).send({
      nextStatus: 'shipped',
      courierName: 'Self-delivery',
      trackingReference: 'N/A',
    });
    check(`order ${order.orderNumber} -> shipped`, ship.status === 200 && ship.body.data.status === 'shipped');
    const deliver = await auth(request(app).patch(`/api/seller/orders/${order._id}/status`)).send({
      nextStatus: 'delivered',
    });
    check(`order ${order.orderNumber} -> delivered`, deliver.status === 200 && deliver.body.data.status === 'delivered');
  }

  await deliverOrder(orderA);
  const walletAfterFirst = await auth(request(app).get('/api/seller/wallet'));
  check('after 1st delivery: completedSalesCount = 1', walletAfterFirst.body.data.completedSalesCount === 1);
  check('after 1st delivery: withdrawal still disabled', walletAfterFirst.body.data.withdrawalEnabled === false);
  check('after 1st delivery: availableBalance = 1000', walletAfterFirst.body.data.availableBalance === 1000);

  const orderB = await makeOrderFixture('HMD-TEST-B', 800);
  await deliverOrder(orderB);
  const walletAfterSecond = await auth(request(app).get('/api/seller/wallet'));
  check('after 2nd delivery: completedSalesCount = 2', walletAfterSecond.body.data.completedSalesCount === 2);
  check('after 2nd delivery: withdrawal now enabled (FR-4-04)', walletAfterSecond.body.data.withdrawalEnabled === true);
  check('after 2nd delivery: availableBalance = 1800', walletAfterSecond.body.data.availableBalance === 1800);

  // Buyer credibility visibility (FR-7-02)
  const orderDetail = await auth(request(app).get(`/api/seller/orders/${orderB._id}`));
  check('order detail includes buyer credibility score (FR-7-02)', typeof orderDetail.body.data.buyer.credibilityScore.value === 'number');

  // Reject flow
  const orderC = await makeOrderFixture('HMD-TEST-C', 300);
  const rejectRes = await auth(request(app).post(`/api/seller/orders/${orderC._id}/reject`)).send({
    reason: 'Out of stock',
  });
  check('reject order -> 200', rejectRes.status === 200);
  check('rejected order status = cancelled', rejectRes.body.data.status === 'cancelled');
  check('cancellation reason recorded', rejectRes.body.data.cancellation.reason === 'Out of stock');

  const notifCount = await Notification.countDocuments({ recipientType: 'buyer', recipientId: buyer._id });
  check('buyer notified of cancellation', notifCount > 0);

  // ------------------------------------------------------------- WALLET (FR-4-04)
  console.log('\n--- WALLET WITHDRAWAL (FR-4-04) ---');
  const overWithdraw = await auth(request(app).post('/api/seller/wallet/withdraw')).send({ amount: 5000 });
  check('withdrawal exceeding balance -> 400', overWithdraw.status === 400);

  const goodWithdraw = await auth(request(app).post('/api/seller/wallet/withdraw')).send({ amount: 1000 });
  check('valid withdrawal -> 201', goodWithdraw.status === 201, goodWithdraw.body);
  check('withdrawal transaction status completed (no manual approval configured)', goodWithdraw.body.data.status === 'completed');

  const walletAfterWithdraw = await auth(request(app).get('/api/seller/wallet'));
  check('availableBalance reduced after withdrawal', walletAfterWithdraw.body.data.availableBalance === 800);

  const txnList = await auth(request(app).get('/api/seller/wallet/transactions'));
  check('transaction history non-empty', txnList.body.data.length > 0);

  // -------------------------------------------------------- MICRO-LEARNING (FR-5)
  console.log('\n--- MICRO-LEARNING (FR-5, UC-07) ---');
  const lessonComplete = await auth(
    request(app).patch('/api/seller/learning/introduction-to-selling')
  ).send({ status: 'completed' });
  check('mark lesson completed -> 200', lessonComplete.status === 200);
  check('lesson status = completed', lessonComplete.body.data.status === 'completed');
  check('lesson completedAt timestamp set', Boolean(lessonComplete.body.data.completedAt));

  // ------------------------------------------------------------- ACCOUNT DELETE
  console.log('\n--- ACCOUNT DELETION ---');
  const deleteAccount = await auth(request(app).delete('/api/seller/profile'));
  check('delete account -> 200', deleteAccount.status === 200);
  const deletedSeller = await Seller.findById(sellerId);
  check('accountStatus is deleted', deletedSeller.accountStatus === 'deleted');

  // --------------------------------------------------------------- SUMMARY
  const failed = results.filter((r) => !r.pass);
  console.log(`\n${results.length - failed.length}/${results.length} checks passed.`);
  if (failed.length > 0) {
    console.log('FAILED CHECKS:', failed.map((f) => f.label));
    process.exitCode = 1;
  } else {
    console.log('ALL SELLER MODULE E2E CHECKS PASSED.');
  }
}

run().catch((err) => {
  console.error('E2E TEST CRASHED:', err);
  process.exit(1);
});
