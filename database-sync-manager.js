/**
 * مدير مزامنة قاعدة البيانات الشامل
 * يضمن أن جميع الجداول والأعمدة متزامنة مع schema.ts
 */

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

// تعريف الجداول المطلوبة مع جميع الأعمدة
const requiredTables = {
  users: {
    id: 'SERIAL PRIMARY KEY',
    username: 'VARCHAR(255) NOT NULL UNIQUE',
    email: 'VARCHAR(255) NOT NULL UNIQUE',
    password: 'VARCHAR(255) NOT NULL',
    first_name: 'VARCHAR(255)',
    last_name: 'VARCHAR(255)',
    profile_image_url: 'VARCHAR(500)',
    is_admin: 'BOOLEAN DEFAULT false NOT NULL',
    is_active: 'BOOLEAN DEFAULT true NOT NULL',
    favorites: 'INTEGER[]',
    watch_history: 'INTEGER[]',
    created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL',
    updated_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL'
  },
  categories: {
    id: 'SERIAL PRIMARY KEY',
    name: 'VARCHAR(255) NOT NULL',
    name_arabic: 'VARCHAR(255) NOT NULL',
    description: 'TEXT',
    created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL',
    updated_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL'
  },
  genres: {
    id: 'SERIAL PRIMARY KEY',
    name: 'VARCHAR(255) NOT NULL',
    name_arabic: 'VARCHAR(255) NOT NULL',
    description: 'TEXT',
    created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL',
    updated_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL'
  },
  content: {
    id: 'SERIAL PRIMARY KEY',
    title: 'VARCHAR(255) NOT NULL',
    title_arabic: 'VARCHAR(255) NOT NULL',
    description: 'TEXT',
    description_arabic: 'TEXT',
    type: 'VARCHAR(50) NOT NULL',
    year: 'INTEGER NOT NULL',
    language: 'VARCHAR(50) NOT NULL',
    quality: 'VARCHAR(50) NOT NULL',
    resolution: 'VARCHAR(50) NOT NULL',
    rating: 'DECIMAL(3,1) DEFAULT 0.0',
    duration: 'INTEGER',
    episodes: 'INTEGER',
    poster_url: 'VARCHAR(500)',
    backdrop_url: 'VARCHAR(500)',
    video_url: 'VARCHAR(500)',
    download_url: 'VARCHAR(500)',
    trailer_url: 'VARCHAR(500)',
    imdb_id: 'VARCHAR(50)',
    tmdb_id: 'INTEGER',
    rotten_tomatoes_score: 'INTEGER',
    metacritic_score: 'INTEGER',
    country: 'VARCHAR(100)',
    budget: 'VARCHAR(100)',
    box_office: 'VARCHAR(100)',
    awards: 'TEXT',
    status: 'VARCHAR(50) DEFAULT \'active\'',
    view_count: 'INTEGER DEFAULT 0',
    like_count: 'INTEGER DEFAULT 0',
    is_active: 'BOOLEAN DEFAULT true NOT NULL',
    release_date: 'DATE',
    created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL',
    updated_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL'
  },
  content_genres: {
    id: 'SERIAL PRIMARY KEY',
    content_id: 'INTEGER NOT NULL',
    genre_id: 'INTEGER NOT NULL'
  },
  content_categories: {
    id: 'SERIAL PRIMARY KEY',
    content_id: 'INTEGER NOT NULL',
    category_id: 'INTEGER NOT NULL'
  },
  user_ratings: {
    id: 'SERIAL PRIMARY KEY',
    user_id: 'INTEGER NOT NULL',
    content_id: 'INTEGER NOT NULL',
    rating: 'INTEGER NOT NULL',
    created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL'
  },
  user_comments: {
    id: 'SERIAL PRIMARY KEY',
    user_id: 'INTEGER NOT NULL',
    content_id: 'INTEGER NOT NULL',
    comment: 'TEXT NOT NULL',
    parent_id: 'INTEGER',
    is_active: 'BOOLEAN DEFAULT true NOT NULL',
    created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL',
    updated_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL'
  },
  user_reviews: {
    id: 'SERIAL PRIMARY KEY',
    user_id: 'INTEGER NOT NULL',
    content_id: 'INTEGER NOT NULL',
    rating: 'INTEGER NOT NULL',
    title: 'VARCHAR(255) NOT NULL',
    review: 'TEXT NOT NULL',
    likes: 'INTEGER DEFAULT 0 NOT NULL',
    dislikes: 'INTEGER DEFAULT 0 NOT NULL',
    is_active: 'BOOLEAN DEFAULT true NOT NULL',
    created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL',
    updated_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL'
  },
  review_likes: {
    id: 'SERIAL PRIMARY KEY',
    user_id: 'INTEGER NOT NULL',
    review_id: 'INTEGER NOT NULL',
    is_like: 'BOOLEAN NOT NULL',
    created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL'
  },
  user_favorites: {
    id: 'SERIAL PRIMARY KEY',
    user_id: 'INTEGER NOT NULL',
    content_id: 'INTEGER NOT NULL',
    created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL'
  },
  user_watch_history: {
    id: 'SERIAL PRIMARY KEY',
    user_id: 'INTEGER NOT NULL',
    content_id: 'INTEGER NOT NULL',
    progress_minutes: 'INTEGER DEFAULT 0',
    completed: 'BOOLEAN DEFAULT false',
    created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL',
    updated_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL'
  },
  content_views: {
    id: 'SERIAL PRIMARY KEY',
    content_id: 'INTEGER NOT NULL',
    user_id: 'INTEGER',
    ip_address: 'VARCHAR(45)',
    user_agent: 'TEXT',
    created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL'
  },
  cast_members: {
    id: 'SERIAL PRIMARY KEY',
    name: 'VARCHAR(255) NOT NULL',
    name_arabic: 'VARCHAR(255)',
    biography: 'TEXT',
    biography_arabic: 'TEXT',
    birth_date: 'DATE',
    nationality: 'VARCHAR(100)',
    image_url: 'VARCHAR(500)',
    imdb_id: 'VARCHAR(50)',
    created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL',
    updated_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL'
  },
  content_cast: {
    id: 'SERIAL PRIMARY KEY',
    content_id: 'INTEGER NOT NULL',
    cast_member_id: 'INTEGER NOT NULL',
    role: 'VARCHAR(100) NOT NULL',
    character_name: 'VARCHAR(255)',
    character_name_arabic: 'VARCHAR(255)',
    order_index: 'INTEGER DEFAULT 0',
    created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL'
  },
  content_images: {
    id: 'SERIAL PRIMARY KEY',
    content_id: 'INTEGER NOT NULL',
    image_url: 'VARCHAR(500) NOT NULL',
    image_type: 'VARCHAR(50) NOT NULL',
    description: 'TEXT',
    description_arabic: 'TEXT',
    order_index: 'INTEGER DEFAULT 0',
    created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL'
  },
  external_ratings: {
    id: 'SERIAL PRIMARY KEY',
    content_id: 'INTEGER NOT NULL',
    source: 'VARCHAR(50) NOT NULL',
    rating: 'VARCHAR(20) NOT NULL',
    max_rating: 'VARCHAR(20)',
    url: 'VARCHAR(500)',
    created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL',
    updated_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL'
  }
};

