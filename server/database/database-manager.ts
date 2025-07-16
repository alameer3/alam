import sqlite3 from 'sqlite3';
import { Database, open } from 'sqlite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { 
  User, Content, Episode, Category, Genre, Person, Review, Comment, 
  DownloadLink, StreamingLink, UserInteraction, WatchHistory, 
  SiteSettings, Notification, Advertisement, Subscription, 
  ActivityLog, Report, ApiResponse, SearchFilters, DashboardStats 
} from '../../shared/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class DatabaseManager {
  private db: Database<sqlite3.Database, sqlite3.Statement> | null = null;
  private dbPath: string;

  constructor(dbPath: string = 'serverdata/database.db') {
    this.dbPath = dbPath;
  }

  async initialize(): Promise<void> {
    try {
      // تأكد من وجود مجلد قاعدة البيانات
      const dbDir = path.dirname(this.dbPath);
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }

      // فتح قاعدة البيانات
      this.db = await open({
        filename: this.dbPath,
        driver: sqlite3.Database
      });

      // تشغيل المفاتيح الأجنبية
      await this.db.exec('PRAGMA foreign_keys = ON;');

      // إنشاء الجداول من schema.sql
      const schemaPath = path.join(__dirname, 'schema.sql');
      const schema = fs.readFileSync(schemaPath, 'utf8');
      await this.db.exec(schema);

      // إدراج البيانات الافتراضية
      await this.insertDefaultData();

      console.log('✅ تم تهيئة قاعدة البيانات بنجاح');
    } catch (error) {
      console.error('❌ خطأ في تهيئة قاعدة البيانات:', error);
      throw error;
    }
  }

  private async insertDefaultData(): Promise<void> {
    try {
      // إدراج إعدادات الموقع الافتراضية
      await this.insertDefaultSiteSettings();
      
      // إدراج المستخدم الافتراضي (مدير)
      await this.insertDefaultUser();
      
      // إدراج الفئات الافتراضية
      await this.insertDefaultCategories();
      
      // إدراج الأنواع الافتراضية
      await this.insertDefaultGenres();
      
      // إدراج الأشخاص الافتراضيين
      await this.insertDefaultPeople();
      
      // إدراج المحتوى التجريبي
      await this.insertDefaultContent();
      
      console.log('✅ تم إدراج البيانات الافتراضية');
    } catch (error) {
      console.error('❌ خطأ في إدراج البيانات الافتراضية:', error);
    }
  }

  private async insertDefaultSiteSettings(): Promise<void> {
    const settings = [
      { key: 'site_name', value: 'AK.SV - الموقع اليمني للأفلام والمسلسلات', type: 'string', category: 'general' },
      { key: 'site_description', value: 'موقع يمني لمشاهدة وتحميل الأفلام والمسلسلات العربية والأجنبية', type: 'string', category: 'general' },
      { key: 'site_logo', value: '/assets/logo.png', type: 'string', category: 'appearance' },
      { key: 'site_theme', value: 'dark', type: 'string', category: 'appearance' },
      { key: 'enable_registration', value: 'true', type: 'boolean', category: 'general' },
      { key: 'enable_comments', value: 'true', type: 'boolean', category: 'general' },
      { key: 'enable_reviews', value: 'true', type: 'boolean', category: 'general' },
      { key: 'facebook_url', value: '', type: 'string', category: 'social' },
      { key: 'twitter_url', value: '', type: 'string', category: 'social' },
      { key: 'youtube_url', value: '', type: 'string', category: 'social' },
      { key: 'telegram_url', value: '', type: 'string', category: 'social' },
      { key: 'content_per_page', value: '24', type: 'number', category: 'general' },
      { key: 'max_upload_size', value: '10485760', type: 'number', category: 'advanced' },
      { key: 'cache_duration', value: '3600', type: 'number', category: 'advanced' },
      { key: 'maintenance_mode', value: 'false', type: 'boolean', category: 'advanced' }
    ];

    for (const setting of settings) {
      await this.db!.run(
        `INSERT OR IGNORE INTO site_settings (key, value, type, category) VALUES (?, ?, ?, ?)`,
        [setting.key, setting.value, setting.type, setting.category]
      );
    }
  }

  private async insertDefaultUser(): Promise<void> {
    await this.db!.run(
      `INSERT OR IGNORE INTO users (id, username, email, password_hash, first_name, last_name, role, is_active) 
       VALUES (1, 'admin', 'admin@ak.sv', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'مدير', 'النظام', 'admin', 1)`
    );
  }

  private async insertDefaultCategories(): Promise<void> {
    const categories = [
      { name: 'Arabic', name_ar: 'عربي', icon: 'globe' },
      { name: 'Foreign', name_ar: 'أجنبي', icon: 'world' },
      { name: 'Classic', name_ar: 'كلاسيكي', icon: 'clock' },
      { name: 'Latest', name_ar: 'أحدث', icon: 'star' },
      { name: 'Popular', name_ar: 'شائع', icon: 'trending-up' },
      { name: 'Featured', name_ar: 'مميز', icon: 'award' },
      { name: 'Kids', name_ar: 'أطفال', icon: 'baby' },
      { name: 'Documentary', name_ar: 'وثائقي', icon: 'file-text' },
      { name: 'Religious', name_ar: 'ديني', icon: 'book' },
      { name: 'Educational', name_ar: 'تعليمي', icon: 'graduation-cap' }
    ];

    for (let i = 0; i < categories.length; i++) {
      const cat = categories[i];
      await this.db!.run(
        `INSERT OR IGNORE INTO categories (name, name_ar, icon, order_index) VALUES (?, ?, ?, ?)`,
        [cat.name, cat.name_ar, cat.icon, i + 1]
      );
    }
  }

  private async insertDefaultGenres(): Promise<void> {
    const genres = [
      { name: 'Action', name_ar: 'أكشن', color: '#ff4757' },
      { name: 'Comedy', name_ar: 'كوميديا', color: '#ffa502' },
      { name: 'Drama', name_ar: 'دراما', color: '#3742fa' },
      { name: 'Horror', name_ar: 'رعب', color: '#2c2c54' },
      { name: 'Romance', name_ar: 'رومانسي', color: '#ff3838' },
      { name: 'Thriller', name_ar: 'إثارة', color: '#8b1538' },
      { name: 'Adventure', name_ar: 'مغامرة', color: '#79c13a' },
      { name: 'Fantasy', name_ar: 'خيال علمي', color: '#7d5fff' },
      { name: 'Crime', name_ar: 'جريمة', color: '#40407a' },
      { name: 'Mystery', name_ar: 'غموض', color: '#2c2c54' },
      { name: 'War', name_ar: 'حرب', color: '#8b5a3c' },
      { name: 'Historical', name_ar: 'تاريخي', color: '#d4af37' },
      { name: 'Musical', name_ar: 'موسيقي', color: '#ff6b6b' },
      { name: 'Sport', name_ar: 'رياضي', color: '#4b6584' },
      { name: 'Biography', name_ar: 'سيرة ذاتية', color: '#596275' }
    ];

    for (const genre of genres) {
      await this.db!.run(
        `INSERT OR IGNORE INTO genres (name, name_ar, color) VALUES (?, ?, ?)`,
        [genre.name, genre.name_ar, genre.color]
      );
    }
  }

  private async insertDefaultPeople(): Promise<void> {
    const people = [
      { name: 'Ahmed Helmy', name_ar: 'أحمد حلمي', roles: ['actor'] },
      { name: 'Adel Imam', name_ar: 'عادل إمام', roles: ['actor'] },
      { name: 'Yousra', name_ar: 'يسرا', roles: ['actor'] },
      { name: 'Sherif Arafa', name_ar: 'شريف عرفة', roles: ['director'] },
      { name: 'Youssef Chahine', name_ar: 'يوسف شاهين', roles: ['director'] },
      { name: 'Nour El Sherif', name_ar: 'نور الشريف', roles: ['actor'] },
      { name: 'Mahmoud Abdel Aziz', name_ar: 'محمود عبد العزيز', roles: ['actor'] },
      { name: 'Soaad Hosny', name_ar: 'سعاد حسني', roles: ['actor'] },
      { name: 'Farid Shawqi', name_ar: 'فريد شوقي', roles: ['actor'] },
      { name: 'Faten Hamama', name_ar: 'فاتن حمامة', roles: ['actor'] }
    ];

    for (const person of people) {
      await this.db!.run(
        `INSERT OR IGNORE INTO people (name, name_ar, roles) VALUES (?, ?, ?)`,
        [person.name, person.name_ar, JSON.stringify(person.roles)]
      );
    }
  }

  private async insertDefaultContent(): Promise<void> {
    const content = [
      {
        title: 'The Yemeni Wedding',
        title_ar: 'العرس اليمني',
        description: 'A traditional Yemeni wedding ceremony',
        description_ar: 'فيلم عن حفل زفاف يمني تقليدي',
        type: 'movie',
        poster: '/serverdata/images/movie-1.svg',
        release_date: '2024-01-15',
        rating: 4.5,
        duration: 120,
        categories: [1], // عربي
        genres: [1, 3] // أكشن، دراما
      },
      {
        title: 'Sana\'a Stories',
        title_ar: 'حكايات صنعاء',
        description: 'Stories from the heart of Yemen',
        description_ar: 'مسلسل عن حكايات من قلب اليمن',
        type: 'series',
        poster: '/serverdata/images/series-1.svg',
        release_date: '2024-02-01',
        rating: 4.2,
        duration: 45,
        categories: [1], // عربي
        genres: [3, 5] // دراما، رومانسي
      },
      {
        title: 'Yemen Gaming Championship',
        title_ar: 'بطولة اليمن للألعاب',
        description: 'Gaming tournament in Yemen',
        description_ar: 'برنامج بطولة الألعاب في اليمن',
        type: 'program',
        poster: '/serverdata/images/program-1.svg',
        release_date: '2024-03-01',
        rating: 4.0,
        duration: 60,
        categories: [4], // أحدث
        genres: [14] // رياضي
      },
      {
        title: 'FIFA 2024 Yemen',
        title_ar: 'فيفا 2024 اليمن',
        description: 'FIFA game with Yemen national team',
        description_ar: 'لعبة فيفا مع المنتخب اليمني',
        type: 'game',
        poster: '/serverdata/images/game-1.svg',
        release_date: '2024-04-01',
        rating: 3.8,
        duration: 0,
        categories: [4], // أحدث
        genres: [14] // رياضي
      },
      {
        title: 'Yemen Weather App',
        title_ar: 'تطبيق طقس اليمن',
        description: 'Weather application for Yemen',
        description_ar: 'تطبيق الطقس لليمن',
        type: 'application',
        poster: '/serverdata/images/app-1.svg',
        release_date: '2024-05-01',
        rating: 4.3,
        duration: 0,
        categories: [4], // أحدث
        genres: [9] // تعليمي
      }
    ];

    for (const item of content) {
      const result = await this.db!.run(
        `INSERT OR IGNORE INTO content (title, title_ar, description, description_ar, type, poster, release_date, rating, duration) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [item.title, item.title_ar, item.description, item.description_ar, item.type, item.poster, item.release_date, item.rating, item.duration]
      );

      const contentId = result.lastID;
      if (contentId) {
        // ربط بالفئات
        for (const categoryId of item.categories) {
          await this.db!.run(
            `INSERT OR IGNORE INTO content_categories (content_id, category_id) VALUES (?, ?)`,
            [contentId, categoryId]
          );
        }

        // ربط بالأنواع
        for (const genreId of item.genres) {
          await this.db!.run(
            `INSERT OR IGNORE INTO content_genres (content_id, genre_id) VALUES (?, ?)`,
            [contentId, genreId]
          );
        }
      }
    }
  }

  // طرق الحصول على البيانات
  async getSiteSettings(): Promise<SiteSettings[]> {
    const query = `SELECT * FROM site_settings WHERE is_active = 1 ORDER BY category, key`;
    return await this.db!.all(query);
  }

  async updateSiteSettings(settings: { key: string; value: string }[]): Promise<void> {
    for (const setting of settings) {
      await this.db!.run(
        `UPDATE site_settings SET value = ?, updated_at = CURRENT_TIMESTAMP WHERE key = ?`,
        [setting.value, setting.key]
      );
    }
  }

  async getUsers(page: number = 1, limit: number = 24): Promise<{ users: User[], total: number }> {
    const offset = (page - 1) * limit;
    const users = await this.db!.all(
      `SELECT id, username, email, first_name, last_name, avatar, role, is_active, last_login, join_date 
       FROM users ORDER BY join_date DESC LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    
    const total = await this.db!.get(`SELECT COUNT(*) as count FROM users`);
    return { users, total: total.count };
  }

  async getContent(filters: SearchFilters = {}): Promise<{ content: Content[], total: number }> {
    let query = `SELECT c.*, 
                        GROUP_CONCAT(DISTINCT cat.name_ar) as categories,
                        GROUP_CONCAT(DISTINCT g.name_ar) as genres
                 FROM content c
                 LEFT JOIN content_categories cc ON c.id = cc.content_id
                 LEFT JOIN categories cat ON cc.category_id = cat.id
                 LEFT JOIN content_genres cg ON c.id = cg.content_id
                 LEFT JOIN genres g ON cg.genre_id = g.id
                 WHERE c.is_active = 1`;
    
    const params: any[] = [];
    
    if (filters.type) {
      query += ` AND c.type = ?`;
      params.push(filters.type);
    }
    
    if (filters.query) {
      query += ` AND (c.title LIKE ? OR c.title_ar LIKE ?)`;
      params.push(`%${filters.query}%`, `%${filters.query}%`);
    }
    
    query += ` GROUP BY c.id ORDER BY c.created_at DESC`;
    
    if (filters.limit) {
      query += ` LIMIT ?`;
      params.push(filters.limit);
      
      if (filters.page && filters.page > 1) {
        query += ` OFFSET ?`;
        params.push((filters.page - 1) * filters.limit);
      }
    }
    
    const content = await this.db!.all(query, params);
    const total = await this.db!.get(`SELECT COUNT(*) as count FROM content WHERE is_active = 1`);
    
    return { content, total: total.count };
  }

  async getContentById(id: number): Promise<Content | null> {
    const content = await this.db!.get(
      `SELECT c.*, 
              GROUP_CONCAT(DISTINCT cat.name_ar) as categories,
              GROUP_CONCAT(DISTINCT g.name_ar) as genres
       FROM content c
       LEFT JOIN content_categories cc ON c.id = cc.content_id
       LEFT JOIN categories cat ON cc.category_id = cat.id
       LEFT JOIN content_genres cg ON c.id = cg.content_id
       LEFT JOIN genres g ON cg.genre_id = g.id
       WHERE c.id = ? AND c.is_active = 1
       GROUP BY c.id`,
      [id]
    );
    
    if (!content) return null;
    
    // الحصول على الحلقات
    const episodes = await this.db!.all(
      `SELECT * FROM episodes WHERE content_id = ? AND is_active = 1 ORDER BY season_number, episode_number`,
      [id]
    );
    
    // الحصول على روابط التحميل
    const downloadLinks = await this.db!.all(
      `SELECT * FROM download_links WHERE content_id = ? AND is_active = 1`,
      [id]
    );
    
    // الحصول على روابط المشاهدة
    const streamingLinks = await this.db!.all(
      `SELECT * FROM streaming_links WHERE content_id = ? AND is_active = 1`,
      [id]
    );
    
    return {
      ...content,
      episodes,
      downloadLinks,
      streamingLinks
    };
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const totalContent = await this.db!.get(`SELECT COUNT(*) as count FROM content WHERE is_active = 1`);
    const totalUsers = await this.db!.get(`SELECT COUNT(*) as count FROM users WHERE is_active = 1`);
    const totalViews = await this.db!.get(`SELECT SUM(view_count) as total FROM content`);
    const totalDownloads = await this.db!.get(`SELECT SUM(download_count) as total FROM content`);
    const totalReviews = await this.db!.get(`SELECT COUNT(*) as count FROM reviews WHERE is_active = 1`);
    const totalComments = await this.db!.get(`SELECT COUNT(*) as count FROM comments WHERE is_active = 1`);
    
    const recentContent = await this.db!.all(
      `SELECT * FROM content WHERE is_active = 1 ORDER BY created_at DESC LIMIT 5`
    );
    
    const topRated = await this.db!.all(
      `SELECT * FROM content WHERE is_active = 1 ORDER BY rating DESC LIMIT 5`
    );
    
    const mostViewed = await this.db!.all(
      `SELECT * FROM content WHERE is_active = 1 ORDER BY view_count DESC LIMIT 5`
    );
    
    return {
      totalContent: totalContent.count,
      totalUsers: totalUsers.count,
      totalViews: totalViews.total || 0,
      totalDownloads: totalDownloads.total || 0,
      totalReviews: totalReviews.count,
      totalComments: totalComments.count,
      activeUsers: totalUsers.count, // مبسط
      recentContent,
      topRated,
      mostViewed,
      recentUsers: [],
      systemHealth: {
        status: 'healthy',
        uptime: 100,
        diskUsage: 45,
        memoryUsage: 60
      }
    };
  }

  async close(): Promise<void> {
    if (this.db) {
      await this.db.close();
      this.db = null;
    }
  }
}

export const dbManager = new DatabaseManager();