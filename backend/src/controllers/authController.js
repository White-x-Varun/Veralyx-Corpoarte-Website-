import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { setSessionCookie, clearSessionCookie } from '../middleware/auth.js';
import { ensureCsrfToken } from '../middleware/csrf.js';

export const csrf = asyncHandler(async (req, res) => {
  const csrfToken = ensureCsrfToken(req, res);
  return res.status(200).json({ success: true, csrfToken, data: { csrfToken } });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
  if (!user) {
    throw ApiError.unauthorized('Invalid email or password');
  }
  const ok = await user.comparePassword(password);
  if (!ok) {
    throw ApiError.unauthorized('Invalid email or password');
  }
  setSessionCookie(res, user);
  ensureCsrfToken(req, res);
  const safe = user.toJSON();
  return res.status(200).json({
    success: true,
    message: 'Logged in',
    data: { user: safe },
    user: safe,
  });
});

export const logout = asyncHandler(async (_req, res) => {
  clearSessionCookie(res);
  return ApiResponse.success(res, null, 'Logged out');
});

export const me = asyncHandler(async (req, res) => {
  const user = req.user.toJSON();
  return res.status(200).json({
    success: true,
    data: { user },
    user,
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, email, currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+passwordHash');

  if (newPassword) {
    if (!currentPassword) {
      throw ApiError.badRequest('Current password is required');
    }
    const ok = await user.comparePassword(currentPassword);
    if (!ok) {
      throw ApiError.unauthorized('Current password is incorrect');
    }
    user.passwordHash = await User.hashPassword(newPassword);
  }

  if (name) user.name = name;
  if (email && email !== user.email) {
    const exists = await User.findOne({ email: email.toLowerCase(), _id: { $ne: user._id } });
    if (exists) throw ApiError.conflict('Email already in use');
    user.email = email.toLowerCase();
  }

  await user.save();
  const safe = user.toJSON();
  return res.status(200).json({ success: true, message: 'Profile updated', data: { user: safe }, user: safe });
});
