const express = require('express');
const controller = require('../controllers/order.controller');
const {
  listOrdersValidator,
  orderIdParamValidator,
  rejectOrderValidator,
  advanceStatusValidator,
} = require('../validators/order.validator');
const { validate } = require('../../shared/middleware/validate.middleware');
const { authenticateUser } = require('../../shared/middleware/auth.middleware');
const { requireRole } = require('../../shared/middleware/rbac.middleware');
const { ROLES } = require('../../shared/constants/enums');

const router = express.Router();
router.use(authenticateUser, requireRole(ROLES.SELLER));

router.get('/', listOrdersValidator, validate, controller.listMyOrders);
router.get('/:orderId', orderIdParamValidator, validate, controller.getMyOrderDetail);
router.post('/:orderId/accept', orderIdParamValidator, validate, controller.acceptOrder);
router.post('/:orderId/reject', rejectOrderValidator, validate, controller.rejectOrder);
router.patch('/:orderId/status', advanceStatusValidator, validate, controller.advanceStatus);

module.exports = router;
