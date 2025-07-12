import { db } from './server/db.js';

/**
 * سكريبت إنشاء الجداول الجديدة للمحتوى المتطور
 * يتضمن: فريق العمل، الصور الإضافية، التقييمات الخارجية
 */

async function createEnhancedContentTables() {
  console.log("إنشاء الجداول الجديدة للمحتوى المتطور...");

  try {
    // إضافة حقول جديدة لجدول المحتوى
    await db.execute(`
      ALTER TABLE content 
      ADD COLUMN IF NOT EXISTS trailer_url TEXT,
      ADD COLUMN IF NOT EXISTS imdb_id TEXT,
      ADD COLUMN IF NOT EXISTS tmdb_id TEXT,
      ADD COLUMN IF NOT EXISTS rotten_tomatoes_score INTEGER,
      ADD COLUMN IF NOT EXISTS metacritic_score INTEGER,
      ADD COLUMN IF NOT EXISTS country TEXT,
      ADD COLUMN IF NOT EXISTS budget TEXT,
      ADD COLUMN IF NOT EXISTS box_office TEXT,
      ADD COLUMN IF NOT EXISTS awards TEXT;
    `);
    console.log("✅ تم تحديث جدول المحتوى بالحقول الجديدة");

    // إنشاء جدول فريق العمل
    await db.execute(`
      CREATE TABLE IF NOT EXISTS cast_members (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        name_arabic TEXT,
        role TEXT NOT NULL,
        biography TEXT,
        birth_date TEXT,
        nationality TEXT,
        image_url TEXT,
        imdb_id TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `);
    console.log("✅ تم إنشاء جدول فريق العمل");

    // إنشاء جدول ربط المحتوى بفريق العمل
    await db.execute(`
      CREATE TABLE IF NOT EXISTS content_cast (
        id SERIAL PRIMARY KEY,
        content_id INTEGER NOT NULL,
        cast_member_id INTEGER NOT NULL,
        character TEXT,
        "order" INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE CASCADE,
        FOREIGN KEY (cast_member_id) REFERENCES cast_members(id) ON DELETE CASCADE
      );
    `);
    console.log("✅ تم إنشاء جدول ربط المحتوى بفريق العمل");

    // إنشاء جدول الصور الإضافية
    await db.execute(`
      CREATE TABLE IF NOT EXISTS content_images (
        id SERIAL PRIMARY KEY,
        content_id INTEGER NOT NULL,
        image_url TEXT NOT NULL,
        type TEXT NOT NULL, -- poster, backdrop, still, behind_scenes
        description TEXT,
        description_arabic TEXT,
        "order" INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE CASCADE
      );
    `);
    console.log("✅ تم إنشاء جدول الصور الإضافية");

    // إنشاء جدول التقييمات الخارجية
    await db.execute(`
      CREATE TABLE IF NOT EXISTS external_ratings (
        id SERIAL PRIMARY KEY,
        content_id INTEGER NOT NULL,
        source TEXT NOT NULL, -- imdb, rotten_tomatoes, metacritic, etc.
        rating TEXT NOT NULL,
        max_rating TEXT,
        url TEXT,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE CASCADE
      );
    `);
    console.log("✅ تم إنشاء جدول التقييمات الخارجية");

    // إنشاء فهارس لتحسين الأداء
    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_content_cast_content_id ON content_cast(content_id);
      CREATE INDEX IF NOT EXISTS idx_content_cast_member_id ON content_cast(cast_member_id);
      CREATE INDEX IF NOT EXISTS idx_content_images_content_id ON content_images(content_id);
      CREATE INDEX IF NOT EXISTS idx_external_ratings_content_id ON external_ratings(content_id);
      CREATE INDEX IF NOT EXISTS idx_cast_members_role ON cast_members(role);
      CREATE INDEX IF NOT EXISTS idx_content_images_type ON content_images(type);
      CREATE INDEX IF NOT EXISTS idx_external_ratings_source ON external_ratings(source);
    `);
    console.log("✅ تم إنشاء الفهارس للأداء المحسن");

    console.log("🎉 تم إنشاء جميع الجداول الجديدة للمحتوى المتطور بنجاح!");
    return true;

  } catch (error) {
    console.error("❌ خطأ في إنشاء الجداول:", error);
    return false;
  }
}

// تشغيل السكريپت
createEnhancedContentTables().then((success) => {
  if (success) {
    console.log("✅ تم إكمال إعداد قاعدة البيانات المحسنة");
    process.exit(0);
  } else {
    console.error("❌ فشل في إعداد قاعدة البيانات");
    process.exit(1);
  }
});