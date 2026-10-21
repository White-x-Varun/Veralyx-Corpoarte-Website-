import rateLimit from 'express-rate-limit';
import env from '../config/env.js';

function skipInTest() {
  return env.isTest;
}

export const globalLimiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  max: env.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  // Avoid blocking normal local development traffic; production keeps this cap.
  skip: () => skipInTest() || env.nodeEnv === 'development',
  message: { success: false, message: 'Too many requests' },
});

export const loginLimiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  max: env.loginRateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipInTest,
  message: { success: false, message: 'Too many login attempts. Try again later.' },
});

export const contactLimiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  max: env.contactRateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipInTest,
  message: { success: false, message: 'Too many submissions. Try again later.' },
});

export const applyLimiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  max: env.applyRateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipInTest,
  message: { success: false, message: 'Too many applications. Try again later.' },
});
