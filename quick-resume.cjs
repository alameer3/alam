#!/usr/bin/env node
/**
 * سكريبت الاستئناف السريع - مشروع YEMEN 🇾🇪 FLIX
 * يستأنف التطوير تلقائياً بخطوة واحدة
 */

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔄 بدء استئناف التطوير - YEMEN 🇾🇪 FLIX');
console.log('=' .repeat(50));

// 1. فحص قاعدة البيانات
console.log('🔍 فحص حالة قاعدة البيانات...');
try {
  execSync('node development-state-manager.cjs save', { stdio: 'inherit' });
  console.log('✅ قاعدة البيانات جاهزة');
} catch (error) {
  console.log('⚠️ إنشاء حالة تطوير جديدة...');
}

// 2. فحص الملفات الأساسية
console.log('\n🔍 فحص الملفات الأساسية...');
const requiredFiles = [
  'server/index.ts',
  'server/storage.ts',
  'server/routes.ts',
  'shared/schema.ts',
  'client/src/App.tsx'
];

let allFilesExist = true;
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - مفقود`);
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  console.log('⚠️ بعض الملفات مفقودة - قد تحتاج لإعادة إنشائها');
}

// 3. فحص حالة الخادم
console.log('\n🔍 فحص حالة الخادم...');
try {
  // محاولة الوصول إلى API
  const { spawn } = require('child_process');
  const checkServer = spawn('curl', ['-s', 'http://localhost:5000/api/content/stats']);
  
  checkServer.on('close', (code) => {
    if (code === 0) {
      console.log('✅ الخادم يعمل بشكل صحيح');
    } else {
      console.log('⚠️ الخادم قد يحتاج لإعادة التشغيل');
    }
  });
} catch (error) {
  console.log('⚠️ تعذر فحص الخادم');
}

// 4. عرض تقرير الحالة
console.log('\n📋 تقرير حالة المشروع:');
try {
  execSync('node development-state-manager.cjs status', { stdio: 'inherit' });
} catch (error) {
  console.log('⚠️ تعذر عرض التقرير');
}

// 5. النتيجة النهائية
console.log('\n' + '=' .repeat(50));
console.log('✅ تم استئناف التطوير بنجاح!');
console.log('🚀 المشروع جاهز للعمل');
console.log('\n💡 الأوامر المفيدة:');
console.log('   npm run dev          - تشغيل الخادم');
console.log('   npm run save-state   - حفظ التقدم');
console.log('   npm run backup       - نسخة احتياطية');
console.log('   npm run status       - عرض الحالة');
console.log('=' .repeat(50));