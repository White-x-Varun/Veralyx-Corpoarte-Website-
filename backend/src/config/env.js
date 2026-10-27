import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const isCloudflareWorker = process.env.VERALYX_RUNTIME === 'cloudflare-worker';

if (!isCloudflareWorker) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  dotenv.config({ path: path.resolve(__dirname, '../../.env') });
}

function requireEnv(name, fallback) {
  const value = process.env[name] ?? fallback;
  if (value === undefined || value === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function boolEnv(name, fallback = false) {
  const raw = process.env[name];
  if (raw === undefined) return fallback;
  return raw === 'true' || raw === '1';
}

function intEnv(name, fallback) {
  const raw = process.env[name];
  if (raw === undefined || raw === '') return fallback;
  const parsed = Number.parseInt(raw, 10);
  if (Number.isNaN(parsed)) {
    throw new Error(`Invalid integer for ${name}: ${raw}`);
  }
  return parsed;
}

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  isCloudflareWorker,
  port: intEnv('PORT', 5000),
  mongodbUri: requireEnv(
    'MONGODB_URI',
    process.env.NODE_ENV === 'production' ? undefined : 'mongodb://127.0.0.1:27017/veralyx',
  ),
  clientOrigin: requireEnv(
    'CLIENT_ORIGIN',
    process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:5173',
  ),
  sessionSecret: requireEnv(
    'SESSION_SECRET',
    process.env.NODE_ENV === 'production' ? undefined : 'dev-secret-change-in-production-min-32-chars',
  ),
  cookieSecure: boolEnv('COOKIE_SECURE', false),
  cookieSameSite: process.env.COOKIE_SAME_SITE || 'lax',
  csrfEnabled: boolEnv('CSRF_ENABLED', true),
  csrfCookieName: process.env.CSRF_COOKIE_NAME || 'veralyx_csrf',
  sessionCookieName: 'veralyx_session',
  rateLimitWindowMs: intEnv('RATE_LIMIT_WINDOW_MS', 900000),
  rateLimitMax: intEnv('RATE_LIMIT_MAX', 100),
  loginRateLimitMax: intEnv('LOGIN_RATE_LIMIT_MAX', 10),
  contactRateLimitMax: intEnv('CONTACT_RATE_LIMIT_MAX', 5),
  applyRateLimitMax: intEnv('APPLY_RATE_LIMIT_MAX', 10),
  uploadMaxBytes: intEnv('UPLOAD_MAX_BYTES', 5242880),
  storageProvider: process.env.STORAGE_PROVIDER || 'local',
  localUploadDir: process.env.LOCAL_UPLOAD_DIR || './uploads',
  r2: {
    accountId: process.env.R2_ACCOUNT_ID || '',
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    bucket: process.env.R2_BUCKET || '',
    endpoint: process.env.R2_ENDPOINT || '',
    publicUrl: process.env.R2_PUBLIC_URL || '',
  },
  adminSeed: {
    email: process.env.ADMIN_SEED_EMAIL || '',
    password: process.env.ADMIN_SEED_PASSWORD || '',
    name: process.env.ADMIN_SEED_NAME || 'Site Administrator',
  },
  isProduction: (process.env.NODE_ENV || 'development') === 'production',
  isTest: (process.env.NODE_ENV || 'development') === 'test',
};

if (env.sessionSecret.length < 32 && env.isProduction) {
  throw new Error('SESSION_SECRET must be at least 32 characters in production');
}

export default env;
