/**
 * سكريبت إعداد قاعدة البيانات الشامل
 * يتضمن: إنشاء الجداول، إضافة البيانات، إنشاء الفهارس
 */

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import * as schema from './shared/schema.ts';

// إعداد قاعدة البيانات
const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

console.log('✅ Database URL configured successfully');

async function setupCompleteDatabase() {
  try {
    console.log('🔧 Setting up complete database...');
    
    // إنشاء الجداول الأساسية
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS genres (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS content (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        type VARCHAR(50) NOT NULL,
        poster_url VARCHAR(500),
        backdrop_url VARCHAR(500),
        trailer_url VARCHAR(500),
        imdb_id VARCHAR(100),
        tmdb_id INTEGER,
        release_date DATE,
        duration INTEGER,
        rating DECIMAL(3,1),
        language VARCHAR(10),
        country VARCHAR(100),
        quality VARCHAR(50),
        status VARCHAR(50) DEFAULT 'active',
        view_count INTEGER DEFAULT 0,
        like_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS content_genres (
        content_id INTEGER REFERENCES content(id) ON DELETE CASCADE,
        genre_id INTEGER REFERENCES genres(id) ON DELETE CASCADE,
        PRIMARY KEY (content_id, genre_id)
      )
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS content_categories (
        content_id INTEGER REFERENCES content(id) ON DELETE CASCADE,
        category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
        PRIMARY KEY (content_id, category_id)
      )
    `);

    // إنشاء الجداول المتطورة
    await db.execute(`
      CREATE TABLE IF NOT EXISTS cast_members (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        name_en VARCHAR(255),
        profile_image VARCHAR(500),
        birth_date DATE,
        nationality VARCHAR(100),
        biography TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS content_cast (
        content_id INTEGER REFERENCES content(id) ON DELETE CASCADE,
        cast_member_id INTEGER REFERENCES cast_members(id) ON DELETE CASCADE,
        role VARCHAR(100) NOT NULL,
        character_name VARCHAR(255),
        is_main_cast BOOLEAN DEFAULT FALSE,
        PRIMARY KEY (content_id, cast_member_id, role)
      )
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS content_images (
        id SERIAL PRIMARY KEY,
        content_id INTEGER REFERENCES content(id) ON DELETE CASCADE,
        image_url VARCHAR(500) NOT NULL,
        image_type VARCHAR(50) NOT NULL,
        description_ar TEXT,
        description_en TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS external_ratings (
        id SERIAL PRIMARY KEY,
        content_id INTEGER REFERENCES content(id) ON DELETE CASCADE,
        source VARCHAR(50) NOT NULL,
        rating DECIMAL(3,1) NOT NULL,
        rating_count INTEGER DEFAULT 0,
        url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // إنشاء الفهارس للأداء
    await db.execute(`CREATE INDEX IF NOT EXISTS idx_content_type ON content(type)`);
    await db.execute(`CREATE INDEX IF NOT EXISTS idx_content_status ON content(status)`);
    await db.execute(`CREATE INDEX IF NOT EXISTS idx_content_rating ON content(rating)`);
    await db.execute(`CREATE INDEX IF NOT EXISTS idx_content_release_date ON content(release_date)`);
    await db.execute(`CREATE INDEX IF NOT EXISTS idx_content_genres_content_id ON content_genres(content_id)`);
    await db.execute(`CREATE INDEX IF NOT EXISTS idx_content_categories_content_id ON content_categories(content_id)`);

    console.log('✅ All database tables created successfully');

    // إضافة البيانات الأساسية
    await addBasicData();
    
    console.log('🎉 Database setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    throw error;
  }
}

async function addBasicData() {
  try {
    console.log('📝 Adding basic data...');

    // إضافة المستخدم الإداري
    await db.execute(`
      INSERT INTO users (username, email, password_hash, role) 
      VALUES ('admin', 'admin@yemenflix.com', '$2a$10$hash', 'admin')
      ON CONFLICT (username) DO NOTHING
    `);

    // إضافة الفئات
    const categories = [
      { name: 'عربي', description: 'المحتوى العربي' },
      { name: 'يمني', description: 'المحتوى اليمني' },
      { name: 'أجنبي', description: 'المحتوى الأجنبي' },
      { name: 'هندي', description: 'المحتوى الهندي' },
      { name: 'تركي', description: 'المحتوى التركي' },
      { name: 'كوري', description: 'المحتوى الكوري' },
      { name: 'مصري', description: 'المحتوى المصري' },
      { name: 'خليجي', description: 'المحتوى الخليجي' },
      { name: 'وثائقي', description: 'الأفلام الوثائقية' },
      { name: 'رسوم متحركة', description: 'الرسوم المتحركة' }
    ];

    for (const category of categories) {
      await db.execute(`
        INSERT INTO categories (name, description) 
        VALUES ('${category.name}', '${category.description}')
        ON CONFLICT DO NOTHING
      `);
    }

    // إضافة الأنواع
    const genres = [
      { name: 'أكشن', description: 'أفلام الحركة والإثارة' },
      { name: 'كوميدي', description: 'الأفلام الكوميدية' },
      { name: 'دراما', description: 'الأفلام الدرامية' },
      { name: 'رومانسي', description: 'الأفلام الرومانسية' },
      { name: 'إثارة', description: 'أفلام الإثارة والتشويق' },
      { name: 'رعب', description: 'أفلام الرعب' },
      { name: 'جريمة', description: 'أفلام الجريمة' },
      { name: 'عائلي', description: 'أفلام عائلية' },
      { name: 'تاريخي', description: 'أفلام تاريخية' },
      { name: 'سيرة ذاتية', description: 'أفلام السيرة الذاتية' },
      { name: 'مغامرة', description: 'أفلام المغامرة' },
      { name: 'خيال', description: 'أفلام الخيال' },
      { name: 'خيال علمي', description: 'أفلام الخيال العلمي' },
      { name: 'حروب', description: 'أفلام الحروب' },
      { name: 'موسيقي', description: 'الأفلام الموسيقية' }
    ];

    for (const genre of genres) {
      await db.execute(`
        INSERT INTO genres (name, description) 
        VALUES ('${genre.name}', '${genre.description}')
        ON CONFLICT DO NOTHING
      `);
    }

    // إضافة محتوى تجريبي
    await addSampleContent();

    console.log('✅ Basic data added successfully');

  } catch (error) {
    console.error('❌ Error adding basic data:', error);
    throw error;
  }
}

async function addSampleContent() {
  try {
    console.log('🎬 Adding sample content...');

    const sampleContent = [
      {
        title: 'الرسالة',
        description: 'فيلم عربي تاريخي عن الرسول محمد صلى الله عليه وسلم',
        type: 'movie',
        poster_url: 'https://example.com/poster1.jpg',
        release_date: '1976-01-01',
        duration: 180,
        rating: 8.5,
        language: 'ar',
        country: 'المملكة العربية السعودية',
        quality: 'HD'
      },
      {
        title: 'وجدة',
        description: 'فيلم سعودي عن فتاة صغيرة تحلم بامتلاك دراجة',
        type: 'movie',
        poster_url: 'https://example.com/poster2.jpg',
        release_date: '2012-01-01',
        duration: 98,
        rating: 7.5,
        language: 'ar',
        country: 'المملكة العربية السعودية',
        quality: 'HD'
      },
      {
        title: 'باب الحارة',
        description: 'مسلسل شامي درامي شهير',
        type: 'series',
        poster_url: 'https://example.com/poster3.jpg',
        release_date: '2006-01-01',
        duration: 45,
        rating: 8.0,
        language: 'ar',
        country: 'سوريا',
        quality: 'HD'
      },
      {
        title: 'قيامة أرطغرل',
        description: 'مسلسل تركي تاريخي',
        type: 'series',
        poster_url: 'https://example.com/poster4.jpg',
        release_date: '2014-01-01',
        duration: 120,
        rating: 9.0,
        language: 'tr',
        country: 'تركيا',
        quality: '4K'
      }
    ];

    for (const content of sampleContent) {
      await db.execute(`
        INSERT INTO content (title, description, type, poster_url, release_date, duration, rating, language, country, quality) 
        VALUES ('${content.title}', '${content.description}', '${content.type}', '${content.poster_url}', '${content.release_date}', ${content.duration}, ${content.rating}, '${content.language}', '${content.country}', '${content.quality}')
        ON CONFLICT DO NOTHING
      `);
    }

    console.log('✅ Sample content added successfully');

  } catch (error) {
    console.error('❌ Error adding sample content:', error);
    throw error;
  }
}

// تشغيل السكريبت
if (process.argv[1] === new URL(import.meta.url).pathname) {
  setupCompleteDatabase()
    .then(() => {
      console.log('🎉 Database setup completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Database setup failed:', error);
      process.exit(1);
    });
}

export { setupCompleteDatabase };