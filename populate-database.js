import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './shared/schema.js';

const sql = postgres(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

async function populateDatabase() {
  try {
    console.log('🌱 Adding categories and genres to database...');

    // إضافة الفئات
    const categories = [
      { name: 'Arabic', nameArabic: 'عربي', type: 'movie' },
      { name: 'Foreign', nameArabic: 'أجنبي', type: 'movie' },
      { name: 'Indian', nameArabic: 'هندي', type: 'movie' },
      { name: 'Turkish', nameArabic: 'تركي', type: 'movie' },
      { name: 'Korean', nameArabic: 'كوري', type: 'movie' },
      { name: 'Arabic Series', nameArabic: 'مسلسلات عربية', type: 'series' },
      { name: 'Foreign Series', nameArabic: 'مسلسلات أجنبية', type: 'series' },
      { name: 'Turkish Series', nameArabic: 'مسلسلات تركية', type: 'series' },
      { name: 'Korean Series', nameArabic: 'مسلسلات كورية', type: 'series' },
      { name: 'TV Shows', nameArabic: 'برامج تلفزيونية', type: 'tv' },
      { name: 'Documentary', nameArabic: 'وثائقي', type: 'misc' },
      { name: 'Animation', nameArabic: 'رسوم متحركة', type: 'misc' }
    ];

    for (const category of categories) {
      await db.insert(schema.categories).values(category).onConflictDoNothing();
    }

    // إضافة الأنواع
    const genres = [
      { name: 'Action', nameArabic: 'أكشن' },
      { name: 'Comedy', nameArabic: 'كوميديا' },
      { name: 'Drama', nameArabic: 'دراما' },
      { name: 'Romance', nameArabic: 'رومانسي' },
      { name: 'Thriller', nameArabic: 'إثارة' },
      { name: 'Horror', nameArabic: 'رعب' },
      { name: 'Adventure', nameArabic: 'مغامرة' },
      { name: 'Sci-Fi', nameArabic: 'خيال علمي' },
      { name: 'Fantasy', nameArabic: 'خيالي' },
      { name: 'Crime', nameArabic: 'جريمة' },
      { name: 'War', nameArabic: 'حرب' },
      { name: 'History', nameArabic: 'تاريخي' },
      { name: 'Biography', nameArabic: 'سيرة ذاتية' },
      { name: 'Family', nameArabic: 'عائلي' },
      { name: 'Musical', nameArabic: 'موسيقي' }
    ];

    for (const genre of genres) {
      await db.insert(schema.genres).values(genre).onConflictDoNothing();
    }

    console.log('✅ Categories and genres added successfully!');
    
    // التحقق من النتائج
    const categoriesCount = await db.$count(schema.categories);
    const genresCount = await db.$count(schema.genres);
    
    console.log(`📊 Total categories: ${categoriesCount}`);
    console.log(`📊 Total genres: ${genresCount}`);
    
  } catch (error) {
    console.error('❌ Error populating database:', error);
    throw error;
  } finally {
    await sql.end();
  }
}

populateDatabase().catch(console.error);