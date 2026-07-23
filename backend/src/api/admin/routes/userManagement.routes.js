const express = require('express');
const controller = require('../controllers/userManagement.controller');
const {
  listSellersValidator,
  listBuyersValidator,
  sellerIdParamValidator,
  buyerIdParamValidator,
} = require('../validators/userManagement.validator');
const { validate } = require('../../shared/middleware/validate.middleware');

const router = express.Router();

router.get('/sellers', listSellersValidator, validate, controller.listSellers);
router.get('/sellers/:sellerId', sellerIdParamValidator, validate, controller.getSellerDetail);
router.post('/sellers/:sellerId/verify', sellerIdParamValidator, validate, controller.verifySeller);
router.post('/sellers/:sellerId/suspend', sellerIdParamValidator, validate, controller.suspendSeller);
router.post('/sellers/:sellerId/activate', sellerIdParamValidator, validate, controller.activateSeller);
router.delete('/sellers/:sellerId', sellerIdParamValidator, validate, controller.deleteSeller);

router.get('/buyers', listBuyersValidator, validate, controller.listBuyers);
router.get('/buyers/:buyerId', buyerIdParamValidator, validate, controller.getBuyerDetail);
router.post('/buyers/:buyerId/suspend', buyerIdParamValidator, validate, controller.suspendBuyer);
router.post('/buyers/:buyerId/activate', buyerIdParamValidator, validate, controller.activateBuyer);
router.delete('/buyers/:buyerId', buyerIdParamValidator, validate, controller.deleteBuyer);

module.exports = router;
