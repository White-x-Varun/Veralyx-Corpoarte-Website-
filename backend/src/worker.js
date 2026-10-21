import process from 'node:process';
import { env as workerEnv } from 'cloudflare:workers';
import { httpServerHandler } from 'cloudflare:node';

const runtimeVariableNames = [
  'MONGODB_URI',
  'SESSION_SECRET',
  'CLIENT_ORIGIN',
  'NODE_ENV',
  'COOKIE_SECURE',
  'COOKIE_SAME_SITE',
  'CSRF_ENABLED',
  'STORAGE_PROVIDER',
  'UPLOAD_MAX_BYTES',
  'RATE_LIMIT_WINDOW_MS',
  'RATE_LIMIT_MAX',
  'LOGIN_RATE_LIMIT_MAX',
  'CONTACT_RATE_LIMIT_MAX',
  'APPLY_RATE_LIMIT_MAX',
];

for (const name of runtimeVariableNames) {
  const value = workerEnv[name];
  if (value !== undefined && value !== null) process.env[name] = String(value);
}

process.env.VERALYX_RUNTIME = 'cloudflare-worker';
globalThis.__VERALYX_RESUME_BUCKET = workerEnv.RESUME_BUCKET;

const [{ createApp }, { connectDB }] = await Promise.all([
  import('./app.js'),
  import('./config/db.js'),
]);

const connectDatabase = async (_req, _res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
};

const app = createApp({ apiMiddleware: [connectDatabase] });
app.listen(3000);

export default httpServerHandler({ port: 3000 });
