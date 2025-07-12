const { Pool } = require('pg');

// إعداد الاتصال بقاعدة البيانات
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function initializeDatabase() {
  console.log('🌱 بدء إنشاء البيانات الأولية...');
  
  try {
    // إنشاء المستخدم الإداري
    const userResult = await pool.query(`
      SELECT id FROM users WHERE username = 'admin';
    `);
    
    if (userResult.rows.length === 0) {
      await pool.query(`
        INSERT INTO users (username, email, password, first_name, last_name, is_admin, is_active)
        VALUES ('admin', 'admin@yemenflix.com', '$2b$10$vI8aWY8NLEtlZEzJpKbEnu3/8xhQ9W8.pNJJTsRhgYaOQfSMgYUDC', 'مدير', 'النظام', true, true);
      `);
      console.log('✅ تم إنشاء المستخدم الإداري');
    } else {
      console.log('✅ المستخدم الإداري موجود بالفعل');
    }

    // إنشاء الفئات
    const categoriesData = [
      ['Arabic', 'عربي', 'movie'],
      ['Foreign', 'أجنبي', 'movie'],
      ['Hindi', 'هندي', 'movie'],
      ['Turkish', 'تركي', 'movie'],
      ['Korean', 'كوري', 'movie'],
      ['Arabic Series', 'مسلسلات عربية', 'series'],
      ['Foreign Series', 'مسلسلات أجنبية', 'series'],
      ['Turkish Series', 'مسلسلات تركية', 'series'],
      ['Korean Series', 'مسلسلات كورية', 'series'],
      ['TV Shows', 'برامج تلفزيونية', 'tv'],
      ['Documentaries', 'أفلام وثائقية', 'misc'],
      ['Anime', 'أنمي', 'misc']
    ];
    
    for (const [name, nameArabic, type] of categoriesData) {
      const categoryResult = await pool.query(`
        SELECT id FROM categories WHERE name = $1;
      `, [name]);
      
      if (categoryResult.rows.length === 0) {
        await pool.query(`
          INSERT INTO categories (name, name_arabic, type) VALUES ($1, $2, $3);
        `, [name, nameArabic, type]);
      }
    }
    console.log('✅ تم إنشاء الفئات');

    // إنشاء الأنواع
    const genresData = [
      ['Action', 'أكشن'],
      ['Drama', 'دراما'],
      ['Comedy', 'كوميديا'],
      ['Romance', 'رومانسي'],
      ['Thriller', 'إثارة'],
      ['Horror', 'رعب'],
      ['Adventure', 'مغامرة'],
      ['Sci-Fi', 'خيال علمي'],
      ['Fantasy', 'فانتازيا'],
      ['Crime', 'جريمة'],
      ['Mystery', 'غموض'],
      ['War', 'حرب'],
      ['Historical', 'تاريخي'],
      ['Biography', 'سيرة ذاتية'],
      ['Documentary', 'وثائقي']
    ];
    
    for (const [name, nameArabic] of genresData) {
      const genreResult = await pool.query(`
        SELECT id FROM genres WHERE name = $1;
      `, [name]);
      
      if (genreResult.rows.length === 0) {
        await pool.query(`
          INSERT INTO genres (name, name_arabic) VALUES ($1, $2);
        `, [name, nameArabic]);
      }
    }
    console.log('✅ تم إنشاء الأنواع');

    // إنشاء محتوى تجريبي
    const contentData = [
      ['The Shawshank Redemption', 'خلاص من شاوشانك', 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.', 'رجلان مسجونان يرتبطان على مدى سنوات عديدة، ويجدان العزاء والخلاص في نهاية المطاف من خلال أعمال اللياقة العامة.', 'movie', 1994, 'English', 'HD', '1080p', 9.3, 142, 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Shawshank', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', true],
      ['The Godfather', 'العراب', 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.', 'البطريرك المسن لسلالة الجريمة المنظمة ينقل السيطرة على إمبراطوريته السرية إلى ابنه المتردد.', 'movie', 1972, 'English', 'HD', '1080p', 9.2, 175, 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Godfather', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', true],
      ['Breaking Bad', 'بريكنغ باد', 'A high school chemistry teacher turned methamphetamine producer partners with a former student.', 'مدرس كيمياء في المدرسة الثانوية يتحول إلى منتج الميثامفيتامين ويشارك مع طالب سابق.', 'series', 2008, 'English', 'HD', '1080p', 9.5, null, 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Breaking+Bad', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', true],
      ['Game of Thrones', 'صراع العروش', 'Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns.', 'تسع عائلات نبيلة تقاتل من أجل السيطرة على أراضي ويستيروس، بينما يعود عدو قديم.', 'series', 2011, 'English', 'HD', '1080p', 9.3, null, 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Game+of+Thrones', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', true],
      ['Omar', 'عمر', 'The story of Omar ibn al-Khattab, the second Caliph of Islam.', 'قصة عمر بن الخطاب، ثاني خليفة في الإسلام.', 'series', 2012, 'Arabic', 'HD', '1080p', 9.1, null, 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Omar', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', true],
      ['Al Hayba', 'الهيبة', 'A Lebanese drama series about a man who returns to his village after years of absence.', 'مسلسل لبناني درامي عن رجل يعود إلى قريته بعد سنوات من الغياب.', 'series', 2017, 'Arabic', 'HD', '1080p', 8.5, null, 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Al+Hayba', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', true]
    ];
    
    for (const contentItem of contentData) {
      const contentResult = await pool.query(`
        SELECT id FROM content WHERE title = $1;
      `, [contentItem[0]]);
      
      if (contentResult.rows.length === 0) {
        await pool.query(`
          INSERT INTO content (title, title_arabic, description, description_arabic, type, year, language, quality, resolution, rating, duration, poster_url, video_url, is_active) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14);
        `, contentItem);
      }
    }
    console.log('✅ تم إنشاء المحتوى التجريبي');

    console.log('🎉 تم إنشاء البيانات الأولية بنجاح!');
    
  } catch (error) {
    console.error('❌ خطأ في إنشاء البيانات الأولية:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// تشغيل السكريبت
initializeDatabase().catch(console.error);