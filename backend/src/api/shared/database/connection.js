const mongoose = require('mongoose');
const { env } = require('../config/env');
const { mongooseOptions } = require('../config/db.config');

let isConnected = false;

async function connectDB() {
  if (isConnected) return mongoose.connection;

  mongoose.connection.on('connected', () => {
    isConnected = true;
    // eslint-disable-next-line no-console
    console.log(`[db] MongoDB connected -> ${mongoose.connection.name}`);
  });

  mongoose.connection.on('error', (err) => {
    // eslint-disable-next-line no-console
    console.error('[db] MongoDB connection error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    isConnected = false;
    // eslint-disable-next-line no-console
    console.warn('[db] MongoDB disconnected');
  });

  await mongoose.connect(env.MONGODB_URI, mongooseOptions);
  return mongoose.connection;
}

async function disconnectDB() {
  if (!isConnected) return;
  await mongoose.disconnect();
  isConnected = false;
}

module.exports = { connectDB, disconnectDB };
