const express = require('express');
const controller = require('../controllers/auth.controller');
const { requestOtpValidator, verifyOtpValidator } = require('../validators/auth.validator');
const { validate } = require('../../shared/middleware/validate.middleware');
const { otpRequestLimiter, otpVerifyLimiter } = require('../../shared/middleware/rateLimiter.middleware');
const { authenticateUser } = require('../../shared/middleware/auth.middleware');
const { requireRole } = require('../../shared/middleware/rbac.middleware');
const { ROLES } = require('../../shared/constants/enums');

const router = express.Router();

// UC-01 Main Flow
router.post('/otp/request', otpRequestLimiter, requestOtpValidator, validate, controller.requestOtp);
router.post('/otp/verify', otpVerifyLimiter, verifyOtpValidator, validate, controller.verifyOtp);

// UC-01 — "Logout securely"
router.post('/logout', authenticateUser, requireRole(ROLES.SELLER), controller.logout);

module.exports = router;
