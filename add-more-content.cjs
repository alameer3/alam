const { Pool } = require('@neondatabase/serverless');
const ws = require('ws');

// Configure Neon connection
const neonConfig = require('@neondatabase/serverless').neonConfig;
neonConfig.webSocketConstructor = ws;

// Extract the actual connection string from psql format
let databaseUrl = process.env.DATABASE_URL;
if (databaseUrl.startsWith("psql '") && databaseUrl.endsWith("'")) {
  databaseUrl = databaseUrl.slice(6, -1);
} else if (databaseUrl.startsWith("psql ")) {
  databaseUrl = databaseUrl.slice(5);
}

const pool = new Pool({ connectionString: databaseUrl });

async function addMoreContent() {
  console.log('🎬 إضافة محتوى إضافي...');

  try {
    // إضافة أفلام عربية أكثر
    const arabicMovies = [
      ['الرسالة', 'The Message', 'فيلم ديني تاريخي عن الرسول محمد', 'movie', 1976, 'Arabic', 'HD', '1080p', 8.2, 177],
      ['وجدة', 'Wadjda', 'فيلم سعودي عن فتاة تحلم بدراجة', 'movie', 2012, 'Arabic', 'HD', '1080p', 7.5, 98],
      ['ذيب', 'Theeb', 'فيلم أردني حول الثورة العربية الكبرى', 'movie', 2014, 'Arabic', 'HD', '1080p', 7.3, 100],
      ['كفرناحوم', 'Capernaum', 'دراما لبنانية عن طفل شوارع', 'movie', 2018, 'Arabic', 'HD', '1080p', 8.4, 126],
      ['أمير البحار', 'Omar', 'فيلم فلسطيني حول الاحتلال', 'movie', 2013, 'Arabic', 'HD', '1080p', 7.5, 98]
    ];

    // إضافة مسلسلات عربية
    const arabicSeries = [
      ['باب الحارة', 'Bab Al-Hara', 'مسلسل سوري شعبي', 'series', 2006, 'Arabic', 'SD', '720p', 8.0, 45, 30],
      ['الهيبة', 'Al-Hayba', 'مسلسل لبناني درامي', 'series', 2017, 'Arabic', 'HD', '1080p', 7.8, 45, 40],
      ['جلفار', 'Julfar', 'مسلسل إماراتي تاريخي', 'series', 2019, 'Arabic', 'HD', '1080p', 7.2, 50, 25],
      ['ملوك الجدعنة', 'Molook Al-Jad3ana', 'كوميديا مصرية', 'series', 2020, 'Arabic', 'HD', '1080p', 6.8, 30, 30]
    ];

    // إضافة أفلام أجنبية مشهورة
    const foreignMovies = [
      ['Inception', 'البداية', 'فيلم خيال علمي معقد', 'movie', 2010, 'English', 'HD', '1080p', 8.8, 148],
      ['The Dark Knight', 'فارس الظلام', 'فيلم أبطال خارقين', 'movie', 2008, 'English', 'HD', '1080p', 9.0, 152],
      ['Forrest Gump', 'فورست غامب', 'دراما كوميدية أمريكية', 'movie', 1994, 'English', 'HD', '1080p', 8.8, 142],
      ['The Shawshank Redemption', 'الخلاص من شاوشانك', 'دراما سجن كلاسيكية', 'movie', 1994, 'English', 'HD', '1080p', 9.3, 142],
      ['Pulp Fiction', 'لب الخيال', 'جريمة كوميدية سوداء', 'movie', 1994, 'English', 'HD', '1080p', 8.9, 154]
    ];

    // إضافة مسلسلات أجنبية
    const foreignSeries = [
      ['Stranger Things', 'أشياء غريبة', 'خيال علمي ورعب', 'series', 2016, 'English', 'HD', '1080p', 8.7, 50, 34],
      ['Friends', 'الأصدقاء', 'كوميديا أمريكية كلاسيكية', 'series', 1994, 'English', 'HD', '1080p', 8.9, 22, 236],
      ['The Crown', 'التاج', 'دراما تاريخية بريطانية', 'series', 2016, 'English', 'HD', '1080p', 8.6, 60, 40],
      ['Breaking Bad', 'بريكنغ باد', 'دراما جريمة مثيرة', 'series', 2008, 'English', 'HD', '1080p', 9.5, 47, 62]
    ];

    // إضافة أفلام هندية
    const hindiMovies = [
      ['3 Idiots', '3 أغبياء', 'كوميديا دراما هندية', 'movie', 2009, 'Hindi', 'HD', '1080p', 8.4, 170],
      ['Dangal', 'دانغال', 'فيلم رياضي عن المصارعة', 'movie', 2016, 'Hindi', 'HD', '1080p', 8.4, 161],
      ['Lagaan', 'لاغان', 'دراما رياضية تاريخية', 'movie', 2001, 'Hindi', 'HD', '1080p', 8.1, 224],
      ['Zindagi Na Milegi Dobara', 'الحياة لن تأتي مرة أخرى', 'كوميديا مغامرات', 'movie', 2011, 'Hindi', 'HD', '1080p', 8.2, 155]
    ];

    // إضافة محتوى تركي
    const turkishContent = [
      ['قيامة أرطغرل', 'Diriliş: Ertuğrul', 'مسلسل تاريخي عثماني', 'series', 2014, 'Turkish', 'HD', '1080p', 8.9, 120, 179],
      ['القرن العظيم', 'Muhteşem Yüzyıl', 'دراما تاريخية عثمانية', 'series', 2011, 'Turkish', 'HD', '1080p', 8.1, 90, 139],
      ['العشق الممنوع', 'Aşk-ı Memnu', 'دراما رومانسية', 'series', 2008, 'Turkish', 'HD', '1080p', 8.3, 90, 79],
      ['الطائر المبكر', 'Erkenci Kuş', 'كوميديا رومانسية', 'series', 2018, 'Turkish', 'HD', '1080p', 7.8, 120, 51]
    ];

    // إضافة محتوى كوري
    const koreanContent = [
      ['Parasite', 'الطفيلي', 'إثارة كوريا الجنوبية', 'movie', 2019, 'Korean', 'HD', '1080p', 8.5, 132],
      ['Squid Game', 'لعبة الحبار', 'مسلسل إثارة كوري', 'series', 2021, 'Korean', 'HD', '1080p', 8.0, 60, 9],
      ['Crash Landing on You', 'هبوط اضطراري عليك', 'رومانسي كوري', 'series', 2019, 'Korean', 'HD', '1080p', 8.7, 70, 16],
      ['Kingdom', 'المملكة', 'رعب تاريخي كوري', 'series', 2019, 'Korean', 'HD', '1080p', 8.3, 60, 12]
    ];

    // دمج كل المحتوى
    const allContent = [
      ...arabicMovies,
      ...arabicSeries,
      ...foreignMovies,
      ...foreignSeries,
      ...hindiMovies,
      ...turkishContent,
      ...koreanContent
    ];

    // إضافة المحتوى إلى قاعدة البيانات
    for (const contentItem of allContent) {
      const [title, titleArabic, description, type, year, language, quality, resolution, rating, duration, episodes] = contentItem;
      
      // التحقق من عدم وجود المحتوى مسبقاً
      const existingContent = await pool.query('SELECT id FROM content WHERE title = $1', [title]);
      
      if (existingContent.rows.length === 0) {
        // إنشاء poster URL بناءً على العنوان
        const posterUrl = `/posters/${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.jpg`;
        
        await pool.query(`
          INSERT INTO content (
            title, title_arabic, description, description_arabic, type, year, 
            language, quality, resolution, rating, duration, episodes, 
            poster_url, is_active, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW(), NOW())
        `, [
          title, titleArabic, description, description, type, year,
          language, quality, resolution, rating.toString(), duration, episodes || null,
          posterUrl, true
        ]);
        
        console.log(`✅ تم إضافة: ${titleArabic} (${title})`);
      } else {
        console.log(`⏭️ موجود مسبقاً: ${titleArabic} (${title})`);
      }
    }

    // إحصائيات نهائية
    const contentCount = await pool.query('SELECT COUNT(*) as count FROM content WHERE is_active = true;');
    const categoriesCount = await pool.query('SELECT COUNT(*) as count FROM categories;');
    const genresCount = await pool.query('SELECT COUNT(*) as count FROM genres;');
    
    console.log('\n📊 إحصائيات المحتوى المكتملة:');
    console.log(`🎬 المحتوى الكلي: ${contentCount.rows[0].count}`);
    console.log(`📁 الفئات: ${categoriesCount.rows[0].count}`);
    console.log(`🏷️ الأنواع: ${genresCount.rows[0].count}`);
    
    console.log('\n✅ تم إكمال إضافة المحتوى الإضافي بنجاح!');

  } catch (error) {
    console.error('❌ خطأ في إضافة المحتوى:', error);
  } finally {
    await pool.end();
  }
}

addMoreContent().catch(console.error);