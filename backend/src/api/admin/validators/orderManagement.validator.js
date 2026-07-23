const { body, param, query } = require('express-validator');
const { ORDER_STATUS } = require('../../shared/constants/enums');

const listOrdersValidator = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('status').optional().isIn(ORDER_STATUS),
  query('buyerId').optional().isMongoId(),
  query('sellerId').optional().isMongoId(),
  query('orderNumber').optional().trim(),
];

const orderIdParamValidator = [param('orderId').isMongoId()];
const resolveDisputeValidator = [param('orderId').isMongoId(), body('reason').notEmpty()];
const resolveDisputeSellerFavorValidator = [param('orderId').isMongoId(), body('note').optional().trim().isLength({ max: 500 })];

module.exports = { listOrdersValidator, orderIdParamValidator, resolveDisputeValidator, resolveDisputeSellerFavorValidator };
