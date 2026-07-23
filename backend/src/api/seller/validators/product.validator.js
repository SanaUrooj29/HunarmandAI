const { body, param, query } = require('express-validator');
const { STOCK_STATUS } = require('../../shared/constants/enums');

const createProductValidator = [
  body('categoryId').isMongoId().withMessage('categoryId must be a valid category id'),
  body('title').trim().isLength({ min: 3, max: 150 }),
  body('description').trim().isLength({ min: 10, max: 3000 }),
  body('images').isArray({ min: 1, max: 3 }).withMessage('Please provide between 1 and 3 image URLs.'),
  // Allow localhost and URLs without protocol (e.g. http://localhost:5000/...) by
  // disabling the TLD requirement and not forcing a protocol.
  body('images.*').isURL({ require_protocol: false, require_host: true, require_tld: false }).withMessage('Each image must be a valid URL'),
  body('price').isFloat({ gt: 0 }).withMessage('price must be a positive number'),
  body('quantity').optional().isInt({ min: 1, max: 500 }).withMessage('Quantity must be between 1 and 500.'),
  body('stockStatus').optional().isIn(STOCK_STATUS),
  body('tags').optional().isArray(),
  body('isAiGenerated').optional().isBoolean(),
];

const updateProductValidator = [
  param('productId').isMongoId(),
  body('categoryId').optional().isMongoId(),
  body('title').optional().trim().isLength({ min: 3, max: 150 }),
  body('description').optional().trim().isLength({ min: 10, max: 3000 }),
  body('images').optional().isArray({ min: 1 }),
  body('price').optional().isFloat({ gt: 0 }),
  body('quantity').optional().isInt({ min: 1, max: 500 }).withMessage('Quantity must be between 1 and 500.'),
  body('tags').optional().isArray(),
];

const stockStatusValidator = [
  param('productId').isMongoId(),
  body('stockStatus').isIn(STOCK_STATUS),
];

const bulkStockStatusValidator = [
  body('productIds').isArray({ min: 1 }),
  body('productIds.*').isMongoId(),
  body('stockStatus').isIn(STOCK_STATUS),
];

const listProductsValidator = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('stockStatus').optional().isIn(STOCK_STATUS),
  query('approvalStatus').optional().isIn(['pending', 'approved', 'rejected']),
];

module.exports = {
  createProductValidator,
  updateProductValidator,
  stockStatusValidator,
  bulkStockStatusValidator,
  listProductsValidator,
};
