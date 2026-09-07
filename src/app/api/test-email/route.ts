import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function GET(req: NextRequest) {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASSWORD;

  const diagnostics: Record<string, any> = {
    SMTP_USER_SET: !!smtpUser,
    SMTP_USER_VALUE: smtpUser || 'NOT SET',
    SMTP_PASSWORD_SET: !!smtpPass,
    SMTP_PASSWORD_LENGTH: smtpPass ? smtpPass.length : 0,
  };

  if (!smtpUser || !smtpPass) {
    return NextResponse.json({
      success: false,
      error: 'SMTP_USER or SMTP_PASSWORD is not set in environment variables.',
      diagnostics,
    }, { status: 500 });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: smtpUser, pass: smtpPass },
    });

    // Verify connection first
    await transporter.verify();

    // Send a test email
    await transporter.sendMail({
      from: `"OutreachPro Test" <${smtpUser}>`,
      to: smtpUser, // send to itself as a test
      subject: '✅ OutreachPro SMTP Test - Working!',
      html: `<div style="font-family:Arial;padding:20px;background:#080D1A;color:#F8FAFC;border-radius:12px;">
        <h2>✅ Email is working!</h2>
        <p>SMTP is configured correctly on Vercel.</p>
        <p>Sent from: <strong>${smtpUser}</strong></p>
        <p>Time: <strong>${new Date().toISOString()}</strong></p>
      </div>`,
    });

    return NextResponse.json({
      success: true,
      message: `Test email sent successfully to ${smtpUser}. Check inbox!`,
      diagnostics,
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message,
      errorCode: err.code,
      diagnostics,
    }, { status: 500 });
  }
}
