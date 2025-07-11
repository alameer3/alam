import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function initDatabase() {
  try {
    console.log('Connecting to database...');
    
    // Create users table
    await pool.query(`
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
    await pool.query(`
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
    await pool.query(`
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
    await pool.query(`
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
    
    // Create content_genres junction table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS content_genres (
        content_id INTEGER REFERENCES content(id) ON DELETE CASCADE,
        genre_id INTEGER REFERENCES genres(id) ON DELETE CASCADE,
        PRIMARY KEY (content_id, genre_id)
      )
    `);
    
    // Create content_categories junction table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS content_categories (
        content_id INTEGER REFERENCES content(id) ON DELETE CASCADE,
        category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
        PRIMARY KEY (content_id, category_id)
      )
    `);
    
    // Create user_ratings table
    await pool.query(`
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
    
    // Insert sample data
    await pool.query(`
      INSERT INTO content (title, title_arabic, description, description_arabic, type, year, language, quality, resolution, rating, duration, episodes, poster_url, is_active)
      VALUES 
        ('The Dark Knight', 'فارس الظلام', 'A superhero movie about Batman', 'فيلم عن باتمان والجوكر', 'movie', 2008, 'English', 'HD', '1080p', '9.0', 152, 0, 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop', TRUE),
        ('Breaking Bad', 'بريكنغ باد', 'A chemistry teacher becomes a drug dealer', 'مدرس كيمياء يصبح تاجر مخدرات', 'series', 2008, 'English', 'HD', '1080p', '9.5', 0, 62, 'https://images.unsplash.com/photo-1489599088293-daa0c0f60f0e?w=400&h=600&fit=crop', TRUE),
        ('The Office', 'المكتب', 'A mockumentary about office life', 'كوميديا عن الحياة في المكتب', 'tv', 2005, 'English', 'HD', '1080p', '8.8', 0, 201, 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=400&h=600&fit=crop', TRUE),
        ('Documentary', 'وثائقي', 'Educational documentary', 'فيلم وثائقي تعليمي', 'misc', 2020, 'Arabic', 'HD', '1080p', '8.0', 90, 0, 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=400&h=600&fit=crop', TRUE)
      ON CONFLICT DO NOTHING
    `);
    
    console.log('Database initialized successfully!');
  } catch (error) {
    console.error('Database initialization failed:', error);
  } finally {
    await pool.end();
  }
}

initDatabase();