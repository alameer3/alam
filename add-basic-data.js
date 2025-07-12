import { Pool } from '@neondatabase/serverless';
import ws from 'ws';

if (typeof WebSocket === 'undefined') {
  global.WebSocket = ws;
}

// Clean up the DATABASE_URL
let databaseUrl = process.env.DATABASE_URL;
if (databaseUrl.startsWith("psql '") && databaseUrl.endsWith("'")) {
  databaseUrl = databaseUrl.slice(6, -1);
} else if (databaseUrl.startsWith("psql ")) {
  databaseUrl = databaseUrl.slice(5);
}

try {
  databaseUrl = decodeURIComponent(databaseUrl);
} catch (e) {}

const pool = new Pool({ connectionString: databaseUrl });

async function addBasicData() {
  try {
    console.log('🔧 إضافة البيانات الأساسية...');
    
    // إضافة الفئات
    const categories = [
      ['arabic', 'عربي', 'محتوى عربي أصيل'],
      ['yemeni', 'يمني', 'محتوى يمني محلي'],
      ['foreign', 'أجنبي', 'محتوى أجنبي مترجم'],
      ['hindi', 'هندي', 'أفلام ومسلسلات هندية'],
      ['turkish', 'تركي', 'دراما ومسلسلات تركية'],
      ['korean', 'كوري', 'محتوى كوري حديث'],
      ['egyptian', 'مصري', 'سينما مصرية كلاسيكية'],
      ['gulf', 'خليجي', 'إنتاج خليجي متميز'],
      ['documentary', 'وثائقي', 'أفلام وثائقية تعليمية'],
      ['animation', 'رسوم متحركة', 'أفلام كرتون للعائلة']
    ];

    for (const [name, nameArabic, description] of categories) {
      const existingCategory = await pool.query('SELECT id FROM categories WHERE name = $1', [name]);
      if (existingCategory.rows.length === 0) {
        await pool.query(`
          INSERT INTO categories (name, name_arabic, description, created_at, updated_at) 
          VALUES ($1, $2, $3, NOW(), NOW());
        `, [name, nameArabic, description]);
      }
    }

    // إضافة الأنواع
    const genres = [
      ['action', 'أكشن', 'أفلام الحركة والمغامرات'],
      ['comedy', 'كوميدي', 'كوميديا وضحك'],
      ['drama', 'دراما', 'قصص درامية مؤثرة'],
      ['romance', 'رومانسي', 'قصص حب وعواطف'],
      ['thriller', 'إثارة', 'تشويق وغموض'],
      ['horror', 'رعب', 'أفلام الرعب والخوف'],
      ['crime', 'جريمة', 'أفلام الجريمة والغموض'],
      ['family', 'عائلي', 'محتوى مناسب للعائلة'],
      ['historical', 'تاريخي', 'أحداث تاريخية'],
      ['biography', 'سيرة ذاتية', 'قصص حياة حقيقية'],
      ['adventure', 'مغامرة', 'رحلات ومغامرات شيقة'],
      ['fantasy', 'خيال', 'عوالم خيالية سحرية'],
      ['science_fiction', 'خيال علمي', 'تكنولوجيا المستقبل'],
      ['war', 'حروب', 'أفلام الحروب والصراعات'],
      ['musical', 'موسيقي', 'أفلام غنائية ومسرحية']
    ];

    for (const [name, nameArabic, description] of genres) {
      const existingGenre = await pool.query('SELECT id FROM genres WHERE name = $1', [name]);
      if (existingGenre.rows.length === 0) {
        await pool.query(`
          INSERT INTO genres (name, name_arabic, description, created_at, updated_at) 
          VALUES ($1, $2, $3, NOW(), NOW());
        `, [name, nameArabic, description]);
      }
    }

    // إضافة مستخدم إداري إذا لم يكن موجود
    const existingAdmin = await pool.query('SELECT id FROM users WHERE username = $1', ['admin']);
    if (existingAdmin.rows.length === 0) {
      await pool.query(`
        INSERT INTO users (username, password_hash, email, role, is_active, created_at, updated_at) 
        VALUES ($1, $2, $3, $4, $5, NOW(), NOW());
      `, ['admin', '$2a$10$xBKnZkPZjE.PxYQKu8rTDOWx8Y8iy8rYYn9xXkKvHHMx7YQz8YQz8Y', 'admin@yemenflix.com', 'admin', true]);
    }

    // التحقق من البيانات المضافة
    const categoriesCount = await pool.query('SELECT COUNT(*) as count FROM categories;');
    const genresCount = await pool.query('SELECT COUNT(*) as count FROM genres;');
    const usersCount = await pool.query('SELECT COUNT(*) as count FROM users;');
    
    console.log('✅ تم إضافة البيانات الأساسية بنجاح!');
    console.log(`📁 الفئات: ${categoriesCount.rows[0].count}`);
    console.log(`🏷️ الأنواع: ${genresCount.rows[0].count}`);
    console.log(`👤 المستخدمين: ${usersCount.rows[0].count}`);
    
  } catch (error) {
    console.error('❌ خطأ في إضافة البيانات:', error.message);
  } finally {
    await pool.end();
  }
}

addBasicData();