#!/usr/bin/env node
/**
 * نظام إدارة قاعدة البيانات - مشروع YEMEN 🇾🇪 FLIX
 * يحافظ على قاعدة البيانات ويستعيدها تلقائياً
 */

const { Pool } = require('@neondatabase/serverless');
const fs = require('fs');

class DatabaseSetupManager {
  constructor() {
    this.pool = new Pool({ connectionString: process.env.DATABASE_URL });
    this.setupFile = '.database-setup.json';
  }

  // إعداد قاعدة البيانات الكاملة
  async setupDatabase() {
    console.log('🔧 بدء إعداد قاعدة البيانات...');
    
    try {
      // فحص الاتصال
      const client = await this.pool.connect();
      console.log('✅ الاتصال بقاعدة البيانات نجح');

      // إنشاء الجداول
      await this.createTables(client);
      
      // إضافة البيانات الأولية
      await this.seedInitialData(client);
      
      // إنشاء الفهارس
      await this.createIndexes(client);
      
      client.release();
      
      // حفظ حالة الإعداد
      this.saveSetupState({
        setupComplete: true,
        lastSetup: new Date().toISOString(),
        version: '2.0.0'
      });
      
      console.log('🎉 تم إعداد قاعدة البيانات بنجاح!');
      return true;
    } catch (error) {
      console.error('❌ خطأ في إعداد قاعدة البيانات:', error.message);
      return false;
    }
  }

  // إنشاء الجداول
  async createTables(client) {
    console.log('📊 إنشاء الجداول...');
    
    const tables = [
      // جدول المستخدمين
      `CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        first_name TEXT,
        last_name TEXT,
        profile_image_url TEXT,
        is_admin BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        favorites INTEGER[] DEFAULT '{}',
        watch_history INTEGER[] DEFAULT '{}',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )`,
      
      // جدول الفئات
      `CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        name_arabic TEXT NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )`,
      
      // جدول الأنواع
      `CREATE TABLE IF NOT EXISTS genres (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        name_arabic TEXT NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )`,
      
      // جدول المحتوى
      `CREATE TABLE IF NOT EXISTS content (
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
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )`,
      
      // جدول ربط المحتوى بالأنواع
      `CREATE TABLE IF NOT EXISTS content_genres (
        id SERIAL PRIMARY KEY,
        content_id INTEGER NOT NULL,
        genre_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY (content_id) REFERENCES content(id),
        FOREIGN KEY (genre_id) REFERENCES genres(id)
      )`,
      
      // جدول ربط المحتوى بالفئات
      `CREATE TABLE IF NOT EXISTS content_categories (
        id SERIAL PRIMARY KEY,
        content_id INTEGER NOT NULL,
        category_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY (content_id) REFERENCES content(id),
        FOREIGN KEY (category_id) REFERENCES categories(id)
      )`,
      
      // جدول فريق العمل
      `CREATE TABLE IF NOT EXISTS cast_members (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        name_arabic TEXT,
        role TEXT NOT NULL,
        imdb_id TEXT,
        biography TEXT,
        birth_date TEXT,
        nationality TEXT,
        image_url TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )`,
      
      // جدول ربط المحتوى بفريق العمل
      `CREATE TABLE IF NOT EXISTS content_cast (
        id SERIAL PRIMARY KEY,
        content_id INTEGER NOT NULL,
        cast_member_id INTEGER NOT NULL,
        character TEXT,
        "order" INTEGER,
        created_at TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY (content_id) REFERENCES content(id),
        FOREIGN KEY (cast_member_id) REFERENCES cast_members(id)
      )`,
      
      // جدول الصور الإضافية
      `CREATE TABLE IF NOT EXISTS content_images (
        id SERIAL PRIMARY KEY,
        content_id INTEGER NOT NULL,
        image_url TEXT NOT NULL,
        type TEXT NOT NULL,
        description TEXT,
        description_arabic TEXT,
        "order" INTEGER,
        created_at TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY (content_id) REFERENCES content(id)
      )`,
      
      // جدول التقييمات الخارجية
      `CREATE TABLE IF NOT EXISTS external_ratings (
        id SERIAL PRIMARY KEY,
        content_id INTEGER NOT NULL,
        source TEXT NOT NULL,
        rating TEXT NOT NULL,
        max_rating TEXT,
        url TEXT,
        last_updated TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY (content_id) REFERENCES content(id)
      )`,
      
      // جدول المفضلة
      `CREATE TABLE IF NOT EXISTS user_favorites (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        content_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (content_id) REFERENCES content(id),
        UNIQUE(user_id, content_id)
      )`,
      
      // جدول سجل المشاهدة
      `CREATE TABLE IF NOT EXISTS user_watch_history (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        content_id INTEGER NOT NULL,
        progress_minutes INTEGER DEFAULT 0,
        last_watched TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (content_id) REFERENCES content(id),
        UNIQUE(user_id, content_id)
      )`,
      
      // جدول التعليقات
      `CREATE TABLE IF NOT EXISTS user_comments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        content_id INTEGER NOT NULL,
        comment TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (content_id) REFERENCES content(id)
      )`,
      
      // جدول المراجعات
      `CREATE TABLE IF NOT EXISTS user_reviews (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        content_id INTEGER NOT NULL,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        review TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (content_id) REFERENCES content(id),
        UNIQUE(user_id, content_id)
      )`,
      
      // جدول إعجابات المراجعات
      `CREATE TABLE IF NOT EXISTS review_likes (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        review_id INTEGER NOT NULL,
        is_like BOOLEAN NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (review_id) REFERENCES user_reviews(id),
        UNIQUE(user_id, review_id)
      )`
    ];

    for (const table of tables) {
      await client.query(table);
    }
    
    console.log('✅ تم إنشاء جميع الجداول');
  }

