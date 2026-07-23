const { query, param, body } = require('express-validator');
const { WALLET_TRANSACTION_STATUS, WALLET_TRANSACTION_TYPE } = require('../../shared/constants/enums');

const listTransactionsValidator = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('status').optional().isIn(WALLET_TRANSACTION_STATUS),
  query('type').optional().isIn(WALLET_TRANSACTION_TYPE),
  query('sellerId').optional().isMongoId(),
];

const transactionIdParamValidator = [param('transactionId').isMongoId()];

module.exports = { listTransactionsValidator, transactionIdParamValidator };
