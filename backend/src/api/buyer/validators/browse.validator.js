const { query, param } = require('express-validator');

const searchValidator = [
  query('q').optional().trim(),
  query('categoryId').optional().isMongoId(),
  query('minPrice').optional().isFloat({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 }),
  query('city').optional().trim(),
  query('minRating').optional().isFloat({ min: 0, max: 5 }),
  query('stockStatus').optional().isIn(['in_stock', 'out_of_stock']),
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
];

const feedValidator = [query('limit').optional().isInt({ min: 1, max: 50 }).toInt()];

const productIdValidator = [param('productId').isMongoId()];
const sellerIdValidator = [param('sellerId').isMongoId()];

module.exports = { searchValidator, feedValidator, productIdValidator, sellerIdValidator };
