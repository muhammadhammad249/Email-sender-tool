import nodemailer from 'nodemailer';
import { getPrisma } from '../../config/database';
import dotenv from 'dotenv';
import path from 'path';

// Load backend .env
dotenv.config({ path: path.resolve(__dirname, '../../../../backend/.env') });

const prisma = getPrisma();

export interface SendEmailOptions {
  emailAccountId?: string;
  to: string;
  subject: string;
  html: string;
  campaignStepId?: string;
  campaignRecipientId?: string;
}

export class EmailSenderService {
  /**
   * Get nodemailer transporter based on DB EmailAccount or fallback to .env
   */
  private async getTransporter(emailAccountId?: string) {
    if (emailAccountId) {
      const account = await prisma.emailAccount.findUnique({
        where: { id: emailAccountId },
      });

      if (!account) {
        throw new Error(`Email account ${emailAccountId} not found`);
      }

      return {
        account,
        transporter: nodemailer.createTransport({
          host: account.smtpHost,
          port: account.smtpPort,
          secure: account.smtpSecure,
          auth: {
            user: account.smtpUser,
            pass: account.smtpPassword,
          },
        }),
      };
    }

    // Fallback to .env configuration
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT) || 587;
    const smtpSecure = process.env.SMTP_SECURE === 'true';
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASSWORD;

    if (!smtpHost || !smtpUser || !smtpPass) {
      throw new Error('No email account provided and fallback SMTP config is missing in .env');
    }

    // Create a dummy account object matching DB shape for fallback
    const fallbackAccount = {
      id: 'env-fallback',
      fromName: process.env.SMTP_FROM_NAME || 'Lead Platform',
      fromEmail: process.env.SMTP_FROM_EMAIL || smtpUser,
      smtpHost,
      smtpPort,
      smtpSecure,
      smtpUser,
      smtpPassword: smtpPass,
      replyTo: null,
    };

    let transporter;
    
    // Quick check for Gmail
    if (smtpHost.includes('gmail.com')) {
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: smtpUser, pass: smtpPass },
      });
    } else {
      transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });
    }

    return {
      account: fallbackAccount,
      transporter,
    };
  }

  /**
   * Send an email and log it to the database
   */
  async sendEmail(options: SendEmailOptions) {
    const { account, transporter } = await this.getTransporter(options.emailAccountId);

    const fromAddress = `"${account.fromName}" <${account.fromEmail}>`;

    const mailOptions: nodemailer.SendMailOptions = {
      from: fromAddress,
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    if (account.replyTo) {
      mailOptions.replyTo = account.replyTo;
    }

    try {
      console.log(`[EmailSenderService] Sending email to ${options.to} from ${fromAddress}...`);
      const info = await transporter.sendMail(mailOptions);
      console.log(`[EmailSenderService] Email sent successfully. MessageId: ${info.messageId}`);

      // Log the email in database if we have a real emailAccountId
      if (account.id !== 'env-fallback') {
        await prisma.emailMessage.create({
          data: {
            emailAccountId: account.id,
            campaignStepId: options.campaignStepId,
            campaignRecipientId: options.campaignRecipientId,
            messageId: info.messageId,
            status: 'SENT',
            sentAt: new Date(),
          },
        });
      }

      return { success: true, messageId: info.messageId };
    } catch (error: any) {
      console.error('[EmailSenderService] Error sending email:', error);

      if (account.id !== 'env-fallback') {
        await prisma.emailMessage.create({
          data: {
            emailAccountId: account.id,
            campaignStepId: options.campaignStepId,
            campaignRecipientId: options.campaignRecipientId,
            status: 'FAILED',
          },
        });
      }

      throw error;
    }
  }
}
