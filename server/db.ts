import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// For development, use a fallback connection string if DATABASE_URL is not set
const defaultDatabaseUrl = "postgresql://localhost:5432/cinema_academy";

if (!process.env.DATABASE_URL) {
  console.log("DATABASE_URL not found, using local PostgreSQL database");
  process.env.DATABASE_URL = defaultDatabaseUrl;
}

// Extract the actual connection string from psql format
let databaseUrl = process.env.DATABASE_URL;
if (databaseUrl.startsWith("psql '") && databaseUrl.endsWith("'")) {
  databaseUrl = databaseUrl.slice(6, -1); // Remove "psql '" from start and "'" from end
}

console.log('Database URL configured successfully');

export const pool = new Pool({ connectionString: databaseUrl });
export const db = drizzle({ client: pool, schema });