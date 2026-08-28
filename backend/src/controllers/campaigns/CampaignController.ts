import { Request, Response } from 'express';
import { CampaignService } from '../../services/campaigns/CampaignService';
import { z } from 'zod';

const campaignService = new CampaignService();

const CreateCampaignSchema = z.object({
  organizationId: z.string().uuid(),
  name: z.string().min(1),
  status: z.enum(['DRAFT', 'SCHEDULED', 'RUNNING', 'COMPLETED', 'PAUSED']).default('DRAFT'),
});

export class CampaignController {
  async createCampaign(req: Request, res: Response) {
    try {
      const data = CreateCampaignSchema.parse(req.body);
      const newCampaign = await campaignService.createCampaign(data);
      res.status(201).json({ status: 'SUCCESS', data: newCampaign });
    } catch (error: any) {
      res.status(400).json({ status: 'ERROR', message: error.message });
    }
  }

  async getCampaign(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const campaign = await campaignService.getCampaign(id);
      if (!campaign) {
        return res.status(404).json({ status: 'ERROR', message: 'Campaign not found' });
      }
      res.status(200).json({ status: 'SUCCESS', data: campaign });
    } catch (error: any) {
      res.status(500).json({ status: 'ERROR', message: error.message });
    }
  }

  async getAllCampaigns(req: Request, res: Response) {
    try {
      const { organizationId } = req.query;
      if (!organizationId || typeof organizationId !== 'string') {
        return res.status(400).json({ status: 'ERROR', message: 'organizationId is required' });
      }
      const campaigns = await campaignService.getAllCampaigns(organizationId);
      res.status(200).json({ status: 'SUCCESS', data: campaigns });
    } catch (error: any) {
      res.status(500).json({ status: 'ERROR', message: error.message });
    }
  }
}
