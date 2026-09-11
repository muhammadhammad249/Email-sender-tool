import { Router, Request, Response, NextFunction } from 'express';
import { EmailController } from '../controllers/emails/EmailController';

const router = Router();
const emailController = new EmailController();

function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

router.post('/send', asyncHandler((req, res, next) => emailController.sendDirectEmail(req, res)));

export default router;
