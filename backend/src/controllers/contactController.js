<<<<<<< HEAD
import ContactEnquiry from '../models/ContactEnquiry.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { assertObjectId } from '../utils/objectId.js';
import { parsePagination, escapeRegex } from '../utils/pagination.js';
import { publicEnquiry } from '../services/mappers.js';

export const submitContact = asyncHandler(async (req, res) => {
  const { website: honeypot, ...payload } = req.body;
  if (honeypot) {
    return ApiResponse.created(res, { id: 'ok' }, 'Enquiry submitted');
  }
  const enquiry = await ContactEnquiry.create({
    name: payload.name,
    email: payload.email,
    company: payload.company || '',
    phone: payload.phone || '',
    subject: payload.subject || payload.enquiryType || 'general',
    enquiryType: payload.enquiryType || 'general',
    message: payload.message,
    consent: Boolean(payload.consent),
  });
  return ApiResponse.created(res, { id: enquiry._id }, 'Enquiry submitted');
});

export const listEnquiries = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query, { defaultLimit: 50, maxLimit: 100 });
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.q) {
    const q = new RegExp(escapeRegex(req.query.q), 'i');
    filter.$or = [{ name: q }, { email: q }, { subject: q }, { message: q }, { company: q }];
  }
  const [items, total] = await Promise.all([
    ContactEnquiry.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    ContactEnquiry.countDocuments(filter),
  ]);
  const mapped = items.map(publicEnquiry);
  return res.status(200).json({
    success: true,
    data: { items: mapped, enquiries: mapped, pagination: { page, limit, total } },
    enquiries: mapped,
  });
});

export const getEnquiry = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id);
  const enquiry = await ContactEnquiry.findById(req.params.id);
  if (!enquiry) throw ApiError.notFound('Enquiry not found');
  const mapped = publicEnquiry(enquiry);
  return res.status(200).json({ success: true, data: mapped, enquiry: mapped });
});

export const updateEnquiry = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id);
  const updates = { ...req.body };
  if (updates.read === true) updates.status = 'read';
  if (updates.read === false) updates.status = 'new';
  delete updates.read;
  const enquiry = await ContactEnquiry.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });
  if (!enquiry) throw ApiError.notFound('Enquiry not found');
  return ApiResponse.success(res, publicEnquiry(enquiry), 'Enquiry updated');
});

export const deleteEnquiry = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id);
  const enquiry = await ContactEnquiry.findByIdAndDelete(req.params.id);
  if (!enquiry) throw ApiError.notFound('Enquiry not found');
  return ApiResponse.success(res, null, 'Enquiry deleted');
});
=======
import ContactEnquiry from '../models/ContactEnquiry.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { assertObjectId } from '../utils/objectId.js';
import { parsePagination, escapeRegex } from '../utils/pagination.js';
import { publicEnquiry } from '../services/mappers.js';

export const submitContact = asyncHandler(async (req, res) => {
  const { website: honeypot, ...payload } = req.body;
  if (honeypot) {
    return ApiResponse.created(res, { id: 'ok' }, 'Enquiry submitted');
  }
  const enquiry = await ContactEnquiry.create({
    name: payload.name,
    email: payload.email,
    company: payload.company || '',
    phone: payload.phone || '',
    subject: payload.subject || payload.enquiryType || 'general',
    enquiryType: payload.enquiryType || 'general',
    message: payload.message,
    consent: Boolean(payload.consent),
  });
  return ApiResponse.created(res, { id: enquiry._id }, 'Enquiry submitted');
});

export const listEnquiries = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query, { defaultLimit: 50, maxLimit: 100 });
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.q) {
    const q = new RegExp(escapeRegex(req.query.q), 'i');
    filter.$or = [{ name: q }, { email: q }, { subject: q }, { message: q }, { company: q }];
  }
  const [items, total] = await Promise.all([
    ContactEnquiry.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    ContactEnquiry.countDocuments(filter),
  ]);
  const mapped = items.map(publicEnquiry);
  return res.status(200).json({
    success: true,
    data: { items: mapped, enquiries: mapped, pagination: { page, limit, total } },
    enquiries: mapped,
  });
});

export const getEnquiry = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id);
  const enquiry = await ContactEnquiry.findById(req.params.id);
  if (!enquiry) throw ApiError.notFound('Enquiry not found');
  const mapped = publicEnquiry(enquiry);
  return res.status(200).json({ success: true, data: mapped, enquiry: mapped });
});

export const updateEnquiry = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id);
  const updates = { ...req.body };
  if (updates.read === true) updates.status = 'read';
  if (updates.read === false) updates.status = 'new';
  delete updates.read;
  const enquiry = await ContactEnquiry.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });
  if (!enquiry) throw ApiError.notFound('Enquiry not found');
  return ApiResponse.success(res, publicEnquiry(enquiry), 'Enquiry updated');
});

export const deleteEnquiry = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id);
  const enquiry = await ContactEnquiry.findByIdAndDelete(req.params.id);
  if (!enquiry) throw ApiError.notFound('Enquiry not found');
  return ApiResponse.success(res, null, 'Enquiry deleted');
});
>>>>>>> 87302d045bec07cfb2e2996b09d26b2a88dcb31e
