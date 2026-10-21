<<<<<<< HEAD
import { z } from 'zod';

export const settingsSchema = z.object({
  companyName: z.string().trim().max(120).optional(),
  logoUrl: z.string().trim().max(500).optional(),
  tagline: z.string().trim().max(240).optional(),
  description: z.string().trim().max(2000).optional(),
  heroTitle: z.string().trim().max(240).optional(),
  heroSubtitle: z.string().trim().max(500).optional(),
  mission: z.string().trim().max(2000).optional(),
  vision: z.string().trim().max(2000).optional(),
  team: z
    .array(
      z.object({
        name: z.string().trim().min(1),
        role: z.string().trim().optional().default(''),
        bio: z.string().optional().default(''),
      }),
    )
    .optional(),
  milestones: z
    .array(
      z.object({
        year: z.string().trim(),
        title: z.string().trim(),
        description: z.string().optional().default(''),
      }),
    )
    .optional(),
  email: z.string().trim().email().optional(),
  phone: z.string().trim().max(40).optional(),
  address: z.string().trim().max(300).optional(),
  whatsappNumber: z.string().trim().max(20).optional(),
  whatsappPrefill: z.string().trim().max(300).optional(),
  socialLinks: z
    .object({
      linkedin: z.string().optional(),
      youtube: z.string().optional(),
      twitter: z.string().optional(),
      github: z.string().optional(),
      facebook: z.string().optional(),
      instagram: z.string().optional(),
    })
    .optional(),
  services: z
    .array(
      z.object({
        title: z.string().trim().min(1),
        description: z.string().optional().default(''),
        icon: z.string().optional().default(''),
      }),
    )
    .optional(),
  seoDefaults: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
    })
    .optional(),
});
=======
import { z } from 'zod';

export const settingsSchema = z.object({
  companyName: z.string().trim().max(120).optional(),
  logoUrl: z.string().trim().max(500).optional(),
  tagline: z.string().trim().max(240).optional(),
  description: z.string().trim().max(2000).optional(),
  heroTitle: z.string().trim().max(240).optional(),
  heroSubtitle: z.string().trim().max(500).optional(),
  mission: z.string().trim().max(2000).optional(),
  vision: z.string().trim().max(2000).optional(),
  team: z
    .array(
      z.object({
        name: z.string().trim().min(1),
        role: z.string().trim().optional().default(''),
        bio: z.string().optional().default(''),
      }),
    )
    .optional(),
  milestones: z
    .array(
      z.object({
        year: z.string().trim(),
        title: z.string().trim(),
        description: z.string().optional().default(''),
      }),
    )
    .optional(),
  email: z.string().trim().email().optional(),
  phone: z.string().trim().max(40).optional(),
  address: z.string().trim().max(300).optional(),
  whatsappNumber: z.string().trim().max(20).optional(),
  whatsappPrefill: z.string().trim().max(300).optional(),
  socialLinks: z
    .object({
      linkedin: z.string().optional(),
      youtube: z.string().optional(),
      twitter: z.string().optional(),
      github: z.string().optional(),
      facebook: z.string().optional(),
      instagram: z.string().optional(),
    })
    .optional(),
  services: z
    .array(
      z.object({
        title: z.string().trim().min(1),
        description: z.string().optional().default(''),
        icon: z.string().optional().default(''),
      }),
    )
    .optional(),
  seoDefaults: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
    })
    .optional(),
});
>>>>>>> 87302d045bec07cfb2e2996b09d26b2a88dcb31e
