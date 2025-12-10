import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set");
}

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        log: ["query", "error", "warn"],
    })

prisma.$connect().catch((error) => {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;