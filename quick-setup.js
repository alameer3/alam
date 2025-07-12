/**
 * إعداد سريع للمشروع - يعمل في أقل من دقيقة
 */

const { execSync } = require('child_process');
const { existsSync } = require('fs');

console.log('🚀 بدء الإعداد السريع لمشروع YEMEN FLIX...');

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
} else {
  console.log('⚠️ DATABASE_URL غير متوفر - سيتم استخدام الذاكرة المؤقتة');
}

// بدء التطبيق
console.log('✅ بدء التطبيق...');
execSync('npm run dev', { stdio: 'inherit' });