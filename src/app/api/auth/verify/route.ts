import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'outreachpro_secret_key_change_in_production';

// Singleton Prisma client
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };
const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;



export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ message: 'Email and OTP are required.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { organization: true },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'No pending registration found for this email. Please register again.' },
        { status: 400 }
      );
    }

    if (user.isVerified) {
      return NextResponse.json({ message: 'Account is already verified. Please login.' }, { status: 400 });
    }

    if (user.otpCode !== otp) {
      return NextResponse.json({ message: 'Invalid verification code. Please try again.' }, { status: 400 });
    }

    if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      return NextResponse.json(
        { message: 'Verification code has expired. Please register again.' },
        { status: 400 }
      );
    }

    // Verify user in DB
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { isVerified: true, otpCode: null, otpExpiresAt: null },
      include: { organization: true },
    });


    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: updatedUser.lastName,
        role: updatedUser.role,
        organizationId: updatedUser.organizationId,
        organizationName: updatedUser.organization?.name,
      },
    });
  } catch (err: any) {
    console.error('[POST /api/auth/verify]', err);
    return NextResponse.json({ message: 'Verification failed. Please try again.' }, { status: 500 });
  }
}
