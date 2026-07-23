const { body, query } = require('express-validator');

const withdrawValidator = [body('amount').isFloat({ gt: 0 }).withMessage('amount must be a positive number')];

const listTransactionsValidator = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
];

module.exports = { withdrawValidator, listTransactionsValidator };
