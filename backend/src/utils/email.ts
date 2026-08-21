import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create a persistent Ethereal test account once
let testTransporter: nodemailer.Transporter | null = null;

async function getEtherealTransporter() {
  if (testTransporter) return testTransporter;
  const account = await nodemailer.createTestAccount();
  testTransporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: { user: account.user, pass: account.pass },
  });
  return testTransporter;
}

export async function sendOTP(email: string, otp: string) {
  // Always print OTP clearly to terminal first
  console.log('\n');
  console.log('╔══════════════════════════════════════════════╗');
  console.log(`║  📧 OTP EMAIL VERIFICATION                   ║`);
  console.log(`║  To:   ${email.padEnd(37)}║`);
  console.log(`║  Code: ${otp.padEnd(37)}║`);
  console.log('╚══════════════════════════════════════════════╝');
  console.log('\n');

  const fromName = 'OutreachPro';
  const htmlBody = `
    <div style="font-family:Arial,sans-serif;padding:30px;max-width:560px;margin:0 auto;background:#080D1A;color:#F8FAFC;border-radius:16px;border:1px solid #1E293B;">
      <h1 style="color:#F8FAFC;font-size:22px;text-align:center;margin-bottom:4px;">Outreach<span style="color:#3B82F6;">Pro</span></h1>
      <h2 style="color:#F8FAFC;font-size:18px;text-align:center;margin-bottom:8px;">Email Verification</h2>
      <p style="color:#94A3B8;text-align:center;margin-bottom:28px;">Use the code below to verify your account</p>
      <div style="background:#1E293B;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;">
        <div style="font-size:42px;font-weight:bold;letter-spacing:14px;color:#60A5FA;font-family:monospace;">${otp}</div>
      </div>
      <p style="color:#94A3B8;text-align:center;font-size:12px;">Expires in 10 minutes. If you didn't request this, ignore this email.</p>
    </div>
  `;

  // Try Gmail first if App Password is set
  const smtpPass = process.env.SMTP_PASSWORD;
  const smtpUser = process.env.SMTP_USER;
  const isGmailConfigured = smtpPass && smtpPass !== 'your_gmail_app_password_here';

  if (isGmailConfigured) {
    try {
      const gmailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: smtpUser, pass: smtpPass },
      });
      await gmailTransporter.sendMail({
        from: `"${fromName}" <${smtpUser}>`,
        to: email,
        subject: '🔐 Your OutreachPro Verification Code',
        html: htmlBody,
      });
      console.log(`✅ Gmail: OTP sent to ${email}`);
      return;
    } catch (gmailErr: any) {
      console.error('⚠️  Gmail failed:', gmailErr.message);
      console.log('📬 Falling back to Ethereal preview...\n');
    }
  }

  // Fallback: Ethereal (always works, shows preview link)
  try {
    const ethereal = await getEtherealTransporter();
    const info = await ethereal.sendMail({
      from: `"${fromName}" <noreply@outreachpro.io>`,
      to: email,
      subject: '🔐 Your OutreachPro Verification Code',
      html: htmlBody,
    });
    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log('╔══════════════════════════════════════════════╗');
    console.log('║  📬 VIEW EMAIL IN BROWSER:                   ║');
    console.log(`║  ${(previewUrl || '').toString().substring(0, 44).padEnd(44)}║`);
    console.log('╚══════════════════════════════════════════════╝\n');
    console.log('👆 Open this link in browser to view the email\n');
  } catch (err: any) {
    console.error('❌ Ethereal also failed:', err.message);
  }
}
