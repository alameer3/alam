// Fix database data - add categories and genres directly to database
import { DatabaseStorage } from './server/storage.ts';
import { insertCategorySchema, insertGenreSchema } from './shared/schema.ts';

const storage = new DatabaseStorage();

async function fixDatabaseData() {
  console.log('🔧 Adding categories and genres to database...');
  
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

    console.log('Adding categories to database...');
    for (const category of categories) {
      try {
        const validatedData = insertCategorySchema.parse(category);
        await storage.createCategory(validatedData);
        console.log(`✅ Added category: ${category.name}`);
      } catch (error) {
        console.log(`⚠️  Category ${category.name} already exists or error occurred: ${error.message}`);
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

    console.log('Adding genres to database...');
    for (const genre of genres) {
      try {
        const validatedData = insertGenreSchema.parse(genre);
        await storage.createGenre(validatedData);
        console.log(`✅ Added genre: ${genre.name}`);
      } catch (error) {
        console.log(`⚠️  Genre ${genre.name} already exists or error occurred: ${error.message}`);
      }
    }

    console.log('✅ Database data fixed successfully!');
  } catch (error) {
    console.error('❌ Database fix failed:', error);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  fixDatabaseData();
}

export { fixDatabaseData };