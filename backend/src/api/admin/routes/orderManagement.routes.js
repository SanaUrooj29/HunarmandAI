const express = require('express');
const controller = require('../controllers/orderManagement.controller');
const {
  listOrdersValidator,
  orderIdParamValidator,
  resolveDisputeValidator,
  resolveDisputeSellerFavorValidator,
} = require('../validators/orderManagement.validator');
const { validate } = require('../../shared/middleware/validate.middleware');

const router = express.Router();

router.get('/', listOrdersValidator, validate, controller.listOrders);
router.get('/:orderId', orderIdParamValidator, validate, controller.getOrderDetail);
router.post('/:orderId/resolve-dispute', resolveDisputeValidator, validate, controller.resolveDispute);
router.post(
  '/:orderId/resolve-dispute-seller-favor',
  resolveDisputeSellerFavorValidator,
  validate,
  controller.resolveDisputeInSellerFavor
);

module.exports = router;
