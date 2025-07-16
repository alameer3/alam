#!/usr/bin/env node

/**
 * سكربت تهيئة قاعدة البيانات التجريبية
 * يتم تشغيله تلقائياً عند بداية تشغيل المشروع في Replit
 */

const fs = require('fs');
const path = require('path');

class DatabaseInitializer {
  constructor() {
    this.dataPath = path.join(__dirname, 'database.json');
    this.imagesPath = path.join(__dirname, 'images');
    console.log('🔧 بدء تهيئة قاعدة البيانات التجريبية...');
  }

  async initialize() {
    try {
      // التحقق من وجود قاعدة البيانات
      if (!fs.existsSync(this.dataPath)) {
        console.log('⚠️  ملف قاعدة البيانات غير موجود، جاري إنشاءه...');
        await this.createDefaultDatabase();
      } else {
        console.log('✅ تم العثور على قاعدة البيانات الموجودة');
      }

      // التحقق من وجود مجلد الصور
      if (!fs.existsSync(this.imagesPath)) {
        console.log('⚠️  مجلد الصور غير موجود، جاري إنشاءه...');
        fs.mkdirSync(this.imagesPath, { recursive: true });
        await this.createDefaultImages();
      } else {
        console.log('✅ تم العثور على مجلد الصور');
      }

      // تحميل البيانات والتحقق من سلامتها
      const data = await this.loadAndValidateData();
      console.log('✅ تم تحميل قاعدة البيانات بنجاح:');
      console.log(`            - المستخدمون: ${data.users?.length || 0}`);
      console.log(`            - الفئات: ${data.categories?.length || 0}`);
      console.log(`            - الأنواع: ${data.genres?.length || 0}`);
      console.log(`            - المحتوى: ${data.content?.length || 0}`);
      console.log(`            - الحلقات: ${data.episodes?.length || 0}`);
      console.log(`            - روابط التحميل: ${data.downloadLinks?.length || 0}`);
      console.log(`            - روابط المشاهدة: ${data.streamingLinks?.length || 0}`);

      console.log('🎉 تم إكمال تهيئة قاعدة البيانات بنجاح!');
      return true;
    } catch (error) {
      console.error('❌ خطأ في تهيئة قاعدة البيانات:', error);
      return false;
    }
  }

  async createDefaultDatabase() {
    const defaultData = {
      users: [
        {
          id: 1,
          username: "admin",
          email: "admin@aksvyemen.com",
          password: "$2a$10$rQB2L6qk5rJ7QZy4A8Qu7.BxVrJ9KXbqXtWHJ1b2jJVvVGZVZnGWG",
          full_name: "مدير الموقع",
          role: "admin",
          is_active: true,
          created_at: "2025-01-15T01:00:00.000Z",
          updated_at: "2025-01-15T01:00:00.000Z"
        }
      ],
      categories: [
        {
          id: 1,
          name: "Arabic",
          name_arabic: "عربي",
          description: "محتوى عربي",
          created_at: "2025-01-15T01:00:00.000Z",
          updated_at: "2025-01-15T01:00:00.000Z"
        },
        {
          id: 2,
          name: "Foreign",
          name_arabic: "أجنبي",
          description: "أفلام ومسلسلات أجنبية",
          created_at: "2025-01-15T01:00:00.000Z",
          updated_at: "2025-01-15T01:00:00.000Z"
        }
      ],
      genres: [
        {
          id: 1,
          name: "Action",
          name_arabic: "أكشن",
          description: "أفلام ومسلسلات الأكشن",
          created_at: "2025-01-15T01:00:00.000Z",
          updated_at: "2025-01-15T01:00:00.000Z"
        },
        {
          id: 2,
          name: "Comedy",
          name_arabic: "كوميديا",
          description: "أفلام ومسلسلات كوميدية",
          created_at: "2025-01-15T01:00:00.000Z",
          updated_at: "2025-01-15T01:00:00.000Z"
        },
        {
          id: 3,
          name: "Drama",
          name_arabic: "دراما",
          description: "أفلام ومسلسلات درامية",
          created_at: "2025-01-15T01:00:00.000Z",
          updated_at: "2025-01-15T01:00:00.000Z"
        }
      ],
      content: [],
      episodes: [],
      downloadLinks: [],
      streamingLinks: [],
      userFavorites: [],
      userWatchHistory: [],
      userComments: [],
      userReviews: [],
      userReviewLikes: []
    };

    fs.writeFileSync(this.dataPath, JSON.stringify(defaultData, null, 2));
  }

  async createDefaultImages() {
    // إنشاء ملف .gitkeep للحفاظ على المجلد
    fs.writeFileSync(path.join(this.imagesPath, '.gitkeep'), '');
  }

  async loadAndValidateData() {
    const data = JSON.parse(fs.readFileSync(this.dataPath, 'utf8'));
    
    // التحقق من وجود الجداول المطلوبة
    const requiredTables = [
      'users', 'categories', 'genres', 'content', 'episodes',
      'downloadLinks', 'streamingLinks', 'userFavorites',
      'userWatchHistory', 'userComments', 'userReviews', 'userReviewLikes'
    ];

    for (const table of requiredTables) {
      if (!data[table]) {
        data[table] = [];
      }
    }

    // حفظ البيانات المحدثة
    fs.writeFileSync(this.dataPath, JSON.stringify(data, null, 2));
    
    return data;
  }
}

// تشغيل المُهيئ
if (require.main === module) {
  const initializer = new DatabaseInitializer();
  initializer.initialize().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = DatabaseInitializer;