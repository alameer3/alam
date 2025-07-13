/**
 * مدير قاعدة البيانات الموحد
 * يتضمن: إعداد، صيانة، نسخ احتياطي، تحسين الأداء
 */

import { neon } from '@neondatabase/serverless';
import { promises as fs } from 'fs';
import { join } from 'path';

const sql = neon(process.env.DATABASE_URL);

class DatabaseManager {
  constructor() {
    this.backupDir = './backups';
    this.isInitialized = false;
  }

  // إنشاء مجلد النسخ الاحتياطي
  async ensureBackupDir() {
    try {
      await fs.mkdir(this.backupDir, { recursive: true });
    } catch (error) {
      if (error.code !== 'EEXIST') {
        throw error;
      }
    }
  }

  // فحص صحة قاعدة البيانات
  async healthCheck() {
    try {
      const start = Date.now();
      await sql`SELECT 1`;
      const duration = Date.now() - start;
      
      return {
        healthy: true,
        responseTime: duration,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        healthy: false,
        error: error.message,
        timestamp: new Date()
      };
    }
  }

  // احصائيات قاعدة البيانات
  async getStats() {
    try {
      const tables = await sql`
        SELECT schemaname, tablename, 
               pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
               pg_total_relation_size(schemaname||'.'||tablename) as size_bytes
        FROM pg_tables 
        WHERE schemaname = 'public'
        ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
      `;

      const totalSize = await sql`
        SELECT pg_size_pretty(pg_database_size(current_database())) as total_size;
      `;

      return {
        tables,
        totalSize: totalSize[0]?.total_size || 'غير متاح',
        tableCount: tables.length,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        error: error.message,
        timestamp: new Date()
      };
    }
  }

  // تحسين الأداء
  async optimizePerformance() {
    try {
      // إعادة فهرسة الجداول
      await sql`REINDEX DATABASE ${sql.unsafe(process.env.PGDATABASE || 'default')};`;
      
      // تحديث الإحصائيات
      await sql`ANALYZE;`;
      
      // تنظيف المساحة المستخدمة
      await sql`VACUUM;`;
      
      return {
        success: true,
        message: 'تم تحسين الأداء بنجاح',
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        timestamp: new Date()
      };
    }
  }

  // إنشاء نسخة احتياطية
  async createBackup() {
    try {
      await this.ensureBackupDir();
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFile = `backup-${timestamp}.sql`;
      const backupPath = join(this.backupDir, backupFile);
      
      // الحصول على جميع الجداول
      const tables = await sql`
        SELECT tablename FROM pg_tables 
        WHERE schemaname = 'public' 
        ORDER BY tablename;
      `;
      
      let backupContent = `-- النسخة الاحتياطية لقاعدة البيانات Yemen Flix\n`;
      backupContent += `-- تاريخ الإنشاء: ${new Date().toISOString()}\n\n`;
      
      // نسخ احتياطي لكل جدول
      for (const table of tables) {
        const tableName = table.tablename;
        
        // الحصول على بنية الجدول
        const columns = await sql`
          SELECT column_name, data_type, is_nullable, column_default
          FROM information_schema.columns 
          WHERE table_name = ${tableName}
          ORDER BY ordinal_position;
        `;
        
        backupContent += `-- جدول ${tableName}\n`;
        backupContent += `DROP TABLE IF EXISTS ${tableName} CASCADE;\n`;
        
        // إنشاء الجدول
        const columnDefs = columns.map(col => {
          let def = `${col.column_name} ${col.data_type}`;
          if (col.is_nullable === 'NO') def += ' NOT NULL';
          if (col.column_default) def += ` DEFAULT ${col.column_default}`;
          return def;
        }).join(',\n  ');
        
        backupContent += `CREATE TABLE ${tableName} (\n  ${columnDefs}\n);\n\n`;
        
        // نسخ البيانات
        const data = await sql`SELECT * FROM ${sql.unsafe(tableName)}`;
        if (data.length > 0) {
          const columnNames = columns.map(col => col.column_name).join(', ');
          backupContent += `INSERT INTO ${tableName} (${columnNames}) VALUES\n`;
          
          const values = data.map(row => {
            const rowValues = columns.map(col => {
              const val = row[col.column_name];
              if (val === null) return 'NULL';
              if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
              if (Array.isArray(val)) return `'${JSON.stringify(val)}'`;
              return val;
            }).join(', ');
            return `(${rowValues})`;
          }).join(',\n');
          
          backupContent += values + ';\n\n';
        }
      }
      
      await fs.writeFile(backupPath, backupContent);
      
      return {
        success: true,
        backupFile: backupFile,
        backupPath: backupPath,
        message: 'تم إنشاء النسخة الاحتياطية بنجاح',
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        timestamp: new Date()
      };
    }
  }

