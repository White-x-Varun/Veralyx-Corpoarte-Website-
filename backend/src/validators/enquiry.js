<<<<<<< HEAD
import { z } from 'zod';

export const enquiryUpdateSchema = z.object({
  status: z.enum(['new', 'read', 'archived']).optional(),
  read: z.boolean().optional(),
});

export const applicationUpdateSchema = z.object({
  status: z.enum(['new', 'reviewing', 'shortlisted', 'rejected', 'hired']).optional(),
  adminNotes: z.string().max(5000).optional(),
});
=======
import { z } from 'zod';

export const enquiryUpdateSchema = z.object({
  status: z.enum(['new', 'read', 'archived']).optional(),
  read: z.boolean().optional(),
});

export const applicationUpdateSchema = z.object({
  status: z.enum(['new', 'reviewing', 'shortlisted', 'rejected', 'hired']).optional(),
  adminNotes: z.string().max(5000).optional(),
});
>>>>>>> 87302d045bec07cfb2e2996b09d26b2a88dcb31e
