/**
 * End-to-end smoke test for Phase 8 (Admin module): dashboard stats, user
 * management, product moderation, category management, order dispute
 * resolution, wallet withdrawal approval/rejection, report handling,
 * support tickets, notification broadcast, and platform settings.
 *
 * Run: node tests/admin.e2e.test.js
 */
process.env.NODE_ENV = 'test';
process.env.CNIC_ENCRYPTION_KEY = require('crypto').randomBytes(32).toString('hex');
process.env.JWT_SECRET = 'test-secret';
process.env.JWT_ADMIN_SECRET = 'test-admin-secret';

const request = require('supertest');
const { patchModelWithFakeStore } = require('./helpers/fakeMongoStore');
const { patchUploadService } = require('./helpers/fakeUploadService');

const results = [];
function check(label, condition, extra) {
  results.push({ label, pass: Boolean(condition) });
  console.log(`${condition ? '✓' : '✗'} ${label}${!condition && extra ? ` (${JSON.stringify(extra)})` : ''}`);
}

async function run() {
  const {
    Seller, Buyer, Admin, Category, Product, Order, WalletTransaction,
    LessonCompletion, Notification, PlatformSettings, Cart, Review, Report, SupportTicket,
  } = require('../src/api/shared/models');
  [Seller, Buyer, Admin, Category, Product, Order, WalletTransaction, LessonCompletion, Notification, PlatformSettings, Cart, Review, Report, SupportTicket].forEach(
    patchModelWithFakeStore
  );
  patchUploadService();
  const app = require('../src/app');
  const { hashPassword } = require('../src/api/shared/utils/hash.util');

  // --------------------------------------------------------------- SETUP
  await Admin.create({
    email: 'ops@hunarmandai.pk',
    passwordHash: await hashPassword('AdminPass123!'),
    name: 'Ops Admin',
    role: 'super_admin',
  });
  const loginRes = await request(app).post('/api/admin/auth/login').send({ email: 'ops@hunarmandai.pk', password: 'AdminPass123!' });
  const adminToken = loginRes.body.data.token;
  const auth = (req) => req.set('Authorization', `Bearer ${adminToken}`);

  const category = await Category.create({ name: 'Handicrafts', parentCategory: null, sortOrder: 0 });

  const seller = await Seller.create({
    phone: '+923001112222',
    username: 'Test Seller',
    cnic: require('../src/api/shared/utils/hash.util').encryptCnic('3520112223334'),
    shopName: 'Test Shop',
    city: 'Lahore',
    productCategory: category._id,
    profileComplete: true,
    verificationStatus: 'pending',
  });
  const buyer = await Buyer.create({ phone: '+923009998888', name: 'Test Buyer' });

  // --------------------------------------------------------- AUTHZ CHECKS
  console.log('\n--- ADMIN AUTHZ ---');
  const noAuth = await request(app).get('/api/admin/dashboard');
  check('dashboard without token -> 401', noAuth.status === 401);

  // ------------------------------------------------------------ DASHBOARD
  console.log('\n--- DASHBOARD (SRS 4.2) ---');
  const dashRes = await auth(request(app).get('/api/admin/dashboard'));
  check('dashboard -> 200', dashRes.status === 200, dashRes.body);
  check('dashboard shows totalSellers = 1', dashRes.body.data.users.totalSellers === 1, dashRes.body.data);
  check('dashboard shows totalBuyers = 1', dashRes.body.data.users.totalBuyers === 1);
  check('dashboard shows pendingSellerVerifications = 1', dashRes.body.data.users.pendingSellerVerifications === 1);

  // --------------------------------------------------------- USER MGMT
  console.log('\n--- USER MANAGEMENT (SRS 4.3) ---');
  const listSellersRes = await auth(request(app).get('/api/admin/users/sellers'));
  check('list sellers -> 200', listSellersRes.status === 200);
  check('cnic masked in seller list', listSellersRes.body.data[0].cnicMasked !== undefined);
  check('raw cnic never exposed', listSellersRes.body.data[0].cnic === undefined);

  const verifyRes = await auth(request(app).post(`/api/admin/users/sellers/${seller._id}/verify`));
  check('verify seller -> 200', verifyRes.status === 200);
  check('seller verificationStatus now verified', verifyRes.body.data.verificationStatus === 'verified');

  const suspendSellerRes = await auth(request(app).post(`/api/admin/users/sellers/${seller._id}/suspend`));
  check('suspend seller -> 200', suspendSellerRes.status === 200);
  check('seller accountStatus now suspended', suspendSellerRes.body.data.accountStatus === 'suspended');

  const activateSellerRes = await auth(request(app).post(`/api/admin/users/sellers/${seller._id}/activate`));
  check('reactivate seller -> 200', activateSellerRes.status === 200 && activateSellerRes.body.data.accountStatus === 'active');

  const suspendBuyerRes = await auth(request(app).post(`/api/admin/users/buyers/${buyer._id}/suspend`));
  check('suspend buyer -> 200', suspendBuyerRes.status === 200 && suspendBuyerRes.body.data.accountStatus === 'suspended');
  await auth(request(app).post(`/api/admin/users/buyers/${buyer._id}/activate`));

  // ------------------------------------------------------- CATEGORY MGMT
  console.log('\n--- CATEGORY MANAGEMENT (SRS 4.5) ---');
  const createCatRes = await auth(request(app).post('/api/admin/categories')).send({ name: 'Stones', sortOrder: 5 });
  check('create category -> 201', createCatRes.status === 201, createCatRes.body);
  const newCategoryId = createCatRes.body.data._id;

  const updateCatRes = await auth(request(app).patch(`/api/admin/categories/${newCategoryId}`)).send({ sortOrder: 1 });
  check('update category -> 200', updateCatRes.status === 200 && updateCatRes.body.data.sortOrder === 1);

  const reorderRes = await auth(request(app).patch('/api/admin/categories/reorder')).send({
    orderedIds: [String(newCategoryId), String(category._id)],
  });
  check('reorder categories -> 200', reorderRes.status === 200);

  // ------------------------------------------------------- PRODUCT MODERATION
  console.log('\n--- PRODUCT MODERATION (FR-8) ---');
  const pendingProduct = await Product.create({
    sellerId: seller._id,
    categoryId: category._id,
    categoryNameSnapshot: 'Handicrafts',
    sellerCitySnapshot: 'Lahore',
    title: 'Hand-carved Wooden Box',
    description: 'A beautifully hand-carved wooden box made from local timber.',
    images: ['https://fake-cdn.test/products/box.jpg'],
    price: 1200,
    quantity: 3,
    approvalStatus: 'pending',
  });

  const listPendingRes = await auth(request(app).get('/api/admin/products').query({ approvalStatus: 'pending' }));
  check('list pending products -> 1 item', listPendingRes.body.data.length === 1, listPendingRes.body);

  const approveRes = await auth(request(app).post(`/api/admin/products/${pendingProduct._id}/approve`));
  check('approve product -> 200', approveRes.status === 200 && approveRes.body.data.approvalStatus === 'approved');

  const sellerNotifs = await Notification.countDocuments({ recipientType: 'seller', recipientId: seller._id, type: 'product_approved' });
  check('seller notified of approval (FR-8-03)', sellerNotifs > 0);

  const anotherPending = await Product.create({
    sellerId: seller._id,
    categoryId: category._id,
    categoryNameSnapshot: 'Handicrafts',
    sellerCitySnapshot: 'Lahore',
    title: 'Suspicious Listing',
    description: 'This listing will be rejected in the test for policy violation reasons.',
    images: ['https://fake-cdn.test/products/bad.jpg'],
    price: 100,
    approvalStatus: 'pending',
  });
  const rejectRes = await auth(request(app).post(`/api/admin/products/${anotherPending._id}/reject`)).send({
    reason: 'Violates content policy',
  });
  check('reject product -> 200', rejectRes.status === 200 && rejectRes.body.data.approvalStatus === 'rejected');
  check('rejection reason recorded', rejectRes.body.data.rejectionReason === 'Violates content policy');

  const rejectWithoutReason = await auth(request(app).post(`/api/admin/products/${pendingProduct._id}/reject`)).send({});
  check('reject without reason -> 400 (validation)', rejectWithoutReason.status === 400);

  // ------------------------------------------------------------- ORDERS
  console.log('\n--- ORDER OVERSIGHT & DISPUTES (SRS 4.6) ---');
  const disputedOrder = await Order.create({
    orderNumber: 'HMD-DISPUTE-1',
    buyerId: buyer._id,
    sellerId: seller._id,
    items: [{ productId: pendingProduct._id, titleSnapshot: 'Box', priceSnapshot: 1200, quantity: 1, subtotal: 1200 }],
    productPrice: 1200,
    deliveryCharges: 0,
    totalAmount: 1200,
    shippingAddress: { addressLine: '1 Test St', city: 'Lahore' },
    status: 'shipped',
    payment: { method: 'jazzcash', status: 'paid' },
  });
  await WalletTransaction.create({ sellerId: seller._id, orderId: disputedOrder._id, type: 'credit_sale', amount: 1200, status: 'pending' });

  const listOrdersRes = await auth(request(app).get('/api/admin/orders'));
  check('list all orders -> 200', listOrdersRes.status === 200 && listOrdersRes.body.data.length >= 1);

  // Admin resolves in seller's favor (buyer claimed non-delivery, seller has proof).
  const resolveSellerFavorRes = await auth(request(app).post(`/api/admin/orders/${disputedOrder._id}/resolve-dispute-seller-favor`)).send({
    note: 'Seller provided delivery proof',
  });
  check('resolve dispute (seller favor) -> 200', resolveSellerFavorRes.status === 200, resolveSellerFavorRes.body);
  check('order force-marked delivered', resolveSellerFavorRes.body.data.status === 'delivered');

  const sellerAfterForceDeliver = await Seller.findById(seller._id);
  check('seller wallet credited despite unusual path (admin override)', sellerAfterForceDeliver.wallet.availableBalance === 1200, sellerAfterForceDeliver.wallet);

  // Second disputed order, resolved in buyer's favor this time.
  const disputedOrder2 = await Order.create({
    orderNumber: 'HMD-DISPUTE-2',
    buyerId: buyer._id,
    sellerId: seller._id,
    items: [{ productId: pendingProduct._id, titleSnapshot: 'Box', priceSnapshot: 1200, quantity: 1, subtotal: 1200 }],
    productPrice: 1200,
    deliveryCharges: 0,
    totalAmount: 1200,
    shippingAddress: { addressLine: '1 Test St', city: 'Lahore' },
    status: 'shipped',
    payment: { method: 'jazzcash', status: 'paid' },
  });
  const resolveBuyerFavorRes = await auth(request(app).post(`/api/admin/orders/${disputedOrder2._id}/resolve-dispute`)).send({
    reason: 'Package lost in transit',
  });
  check('resolve dispute (buyer favor / cancel) -> 200', resolveBuyerFavorRes.status === 200);
  check('order force-cancelled', resolveBuyerFavorRes.body.data.status === 'cancelled');

  // ------------------------------------------------------- WALLET MGMT
  console.log('\n--- WALLET WITHDRAWAL APPROVAL (FR-4-03) ---');
  const settingsRes = await auth(request(app).patch('/api/admin/settings')).send({
    walletSettings: { manualApprovalRequired: true, requiredSuccessfulSalesForWithdrawal: 2, minWithdrawalAmount: 100 },
  });
  check('update platform settings -> 200', settingsRes.status === 200);
  check('manualApprovalRequired now true', settingsRes.body.data.walletSettings.manualApprovalRequired === true);

  // Simulate a second completed sale directly so withdrawal becomes eligible, then request it via the real seller endpoint.
  const sellerForWithdraw = await Seller.findById(seller._id);
  sellerForWithdraw.wallet.completedSalesCount = 2;
  sellerForWithdraw.wallet.withdrawalEnabled = true;
  await sellerForWithdraw.save();

  const sellerToken = require('../src/api/shared/utils/jwt.util').signUserToken({ id: seller._id, role: 'seller' });
  const withdrawReqRes = await request(app)
    .post('/api/seller/wallet/withdraw')
    .set('Authorization', `Bearer ${sellerToken}`)
    .send({ amount: 500 });
  check('seller withdrawal request -> 201, status pending (manual approval on)', withdrawReqRes.status === 201 && withdrawReqRes.body.data.status === 'pending', withdrawReqRes.body);
  const withdrawalTxnId = withdrawReqRes.body.data._id;

  const sellerAfterRequest = await Seller.findById(seller._id);
  check('funds reserved immediately on request', sellerAfterRequest.wallet.availableBalance === 700, sellerAfterRequest.wallet);

  const pendingListRes = await auth(request(app).get('/api/admin/wallet/withdrawals/pending'));
  check('list pending withdrawals -> 1 item', pendingListRes.body.data.length === 1, pendingListRes.body);

  const approveWithdrawRes = await auth(request(app).post(`/api/admin/wallet/withdrawals/${withdrawalTxnId}/approve`));
  check('approve withdrawal -> 200', approveWithdrawRes.status === 200 && approveWithdrawRes.body.data.status === 'completed');

  // Second withdrawal request, this time rejected — funds should be returned.
  const withdraw2Res = await request(app)
    .post('/api/seller/wallet/withdraw')
    .set('Authorization', `Bearer ${sellerToken}`)
    .send({ amount: 200 });
  const withdrawal2TxnId = withdraw2Res.body.data._id;
  const balanceAfterSecondRequest = (await Seller.findById(seller._id)).wallet.availableBalance;
  check('balance reduced after 2nd request', balanceAfterSecondRequest === 500, balanceAfterSecondRequest);

  const rejectWithdrawRes = await auth(request(app).post(`/api/admin/wallet/withdrawals/${withdrawal2TxnId}/reject`)).send({
    reason: 'Bank account details could not be verified',
  });
  check('reject withdrawal -> 200', rejectWithdrawRes.status === 200 && rejectWithdrawRes.body.data.status === 'rejected');

  const balanceAfterRejection = (await Seller.findById(seller._id)).wallet.availableBalance;
  check('funds returned to balance after rejection', balanceAfterRejection === 700, balanceAfterRejection);

  // ------------------------------------------------------------- REVIEWS/REPORTS
  console.log('\n--- REPORTS & REVIEW MODERATION (SRS 4.8/4.11) ---');
  const review = await Review.create({
    buyerId: buyer._id,
    sellerId: seller._id,
    productId: pendingProduct._id,
    orderId: disputedOrder._id,
    rating: 1,
    comment: 'This is an abusive/fake review for testing.',
    editWindowExpiresAt: new Date(Date.now() + 1000 * 60 * 60),
  });
  const { recalculateAggregateRatings } = require('../src/api/shared/services/ratingAggregationService');
  await recalculateAggregateRatings(seller._id, pendingProduct._id);

  const buyerToken = require('../src/api/shared/utils/jwt.util').signUserToken({ id: buyer._id, role: 'buyer' });
  const fileReportRes = await request(app)
    .post(`/api/reviews/${review._id}/report`)
    .set('Authorization', `Bearer ${buyerToken}`)
    .send({ reason: 'This review is fake' });
  check('buyer files report on review -> 201', fileReportRes.status === 201, fileReportRes.body);
  const reportId = fileReportRes.body.data._id;

  const productRatingBefore = (await Product.findById(pendingProduct._id)).ratingAvg;
  check('product rating reflects the (fake) review before moderation', productRatingBefore === 1, productRatingBefore);

  const listReportsRes = await auth(request(app).get('/api/admin/reports').query({ status: 'open' }));
  check('list open reports -> at least 1', listReportsRes.body.data.length >= 1);

  const resolveReportRes = await auth(request(app).post(`/api/admin/reports/${reportId}/resolve`)).send({
    outcome: 'actioned',
    resolutionNote: 'Confirmed fake, removed',
  });
  check('resolve report (actioned) -> 200', resolveReportRes.status === 200, resolveReportRes.body);

  const reviewAfterAction = await Review.findById(review._id);
  check('review moderationStatus now removed', reviewAfterAction.moderationStatus === 'removed');

  const productRatingAfter = (await Product.findById(pendingProduct._id)).ratingAvg;
  check('product rating recalculated after review removal', productRatingAfter === 0, productRatingAfter);

  // ------------------------------------------------------------- SUPPORT
  console.log('\n--- SUPPORT TICKETS (SRS 4.12) ---');
  const raiseTicketRes = await request(app)
    .post('/api/buyer/support-tickets')
    .set('Authorization', `Bearer ${buyerToken}`)
    .send({ subject: 'Order issue', description: 'My order never arrived and the seller is unresponsive.' });
  check('buyer raises ticket -> 201', raiseTicketRes.status === 201, raiseTicketRes.body);
  const ticketId = raiseTicketRes.body.data._id;

  const otherBuyer = await Buyer.create({ phone: '+923001230000', name: 'Other Buyer' });
  const otherBuyerToken = require('../src/api/shared/utils/jwt.util').signUserToken({ id: otherBuyer._id, role: 'buyer' });
  const unauthorizedRespond = await request(app)
    .post(`/api/buyer/support-tickets/${ticketId}/respond`)
    .set('Authorization', `Bearer ${otherBuyerToken}`)
    .send({ message: 'Not my ticket' });
  check('other buyer cannot respond to ticket they did not raise -> 404', unauthorizedRespond.status === 404, unauthorizedRespond.body);

  const adminListTickets = await auth(request(app).get('/api/admin/support-tickets'));
  check('admin lists all tickets -> at least 1', adminListTickets.body.data.length >= 1);

  const adminRespondRes = await auth(request(app).post(`/api/admin/support-tickets/${ticketId}/respond`)).send({
    message: "We're looking into this and will update you shortly.",
  });
  check('admin responds to ticket -> 200', adminRespondRes.status === 200);
  check('ticket auto-moves to in_progress on admin response', adminRespondRes.body.data.status === 'in_progress');

  const resolveTicketRes = await auth(request(app).patch(`/api/admin/support-tickets/${ticketId}/status`)).send({ status: 'resolved' });
  check('admin resolves ticket -> 200', resolveTicketRes.status === 200 && resolveTicketRes.body.data.status === 'resolved');

  // -------------------------------------------------------- NOTIFICATIONS
  console.log('\n--- NOTIFICATION BROADCAST (SRS 4.10) ---');
  const broadcastRes = await auth(request(app).post('/api/admin/notifications/broadcast')).send({
    audience: 'all',
    title: 'Platform maintenance tonight',
    body: 'HunarmandAI will be briefly unavailable for maintenance at 11 PM.',
  });
  check('broadcast to all -> 201', broadcastRes.status === 201, broadcastRes.body);
  check('broadcast reached both buyer and seller', broadcastRes.body.data.count >= 2, broadcastRes.body.data);

  // ------------------------------------------------------- PLATFORM SETTINGS
  console.log('\n--- PLATFORM SETTINGS (SRS 4.13) ---');
  const getSettingsRes = await auth(request(app).get('/api/admin/settings'));
  check('get settings -> 200', getSettingsRes.status === 200);
  check('commission setting queryable', typeof getSettingsRes.body.data.platformCommissionPercentage === 'number');

  const setCommissionRes = await auth(request(app).patch('/api/admin/settings')).send({ platformCommissionPercentage: 5 });
  check('set commission to 5% -> 200', setCommissionRes.status === 200 && setCommissionRes.body.data.platformCommissionPercentage === 5);

  // --------------------------------------------------------------- SUMMARY
  const failed = results.filter((r) => !r.pass);
  console.log(`\n${results.length - failed.length}/${results.length} checks passed.`);
  if (failed.length > 0) {
    console.log('FAILED CHECKS:', failed.map((f) => f.label));
    process.exitCode = 1;
  } else {
    console.log('ALL ADMIN MODULE E2E CHECKS PASSED.');
  }
}

run().catch((err) => {
  console.error('E2E TEST CRASHED:', err);
  process.exit(1);
});
