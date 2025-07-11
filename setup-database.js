import { db } from './server/db.ts';
import { sql } from 'drizzle-orm';

async function setupDatabase() {
  try {
    console.log('Setting up database tables...');
    
    // Test connection first
    const testResult = await db.execute(sql`SELECT 1 as test`);
    console.log('✓ Database connection successful');
    
    // Create users table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        role VARCHAR(50) DEFAULT 'user',
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create categories table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        name_arabic VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create genres table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS genres (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        name_arabic VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create content table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS content (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        title_arabic VARCHAR(255) NOT NULL,
        description TEXT,
        description_arabic TEXT,
        type VARCHAR(50) NOT NULL CHECK (type IN ('movie', 'series', 'tv', 'misc')),
        year INTEGER,
        language VARCHAR(100),
        quality VARCHAR(50),
        resolution VARCHAR(50),
        rating VARCHAR(10),
        duration INTEGER DEFAULT 0,
        episodes INTEGER DEFAULT 0,
        poster_url TEXT,
        video_url TEXT,
        download_url TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create junction tables
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS content_genres (
        content_id INTEGER REFERENCES content(id) ON DELETE CASCADE,
        genre_id INTEGER REFERENCES genres(id) ON DELETE CASCADE,
        PRIMARY KEY (content_id, genre_id)
      )
    `);
    
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS content_categories (
        content_id INTEGER REFERENCES content(id) ON DELETE CASCADE,
        category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
        PRIMARY KEY (content_id, category_id)
      )
    `);
    
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS user_ratings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        content_id INTEGER REFERENCES content(id) ON DELETE CASCADE,
        rating INTEGER CHECK (rating >= 1 AND rating <= 10),
        review TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, content_id)
      )
    `);
    
    console.log('✓ All tables created successfully');
    
    // Insert sample data
    await db.execute(sql`
      INSERT INTO content (title, title_arabic, description, description_arabic, type, year, language, quality, resolution, rating, duration, episodes, poster_url, is_active)
      VALUES 
        ('The Dark Knight', 'فارس الظلام', 'A superhero movie about Batman', 'فيلم عن باتمان والجوكر', 'movie', 2008, 'English', 'HD', '1080p', '9.0', 152, 0, 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop', TRUE),
        ('Breaking Bad', 'بريكنغ باد', 'A chemistry teacher becomes a drug dealer', 'مدرس كيمياء يصبح تاجر مخدرات', 'series', 2008, 'English', 'HD', '1080p', '9.5', 0, 62, 'https://images.unsplash.com/photo-1489599088293-daa0c0f60f0e?w=400&h=600&fit=crop', TRUE),
        ('The Office', 'المكتب', 'A mockumentary about office life', 'كوميديا عن الحياة في المكتب', 'tv', 2005, 'English', 'HD', '1080p', '8.8', 0, 201, 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=400&h=600&fit=crop', TRUE),
        ('Documentary', 'وثائقي', 'Educational documentary', 'فيلم وثائقي تعليمي', 'misc', 2020, 'Arabic', 'HD', '1080p', '8.0', 90, 0, 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=400&h=600&fit=crop', TRUE)
      ON CONFLICT (id) DO NOTHING
    `);
    
    console.log('✓ Sample data inserted successfully');
    
    // Test queries
    const contentCount = await db.execute(sql`SELECT COUNT(*) as count FROM content`);
    const count = contentCount.rows ? contentCount.rows[0]?.count : contentCount[0]?.count;
    console.log(`✓ Database contains ${count || 0} content items`);
    
    console.log('\n🎉 Database setup completed successfully!');
    console.log('You can now switch to DatabaseStorage in server/storage.ts');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    console.log('Will continue using temporary storage');
  }
}

setupDatabase();