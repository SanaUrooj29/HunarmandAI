const express = require('express');
const controller = require('../controllers/dashboard.controller');

const router = express.Router();
// Auth/RBAC applied centrally in admin/routes/index.js

router.get('/', controller.getStats);

module.exports = router;
