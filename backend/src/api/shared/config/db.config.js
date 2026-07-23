const mongoose = require('mongoose');
const { env } = require('./env');

/**
 * Mongoose connection options. Pool size is tuned here so it's a single
 * knob to turn as load grows (NFR-SC-01), rather than scattered magic
 * numbers.
 */
const mongooseOptions = {
  maxPoolSize: parseInt(process.env.MONGODB_MAX_POOL_SIZE, 10) || 50,
  minPoolSize: parseInt(process.env.MONGODB_MIN_POOL_SIZE, 10) || 5,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  autoIndex: env.NODE_ENV !== 'production', // build indexes in the background via migration in prod
};

module.exports = { mongooseOptions };
