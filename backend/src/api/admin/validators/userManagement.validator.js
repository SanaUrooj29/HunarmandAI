const { query, param } = require('express-validator');

const listSellersValidator = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('search').optional().trim(),
  query('verificationStatus').optional().isIn(['pending', 'verified', 'suspended']),
  query('accountStatus').optional().isIn(['active', 'suspended', 'deleted']),
];

const listBuyersValidator = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('search').optional().trim(),
  query('accountStatus').optional().isIn(['active', 'suspended', 'deleted']),
];

const sellerIdParamValidator = [param('sellerId').isMongoId()];
const buyerIdParamValidator = [param('buyerId').isMongoId()];

module.exports = { listSellersValidator, listBuyersValidator, sellerIdParamValidator, buyerIdParamValidator };
