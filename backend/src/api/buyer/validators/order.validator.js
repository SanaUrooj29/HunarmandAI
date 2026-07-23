const { body, param, query } = require('express-validator');
const { ORDER_STATUS } = require('../../shared/constants/enums');

const listOrdersValidator = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('status').optional().isIn(ORDER_STATUS),
];
const orderIdParamValidator = [param('orderId').isMongoId()];
const cancelOrderValidator = [param('orderId').isMongoId(), body('reason').optional().trim().isLength({ max: 500 })];

module.exports = { listOrdersValidator, orderIdParamValidator, cancelOrderValidator };
