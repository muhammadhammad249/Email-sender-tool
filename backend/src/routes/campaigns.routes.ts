import { Router } from 'express';
import { CampaignController } from '../controllers/campaigns/CampaignController';

const router = Router();
const campaignController = new CampaignController();

router.post('/', campaignController.createCampaign.bind(campaignController));
router.get('/', campaignController.getAllCampaigns.bind(campaignController));
router.get('/:id', campaignController.getCampaign.bind(campaignController));

export default router;
