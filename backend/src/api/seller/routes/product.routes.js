const express = require('express');
const controller = require('../controllers/product.controller');
const {
  createProductValidator,
  updateProductValidator,
  stockStatusValidator,
  bulkStockStatusValidator,
  listProductsValidator,
} = require('../validators/product.validator');
const { validate } = require('../../shared/middleware/validate.middleware');
const { authenticateUser } = require('../../shared/middleware/auth.middleware');
const { requireRole } = require('../../shared/middleware/rbac.middleware');
const { singleImage } = require('../../shared/middleware/upload.middleware');
const { ROLES } = require('../../shared/constants/enums');

const router = express.Router();
router.use(authenticateUser, requireRole(ROLES.SELLER));

// UC-03 — AI listing generation (separate from creation so the seller can review/edit first)
router.post('/ai-listing', singleImage('image'), controller.generateAiListing);

// UC-04 — inventory & store management
router.get('/', listProductsValidator, validate, controller.listMyProducts);
router.post('/', createProductValidator, validate, controller.createProduct);
router.patch('/stock/bulk', bulkStockStatusValidator, validate, controller.bulkSetStockStatus);
router.get('/:productId', controller.getMyProduct);
router.patch('/:productId', updateProductValidator, validate, controller.updateMyProduct);
router.patch('/:productId/stock', stockStatusValidator, validate, controller.setStockStatus);
router.delete('/:productId', controller.deleteMyProduct);

module.exports = router;
