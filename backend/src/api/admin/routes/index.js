const express = require('express');
const authRoutes = require('./auth.routes');
const dashboardRoutes = require('./dashboard.routes');
const userManagementRoutes = require('./userManagement.routes');
const productModerationRoutes = require('./productModeration.routes');
const categoryRoutes = require('./category.routes');
const orderManagementRoutes = require('./orderManagement.routes');
const walletManagementRoutes = require('./walletManagement.routes');
const reportRoutes = require('./report.routes');
const supportRoutes = require('./support.routes');
const notificationRoutes = require('./notification.routes');
const platformSettingsRoutes = require('./platformSettings.routes');
const { authenticateAdmin } = require('../../shared/middleware/auth.middleware');

const router = express.Router();

// Public — login / forgot-password / reset-password.
router.use('/auth', authRoutes);

// Everything below requires a valid admin session.
router.use(authenticateAdmin);

router.use('/dashboard', dashboardRoutes);
router.use('/users', userManagementRoutes);
router.use('/products', productModerationRoutes);
router.use('/categories', categoryRoutes);
router.use('/orders', orderManagementRoutes);
router.use('/wallet', walletManagementRoutes);
router.use('/reports', reportRoutes);
router.use('/support-tickets', supportRoutes);
router.use('/notifications', notificationRoutes);
router.use('/settings', platformSettingsRoutes);

module.exports = router;
