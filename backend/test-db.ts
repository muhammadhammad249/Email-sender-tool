import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('Connecting to database...');
  console.log('URL:', process.env.DATABASE_URL);
  try {
    await prisma.$connect();
    console.log('Connected successfully!');
    const users = await prisma.user.findMany();
    console.log('Users count:', users.length);
  } catch (e) {
    console.error('Error connecting:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
