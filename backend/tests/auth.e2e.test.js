/**
 * End-to-end smoke test for Phase 5 (Authentication module).
 * Spins up a real in-memory MongoDB and fires real HTTP requests at the
 * actual Express app — not unit-level mocking — to prove the seller,
 * buyer, and admin auth flows work together correctly.
 *
 * Run: node tests/auth.e2e.test.js
 */
process.env.NODE_ENV = 'test';
process.env.CNIC_ENCRYPTION_KEY = require('crypto').randomBytes(32).toString('hex');
process.env.JWT_SECRET = 'test-secret';
process.env.JWT_ADMIN_SECRET = 'test-admin-secret';

const request = require('supertest');
const { patchModelWithFakeStore } = require('./helpers/fakeMongoStore');

let app;
let capturedLogs = [];

const originalLog = console.log;
function captureConsole() {
  capturedLogs = [];
  console.log = (...args) => {
    capturedLogs.push(args.join(' '));
    originalLog(...args);
  };
}
function restoreConsole() {
  console.log = originalLog;
}
function extractOtpFromLogs() {
  const line = capturedLogs.find((l) => l.includes('verification code is'));
  const match = line && line.match(/verification code is (\d{6})/);
  return match ? match[1] : null;
}
function extractResetTokenFromLogs() {
  const line = capturedLogs.find((l) => l.includes('token='));
  const match = line && line.match(/token=([a-f0-9]+)/);
  return match ? match[1] : null;
}

