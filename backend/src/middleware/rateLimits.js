import rateLimit from 'express-rate-limit';
import env from '../config/env.js';

let cloudflareRateLimiters = {};

export function setCloudflareRateLimitBindings(bindings = {}) {
  cloudflareRateLimiters = bindings;
}

function skipInTest() {
  return env.isTest;
}

function limiter({ binding, max, message, skip = skipInTest }) {
  if (env.isCloudflareWorker) {
    return async (req, res, next) => {
      if (skip()) return next();

      try {
        const cloudflareLimiter = cloudflareRateLimiters[binding];
        if (!cloudflareLimiter) {
          throw new Error(`Missing Cloudflare rate limit binding: ${binding}`);
        }

        const { success } = await cloudflareLimiter.limit({
          key: String(req.ip || req.socket?.remoteAddress || 'unknown'),
        });
        if (!success) return res.status(429).json(message);
        return next();
      } catch (error) {
        return next(error);
      }
    };
  }

  return rateLimit({
    windowMs: env.rateLimitWindowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    skip,
    message,
  });
}

export const globalLimiter = limiter({
  binding: 'GLOBAL_RATE_LIMITER',
  max: env.rateLimitMax,
  // Avoid blocking normal local development traffic; production keeps this cap.
  skip: () => skipInTest() || env.nodeEnv === 'development',
  message: { success: false, message: 'Too many requests' },
});

export const loginLimiter = limiter({
  binding: 'LOGIN_RATE_LIMITER',
  max: env.loginRateLimitMax,
  message: { success: false, message: 'Too many login attempts. Try again later.' },
});

export const contactLimiter = limiter({
  binding: 'CONTACT_RATE_LIMITER',
  max: env.contactRateLimitMax,
  message: { success: false, message: 'Too many submissions. Try again later.' },
});

export const applyLimiter = limiter({
  binding: 'APPLY_RATE_LIMITER',
  max: env.applyRateLimitMax,
  message: { success: false, message: 'Too many applications. Try again later.' },
});
