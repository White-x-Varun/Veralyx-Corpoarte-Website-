import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { jobBodySchema } from '../validators/job.js';
import { blogBodySchema } from '../validators/blog.js';
import { projectBodySchema } from '../validators/project.js';
import { testimonialBodySchema } from '../validators/testimonial.js';
import { settingsSchema } from '../validators/settings.js';
import { enquiryUpdateSchema, applicationUpdateSchema } from '../validators/enquiry.js';
import { profileSchema } from '../validators/auth.js';
import * as jobController from '../controllers/jobController.js';
import * as contactController from '../controllers/contactController.js';
import * as blogController from '../controllers/blogController.js';
import * as projectController from '../controllers/projectController.js';
import * as testimonialController from '../controllers/testimonialController.js';
import * as settingsController from '../controllers/settingsController.js';
import * as dashboardController from '../controllers/dashboardController.js';
import * as authController from '../controllers/authController.js';

const router = Router();

router.use(requireAuth, requireAdmin);

router.get('/dashboard', dashboardController.getDashboard);

router.get('/jobs', jobController.listAdminJobs);
router.post('/jobs', validate(jobBodySchema), jobController.createJob);
router.get('/jobs/:id', jobController.getAdminJob);
router.put('/jobs/:id', validate(jobBodySchema), jobController.updateJob);
router.patch('/jobs/:id', validate(jobBodySchema.partial()), jobController.updateJob);
router.delete('/jobs/:id', jobController.deleteJob);

router.get('/applications', jobController.listApplications);
router.get('/applications/:id', jobController.getApplication);
router.patch('/applications/:id', validate(applicationUpdateSchema), jobController.updateApplication);
router.delete('/applications/:id', jobController.deleteApplication);
router.get('/applications/:id/resume', jobController.downloadResume);

router.get('/enquiries', contactController.listEnquiries);
router.get('/enquiries/:id', contactController.getEnquiry);
router.patch('/enquiries/:id', validate(enquiryUpdateSchema), contactController.updateEnquiry);
router.delete('/enquiries/:id', contactController.deleteEnquiry);

router.get('/blog', blogController.listAdminPosts);
router.post('/blog', validate(blogBodySchema), blogController.createPost);
router.get('/blog/:id', blogController.getAdminPost);
router.put('/blog/:id', validate(blogBodySchema), blogController.updatePost);
router.patch('/blog/:id', validate(blogBodySchema.partial()), blogController.updatePost);
router.delete('/blog/:id', blogController.deletePost);

router.get('/projects', projectController.listAdminProjects);
router.post('/projects', validate(projectBodySchema), projectController.createProject);
router.get('/projects/:id', projectController.getAdminProject);
router.put('/projects/:id', validate(projectBodySchema), projectController.updateProject);
router.patch('/projects/:id', validate(projectBodySchema.partial()), projectController.updateProject);
router.delete('/projects/:id', projectController.deleteProject);

router.get('/testimonials', testimonialController.listAdminTestimonials);
router.post('/testimonials', validate(testimonialBodySchema), testimonialController.createTestimonial);
router.put('/testimonials/:id', validate(testimonialBodySchema), testimonialController.updateTestimonial);
router.patch('/testimonials/:id', validate(testimonialBodySchema.partial()), testimonialController.updateTestimonial);
router.delete('/testimonials/:id', testimonialController.deleteTestimonial);

router.get('/settings', settingsController.getAdminSettings);
router.put('/settings', validate(settingsSchema), settingsController.updateSettings);

router.put('/profile', validate(profileSchema), authController.updateProfile);

export default router;
