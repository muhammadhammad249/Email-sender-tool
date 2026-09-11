import { Request, Response } from 'express';
import { z } from 'zod';
import { getPrisma } from '../../config/database';

const prisma = getPrisma();

const CreateEmailAccountSchema = z.object({
  organizationId: z.string().optional(),
  fromName: z.string().min(1, 'Sender name is required'),
  fromEmail: z.string().email(),
  smtpHost: z.string().min(1, 'SMTP Host is required'),
  smtpPort: z.coerce.number().int().positive(),   // coerce: handles string "587" from forms
  smtpSecure: z.boolean().default(false),
  smtpUser: z.string().min(1, 'SMTP User is required'),
  smtpPassword: z.string().min(1, 'SMTP Password is required'),
  // Accept empty string, convert to null so email validator doesn't fail
  replyTo: z.string().optional().nullable().transform(v => (v === '' || v === undefined) ? null : v),
});

export class EmailAccountController {
  async create(req: Request, res: Response) {
    try {
      const data = CreateEmailAccountSchema.parse(req.body);

      // Assuming a default organization if none provided (for simplicity in this app context)
      let orgId = data.organizationId;
      if (!orgId) {
        let org = await prisma.organization.findFirst();
        if (!org) {
          org = await prisma.organization.create({ data: { name: 'Default Org' } });
        }
        orgId = org.id;
      }

      const newAccount = await prisma.emailAccount.create({
        data: {
          ...data,
          organizationId: orgId,
        },
      });

      return res.status(201).json({ status: 'SUCCESS', data: newAccount });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ status: 'ERROR', message: 'Validation failed', errors: error.issues });
      }
      return res.status(500).json({ status: 'ERROR', message: error.message });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const accounts = await prisma.emailAccount.findMany({
        orderBy: { createdAt: 'desc' },
      });
      return res.status(200).json({ status: 'SUCCESS', data: accounts });
    } catch (error: any) {
      return res.status(500).json({ status: 'ERROR', message: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      await prisma.emailAccount.delete({ where: { id } });
      return res.status(200).json({ status: 'SUCCESS', message: 'Account deleted' });
    } catch (error: any) {
      return res.status(500).json({ status: 'ERROR', message: error.message });
    }
  }
}
