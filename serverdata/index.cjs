/**
 * نقطة الدخول الرئيسية لنظام ServerData
 * ملف مساعد لتسهيل الاستيراد والاستخدام
 */

const DatabaseManager = require('./database-manager');
const config = require('./config');
const SystemSetup = require('./setup');

// تصدير الوحدات الرئيسية
module.exports = {
  DatabaseManager,
  config,
  SystemSetup,
  
  // اختصارات مفيدة
  dbManager: new DatabaseManager(),
  
  // دوال مساعدة
  async initialize() {
    const setup = new SystemSetup();
    return await setup.setup();
  },
  
  getConfig() {
    return config;
  },
  
  isReady() {
    return config.isConfigured();
  }
};

// تشغيل التهيئة التلقائية عند الاستيراد
if (require.main === module) {
  console.log('🔧 تشغيل ServerData من الملف الرئيسي...');
  const { initialize } = module.exports;
  initialize().then(success => {
    if (success) {
      console.log('✅ تم تهيئة ServerData بنجاح');
    } else {
      console.error('❌ فشل في تهيئة ServerData');
    }
  });
}