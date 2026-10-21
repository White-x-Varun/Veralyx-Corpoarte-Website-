<<<<<<< HEAD
import crypto from 'crypto';
import env from '../config/env.js';
import ApiError from '../utils/ApiError.js';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

function csrfCookieOptions() {
  return {
    httpOnly: true,
    sameSite: env.cookieSameSite,
    secure: env.cookieSecure,
    path: '/',
    maxAge: 8 * 60 * 60 * 1000,
  };
}

export function ensureCsrfToken(req, res) {
  let token = req.cookies?.[env.csrfCookieName];
  if (!token) {
    token = crypto.randomBytes(32).toString('hex');
    res.cookie(env.csrfCookieName, token, csrfCookieOptions());
  }
  return token;
}

export function csrfProtection(req, res, next) {
  if (!env.csrfEnabled || env.isTest) {
    return next();
  }
  if (SAFE_METHODS.has(req.method)) {
    return next();
  }
  const cookieToken = req.cookies?.[env.csrfCookieName];
  const headerToken = req.get('x-csrf-token');
  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return next(ApiError.forbidden('CSRF token missing or invalid'));
  }
  return next();
}

export default csrfProtection;
=======
import crypto from 'crypto';
import env from '../config/env.js';
import ApiError from '../utils/ApiError.js';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

function csrfCookieOptions() {
  return {
    httpOnly: true,
    sameSite: env.cookieSameSite,
    secure: env.cookieSecure,
    path: '/',
    maxAge: 8 * 60 * 60 * 1000,
  };
}

export function ensureCsrfToken(req, res) {
  let token = req.cookies?.[env.csrfCookieName];
  if (!token) {
    token = crypto.randomBytes(32).toString('hex');
    res.cookie(env.csrfCookieName, token, csrfCookieOptions());
  }
  return token;
}

export function csrfProtection(req, res, next) {
  if (!env.csrfEnabled || env.isTest) {
    return next();
  }
  if (SAFE_METHODS.has(req.method)) {
    return next();
  }
  const cookieToken = req.cookies?.[env.csrfCookieName];
  const headerToken = req.get('x-csrf-token');
  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return next(ApiError.forbidden('CSRF token missing or invalid'));
  }
  return next();
}

export default csrfProtection;
>>>>>>> 87302d045bec07cfb2e2996b09d26b2a88dcb31e
