import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { drizzle as drizzlePg } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import ws from "ws";
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}

// Use different drivers based on database type
const isLocalDev =
  process.env.NODE_ENV === "development" &&
  process.env.DATABASE_URL.includes("localhost");

let db: any;
let pool: any;

console.log("🔧 Database configuration:");
console.log(
  "DATABASE_URL:",
  process.env.DATABASE_URL?.substring(0, 50) + "..."
);
console.log("NODE_ENV:", process.env.NODE_ENV);

if (isLocalDev) {
  // Use postgres.js for local PostgreSQL development
  console.log("🔧 Using local PostgreSQL with postgres.js");
  const client = postgres(process.env.DATABASE_URL);
  db = drizzlePg(client, { schema });
} else {
  // Use Neon serverless for cloud databases (including Neon)
  console.log("🔧 Using Neon PostgreSQL serverless");
  neonConfig.webSocketConstructor = ws;
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle({ client: pool, schema });
}

export { db, pool };

// Always use the PostgreSQL schema since we migrated from SQLite
export const currentSchema = schema;
