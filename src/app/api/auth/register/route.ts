import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'outreachpro_secret_key_change_in_production';

// Singleton Prisma client for serverless environments
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };
const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, email, password, organizationName } = await req.json();

    if (!firstName || !lastName || !email || !password || !organizationName) {
      return NextResponse.json({ message: 'All fields are required.' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ message: 'Password must be at least 8 characters.' }, { status: 400 });
    }

    // Check if already registered
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { message: 'An account with this email already exists. Please login.' },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    // Create org + user — immediately verified, no OTP needed
    const org = await prisma.organization.create({
      data: {
        name: organizationName,
        users: {
          create: {
            firstName,
            lastName,
            email,
            passwordHash,
            role: 'ADMIN',
            isVerified: true,
          },
        },
      },
      include: { users: true },
    });

    const user = org.users[0];

    // Return JWT token immediately — user is logged in right away
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
    }, { status: 201 });

  } catch (err: any) {
    console.error('[POST /api/auth/register]', err);
    return NextResponse.json({ message: 'Registration failed. Please try again.' }, { status: 500 });
  }
}
