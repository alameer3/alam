#!/usr/bin/env node

/**
 * سكريبت إعداد المشروع التلقائي
 * يعمل تلقائياً عند الاستيراد من GitHub ويضمن عمل المشروع بدون مشاكل
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'cyan') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function success(message) {
  log(`✅ ${message}`, 'green');
}

function error(message) {
  log(`❌ ${message}`, 'red');
}

function warning(message) {
  log(`⚠️ ${message}`, 'yellow');
}

function info(message) {
  log(`ℹ️ ${message}`, 'blue');
}

async function checkEnvironment() {
  log('🔍 فحص البيئة...', 'cyan');
  
  // فحص Node.js
  try {
    const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
    success(`Node.js ${nodeVersion} متوفر`);
  } catch (e) {
    error('Node.js غير متوفر - يرجى تثبيت Node.js');
    process.exit(1);
  }

  // فحص npm
  try {
    const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
    success(`npm ${npmVersion} متوفر`);
  } catch (e) {
    error('npm غير متوفر');
    process.exit(1);
  }

  // فحص متغيرات البيئة
  if (!process.env.DATABASE_URL) {
    warning('DATABASE_URL غير موجود - سيتم استخدام الذاكرة المؤقتة');
  } else {
    success('DATABASE_URL موجود');
  }
}

async function installDependencies() {
  log('📦 تثبيت التبعيات...', 'cyan');
  
  if (!existsSync('package.json')) {
    error('package.json غير موجود');
    process.exit(1);
  }

  try {
    execSync('npm install', { stdio: 'inherit' });
    success('تم تثبيت جميع التبعيات بنجاح');
  } catch (e) {
    error('فشل في تثبيت التبعيات');
    process.exit(1);
  }
}

async function setupDatabase() {
  log('🗄️ إعداد قاعدة البيانات...', 'cyan');
  
  if (!process.env.DATABASE_URL) {
    warning('لا توجد قاعدة بيانات - سيتم استخدام الذاكرة المؤقتة');
    return;
  }

  try {
    // تشغيل migrationsF
    if (existsSync('drizzle.config.ts')) {
      execSync('npm run db:push', { stdio: 'inherit' });
      success('تم تطبيق schema قاعدة البيانات');
    }

    // إضافة البيانات الأولية
    if (existsSync('create-schema.js')) {
      execSync('node create-schema.js', { stdio: 'inherit' });
      success('تم إضافة البيانات الأولية');
    }
  } catch (e) {
    warning('تحذير: مشكلة في إعداد قاعدة البيانات - سيتم استخدام الذاكرة المؤقتة');
  }
}

async function createEnvFile() {
  log('⚙️ إنشاء ملف البيئة...', 'cyan');
  
  if (!existsSync('.env')) {
    const envContent = `# متغيرات البيئة لمشروع YEMEN FLIX
# إذا كنت تستخدم قاعدة بيانات PostgreSQL، أضف DATABASE_URL هنا
# DATABASE_URL=postgresql://user:password@localhost:5432/database

# متغيرات الإنتاج
NODE_ENV=development
PORT=5000

# إعدادات الأمان (اختيارية)
# JWT_SECRET=your-jwt-secret-here
# ADMIN_PASSWORD=your-admin-password-here
`;

    writeFileSync('.env', envContent);
    success('تم إنشاء ملف .env');
  } else {
    info('ملف .env موجود بالفعل');
  }
}

async function createStartupScript() {
  log('🚀 إنشاء سكريبت البدء...', 'cyan');
  
  const startupContent = `#!/bin/bash

# سكريبت بدء المشروع
echo "🚀 بدء مشروع YEMEN FLIX..."

# التحقق من التبعيات
if [ ! -d "node_modules" ]; then
  echo "📦 تثبيت التبعيات..."
  npm install
fi

# إعداد قاعدة البيانات (إذا توفرت)
if [ ! -z "$DATABASE_URL" ]; then
  echo "🗄️ إعداد قاعدة البيانات..."
  npm run db:push 2>/dev/null || echo "⚠️ تحذير: لا يمكن تطبيق schema"
  node create-schema.js 2>/dev/null || echo "⚠️ تحذير: لا يمكن إضافة البيانات الأولية"
fi

# بدء التطبيق
echo "✅ بدء الخادم..."
npm run dev
`;

  writeFileSync('start.sh', startupContent);
  try {
    execSync('chmod +x start.sh');
    success('تم إنشاء سكريبت البدء');
  } catch (e) {
    warning('لا يمكن تعديل صلاحيات سكريبت البدء');
  }
}

async function updateReadme() {
  log('📝 تحديث التوثيق...', 'cyan');
  
  const readmeContent = `# YEMEN 🇾🇪 FLIX - منصة السينما اليمنية

## 🚀 بدء سريع (5 دقائق)

### الطريقة الأولى: تشغيل سريع
\`\`\`bash
# تشغيل سكريبت الإعداد التلقائي
node setup-project.js

# أو تشغيل سكريبت البدء
./start.sh
\`\`\`

### الطريقة الثانية: تشغيل يدوي
\`\`\`bash
# 1. تثبيت التبعيات
npm install

# 2. إعداد قاعدة البيانات (اختياري)
npm run db:push
node create-schema.js

# 3. تشغيل التطبيق
npm run dev
\`\`\`

## 🌟 الميزات

- ✅ واجهة مستخدم متجاوبة وحديثة
- ✅ دعم كامل للغة العربية
- ✅ نظام إدارة المحتوى
- ✅ مشغل فيديو متقدم
- ✅ نظام تقييمات ومراجعات
- ✅ لوحة تحكم إدارية شاملة
- ✅ نظام ذكاء اصطناعي للتوصيات
- ✅ دعم PostgreSQL أو الذاكرة المؤقتة

## 🗄️ قاعدة البيانات

المشروع يدعم:
- **PostgreSQL** (الأفضل للإنتاج)
- **الذاكرة المؤقتة** (للتطوير والاختبار)

إذا لم تتوفر قاعدة بيانات، سيعمل المشروع تلقائياً بالذاكرة المؤقتة.

## 🔧 الإعدادات

1. **قاعدة البيانات**: أضف \`DATABASE_URL\` في ملف \`.env\`
2. **المنفذ**: التطبيق يعمل على المنفذ 5000
3. **الإدارة**: الوصول للوحة التحكم عبر النقر 5 مرات على الشعار

## 📱 التشغيل

بعد التشغيل، افتح المتصفح على:
- التطبيق الرئيسي: \`http://localhost:5000\`
- لوحة التحكم: انقر 5 مرات على الشعار

## 🆘 المساعدة

- **مشكلة في التبعيات**: \`rm -rf node_modules && npm install\`
- **مشكلة في قاعدة البيانات**: تحقق من \`DATABASE_URL\`
- **مشكلة في التشغيل**: تأكد من توفر Node.js v18+

---

تم تطوير هذا المشروع بحب للسينما اليمنية ❤️🇾🇪
`;

  writeFileSync('README.md', readmeContent);
  success('تم تحديث التوثيق');
}

async function createQuickSetup() {
  log('⚡ إنشاء إعداد سريع...', 'cyan');
  
  const quickSetupContent = `/**
 * إعداد سريع للمشروع - يعمل في أقل من دقيقة
 */

