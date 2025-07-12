import { db } from './server/db.ts';
import { sql } from 'drizzle-orm';

async function createUploadTables() {
  try {
    console.log('Creating upload tables...');

    // Test connection first
    const testResult = await db.execute(sql`SELECT 1 as test`);
    console.log('✓ Database connection successful');

    // Create uploads table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS uploads (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        filename TEXT NOT NULL,
        original_filename TEXT NOT NULL,
        file_path TEXT NOT NULL,
        file_size INTEGER NOT NULL,
        mime_type TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        progress INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create upload_chunks table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS upload_chunks (
        id SERIAL PRIMARY KEY,
        upload_id INTEGER REFERENCES uploads(id) ON DELETE CASCADE,
        chunk_number INTEGER NOT NULL,
        chunk_size INTEGER NOT NULL,
        is_uploaded BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create indexes for better performance
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_uploads_user_id ON uploads(user_id)
    `);
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_uploads_status ON uploads(status)
    `);
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_upload_chunks_upload_id ON upload_chunks(upload_id)
    `);
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_upload_chunks_chunk_number ON upload_chunks(upload_id, chunk_number)
    `);

    console.log('✅ Upload tables created successfully!');

  } catch (error) {
    console.error('Error creating upload tables:', error);
    throw error;
  }
}

createUploadTables().catch(console.error);