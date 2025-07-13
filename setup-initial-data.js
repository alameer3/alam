import { pool } from './server/db.ts';

async function setupInitialData() {
  console.log('🔧 Setting up initial data...');
  
  try {
    // Create admin user
    await pool.query(`
      INSERT INTO users (username, email, password, first_name, last_name, is_admin, is_active)
      VALUES ('admin', 'admin@yemenflix.com', '$2b$10$hashedpassword', 'Admin', 'User', true, true)
      ON CONFLICT (username) DO NOTHING
    `);

    // Create categories
    await pool.query(`
      INSERT INTO categories (name, name_arabic, description) VALUES
      ('Arabic', 'عربي', 'Arabic content'),
      ('Foreign', 'أجنبي', 'Foreign content'),
      ('Hindi', 'هندي', 'Hindi content'),
      ('Turkish', 'تركي', 'Turkish content'),
      ('Korean', 'كوري', 'Korean content'),
      ('Egyptian', 'مصري', 'Egyptian content'),
      ('Gulf', 'خليجي', 'Gulf content'),
      ('Documentary', 'وثائقي', 'Documentary content'),
      ('Animation', 'رسوم متحركة', 'Animation content'),
      ('Yemeni', 'يمني', 'Yemeni content')
      ON CONFLICT (name) DO NOTHING
    `);

    // Create genres
    await pool.query(`
      INSERT INTO genres (name, name_arabic, description) VALUES
      ('Action', 'أكشن', 'Action genre'),
      ('Comedy', 'كوميدي', 'Comedy genre'),
      ('Drama', 'دراما', 'Drama genre'),
      ('Romance', 'رومانسي', 'Romance genre'),
      ('Thriller', 'إثارة', 'Thriller genre'),
      ('Horror', 'رعب', 'Horror genre'),
      ('Crime', 'جريمة', 'Crime genre'),
      ('Family', 'عائلي', 'Family genre'),
      ('Historical', 'تاريخي', 'Historical genre'),
      ('Biography', 'سيرة ذاتية', 'Biography genre'),
      ('Adventure', 'مغامرة', 'Adventure genre'),
      ('Fantasy', 'خيال', 'Fantasy genre'),
      ('Sci-Fi', 'خيال علمي', 'Science fiction genre'),
      ('War', 'حروب', 'War genre'),
      ('Musical', 'موسيقي', 'Musical genre')
      ON CONFLICT (name) DO NOTHING
    `);

    // Create sample content
    await pool.query(`
      INSERT INTO content (title, title_arabic, description, description_arabic, type, year, language, quality, resolution, rating, duration, poster_url, is_active) VALUES
      ('The Message', 'الرسالة', 'Epic historical drama about the rise of Islam', 'ملحمة تاريخية عن نشأة الإسلام', 'movie', 1976, 'Arabic', 'HD', '1080p', 8.5, 180, 'https://example.com/poster1.jpg', true),
      ('Wadjda', 'وجدة', 'A story of a young girl who dreams of owning a bicycle', 'قصة فتاة صغيرة تحلم بامتلاك دراجة', 'movie', 2012, 'Arabic', 'HD', '1080p', 7.8, 98, 'https://example.com/poster2.jpg', true),
      ('Theeb', 'ذيب', 'A Bedouin boy guides a British officer across the desert', 'فتى بدوي يقود ضابط بريطاني عبر الصحراء', 'movie', 2014, 'Arabic', 'HD', '1080p', 7.2, 100, 'https://example.com/poster3.jpg', true)
      ON CONFLICT (title) DO NOTHING
    `);

    console.log('✅ Initial data setup completed!');
    
  } catch (error) {
    console.error('❌ Failed to setup initial data:', error);
    throw error;
  }
}

setupInitialData().then(() => {
  console.log('🎉 Initial data setup complete!');
  process.exit(0);
}).catch(err => {
  console.error('💥 Setup failed:', err);
  process.exit(1);
});