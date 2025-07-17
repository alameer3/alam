const fs = require('fs');
const path = require('path');

console.log('🔧 التأكد من وجود جميع ملفات العميل...');

// إنشاء جميع المجلدات المطلوبة
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

// إنشاء favicon.ico الأساسي
const faviconPath = 'client/public/favicon.ico';
if (!fs.existsSync(faviconPath)) {
  // إنشاء favicon أساسي
  const faviconData = Buffer.from([
    0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x10, 0x10, 0x00, 0x00, 0x01, 0x00, 0x08, 0x00, 0x68, 0x05,
    0x00, 0x00, 0x16, 0x00, 0x00, 0x00, 0x28, 0x00, 0x00, 0x00, 0x10, 0x00, 0x00, 0x00, 0x20, 0x00,
    0x00, 0x00, 0x01, 0x00, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
  ]);
  fs.writeFileSync(faviconPath, faviconData);
  console.log('🖼️ تم إنشاء favicon.ico');
}

// إنشاء logo-white.svg
const logoPath = 'client/public/logo-white.svg';
if (!fs.existsSync(logoPath)) {
  const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80" width="200" height="80">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#f3951e;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#ff6b35;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="200" height="80" fill="rgba(0,0,0,0.8)" rx="10"/>
  <text x="100" y="30" font-family="Arial, sans-serif" font-size="24" font-weight="bold" 
        text-anchor="middle" fill="url(#gradient)">اكوام</text>
  <text x="100" y="55" font-family="Arial, sans-serif" font-size="14" font-weight="normal" 
        text-anchor="middle" fill="white">AK.SV</text>
  <circle cx="30" cy="40" r="3" fill="#f3951e"/>
  <circle cx="170" cy="40" r="3" fill="#f3951e"/>
</svg>`;
  fs.writeFileSync(logoPath, logoSvg);
  console.log('🖼️ تم إنشاء logo-white.svg');
}

// إنشاء الصور الأساسية
const imageFiles = {
  'client/public/images/logo-white.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80" width="200" height="80">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#f3951e;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#ff6b35;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="200" height="80" fill="rgba(0,0,0,0.8)" rx="10"/>
  <text x="100" y="30" font-family="Arial, sans-serif" font-size="24" font-weight="bold" 
        text-anchor="middle" fill="url(#gradient)">اكوام</text>
  <text x="100" y="55" font-family="Arial, sans-serif" font-size="14" font-weight="normal" 
        text-anchor="middle" fill="white">AK.SV</text>
  <circle cx="30" cy="40" r="3" fill="#f3951e"/>
  <circle cx="170" cy="40" r="3" fill="#f3951e"/>
</svg>`,
  'client/public/images/imdb.png': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
  'client/public/images/tmdb.png': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
  'client/public/images/report.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
  <polyline points="14,2 14,8 20,8"/>
  <line x1="16" y1="13" x2="8" y2="13"/>
  <line x1="16" y1="17" x2="8" y2="17"/>
  <polyline points="10,9 9,9 8,9"/>
</svg>`
};

Object.keys(imageFiles).forEach(filePath => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, imageFiles[filePath]);
    console.log(`🖼️ تم إنشاء: ${path.basename(filePath)}`);
  }
});

// التحقق من وجود ملفات CSS الأساسية وإنشاؤها إذا لم تكن موجودة
const cssBasicFiles = {
  'client/public/css/plugins_orig.css': '/* CSS Plugins */\n',
  'client/public/css/style_orig.css': '/* Main Styles */\n',
  'client/public/css/akwam_orig.css': '/* Akwam Styles */\n',
  'client/public/css/home_orig.css': '/* Home Styles */\n'
};

Object.keys(cssBasicFiles).forEach(filePath => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, cssBasicFiles[filePath]);
    console.log(`📄 تم إنشاء: ${path.basename(filePath)}`);
  }
});

console.log('✅ تم التأكد من وجود جميع الملفات الأساسية!');