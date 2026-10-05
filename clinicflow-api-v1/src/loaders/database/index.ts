import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default async function databaseLoader(): Promise<PrismaClient> {
  try {
    await prisma.$connect();
    return prisma;
  } catch (error) {
    console.error("Failed to connect to database:", error);
    return prisma;
  }
}
