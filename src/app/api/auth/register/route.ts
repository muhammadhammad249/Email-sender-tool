import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

// Singleton Prisma client for serverless environments
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };
const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// In-memory store for pending registrations (per serverless instance)
interface PendingRegistration {
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  organizationName: string;
  otpCode: string;
  otpExpiresAt: Date;
}
const globalForPending = globalThis as unknown as { pendingRegistrations: Map<string, PendingRegistration> | undefined };
const pendingRegistrations = globalForPending.pendingRegistrations ?? new Map<string, PendingRegistration>();
if (process.env.NODE_ENV !== 'production') globalForPending.pendingRegistrations = pendingRegistrations;

async function sendOTPEmail(email: string, otp: string) {
  const smtpPass = process.env.SMTP_PASSWORD;
  const smtpUser = process.env.SMTP_USER;
  const isGmailConfigured = smtpPass && smtpPass !== 'your_gmail_app_password_here';

  console.log(`OTP for ${email}: ${otp}`);

  if (isGmailConfigured) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: smtpUser, pass: smtpPass },
      });
      await transporter.sendMail({
        from: `"OutreachPro" <${smtpUser}>`,
        to: email,
        subject: '🔐 Your OutreachPro Verification Code',
        html: `<div style="font-family:Arial,sans-serif;padding:30px;max-width:560px;margin:0 auto;background:#080D1A;color:#F8FAFC;border-radius:16px;border:1px solid #1E293B;">
          <h1 style="color:#F8FAFC;font-size:22px;text-align:center;">Outreach<span style="color:#3B82F6;">Pro</span></h1>
          <h2 style="color:#F8FAFC;text-align:center;">Email Verification</h2>
          <p style="color:#94A3B8;text-align:center;">Use the code below to verify your account</p>
          <div style="background:#1E293B;border-radius:12px;padding:24px;text-align:center;">
            <div style="font-size:42px;font-weight:bold;letter-spacing:14px;color:#60A5FA;font-family:monospace;">${otp}</div>
          </div>
          <p style="color:#94A3B8;text-align:center;font-size:12px;margin-top:16px;">Expires in 10 minutes.</p>
        </div>`,
      });
    } catch (err: any) {
      console.error('Gmail send failed:', err.message);
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, email, password, organizationName } = await req.json();

    if (!firstName || !lastName || !email || !password || !organizationName) {
      return NextResponse.json({ message: 'All fields are required.' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ message: 'Password must be at least 8 characters.' }, { status: 400 });
    }

    // Check if already verified
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { message: 'An account with this email is already registered and verified.' },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    pendingRegistrations.set(email, {
      firstName, lastName, email, passwordHash, organizationName, otpCode, otpExpiresAt,
    });

    await sendOTPEmail(email, otpCode);

    return NextResponse.json({
      message: 'Verification code sent to your email. Please check your inbox.',
      email,
    }, { status: 201 });
  } catch (err: any) {
    console.error('[POST /api/auth/register]', err);
    return NextResponse.json({ message: 'Registration failed. Please try again.' }, { status: 500 });
  }
}
