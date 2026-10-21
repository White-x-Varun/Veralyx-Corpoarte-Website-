import Project from '../models/Project.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { createSlug, ensureUniqueSlug } from '../utils/slug.js';
import { assertObjectId } from '../utils/objectId.js';
import { parsePagination, escapeRegex } from '../utils/pagination.js';
import { publicProject } from '../services/mappers.js';

export const listPublicProjects = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const filter = { status: 'published' };
  if (req.query.featured === 'true') filter.featured = true;
  if (req.query.q) {
    const q = new RegExp(escapeRegex(req.query.q), 'i');
    filter.$or = [{ title: q }, { description: q }, { technologies: q }, { category: q }];
  }
  const [items, total] = await Promise.all([
    Project.find(filter).sort({ featured: -1, createdAt: -1 }).skip(skip).limit(limit),
    Project.countDocuments(filter),
  ]);
  const projects = items.map(publicProject);
  return res.status(200).json({
    success: true,
    data: { items: projects, projects, pagination: { page, limit, total } },
    projects,
  });
});

export const getPublicProject = asyncHandler(async (req, res) => {
  const project = await Project.findOne({ slug: req.params.slug, status: 'published' });
  if (!project) throw ApiError.notFound('Project not found');
  const mapped = publicProject(project);
  return res.status(200).json({ success: true, data: mapped, project: mapped });
});

export const listAdminProjects = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query, { defaultLimit: 50, maxLimit: 100 });
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  const [items, total] = await Promise.all([
    Project.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Project.countDocuments(filter),
  ]);
  const projects = items.map(publicProject);
  return res.status(200).json({
    success: true,
    data: { items: projects, projects, pagination: { page, limit, total } },
    projects,
  });
});

export const getAdminProject = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id);
  const project = await Project.findById(req.params.id);
  if (!project) throw ApiError.notFound('Project not found');
  const mapped = publicProject(project);
  return res.status(200).json({ success: true, data: mapped, project: mapped });
});

export const createProject = asyncHandler(async (req, res) => {
  const slug = await ensureUniqueSlug(Project, createSlug(req.body.slug || req.body.title));
  const status = req.body.status || (req.body.featured ? 'published' : 'published');
  const project = await Project.create({ ...req.body, slug, status });
  return ApiResponse.created(res, publicProject(project), 'Project created');
});

export const updateProject = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id);
  const existing = await Project.findById(req.params.id);
  if (!existing) throw ApiError.notFound('Project not found');
  const updates = { ...req.body };
  if (req.body.slug && req.body.slug !== existing.slug) {
    updates.slug = await ensureUniqueSlug(Project, createSlug(req.body.slug), existing._id);
  }
  Object.assign(existing, updates);
  await existing.save();
  return ApiResponse.success(res, publicProject(existing), 'Project updated');
});

export const deleteProject = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id);
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) throw ApiError.notFound('Project not found');
  return ApiResponse.success(res, null, 'Project deleted');
});
