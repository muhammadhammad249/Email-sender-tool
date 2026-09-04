import { Request, Response } from 'express';
import { z } from 'zod';

import { CampaignService } from '../../services/campaigns/CampaignService';

const campaignService = new CampaignService();

/**
 * MongoDB ObjectId validation
 * Example: 68b123456789abcdef123456
 */
const objectIdSchema = z
  .string()
  .regex(/^[a-f\d]{24}$/i, 'Invalid MongoDB ObjectId');

const CreateCampaignSchema = z.object({
  organizationId: objectIdSchema,
  name: z.string().min(1, 'Campaign name is required'),
  status: z
    .enum([
      'DRAFT',
      'SCHEDULED',
      'RUNNING',
      'COMPLETED',
      'PAUSED',
    ])
    .default('DRAFT'),
});

export class CampaignController {
  /**
   * Create Campaign
   */
  async createCampaign(req: Request, res: Response) {
    try {
      const data = CreateCampaignSchema.parse(req.body);

      const newCampaign = await campaignService.createCampaign(data);

      return res.status(201).json({
        status: 'SUCCESS',
        data: newCampaign,
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          status: 'ERROR',
          message: 'Validation failed',
          errors: error.issues,
        });
      }

      return res.status(400).json({
        status: 'ERROR',
        message: error?.message || 'Failed to create campaign',
      });
    }
  }

  /**
   * Get Campaign by ID
   */
  async getCampaign(req: Request, res: Response) {
    try {
      const id = String(req.params.id);

      // Validate MongoDB ObjectId
      objectIdSchema.parse(id);

      const campaign = await campaignService.getCampaign(id);

      if (!campaign) {
        return res.status(404).json({
          status: 'ERROR',
          message: 'Campaign not found',
        });
      }

      return res.status(200).json({
        status: 'SUCCESS',
        data: campaign,
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          status: 'ERROR',
          message: 'Invalid campaign ID',
        });
      }

      return res.status(500).json({
        status: 'ERROR',
        message: error?.message || 'Failed to get campaign',
      });
    }
  }

  /**
   * Get all campaigns for an organization
   */
  async getAllCampaigns(req: Request, res: Response) {
    try {
      const { organizationId } = req.query;

      if (!organizationId || typeof organizationId !== 'string') {
        return res.status(400).json({
          status: 'ERROR',
          message: 'organizationId is required',
        });
      }

      // Validate MongoDB ObjectId
      objectIdSchema.parse(organizationId);

      const campaigns =
        await campaignService.getAllCampaigns(organizationId);

      return res.status(200).json({
        status: 'SUCCESS',
        data: campaigns,
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          status: 'ERROR',
          message: 'Invalid organizationId',
        });
      }

      return res.status(500).json({
        status: 'ERROR',
        message: error?.message || 'Failed to get campaigns',
      });
    }
  }
}