  // استعادة من نسخة احتياطية
  async restoreBackup(backupFile) {
    try {
      const backupPath = join(this.backupDir, backupFile);
      const backupContent = await fs.readFile(backupPath, 'utf8');
      
      // تقسيم الملف إلى استعلامات
      const queries = backupContent
        .split(';')
        .map(q => q.trim())
        .filter(q => q.length > 0 && !q.startsWith('--'));
      
      // تنفيذ الاستعلامات
      for (const query of queries) {
        await sql`${query}`;
      }
      
      return {
        success: true,
        message: 'تم استعادة النسخة الاحتياطية بنجاح',
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        timestamp: new Date()
      };
    }
  }

  // حذف النسخ الاحتياطية القديمة
  async cleanupOldBackups(daysToKeep = 7) {
    try {
      await this.ensureBackupDir();
      
      const files = await fs.readdir(this.backupDir);
      const backupFiles = files.filter(f => f.startsWith('backup-') && f.endsWith('.sql'));
      
      const cutoffDate = new Date(Date.now() - (daysToKeep * 24 * 60 * 60 * 1000));
      let deletedCount = 0;
      
      for (const file of backupFiles) {
        const filePath = join(this.backupDir, file);
        const stats = await fs.stat(filePath);
        
        if (stats.mtime < cutoffDate) {
          await fs.unlink(filePath);
          deletedCount++;
        }
      }
      
      return {
        success: true,
        deletedCount,
        message: `تم حذف ${deletedCount} نسخة احتياطية قديمة`,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        timestamp: new Date()
      };
    }
  }

  // إعادة تعيين قاعدة البيانات
  async resetDatabase() {
    try {
      // إنشاء نسخة احتياطية قبل الحذف
      await this.createBackup();
      
      // حذف جميع الجداول
      await sql`
        DROP SCHEMA public CASCADE;
        CREATE SCHEMA public;
        GRANT ALL ON SCHEMA public TO postgres;
        GRANT ALL ON SCHEMA public TO public;
      `;
      
      return {
        success: true,
        message: 'تم إعادة تعيين قاعدة البيانات بنجاح',
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        timestamp: new Date()
      };
    }
  }

  // إعداد قاعدة بيانات جديدة
  async setupFreshDatabase() {
    try {
      // إنشاء جميع الجداول المطلوبة
      await this.createAllTables();
      
      // إضافة الفهارس
      await this.createIndexes();
      
      // إضافة البيانات الأولية
      await this.seedDatabase();
      
      this.isInitialized = true;
      
      return {
        success: true,
        message: 'تم إعداد قاعدة البيانات الجديدة بنجاح',
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        timestamp: new Date()
      };
    }
  }

