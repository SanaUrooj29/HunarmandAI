const express = require('express');
const controller = require('../controllers/checkout.controller');
const { initiateCheckoutValidator, callbackParamValidator } = require('../validators/checkout.validator');
const { validate } = require('../../shared/middleware/validate.middleware');
const { authenticateUser } = require('../../shared/middleware/auth.middleware');
const { requireRole } = require('../../shared/middleware/rbac.middleware');
const { ROLES } = require('../../shared/constants/enums');

const router = express.Router();

router.post(
  '/initiate',
  authenticateUser,
  requireRole(ROLES.BUYER),
  initiateCheckoutValidator,
  validate,
  controller.initiateCheckout
);

// Public — called by the payment gateway server-to-server, not the buyer's browser.
router.post('/callback/:method', callbackParamValidator, validate, controller.handleCallback);

module.exports = router;
