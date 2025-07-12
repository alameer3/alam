import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

async function createSchema() {
  try {
    console.log('Creating database schema...');
    
    // إنشاء جدول المستخدمين
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        first_name TEXT,
        last_name TEXT,
        profile_image_url TEXT,
        is_admin BOOLEAN DEFAULT false NOT NULL,
        "isActive" BOOLEAN DEFAULT true NOT NULL,
        favorites INTEGER[] DEFAULT '{}',
        watch_history INTEGER[] DEFAULT '{}',
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    // إنشاء جدول الفئات
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        name_arabic TEXT NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    // إنشاء جدول الأنواع
    await pool.query(`
      CREATE TABLE IF NOT EXISTS genres (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        name_arabic TEXT NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    // إنشاء جدول المحتوى
    await pool.query(`
      CREATE TABLE IF NOT EXISTS content (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        title_arabic TEXT NOT NULL,
        description TEXT,
        description_arabic TEXT,
        type TEXT NOT NULL,
        year INTEGER NOT NULL,
        language TEXT NOT NULL,
        quality TEXT NOT NULL,
        resolution TEXT NOT NULL,
        rating DECIMAL(3,1) DEFAULT 0.0,
        duration INTEGER,
        episodes INTEGER,
        poster_url TEXT,
        video_url TEXT,
        download_url TEXT,
        trailer_url TEXT,
        imdb_id TEXT,
        tmdb_id TEXT,
        rotten_tomatoes_score INTEGER,
        metacritic_score INTEGER,
        country TEXT,
        budget TEXT,
        box_office TEXT,
        awards TEXT,
        "isActive" BOOLEAN DEFAULT true NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    // إنشاء جداول الربط
    await pool.query(`
      CREATE TABLE IF NOT EXISTS content_genres (
        id SERIAL PRIMARY KEY,
        content_id INTEGER NOT NULL,
        genre_id INTEGER NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS content_categories (
        id SERIAL PRIMARY KEY,
        content_id INTEGER NOT NULL,
        category_id INTEGER NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_ratings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        content_id INTEGER NOT NULL,
        rating INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_comments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        content_id INTEGER NOT NULL,
        comment TEXT NOT NULL,
        parent_id INTEGER,
        "isActive" BOOLEAN DEFAULT true NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_reviews (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        content_id INTEGER NOT NULL,
        rating INTEGER NOT NULL,
        title TEXT NOT NULL,
        review TEXT NOT NULL,
        likes INTEGER DEFAULT 0 NOT NULL,
        dislikes INTEGER DEFAULT 0 NOT NULL,
        "isActive" BOOLEAN DEFAULT true NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS review_likes (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        review_id INTEGER NOT NULL,
        is_like BOOLEAN NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_favorites (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        content_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_watch_history (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        content_id INTEGER NOT NULL,
        progress_minutes INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    console.log('✅ Database schema created successfully!');
    
    // إضافة مستخدم إداري
    await pool.query(`
      INSERT INTO users (username, email, password, first_name, last_name, is_admin) 
      VALUES ('admin', 'admin@yemenflix.com', '$2b$10$K8YGJ3cQ1vE3Lh/HqY9O7.mK8nJdQ1vE3Lh/HqY9O7.mK8nJdQ1vE3L', 'مدير', 'النظام', true)
      ON CONFLICT (username) DO NOTHING;
    `);

    // إضافة فئات
    const categories = [
      ['arabic', 'محتوى عربي'],
      ['foreign', 'محتوى أجنبي'],
      ['indian', 'محتوى هندي'],
      ['turkish', 'محتوى تركي'],
      ['korean', 'محتوى كوري'],
      ['egyptian', 'محتوى مصري'],
      ['gulf', 'محتوى خليجي'],
      ['documentary', 'وثائقي'],
      ['animation', 'رسوم متحركة'],
      ['yemeni', 'محتوى يمني']
    ];

    for (const [name, nameArabic] of categories) {
      await pool.query(`
        INSERT INTO categories (name, name_arabic) 
        VALUES ($1, $2) 
        ON CONFLICT DO NOTHING;
      `, [name, nameArabic]);
    }

    // إضافة أنواع
    const genres = [
      ['action', 'أكشن'],
      ['comedy', 'كوميدي'],
      ['drama', 'دراما'],
      ['romance', 'رومانسي'],
      ['thriller', 'إثارة'],
      ['horror', 'رعب'],
      ['crime', 'جريمة'],
      ['family', 'عائلي'],
      ['historical', 'تاريخي'],
      ['biography', 'سيرة ذاتية'],
      ['adventure', 'مغامرة'],
      ['fantasy', 'خيال'],
      ['sci-fi', 'خيال علمي'],
      ['war', 'حروب'],
      ['musical', 'موسيقي']
    ];

    for (const [name, nameArabic] of genres) {
      await pool.query(`
        INSERT INTO genres (name, name_arabic) 
        VALUES ($1, $2) 
        ON CONFLICT DO NOTHING;
      `, [name, nameArabic]);
    }

    console.log('✅ Sample data added successfully!');
    
  } catch (error) {
    console.error('Database schema creation failed:', error);
  } finally {
    await pool.end();
  }
}

createSchema();