  // إنشاء جميع الجداول
  async createAllTables() {
    const tables = {
      // جدول المستخدمين
      users: `
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(255) NOT NULL UNIQUE,
          email VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          first_name VARCHAR(255),
          last_name VARCHAR(255),
          profile_image_url VARCHAR(500),
          is_admin BOOLEAN DEFAULT false NOT NULL,
          is_active BOOLEAN DEFAULT true NOT NULL,
          favorites INTEGER[] DEFAULT '{}',
          watch_history INTEGER[] DEFAULT '{}',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
        );
      `,
      
      // جدول الفئات
      categories: `
        CREATE TABLE IF NOT EXISTS categories (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL UNIQUE,
          name_arabic VARCHAR(255) NOT NULL,
          description TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
        );
      `,
      
      // جدول الأنواع
      genres: `
        CREATE TABLE IF NOT EXISTS genres (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL UNIQUE,
          name_arabic VARCHAR(255) NOT NULL,
          description TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
        );
      `,
      
      // جدول المحتوى
      content: `
        CREATE TABLE IF NOT EXISTS content (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          title_arabic VARCHAR(255) NOT NULL,
          description TEXT,
          description_arabic TEXT,
          type VARCHAR(50) NOT NULL CHECK (type IN ('movie', 'series', 'tv', 'misc')),
          year INTEGER NOT NULL,
          language VARCHAR(50) NOT NULL DEFAULT 'arabic',
          quality VARCHAR(50) NOT NULL DEFAULT 'HD',
          resolution VARCHAR(50) NOT NULL DEFAULT '1080p',
          rating DECIMAL(3,1) DEFAULT 0.0,
          duration INTEGER,
          episodes INTEGER,
          poster_url VARCHAR(500),
          backdrop_url VARCHAR(500),
          video_url VARCHAR(500),
          download_url VARCHAR(500),
          trailer_url VARCHAR(500),
          imdb_id VARCHAR(50),
          tmdb_id INTEGER,
          rotten_tomatoes_score INTEGER,
          metacritic_score INTEGER,
          country VARCHAR(100) DEFAULT 'Yemen',
          budget VARCHAR(100),
          box_office VARCHAR(100),
          awards TEXT,
          status VARCHAR(50) DEFAULT 'active',
          view_count INTEGER DEFAULT 0,
          like_count INTEGER DEFAULT 0,
          is_active BOOLEAN DEFAULT true NOT NULL,
          release_date DATE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
        );
      `,
      
      // باقي الجداول
      content_genres: `
        CREATE TABLE IF NOT EXISTS content_genres (
          id SERIAL PRIMARY KEY,
          content_id INTEGER NOT NULL REFERENCES content(id) ON DELETE CASCADE,
          genre_id INTEGER NOT NULL REFERENCES genres(id) ON DELETE CASCADE,
          UNIQUE(content_id, genre_id)
        );
      `,
      
      content_categories: `
        CREATE TABLE IF NOT EXISTS content_categories (
          id SERIAL PRIMARY KEY,
          content_id INTEGER NOT NULL REFERENCES content(id) ON DELETE CASCADE,
          category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
          UNIQUE(content_id, category_id)
        );
      `,
      
      user_comments: `
        CREATE TABLE IF NOT EXISTS user_comments (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          content_id INTEGER NOT NULL REFERENCES content(id) ON DELETE CASCADE,
          comment TEXT NOT NULL,
          parent_id INTEGER REFERENCES user_comments(id) ON DELETE CASCADE,
          is_active BOOLEAN DEFAULT true NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
        );
      `,
      
      user_reviews: `
        CREATE TABLE IF NOT EXISTS user_reviews (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          content_id INTEGER NOT NULL REFERENCES content(id) ON DELETE CASCADE,
          rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
          title VARCHAR(255) NOT NULL,
          review TEXT NOT NULL,
          likes INTEGER DEFAULT 0 NOT NULL,
          dislikes INTEGER DEFAULT 0 NOT NULL,
          is_active BOOLEAN DEFAULT true NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
          UNIQUE(user_id, content_id)
        );
      `,
      
      cast_members: `
        CREATE TABLE IF NOT EXISTS cast_members (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          name_arabic VARCHAR(255),
          biography TEXT,
          biography_arabic TEXT,
          birth_date DATE,
          nationality VARCHAR(100),
          image_url VARCHAR(500),
          imdb_id VARCHAR(50),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
        );
      `,
      
      content_cast: `
        CREATE TABLE IF NOT EXISTS content_cast (
          id SERIAL PRIMARY KEY,
          content_id INTEGER NOT NULL REFERENCES content(id) ON DELETE CASCADE,
          cast_member_id INTEGER NOT NULL REFERENCES cast_members(id) ON DELETE CASCADE,
          role VARCHAR(100) NOT NULL,
          character_name VARCHAR(255),
          character_name_arabic VARCHAR(255),
          order_index INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
        );
      `,
      
      content_images: `
        CREATE TABLE IF NOT EXISTS content_images (
          id SERIAL PRIMARY KEY,
          content_id INTEGER NOT NULL REFERENCES content(id) ON DELETE CASCADE,
          image_url VARCHAR(500) NOT NULL,
          image_type VARCHAR(50) NOT NULL CHECK (image_type IN ('poster', 'backdrop', 'still', 'behind_scenes')),
          description TEXT,
          description_arabic TEXT,
          order_index INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
        );
      `,
      
      external_ratings: `
        CREATE TABLE IF NOT EXISTS external_ratings (
          id SERIAL PRIMARY KEY,
          content_id INTEGER NOT NULL REFERENCES content(id) ON DELETE CASCADE,
          source VARCHAR(50) NOT NULL CHECK (source IN ('imdb', 'rotten_tomatoes', 'metacritic', 'tmdb')),
          rating VARCHAR(20) NOT NULL,
          max_rating VARCHAR(20),
          url VARCHAR(500),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
          UNIQUE(content_id, source)
        );
      `
    };
    
    // إنشاء الجداول
    for (const [tableName, createQuery] of Object.entries(tables)) {
      await sql`${createQuery}`;
    }
  }

