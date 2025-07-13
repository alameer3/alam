// Initialize database with basic data
import { storage } from './server/storage.ts';

async function initializeDatabase() {
  console.log('🔧 Initializing database with basic data...');
  
  try {
    // Add categories
    const categories = [
      { name: 'عربي', nameArabic: 'عربي', description: 'محتوى عربي' },
      { name: 'يمني', nameArabic: 'يمني', description: 'محتوى يمني' },
      { name: 'أجنبي', nameArabic: 'أجنبي', description: 'محتوى أجنبي' },
      { name: 'هندي', nameArabic: 'هندي', description: 'محتوى هندي' },
      { name: 'تركي', nameArabic: 'تركي', description: 'محتوى تركي' },
      { name: 'كوري', nameArabic: 'كوري', description: 'محتوى كوري' },
      { name: 'مصري', nameArabic: 'مصري', description: 'محتوى مصري' },
      { name: 'خليجي', nameArabic: 'خليجي', description: 'محتوى خليجي' },
      { name: 'وثائقي', nameArabic: 'وثائقي', description: 'محتوى وثائقي' },
      { name: 'رسوم متحركة', nameArabic: 'رسوم متحركة', description: 'رسوم متحركة' }
    ];

    for (const category of categories) {
      try {
        await storage.createCategory(category);
        console.log(`✅ Created category: ${category.name}`);
      } catch (error) {
        console.log(`⚠️  Category ${category.name} already exists or error occurred`);
      }
    }

    // Add genres
    const genres = [
      { name: 'أكشن', nameArabic: 'أكشن', description: 'أفلام أكشن' },
      { name: 'كوميدي', nameArabic: 'كوميدي', description: 'أفلام كوميدي' },
      { name: 'دراما', nameArabic: 'دراما', description: 'أفلام دراما' },
      { name: 'رومانسي', nameArabic: 'رومانسي', description: 'أفلام رومانسي' },
      { name: 'إثارة', nameArabic: 'إثارة', description: 'أفلام إثارة' },
      { name: 'رعب', nameArabic: 'رعب', description: 'أفلام رعب' },
      { name: 'جريمة', nameArabic: 'جريمة', description: 'أفلام جريمة' },
      { name: 'عائلي', nameArabic: 'عائلي', description: 'أفلام عائلي' },
      { name: 'تاريخي', nameArabic: 'تاريخي', description: 'أفلام تاريخي' },
      { name: 'سيرة ذاتية', nameArabic: 'سيرة ذاتية', description: 'أفلام سيرة ذاتية' },
      { name: 'مغامرة', nameArabic: 'مغامرة', description: 'أفلام مغامرة' },
      { name: 'خيال', nameArabic: 'خيال', description: 'أفلام خيال' },
      { name: 'خيال علمي', nameArabic: 'خيال علمي', description: 'أفلام خيال علمي' },
      { name: 'حروب', nameArabic: 'حروب', description: 'أفلام حروب' },
      { name: 'موسيقي', nameArabic: 'موسيقي', description: 'أفلام موسيقي' }
    ];

    for (const genre of genres) {
      try {
        await storage.createGenre(genre);
        console.log(`✅ Created genre: ${genre.name}`);
      } catch (error) {
        console.log(`⚠️  Genre ${genre.name} already exists or error occurred`);
      }
    }

    // Add some sample content
    const sampleContent = [
      {
        title: 'الرسالة',
        description: 'فيلم تاريخي عن سيرة الرسول محمد صلى الله عليه وسلم',
        type: 'movie',
        rating: 8.5,
        year: 1976,
        language: 'Arabic',
        quality: 'HD',
        duration: '177 دقيقة',
        poster: 'https://example.com/poster1.jpg',
        trailer: 'https://example.com/trailer1.mp4',
        genres: ['تاريخي', 'دراما'],
        categories: ['عربي']
      },
      {
        title: 'باب الحارة',
        description: 'مسلسل تاريخي سوري يحكي قصة حي دمشقي في الأربعينات',
        type: 'series',
        rating: 9.2,
        year: 2006,
        language: 'Arabic',
        quality: 'HD',
        duration: '45 دقيقة',
        poster: 'https://example.com/poster2.jpg',
        trailer: 'https://example.com/trailer2.mp4',
        genres: ['تاريخي', 'دراما'],
        categories: ['عربي']
      },
      {
        title: 'الأخبار اليوم',
        description: 'برنامج إخباري يومي يغطي أهم الأحداث المحلية والعالمية',
        type: 'tv',
        rating: 7.8,
        year: 2020,
        language: 'Arabic',
        quality: 'HD',
        duration: '60 دقيقة',
        poster: 'https://example.com/poster3.jpg',
        trailer: 'https://example.com/trailer3.mp4',
        genres: ['وثائقي'],
        categories: ['عربي']
      }
    ];

    for (const content of sampleContent) {
      try {
        await storage.createContent(content);
        console.log(`✅ Created content: ${content.title}`);
      } catch (error) {
        console.log(`⚠️  Content ${content.title} already exists or error occurred`);
      }
    }

    console.log('✅ Database initialization completed!');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeDatabase();
}

export { initializeDatabase };