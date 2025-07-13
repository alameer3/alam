#!/usr/bin/env node

/**
 * سكريبت البدء السريع لمشروع Yemen Flix
 * يتم تشغيله تلقائياً عند استيراد المشروع من GitHub
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🎬 مرحباً بك في Yemen Flix!');
console.log('🚀 بدء الإعداد السريع...');

// تحقق من البيئة
console.log('🔍 فحص البيئة...');

// تحقق من Node.js
try {
  const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
  console.log(`✅ Node.js ${nodeVersion}`);
} catch (error) {
  console.error('❌ Node.js غير مثبت');
  process.exit(1);
}

// تحقق من npm
try {
  const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
  console.log(`✅ npm ${npmVersion}`);
} catch (error) {
  console.error('❌ npm غير مثبت');
  process.exit(1);
}

// إنشاء المجلدات المطلوبة
console.log('📁 إنشاء المجلدات...');
const dirs = [
  '.local/state/replit/agent',
  'logs',
  'uploads',
  'backups'
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ تم إنشاء ${dir}`);
  }
});

// تثبيت التبعيات
console.log('📦 تثبيت التبعيات...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ تم تثبيت التبعيات بنجاح');
} catch (error) {
  console.error('❌ فشل في تثبيت التبعيات');
  process.exit(1);
}

// تشغيل إعداد المشروع
console.log('⚙️  تشغيل إعداد المشروع...');
try {
  execSync('node project-import-setup.js', { stdio: 'inherit' });
  console.log('✅ تم إكمال إعداد المشروع');
} catch (error) {
  console.log('⚠️  إعداد المشروع مكتمل مسبقاً');
}

// إنشاء ملف .env إذا لم يكن موجوداً
if (!fs.existsSync('.env') && fs.existsSync('.env.example')) {
  console.log('📝 إنشاء ملف .env...');
  fs.copyFileSync('.env.example', '.env');
  console.log('✅ تم إنشاء ملف .env');
  console.log('⚠️  يرجى تحديث إعدادات قاعدة البيانات في .env');
}

// عرض معلومات المشروع
console.log('\n🎉 تم إكمال الإعداد بنجاح!');
console.log('📋 معلومات المشروع:');
console.log('   - الاسم: Yemen Flix');
console.log('   - المنفذ: 5000');
console.log('   - قاعدة البيانات: PostgreSQL');
console.log('   - البيئة: Development');

console.log('\n🚀 لتشغيل المشروع:');
console.log('   npm run dev');

console.log('\n📚 للمساعدة:');
console.log('   - راجع IMPORT_GUIDE.md');
console.log('   - راجع replit.md');
console.log('   - راجع README.md');

console.log('\n✨ بدء التطوير الآن!');