// فحص الجداول والأعمدة الموجودة
async function checkExistingTables() {
  const result = await sql`
    SELECT table_name FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name;
  `;
  return result.map(row => row.table_name);
}

// فحص أعمدة جدول معين
async function checkTableColumns(tableName) {
  const result = await sql`
    SELECT column_name, data_type, is_nullable 
    FROM information_schema.columns 
    WHERE table_name = ${tableName} 
    ORDER BY ordinal_position;
  `;
  return result;
}

// إنشاء جدول جديد
async function createTable(tableName, columns) {
  const columnDefinitions = Object.entries(columns)
    .map(([name, definition]) => `${name} ${definition}`)
    .join(', ');
  
  const createQuery = `CREATE TABLE IF NOT EXISTS ${tableName} (${columnDefinitions});`;
  
  console.log(`📋 Creating table: ${tableName}`);
  await sql`${createQuery}`;
  console.log(`✅ Table created: ${tableName}`);
}

// إضافة عمود مفقود
async function addMissingColumn(tableName, columnName, definition) {
  const alterQuery = `ALTER TABLE ${tableName} ADD COLUMN IF NOT EXISTS ${columnName} ${definition};`;
  
  console.log(`🔧 Adding column: ${tableName}.${columnName}`);
  await sql`${alterQuery}`;
  console.log(`✅ Column added: ${tableName}.${columnName}`);
}

