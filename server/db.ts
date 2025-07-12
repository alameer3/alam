import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Use the DATABASE_URL from Replit's PostgreSQL database
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

// Extract the actual connection string from psql format
let databaseUrl = process.env.DATABASE_URL;
if (databaseUrl.startsWith("psql '") && databaseUrl.endsWith("'")) {
  databaseUrl = databaseUrl.slice(6, -1); // Remove "psql '" from start and "'" from end
} else if (databaseUrl.startsWith("psql ")) {
  // Handle case where it's just "psql " without quotes
  databaseUrl = databaseUrl.slice(5);
}

console.log('Database URL configured successfully');

// Optimized connection pool configuration
export const pool = new Pool({ 
  connectionString: databaseUrl,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

export const db = drizzle({ client: pool, schema });