  // إنشاء الفهارس
  async createIndexes() {
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)',
      'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)',
      'CREATE INDEX IF NOT EXISTS idx_users_is_admin ON users(is_admin)',
      'CREATE INDEX IF NOT EXISTS idx_content_type ON content(type)',
      'CREATE INDEX IF NOT EXISTS idx_content_year ON content(year)',
      'CREATE INDEX IF NOT EXISTS idx_content_language ON content(language)',
      'CREATE INDEX IF NOT EXISTS idx_content_quality ON content(quality)',
      'CREATE INDEX IF NOT EXISTS idx_content_rating ON content(rating)',
      'CREATE INDEX IF NOT EXISTS idx_content_is_active ON content(is_active)',
      'CREATE INDEX IF NOT EXISTS idx_content_genres_content ON content_genres(content_id)',
      'CREATE INDEX IF NOT EXISTS idx_content_categories_content ON content_categories(content_id)',
      'CREATE INDEX IF NOT EXISTS idx_user_comments_content ON user_comments(content_id)',
      'CREATE INDEX IF NOT EXISTS idx_user_reviews_content ON user_reviews(content_id)',
      'CREATE INDEX IF NOT EXISTS idx_content_cast_content ON content_cast(content_id)',
      'CREATE INDEX IF NOT EXISTS idx_content_images_content ON content_images(content_id)',
      'CREATE INDEX IF NOT EXISTS idx_external_ratings_content ON external_ratings(content_id)'
    ];
    
    for (const indexQuery of indexes) {
      await sql`${indexQuery}`;
    }
  }

  // إضافة البيانات الأولية
  async seedDatabase() {
    // إضافة مستخدم إداري
    await sql`
      INSERT INTO users (username, email, password, first_name, last_name, is_admin, is_active)
      VALUES ('admin', 'admin@yemenflix.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'User', true, true)
      ON CONFLICT (username) DO NOTHING;
    `;

    // إضافة الفئات الأساسية
    const categories = [
      { name: 'Arabic', name_arabic: 'عربي' },
      { name: 'Yemeni', name_arabic: 'يمني' },
      { name: 'Foreign', name_arabic: 'أجنبي' },
      { name: 'Hindi', name_arabic: 'هندي' },
      { name: 'Turkish', name_arabic: 'تركي' },
      { name: 'Korean', name_arabic: 'كوري' },
      { name: 'Egyptian', name_arabic: 'مصري' },
      { name: 'Gulf', name_arabic: 'خليجي' },
      { name: 'Documentary', name_arabic: 'وثائقي' },
      { name: 'Animation', name_arabic: 'رسوم متحركة' }
    ];

    for (const category of categories) {
      await sql`
        INSERT INTO categories (name, name_arabic, description)
        VALUES (${category.name}, ${category.name_arabic}, ${category.name_arabic})
        ON CONFLICT (name) DO UPDATE SET name_arabic = ${category.name_arabic};
      `;
    }

    // إضافة الأنواع الأساسية
    const genres = [
      { name: 'Action', name_arabic: 'أكشن' },
      { name: 'Comedy', name_arabic: 'كوميدي' },
      { name: 'Drama', name_arabic: 'دراما' },
      { name: 'Romance', name_arabic: 'رومانسي' },
      { name: 'Thriller', name_arabic: 'إثارة' },
      { name: 'Horror', name_arabic: 'رعب' },
      { name: 'Crime', name_arabic: 'جريمة' },
      { name: 'Family', name_arabic: 'عائلي' },
      { name: 'Historical', name_arabic: 'تاريخي' },
      { name: 'Biography', name_arabic: 'سيرة ذاتية' },
      { name: 'Adventure', name_arabic: 'مغامرة' },
      { name: 'Fantasy', name_arabic: 'خيال' },
      { name: 'Sci-Fi', name_arabic: 'خيال علمي' },
      { name: 'War', name_arabic: 'حروب' },
      { name: 'Musical', name_arabic: 'موسيقي' }
    ];

    for (const genre of genres) {
      await sql`
        INSERT INTO genres (name, name_arabic, description)
        VALUES (${genre.name}, ${genre.name_arabic}, ${genre.name_arabic})
        ON CONFLICT (name) DO UPDATE SET name_arabic = ${genre.name_arabic};
      `;
    }
  }
}

// تشغيل الإدارة
const dbManager = new DatabaseManager();

// تصدير الوظائف
export { dbManager, DatabaseManager };

// إذا تم تشغيل الملف مباشرة
if (import.meta.url === `file://${process.argv[1]}`) {
  dbManager.setupFreshDatabase()
    .then(result => {
      console.log('✅ Database setup completed:', result);
    })
    .catch(error => {
      console.error('❌ Database setup failed:', error);
    });
}