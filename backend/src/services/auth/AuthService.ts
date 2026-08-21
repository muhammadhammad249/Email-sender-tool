import { getPrisma } from '../../config/database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendOTP } from '../../utils/email';

const JWT_SECRET = process.env.JWT_SECRET || 'outreachpro_secret_key_change_in_production';
const JWT_EXPIRES_IN = '7d';

interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  organizationName: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface VerifyInput {
  email: string;
  otp: string;
}

// Temporary in-memory store for pending (unverified) registrations
// User is NOT saved to DB until OTP is confirmed
interface PendingRegistration {
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  organizationName: string;
  otpCode: string;
  otpExpiresAt: Date;
}

const pendingRegistrations = new Map<string, PendingRegistration>();

export class AuthService {
  private get prisma() {
    return getPrisma();
  }

  async register(input: RegisterInput) {
    const { firstName, lastName, email, password, organizationName } = input;

    // Check if a VERIFIED user already exists in the database
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error('An account with this email is already registered and verified.');
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 12);

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store registration data temporarily (NOT in DB yet)
    pendingRegistrations.set(email, {
      firstName,
      lastName,
      email,
      passwordHash,
      organizationName,
      otpCode,
      otpExpiresAt,
    });

    // Send OTP to the user's email
    await sendOTP(email, otpCode);

    console.log(`📧 OTP sent to ${email}: ${otpCode}`);

    return {
      message: 'Verification code sent to your email. Please check your inbox.',
      email,
    };
  }

  async resendOTP(email: string) {
    // Check if there's a pending registration
    const pending = pendingRegistrations.get(email);
    if (!pending) {
      throw new Error('No pending registration found. Please register again.');
    }

    // Generate fresh OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Update the pending registration with new OTP
    pendingRegistrations.set(email, { ...pending, otpCode, otpExpiresAt });

    // Send new OTP
    await sendOTP(email, otpCode);

    return { message: 'A new verification code has been sent to your email.' };
  }

  async verifyOTP(input: VerifyInput) {
    const { email, otp } = input;

    // Look up the pending registration from memory
    const pending = pendingRegistrations.get(email);

    if (!pending) {
      throw new Error('No pending registration found for this email. Please register again.');
    }

    if (pending.otpCode !== otp) {
      throw new Error('Invalid verification code. Please try again.');
    }

    if (pending.otpExpiresAt < new Date()) {
      pendingRegistrations.delete(email);
      throw new Error('Verification code has expired. Please register again.');
    }

    // OTP is valid — NOW create the user and organization in the database
    const org = await this.prisma.organization.create({
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
      include: {
        users: true,
      },
    });

    const user = org.users[0];

    // Remove from pending store
    pendingRegistrations.delete(email);

    // Issue JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return {
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
    };
  }

  async login(input: LoginInput) {
    const { email, password } = input;

    // Find verified user only
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { organization: true },
    });

    if (!user) {
      // Also check if there's a pending registration not yet verified
      const isPending = pendingRegistrations.has(email);
      if (isPending) {
        throw new Error('Please verify your email first. Check your inbox for the verification code.');
      }
      throw new Error('Invalid email or password.');
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new Error('Invalid email or password.');
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        organizationId: user.organizationId,
        organizationName: user.organization?.name,
      },
    };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { organization: true },
    });

    if (!user) {
      throw new Error('User not found.');
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      organizationId: user.organizationId,
      organizationName: user.organization?.name,
    };
  }
}
