const express = require('express');
const controller = require('../controllers/productModeration.controller');
const {
  listProductsValidator,
  productIdParamValidator,
  rejectValidator,
  removeValidator,
  editCategoryValidator,
} = require('../validators/productModeration.validator');
const { validate } = require('../../shared/middleware/validate.middleware');

const router = express.Router();

router.get('/', listProductsValidator, validate, controller.listProducts);
router.get('/:productId', productIdParamValidator, validate, controller.getProductDetail);
router.post('/:productId/approve', productIdParamValidator, validate, controller.approveProduct);
router.post('/:productId/reject', rejectValidator, validate, controller.rejectProduct);
router.delete('/:productId', removeValidator, validate, controller.removeProduct);
router.patch('/:productId/category', editCategoryValidator, validate, controller.editProductCategory);

module.exports = router;
