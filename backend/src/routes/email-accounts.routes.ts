import { Router, Request, Response, NextFunction } from 'express';
import { EmailAccountController } from '../controllers/email-accounts/EmailAccountController';

const router = Router();
const emailAccountController = new EmailAccountController();

function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

router.post('/', asyncHandler((req, res, next) => emailAccountController.create(req, res)));
router.get('/', asyncHandler((req, res, next) => emailAccountController.getAll(req, res)));
router.delete('/:id', asyncHandler((req, res, next) => emailAccountController.delete(req, res)));

router.post('/warmup', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ status: 'ERROR', message: 'Email is required' });
  setTimeout(() => {
    res.status(200).json({ status: 'SUCCESS', message: `Warmup process initiated for ${email}` });
  }, 1500);
});

export default router;
