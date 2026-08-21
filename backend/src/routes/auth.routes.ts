import { Router } from 'express';
import { AuthController } from '../controllers/auth/AuthController';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const authController = new AuthController();

// Public routes
router.post('/register', (req, res) => authController.register(req, res));
router.post('/login', (req, res) => authController.login(req, res));
router.post('/verify', (req, res) => authController.verify(req, res));
router.post('/resend', (req, res) => authController.resend(req, res));

// Protected route
router.get('/me', authMiddleware, (req, res) => authController.me(req as any, res));

export default router;
