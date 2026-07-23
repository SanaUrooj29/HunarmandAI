const express = require('express');
const authRoutes = require('./auth.routes');
const profileRoutes = require('./profile.routes');
const walletRoutes = require('./wallet.routes');
const productRoutes = require('./product.routes');
const orderRoutes = require('./order.routes');
const learningRoutes = require('./learning.routes');
const supportRoutes = require('./support.routes');
const dashboardRoutes = require('./dashboard.routes');
const uploadRoutes = require('./upload.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/wallet', walletRoutes);
router.use('/products', productRoutes);
router.use('/uploads', uploadRoutes);
router.use('/orders', orderRoutes);
router.use('/learning', learningRoutes);
router.use('/support-tickets', supportRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
