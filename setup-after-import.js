#!/usr/bin/env node

/**
 * سكريپت الإعداد التلقائي بعد الاستيراد من GitHub
 * يتم تشغيله تلقائياً عند استيراد المشروع لإعداد النظام وتشغيل الموقع
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 بدء إعداد Yemen Flix بعد الاستيراد من GitHub...\n');

// 1. التحقق من وجود مجلد data وإنشاؤه إذا لم يكن موجوداً
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('✅ تم إنشاء مجلد data/');
}

// 2. التحقق من وجود ملف .gitkeep
const gitkeepFile = path.join(dataDir, '.gitkeep');
if (!fs.existsSync(gitkeepFile)) {
  fs.writeFileSync(gitkeepFile, '# هذا الملف لضمان أن مجلد data سيتم رفعه على GitHub\n# البيانات سيتم تخزينها في ملف storage.json في هذا المجلد');
  console.log('✅ تم إنشاء ملف .gitkeep');
}

// 3. التحقق من وجود ملف storage.json أو إنشاء البيانات الافتراضية
const storageFile = path.join(dataDir, 'storage.json');
if (!fs.existsSync(storageFile)) {
  console.log('📦 إنشاء قاعدة البيانات المؤقتة مع البيانات الافتراضية...');
  
  const defaultData = {
    categories: [
      { id: 1, name: 'arabic', nameArabic: 'عربي', description: 'محتوى عربي' },
      { id: 2, name: 'foreign', nameArabic: 'أجنبي', description: 'محتوى أجنبي' },
      { id: 3, name: 'hindi', nameArabic: 'هندي', description: 'محتوى هندي' },
      { id: 4, name: 'turkish', nameArabic: 'تركي', description: 'محتوى تركي' },
      { id: 5, name: 'korean', nameArabic: 'كوري', description: 'محتوى كوري' },
      { id: 6, name: 'anime', nameArabic: 'أنمي', description: 'أنمي ياباني' },
      { id: 7, name: 'netflix', nameArabic: 'نتفليكس', description: 'محتوى نتفليكس' },
      { id: 8, name: 'documentary', nameArabic: 'وثائقي', description: 'أفلام وثائقية' },
      { id: 9, name: 'family', nameArabic: 'عائلي', description: 'محتوى عائلي' },
      { id: 10, name: 'sports', nameArabic: 'رياضي', description: 'محتوى رياضي' }
    ],
    genres: [
      { id: 1, name: 'action', nameArabic: 'اكشن', description: 'أفلام أكشن' },
      { id: 2, name: 'comedy', nameArabic: 'كوميديا', description: 'أفلام كوميدية' },
      { id: 3, name: 'drama', nameArabic: 'دراما', description: 'أفلام درامية' },
      { id: 4, name: 'romance', nameArabic: 'رومانسي', description: 'أفلام رومانسية' },
      { id: 5, name: 'thriller', nameArabic: 'إثارة', description: 'أفلام إثارة' },
      { id: 6, name: 'horror', nameArabic: 'رعب', description: 'أفلام رعب' },
      { id: 7, name: 'mystery', nameArabic: 'غموض', description: 'أفلام غموض' },
      { id: 8, name: 'crime', nameArabic: 'جريمة', description: 'أفلام جريمة' },
      { id: 9, name: 'adventure', nameArabic: 'مغامرة', description: 'أفلام مغامرة' },
      { id: 10, name: 'fantasy', nameArabic: 'فانتازيا', description: 'أفلام فانتازيا' },
      { id: 11, name: 'sci_fi', nameArabic: 'خيال علمي', description: 'أفلام خيال علمي' },
      { id: 12, name: 'documentary', nameArabic: 'وثائقي', description: 'أفلام وثائقية' },
      { id: 13, name: 'biography', nameArabic: 'سيرة ذاتية', description: 'أفلام سيرة ذاتية' },
      { id: 14, name: 'history', nameArabic: 'تاريخي', description: 'أفلام تاريخية' },
      { id: 15, name: 'war', nameArabic: 'حرب', description: 'أفلام حروب' }
    ],
    content: [
      {
        id: 1,
        title: 'Spider-Man: No Way Home',
        titleArabic: 'سبايدر مان: لا طريق للعودة',
        description: 'Peter Parker seeks help from Doctor Strange when his identity is revealed.',
        descriptionArabic: 'يطلب بيتر باركر المساعدة من الدكتور سترينج عندما يتم الكشف عن هويته.',
        type: 'movies',
        year: 2021,
        language: 'الإنجليزية',
        quality: 'WEB-DL',
        resolution: '4K',
        rating: '8.4',
        duration: 148,
        episodes: null,
        posterUrl: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
        videoUrl: 'https://example.com/spiderman.mp4',
        downloadUrl: 'https://example.com/download/spiderman.mp4',
        trailerUrl: 'https://www.youtube.com/watch?v=JfVOs4VSpmA',
        imdbId: 'tt10872600',
        tmdbId: '634649',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 2,
        title: 'The Treasure',
        titleArabic: 'الكنز',
        description: 'Egyptian adventure movie about treasure hunting.',
        descriptionArabic: 'فيلم مصري مغامرات عن البحث عن الكنز.',
        type: 'movies',
        year: 2017,
        language: 'العربية',
        quality: 'HD',
        resolution: '1080p',
        rating: '8.2',
        duration: 165,
        episodes: null,
        posterUrl: 'https://image.tmdb.org/t/p/w500/treasure.jpg',
        videoUrl: 'https://example.com/treasure.mp4',
        downloadUrl: 'https://example.com/download/treasure.mp4',
        trailerUrl: 'https://www.youtube.com/watch?v=treasure123',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 3,
        title: 'Stranger Things',
        titleArabic: 'أشياء غريبة',
        description: 'Kids in a small town uncover supernatural mysteries.',
        descriptionArabic: 'أطفال في مدينة صغيرة يكتشفون أسراراً خارقة للطبيعة.',
        type: 'series',
        year: 2016,
        language: 'الإنجليزية',
        quality: 'WEB-DL',
        resolution: '4K',
        rating: '8.7',
        duration: 50,
        episodes: 42,
        posterUrl: 'https://image.tmdb.org/t/p/w500/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg',
        videoUrl: 'https://example.com/stranger-things.mp4',
        downloadUrl: 'https://example.com/download/stranger-things.mp4',
        trailerUrl: 'https://www.youtube.com/watch?v=b9EkMc79ZSU',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 4,
        title: 'Al Hayba',
        titleArabic: 'الهيبة',
        description: 'Lebanese drama series about family conflicts.',
        descriptionArabic: 'مسلسل لبناني درامي عن الصراعات العائلية.',
        type: 'series',
        year: 2017,
        language: 'العربية',
        quality: 'HD',
        resolution: '1080p',
        rating: '8.9',
        duration: 45,
        episodes: 120,
        posterUrl: 'https://image.tmdb.org/t/p/w500/alhayba.jpg',
        videoUrl: 'https://example.com/alhayba.mp4',
        downloadUrl: 'https://example.com/download/alhayba.mp4',
        trailerUrl: 'https://www.youtube.com/watch?v=alhayba123',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 5,
        title: 'Top Gun: Maverick',
        titleArabic: 'توب غان: مافريك',
        description: 'Action sequel with Tom Cruise.',
        descriptionArabic: 'فيلم اكشن متتالي مع توم كروز.',
        type: 'movies',
        year: 2022,
        language: 'الإنجليزية',
        quality: 'WEB-DL',
        resolution: '4K',
        rating: '8.3',
        duration: 130,
        episodes: null,
        posterUrl: 'https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg',
        videoUrl: 'https://example.com/topgun.mp4',
        downloadUrl: 'https://example.com/download/topgun.mp4',
        trailerUrl: 'https://www.youtube.com/watch?v=qSqVVswa420',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 6,
        title: 'Welad Rizk',
        titleArabic: 'ولاد رزق',
        description: 'Egyptian action crime movie.',
        descriptionArabic: 'فيلم مصري اكشن جريمة.',
        type: 'movies',
        year: 2015,
        language: 'العربية',
        quality: 'HD',
        resolution: '1080p',
        rating: '7.8',
        duration: 103,
        episodes: null,
        posterUrl: 'https://image.tmdb.org/t/p/w500/weladrisk.jpg',
        videoUrl: 'https://example.com/weladrisk.mp4',
        downloadUrl: 'https://example.com/download/weladrisk.mp4',
        trailerUrl: 'https://www.youtube.com/watch?v=weladrisk123',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 7,
        title: 'WWE Monday Night Raw',
        titleArabic: 'دبليو دبليو إي ليلة الاثنين رو',
        description: 'Professional wrestling entertainment show.',
        descriptionArabic: 'برنامج مصارعة محترف ترفيهي.',
        type: 'tv',
        year: 2023,
        language: 'الإنجليزية',
        quality: 'HD',
        resolution: '1080p',
        rating: '7.5',
        duration: 180,
        episodes: null,
        posterUrl: 'https://image.tmdb.org/t/p/w500/wwe-raw.jpg',
        videoUrl: 'https://example.com/wwe-raw.mp4',
        downloadUrl: 'https://example.com/download/wwe-raw.mp4',
        trailerUrl: 'https://www.youtube.com/watch?v=wweraw123',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 8,
        title: 'Fairuz Concert',
        titleArabic: 'حفلة فيروز',
        description: 'Legendary Lebanese singer performance.',
        descriptionArabic: 'أداء للمطربة اللبنانية الأسطورية فيروز.',
        type: 'misc',
        year: 2022,
        language: 'العربية',
        quality: 'HD',
        resolution: '1080p',
        rating: '9.0',
        duration: 90,
        episodes: null,
        posterUrl: 'https://image.tmdb.org/t/p/w500/fairuz.jpg',
        videoUrl: 'https://example.com/fairuz.mp4',
        downloadUrl: 'https://example.com/download/fairuz.mp4',
        trailerUrl: 'https://www.youtube.com/watch?v=fairuz123',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    users: [
      {
        id: 1,
        username: 'admin',
        email: 'admin@yemenflix.com',
        password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj2h8J9H3/Ne',
        firstName: 'مدير',
        lastName: 'النظام',
        profileImageUrl: null,
        isAdmin: true,
        isActive: true,
        favorites: [],
        watchHistory: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
  };

  fs.writeFileSync(storageFile, JSON.stringify(defaultData, null, 2));
  console.log('✅ تم إنشاء قاعدة بيانات مؤقتة مع 8 محتويات و 10 فئات و 15 نوع');
}

// 4. تثبيت التبعيات إذا لم تكن مثبتة
console.log('📦 تثبيت التبعيات...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ تم تثبيت جميع التبعيات بنجاح');
} catch (error) {
  console.error('❌ خطأ في تثبيت التبعيات:', error.message);
}

// 5. تشغيل الخادم
console.log('\n🎉 إعداد Yemen Flix مكتمل!');
console.log('🌐 تشغيل الخادم الآن...\n');

try {
  console.log('💡 الموقع سيكون متاحاً على: http://localhost:5000');
  console.log('🎬 يحتوي على 8 محتويات متنوعة جاهزة للاستعراض');
  console.log('📱 يمكن الوصول إليه من أي جهاز على نفس الشبكة\n');
  
  // تشغيل الخادم في وضع التطوير
  execSync('npm run dev', { stdio: 'inherit' });
} catch (error) {
  console.log('\n⚠️  إذا كنت تريد تشغيل الخادم يدوياً، استخدم الأمر: npm run dev');
  console.log('🔧 أو في وضع الإنتاج: npm run build && npm start');
}