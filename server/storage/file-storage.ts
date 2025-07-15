import { IStorage } from "../storage";
import { User, Content, Category, Genre, UserRating, UserComment, UserReview, ReviewLike, Episode, CastMember, ContentCast, ContentImage, ExternalRating } from "@shared/schema";
import fs from 'fs/promises';
import path from 'path';

interface FileDatabase {
  users: User[];
  content: Content[];
  categories: Category[];
  genres: Genre[];
  userRatings: UserRating[];
  userComments: UserComment[];
  userReviews: UserReview[];
  reviewLikes: ReviewLike[];
  episodes: Episode[];
  castMembers: CastMember[];
  contentCast: ContentCast[];
  contentImages: ContentImage[];
  externalRatings: ExternalRating[];
  contentGenres: Array<{ id: number; contentId: number; genreId: number; }>;
  contentCategories: Array<{ id: number; contentId: number; categoryId: number; }>;
}

export class FileStorage implements IStorage {
  private dataPath: string;
  private database: FileDatabase;
  private initialized = false;

  constructor() {
    this.dataPath = path.join(process.cwd(), 'data', 'database.json');
    this.database = this.getEmptyDatabase();
  }

  private getEmptyDatabase(): FileDatabase {
    return {
      users: [],
      content: [],
      categories: [],
      genres: [],
      userRatings: [],
      userComments: [],
      userReviews: [],
      reviewLikes: [],
      episodes: [],
      castMembers: [],
      contentCast: [],
      contentImages: [],
      externalRatings: [],
      contentGenres: [],
      contentCategories: []
    };
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      // إنشاء مجلد data إذا لم يكن موجوداً
      await fs.mkdir(path.dirname(this.dataPath), { recursive: true });
      
      // قراءة قاعدة البيانات من الملف إذا كانت موجودة
      try {
        const data = await fs.readFile(this.dataPath, 'utf-8');
        this.database = JSON.parse(data);
      } catch (error) {
        // إذا لم يكن الملف موجوداً، إنشاء البيانات الافتراضية
        await this.createDefaultData();
        await this.saveToFile();
      }
      
      this.initialized = true;
    } catch (error) {
      console.error('خطأ في تهيئة FileStorage:', error);
      this.database = this.getEmptyDatabase();
      await this.createDefaultData();
      this.initialized = true;
    }
  }

  private async saveToFile(): Promise<void> {
    try {
      await fs.writeFile(this.dataPath, JSON.stringify(this.database, null, 2), 'utf-8');
    } catch (error) {
      console.error('خطأ في حفظ البيانات:', error);
    }
  }

  private async createDefaultData(): Promise<void> {
    // إضافة الفئات الافتراضية
    this.database.categories = [
      { id: 1, name: 'arabic', nameArabic: 'عربي', description: 'محتوى عربي', createdAt: new Date(), updatedAt: new Date() },
      { id: 2, name: 'foreign', nameArabic: 'أجنبي', description: 'محتوى أجنبي', createdAt: new Date(), updatedAt: new Date() },
      { id: 3, name: 'hindi', nameArabic: 'هندي', description: 'محتوى هندي', createdAt: new Date(), updatedAt: new Date() },
      { id: 4, name: 'turkish', nameArabic: 'تركي', description: 'محتوى تركي', createdAt: new Date(), updatedAt: new Date() },
      { id: 5, name: 'korean', nameArabic: 'كوري', description: 'محتوى كوري', createdAt: new Date(), updatedAt: new Date() },
      { id: 6, name: 'anime', nameArabic: 'أنمي', description: 'أنمي ياباني', createdAt: new Date(), updatedAt: new Date() },
      { id: 7, name: 'netflix', nameArabic: 'نتفليكس', description: 'محتوى نتفليكس', createdAt: new Date(), updatedAt: new Date() },
      { id: 8, name: 'documentary', nameArabic: 'وثائقي', description: 'أفلام وثائقية', createdAt: new Date(), updatedAt: new Date() },
      { id: 9, name: 'family', nameArabic: 'عائلي', description: 'محتوى عائلي', createdAt: new Date(), updatedAt: new Date() },
      { id: 10, name: 'sports', nameArabic: 'رياضي', description: 'محتوى رياضي', createdAt: new Date(), updatedAt: new Date() }
    ];

    // إضافة الأنواع الافتراضية
    this.database.genres = [
      { id: 1, name: 'action', nameArabic: 'اكشن', description: 'أفلام أكشن', createdAt: new Date(), updatedAt: new Date() },
      { id: 2, name: 'comedy', nameArabic: 'كوميديا', description: 'أفلام كوميدية', createdAt: new Date(), updatedAt: new Date() },
      { id: 3, name: 'drama', nameArabic: 'دراما', description: 'أفلام درامية', createdAt: new Date(), updatedAt: new Date() },
      { id: 4, name: 'romance', nameArabic: 'رومانسي', description: 'أفلام رومانسية', createdAt: new Date(), updatedAt: new Date() },
      { id: 5, name: 'thriller', nameArabic: 'إثارة', description: 'أفلام إثارة', createdAt: new Date(), updatedAt: new Date() },
      { id: 6, name: 'horror', nameArabic: 'رعب', description: 'أفلام رعب', createdAt: new Date(), updatedAt: new Date() },
      { id: 7, name: 'mystery', nameArabic: 'غموض', description: 'أفلام غموض', createdAt: new Date(), updatedAt: new Date() },
      { id: 8, name: 'crime', nameArabic: 'جريمة', description: 'أفلام جريمة', createdAt: new Date(), updatedAt: new Date() },
      { id: 9, name: 'adventure', nameArabic: 'مغامرة', description: 'أفلام مغامرة', createdAt: new Date(), updatedAt: new Date() },
      { id: 10, name: 'fantasy', nameArabic: 'فانتازيا', description: 'أفلام فانتازيا', createdAt: new Date(), updatedAt: new Date() },
      { id: 11, name: 'sci_fi', nameArabic: 'خيال علمي', description: 'أفلام خيال علمي', createdAt: new Date(), updatedAt: new Date() },
      { id: 12, name: 'documentary', nameArabic: 'وثائقي', description: 'أفلام وثائقية', createdAt: new Date(), updatedAt: new Date() },
      { id: 13, name: 'biography', nameArabic: 'سيرة ذاتية', description: 'أفلام سيرة ذاتية', createdAt: new Date(), updatedAt: new Date() },
      { id: 14, name: 'history', nameArabic: 'تاريخي', description: 'أفلام تاريخية', createdAt: new Date(), updatedAt: new Date() },
      { id: 15, name: 'war', nameArabic: 'حرب', description: 'أفلام حروب', createdAt: new Date(), updatedAt: new Date() }
    ];

    // إضافة محتوى تجريبي متنوع
    this.database.content = [
      {
        id: 1,
        title: 'Spider-Man: No Way Home',
        titleArabic: 'سبايدر مان: لا طريق للعودة',
        description: 'Peter Parker seeks help from Doctor Strange when his identity is revealed.',
        descriptionArabic: 'يطلب بيتر باركر المساعدة من الدكتور سترينج عندما يتم الكشف عن هويته.',
        type: 'movies',
        year: 2021,
        language: 'الإنجليزية',
        quality: 'WEB-DL',
        resolution: '4K',
        rating: '8.4',
        duration: 148,
        episodes: null,
        posterUrl: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
        videoUrl: 'https://example.com/spiderman.mp4',
        downloadUrl: 'https://example.com/download/spiderman.mp4',
        trailerUrl: 'https://www.youtube.com/watch?v=JfVOs4VSpmA',
        imdbId: 'tt10872600',
        tmdbId: '634649',
        rottenTomatoesScore: 90,
        metacriticScore: 71,
        country: 'الولايات المتحدة',
        budget: '$200 million',
        boxOffice: '$1.921 billion',
        awards: 'People\'s Choice Award',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        title: 'The Treasure',
        titleArabic: 'الكنز',
        description: 'Egyptian adventure movie about treasure hunting.',
        descriptionArabic: 'فيلم مصري مغامرات عن البحث عن الكنز.',
        type: 'movies',
        year: 2017,
        language: 'العربية',
        quality: 'HD',
        resolution: '1080p',
        rating: '8.2',
        duration: 165,
        episodes: null,
        posterUrl: 'https://image.tmdb.org/t/p/w500/treasure.jpg',
        videoUrl: 'https://example.com/treasure.mp4',
        downloadUrl: 'https://example.com/download/treasure.mp4',
        trailerUrl: 'https://www.youtube.com/watch?v=treasure123',
        imdbId: 'tt6854116',
        tmdbId: '455207',
        rottenTomatoesScore: 85,
        metacriticScore: 75,
        country: 'مصر',
        budget: '50 مليون جنيه',
        boxOffice: '100 مليون جنيه',
        awards: 'جائزة القاهرة السينمائي',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        title: 'Stranger Things',
        titleArabic: 'أشياء غريبة',
        description: 'Kids in a small town uncover supernatural mysteries.',
        descriptionArabic: 'أطفال في مدينة صغيرة يكتشفون أسراراً خارقة للطبيعة.',
        type: 'series',
        year: 2016,
        language: 'الإنجليزية',
        quality: 'WEB-DL',
        resolution: '4K',
        rating: '8.7',
        duration: 50,
        episodes: 42,
        posterUrl: 'https://image.tmdb.org/t/p/w500/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg',
        videoUrl: 'https://example.com/stranger-things.mp4',
        downloadUrl: 'https://example.com/download/stranger-things.mp4',
        trailerUrl: 'https://www.youtube.com/watch?v=b9EkMc79ZSU',
        imdbId: 'tt4574334',
        tmdbId: '66732',
        rottenTomatoesScore: 93,
        metacriticScore: 76,
        country: 'الولايات المتحدة',
        budget: '$30 million per season',
        boxOffice: 'N/A',
        awards: 'Emmy nominations',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        title: 'Al Hayba',
        titleArabic: 'الهيبة',
        description: 'Lebanese drama series about family conflicts.',
        descriptionArabic: 'مسلسل لبناني درامي عن الصراعات العائلية.',
        type: 'series',
        year: 2017,
        language: 'العربية',
        quality: 'HD',
        resolution: '1080p',
        rating: '8.9',
        duration: 45,
        episodes: 120,
        posterUrl: 'https://image.tmdb.org/t/p/w500/alhayba.jpg',
        videoUrl: 'https://example.com/alhayba.mp4',
        downloadUrl: 'https://example.com/download/alhayba.mp4',
        trailerUrl: 'https://www.youtube.com/watch?v=alhayba123',
        imdbId: 'tt7015404',
        tmdbId: '71712',
        rottenTomatoesScore: 88,
        metacriticScore: 80,
        country: 'لبنان',
        budget: '10 مليون دولار',
        boxOffice: 'N/A',
        awards: 'جائزة أفضل مسلسل عربي',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        title: 'WWE Monday Night Raw',
        titleArabic: 'دبليو دبليو إي ليلة الاثنين رو',
        description: 'Professional wrestling entertainment show.',
        descriptionArabic: 'برنامج مصارعة محترف ترفيهي.',
        type: 'tv',
        year: 2023,
        language: 'الإنجليزية',
        quality: 'HD',
        resolution: '1080p',
        rating: '7.5',
        duration: 180,
        episodes: null,
        posterUrl: 'https://image.tmdb.org/t/p/w500/wwe-raw.jpg',
        videoUrl: 'https://example.com/wwe-raw.mp4',
        downloadUrl: 'https://example.com/download/wwe-raw.mp4',
        trailerUrl: 'https://www.youtube.com/watch?v=wweraw123',
        imdbId: 'tt0239493',
        tmdbId: '12345',
        rottenTomatoesScore: 70,
        metacriticScore: 65,
        country: 'الولايات المتحدة',
        budget: 'N/A',
        boxOffice: 'N/A',
        awards: 'N/A',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 6,
        title: 'Fairuz Concert',
        titleArabic: 'حفلة فيروز',
        description: 'Legendary Lebanese singer performance.',
        descriptionArabic: 'أداء للمطربة اللبنانية الأسطورية فيروز.',
        type: 'misc',
        year: 2022,
        language: 'العربية',
        quality: 'HD',
        resolution: '1080p',
        rating: '9.0',
        duration: 90,
        episodes: null,
        posterUrl: 'https://image.tmdb.org/t/p/w500/fairuz.jpg',
        videoUrl: 'https://example.com/fairuz.mp4',
        downloadUrl: 'https://example.com/download/fairuz.mp4',
        trailerUrl: 'https://www.youtube.com/watch?v=fairuz123',
        imdbId: null,
        tmdbId: null,
        rottenTomatoesScore: null,
        metacriticScore: null,
        country: 'لبنان',
        budget: 'N/A',
        boxOffice: 'N/A',
        awards: 'جائزة أفضل أداء موسيقي',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // ربط المحتوى بالفئات والأنواع
    this.database.contentCategories = [
      { id: 1, contentId: 1, categoryId: 2 }, // Spider-Man -> أجنبي
      { id: 2, contentId: 2, categoryId: 1 }, // الكنز -> عربي
      { id: 3, contentId: 3, categoryId: 2 }, // Stranger Things -> أجنبي
      { id: 4, contentId: 4, categoryId: 1 }, // الهيبة -> عربي
      { id: 5, contentId: 5, categoryId: 10 }, // WWE -> رياضي
      { id: 6, contentId: 6, categoryId: 1 }, // فيروز -> عربي
    ];

    this.database.contentGenres = [
      { id: 1, contentId: 1, genreId: 1 }, // Spider-Man -> اكشن
      { id: 2, contentId: 1, genreId: 9 }, // Spider-Man -> مغامرة
      { id: 3, contentId: 2, genreId: 9 }, // الكنز -> مغامرة
      { id: 4, contentId: 2, genreId: 3 }, // الكنز -> دراما
      { id: 5, contentId: 3, genreId: 11 }, // Stranger Things -> خيال علمي
      { id: 6, contentId: 3, genreId: 6 }, // Stranger Things -> رعب
      { id: 7, contentId: 4, genreId: 3 }, // الهيبة -> دراما
      { id: 8, contentId: 4, genreId: 8 }, // الهيبة -> جريمة
    ];

    // إضافة مستخدم إداري افتراضي
    this.database.users = [
      {
        id: 1,
        username: 'admin',
        email: 'admin@yemenflix.com',
        password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj2h8J9H3/Ne', // password: admin123
        firstName: 'مدير',
        lastName: 'النظام',
        profileImageUrl: null,
        isAdmin: true,
        isActive: true,
        favorites: [],
        watchHistory: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }

  // تنفيذ دوال IStorage
  async getCategories(): Promise<Category[]> {
    await this.initialize();
    return this.database.categories;
  }

  async getGenres(): Promise<Genre[]> {
    await this.initialize();
    return this.database.genres;
  }

  async getContentByType(type: string, page: number = 1, limit: number = 24): Promise<{ content: Content[]; total: number }> {
    await this.initialize();
    
    let filteredContent = this.database.content.filter(item => 
      item.isActive && (type === 'all' || item.type === type)
    );

    const total = filteredContent.length;
    const startIndex = (page - 1) * limit;
    const content = filteredContent.slice(startIndex, startIndex + limit);

    return { content, total };
  }

  async getContentById(id: number): Promise<Content | null> {
    await this.initialize();
    return this.database.content.find(item => item.id === id && item.isActive) || null;
  }

  async searchContent(query: string, filters?: any): Promise<Content[]> {
    await this.initialize();
    
    const searchTerm = query.toLowerCase();
    return this.database.content.filter(item => {
      if (!item.isActive) return false;
      
      const matchesSearch = 
        item.title.toLowerCase().includes(searchTerm) ||
        item.titleArabic.toLowerCase().includes(searchTerm) ||
        (item.description && item.description.toLowerCase().includes(searchTerm)) ||
        (item.descriptionArabic && item.descriptionArabic.toLowerCase().includes(searchTerm));

      if (!matchesSearch) return false;

      // تطبيق الفلاتر الإضافية
      if (filters?.type && item.type !== filters.type) return false;
      if (filters?.year && item.year !== parseInt(filters.year)) return false;
      if (filters?.language && item.language !== filters.language) return false;

      return true;
    });
  }

  async createContent(data: Omit<Content, 'id' | 'createdAt' | 'updatedAt'>): Promise<Content> {
    await this.initialize();
    
    const newContent: Content = {
      id: Math.max(0, ...this.database.content.map(c => c.id)) + 1,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.database.content.push(newContent);
    await this.saveToFile();
    
    return newContent;
  }

  async updateContent(id: number, data: Partial<Content>): Promise<Content | null> {
    await this.initialize();
    
    const index = this.database.content.findIndex(item => item.id === id);
    if (index === -1) return null;

    this.database.content[index] = {
      ...this.database.content[index],
      ...data,
      updatedAt: new Date()
    };

    await this.saveToFile();
    return this.database.content[index];
  }

  async deleteContent(id: number): Promise<boolean> {
    await this.initialize();
    
    const index = this.database.content.findIndex(item => item.id === id);
    if (index === -1) return false;

    this.database.content[index].isActive = false;
    await this.saveToFile();
    
    return true;
  }

  // باقي الدوال المطلوبة من IStorage
  async getUsers(): Promise<User[]> {
    await this.initialize();
    return this.database.users;
  }

  async getUserById(id: number): Promise<User | null> {
    await this.initialize();
    return this.database.users.find(user => user.id === id) || null;
  }

  async getUserByUsername(username: string): Promise<User | null> {
    await this.initialize();
    return this.database.users.find(user => user.username === username) || null;
  }

  async createUser(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    await this.initialize();
    
    const newUser: User = {
      id: Math.max(0, ...this.database.users.map(u => u.id)) + 1,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.database.users.push(newUser);
    await this.saveToFile();
    
    return newUser;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User | null> {
    await this.initialize();
    
    const index = this.database.users.findIndex(user => user.id === id);
    if (index === -1) return null;

    this.database.users[index] = {
      ...this.database.users[index],
      ...data,
      updatedAt: new Date()
    };

    await this.saveToFile();
    return this.database.users[index];
  }

  // دوال إضافية مطلوبة
  async getUserRatings(userId: number): Promise<UserRating[]> {
    await this.initialize();
    return this.database.userRatings.filter(rating => rating.userId === userId);
  }

  async getContentRating(contentId: number): Promise<number> {
    await this.initialize();
    const ratings = this.database.userRatings.filter(rating => rating.contentId === contentId);
    if (ratings.length === 0) return 0;
    
    const average = ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length;
    return Math.round(average * 10) / 10;
  }

  async createUserRating(data: Omit<UserRating, 'id' | 'createdAt'>): Promise<UserRating> {
    await this.initialize();
    
    const newRating: UserRating = {
      id: Math.max(0, ...this.database.userRatings.map(r => r.id)) + 1,
      ...data,
      createdAt: new Date()
    };

    this.database.userRatings.push(newRating);
    await this.saveToFile();
    
    return newRating;
  }

  async getContentComments(contentId: number): Promise<UserComment[]> {
    await this.initialize();
    return this.database.userComments.filter(comment => 
      comment.contentId === contentId && comment.isActive
    );
  }

  async createUserComment(data: Omit<UserComment, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserComment> {
    await this.initialize();
    
    const newComment: UserComment = {
      id: Math.max(0, ...this.database.userComments.map(c => c.id)) + 1,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.database.userComments.push(newComment);
    await this.saveToFile();
    
    return newComment;
  }

  async getContentReviews(contentId: number): Promise<UserReview[]> {
    await this.initialize();
    return this.database.userReviews.filter(review => 
      review.contentId === contentId && review.isActive
    );
  }

  async createUserReview(data: Omit<UserReview, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserReview> {
    await this.initialize();
    
    const newReview: UserReview = {
      id: Math.max(0, ...this.database.userReviews.map(r => r.id)) + 1,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.database.userReviews.push(newReview);
    await this.saveToFile();
    
    return newReview;
  }

  // دوال إضافية حسب الحاجة
  async getFeaturedContent(): Promise<Content[]> {
    await this.initialize();
    return this.database.content
      .filter(item => item.isActive && parseFloat(item.rating || '0') >= 8.0)
      .slice(0, 6);
  }

  async getTrendingContent(): Promise<Content[]> {
    await this.initialize();
    return this.database.content
      .filter(item => item.isActive && item.year >= 2020)
      .sort((a, b) => parseFloat(b.rating || '0') - parseFloat(a.rating || '0'))
      .slice(0, 6);
  }

  async getStats(): Promise<any> {
    await this.initialize();
    return {
      totalContent: this.database.content.filter(c => c.isActive).length,
      totalUsers: this.database.users.length,
      totalCategories: this.database.categories.length,
      totalGenres: this.database.genres.length,
      movieCount: this.database.content.filter(c => c.isActive && c.type === 'movies').length,
      seriesCount: this.database.content.filter(c => c.isActive && c.type === 'series').length,
      tvCount: this.database.content.filter(c => c.isActive && c.type === 'tv').length,
      miscCount: this.database.content.filter(c => c.isActive && c.type === 'misc').length
    };
  }
}