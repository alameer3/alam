import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Extract the actual connection string from psql format
let databaseUrl = process.env.DATABASE_URL;
if (databaseUrl.startsWith("psql '") && databaseUrl.endsWith("'")) {
  databaseUrl = databaseUrl.slice(6, -1); // Remove "psql '" from start and "'" from end
}

console.log('Database URL configured successfully');

export const pool = new Pool({ connectionString: databaseUrl });
export const db = drizzle({ client: pool, schema });