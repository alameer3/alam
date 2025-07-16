// إعدادات قاعدة البيانات
export const DATABASE_CONFIG = {
  // مسار قاعدة البيانات
  DATABASE_PATH: process.env.DATABASE_PATH || 'serverdata/database.db',
  
  // إعدادات الاتصال
  CONNECTION: {
    enableForeignKeys: true,
    busyTimeout: 30000,
    pragma: {
      journal_mode: 'WAL',
      synchronous: 'NORMAL',
      cache_size: -64000,
      temp_store: 'memory'
    }
  },
  
  // إعدادات الأداء
  PERFORMANCE: {
    poolSize: 10,
    idleTimeout: 30000,
    acquireTimeout: 60000
  },
  
  // إعدادات النسخ الاحتياطي
  BACKUP: {
    enabled: true,
    interval: 24 * 60 * 60 * 1000, // 24 ساعة
    keepBackups: 7,
    backupPath: 'serverdata/backups'
  },
  
  // إعدادات الأمان
  SECURITY: {
    enableWAL: true,
    enableEncryption: false,
    maxConnections: 100,
    timeoutMs: 30000
  }
};

// إعدادات بيئة التطوير
export const DEV_CONFIG = {
  enableLogging: true,
  logQueries: process.env.LOG_QUERIES === 'true',
  enableDebug: process.env.NODE_ENV === 'development'
};

// إعدادات بيئة الإنتاج
export const PROD_CONFIG = {
  enableLogging: false,
  logQueries: false,
  enableDebug: false,
  enableCompression: true,
  enableCaching: true
};

// دالة للحصول على الإعدادات حسب البيئة
export function getDbConfig() {
  const isProduction = process.env.NODE_ENV === 'production';
  const baseConfig = DATABASE_CONFIG;
  
  if (isProduction) {
    return {
      ...baseConfig,
      ...PROD_CONFIG
    };
  }
  
  return {
    ...baseConfig,
    ...DEV_CONFIG
  };
}