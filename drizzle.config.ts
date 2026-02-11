import "dotenv/config";
import { config as dotenvConfig } from "dotenv";
import { defineConfig } from "drizzle-kit";

// Load .env and client/.env.local so DATABASE_URL is available when running db:push
dotenvConfig({ path: ".env.local" });
dotenvConfig({ path: "client/.env.local" });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
