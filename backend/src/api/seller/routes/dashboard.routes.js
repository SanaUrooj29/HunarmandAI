const express = require('express');
const controller = require('../controllers/dashboard.controller');
const { authenticateUser } = require('../../shared/middleware/auth.middleware');
const { requireRole } = require('../../shared/middleware/rbac.middleware');
const { ROLES } = require('../../shared/constants/enums');

const router = express.Router();
router.use(authenticateUser, requireRole(ROLES.SELLER));

router.get('/', controller.getDashboard);

module.exports = router;
