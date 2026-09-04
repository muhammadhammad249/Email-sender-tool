import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

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

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: 'Email is required.' }, { status: 400 });
    }

    const pending = pendingRegistrations.get(email);
    if (!pending) {
      return NextResponse.json(
        { message: 'No pending registration found. Please register again.' },
        { status: 400 }
      );
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    pendingRegistrations.set(email, { ...pending, otpCode, otpExpiresAt });

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
