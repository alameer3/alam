/**
 * إعدادات قاعدة البيانات التجريبية
 * ملف التكوين الرئيسي لنظام قاعدة البيانات
 */

const path = require('path');

class DatabaseConfig {
  constructor() {
    this.dataPath = path.join(__dirname, 'database.json');
    this.imagesPath = path.join(__dirname, 'images');
    this.backupPath = path.join(__dirname, 'backups');
    
    // إعدادات النظام
    this.config = {
      // مسارات الملفات
      paths: {
        database: this.dataPath,
        images: this.imagesPath,
        backups: this.backupPath
      },
      
      // إعدادات قاعدة البيانات
      database: {
        autoSave: true,
        backupInterval: 60 * 60 * 1000, // نسخ احتياطي كل ساعة
        maxBackups: 24, // الاحتفاظ بـ 24 نسخة احتياطية
        compression: false
      },
      
      // إعدادات الصور
      images: {
        allowedTypes: ['.svg', '.png', '.jpg', '.jpeg', '.gif', '.webp'],
        maxSize: 10 * 1024 * 1024, // 10MB
        defaultPlaceholder: '/api/placeholder/300/450'
      },
      
      // إعدادات الأمان
      security: {
        enableBackups: true,
        validateData: true,
        sanitizeInput: true
      },
      
      // إعدادات الأداء
      performance: {
        enableIndexing: true,
        cacheResults: true,
        maxCacheSize: 100
      }
    };
  }

  // الحصول على إعدادات معينة
  get(key) {
    return this.config[key];
  }

  // تحديث إعدادات معينة
  set(key, value) {
    this.config[key] = value;
  }

  // الحصول على مسار قاعدة البيانات
  getDatabasePath() {
    return this.dataPath;
  }

  // الحصول على مسار الصور
  getImagesPath() {
    return this.imagesPath;
  }

  // الحصول على مسار النسخ الاحتياطية
  getBackupPath() {
    return this.backupPath;
  }

  // التحقق من أن النظام مُعد بشكل صحيح
  isConfigured() {
    const fs = require('fs');
    return fs.existsSync(this.dataPath) && fs.existsSync(this.imagesPath);
  }
}

// تصدير مثيل واحد (Singleton)
module.exports = new DatabaseConfig();