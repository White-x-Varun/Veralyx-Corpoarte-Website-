import Job from '../models/Job.js';
import Application from '../models/Application.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { createSlug, ensureUniqueSlug } from '../utils/slug.js';
import { assertObjectId } from '../utils/objectId.js';
import { parsePagination, escapeRegex } from '../utils/pagination.js';
import { isAllowedResumeFile } from '../utils/pdf.js';
import { createResumeKey, putObject, deleteObject, getObject } from '../storage/index.js';
import {
  mapEmploymentType,
  mapJobStatus,
  publicJob,
  publicApplication,
} from '../services/mappers.js';

function jobPayload(body) {
  const status = mapJobStatus(body.status);
  return {
    title: body.title,
    description: body.description,
    summary: body.summary || '',
    responsibilities: body.responsibilities || [],
    requirements: body.requirements || [],
    skills: body.skills || [],
    employmentType: mapEmploymentType(body.employmentType || body.type),
    workMode: body.workMode || 'hybrid',
    location: body.location || '',
    department: body.department || '',
    status,
    applicationDeadline: body.applicationDeadline || undefined,
    eligibility: body.eligibility || '',
  };
}

export const listPublicJobs = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const filter = { status: 'published' };
  if (req.query.employmentType) filter.employmentType = mapEmploymentType(req.query.employmentType);
  if (req.query.workMode) filter.workMode = req.query.workMode;
  if (req.query.q) {
    const q = new RegExp(escapeRegex(req.query.q), 'i');
    filter.$or = [{ title: q }, { description: q }, { location: q }, { skills: q }];
  }
  const [items, total] = await Promise.all([
    Job.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Job.countDocuments(filter),
  ]);
  const jobs = items.map(publicJob);
  return res.status(200).json({
    success: true,
    data: { items: jobs, jobs, pagination: { page, limit, total } },
    jobs,
  });
});

export const getPublicJob = asyncHandler(async (req, res) => {
  const job = await Job.findOne({ slug: req.params.slug, status: 'published' });
  if (!job) throw ApiError.notFound('Job not found');
  const mapped = publicJob(job);
  return res.status(200).json({ success: true, data: mapped, job: mapped });
});

export const applyToJob = asyncHandler(async (req, res) => {
  const job = await Job.findOne({ slug: req.params.slug, status: 'published' });
  if (!job) throw ApiError.notFound('Job not found');
  if (job.applicationDeadline && new Date(job.applicationDeadline) < new Date()) {
    throw ApiError.badRequest('Applications for this role are closed');
  }
  if (!req.file) {
    throw ApiError.badRequest('Resume PDF is required');
  }
  if (!isAllowedResumeFile(req.file)) {
    throw ApiError.badRequest('Resume must be a valid PDF file');
  }

  const applicantName = req.body.applicantName || req.body.name;
  if (!applicantName || applicantName.trim().length < 2) {
    throw ApiError.badRequest('Name is required');
  }

  const key = createResumeKey();
  try {
    await putObject(key, req.file.buffer, 'application/pdf');
    const application = await Application.create({
      jobId: job._id,
      applicantName: applicantName.trim(),
      email: req.body.email,
      phone: req.body.phone || '',
      education: req.body.education || '',
      coverLetter: req.body.coverLetter || '',
      resumeKey: key,
      resumeOriginalName: req.file.originalname,
      resumeMimeType: 'application/pdf',
      resumeSize: req.file.size,
    });
    return ApiResponse.created(res, { id: application._id }, 'Application submitted');
  } catch (err) {
    await deleteObject(key).catch(() => {});
    throw err;
  }
});

export const listAdminJobs = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query, { defaultLimit: 50, maxLimit: 100 });
  const filter = {};
  if (req.query.status) filter.status = mapJobStatus(req.query.status);
  if (req.query.q) {
    const q = new RegExp(escapeRegex(req.query.q), 'i');
    filter.$or = [{ title: q }, { location: q }, { department: q }];
  }
  const [items, total] = await Promise.all([
    Job.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Job.countDocuments(filter),
  ]);
  const jobs = items.map(publicJob);
  return res.status(200).json({
    success: true,
    data: { items: jobs, jobs, pagination: { page, limit, total } },
    jobs,
  });
});

export const getAdminJob = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id);
  const job = await Job.findById(req.params.id);
  if (!job) throw ApiError.notFound('Job not found');
  const mapped = publicJob(job);
  return res.status(200).json({ success: true, data: mapped, job: mapped });
});

export const createJob = asyncHandler(async (req, res) => {
  const payload = jobPayload(req.body);
  const slug = await ensureUniqueSlug(Job, createSlug(req.body.slug || payload.title));
  const job = await Job.create({ ...payload, slug });
  return ApiResponse.created(res, publicJob(job), 'Job created');
});

export const updateJob = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id);
  const existing = await Job.findById(req.params.id);
  if (!existing) throw ApiError.notFound('Job not found');
  const payload = jobPayload(req.body);
  if (req.body.slug && req.body.slug !== existing.slug) {
    payload.slug = await ensureUniqueSlug(Job, createSlug(req.body.slug), existing._id);
  }
  Object.assign(existing, payload);
  await existing.save();
  return ApiResponse.success(res, publicJob(existing), 'Job updated');
});

export const deleteJob = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id);
  const job = await Job.findByIdAndDelete(req.params.id);
  if (!job) throw ApiError.notFound('Job not found');
  return ApiResponse.success(res, null, 'Job deleted');
});

export const listApplications = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query, { defaultLimit: 50, maxLimit: 100 });
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.jobId) {
    assertObjectId(req.query.jobId, 'jobId');
    filter.jobId = req.query.jobId;
  }
  const [items, total] = await Promise.all([
    Application.find(filter)
      .select('+adminNotes')
      .populate('jobId', 'title slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Application.countDocuments(filter),
  ]);
  const applications = items.map(publicApplication);
  return res.status(200).json({
    success: true,
    data: { items: applications, applications, pagination: { page, limit, total } },
    applications,
  });
});

export const getApplication = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id);
  const application = await Application.findById(req.params.id)
    .select('+adminNotes')
    .populate('jobId', 'title slug');
  if (!application) throw ApiError.notFound('Application not found');
  const mapped = publicApplication(application);
  return res.status(200).json({ success: true, data: mapped, application: mapped });
});

export const updateApplication = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id);
  const application = await Application.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
    .select('+adminNotes')
    .populate('jobId', 'title slug');
  if (!application) throw ApiError.notFound('Application not found');
  return ApiResponse.success(res, publicApplication(application), 'Application updated');
});

export const deleteApplication = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id);
  const application = await Application.findById(req.params.id);
  if (!application) throw ApiError.notFound('Application not found');
  await deleteObject(application.resumeKey).catch(() => {});
  await application.deleteOne();
  return ApiResponse.success(res, null, 'Application deleted');
});

export const downloadResume = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id);
  const application = await Application.findById(req.params.id);
  if (!application) throw ApiError.notFound('Application not found');
  const buffer = await getObject(application.resumeKey);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="${(application.resumeOriginalName || 'resume.pdf').replace(/"/g, '')}"`,
  );
  return res.send(buffer);
});
