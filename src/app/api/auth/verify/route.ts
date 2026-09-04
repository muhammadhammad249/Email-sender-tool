import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'outreachpro_secret_key_change_in_production';

// Singleton Prisma client
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };
const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Share the pending registrations map
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
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ message: 'Email and OTP are required.' }, { status: 400 });
    }

    const pending = pendingRegistrations.get(email);

    if (!pending) {
      return NextResponse.json(
        { message: 'No pending registration found for this email. Please register again.' },
        { status: 400 }
      );
    }

    if (pending.otpCode !== otp) {
      return NextResponse.json({ message: 'Invalid verification code. Please try again.' }, { status: 400 });
    }

    if (pending.otpExpiresAt < new Date()) {
      pendingRegistrations.delete(email);
      return NextResponse.json(
        { message: 'Verification code has expired. Please register again.' },
        { status: 400 }
      );
    }

    // Create user and org in DB
    const org = await prisma.organization.create({
      data: {
        name: pending.organizationName,
        users: {
          create: {
            firstName: pending.firstName,
            lastName: pending.lastName,
            email: pending.email,
            passwordHash: pending.passwordHash,
            role: 'ADMIN',
            isVerified: true,
          },
        },
      },
      include: { users: true },
    });

    const user = org.users[0];
    pendingRegistrations.delete(email);

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
        lastName: user.lastName,
        role: user.role,
        organizationId: user.organizationId,
        organizationName: org.name,
      },
    });
  } catch (err: any) {
    console.error('[POST /api/auth/verify]', err);
    return NextResponse.json({ message: 'Verification failed. Please try again.' }, { status: 500 });
  }
}
