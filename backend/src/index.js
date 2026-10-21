import env from './config/env.js';
import { connectDB } from './config/db.js';
import { createApp } from './app.js';
import { logError, logInfo } from './utils/logger.js';

const app = createApp();

async function start() {
  await connectDB();
  app.listen(env.port, () => {
    logInfo(`VERALYX API listening on port ${env.port}`);
  });
}

start().catch((err) => {
  logError('Failed to start server', { message: err.message });
  process.exit(1);
});
