const { body, param } = require('express-validator');

const addItemValidator = [
  body('productId').isMongoId(),
  body('quantity').optional().isInt({ min: 1 }),
];

const updateQuantityValidator = [
  param('productId').isMongoId(),
  body('quantity').isInt({ min: 0 }),
];

const productIdParamValidator = [param('productId').isMongoId()];

module.exports = { addItemValidator, updateQuantityValidator, productIdParamValidator };
