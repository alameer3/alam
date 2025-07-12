/**
 * ثوابت التطبيق - جميع القيم الثابتة مجمعة في مكان واحد
 */

export const DATABASE_CONFIG = {
  // إعدادات اتصال قاعدة البيانات
  IDLE_TIMEOUT: 30000, // 30 ثانية
  CONNECTION_TIMEOUT: 5000, // 5 ثواني
  MAX_CONNECTIONS: 20,
  MIN_CONNECTIONS: 5,
};

export const RATE_LIMITS = {
  // حدود المعدل للمصادقة
  AUTH: {
    WINDOW_MS: 15 * 60 * 1000, // 15 دقيقة
    MAX_ATTEMPTS: 5,
    MESSAGE: 'تم تجاوز عدد محاولات تسجيل الدخول المسموح. حاول مرة أخرى خلال 15 دقيقة.',
    RETRY_AFTER: '15 minutes'
  },
  
  // حدود المعدل للـ API
  API: {
    WINDOW_MS: 1 * 60 * 1000, // دقيقة واحدة
    MAX_REQUESTS: 100,
    MESSAGE: 'تم تجاوز الحد المسموح من الطلبات. حاول مرة أخرى لاحقاً.',
    RETRY_AFTER: '1 minute'
  },
  
  // حدود المعدل للعمليات الحساسة
  STRICT: {
    WINDOW_MS: 5 * 60 * 1000, // 5 دقائق
    MAX_REQUESTS: 10,
    MESSAGE: 'تم تجاوز الحد المسموح للعمليات الحساسة. حاول مرة أخرى خلال 5 دقائق.',
    RETRY_AFTER: '5 minutes'
  }
};

export const SECURITY = {
  // إعدادات الأمان
  PASSWORD_SALT_LENGTH: 32,
  PASSWORD_HASH_LENGTH: 64,
  
  // إعدادات JWT
  JWT_EXPIRY: '24h',
  JWT_REFRESH_EXPIRY: '7d',
  
  // إعدادات الجلسة
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 ساعة
  
  // إعدادات CORS
  CORS_ORIGINS: ['http://localhost:3000', 'http://localhost:5000'],
  
  // إعدادات Helmet
  HELMET_OPTIONS: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        fontSrc: ["'self'", "https:"],
        connectSrc: ["'self'"]
      }
    }
  }
};

export const PAGINATION = {
  // إعدادات الصفحات
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  DEFAULT_OFFSET: 0
};

export const UPLOAD = {
  // إعدادات الرفع
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10 ميجابايت
  ALLOWED_MIME_TYPES: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp'
  ],
  UPLOAD_DIR: './uploads',
  THUMBNAIL_SIZE: {
    width: 300,
    height: 300
  }
};

export const CACHE = {
  // إعدادات التخزين المؤقت
  DEFAULT_TTL: 3600, // ساعة واحدة
  LONG_TTL: 86400, // 24 ساعة
  SHORT_TTL: 300, // 5 دقائق
  
  // مفاتيح التخزين المؤقت
  KEYS: {
    CONTENT_LIST: 'content_list',
    CONTENT_DETAIL: 'content_detail',
    CATEGORIES: 'categories',
    GENRES: 'genres',
    STATS: 'stats'
  }
};

export const BACKUP = {
  // إعدادات النسخ الاحتياطية
  SCHEDULE_INTERVAL: 24 * 60 * 60 * 1000, // 24 ساعة
  RETENTION_DAYS: 7,
  BACKUP_DIR: './backups',
  
  // أنواع النسخ الاحتياطية
  TYPES: {
    FULL: 'full',
    INCREMENTAL: 'incremental',
    DIFFERENTIAL: 'differential'
  }
};

export const LOGGING = {
  // إعدادات التسجيل
  LEVELS: {
    ERROR: 'error',
    WARN: 'warn',
    INFO: 'info',
    DEBUG: 'debug'
  },
  
  // ملفات السجل
  FILES: {
    ERROR: './logs/error.log',
    COMBINED: './logs/combined.log',
    ACCESS: './logs/access.log'
  }
};

export const PERFORMANCE = {
  // إعدادات الأداء
  SLOW_QUERY_THRESHOLD: 1000, // مللي ثانية
  COMPRESSION_THRESHOLD: 1024, // بايت
  
  // إعدادات المراقبة
  MONITORING: {
    ENABLED: true,
    INTERVAL: 60000, // دقيقة واحدة
    METRICS_RETENTION: 24 * 60 * 60 * 1000 // 24 ساعة
  }
};

export const CONTENT_TYPES = {
  MOVIE: 'movie',
  SERIES: 'series',
  TV_SHOW: 'tv',
  MISCELLANEOUS: 'misc'
};

export const QUALITY_LEVELS = {
  SD: 'SD',
  HD: 'HD',
  FULL_HD: '1080p',
  UHD: '4K'
};

export const SUPPORTED_LANGUAGES = {
  ARABIC: 'ar',
  ENGLISH: 'en',
  FRENCH: 'fr',
  TURKISH: 'tr',
  HINDI: 'hi',
  KOREAN: 'ko'
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

export const VALIDATION = {
  // قواعد التحقق
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 50,
    PATTERN: /^[a-zA-Z0-9_-]+$/
  },
  
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SPECIAL: true
  },
  
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MAX_LENGTH: 320
  },
  
  CONTENT_TITLE: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 255
  },
  
  DESCRIPTION: {
    MAX_LENGTH: 2000
  }
};

// إعدادات التطبيق المتقدمة
export const APP_CONFIG = {
  NAME: 'YEMEN 🇾🇪 FLIX',
  VERSION: '1.0.0',
  DESCRIPTION: 'منصة عربية لبث الأفلام والمسلسلات',
  
  // إعدادات البيئة
  ENVIRONMENT: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  
  // إعدادات قاعدة البيانات
  DATABASE_URL: process.env.DATABASE_URL,
  
  // إعدادات الأمان
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-here',
  SESSION_SECRET: process.env.SESSION_SECRET || 'your-session-secret-here',
  
  // إعدادات الخدمات الخارجية
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  
  // إعدادات الإنتاج
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development'
};

export default {
  DATABASE_CONFIG,
  RATE_LIMITS,
  SECURITY,
  PAGINATION,
  UPLOAD,
  CACHE,
  BACKUP,
  LOGGING,
  PERFORMANCE,
  CONTENT_TYPES,
  QUALITY_LEVELS,
  SUPPORTED_LANGUAGES,
  HTTP_STATUS,
  VALIDATION,
  APP_CONFIG
};