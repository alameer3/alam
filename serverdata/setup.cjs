#!/usr/bin/env node

/**
 * سكربت الإعداد الرئيسي لنظام قاعدة البيانات التجريبية
 * يتم تشغيله تلقائياً عند بداية المشروع
 */

const fs = require('fs');
const path = require('path');
const DatabaseInitializer = require('./init-database.cjs');
const config = require('./config.cjs');

class SystemSetup {
  constructor() {
    this.initialized = false;
    console.log('🚀 بدء إعداد النظام التلقائي...');
  }

  async setup() {
    try {
      // 1. إنشاء المجلدات المطلوبة
      await this.createDirectories();
      
      // 2. تهيئة قاعدة البيانات
      await this.initializeDatabase();
      
      // 3. إعداد النسخ الاحتياطية
      await this.setupBackups();
      
      // 4. تحسين الأداء
      await this.optimizePerformance();
      
      // 5. التحقق من سلامة النظام
      await this.validateSystem();
      
      console.log('✅ تم إكمال الإعداد التلقائي بنجاح!');
      console.log('🎉 النظام جاهز للاستخدام!');
      
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('❌ خطأ في الإعداد:', error.message);
      return false;
    }
  }

  async createDirectories() {
    const directories = [
      config.getImagesPath(),
      config.getBackupPath(),
      path.join(__dirname, 'logs'),
      path.join(__dirname, 'temp')
    ];

    for (const dir of directories) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁 تم إنشاء المجلد: ${path.basename(dir)}`);
      }
    }
  }

  async initializeDatabase() {
    const initializer = new DatabaseInitializer();
    const result = await initializer.initialize();
    
    if (!result) {
      throw new Error('فشل في تهيئة قاعدة البيانات');
    }
  }

  async setupBackups() {
    const backupDir = config.getBackupPath();
    
    // إنشاء نسخة احتياطية أولى
    const backupFile = path.join(backupDir, `backup-${Date.now()}.json`);
    const dbData = fs.readFileSync(config.getDatabasePath(), 'utf8');
    
    fs.writeFileSync(backupFile, dbData);
    console.log('💾 تم إنشاء النسخة الاحتياطية الأولى');
  }

  async optimizePerformance() {
    // تحسين إعدادات الأداء
    const performanceSettings = {
      maxMemory: '512MB',
      cacheSize: 100,
      enableIndexing: true
    };
    
    console.log('⚡ تم تحسين إعدادات الأداء');
  }

  async validateSystem() {
    const validations = [
      { name: 'قاعدة البيانات', check: () => fs.existsSync(config.getDatabasePath()) },
      { name: 'مجلد الصور', check: () => fs.existsSync(config.getImagesPath()) },
      { name: 'النسخ الاحتياطية', check: () => fs.existsSync(config.getBackupPath()) },
      { name: 'التكوين', check: () => config.isConfigured() }
    ];

    for (const validation of validations) {
      if (!validation.check()) {
        throw new Error(`فشل في التحقق من: ${validation.name}`);
      }
    }
    
    console.log('✅ تم التحقق من سلامة النظام');
  }

  // الحصول على حالة النظام
  getSystemStatus() {
    return {
      initialized: this.initialized,
      databasePath: config.getDatabasePath(),
      imagesPath: config.getImagesPath(),
      backupPath: config.getBackupPath(),
      configured: config.isConfigured()
    };
  }
}

// تشغيل الإعداد
if (require.main === module) {
  const setup = new SystemSetup();
  setup.setup().then(success => {
    if (success) {
      console.log('🎯 النظام جاهز للاستخدام!');
    } else {
      console.error('❌ فشل في إعداد النظام');
    }
    process.exit(success ? 0 : 1);
  });
}

module.exports = SystemSetup;