  // إضافة البيانات الأولية
  async seedInitialData(client) {
    console.log('🌱 إضافة البيانات الأولية...');
    
    // إضافة المستخدم الإداري
    await client.query(`
      INSERT INTO users (username, email, password, first_name, last_name, is_admin, is_active)
      VALUES ('admin', 'admin@yemenflix.com', '$2b$10$hash', 'مدير', 'المنصة', TRUE, TRUE)
      ON CONFLICT (username) DO NOTHING
    `);
    
    // إضافة الفئات
    const categories = [
      ['arabic', 'محتوى عربي', 'الأفلام والمسلسلات العربية'],
      ['yemeni', 'محتوى يمني', 'الأفلام والمسلسلات اليمنية'],
      ['foreign', 'محتوى أجنبي', 'الأفلام والمسلسلات الأجنبية'],
      ['indian', 'محتوى هندي', 'الأفلام والمسلسلات الهندية'],
      ['turkish', 'محتوى تركي', 'الأفلام والمسلسلات التركية'],
      ['korean', 'محتوى كوري', 'الأفلام والمسلسلات الكورية'],
      ['egyptian', 'محتوى مصري', 'الأفلام والمسلسلات المصرية'],
      ['gulf', 'محتوى خليجي', 'الأفلام والمسلسلات الخليجية'],
      ['documentary', 'وثائقي', 'الأفلام الوثائقية'],
      ['animation', 'رسوم متحركة', 'أفلام الرسوم المتحركة']
    ];
    
    for (const [name, nameArabic, description] of categories) {
      await client.query(`
        INSERT INTO categories (name, name_arabic, description)
        VALUES ($1, $2, $3)
        ON CONFLICT DO NOTHING
      `, [name, nameArabic, description]);
    }
    
    // إضافة الأنواع
    const genres = [
      ['action', 'أكشن', 'أفلام الأكشن والحركة'],
      ['comedy', 'كوميدي', 'الأفلام الكوميدية'],
      ['drama', 'دراما', 'الأفلام الدرامية'],
      ['romance', 'رومانسي', 'الأفلام الرومانسية'],
      ['thriller', 'إثارة', 'أفلام الإثارة والتشويق'],
      ['horror', 'رعب', 'أفلام الرعب'],
      ['crime', 'جريمة', 'أفلام الجريمة'],
      ['family', 'عائلي', 'الأفلام العائلية'],
      ['historical', 'تاريخي', 'الأفلام التاريخية'],
      ['biography', 'سيرة ذاتية', 'الأفلام الوثائقية'],
      ['adventure', 'مغامرة', 'أفلام المغامرة'],
      ['fantasy', 'خيال', 'أفلام الخيال'],
      ['sci-fi', 'خيال علمي', 'أفلام الخيال العلمي'],
      ['war', 'حروب', 'أفلام الحرب'],
      ['musical', 'موسيقي', 'الأفلام الموسيقية']
    ];
    
    for (const [name, nameArabic, description] of genres) {
      await client.query(`
        INSERT INTO genres (name, name_arabic, description)
        VALUES ($1, $2, $3)
        ON CONFLICT DO NOTHING
      `, [name, nameArabic, description]);
    }
    
    console.log('✅ تم إضافة البيانات الأولية');
  }

