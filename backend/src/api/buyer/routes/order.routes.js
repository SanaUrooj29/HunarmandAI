const express = require('express');
const controller = require('../controllers/order.controller');
const { listOrdersValidator, orderIdParamValidator, cancelOrderValidator } = require('../validators/order.validator');
const { validate } = require('../../shared/middleware/validate.middleware');
const { authenticateUser } = require('../../shared/middleware/auth.middleware');
const { requireRole } = require('../../shared/middleware/rbac.middleware');
const { ROLES } = require('../../shared/constants/enums');

const router = express.Router();
router.use(authenticateUser, requireRole(ROLES.BUYER));

router.get('/', listOrdersValidator, validate, controller.listMyOrders);
router.get('/:orderId', orderIdParamValidator, validate, controller.getMyOrderDetail);
router.post('/:orderId/cancel', cancelOrderValidator, validate, controller.cancelMyOrder);

module.exports = router;