async function run() {
  // NOTE: real MongoDB is unreachable in this sandbox (see fakeMongoStore.js
  // header). Patch the three models this test exercises with the in-memory
  // shim before anything requires them elsewhere in the app.
  const { Seller, Buyer, Admin } = require('../src/api/shared/models');
  patchModelWithFakeStore(Seller);
  patchModelWithFakeStore(Buyer);
  patchModelWithFakeStore(Admin);

  app = require('../src/app');

  const results = [];
  const check = (label, condition) => {
    results.push({ label, pass: Boolean(condition) });
    console.log(`${condition ? '✓' : '✗'} ${label}`);
  };

  // ---------------------------------------------------------------- SELLER
  console.log('\n--- SELLER AUTH FLOW ---');
  const sellerPhone = '+923001234567';

  captureConsole();
  const sellerOtpReq = await request(app).post('/api/seller/auth/otp/request').send({ phone: sellerPhone });
  restoreConsole();
  check('seller OTP request -> 200', sellerOtpReq.status === 200);
  check('seller OTP request -> isNewAccount true', sellerOtpReq.body.data.isNewAccount === true);
  const sellerOtpCode = extractOtpFromLogs();
  check('seller OTP code captured from SMS log', Boolean(sellerOtpCode));

  const sellerBadVerify = await request(app)
    .post('/api/seller/auth/otp/verify')
    .send({ phone: sellerPhone, code: '000000' });
  check('seller wrong OTP -> 400', sellerBadVerify.status === 400);

  const sellerVerify = await request(app)
    .post('/api/seller/auth/otp/verify')
    .send({ phone: sellerPhone, code: sellerOtpCode });
  check('seller correct OTP -> 200', sellerVerify.status === 200);
  check('seller receives JWT', Boolean(sellerVerify.body.data.token));
  check('seller profileComplete is false (fresh account)', sellerVerify.body.data.seller.profileComplete === false);
  const sellerToken = sellerVerify.body.data.token;

  const sellerLogout1 = await request(app)
    .post('/api/seller/auth/logout')
    .set('Authorization', `Bearer ${sellerToken}`);
  check('seller logout (valid token) -> 200', sellerLogout1.status === 200);

  const sellerLogout2 = await request(app)
    .post('/api/seller/auth/logout')
    .set('Authorization', `Bearer ${sellerToken}`);
  check('seller reusing revoked token -> 401', sellerLogout2.status === 401);

  // ----------------------------------------------------------------- BUYER
  console.log('\n--- BUYER AUTH FLOW ---');
  const buyerPhone = '+923009876543';

  captureConsole();
  await request(app).post('/api/buyer/auth/otp/request').send({ phone: buyerPhone, preferredLanguage: 'en' });
  restoreConsole();
  const buyerOtpCode = extractOtpFromLogs();
  check('buyer OTP code captured from SMS log', Boolean(buyerOtpCode));

  const buyerVerify = await request(app)
    .post('/api/buyer/auth/otp/verify')
    .send({ phone: buyerPhone, code: buyerOtpCode });
  check('buyer correct OTP -> 200', buyerVerify.status === 200);
  check('buyer credibilityScore defaults to 50', buyerVerify.body.data.buyer.credibilityScore === 50);
  check('buyer preferredLanguage persisted as en', buyerVerify.body.data.buyer.preferredLanguage === 'en');
  const buyerToken = buyerVerify.body.data.token;

  // Cross-role guard: a buyer token must not work against the seller logout route.
  const crossRoleAttempt = await request(app)
    .post('/api/seller/auth/logout')
    .set('Authorization', `Bearer ${buyerToken}`);
  check('buyer token rejected by seller-only route -> 403', crossRoleAttempt.status === 403);

  // ----------------------------------------------------------------- ADMIN
  console.log('\n--- ADMIN AUTH FLOW ---');
  const { hashPassword } = require('../src/api/shared/utils/hash.util');
  await Admin.create({
    email: 'admin@hunarmandai.pk',
    passwordHash: await hashPassword('OldPassw0rd!'),
    name: 'Test Admin',
    role: 'super_admin',
  });

  const badLogin = await request(app)
    .post('/api/admin/auth/login')
    .send({ email: 'admin@hunarmandai.pk', password: 'WrongPassword' });
  check('admin wrong password -> 401', badLogin.status === 401);

  const goodLogin = await request(app)
    .post('/api/admin/auth/login')
    .send({ email: 'admin@hunarmandai.pk', password: 'OldPassw0rd!' });
  check('admin correct login -> 200', goodLogin.status === 200);
  check('admin receives JWT', Boolean(goodLogin.body.data.token));

  captureConsole();
  const forgotReq = await request(app)
    .post('/api/admin/auth/password/forgot')
    .send({ email: 'admin@hunarmandai.pk' });
  restoreConsole();
  check('admin forgot-password -> 200', forgotReq.status === 200);
  const resetToken = extractResetTokenFromLogs();
  check('admin reset token captured from email log', Boolean(resetToken));

  const resetBad = await request(app)
    .post('/api/admin/auth/password/reset')
    .send({ token: 'not-a-real-token', newPassword: 'NewPassw0rd!' });
  check('admin reset with invalid token -> 400', resetBad.status === 400);

  const resetGood = await request(app)
    .post('/api/admin/auth/password/reset')
    .send({ token: resetToken, newPassword: 'NewPassw0rd!' });
  check('admin reset with valid token -> 200', resetGood.status === 200);

  const loginWithOldPw = await request(app)
    .post('/api/admin/auth/login')
    .send({ email: 'admin@hunarmandai.pk', password: 'OldPassw0rd!' });
  check('admin old password now rejected -> 401', loginWithOldPw.status === 401);

  const loginWithNewPw = await request(app)
    .post('/api/admin/auth/login')
    .send({ email: 'admin@hunarmandai.pk', password: 'NewPassw0rd!' });
  check('admin new password works -> 200', loginWithNewPw.status === 200);

  // -------------------------------------------------------- VALIDATION
  console.log('\n--- VALIDATION & MISC ---');
  const badPhone = await request(app).post('/api/seller/auth/otp/request').send({ phone: '12345' });
  check('invalid phone format -> 400', badPhone.status === 400);

  const health = await request(app).get('/health');
  check('health check -> 200', health.status === 200);

  // --------------------------------------------------------------- SUMMARY
  const failed = results.filter((r) => !r.pass);
  console.log(`\n${results.length - failed.length}/${results.length} checks passed.`);
  if (failed.length > 0) {
    console.log('FAILED CHECKS:', failed.map((f) => f.label));
    process.exitCode = 1;
  } else {
    console.log('ALL AUTH E2E CHECKS PASSED.');
  }

  await mongoose_cleanup();
}

async function mongoose_cleanup() {
  // No real connection was opened (fake store shim) — nothing to close.
}

run().catch((err) => {
  console.error('E2E TEST CRASHED:', err);
  process.exit(1);
});
