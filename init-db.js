import { db } from './server/db.js';
import { users, categories, genres, content, subscriptionPlans, userSubscriptions, systemAnalytics } from './shared/schema.js';

async function initializeDatabase() {
  console.log('🔧 Initializing database...');
  
  try {
    // Create admin user
    await db.insert(users).values({
      username: 'admin',
      email: 'admin@yemenflix.com',
      password: '$2b$10$hashedpassword',
      firstName: 'Admin',
      lastName: 'User',
      isAdmin: true,
      isActive: true,
      updatedAt: new Date()
    }).onConflictDoNothing();

    // Create categories
    const categoriesData = [
      { name: 'Arabic', nameArabic: 'عربي', description: 'Arabic content', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Foreign', nameArabic: 'أجنبي', description: 'Foreign content', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Hindi', nameArabic: 'هندي', description: 'Hindi content', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Turkish', nameArabic: 'تركي', description: 'Turkish content', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Korean', nameArabic: 'كوري', description: 'Korean content', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Egyptian', nameArabic: 'مصري', description: 'Egyptian content', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Gulf', nameArabic: 'خليجي', description: 'Gulf content', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Documentary', nameArabic: 'وثائقي', description: 'Documentary content', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Animation', nameArabic: 'رسوم متحركة', description: 'Animation content', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Yemeni', nameArabic: 'يمني', description: 'Yemeni content', createdAt: new Date(), updatedAt: new Date() }
    ];

    await db.insert(categories).values(categoriesData).onConflictDoNothing();

    // Create genres
    const genresData = [
      { name: 'Action', nameArabic: 'أكشن', description: 'Action genre', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Comedy', nameArabic: 'كوميدي', description: 'Comedy genre', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Drama', nameArabic: 'دراما', description: 'Drama genre', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Romance', nameArabic: 'رومانسي', description: 'Romance genre', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Thriller', nameArabic: 'إثارة', description: 'Thriller genre', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Horror', nameArabic: 'رعب', description: 'Horror genre', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Crime', nameArabic: 'جريمة', description: 'Crime genre', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Family', nameArabic: 'عائلي', description: 'Family genre', createdAt: new Date(), updatedAt: new Date() },
      { name: 'History', nameArabic: 'تاريخي', description: 'History genre', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Biography', nameArabic: 'سيرة ذاتية', description: 'Biography genre', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Adventure', nameArabic: 'مغامرة', description: 'Adventure genre', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Fantasy', nameArabic: 'خيال', description: 'Fantasy genre', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Sci-Fi', nameArabic: 'خيال علمي', description: 'Science Fiction genre', createdAt: new Date(), updatedAt: new Date() },
      { name: 'War', nameArabic: 'حروب', description: 'War genre', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Musical', nameArabic: 'موسيقي', description: 'Musical genre', createdAt: new Date(), updatedAt: new Date() }
    ];

    await db.insert(genres).values(genresData).onConflictDoNothing();

    // Create some sample content
    const contentData = [
      {
        title: 'The Message',
        titleArabic: 'الرسالة',
        description: 'Epic historical drama about the early years of Islam',
        descriptionArabic: 'فيلم تاريخي ملحمي عن السنوات الأولى للإسلام',
        type: 'movie',
        year: 1976,
        language: 'Arabic',
        quality: 'HD',
        resolution: '1080p',
        rating: '8.5',
        duration: 177,
        country: 'Libya',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Omar',
        titleArabic: 'عمر',
        description: 'Biography of Omar Ibn Al-Khattab, the second Caliph',
        descriptionArabic: 'السيرة الذاتية لعمر بن الخطاب، الخليفة الثاني',
        type: 'series',
        year: 2012,
        language: 'Arabic',
        quality: 'HD',
        resolution: '720p',
        rating: '9.2',
        episodes: 30,
        country: 'Qatar',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Inception',
        titleArabic: 'البداية',
        description: 'A thief who enters people\'s dreams gets a chance to have his criminal record erased',
        descriptionArabic: 'لص يدخل أحلام الناس يحصل على فرصة لمحو سجله الإجرامي',
        type: 'movie',
        year: 2010,
        language: 'English',
        quality: '4K',
        resolution: '2160p',
        rating: '8.8',
        duration: 148,
        country: 'USA',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await db.insert(content).values(contentData).onConflictDoNothing();

    // Create basic subscription plans
    const plansData = [
      {
        name: 'Basic',
        nameArabic: 'أساسي',
        description: 'Basic streaming plan',
        descriptionArabic: 'خطة البث الأساسية',
        price: '9.99',
        currency: 'USD',
        duration: 30,
        features: ['HD streaming', 'Mobile access'],
        featuresArabic: ['بث عالي الجودة', 'الوصول عبر الهاتف'],
        maxStreams: 1,
        maxDownloads: 5,
        hasHDAccess: true,
        has4KAccess: false,
        hasOfflineAccess: false,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Premium',
        nameArabic: 'مميز',
        description: 'Premium streaming plan',
        descriptionArabic: 'خطة البث المميزة',
        price: '19.99',
        currency: 'USD',
        duration: 30,
        features: ['4K streaming', 'Multi-device access', 'Offline downloads'],
        featuresArabic: ['بث 4K', 'الوصول متعدد الأجهزة', 'التحميل للمشاهدة دون اتصال'],
        maxStreams: 4,
        maxDownloads: 50,
        hasHDAccess: true,
        has4KAccess: true,
        hasOfflineAccess: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await db.insert(subscriptionPlans).values(plansData).onConflictDoNothing();

    console.log('✅ Database initialized successfully!');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}

// Run initialization
initializeDatabase().catch(console.error);