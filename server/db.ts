import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";
import { DATABASE_CONFIG } from './config/constants';

neonConfig.webSocketConstructor = ws;

// Use the DATABASE_URL from Replit's PostgreSQL database
let pool: Pool | null = null;
let db: any = null;

if (!process.env.DATABASE_URL) {
  console.warn("⚠️ DATABASE_URL not found - database features will be limited");
  // pool and db remain null
} else {
  // Extract the actual connection string from psql format
  let databaseUrl = process.env.DATABASE_URL.trim();
  
  // Handle different formats of DATABASE_URL
  if (databaseUrl.includes("psql '") && databaseUrl.includes("'")) {
    // Extract URL from psql 'postgresql://...'
    const match = databaseUrl.match(/psql\s+'([^']+)'/);
    if (match) {
      databaseUrl = match[1];
    }
  } else if (databaseUrl.includes("psql ")) {
    // Handle case where it's just "psql " without quotes
    databaseUrl = databaseUrl.replace(/.*psql\s+/, '');
  }
  
  // Remove quotes if present
  if (databaseUrl.startsWith("'") && databaseUrl.endsWith("'")) {
    databaseUrl = databaseUrl.slice(1, -1);
  }
  
  // Clean up any URL encoding issues
  try {
    databaseUrl = decodeURIComponent(databaseUrl);
  } catch (e) {
    // If decoding fails, use original
    console.warn("Failed to decode DATABASE_URL, using original");
  }

  console.log('✅ Database URL configured successfully');

  // Optimized connection pool configuration
  pool = new Pool({ 
    connectionString: databaseUrl,
    idleTimeoutMillis: DATABASE_CONFIG.IDLE_TIMEOUT,
    connectionTimeoutMillis: DATABASE_CONFIG.CONNECTION_TIMEOUT,
  });

  db = drizzle({ client: pool, schema });
}

export { pool, db };