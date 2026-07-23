const app = require('./app');
const { env, assertRequiredEnv } = require('./api/shared/config/env');
const { connectDB } = require('./api/shared/database/connection');

async function start() {
  assertRequiredEnv();
  await connectDB();

  const server = app.listen(env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`[server] HunarmandAI API listening on port ${env.PORT} (${env.NODE_ENV})`);
  });

  const shutdown = (signal) => {
    // eslint-disable-next-line no-console
    console.log(`[server] Received ${signal}, shutting down gracefully...`);
    server.close(() => process.exit(0));
  };
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('[server] Failed to start:', err);
  process.exit(1);
});
