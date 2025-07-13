#!/usr/bin/env node

import { db } from './server/db.ts';
import { categories, genres, content, users } from './shared/schema.ts';
import { eq } from 'drizzle-orm';

async function initializeDatabase() {
  try {
    console.log('🚀 بدء إعداد قاعدة البيانات...');
    
    if (!db) {
      console.error('❌ لا يمكن الاتصال بقاعدة البيانات');
      process.exit(1);
    }

    // إضافة الفئات الأساسية
    const categoriesData = [
      { name: 'عربي', nameEn: 'Arabic', description: 'المحتوى العربي' },
      { name: 'يمني', nameEn: 'Yemeni', description: 'المحتوى اليمني' },
      { name: 'أجنبي', nameEn: 'Foreign', description: 'المحتوى الأجنبي' },
      { name: 'هندي', nameEn: 'Indian', description: 'المحتوى الهندي' },
      { name: 'تركي', nameEn: 'Turkish', description: 'المحتوى التركي' },
      { name: 'كوري', nameEn: 'Korean', description: 'المحتوى الكوري' },
      { name: 'مصري', nameEn: 'Egyptian', description: 'المحتوى المصري' },
      { name: 'خليجي', nameEn: 'Gulf', description: 'المحتوى الخليجي' },
      { name: 'وثائقي', nameEn: 'Documentary', description: 'الأفلام الوثائقية' },
      { name: 'رسوم متحركة', nameEn: 'Animation', description: 'الرسوم المتحركة' }
    ];

    console.log('📁 إضافة الفئات...');
    for (const category of categoriesData) {
      try {
        await db.insert(categories).values(category).onConflictDoNothing();
      } catch (error) {
        // تجاهل أخطاء التكرار
      }
    }

    // إضافة الأنواع الأساسية
    const genresData = [
      { name: 'أكشن', nameEn: 'Action', description: 'أفلام الأكشن والمغامرة' },
      { name: 'كوميدي', nameEn: 'Comedy', description: 'الأفلام الكوميدية' },
      { name: 'دراما', nameEn: 'Drama', description: 'الأفلام الدرامية' },
      { name: 'رومانسي', nameEn: 'Romance', description: 'الأفلام الرومانسية' },
      { name: 'إثارة', nameEn: 'Thriller', description: 'أفلام الإثارة والتشويق' },
      { name: 'رعب', nameEn: 'Horror', description: 'أفلام الرعب' },
      { name: 'جريمة', nameEn: 'Crime', description: 'أفلام الجريمة' },
      { name: 'عائلي', nameEn: 'Family', description: 'الأفلام العائلية' },
      { name: 'تاريخي', nameEn: 'Historical', description: 'الأفلام التاريخية' },
      { name: 'سيرة ذاتية', nameEn: 'Biography', description: 'أفلام السيرة الذاتية' },
      { name: 'مغامرة', nameEn: 'Adventure', description: 'أفلام المغامرة' },
      { name: 'خيال', nameEn: 'Fantasy', description: 'أفلام الخيال' },
      { name: 'خيال علمي', nameEn: 'Sci-Fi', description: 'أفلام الخيال العلمي' },
      { name: 'حروب', nameEn: 'War', description: 'أفلام الحروب' },
      { name: 'موسيقي', nameEn: 'Musical', description: 'الأفلام الموسيقية' }
    ];

    console.log('🎭 إضافة الأنواع...');
    for (const genre of genresData) {
      try {
        await db.insert(genres).values(genre).onConflictDoNothing();
      } catch (error) {
        // تجاهل أخطاء التكرار
      }
    }

    // إضافة مستخدم إداري
    console.log('👤 إضافة المستخدم الإداري...');
    try {
      await db.insert(users).values({
        username: 'admin',
        email: 'admin@yemenflix.com',
        password: '$2a$10$rOo8DzjQfkF5iKtRhEoMleGq3p3FWOFtAOSMQYoFJEFhgF5tBQ/my', // admin123
        role: 'admin',
        isActive: true
      }).onConflictDoNothing();
    } catch (error) {
      // المستخدم موجود مسبقاً
    }

    // إضافة بعض المحتوى التجريبي
    console.log('🎬 إضافة المحتوى التجريبي...');
    const sampleContent = [
      {
        title: 'عروس بيروت',
        titleEn: 'Bride of Beirut',
        description: 'مسلسل درامي عربي عن قصة حب في بيروت',
        descriptionEn: 'Arab drama series about a love story in Beirut',
        type: 'series',
        year: 2023,
        language: 'عربي',
        quality: 'HD',
        rating: 8.5,
        duration: 45,
        poster: 'https://via.placeholder.com/300x450?text=عروس+بيروت',
        trailer: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        isActive: true
      },
      {
        title: 'الواد سيد الشحات',
        titleEn: 'El Wad Sayed El Shahat',
        description: 'فيلم كوميدي مصري مشهور',
        descriptionEn: 'Famous Egyptian comedy film',
        type: 'movies',
        year: 2019,
        language: 'عربي',
        quality: 'HD',
        rating: 7.8,
        duration: 120,
        poster: 'https://via.placeholder.com/300x450?text=الواد+سيد',
        trailer: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        isActive: true
      },
      {
        title: 'الخاوة',
        titleEn: 'Al Khawa',
        description: 'مسلسل تلفزيوني عربي درامي',
        descriptionEn: 'Arabic dramatic TV series',
        type: 'tv',
        year: 2022,
        language: 'عربي',
        quality: 'HD',
        rating: 9.0,
        duration: 50,
        poster: 'https://via.placeholder.com/300x450?text=الخاوة',
        trailer: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        isActive: true
      },
      {
        title: 'وثائقي: تاريخ اليمن',
        titleEn: 'Documentary: History of Yemen',
        description: 'وثائقي عن تاريخ اليمن العريق',
        descriptionEn: 'Documentary about the ancient history of Yemen',
        type: 'misc',
        year: 2024,
        language: 'عربي',
        quality: '4K',
        rating: 8.8,
        duration: 90,
        poster: 'https://via.placeholder.com/300x450?text=تاريخ+اليمن',
        trailer: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        isActive: true
      }
    ];

    for (const item of sampleContent) {
      try {
        await db.insert(content).values(item).onConflictDoNothing();
      } catch (error) {
        // تجاهل أخطاء التكرار
      }
    }

    console.log('✅ تم إعداد قاعدة البيانات بنجاح!');
    console.log('📊 الإحصائيات:');
    console.log('- 10 فئات');
    console.log('- 15 نوع');
    console.log('- 1 مستخدم إداري');
    console.log('- 4 محتويات تجريبية');
    
  } catch (error) {
    console.error('❌ خطأ في إعداد قاعدة البيانات:', error);
  }
}

// تشغيل الإعداد
initializeDatabase().then(() => {
  process.exit(0);
}).catch((error) => {
  console.error('خطأ عام:', error);
  process.exit(1);
});