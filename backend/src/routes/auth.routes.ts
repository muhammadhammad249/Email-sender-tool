import { Router, Request, Response, NextFunction } from 'express';
import { AuthController } from '../controllers/auth/AuthController';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const authController = new AuthController();

/**
 * Wraps an async Express handler so that any thrown error is forwarded
 * to the global error handler via next(err) — prevents "Internal Server Error" HTML.
 */
function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Public routes
router.post(
  '/register',
  asyncHandler((req, res, next) => authController.register(req, res))
);

router.post(
  '/login',
  asyncHandler((req, res, next) => authController.login(req, res))
);

router.post(
  '/verify',
  asyncHandler((req, res, next) => authController.verify(req, res))
);

router.post(
  '/resend',
  asyncHandler((req, res, next) => authController.resend(req, res))
);

// Protected route
router.get(
  '/me',
  authMiddleware,
  asyncHandler((req, res, next) => authController.me(req as any, res))
);

export default router;
