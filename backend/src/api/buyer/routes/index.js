const express = require('express');
const authRoutes = require('./auth.routes');
const profileRoutes = require('./profile.routes');
const cartRoutes = require('./cart.routes');
const checkoutRoutes = require('./checkout.routes');
const orderRoutes = require('./order.routes');
const supportRoutes = require('./support.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/cart', cartRoutes);
router.use('/checkout', checkoutRoutes);
router.use('/orders', orderRoutes);
router.use('/support-tickets', supportRoutes);

module.exports = router;
