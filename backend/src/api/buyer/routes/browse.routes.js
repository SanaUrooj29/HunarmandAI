const express = require('express');
const controller = require('../controllers/browse.controller');
const { searchValidator, feedValidator, productIdValidator, sellerIdValidator } = require('../validators/browse.validator');
const { validate } = require('../../shared/middleware/validate.middleware');

const router = express.Router();

// Public — browsing the marketplace does not require a buyer session.
router.get('/', searchValidator, validate, controller.searchProducts);
router.get('/featured', feedValidator, validate, controller.getFeatured);
router.get('/latest', feedValidator, validate, controller.getLatest);
router.get('/popular', feedValidator, validate, controller.getPopular);
router.get('/recommended', feedValidator, validate, controller.getRecommended);
router.get('/sellers/:sellerId', sellerIdValidator, validate, controller.getSellerStorefront);
router.get('/:productId', productIdValidator, validate, controller.getProductDetail);

module.exports = router;
