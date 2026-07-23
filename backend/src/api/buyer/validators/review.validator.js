const { body, param } = require('express-validator');

const createReviewValidator = [
  body('productId').isMongoId(),
  body('orderId').isMongoId(),
  body('rating').isInt({ min: 1, max: 5 }),
  body('comment').optional().trim().isLength({ max: 1000 }),
];

const editReviewValidator = [
  param('reviewId').isMongoId(),
  body('rating').optional().isInt({ min: 1, max: 5 }),
  body('comment').optional().trim().isLength({ max: 1000 }),
];

const productIdParamValidator = [param('productId').isMongoId()];
const reviewIdParamValidator = [param('reviewId').isMongoId()];

module.exports = { createReviewValidator, editReviewValidator, productIdParamValidator, reviewIdParamValidator };
