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
    const isGmailConfigured = smtpPass && smtpPass !== 'your_gmail_app_password_here';

    if (isGmailConfigured) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: { user: smtpUser, pass: smtpPass },
        });
        await transporter.sendMail({
          from: `"OutreachPro" <${smtpUser}>`,
          to: email,
          subject: '🔐 Your new OutreachPro Verification Code',
          html: `<p>Your new code is: <strong>${otpCode}</strong>. Expires in 10 minutes.</p>`,
        });
      } catch (err: any) {
        console.error('Gmail resend failed:', err.message);
      }
    }

    return NextResponse.json({ message: 'A new verification code has been sent to your email.' });
  } catch (err: any) {
    console.error('[POST /api/auth/resend]', err);
    return NextResponse.json({ message: 'Failed to resend code. Please try again.' }, { status: 500 });
  }
}
