import { db } from './server/db.js';

async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    const result = await db.execute('SELECT 1 as test');
    console.log('Database connection successful:', result);
    
    // Create tables
    await db.execute(`
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
    
    await db.execute(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        name_arabic VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await db.execute(`
      CREATE TABLE IF NOT EXISTS genres (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        name_arabic VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await db.execute(`
      CREATE TABLE IF NOT EXISTS content (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        title_arabic VARCHAR(255) NOT NULL,
        description TEXT,
        description_arabic TEXT,
        type VARCHAR(50) NOT NULL,
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
    
    console.log('Tables created successfully!');
    
    // Insert sample data
    await db.execute(`
      INSERT INTO content (title, title_arabic, description, description_arabic, type, year, language, quality, resolution, rating, duration, episodes, poster_url, is_active)
      VALUES 
        ('The Dark Knight', 'فارس الظلام', 'A superhero movie about Batman', 'فيلم عن باتمان والجوكر', 'movie', 2008, 'English', 'HD', '1080p', '9.0', 152, 0, 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop', TRUE),
        ('Breaking Bad', 'بريكنغ باد', 'A chemistry teacher becomes a drug dealer', 'مدرس كيمياء يصبح تاجر مخدرات', 'series', 2008, 'English', 'HD', '1080p', '9.5', 0, 62, 'https://images.unsplash.com/photo-1489599088293-daa0c0f60f0e?w=400&h=600&fit=crop', TRUE),
        ('The Office', 'المكتب', 'A mockumentary about office life', 'كوميديا عن الحياة في المكتب', 'tv', 2005, 'English', 'HD', '1080p', '8.8', 0, 201, 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=400&h=600&fit=crop', TRUE),
        ('Documentary', 'وثائقي', 'Educational documentary', 'فيلم وثائقي تعليمي', 'misc', 2020, 'Arabic', 'HD', '1080p', '8.0', 90, 0, 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=400&h=600&fit=crop', TRUE)
      ON CONFLICT (id) DO NOTHING
    `);
    
    console.log('Sample data inserted successfully!');
    
    // Switch to database storage
    console.log('Database setup complete!');
    
  } catch (error) {
    console.error('Database connection failed:', error);
    console.log('Will continue using temporary storage');
  }
}

testConnection();