import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';

const router = Router();

/**
 * Authentication Routes
 */

// POST /api/auth/signup - User registration
router.post('/signup', AuthController.signup);

// POST /api/auth/login - User login
router.post('/login', AuthController.login);

// GET /api/auth/me - Session verification (for persistence)
router.get('/me', AuthController.me);

// POST /api/auth/social - OAuth social login
router.post('/social', AuthController.socialLogin);

export default router;
