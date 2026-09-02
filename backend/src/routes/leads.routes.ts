import { Router, Request, Response, NextFunction } from 'express';
import { LeadController } from '../controllers/leads/LeadController';

const router = Router();
const leadController = new LeadController();

function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

router.post('/', asyncHandler((req, res, next) => leadController.createLead(req, res)));
router.get('/', asyncHandler((req, res, next) => leadController.getAllLeads(req, res)));
router.get('/:id', asyncHandler((req, res, next) => leadController.getLead(req, res)));

export default router;
