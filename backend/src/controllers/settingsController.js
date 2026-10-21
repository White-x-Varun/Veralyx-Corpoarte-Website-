<<<<<<< HEAD
import SiteSettings from '../models/SiteSettings.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sanitizeSettings } from '../services/mappers.js';

export const getPublicSettings = asyncHandler(async (_req, res) => {
  const settings = sanitizeSettings(await SiteSettings.getSingleton());
  return res.status(200).json({
    success: true,
    data: settings,
    ...settings,
  });
});

export const getAdminSettings = asyncHandler(async (_req, res) => {
  const settings = sanitizeSettings(await SiteSettings.getSingleton());
  return res.status(200).json({ success: true, data: settings, settings });
});

export const updateSettings = asyncHandler(async (req, res) => {
  const settings = sanitizeSettings(await SiteSettings.updateSingleton(req.body));
  return ApiResponse.success(res, settings, 'Settings updated');
});
=======
import SiteSettings from '../models/SiteSettings.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sanitizeSettings } from '../services/mappers.js';

export const getPublicSettings = asyncHandler(async (_req, res) => {
  const settings = sanitizeSettings(await SiteSettings.getSingleton());
  return res.status(200).json({
    success: true,
    data: settings,
    ...settings,
  });
});

export const getAdminSettings = asyncHandler(async (_req, res) => {
  const settings = sanitizeSettings(await SiteSettings.getSingleton());
  return res.status(200).json({ success: true, data: settings, settings });
});

export const updateSettings = asyncHandler(async (req, res) => {
  const settings = sanitizeSettings(await SiteSettings.updateSingleton(req.body));
  return ApiResponse.success(res, settings, 'Settings updated');
});
>>>>>>> 87302d045bec07cfb2e2996b09d26b2a88dcb31e
