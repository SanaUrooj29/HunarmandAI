const { body, param, query } = require('express-validator');

const listProductsValidator = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('approvalStatus').optional().isIn(['pending', 'approved', 'rejected']),
  query('categoryId').optional().isMongoId(),
  query('search').optional().trim(),
];

const productIdParamValidator = [param('productId').isMongoId()];
const rejectValidator = [param('productId').isMongoId(), body('reason').notEmpty().withMessage('A rejection reason is required')];
const removeValidator = [param('productId').isMongoId(), body('reason').notEmpty().withMessage('A removal reason is required')];
const editCategoryValidator = [param('productId').isMongoId(), body('categoryId').isMongoId()];

module.exports = { listProductsValidator, productIdParamValidator, rejectValidator, removeValidator, editCategoryValidator };
