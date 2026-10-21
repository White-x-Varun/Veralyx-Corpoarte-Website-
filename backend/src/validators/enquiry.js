import { z } from 'zod';

export const enquiryUpdateSchema = z.object({
  status: z.enum(['new', 'read', 'archived']).optional(),
  read: z.boolean().optional(),
});

export const applicationUpdateSchema = z.object({
  status: z.enum(['new', 'reviewing', 'shortlisted', 'rejected', 'hired']).optional(),
  adminNotes: z.string().max(5000).optional(),
});
