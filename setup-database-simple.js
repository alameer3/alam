import { Pool } from '@neondatabase/serverless';
import ws from 'ws';

// Configure websocket for Neon
if (typeof WebSocket === 'undefined') {
  global.WebSocket = ws;
}

// Clean up the DATABASE_URL if it's wrapped in psql format
let databaseUrl = process.env.DATABASE_URL;
if (databaseUrl.startsWith("psql '") && databaseUrl.endsWith("'")) {
  databaseUrl = databaseUrl.slice(6, -1); // Remove "psql '" from start and "'" from end
} else if (databaseUrl.startsWith("psql ")) {
  databaseUrl = databaseUrl.slice(5);
}

// Decode URL if it's encoded
try {
  databaseUrl = decodeURIComponent(databaseUrl);
} catch (e) {
  // If decode fails, use as is
}

console.log('Using database URL format...');
const pool = new Pool({ connectionString: databaseUrl });

async function setupDatabase() {
  try {
    console.log('🔧 Setting up database...');
    
    // Create tables if they don't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" serial PRIMARY KEY NOT NULL,
        "username" varchar(50) NOT NULL UNIQUE,
        "email" varchar(100) NOT NULL UNIQUE,
        "password" varchar(255) NOT NULL,
        "role" varchar(20) DEFAULT 'user' NOT NULL,
        "isActive" boolean DEFAULT true NOT NULL,
        "createdAt" timestamp DEFAULT now() NOT NULL,
        "updatedAt" timestamp DEFAULT now() NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS "categories" (
        "id" serial PRIMARY KEY NOT NULL,
        "name" varchar(50) NOT NULL UNIQUE,
        "nameArabic" varchar(50) NOT NULL,
        "description" text,
        "isActive" boolean DEFAULT true NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS "genres" (
        "id" serial PRIMARY KEY NOT NULL,
        "name" varchar(50) NOT NULL UNIQUE,
        "nameArabic" varchar(50) NOT NULL,
        "description" text,
        "isActive" boolean DEFAULT true NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS "content" (
        "id" serial PRIMARY KEY NOT NULL,
        "title" varchar(255) NOT NULL,
        "titleArabic" varchar(255),
        "description" text,
        "descriptionArabic" text,
        "type" varchar(20) NOT NULL,
        "year" integer,
        "language" varchar(50),
        "quality" varchar(20),
        "resolution" varchar(20),
        "rating" varchar(10),
        "duration" integer DEFAULT 0,
        "episodes" integer DEFAULT 0,
        "posterUrl" text,
        "videoUrl" text,
        "downloadUrl" text,
        "isActive" boolean DEFAULT true NOT NULL,
        "createdAt" timestamp DEFAULT now() NOT NULL,
        "updatedAt" timestamp DEFAULT now() NOT NULL
      );
    `);

    // Add admin user
    await pool.query(`
      INSERT INTO "users" (username, email, password, role) 
      VALUES ('admin', 'admin@yemenflix.com', '$2a$10$xBKnZkPZjE.PxYQKu8rTDOWx8Y8iy8rYYn9xXkKvHHMx7YQz8YQz8Y', 'admin')
      ON CONFLICT (username) DO NOTHING;
    `);

    // Add sample categories
    const categories = [
      ['arabic', 'عربي', 'محتوى عربي'],
      ['yemeni', 'يمني', 'محتوى يمني'],
      ['foreign', 'أجنبي', 'محتوى أجنبي'],
      ['hindi', 'هندي', 'محتوى هندي'],
      ['turkish', 'تركي', 'محتوى تركي'],
      ['korean', 'كوري', 'محتوى كوري']
    ];

    for (const [name, nameArabic, description] of categories) {
      await pool.query(`
        INSERT INTO "categories" (name, "nameArabic", description) 
        VALUES ($1, $2, $3)
        ON CONFLICT (name) DO NOTHING;
      `, [name, nameArabic, description]);
    }

    // Add sample genres
    const genres = [
      ['action', 'أكشن', 'أفلام ومسلسلات الأكشن'],
      ['comedy', 'كوميدي', 'أفلام ومسلسلات كوميدية'],
      ['drama', 'دراما', 'أفلام ومسلسلات درامية'],
      ['romance', 'رومانسي', 'أفلام ومسلسلات رومانسية'],
      ['thriller', 'إثارة', 'أفلام ومسلسلات الإثارة'],
      ['horror', 'رعب', 'أفلام ومسلسلات الرعب'],
      ['documentary', 'وثائقي', 'أفلام وثائقية'],
      ['animation', 'أنيميشن', 'أفلام ومسلسلات الرسوم المتحركة']
    ];

    for (const [name, nameArabic, description] of genres) {
      await pool.query(`
        INSERT INTO "genres" (name, "nameArabic", description) 
        VALUES ($1, $2, $3)
        ON CONFLICT (name) DO NOTHING;
      `, [name, nameArabic, description]);
    }

    // Add sample content
    const sampleContent = [
      {
        title: 'الرسالة',
        titleArabic: 'الرسالة',
        description: 'فيلم يحكي قصة الرسول محمد صلى الله عليه وسلم',
        descriptionArabic: 'فيلم يحكي قصة الرسول محمد صلى الله عليه وسلم',
        type: 'movie',
        year: 1976,
        language: 'Arabic',
        quality: 'HD',
        resolution: '1080p',
        rating: '8.5',
        duration: 177,
        episodes: 0,
        posterUrl: 'https://images.unsplash.com/photo-1489599088293-daa0c0f60f0e?w=400&h=600&fit=crop'
      },
      {
        title: 'باب الحارة',
        titleArabic: 'باب الحارة',
        description: 'مسلسل سوري شامي يحكي عن الحياة في دمشق القديمة',
        descriptionArabic: 'مسلسل سوري شامي يحكي عن الحياة في دمشق القديمة',
        type: 'series',
        year: 2006,
        language: 'Arabic',
        quality: 'HD',
        resolution: '720p',
        rating: '9.0',
        duration: 0,
        episodes: 30,
        posterUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop'
      },
      {
        title: 'Inception',
        titleArabic: 'البداية',
        description: 'A thief who steals corporate secrets through dream-sharing technology',
        descriptionArabic: 'لص يسرق أسرار الشركات من خلال تقنية مشاركة الأحلام',
        type: 'movie',
        year: 2010,
        language: 'English',
        quality: 'HD',
        resolution: '1080p',
        rating: '8.8',
        duration: 148,
        episodes: 0,
        posterUrl: 'https://images.unsplash.com/photo-1478720568477-b0e6617e1943?w=400&h=600&fit=crop'
      }
    ];

    for (const content of sampleContent) {
      await pool.query(`
        INSERT INTO "content" (
          title, "titleArabic", description, "descriptionArabic", 
          type, year, language, quality, resolution, rating, 
          duration, episodes, "posterUrl"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        ON CONFLICT DO NOTHING;
      `, [
        content.title, content.titleArabic, content.description, 
        content.descriptionArabic, content.type, content.year, 
        content.language, content.quality, content.resolution, 
        content.rating, content.duration, content.episodes, content.posterUrl
      ]);
    }

    console.log('✅ Database setup completed successfully!');
    console.log('✅ Added sample users, categories, genres, and content');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
  } finally {
    await pool.end();
  }
}

setupDatabase();