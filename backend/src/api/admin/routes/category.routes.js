const express = require('express');
const controller = require('../controllers/category.controller');
const { createCategoryValidator, updateCategoryValidator, reorderValidator } = require('../validators/category.validator');
const { validate } = require('../../shared/middleware/validate.middleware');

const router = express.Router();
// Auth/RBAC applied centrally in admin/routes/index.js

router.post('/', createCategoryValidator, validate, controller.createCategory);
router.patch('/reorder', reorderValidator, validate, controller.reorderCategories);
router.patch('/:categoryId', updateCategoryValidator, validate, controller.updateCategory);
router.delete('/:categoryId', controller.deleteCategory);

module.exports = router;
