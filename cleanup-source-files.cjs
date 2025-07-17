const fs = require('fs');
const path = require('path');

console.log('🧹 تنظيف الملفات المصدرية...');

// قائمة المجلدات المصدرية التي يمكن حذفها (اختياري)
const sourceDirectories = [
  'extracted_files',
  'ak_sv_site_extracted',
  'attached_assets',
  'style.zip',
  'ak_sv_site.zip',
  'downloaded_file.zip'
];

// تنظيف الملفات المؤقتة
const tempFiles = [
  'setup-client-assets.js',
  'setup-client-assets.cjs',
  'copy-all-assets.cjs',
  'create-complete-js-libs.cjs',
  'finalize-assets.cjs'
];

console.log('🗑️ حذف الملفات المؤقتة...');
tempFiles.forEach(file => {
  if (fs.existsSync(file)) {
    try {
      fs.unlinkSync(file);
      console.log(`✅ تم حذف: ${file}`);
    } catch (error) {
      console.log(`❌ فشل في حذف: ${file}`);
    }
  }
});

// إنشاء ملف تنظيف منفصل للمجلدات المصدرية (للتشغيل اليدوي)
const cleanupScript = `const fs = require('fs');
const path = require('path');

// تحذير: هذا السكريبت سيحذف المجلدات المصدرية نهائياً
console.log('⚠️  تحذير: سيتم حذف المجلدات المصدرية نهائياً');
console.log('تأكد من أن جميع الملفات المطلوبة تم نسخها إلى client/public');

const sourceDirectories = [
  'extracted_files',
  'ak_sv_site_extracted', 
  'attached_assets'
];

const sourceFiles = [
  'style.zip',
  'ak_sv_site.zip',
  'downloaded_file.zip'
];

function removeDirectory(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
    console.log(\`✅ تم حذف المجلد: \${dirPath}\`);
  }
}

function removeFile(filePath) {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(\`✅ تم حذف الملف: \${filePath}\`);
  }
}

// حذف المجلدات
sourceDirectories.forEach(removeDirectory);

// حذف الملفات
sourceFiles.forEach(removeFile);

console.log('🎉 تم تنظيف جميع الملفات المصدرية!');
`;

fs.writeFileSync('manual-cleanup-sources.cjs', cleanupScript);
console.log('📄 تم إنشاء manual-cleanup-sources.cjs للتنظيف اليدوي');

console.log('✅ تم تنظيف الملفات المؤقتة!');