<<<<<<< HEAD
import { Router } from 'express';
import { loginLimiter } from '../middleware/rateLimits.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { loginSchema } from '../validators/auth.js';
import * as authController from '../controllers/authController.js';

const router = Router();

router.get('/csrf', authController.csrf);
router.post('/login', loginLimiter, validate(loginSchema), authController.login);
router.post('/logout', authController.logout);
router.get('/me', requireAuth, authController.me);

export default router;
=======
import { Router } from 'express';
import { loginLimiter } from '../middleware/rateLimits.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { loginSchema } from '../validators/auth.js';
import * as authController from '../controllers/authController.js';

const router = Router();

router.get('/csrf', authController.csrf);
router.post('/login', loginLimiter, validate(loginSchema), authController.login);
router.post('/logout', authController.logout);
router.get('/me', requireAuth, authController.me);

export default router;
>>>>>>> 87302d045bec07cfb2e2996b09d26b2a88dcb31e
