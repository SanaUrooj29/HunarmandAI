const express = require('express');
const controller = require('../controllers/category.controller');

const router = express.Router();

// Public — used by the seller (profile/product category picker) and the
// buyer (marketplace category filter, FR-6-03). No auth required.
router.get('/', controller.listCategories);

module.exports = router;
