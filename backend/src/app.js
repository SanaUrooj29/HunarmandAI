const express = require('express');
const fs = require('fs');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const { env } = require('./api/shared/config/env');
const { generalApiLimiter } = require('./api/shared/middleware/rateLimiter.middleware');
const { notFoundHandler, errorHandler } = require('./api/shared/middleware/errorHandler.middleware');
const { sendSuccess } = require('./api/shared/utils/response.util');

const sellerRoutes = require('./api/seller/routes');
const buyerRoutes = require('./api/buyer/routes');
const adminRoutes = require('./api/admin/routes');
const categoryRoutes = require('./api/shared/routes/category.routes');
const marketplaceRoutes = require('./api/buyer/routes/browse.routes');
const reviewRoutes = require('./api/buyer/routes/review.routes');

const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGINS,
    credentials: true,
  })
);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  if (req.body === undefined) req.body = {};
  next();
});
app.use(generalApiLimiter);

const uploadsDirectory = path.join(__dirname, '..', 'uploads');
fs.mkdirSync(uploadsDirectory, { recursive: true });
app.use('/uploads', express.static(uploadsDirectory));

app.get('/health', (req, res) => sendSuccess(res, { message: 'HunarmandAI API is healthy', data: { env: env.NODE_ENV } }));

app.use('/api/buyer', (req, res, next) => {
  console.log('[BACKEND BUYER ROUTE] incoming', { method: req.method, url: req.originalUrl, body: req.body })
  next()
})
app.use('/api/seller', sellerRoutes);
app.use('/api/buyer', buyerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/reviews', reviewRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
