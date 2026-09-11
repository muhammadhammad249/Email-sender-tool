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

  /**
   * Launch a Campaign (Send first step to all recipients)
   */
  async launchCampaign(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      objectIdSchema.parse(id);

      const { emailAccountId } = req.body;
      if (!emailAccountId) {
        return res.status(400).json({ status: 'ERROR', message: 'emailAccountId is required to launch campaign' });
      }

      // Fetch campaign with steps and recipients
      const { getPrisma } = await import('../../config/database');
      const prisma = getPrisma();
      
      const campaign = await prisma.campaign.findUnique({
        where: { id },
        include: {
          steps: { orderBy: { sequence: 'asc' } },
          recipients: { include: { lead: true } },
        }
      });

      if (!campaign) {
        return res.status(404).json({ status: 'ERROR', message: 'Campaign not found' });
      }

      if (campaign.steps.length === 0) {
        return res.status(400).json({ status: 'ERROR', message: 'Campaign has no steps to send' });
      }

      if (campaign.recipients.length === 0) {
        return res.status(400).json({ status: 'ERROR', message: 'Campaign has no recipients' });
      }

      const firstStep = campaign.steps[0];
      const { EmailSenderService } = await import('../../services/emails/EmailSenderService');
      const emailSender = new EmailSenderService();

      let sentCount = 0;
      let failedCount = 0;

      for (const recipient of campaign.recipients) {
        try {
          if (!recipient.lead.email) continue;
          
          let personalizedHtml = firstStep.contentHtml;
          personalizedHtml = personalizedHtml.replace(/\{\{firstName\}\}/g, recipient.lead.firstName || 'there');
          personalizedHtml = personalizedHtml.replace(/\{\{companyName\}\}/g, recipient.lead.companyName || 'your company');
          
          let personalizedSubject = firstStep.subject;
          personalizedSubject = personalizedSubject.replace(/\{\{firstName\}\}/g, recipient.lead.firstName || '');
          personalizedSubject = personalizedSubject.replace(/\{\{companyName\}\}/g, recipient.lead.companyName || '');

          await emailSender.sendEmail({
            emailAccountId,
            to: recipient.lead.email,
            subject: personalizedSubject,
            html: personalizedHtml,
            campaignStepId: firstStep.id,
            campaignRecipientId: recipient.id,
          });
          
          // Update recipient status
          await prisma.campaignRecipient.update({
            where: { id: recipient.id },
            data: { status: 'SENT_STEP_1' }
          });
          sentCount++;
        } catch (err) {
          console.error(`Failed to send to ${recipient.lead.email}:`, err);
          failedCount++;
        }
      }

      await prisma.campaign.update({
        where: { id },
        data: { status: 'RUNNING' }
      });

      return res.status(200).json({
        status: 'SUCCESS',
        message: `Campaign launched. Sent: ${sentCount}, Failed: ${failedCount}`
      });
    } catch (error: any) {
       console.error('[CampaignController] Error launching campaign:', error);
       return res.status(500).json({
        status: 'ERROR',
        message: error?.message || 'Failed to launch campaign',
      });
    }
  }
}