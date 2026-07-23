const { body, param } = require('express-validator');

const createCategoryValidator = [
  body('name').trim().isLength({ min: 2, max: 60 }),
  body('parentCategory').optional().isMongoId(),
  body('sortOrder').optional().isInt({ min: 0 }),
];

const updateCategoryValidator = [
  param('categoryId').isMongoId(),
  body('name').optional().trim().isLength({ min: 2, max: 60 }),
  body('sortOrder').optional().isInt({ min: 0 }),
  body('status').optional().isIn(['active', 'inactive']),
];

const reorderValidator = [body('orderedIds').isArray({ min: 1 }), body('orderedIds.*').isMongoId()];

module.exports = { createCategoryValidator, updateCategoryValidator, reorderValidator };
