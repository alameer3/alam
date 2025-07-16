#!/usr/bin/env node

/**
 * سكربت اختبار النظام التجريبي
 * للتحقق من سلامة وعمل جميع مكونات ServerData
 */

const fs = require('fs');
const path = require('path');
const config = require('./config.cjs');
const { DatabaseManager } = require('./database-manager.js');

class SystemTester {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      tests: []
    };
    console.log('🧪 بدء اختبار النظام التجريبي...\n');
  }

  async runAllTests() {
    try {
      // اختبارات الملفات الأساسية
      await this.testFileSystem();
      
      // اختبارات قاعدة البيانات
      await this.testDatabase();
      
      // اختبارات الإعدادات
      await this.testConfiguration();
      
      // اختبارات النسخ الاحتياطية
      await this.testBackups();
      
      // عرض النتائج
      this.displayResults();
      
      return this.results.failed === 0;
    } catch (error) {
      console.error('❌ خطأ في اختبار النظام:', error);
      return false;
    }
  }

  async testFileSystem() {
    console.log('📁 اختبار نظام الملفات...');
    
    const requiredFiles = [
      'database.json',
      'database-manager.js',
      'setup.cjs',
      'init-database.cjs',
      'config.cjs',
      'README.md'
    ];

    const requiredDirectories = [
      'images',
      'backups',
      'logs',
      'temp'
    ];

    // اختبار الملفات المطلوبة
    for (const file of requiredFiles) {
      const filePath = path.join(__dirname, file);
      this.test(`وجود الملف: ${file}`, fs.existsSync(filePath));
    }

    // اختبار المجلدات المطلوبة
    for (const dir of requiredDirectories) {
      const dirPath = path.join(__dirname, dir);
      this.test(`وجود المجلد: ${dir}`, fs.existsSync(dirPath));
    }
  }

  async testDatabase() {
    console.log('💾 اختبار قاعدة البيانات...');
    
    const dbManager = new DatabaseManager();
    
    // اختبار تحميل قاعدة البيانات
    const data = dbManager.loadData();
    this.test('تحميل قاعدة البيانات', data !== null);

    // اختبار الجداول المطلوبة
    const requiredTables = [
      'users', 'categories', 'genres', 'content',
      'episodes', 'downloadLinks', 'streamingLinks'
    ];

    for (const table of requiredTables) {
      this.test(`وجود الجدول: ${table}`, Array.isArray(data[table]));
    }

    // اختبار البيانات
    this.test('وجود مستخدمين', data.users && data.users.length > 0);
    this.test('وجود فئات', data.categories && data.categories.length > 0);
    this.test('وجود محتوى', data.content && data.content.length > 0);
    this.test('وجود حلقات', data.episodes && data.episodes.length > 0);
    this.test('وجود روابط تحميل', data.downloadLinks && data.downloadLinks.length > 0);
  }

  async testConfiguration() {
    console.log('⚙️ اختبار الإعدادات...');
    
    this.test('تحميل ملف الإعدادات', config !== null);
    this.test('مسار قاعدة البيانات', config.getDatabasePath() !== null);
    this.test('مسار الصور', config.getImagesPath() !== null);
    this.test('مسار النسخ الاحتياطية', config.getBackupPath() !== null);
    this.test('التحقق من الإعداد', config.isConfigured());
  }

  async testBackups() {
    console.log('💾 اختبار النسخ الاحتياطية...');
    
    const backupDir = config.getBackupPath();
    this.test('وجود مجلد النسخ الاحتياطية', fs.existsSync(backupDir));
    
    // التحقق من وجود نسخ احتياطية
    const backupFiles = fs.readdirSync(backupDir).filter(file => file.endsWith('.json'));
    this.test('وجود نسخ احتياطية', backupFiles.length > 0);
  }

  test(description, condition) {
    if (condition) {
      console.log(`✅ ${description}`);
      this.results.passed++;
    } else {
      console.log(`❌ ${description}`);
      this.results.failed++;
    }
    
    this.results.tests.push({
      description,
      passed: condition
    });
  }

  displayResults() {
    console.log('\n📊 نتائج الاختبارات:');
    console.log(`✅ نجح: ${this.results.passed}`);
    console.log(`❌ فشل: ${this.results.failed}`);
    console.log(`📈 النسبة: ${Math.round((this.results.passed / this.results.tests.length) * 100)}%`);
    
    if (this.results.failed === 0) {
      console.log('\n🎉 جميع الاختبارات نجحت! النظام يعمل بشكل مثالي.');
    } else {
      console.log('\n⚠️ بعض الاختبارات فشلت. يرجى مراجعة المشاكل أعلاه.');
    }
  }
}

// تشغيل الاختبارات
if (require.main === module) {
  const tester = new SystemTester();
  tester.runAllTests().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = SystemTester;