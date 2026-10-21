<<<<<<< HEAD
import { z } from 'zod';

export const blogBodySchema = z.object({
  title: z.string().trim().min(3).max(200),
  slug: z.string().trim().min(2).max(220).optional(),
  excerpt: z.string().trim().max(500).optional().default(''),
  content: z.string().trim().min(10).max(100000),
  coverImage: z.string().trim().max(500).optional().default(''),
  category: z.string().trim().max(80).optional().default('General'),
  tags: z
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
  status: z.enum(['draft', 'published', 'archived']).optional().default('draft'),
  seoTitle: z.string().trim().max(200).optional().default(''),
  seoDescription: z.string().trim().max(320).optional().default(''),
});
=======
import { z } from 'zod';

export const blogBodySchema = z.object({
  title: z.string().trim().min(3).max(200),
  slug: z.string().trim().min(2).max(220).optional(),
  excerpt: z.string().trim().max(500).optional().default(''),
  content: z.string().trim().min(10).max(100000),
  coverImage: z.string().trim().max(500).optional().default(''),
  category: z.string().trim().max(80).optional().default('General'),
  tags: z
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
  status: z.enum(['draft', 'published', 'archived']).optional().default('draft'),
  seoTitle: z.string().trim().max(200).optional().default(''),
  seoDescription: z.string().trim().max(320).optional().default(''),
});
>>>>>>> 87302d045bec07cfb2e2996b09d26b2a88dcb31e