// إنشاء الفهارس المطلوبة
async function createIndexes() {
  const indexes = [
    'CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);',
    'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);',
    'CREATE INDEX IF NOT EXISTS idx_users_is_admin ON users(is_admin);',
    'CREATE INDEX IF NOT EXISTS idx_content_type ON content(type);',
    'CREATE INDEX IF NOT EXISTS idx_content_year ON content(year);',
    'CREATE INDEX IF NOT EXISTS idx_content_language ON content(language);',
    'CREATE INDEX IF NOT EXISTS idx_content_quality ON content(quality);',
    'CREATE INDEX IF NOT EXISTS idx_content_rating ON content(rating);',
    'CREATE INDEX IF NOT EXISTS idx_content_is_active ON content(is_active);',
    'CREATE INDEX IF NOT EXISTS idx_content_genres_content ON content_genres(content_id);',
    'CREATE INDEX IF NOT EXISTS idx_content_genres_genre ON content_genres(genre_id);',
    'CREATE INDEX IF NOT EXISTS idx_content_categories_content ON content_categories(content_id);',
    'CREATE INDEX IF NOT EXISTS idx_content_categories_category ON content_categories(category_id);',
    'CREATE INDEX IF NOT EXISTS idx_user_ratings_user ON user_ratings(user_id);',
    'CREATE INDEX IF NOT EXISTS idx_user_ratings_content ON user_ratings(content_id);',
    'CREATE INDEX IF NOT EXISTS idx_user_comments_user ON user_comments(user_id);',
    'CREATE INDEX IF NOT EXISTS idx_user_comments_content ON user_comments(content_id);',
    'CREATE INDEX IF NOT EXISTS idx_user_reviews_user ON user_reviews(user_id);',
    'CREATE INDEX IF NOT EXISTS idx_user_reviews_content ON user_reviews(content_id);',
    'CREATE INDEX IF NOT EXISTS idx_user_favorites_user ON user_favorites(user_id);',
    'CREATE INDEX IF NOT EXISTS idx_user_favorites_content ON user_favorites(content_id);',
    'CREATE INDEX IF NOT EXISTS idx_user_watch_history_user ON user_watch_history(user_id);',
    'CREATE INDEX IF NOT EXISTS idx_user_watch_history_content ON user_watch_history(content_id);',
    'CREATE INDEX IF NOT EXISTS idx_content_views_content ON content_views(content_id);',
    'CREATE INDEX IF NOT EXISTS idx_content_cast_content ON content_cast(content_id);',
    'CREATE INDEX IF NOT EXISTS idx_content_cast_member ON content_cast(cast_member_id);',
    'CREATE INDEX IF NOT EXISTS idx_content_images_content ON content_images(content_id);',
    'CREATE INDEX IF NOT EXISTS idx_content_images_type ON content_images(image_type);',
    'CREATE INDEX IF NOT EXISTS idx_external_ratings_content ON external_ratings(content_id);',
    'CREATE INDEX IF NOT EXISTS idx_external_ratings_source ON external_ratings(source);'
  ];

  console.log('📊 Creating database indexes...');
  for (const indexQuery of indexes) {
    await sql`${indexQuery}`;
  }
  console.log('✅ Database indexes created successfully');
}

