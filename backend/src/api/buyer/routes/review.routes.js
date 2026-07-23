const express = require('express');
const controller = require('../controllers/review.controller');
const {
  createReviewValidator,
  editReviewValidator,
  productIdParamValidator,
  reviewIdParamValidator,
} = require('../validators/review.validator');
const { validate } = require('../../shared/middleware/validate.middleware');
const { authenticateUser } = require('../../shared/middleware/auth.middleware');
const { requireRole } = require('../../shared/middleware/rbac.middleware');
const { ROLES } = require('../../shared/constants/enums');

const router = express.Router();

// Public — reading reviews for a product does not require a buyer session.
router.get('/product/:productId', productIdParamValidator, validate, controller.listForProduct);

router.use(authenticateUser, requireRole(ROLES.BUYER));
router.post('/', createReviewValidator, validate, controller.createReview);
router.patch('/:reviewId', editReviewValidator, validate, controller.editReview);
router.post('/:reviewId/report', reviewIdParamValidator, validate, controller.reportReview);

module.exports = router;
