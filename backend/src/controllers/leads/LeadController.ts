import { Request, Response } from 'express';
import { LeadService } from '../../services/leads/LeadService';
import { z } from 'zod';

const leadService = new LeadService();

const CreateLeadSchema = z.object({
  organizationId: z.string().uuid(),
  email: z.string().email(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  companyName: z.string().optional(),
});

export class LeadController {
  async createLead(req: Request, res: Response) {
    try {
      const data = CreateLeadSchema.parse(req.body);
      const newLead = await leadService.createLead(data);
      res.status(201).json({ status: 'SUCCESS', data: newLead });
    } catch (error: any) {
      res.status(400).json({ status: 'ERROR', message: error.message });
    }
  }

  async getLead(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const lead = await leadService.getLead(id);
      if (!lead) {
        return res.status(404).json({ status: 'ERROR', message: 'Lead not found' });
      }
      res.status(200).json({ status: 'SUCCESS', data: lead });
    } catch (error: any) {
      res.status(500).json({ status: 'ERROR', message: error.message });
    }
  }

  async getAllLeads(req: Request, res: Response) {
    try {
      // In a real app, organizationId would come from the authenticated user context
      const { organizationId } = req.query;
      if (!organizationId || typeof organizationId !== 'string') {
        return res.status(400).json({ status: 'ERROR', message: 'organizationId is required' });
      }
      const leads = await leadService.getAllLeads(organizationId);
      res.status(200).json({ status: 'SUCCESS', data: leads });
    } catch (error: any) {
      res.status(500).json({ status: 'ERROR', message: error.message });
    }
  }
}