// إضافة البيانات الأساسية
async function addBasicData() {
  // إضافة مستخدم إداري
  await sql`
    INSERT INTO users (username, email, password, first_name, last_name, is_admin, is_active)
    VALUES ('admin', 'admin@yemenflix.com', '$2b$10$K8zT8zT8zT8zT8zT8zT8zubKJH1R8zT8zT8zT8zT8zT8zT8zT8', 'Admin', 'User', true, true)
    ON CONFLICT (username) DO NOTHING;
  `;

  // إضافة الفئات الأساسية
  const categories = [
    { name: 'Arabic', name_arabic: 'عربي' },
    { name: 'Yemeni', name_arabic: 'يمني' },
    { name: 'Foreign', name_arabic: 'أجنبي' },
    { name: 'Hindi', name_arabic: 'هندي' },
    { name: 'Turkish', name_arabic: 'تركي' },
    { name: 'Korean', name_arabic: 'كوري' },
    { name: 'Egyptian', name_arabic: 'مصري' },
    { name: 'Gulf', name_arabic: 'خليجي' },
    { name: 'Documentary', name_arabic: 'وثائقي' },
    { name: 'Animation', name_arabic: 'رسوم متحركة' }
  ];

  for (const category of categories) {
    await sql`
      INSERT INTO categories (name, name_arabic, description)
      VALUES (${category.name}, ${category.name_arabic}, ${category.name_arabic})
      ON CONFLICT (name) DO UPDATE SET name_arabic = ${category.name_arabic};
    `;
  }

  // إضافة الأنواع الأساسية
  const genres = [
    { name: 'Action', name_arabic: 'أكشن' },
    { name: 'Comedy', name_arabic: 'كوميدي' },
    { name: 'Drama', name_arabic: 'دراما' },
    { name: 'Romance', name_arabic: 'رومانسي' },
    { name: 'Thriller', name_arabic: 'إثارة' },
    { name: 'Horror', name_arabic: 'رعب' },
    { name: 'Crime', name_arabic: 'جريمة' },
    { name: 'Family', name_arabic: 'عائلي' },
    { name: 'Historical', name_arabic: 'تاريخي' },
    { name: 'Biography', name_arabic: 'سيرة ذاتية' },
    { name: 'Adventure', name_arabic: 'مغامرة' },
    { name: 'Fantasy', name_arabic: 'خيال' },
    { name: 'Sci-Fi', name_arabic: 'خيال علمي' },
    { name: 'War', name_arabic: 'حروب' },
    { name: 'Musical', name_arabic: 'موسيقي' }
  ];

  for (const genre of genres) {
    await sql`
      INSERT INTO genres (name, name_arabic, description)
      VALUES (${genre.name}, ${genre.name_arabic}, ${genre.name_arabic})
      ON CONFLICT (name) DO UPDATE SET name_arabic = ${genre.name_arabic};
    `;
  }

  console.log('✅ Basic data added successfully');
}

// الدالة الرئيسية لمزامنة قاعدة البيانات
async function syncDatabase() {
  try {
    console.log('🔄 Starting database synchronization...');
    
    // فحص الجداول الموجودة
    const existingTables = await checkExistingTables();
    console.log('📋 Existing tables:', existingTables);
    
    // إنشاء الجداول المفقودة أو تحديث الموجودة
    for (const [tableName, columns] of Object.entries(requiredTables)) {
      if (!existingTables.includes(tableName)) {
        await createTable(tableName, columns);
      } else {
        // فحص الأعمدة الموجودة
        const existingColumns = await checkTableColumns(tableName);
        const existingColumnNames = existingColumns.map(col => col.column_name);
        
        // إضافة الأعمدة المفقودة
        for (const [columnName, definition] of Object.entries(columns)) {
          if (!existingColumnNames.includes(columnName)) {
            await addMissingColumn(tableName, columnName, definition);
          }
        }
      }
    }
    
    // إنشاء الفهارس
    await createIndexes();
    
    // إضافة البيانات الأساسية
    await addBasicData();
    
    console.log('✅ Database synchronization completed successfully!');
    
  } catch (error) {
    console.error('❌ Database synchronization failed:', error);
    throw error;
  }
}

// تشغيل المزامنة
if (import.meta.url === new URL(import.meta.url).href) {
  syncDatabase().catch(console.error);
}

export { syncDatabase };