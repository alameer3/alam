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
      
      // إدراج الحلقات والروابط
      await this.insertDefaultEpisodes();
      await this.insertDefaultLinks();
      
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
      },
      // أفلام أجنبية مشهورة
      {
        title: 'The Shawshank Redemption',
        title_ar: 'الخلاص من شاوشانك',
        description: 'Hope and friendship in prison',
        description_ar: 'الأمل والصداقة في السجن',
        type: 'movie',
        poster: '/serverdata/images/shawshank.svg',
        release_date: '1994-09-23',
        rating: 4.9,
        duration: 142,
        categories: [2], // أجنبي
        genres: [2] // دراما
      },
      {
        title: 'The Dark Knight',
        title_ar: 'فارس الظلام',
        description: 'Batman faces the Joker',
        description_ar: 'باتمان يواجه الجوكر',
        type: 'movie',
        poster: '/serverdata/images/dark-knight.svg',
        release_date: '2008-07-18',
        rating: 4.8,
        duration: 152,
        categories: [2], // أجنبي
        genres: [1, 6] // أكشن، جريمة
      },
      {
        title: 'Forrest Gump',
        title_ar: 'فورست غامب',
        description: 'Life is like a box of chocolates',
        description_ar: 'الحياة مثل علبة الشوكولاتة',
        type: 'movie',
        poster: '/serverdata/images/forrest-gump.svg',
        release_date: '1994-07-06',
        rating: 4.7,
        duration: 142,
        categories: [2], // أجنبي
        genres: [2, 3] // دراما، كوميديا
      },
      {
        title: '3 Idiots',
        title_ar: '3 أغبياء',
        description: 'Engineering students and friendship',
        description_ar: 'طلاب الهندسة والصداقة',
        type: 'movie',
        poster: '/serverdata/images/3-idiots.svg',
        release_date: '2009-12-25',
        rating: 4.6,
        duration: 170,
        categories: [2], // أجنبي
        genres: [2, 3] // دراما، كوميديا
      },
      {
        title: 'Squid Game',
        title_ar: 'لعبة الحبار',
        description: 'Survival game series',
        description_ar: 'مسلسل ألعاب البقاء',
        type: 'series',
        poster: '/serverdata/images/squid-game.svg',
        release_date: '2021-09-17',
        rating: 4.4,
        duration: 60,
        categories: [2], // أجنبي
        genres: [4, 5] // إثارة، رعب
      },
      {
        title: 'Breaking Bad',
        title_ar: 'كسر الحدود',
        description: 'Chemistry teacher becomes drug dealer',
        description_ar: 'مدرس كيمياء يصبح تاجر مخدرات',
        type: 'series',
        poster: '/serverdata/images/breaking-bad.svg',
        release_date: '2008-01-20',
        rating: 4.9,
        duration: 47,
        categories: [2], // أجنبي
        genres: [4, 6] // إثارة، جريمة
      },
      
      // مسلسلات عربية
      {
        title: 'Bab Al-Hara',
        title_ar: 'باب الحارة',
        description: 'Syrian historical drama',
        description_ar: 'دراما تاريخية سورية',
        type: 'series',
        poster: '/serverdata/images/bab-alhara.svg',
        release_date: '2006-10-01',
        rating: 4.3,
        duration: 45,
        categories: [1], // عربي
        genres: [2, 11] // دراما، تاريخي
      },
      {
        title: 'Al-Risalah',
        title_ar: 'الرسالة',
        description: 'The Message - Islamic historical film',
        description_ar: 'فيلم تاريخي إسلامي',
        type: 'movie',
        poster: '/serverdata/images/alrisalah.svg',
        release_date: '1976-03-09',
        rating: 4.8,
        duration: 177,
        categories: [1], // عربي
        genres: [2, 11] // دراما، تاريخي
      },
      
      // برامج ومنوعات
      {
        title: 'Arabs Got Talent',
        title_ar: 'عرب جوت تالنت',
        description: 'Arab talent show',
        description_ar: 'برنامج المواهب العربي',
        type: 'program',
        poster: '/serverdata/images/arabs-got-talent.svg',
        release_date: '2011-01-01',
        rating: 4.1,
        duration: 90,
        categories: [1], // عربي
        genres: [10] // منوعات
      },
      {
        title: 'The Voice Kids Arabia',
        title_ar: 'ذا فويس كيدز العربية',
        description: 'Singing competition for kids',
        description_ar: 'مسابقة الغناء للأطفال',
        type: 'program',
        poster: '/serverdata/images/voice-kids-arabia.svg',
        release_date: '2016-01-01',
        rating: 4.0,
        duration: 80,
        categories: [1], // عربي
        genres: [10] // منوعات
      },
      {
        title: 'Mohamed Mounir Songs',
        title_ar: 'أغاني محمد منير',
        description: 'Songs collection by Mohamed Mounir',
        description_ar: 'مجموعة أغاني محمد منير',
        type: 'program',
        poster: '/serverdata/images/mohamed-mounir-aghnia.svg',
        release_date: '2020-01-01',
        rating: 4.4,
        duration: 45,
        categories: [1], // عربي
        genres: [10] // منوعات
      },
      {
        title: 'Arabic Songs Collection',
        title_ar: 'مجموعة أغاني عربية',
        description: 'Best Arabic songs collection',
        description_ar: 'مجموعة أفضل الأغاني العربية',
        type: 'program',
        poster: '/serverdata/images/arabic-songs-collection.svg',
        release_date: '2023-01-01',
        rating: 4.2,
        duration: 60,
        categories: [1], // عربي
        genres: [10] // منوعات
      },
      {
        title: 'Arabic Nature Documentary',
        title_ar: 'وثائقي الطبيعة العربية',
        description: 'Nature documentary about Arab region',
        description_ar: 'وثائقي عن الطبيعة في المنطقة العربية',
        type: 'program',
        poster: '/serverdata/images/arabic-nature-documentary.svg',
        release_date: '2022-01-01',
        rating: 4.3,
        duration: 75,
        categories: [1], // عربي
        genres: [8] // وثائقي
      },
      
      // مسرحيات وعروض
      {
        title: 'Comedy Theater Show',
        title_ar: 'عرض مسرحي كوميدي',
        description: 'Arabic comedy theater performance',
        description_ar: 'عرض مسرحي كوميدي عربي',
        type: 'theater',
        poster: '/serverdata/images/comedy-theater.svg',
        release_date: '2023-06-01',
        rating: 4.1,
        duration: 120,
        categories: [1], // عربي
        genres: [3] // كوميديا
      },
      
      // مصارعة ورياضة
      {
        title: 'WWE Saturday Night Main Event',
        title_ar: 'WWE ليلة السبت الرئيسية',
        description: 'WWE wrestling event',
        description_ar: 'حدث مصارعة WWE',
        type: 'wrestling',
        poster: '/serverdata/images/wwe-snme.svg',
        release_date: '2024-01-01',
        rating: 3.9,
        duration: 180,
        categories: [2], // أجنبي
        genres: [14] // رياضي
      },
      {
        title: 'Arabic Wrestling Championship',
        title_ar: 'بطولة المصارعة العربية',
        description: 'Arab wrestling championship',
        description_ar: 'بطولة المصارعة العربية',
        type: 'wrestling',
        poster: '/serverdata/images/arabic-wrestling.svg',
        release_date: '2024-03-01',
        rating: 3.8,
        duration: 150,
        categories: [1], // عربي
        genres: [14] // رياضي
      },
      {
        title: 'Arabic World Cup Coverage',
        title_ar: 'تغطية كأس العالم العربي',
        description: 'World Cup coverage in Arabic',
        description_ar: 'تغطية كأس العالم باللغة العربية',
        type: 'sports',
        poster: '/serverdata/images/arabic-world-cup.svg',
        release_date: '2022-11-01',
        rating: 4.5,
        duration: 90,
        categories: [1], // عربي
        genres: [14] // رياضي
      },
      
      // ألعاب وتطبيقات
      {
        title: 'Arabic Action Game',
        title_ar: 'لعبة أكشن عربية',
        description: 'Action game with Arabic story',
        description_ar: 'لعبة أكشن بقصة عربية',
        type: 'game',
        poster: '/serverdata/images/arabic-action-game.svg',
        release_date: '2024-02-01',
        rating: 4.0,
        duration: 0,
        categories: [1], // عربي
        genres: [1] // أكشن
      },
      {
        title: 'Programming Course',
        title_ar: 'دورة البرمجة',
        description: 'Learn programming in Arabic',
        description_ar: 'تعلم البرمجة باللغة العربية',
        type: 'application',
        poster: '/serverdata/images/programming-course.svg',
        release_date: '2024-01-01',
        rating: 4.7,
        duration: 0,
        categories: [1], // عربي
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

  private async insertDefaultEpisodes(): Promise<void> {
    const episodes = [
      // حلقات مسلسل حكايات صنعاء
      {
        content_id: 2, // Sana'a Stories
        title: 'The Beginning',
        title_ar: 'البداية',
        description: 'First episode of the series',
        episode_number: 1,
        season_number: 1,
        duration: 45,
        release_date: '2024-01-01'
      },
      {
        content_id: 2,
        title: 'The Market',
        title_ar: 'السوق',
        description: 'Life in the traditional market',
        episode_number: 2,
        season_number: 1,
        duration: 47,
        release_date: '2024-01-08'
      },
      {
        content_id: 2,
        title: 'The Wedding',
        title_ar: 'العرس',
        description: 'Traditional wedding ceremony',
        episode_number: 3,
        season_number: 1,
        duration: 52,
        release_date: '2024-01-15'
      },
      // حلقات مسلسل Breaking Bad
      {
        content_id: 7, // Breaking Bad
        title: 'Pilot',
        title_ar: 'الحلقة التجريبية',
        description: 'Walter White begins his journey',
        episode_number: 1,
        season_number: 1,
        duration: 58,
        release_date: '2008-01-20'
      },
      {
        content_id: 7,
        title: 'Cat\'s in the Bag',
        title_ar: 'القط في الحقيبة',
        description: 'Walter and Jesse dispose of evidence',
        episode_number: 2,
        season_number: 1,
        duration: 48,
        release_date: '2008-01-27'
      }
    ];

    for (const episode of episodes) {
      await this.db!.run(
        `INSERT OR IGNORE INTO episodes (content_id, title, title_ar, description, episode_number, season_number, duration, release_date) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [episode.content_id, episode.title, episode.title_ar, episode.description, episode.episode_number, episode.season_number, episode.duration, episode.release_date]
      );
    }
  }

  private async insertDefaultLinks(): Promise<void> {
    // روابط التحميل
    const downloadLinks = [
      {
        content_id: 1, // The Yemeni Wedding
        quality: 'HD',
        size: '1.2GB',
        url: 'https://example.com/download/yemeni-wedding-hd.mp4',
        server: 'Server 1'
      },
      {
        content_id: 1,
        quality: 'SD',
        size: '800MB',
        url: 'https://example.com/download/yemeni-wedding-sd.mp4',
        server: 'Server 2'
      },
      {
        content_id: 2, // Sana'a Stories
        episode_id: 1,
        quality: 'HD',
        size: '600MB',
        url: 'https://example.com/download/sanaa-stories-ep1-hd.mp4',
        server: 'Server 1'
      },
      {
        content_id: 6, // The Dark Knight
        quality: 'Full HD',
        size: '2.1GB',
        url: 'https://example.com/download/dark-knight-fhd.mp4',
        server: 'Server 1'
      },
      {
        content_id: 7, // Breaking Bad
        episode_id: 4,
        quality: 'HD',
        size: '750MB',
        url: 'https://example.com/download/breaking-bad-s1e1-hd.mp4',
        server: 'Server 1'
      }
    ];

    for (const link of downloadLinks) {
      await this.db!.run(
        `INSERT OR IGNORE INTO download_links (content_id, episode_id, quality, size, url, server) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [link.content_id, link.episode_id || null, link.quality, link.size, link.url, link.server]
      );
    }

    // روابط المشاهدة
    const streamingLinks = [
      {
        content_id: 1, // The Yemeni Wedding
        quality: 'HD',
        url: 'https://example.com/stream/yemeni-wedding-hd.m3u8',
        server: 'Stream Server 1'
      },
      {
        content_id: 2, // Sana'a Stories
        episode_id: 1,
        quality: 'HD',
        url: 'https://example.com/stream/sanaa-stories-ep1-hd.m3u8',
        server: 'Stream Server 1'
      },
      {
        content_id: 6, // The Dark Knight
        quality: 'Full HD',
        url: 'https://example.com/stream/dark-knight-fhd.m3u8',
        server: 'Stream Server 1'
      }
    ];

    for (const link of streamingLinks) {
      await this.db!.run(
        `INSERT OR IGNORE INTO streaming_links (content_id, episode_id, quality, url, server) 
         VALUES (?, ?, ?, ?, ?)`,
        [link.content_id, link.episode_id || null, link.quality, link.url, link.server]
      );
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
    let query = `SELECT * FROM content WHERE is_active = 1`;
    const params: any[] = [];
    
    if (filters.type) {
      query += ` AND type = ?`;
      params.push(filters.type);
    }
    
    if (filters.query) {
      query += ` AND (title LIKE ? OR title_ar LIKE ?)`;
      params.push(`%${filters.query}%`, `%${filters.query}%`);
    }
    
    if (filters.featured) {
      query += ` AND rating >= 4.5`;
    }
    
    if (filters.trending) {
      query += ` AND view_count >= 100`;
    }
    
    // الترتيب
    const sortBy = filters.sortBy || 'created_at';
    const sortOrder = filters.sortOrder || 'desc';
    query += ` ORDER BY ${sortBy} ${sortOrder}`;
    
    // الحصول على العدد الإجمالي
    let countQuery = `SELECT COUNT(*) as count FROM content WHERE is_active = 1`;
    const countParams: any[] = [];
    
    if (filters.type) {
      countQuery += ` AND type = ?`;
      countParams.push(filters.type);
    }
    
    if (filters.query) {
      countQuery += ` AND (title LIKE ? OR title_ar LIKE ?)`;
      countParams.push(`%${filters.query}%`, `%${filters.query}%`);
    }
    
    if (filters.featured) {
      countQuery += ` AND rating >= 4.5`;
    }
    
    if (filters.trending) {
      countQuery += ` AND view_count >= 100`;
    }
    
    const totalResult = await this.db!.get(countQuery, countParams);
    const total = totalResult?.count || 0;
    
    // التصفح
    const page = filters.page || 1;
    const limit = filters.limit || 24;
    const offset = (page - 1) * limit;
    
    query += ` LIMIT ? OFFSET ?`;
    params.push(limit, offset);
    
    console.log('🔍 Database query:', query);
    console.log('🔍 Parameters:', params);
    
    const content = await this.db!.all(query, params);
    
    console.log('📊 Query results:', content.length, 'items found');
    
    return { content: content || [], total };
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