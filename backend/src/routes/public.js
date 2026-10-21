<<<<<<< HEAD
import { Router } from 'express';
import { contactLimiter, applyLimiter } from '../middleware/rateLimits.js';
import { validate } from '../middleware/validate.js';
import { resumeUpload, handleMulterError } from '../middleware/upload.js';
import { contactSchema } from '../validators/contact.js';
import { applySchema } from '../validators/job.js';
import * as settingsController from '../controllers/settingsController.js';
import * as contactController from '../controllers/contactController.js';
import * as jobController from '../controllers/jobController.js';
import * as blogController from '../controllers/blogController.js';
import * as projectController from '../controllers/projectController.js';
import * as testimonialController from '../controllers/testimonialController.js';

const router = Router();

router.get('/settings', settingsController.getPublicSettings);
router.post('/contact', contactLimiter, validate(contactSchema), contactController.submitContact);

router.get('/jobs', jobController.listPublicJobs);
router.get('/jobs/:slug', jobController.getPublicJob);
router.post(
  '/jobs/:slug/apply',
  applyLimiter,
  resumeUpload,
  handleMulterError,
  validate(applySchema),
  jobController.applyToJob,
);

router.get('/blog', blogController.listPublicPosts);
router.get('/blog/:slug', blogController.getPublicPost);

router.get('/projects', projectController.listPublicProjects);
router.get('/projects/:slug', projectController.getPublicProject);

router.get('/testimonials', testimonialController.listPublicTestimonials);

export default router;
=======
import { Router } from 'express';
import { contactLimiter, applyLimiter } from '../middleware/rateLimits.js';
import { validate } from '../middleware/validate.js';
import { resumeUpload, handleMulterError } from '../middleware/upload.js';
import { contactSchema } from '../validators/contact.js';
import { applySchema } from '../validators/job.js';
import * as settingsController from '../controllers/settingsController.js';
import * as contactController from '../controllers/contactController.js';
import * as jobController from '../controllers/jobController.js';
import * as blogController from '../controllers/blogController.js';
import * as projectController from '../controllers/projectController.js';
import * as testimonialController from '../controllers/testimonialController.js';

const router = Router();

router.get('/settings', settingsController.getPublicSettings);
router.post('/contact', contactLimiter, validate(contactSchema), contactController.submitContact);

router.get('/jobs', jobController.listPublicJobs);
router.get('/jobs/:slug', jobController.getPublicJob);
router.post(
  '/jobs/:slug/apply',
  applyLimiter,
  resumeUpload,
  handleMulterError,
  validate(applySchema),
  jobController.applyToJob,
);

router.get('/blog', blogController.listPublicPosts);
router.get('/blog/:slug', blogController.getPublicPost);

router.get('/projects', projectController.listPublicProjects);
router.get('/projects/:slug', projectController.getPublicProject);

router.get('/testimonials', testimonialController.listPublicTestimonials);

export default router;
>>>>>>> 87302d045bec07cfb2e2996b09d26b2a88dcb31e
