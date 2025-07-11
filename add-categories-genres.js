import { sql } from 'drizzle-orm';
import { db } from './server/db.js';

async function addCategoriesAndGenres() {
  try {
    // Check if data already exists
    const existingCategories = await db.execute(sql`SELECT COUNT(*) as count FROM categories`);
    if (existingCategories[0]?.count === 0) {
      await db.execute(sql`
        INSERT INTO categories (name, name_arabic)
        VALUES 
          ('Arabic', 'عربي'),
          ('Foreign', 'أجنبي'),
          ('Hindi', 'هندي'),
          ('Turkish', 'تركي')
      `);
    }

    const existingGenres = await db.execute(sql`SELECT COUNT(*) as count FROM genres`);
    if (existingGenres[0]?.count === 0) {
      await db.execute(sql`
        INSERT INTO genres (name, name_arabic)
        VALUES 
          ('Action', 'أكشن'),
          ('Comedy', 'كوميديا'),
          ('Drama', 'دراما'),
          ('Horror', 'رعب'),
          ('Romance', 'رومانسي'),
          ('Thriller', 'إثارة'),
          ('Sci-Fi', 'خيال علمي'),
          ('Documentary', 'وثائقي')
      `);
    }

    console.log('✓ Categories and genres added successfully');
  } catch (error) {
    console.error('❌ Error adding categories and genres:', error);
  }
}

addCategoriesAndGenres();