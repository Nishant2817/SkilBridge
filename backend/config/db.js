import "dotenv/config";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

// Guard: Ensure DATABASE_URL exists to prevent silent failures
if (!process.env.DATABASE_URL) {
  throw new Error(
    "❌ [DATABASE ERROR]: DATABASE_URL is missing in .env file."
  );
}

// 1. Initialize native pg Pool with the connection string
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

// 2. Wrap the pool in Prisma's Postgres adapter (Required for Prisma v7)
const adapter = new PrismaPg(pool);

// 3. Initialize PrismaClient with the adapter
const prisma = new PrismaClient({ adapter });

// 4. Test connection on startup (Optional but good for debugging)
prisma.$connect()
  .then(() => console.log("✅ PostgreSQL connected via Prisma"))
  .catch((err) => {
    console.error("❌ Prisma connection failed:", err.message);
    process.exit(1);
  });

export default prisma;


