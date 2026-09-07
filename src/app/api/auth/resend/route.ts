import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

import { PrismaClient } from '@prisma/client';

// Singleton Prisma client
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };
const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: 'Email is required.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.isVerified) {
      return NextResponse.json(
        { message: 'No pending registration found. Please register again.' },
        { status: 400 }
      );
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    
    await prisma.user.update({
      where: { email },
      data: { otpCode, otpExpiresAt },
    });

    console.log(`Resend OTP for ${email}: ${otpCode}`);

    const smtpPass = process.env.SMTP_PASSWORD;
    const smtpUser = process.env.SMTP_USER;

    if (smtpPass && smtpUser) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: { user: smtpUser, pass: smtpPass },
        });
        await transporter.sendMail({
          from: `"OutreachPro" <${smtpUser}>`,
          to: email,
          subject: '🔐 Your new OutreachPro Verification Code',
          html: `<div style="font-family:Arial,sans-serif;padding:30px;max-width:560px;margin:0 auto;background:#080D1A;color:#F8FAFC;border-radius:16px;border:1px solid #1E293B;">
            <h1 style="color:#F8FAFC;font-size:22px;text-align:center;">Outreach<span style="color:#3B82F6;">Pro</span></h1>
            <h2 style="color:#F8FAFC;text-align:center;">New Verification Code</h2>
            <p style="color:#94A3B8;text-align:center;">Your new verification code is:</p>
            <div style="background:#1E293B;border-radius:12px;padding:24px;text-align:center;">
              <div style="font-size:42px;font-weight:bold;letter-spacing:14px;color:#60A5FA;font-family:monospace;">${otpCode}</div>
            </div>
            <p style="color:#94A3B8;text-align:center;font-size:12px;margin-top:16px;">Expires in 10 minutes.</p>
          </div>`,
        });
        console.log(`[Resend] Email sent successfully to ${email}`);
      } catch (err: any) {
        console.error(`[Resend] Gmail send failed: ${err.message}`);
      }
    } else {
      console.error('[Resend] SMTP_USER or SMTP_PASSWORD not configured in Vercel.');
    }

    return NextResponse.json({ message: 'A new verification code has been sent to your email.' });
  } catch (err: any) {
    console.error('[POST /api/auth/resend]', err);
    return NextResponse.json({ message: 'Failed to resend code. Please try again.' }, { status: 500 });
  }
}
