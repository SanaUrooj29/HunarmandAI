const express = require('express');
const controller = require('../controllers/cart.controller');
const { addItemValidator, updateQuantityValidator, productIdParamValidator } = require('../validators/cart.validator');
const { validate } = require('../../shared/middleware/validate.middleware');
const { authenticateUser } = require('../../shared/middleware/auth.middleware');
const { requireRole } = require('../../shared/middleware/rbac.middleware');
const { ROLES } = require('../../shared/constants/enums');

const router = express.Router();
router.use(authenticateUser, requireRole(ROLES.BUYER));

router.get('/', controller.getMyCart);
router.post('/items', addItemValidator, validate, controller.addItem);
router.patch('/items/:productId', updateQuantityValidator, validate, controller.updateItemQuantity);
router.delete('/items/:productId', productIdParamValidator, validate, controller.removeItem);
router.delete('/', controller.clearCart);

module.exports = router;
