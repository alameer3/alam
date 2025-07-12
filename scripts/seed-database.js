import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";

// Database connection
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle({ client: pool, schema });

async function seedDatabase() {
  console.log('🌱 بدء إنشاء البيانات الأولية...');
  
  try {
    // إنشاء المستخدم الإداري
    const adminUser = await db.insert(schema.users).values({
      username: 'admin',
      email: 'admin@yemenflix.com',
      password: '$2b$10$vI8aWY8NLEtlZEzJpKbEnu3/8xhQ9W8.pNJJTsRhgYaOQfSMgYUDC', // password: admin123
      firstName: 'مدير',
      lastName: 'النظام',
      isAdmin: true,
      isActive: true,
    }).returning();
    
    console.log('✅ تم إنشاء المستخدم الإداري');

    // إنشاء الفئات
    const categories = await db.insert(schema.categories).values([
      { name: 'Arabic', nameArabic: 'عربي', type: 'movie' },
      { name: 'Foreign', nameArabic: 'أجنبي', type: 'movie' },
      { name: 'Hindi', nameArabic: 'هندي', type: 'movie' },
      { name: 'Turkish', nameArabic: 'تركي', type: 'movie' },
      { name: 'Korean', nameArabic: 'كوري', type: 'movie' },
      { name: 'Arabic Series', nameArabic: 'مسلسلات عربية', type: 'series' },
      { name: 'Foreign Series', nameArabic: 'مسلسلات أجنبية', type: 'series' },
      { name: 'Turkish Series', nameArabic: 'مسلسلات تركية', type: 'series' },
      { name: 'Korean Series', nameArabic: 'مسلسلات كورية', type: 'series' },
      { name: 'TV Shows', nameArabic: 'برامج تلفزيونية', type: 'tv' },
      { name: 'Documentaries', nameArabic: 'أفلام وثائقية', type: 'misc' },
      { name: 'Anime', nameArabic: 'أنمي', type: 'misc' },
    ]).returning();
    
    console.log('✅ تم إنشاء الفئات');

    // إنشاء الأنواع
    const genres = await db.insert(schema.genres).values([
      { name: 'Action', nameArabic: 'أكشن' },
      { name: 'Drama', nameArabic: 'دراما' },
      { name: 'Comedy', nameArabic: 'كوميديا' },
      { name: 'Romance', nameArabic: 'رومانسي' },
      { name: 'Thriller', nameArabic: 'إثارة' },
      { name: 'Horror', nameArabic: 'رعب' },
      { name: 'Adventure', nameArabic: 'مغامرة' },
      { name: 'Sci-Fi', nameArabic: 'خيال علمي' },
      { name: 'Fantasy', nameArabic: 'فانتازيا' },
      { name: 'Crime', nameArabic: 'جريمة' },
      { name: 'Mystery', nameArabic: 'غموض' },
      { name: 'War', nameArabic: 'حرب' },
      { name: 'Historical', nameArabic: 'تاريخي' },
      { name: 'Biography', nameArabic: 'سيرة ذاتية' },
      { name: 'Documentary', nameArabic: 'وثائقي' },
    ]).returning();
    
    console.log('✅ تم إنشاء الأنواع');

    // إنشاء محتوى تجريبي
    const sampleContent = await db.insert(schema.content).values([
      {
        title: 'The Shawshank Redemption',
        titleArabic: 'خلاص من شاوشانك',
        description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
        descriptionArabic: 'رجلان مسجونان يرتبطان على مدى سنوات عديدة، ويجدان العزاء والخلاص في نهاية المطاف من خلال أعمال اللياقة العامة.',
        type: 'movie',
        year: 1994,
        language: 'English',
        quality: 'HD',
        resolution: '1080p',
        rating: '9.3',
        duration: 142,
        posterUrl: 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Shawshank',
        videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        isActive: true,
      },
      {
        title: 'The Godfather',
        titleArabic: 'العراب',
        description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
        descriptionArabic: 'البطريرك المسن لسلالة الجريمة المنظمة ينقل السيطرة على إمبراطوريته السرية إلى ابنه المتردد.',
        type: 'movie',
        year: 1972,
        language: 'English',
        quality: 'HD',
        resolution: '1080p',
        rating: '9.2',
        duration: 175,
        posterUrl: 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Godfather',
        videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        isActive: true,
      },
      {
        title: 'Breaking Bad',
        titleArabic: 'بريكنغ باد',
        description: 'A high school chemistry teacher turned methamphetamine producer partners with a former student.',
        descriptionArabic: 'مدرس كيمياء في المدرسة الثانوية يتحول إلى منتج الميثامفيتامين ويشارك مع طالب سابق.',
        type: 'series',
        year: 2008,
        language: 'English',
        quality: 'HD',
        resolution: '1080p',
        rating: '9.5',
        episodes: 62,
        posterUrl: 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Breaking+Bad',
        videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        isActive: true,
      },
      {
        title: 'Game of Thrones',
        titleArabic: 'صراع العروش',
        description: 'Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns.',
        descriptionArabic: 'تسع عائلات نبيلة تقاتل من أجل السيطرة على أراضي ويستيروس، بينما يعود عدو قديم.',
        type: 'series',
        year: 2011,
        language: 'English',
        quality: 'HD',
        resolution: '1080p',
        rating: '9.3',
        episodes: 73,
        posterUrl: 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Game+of+Thrones',
        videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        isActive: true,
      },
    ]).returning();
    
    console.log('✅ تم إنشاء المحتوى التجريبي');

    // ربط المحتوى بالأنواع
    await db.insert(schema.contentGenres).values([
      { contentId: sampleContent[0].id, genreId: genres[1].id }, // Drama
      { contentId: sampleContent[1].id, genreId: genres[1].id }, // Drama
      { contentId: sampleContent[1].id, genreId: genres[9].id }, // Crime
      { contentId: sampleContent[2].id, genreId: genres[1].id }, // Drama
      { contentId: sampleContent[2].id, genreId: genres[9].id }, // Crime
      { contentId: sampleContent[3].id, genreId: genres[1].id }, // Drama
      { contentId: sampleContent[3].id, genreId: genres[8].id }, // Fantasy
    ]);
    
    console.log('✅ تم ربط المحتوى بالأنواع');

    // ربط المحتوى بالفئات
    await db.insert(schema.contentCategories).values([
      { contentId: sampleContent[0].id, categoryId: categories[1].id }, // Foreign
      { contentId: sampleContent[1].id, categoryId: categories[1].id }, // Foreign
      { contentId: sampleContent[2].id, categoryId: categories[6].id }, // Foreign Series
      { contentId: sampleContent[3].id, categoryId: categories[6].id }, // Foreign Series
    ]);
    
    console.log('✅ تم ربط المحتوى بالفئات');

    console.log('🎉 تم إنشاء البيانات الأولية بنجاح!');
    console.log(`📊 تم إنشاء:
    - 1 مستخدم إداري
    - ${categories.length} فئة
    - ${genres.length} نوع
    - ${sampleContent.length} محتوى تجريبي`);
    
  } catch (error) {
    console.error('❌ خطأ في إنشاء البيانات الأولية:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// تشغيل السكريبت
seedDatabase().catch(console.error);