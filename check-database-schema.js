import { Pool } from '@neondatabase/serverless';
import ws from 'ws';

// Configure websocket for Neon
if (typeof WebSocket === 'undefined') {
  global.WebSocket = ws;
}

// Clean up the DATABASE_URL if it's wrapped in psql format
let databaseUrl = process.env.DATABASE_URL;
if (databaseUrl.startsWith("psql '") && databaseUrl.endsWith("'")) {
  databaseUrl = databaseUrl.slice(6, -1);
} else if (databaseUrl.startsWith("psql ")) {
  databaseUrl = databaseUrl.slice(5);
}

try {
  databaseUrl = decodeURIComponent(databaseUrl);
} catch (e) {
  // If decode fails, use as is
}

const pool = new Pool({ connectionString: databaseUrl });

async function checkSchema() {
  try {
    console.log('🔍 Checking database schema...');
    
    // Check existing tables
    const tablesResult = await pool.query(`
      SELECT table_name, column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      ORDER BY table_name, ordinal_position;
    `);
    
    console.log('📋 Database tables and columns:');
    let currentTable = '';
    for (const row of tablesResult.rows) {
      if (row.table_name !== currentTable) {
        currentTable = row.table_name;
        console.log(`\n🗂️ Table: ${currentTable}`);
      }
      console.log(`  - ${row.column_name} (${row.data_type})`);
    }
    
    // Check existing data
    const contentCount = await pool.query('SELECT COUNT(*) as count FROM content;');
    const categoriesCount = await pool.query('SELECT COUNT(*) as count FROM categories;');
    const genresCount = await pool.query('SELECT COUNT(*) as count FROM genres;');
    
    console.log('\n📊 Current data counts:');
    console.log(`  - Content: ${contentCount.rows[0].count}`);
    console.log(`  - Categories: ${categoriesCount.rows[0].count}`);
    console.log(`  - Genres: ${genresCount.rows[0].count}`);
    
  } catch (error) {
    console.error('❌ Error checking schema:', error.message);
  } finally {
    await pool.end();
  }
}

checkSchema();