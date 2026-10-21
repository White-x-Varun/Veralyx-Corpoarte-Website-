import { z } from 'zod';

export const contactSchema = z
  .object({
    name: z.string().trim().min(2).max(120),
    email: z.string().trim().email().max(254),
    company: z.string().trim().max(160).optional().default(''),
    phone: z.string().trim().max(40).optional().default(''),
    subject: z.string().trim().max(200).optional().default(''),
    enquiryType: z.string().trim().max(80).optional(),
    inquiryType: z.string().trim().max(80).optional(),
    message: z.string().trim().min(10).max(5000),
    consent: z.boolean().optional(),
    website: z.string().max(200).optional().default(''),
  })
  .transform((data) => ({
    ...data,
    enquiryType: data.enquiryType || data.inquiryType || data.subject || 'general',
  }));
