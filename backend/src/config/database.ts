import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

// Load backend .env using an absolute path so it works regardless of CWD
// (Vercel runs from repo root; local dev runs from backend/)
dotenv.config({ path: path.resolve(__dirname, '../../../backend/.env') });
// Fallback: also try .env in CWD (local dev from backend/)
dotenv.config();

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export function getPrisma(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient();
  }
  return globalForPrisma.prisma;
}