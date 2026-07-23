const express = require('express');
const controller = require('../controllers/auth.controller');
const {
  loginValidator,
  requestPasswordResetValidator,
  resetPasswordValidator,
} = require('../validators/auth.validator');
const { validate } = require('../../shared/middleware/validate.middleware');
const { generalApiLimiter } = require('../../shared/middleware/rateLimiter.middleware');
const { authenticateAdmin } = require('../../shared/middleware/auth.middleware');

const router = express.Router();

router.post('/login', generalApiLimiter, loginValidator, validate, controller.login);
router.post('/logout', authenticateAdmin, controller.logout);
router.post(
  '/password/forgot',
  generalApiLimiter,
  requestPasswordResetValidator,
  validate,
  controller.requestPasswordReset
);
router.post('/password/reset', generalApiLimiter, resetPasswordValidator, validate, controller.resetPassword);

module.exports = router;
