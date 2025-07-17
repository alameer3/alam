const fs = require('fs');
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
    console.log(`✅ تم حذف المجلد: ${dirPath}`);
  }
}

function removeFile(filePath) {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`✅ تم حذف الملف: ${filePath}`);
  }
}

// حذف المجلدات
sourceDirectories.forEach(removeDirectory);

// حذف الملفات
sourceFiles.forEach(removeFile);

console.log('🎉 تم تنظيف جميع الملفات المصدرية!');
