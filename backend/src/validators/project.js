import { z } from 'zod';

export const projectBodySchema = z.object({
  title: z.string().trim().min(3).max(200),
  slug: z.string().trim().min(2).max(220).optional(),
  description: z.string().trim().min(10).max(20000),
  summary: z.string().trim().max(500).optional().default(''),
  content: z.string().optional().default(''),
  category: z.string().trim().max(80).optional().default(''),
  client: z.string().trim().max(160).optional().default(''),
  technologies: z
    .union([z.array(z.string()), z.string()])
    .optional()
    .transform((val) => {
      if (!val) return [];
      if (Array.isArray(val)) return val.map((s) => s.trim()).filter(Boolean);
      return val
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }),
  imageUrls: z.array(z.string()).optional().default([]),
  liveUrl: z.string().trim().max(500).optional().default(''),
  demoUrl: z.string().trim().max(500).optional().default(''),
  featured: z.union([z.boolean(), z.string()]).optional().transform((v) => v === true || v === 'true'),
  status: z.enum(['draft', 'published']).optional().default('draft'),
});