const { execSync } = require('child_process');
const { existsSync } = require('fs');

console.log('🚀 بدء الإعداد السريع...');

// تثبيت التبعيات
if (!existsSync('node_modules')) {
  console.log('📦 تثبيت التبعيات...');
  execSync('npm install', { stdio: 'inherit' });
}

// إعداد قاعدة البيانات
if (process.env.DATABASE_URL) {
  console.log('🗄️ إعداد قاعدة البيانات...');
  try {
    execSync('npm run db:push', { stdio: 'inherit' });
    execSync('node create-schema.js', { stdio: 'inherit' });
  } catch (e) {
    console.log('⚠️ تحذير: سيتم استخدام الذاكرة المؤقتة');
  }
}

// بدء التطبيق
console.log('✅ بدء التطبيق...');
execSync('npm run dev', { stdio: 'inherit' });
`;

  writeFileSync('quick-setup.js', quickSetupContent);
  success('تم إنشاء الإعداد السريع');
}

async function updatePackageJson() {
  log('📦 تحديث package.json...', 'cyan');
  
  if (!existsSync('package.json')) {
    error('package.json غير موجود');
    return;
  }

  try {
    const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
    
    // إضافة سكريبت الإعداد
    packageJson.scripts = {
      ...packageJson.scripts,
      'setup': 'node setup-project.js',
      'quick-start': 'node quick-setup.js',
      'postinstall': 'node setup-project.js --skip-install'
    };

    writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
    success('تم تحديث package.json');
  } catch (e) {
    error('فشل في تحديث package.json');
  }
}

async function main() {
  console.log(`
${colors.bright}${colors.magenta}
╔══════════════════════════════════════════════════════════════╗
║                    YEMEN 🇾🇪 FLIX                            ║
║                   إعداد المشروع التلقائي                    ║
╚══════════════════════════════════════════════════════════════╝
${colors.reset}
  `);

  const skipInstall = process.argv.includes('--skip-install');

  try {
    await checkEnvironment();
    
    if (!skipInstall) {
      await installDependencies();
    }
    
    await setupDatabase();
    await createEnvFile();
    await createStartupScript();
    await updateReadme();
    await createQuickSetup();
    await updatePackageJson();

    console.log(`
${colors.bright}${colors.green}
╔══════════════════════════════════════════════════════════════╗
║                       🎉 تم بنجاح!                          ║
║                                                              ║
║  المشروع جاهز للعمل الآن. يمكنك البدء بأحد الطرق التالية:      ║
║                                                              ║
║  1. npm run dev          (تشغيل التطبيق)                    ║
║  2. ./start.sh          (سكريبت البدء)                      ║
║  3. npm run quick-start (إعداد وتشغيل سريع)                 ║
║                                                              ║
║  🌐 التطبيق سيعمل على: http://localhost:5000               ║
║  🔧 لوحة التحكم: انقر 5 مرات على الشعار                   ║
╚══════════════════════════════════════════════════════════════╝
${colors.reset}
    `);

  } catch (error) {
    console.error(`
${colors.bright}${colors.red}
╔══════════════════════════════════════════════════════════════╗
║                       ❌ خطأ!                               ║
║                                                              ║
║  حدث خطأ أثناء إعداد المشروع:                               ║
║  ${error.message}                                            ║
║                                                              ║
║  يرجى المحاولة مرة أخرى أو التواصل للمساعدة                 ║
╚══════════════════════════════════════════════════════════════╝
${colors.reset}
    `);
    process.exit(1);
  }
}

// تشغيل الإعداد إذا تم استدعاء الملف مباشرة
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default main;