import { Router, Request, Response, NextFunction } from 'express';
import { CampaignController } from '../controllers/campaigns/CampaignController';

const router = Router();
const campaignController = new CampaignController();

function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

router.post('/', asyncHandler((req, res, next) => campaignController.createCampaign(req, res)));
router.get('/', asyncHandler((req, res, next) => campaignController.getAllCampaigns(req, res)));
router.get('/:id', asyncHandler((req, res, next) => campaignController.getCampaign(req, res)));

export default router;
