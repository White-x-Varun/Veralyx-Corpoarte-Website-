import Testimonial from '../models/Testimonial.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { assertObjectId } from '../utils/objectId.js';
import { parsePagination } from '../utils/pagination.js';
import { publicTestimonial } from '../services/mappers.js';

function payload(body) {
  return {
    clientName: body.clientName || body.author,
    designation: body.designation || body.role || '',
    company: body.company || '',
    feedback: body.feedback || body.quote,
    imageUrl: body.imageUrl || '',
    approved: body.approved !== undefined ? body.approved : true,
  };
}

export const listPublicTestimonials = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query, { defaultLimit: 6 });
  const filter = { approved: true };
  const [items, total] = await Promise.all([
    Testimonial.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Testimonial.countDocuments(filter),
  ]);
  const testimonials = items.map(publicTestimonial);
  return res.status(200).json({
    success: true,
    data: { items: testimonials, testimonials, pagination: { page, limit, total } },
    testimonials,
  });
});

export const listAdminTestimonials = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query, { defaultLimit: 50, maxLimit: 100 });
  const [items, total] = await Promise.all([
    Testimonial.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    Testimonial.countDocuments(),
  ]);
  const testimonials = items.map(publicTestimonial);
  return res.status(200).json({
    success: true,
    data: { items: testimonials, testimonials, pagination: { page, limit, total } },
    testimonials,
  });
});

export const createTestimonial = asyncHandler(async (req, res) => {
  const data = payload(req.body);
  if (!data.clientName || !data.feedback) {
    throw ApiError.badRequest('Author and quote are required');
  }
  const item = await Testimonial.create(data);
  return ApiResponse.created(res, publicTestimonial(item), 'Testimonial created');
});

export const updateTestimonial = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id);
  const existing = await Testimonial.findById(req.params.id);
  if (!existing) throw ApiError.notFound('Testimonial not found');
  Object.assign(existing, payload(req.body));
  await existing.save();
  return ApiResponse.success(res, publicTestimonial(existing), 'Testimonial updated');
});

export const deleteTestimonial = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id);
  const item = await Testimonial.findByIdAndDelete(req.params.id);
  if (!item) throw ApiError.notFound('Testimonial not found');
  return ApiResponse.success(res, null, 'Testimonial deleted');
});
