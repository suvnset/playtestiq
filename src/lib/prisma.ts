// src/lib/prisma.ts

import { PrismaClient } from "@prisma/client";

// Add a custom prisma property to the global object.
// This lets us store one PrismaClient instance across hot reloads.
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

// Use the existing PrismaClient if it already exists.
// Otherwise, create a new one.
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // Only show warnings and errors in the terminal.
    log: ["error", "warn"],
  });

// In development, save the PrismaClient globally.
// This prevents Next.js from creating a new database connection every refresh.
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}