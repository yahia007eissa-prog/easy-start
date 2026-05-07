// Prisma disabled for Vercel deployment
// To re-enable, uncomment and ensure DATABASE_URL is set

/*
// import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
*/

// Placeholder export for type compatibility
export const prisma = null as unknown;