  // إنشاء الفهارس
  async createIndexes(client) {
    console.log('🔍 إنشاء الفهارس...');
    
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_content_type ON content(type)',
      'CREATE INDEX IF NOT EXISTS idx_content_year ON content(year)',
      'CREATE INDEX IF NOT EXISTS idx_content_language ON content(language)',
      'CREATE INDEX IF NOT EXISTS idx_content_rating ON content(rating)',
      'CREATE INDEX IF NOT EXISTS idx_content_is_active ON content(is_active)',
      'CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id)',
      'CREATE INDEX IF NOT EXISTS idx_user_watch_history_user_id ON user_watch_history(user_id)',
      'CREATE INDEX IF NOT EXISTS idx_content_genres_content_id ON content_genres(content_id)',
      'CREATE INDEX IF NOT EXISTS idx_content_categories_content_id ON content_categories(content_id)',
      'CREATE INDEX IF NOT EXISTS idx_user_reviews_content_id ON user_reviews(content_id)',
      'CREATE INDEX IF NOT EXISTS idx_user_comments_content_id ON user_comments(content_id)'
    ];

    for (const index of indexes) {
      try {
        await client.query(index);
      } catch (error) {
        console.log(`تحذير: ${error.message}`);
      }
    }
    
    console.log('✅ تم إنشاء الفهارس');
  }

  // حفظ حالة الإعداد
  saveSetupState(state) {
    fs.writeFileSync(this.setupFile, JSON.stringify(state, null, 2));
  }

  // فحص حالة الإعداد
  checkSetupState() {
    if (fs.existsSync(this.setupFile)) {
      try {
        return JSON.parse(fs.readFileSync(this.setupFile, 'utf8'));
      } catch (error) {
        return null;
      }
    }
    return null;
  }

  // استعادة قاعدة البيانات
  async restoreDatabase() {
    const state = this.checkSetupState();
    
    if (state && state.setupComplete) {
      console.log('✅ قاعدة البيانات مُعدّة مسبقاً');
      return true;
    }
    
    console.log('🔄 إعادة إعداد قاعدة البيانات...');
    return await this.setupDatabase();
  }
}

// تشغيل النظام
if (require.main === module) {
  async function main() {
    const manager = new DatabaseSetupManager();
    
    const command = process.argv[2];
    
    switch (command) {
      case 'setup':
        await manager.setupDatabase();
        break;
        
      case 'restore':
        await manager.restoreDatabase();
        break;
        
      case 'check':
        const state = manager.checkSetupState();
        console.log(state ? 'قاعدة البيانات مُعدّة' : 'قاعدة البيانات غير مُعدّة');
        break;
        
      default:
        console.log('الأوامر المتاحة:');
        console.log('  setup - إعداد قاعدة البيانات');
        console.log('  restore - استعادة قاعدة البيانات');
        console.log('  check - فحص حالة الإعداد');
        break;
    }
  }
  
  main().catch(console.error);
}

module.exports = DatabaseSetupManager;