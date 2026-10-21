import { z } from 'zod';

export const testimonialBodySchema = z.object({
  clientName: z.string().trim().min(2).max(120).optional(),
  author: z.string().trim().min(2).max(120).optional(),
  designation: z.string().trim().max(160).optional(),
  role: z.string().trim().max(160).optional(),
  company: z.string().trim().max(160).optional().default(''),
  feedback: z.string().trim().min(10).max(2000).optional(),
  quote: z.string().trim().min(10).max(2000).optional(),
  imageUrl: z.string().trim().max(500).optional().default(''),
  approved: z.union([z.boolean(), z.string()]).optional().transform((v) => v === true || v === 'true'),
});
