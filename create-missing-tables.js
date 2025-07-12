import { neon } from '@neondatabase/serverless';

let databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('DATABASE_URL environment variable is required');
  process.exit(1);
}

// Clean up the database URL if it has psql prefix
if (databaseUrl.startsWith("psql '") && databaseUrl.endsWith("'")) {
  databaseUrl = databaseUrl.slice(6, -1);
}

console.log('Database URL configured successfully');

const sql = neon(databaseUrl);

async function createMissingTables() {
  try {
    console.log('Creating missing tables...');

    // Create user_favorites table
    await sql`
      CREATE TABLE IF NOT EXISTS user_favorites (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        content_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        UNIQUE(user_id, content_id)
      );
    `;

    // Create user_watch_history table
    await sql`
      CREATE TABLE IF NOT EXISTS user_watch_history (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        content_id INTEGER NOT NULL,
        watched_at TIMESTAMP DEFAULT NOW() NOT NULL,
        progress_minutes INTEGER DEFAULT 0,
        UNIQUE(user_id, content_id)
      );
    `;

    // Create user_reviews table
    await sql`
      CREATE TABLE IF NOT EXISTS user_reviews (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        content_id INTEGER NOT NULL,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        title TEXT NOT NULL,
        review TEXT NOT NULL,
        likes INTEGER DEFAULT 0 NOT NULL,
        dislikes INTEGER DEFAULT 0 NOT NULL,
        is_active BOOLEAN DEFAULT true NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `;

    // Create review_likes table
    await sql`
      CREATE TABLE IF NOT EXISTS review_likes (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        review_id INTEGER NOT NULL,
        is_like BOOLEAN NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        UNIQUE(user_id, review_id)
      );
    `;

    // Create uploads table
    await sql`
      CREATE TABLE IF NOT EXISTS uploads (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        filename TEXT NOT NULL,
        original_filename TEXT NOT NULL,
        file_path TEXT NOT NULL,
        file_size BIGINT NOT NULL,
        mime_type TEXT NOT NULL,
        status TEXT DEFAULT 'pending' NOT NULL,
        progress INTEGER DEFAULT 0 NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `;

    // Create upload_chunks table
    await sql`
      CREATE TABLE IF NOT EXISTS upload_chunks (
        id SERIAL PRIMARY KEY,
        upload_id INTEGER NOT NULL,
        chunk_number INTEGER NOT NULL,
        chunk_size INTEGER NOT NULL,
        is_uploaded BOOLEAN DEFAULT false NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
        UNIQUE(upload_id, chunk_number)
      );
    `;

    // Create user_comments table
    await sql`
      CREATE TABLE IF NOT EXISTS user_comments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        content_id INTEGER NOT NULL,
        comment TEXT NOT NULL,
        parent_id INTEGER,
        is_active BOOLEAN DEFAULT true NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `;

    // Create user_ratings table
    await sql`
      CREATE TABLE IF NOT EXISTS user_ratings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        content_id INTEGER NOT NULL,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        UNIQUE(user_id, content_id)
      );
    `;

    // Create indexes for better performance
    await sql`
      CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_user_favorites_content_id ON user_favorites(content_id);
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_user_watch_history_user_id ON user_watch_history(user_id);
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_user_watch_history_content_id ON user_watch_history(content_id);
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_user_reviews_content_id ON user_reviews(content_id);
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_user_reviews_user_id ON user_reviews(user_id);
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_review_likes_review_id ON review_likes(review_id);
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_uploads_user_id ON uploads(user_id);
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_upload_chunks_upload_id ON upload_chunks(upload_id);
    `;

    console.log('✅ All missing tables created successfully!');
    
    // Insert some sample data for testing
    await sql`
      INSERT INTO user_favorites (user_id, content_id) 
      VALUES (1, 1), (1, 2), (1, 3)
      ON CONFLICT (user_id, content_id) DO NOTHING;
    `;

    await sql`
      INSERT INTO user_watch_history (user_id, content_id, progress_minutes) 
      VALUES (1, 1, 45), (1, 2, 120), (1, 3, 30)
      ON CONFLICT (user_id, content_id) DO UPDATE SET 
        progress_minutes = EXCLUDED.progress_minutes,
        watched_at = NOW();
    `;

    console.log('✅ Sample data inserted successfully!');

  } catch (error) {
    console.error('❌ Error creating tables:', error);
    process.exit(1);
  }
}

console.log('Database URL configured successfully');
createMissingTables();