const fs = require('fs');
const path = require('path');

console.log('🔧 إعداد ملفات العميل...');

// إنشاء المجلدات المطلوبة
const requiredDirs = [
  'client/public',
  'client/public/css',
  'client/public/js',
  'client/public/js/plugins',
  'client/public/fonts',
  'client/public/images'
];

requiredDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 تم إنشاء المجلد: ${dir}`);
  }
});

// نسخ ملفات CSS الأصلية
const cssFiles = [
  { src: 'extracted_files/home/ak.sv/style/assets/css/plugins.css?v=1.2.css', dest: 'client/public/css/plugins_orig.css' },
  { src: 'extracted_files/home/ak.sv/style/assets/css/style.css?v=1.3.css', dest: 'client/public/css/style_orig.css' },
  { src: 'extracted_files/home/ak.sv/style/assets/css/akwam.css?v=1.3.css', dest: 'client/public/css/akwam_orig.css' },
  { src: 'extracted_files/home/ak.sv/style/assets/css/home.css', dest: 'client/public/css/home_orig.css' }
];

cssFiles.forEach(file => {
  if (fs.existsSync(file.src) && !fs.existsSync(file.dest)) {
    fs.copyFileSync(file.src, file.dest);
    console.log(`📄 تم نسخ: ${path.basename(file.dest)}`);
  }
});

// نسخ ملفات الخطوط
const fontFiles = [
  'STC-Bold.eot', 'STC-Bold.woff', 'STC-Bold.ttf', 'STC-Bold.svg',
  'STC-Light.woff', 'STC-Light.ttf', 'STC-Light.svg',
  'STC-Regular.eot', 'STC-Regular.woff', 'STC-Regular.ttf', 'STC-Regular.svg'
];

fontFiles.forEach(font => {
  const src = `extracted_files/home/ak.sv/style/assets/css/fonts/font/${font}`;
  const dest = `client/public/fonts/${font}`;
  if (fs.existsSync(src) && !fs.existsSync(dest)) {
    fs.copyFileSync(src, dest);
    console.log(`🔤 تم نسخ الخط: ${font}`);
  }
});

// نسخ ملفات JavaScript الأساسية
const jsFiles = [
  { src: 'extracted_files/home/ak.sv/style/assets/js/jquery-3.2.1.min.js', dest: 'client/public/js/jquery-3.2.1.min.js' },
  { src: 'extracted_files/home/ak.sv/style/assets/js/plugins/typed.min.js', dest: 'client/public/js/plugins/typed.min.js' },
  { src: 'extracted_files/mix/ak.sv/style/assets/js/plugins/select2.full.min.js', dest: 'client/public/js/plugins/select2.full.min.js' },
  { src: 'extracted_files/mix/ak.sv/style/assets/js/plugins/jquery.lazy.min.js', dest: 'client/public/js/plugins/jquery.lazy.min.js' }
];

jsFiles.forEach(file => {
  if (fs.existsSync(file.src) && !fs.existsSync(file.dest)) {
    fs.copyFileSync(file.src, file.dest);
    console.log(`📜 تم نسخ: ${path.basename(file.dest)}`);
  }
});

// نسخ الأيقونات والصور
const iconFiles = [
  { src: 'extracted_files/home/ak.sv/favicon.ico', dest: 'client/public/favicon.ico' },
  { src: 'extracted_files/home/ak.sv/style/assets/images/logo-white.svg', dest: 'client/public/logo-white.svg' },
  { src: 'ak_sv_site_extracted/style/assets/images/logo-white.svg', dest: 'client/public/images/logo-white.svg' },
  { src: 'ak_sv_site_extracted/style/assets/images/imdb.png', dest: 'client/public/images/imdb.png' },
  { src: 'ak_sv_site_extracted/style/assets/images/tmdb.png', dest: 'client/public/images/tmdb.png' },
  { src: 'ak_sv_site_extracted/style/assets/images/report.svg', dest: 'client/public/images/report.svg' },
  { src: 'extracted_files/home/ak.sv/style/assets/images/home-bg.webp', dest: 'client/public/images/home-bg.webp' },
  { src: 'extracted_files/home/ak.sv/style/assets/images/site-new.webp', dest: 'client/public/images/site-new.webp' },
  { src: 'extracted_files/home/ak.sv/style/assets/images/bg-404.jpg', dest: 'client/public/images/bg-404.jpg' }
];

iconFiles.forEach(file => {
  if (fs.existsSync(file.src) && !fs.existsSync(file.dest)) {
    fs.copyFileSync(file.src, file.dest);
    console.log(`🖼️ تم نسخ: ${path.basename(file.dest)}`);
  }
});

console.log('✅ تم إكمال إعداد ملفات العميل بنجاح!');