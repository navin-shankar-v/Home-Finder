import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

let _pool: Pool | null = null;
let _db: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (!_db) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is required for database storage");
    }
    _pool = new Pool({ connectionString });
    _db = drizzle(_pool);
  }
  return _db;
}

export function getDbPool(): Pool | null {
  return _pool;
}
