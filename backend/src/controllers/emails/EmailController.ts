import { Request, Response } from 'express';
import { z } from 'zod';
import { EmailSenderService } from '../../services/emails/EmailSenderService';

const emailSenderService = new EmailSenderService();

const SendEmailSchema = z.object({
  emailAccountId: z.string().optional(),
  to: z.string().email(),
  subject: z.string().min(1, 'Subject is required'),
  html: z.string().min(1, 'HTML body is required'),
});

export class EmailController {
  async sendDirectEmail(req: Request, res: Response) {
    try {
      const data = SendEmailSchema.parse(req.body);

      const result = await emailSenderService.sendEmail(data);

      return res.status(200).json({
        status: 'SUCCESS',
        message: 'Email sent successfully',
        data: result,
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          status: 'ERROR',
          message: 'Validation failed',
          errors: error.issues,
        });
      }

      console.error('[EmailController] Error:', error);
      return res.status(500).json({
        status: 'ERROR',
        message: error?.message || 'Failed to send email',
      });
    }
  }
}
