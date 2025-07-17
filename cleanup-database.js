import sqlite3 from 'sqlite3';
import { Database, open } from 'sqlite';

async function cleanupDatabase() {
  console.log('🔧 بدء تنظيف قاعدة البيانات...');
  
  const db = await open({
    filename: 'serverdata/database.db',
    driver: sqlite3.Database
  });

  try {
    // 1. حذف المحتوى المكرر (نحتفظ بالأحدث فقط)
    console.log('🗑️ حذف المحتوى المكرر...');
    
    // حذف المحتوى المكرر بناءً على العنوان والنوع، نحتفظ بالأحدث
    await db.exec(`
      DELETE FROM content 
      WHERE id NOT IN (
        SELECT MAX(id) 
        FROM content 
        GROUP BY title, type
      )
    `);
    
    // 2. إعادة تصنيف المحتوى الخاطئ
    console.log('🔄 إعادة تصنيف المحتوى...');
    
    // تغيير "Programming Course" من application إلى program
    await db.run(`
      UPDATE content 
      SET type = 'program',
          title_ar = 'دورة البرمجة التعليمية'
      WHERE title LIKE '%Programming Course%' AND type = 'application'
    `);
    
    // 3. إضافة محتوى جديد للأقسام القليلة
    console.log('➕ إضافة محتوى جديد...');
    
    // إضافة مسرحيات جديدة
    const theaterContent = [
      {
        title: "Romeo and Juliet Arabic",
        title_ar: "روميو وجولييت بالعربية",
        description: "Classic Shakespeare play in Arabic",
        description_ar: "مسرحية شكسبير الكلاسيكية بالعربية",
        type: "theater",
        poster: "/serverdata/images/romeo-juliet-arabic.svg",
        release_date: "2023-03-15",
        rating: 4.3,
        duration: 150,
        language: "ar",
        country: "YE",
        quality: "HD",
        status: "completed"
      },
      {
        title: "Majnun Layla Theater",
        title_ar: "مسرحية مجنون ليلى",
        description: "Classic Arabic love story on stage",
        description_ar: "قصة الحب العربية الكلاسيكية على المسرح",
        type: "theater",
        poster: "/serverdata/images/majnun-layla.svg",
        release_date: "2023-09-20",
        rating: 4.4,
        duration: 140,
        language: "ar",
        country: "YE",
        quality: "HD",
        status: "completed"
      },
      {
        title: "Al-Halaq Al-Baghdadi",
        title_ar: "الحلاق البغدادي",
        description: "Classic Iraqi comedy play",
        description_ar: "المسرحية الكوميدية العراقية الكلاسيكية",
        type: "theater",
        poster: "/serverdata/images/halaq-baghdadi.svg",
        release_date: "2022-12-10",
        rating: 4.2,
        duration: 130,
        language: "ar",
        country: "YE",
        quality: "HD",
        status: "completed"
      }
    ];

    // إضافة محتوى رياضي جديد
    const sportsContent = [
      {
        title: "Yemen Football League",
        title_ar: "الدوري اليمني لكرة القدم",
        description: "Yemen national football league coverage",
        description_ar: "تغطية الدوري اليمني لكرة القدم",
        type: "sports",
        poster: "/serverdata/images/yemen-football-league.svg",
        release_date: "2024-01-15",
        rating: 4.2,
        duration: 100,
        language: "ar",
        country: "YE",
        quality: "HD",
        status: "ongoing"
      },
      {
        title: "Arabic Basketball Championship",
        title_ar: "بطولة كرة السلة العربية",
        description: "Arab basketball championship highlights",
        description_ar: "أهداف بطولة كرة السلة العربية",
        type: "sports",
        poster: "/serverdata/images/arabic-basketball.svg",
        release_date: "2024-02-20",
        rating: 4.1,
        duration: 85,
        language: "ar",
        country: "YE",
        quality: "HD",
        status: "completed"
      },
      {
        title: "Olympic Games Arabic Commentary",
        title_ar: "الألعاب الأولمبية بالتعليق العربي",
        description: "Olympic games with Arabic commentary",
        description_ar: "الألعاب الأولمبية مع التعليق العربي",
        type: "sports",
        poster: "/serverdata/images/olympics-arabic.svg",
        release_date: "2024-07-26",
        rating: 4.6,
        duration: 240,
        language: "ar",
        country: "YE",
        quality: "4K",
        status: "completed"
      }
    ];

    // إضافة تطبيقات حقيقية
    const applicationContent = [
      {
        title: "Quran Learning App",
        title_ar: "تطبيق تعلم القرآن",
        description: "Learn Quran with Arabic interface",
        description_ar: "تعلم القرآن الكريم بواجهة عربية",
        type: "application",
        poster: "/serverdata/images/quran-app.svg",
        release_date: "2024-01-01",
        rating: 4.8,
        duration: 0,
        language: "ar",
        country: "YE",
        quality: "HD",
        status: "completed"
      },
      {
        title: "Arabic Keyboard App",
        title_ar: "تطبيق لوحة المفاتيح العربية",
        description: "Advanced Arabic keyboard application",
        description_ar: "تطبيق لوحة مفاتيح عربية متقدم",
        type: "application",
        poster: "/serverdata/images/arabic-keyboard.svg",
        release_date: "2023-11-15",
        rating: 4.4,
        duration: 0,
        language: "ar",
        country: "YE",
        quality: "HD",
        status: "completed"
      },
      {
        title: "Yemen News App",
        title_ar: "تطبيق أخبار اليمن",
        description: "Latest Yemen news application",
        description_ar: "تطبيق آخر أخبار اليمن",
        type: "application",
        poster: "/serverdata/images/yemen-news-app.svg",
        release_date: "2024-03-01",
        rating: 4.3,
        duration: 0,
        language: "ar",
        country: "YE",
        quality: "HD",
        status: "ongoing"
      }
    ];

    // إدراج المحتوى الجديد
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    // إدراج المسرحيات
    for (const content of theaterContent) {
      await db.run(`
        INSERT INTO content (title, title_ar, description, description_ar, type, poster, release_date, rating, rating_count, duration, language, country, quality, status, is_active, view_count, download_count, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?, 1, 0, 0, ?, ?)
      `, [
        content.title, content.title_ar, content.description, content.description_ar, 
        content.type, content.poster, content.release_date, content.rating, content.duration,
        content.language, content.country, content.quality, content.status, now, now
      ]);
    }

    // إدراج المحتوى الرياضي
    for (const content of sportsContent) {
      await db.run(`
        INSERT INTO content (title, title_ar, description, description_ar, type, poster, release_date, rating, rating_count, duration, language, country, quality, status, is_active, view_count, download_count, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?, 1, 0, 0, ?, ?)
      `, [
        content.title, content.title_ar, content.description, content.description_ar, 
        content.type, content.poster, content.release_date, content.rating, content.duration,
        content.language, content.country, content.quality, content.status, now, now
      ]);
    }

    // إدراج التطبيقات
    for (const content of applicationContent) {
      await db.run(`
        INSERT INTO content (title, title_ar, description, description_ar, type, poster, release_date, rating, rating_count, duration, language, country, quality, status, is_active, view_count, download_count, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?, 1, 0, 0, ?, ?)
      `, [
        content.title, content.title_ar, content.description, content.description_ar, 
        content.type, content.poster, content.release_date, content.rating, content.duration,
        content.language, content.country, content.quality, content.status, now, now
      ]);
    }

    // 4. عرض إحصائيات المحتوى النهائية
    console.log('📊 إحصائيات المحتوى النهائية:');
    const stats = await db.all(`
      SELECT type, COUNT(*) as count 
      FROM content 
      WHERE is_active = 1 
      GROUP BY type 
      ORDER BY type
    `);

    stats.forEach(stat => {
      console.log(`   ${stat.type}: ${stat.count} عنصر`);
    });

    console.log('✅ تم تنظيف قاعدة البيانات بنجاح!');

  } catch (error) {
    console.error('❌ خطأ في تنظيف قاعدة البيانات:', error);
  } finally {
    await db.close();
  }
}

cleanupDatabase();