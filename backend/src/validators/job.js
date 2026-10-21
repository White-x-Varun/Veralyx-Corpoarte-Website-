<<<<<<< HEAD
import { z } from 'zod';

const employmentType = z.enum(['full-time', 'part-time', 'contract', 'internship']);
const workMode = z.enum(['onsite', 'remote', 'hybrid']);
const jobStatus = z.enum(['draft', 'published', 'closed', 'open']);

const stringList = z
  .union([z.array(z.string()), z.string()])
  .optional()
  .transform((val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val.map((s) => s.trim()).filter(Boolean);
    return val
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
  });

export const jobBodySchema = z.object({
  title: z.string().trim().min(3).max(200),
  slug: z.string().trim().min(2).max(220).optional(),
  description: z.string().trim().min(10).max(20000),
  summary: z.string().trim().max(500).optional().default(''),
  responsibilities: stringList,
  requirements: stringList,
  skills: stringList,
  employmentType: employmentType.optional(),
  type: z.string().optional(),
  workMode: workMode.optional().default('hybrid'),
  location: z.string().trim().max(160).optional().default(''),
  department: z.string().trim().max(120).optional().default(''),
  status: jobStatus.optional().default('draft'),
  applicationDeadline: z.union([z.string(), z.date()]).optional().nullable(),
  eligibility: z.string().trim().max(2000).optional().default(''),
});

export const applySchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  applicantName: z.string().trim().min(2).max(120).optional(),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(40).optional().default(''),
  education: z.string().trim().max(2000).optional().default(''),
  coverLetter: z.string().trim().max(8000).optional().default(''),
});
=======
import { z } from 'zod';

const employmentType = z.enum(['full-time', 'part-time', 'contract', 'internship']);
const workMode = z.enum(['onsite', 'remote', 'hybrid']);
const jobStatus = z.enum(['draft', 'published', 'closed', 'open']);

const stringList = z
  .union([z.array(z.string()), z.string()])
  .optional()
  .transform((val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val.map((s) => s.trim()).filter(Boolean);
    return val
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
  });

export const jobBodySchema = z.object({
  title: z.string().trim().min(3).max(200),
  slug: z.string().trim().min(2).max(220).optional(),
  description: z.string().trim().min(10).max(20000),
  summary: z.string().trim().max(500).optional().default(''),
  responsibilities: stringList,
  requirements: stringList,
  skills: stringList,
  employmentType: employmentType.optional(),
  type: z.string().optional(),
  workMode: workMode.optional().default('hybrid'),
  location: z.string().trim().max(160).optional().default(''),
  department: z.string().trim().max(120).optional().default(''),
  status: jobStatus.optional().default('draft'),
  applicationDeadline: z.union([z.string(), z.date()]).optional().nullable(),
  eligibility: z.string().trim().max(2000).optional().default(''),
});

export const applySchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  applicantName: z.string().trim().min(2).max(120).optional(),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(40).optional().default(''),
  education: z.string().trim().max(2000).optional().default(''),
  coverLetter: z.string().trim().max(8000).optional().default(''),
});
>>>>>>> 87302d045bec07cfb2e2996b09d26b2a88dcb31e
