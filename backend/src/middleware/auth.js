<<<<<<< HEAD
import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

export function signSession(user) {
  return jwt.sign(
    { sub: user._id.toString(), role: user.role },
    env.sessionSecret,
    { expiresIn: '8h' },
  );
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: env.cookieSameSite,
    secure: env.cookieSecure,
    path: '/',
    maxAge: 8 * 60 * 60 * 1000,
  };
}

export function setSessionCookie(res, user) {
  res.cookie(env.sessionCookieName, signSession(user), sessionCookieOptions());
}

export function clearSessionCookie(res) {
  res.clearCookie(env.sessionCookieName, {
    httpOnly: true,
    sameSite: env.cookieSameSite,
    secure: env.cookieSecure,
    path: '/',
  });
}

export const requireAuth = asyncHandler(async (req, _res, next) => {
  const token = req.cookies?.[env.sessionCookieName];
  if (!token) {
    throw ApiError.unauthorized();
  }
  let payload;
  try {
    payload = jwt.verify(token, env.sessionSecret);
  } catch {
    throw ApiError.unauthorized();
  }
  const user = await User.findById(payload.sub);
  if (!user) {
    throw ApiError.unauthorized();
  }
  req.user = user;
  next();
});

export function requireAdmin(req, _res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return next(ApiError.forbidden('Admin access required'));
  }
  return next();
}

export default { requireAuth, requireAdmin, setSessionCookie, clearSessionCookie };
=======
import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

export function signSession(user) {
  return jwt.sign(
    { sub: user._id.toString(), role: user.role },
    env.sessionSecret,
    { expiresIn: '8h' },
  );
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: env.cookieSameSite,
    secure: env.cookieSecure,
    path: '/',
    maxAge: 8 * 60 * 60 * 1000,
  };
}

export function setSessionCookie(res, user) {
  res.cookie(env.sessionCookieName, signSession(user), sessionCookieOptions());
}

export function clearSessionCookie(res) {
  res.clearCookie(env.sessionCookieName, {
    httpOnly: true,
    sameSite: env.cookieSameSite,
    secure: env.cookieSecure,
    path: '/',
  });
}

export const requireAuth = asyncHandler(async (req, _res, next) => {
  const token = req.cookies?.[env.sessionCookieName];
  if (!token) {
    throw ApiError.unauthorized();
  }
  let payload;
  try {
    payload = jwt.verify(token, env.sessionSecret);
  } catch {
    throw ApiError.unauthorized();
  }
  const user = await User.findById(payload.sub);
  if (!user) {
    throw ApiError.unauthorized();
  }
  req.user = user;
  next();
});

export function requireAdmin(req, _res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return next(ApiError.forbidden('Admin access required'));
  }
  return next();
}

export default { requireAuth, requireAdmin, setSessionCookie, clearSessionCookie };
>>>>>>> 87302d045bec07cfb2e2996b09d26b2a88dcb31e
