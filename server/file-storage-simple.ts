import fs from 'fs/promises';
import path from 'path';

// نظام تخزين بسيط بالملفات - يمكن رفعه على GitHub
export class SimpleFileStorage {
  private dataPath: string;
  private data: any = {};
  private initialized = false;

  constructor() {
    this.dataPath = path.join(process.cwd(), 'data', 'storage.json');
  }

  async initialize() {
    if (this.initialized) return;
    
    try {
      await fs.mkdir(path.dirname(this.dataPath), { recursive: true });
      
      try {
        const fileContent = await fs.readFile(this.dataPath, 'utf-8');
        this.data = JSON.parse(fileContent);
      } catch {
        // إنشاء البيانات الافتراضية
        this.data = await this.createDefaultData();
        await this.save();
      }
      
      this.initialized = true;
    } catch (error) {
      // Log error only in development environment
      if (process.env.NODE_ENV === 'development') {
        console.error('خطأ في تهيئة FileStorage:', error);
      }
      this.data = await this.createDefaultData();
      this.initialized = true;
    }
  }

  private async createDefaultData() {
    return {
      categories: [
        { id: 1, name: 'arabic', nameArabic: 'عربي', description: 'محتوى عربي' },
        { id: 2, name: 'foreign', nameArabic: 'أجنبي', description: 'محتوى أجنبي' },
        { id: 3, name: 'hindi', nameArabic: 'هندي', description: 'محتوى هندي' },
        { id: 4, name: 'turkish', nameArabic: 'تركي', description: 'محتوى تركي' },
        { id: 5, name: 'korean', nameArabic: 'كوري', description: 'محتوى كوري' },
        { id: 6, name: 'anime', nameArabic: 'أنمي', description: 'أنمي ياباني' },
        { id: 7, name: 'netflix', nameArabic: 'نتفليكس', description: 'محتوى نتفليكس' },
        { id: 8, name: 'documentary', nameArabic: 'وثائقي', description: 'أفلام وثائقية' },
        { id: 9, name: 'family', nameArabic: 'عائلي', description: 'محتوى عائلي' },
        { id: 10, name: 'sports', nameArabic: 'رياضي', description: 'محتوى رياضي' }
      ],
      genres: [
        { id: 1, name: 'action', nameArabic: 'اكشن', description: 'أفلام أكشن' },
        { id: 2, name: 'comedy', nameArabic: 'كوميديا', description: 'أفلام كوميدية' },
        { id: 3, name: 'drama', nameArabic: 'دراما', description: 'أفلام درامية' },
        { id: 4, name: 'romance', nameArabic: 'رومانسي', description: 'أفلام رومانسية' },
        { id: 5, name: 'thriller', nameArabic: 'إثارة', description: 'أفلام إثارة' },
        { id: 6, name: 'horror', nameArabic: 'رعب', description: 'أفلام رعب' },
        { id: 7, name: 'mystery', nameArabic: 'غموض', description: 'أفلام غموض' },
        { id: 8, name: 'crime', nameArabic: 'جريمة', description: 'أفلام جريمة' },
        { id: 9, name: 'adventure', nameArabic: 'مغامرة', description: 'أفلام مغامرة' },
        { id: 10, name: 'fantasy', nameArabic: 'فانتازيا', description: 'أفلام فانتازيا' },
        { id: 11, name: 'sci_fi', nameArabic: 'خيال علمي', description: 'أفلام خيال علمي' },
        { id: 12, name: 'documentary', nameArabic: 'وثائقي', description: 'أفلام وثائقية' },
        { id: 13, name: 'biography', nameArabic: 'سيرة ذاتية', description: 'أفلام سيرة ذاتية' },
        { id: 14, name: 'history', nameArabic: 'تاريخي', description: 'أفلام تاريخية' },
        { id: 15, name: 'war', nameArabic: 'حرب', description: 'أفلام حروب' }
      ],
      content: [
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
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
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
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
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
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
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
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 5,
          title: 'Top Gun: Maverick',
          titleArabic: 'توب غان: مافريك',
          description: 'Action sequel with Tom Cruise.',
          descriptionArabic: 'فيلم اكشن متتالي مع توم كروز.',
          type: 'movies',
          year: 2022,
          language: 'الإنجليزية',
          quality: 'WEB-DL',
          resolution: '4K',
          rating: '8.3',
          duration: 130,
          episodes: null,
          posterUrl: 'https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg',
          videoUrl: 'https://example.com/topgun.mp4',
          downloadUrl: 'https://example.com/download/topgun.mp4',
          trailerUrl: 'https://www.youtube.com/watch?v=qSqVVswa420',
          imdbId: 'tt1745960',
          tmdbId: '361743',
          rottenTomatoesScore: 96,
          metacriticScore: 78,
          country: 'الولايات المتحدة',
          budget: '$170 million',
          boxOffice: '$1.488 billion',
          awards: 'Academy Award nomination',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 6,
          title: 'Welad Rizk',
          titleArabic: 'ولاد رزق',
          description: 'Egyptian action crime movie.',
          descriptionArabic: 'فيلم مصري اكشن جريمة.',
          type: 'movies',
          year: 2015,
          language: 'العربية',
          quality: 'HD',
          resolution: '1080p',
          rating: '7.8',
          duration: 103,
          episodes: null,
          posterUrl: 'https://image.tmdb.org/t/p/w500/weladrisk.jpg',
          videoUrl: 'https://example.com/weladrisk.mp4',
          downloadUrl: 'https://example.com/download/weladrisk.mp4',
          trailerUrl: 'https://www.youtube.com/watch?v=weladrisk123',
          imdbId: 'tt4574336',
          tmdbId: '355432',
          rottenTomatoesScore: 82,
          metacriticScore: 72,
          country: 'مصر',
          budget: '30 مليون جنيه',
          boxOffice: '80 مليون جنيه',
          awards: 'جائزة أفضل فيلم أكشن',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 7,
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
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 8,
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
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ],
      users: [
        {
          id: 1,
          username: 'admin',
          email: 'admin@yemenflix.com',
          password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj2h8J9H3/Ne',
          firstName: 'مدير',
          lastName: 'النظام',
          profileImageUrl: null,
          isAdmin: true,
          isActive: true,
          favorites: [],
          watchHistory: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };
  }

  private async save() {
    try {
      await fs.writeFile(this.dataPath, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (error) {
      // Log save errors only in development
      if (process.env.NODE_ENV === 'development') {
        console.error('خطأ في حفظ البيانات:', error);
      }
    }
  }

  // دوال الوصول للبيانات
  async getCategories() {
    await this.initialize();
    return this.data.categories || [];
  }

  async getGenres() {
    await this.initialize();
    return this.data.genres || [];
  }

  async getContentByType(type: string, page: number = 1, limit: number = 24) {
    await this.initialize();
    
    let content = this.data.content || [];
    
    if (type !== 'all') {
      content = content.filter((item: any) => item.type === type && item.isActive);
    } else {
      content = content.filter((item: any) => item.isActive);
    }

    const total = content.length;
    const startIndex = (page - 1) * limit;
    const paginatedContent = content.slice(startIndex, startIndex + limit);

    return { content: paginatedContent, total };
  }

  async getContentById(id: number) {
    await this.initialize();
    const content = this.data.content || [];
    return content.find((item: any) => item.id === id && item.isActive) || null;
  }

  async searchContent(query: string, filters?: any) {
    await this.initialize();
    
    const content = this.data.content || [];
    const searchTerm = query.toLowerCase();
    
    return content.filter((item: any) => {
      if (!item.isActive) return false;
      
      const matchesSearch = 
        item.title.toLowerCase().includes(searchTerm) ||
        item.titleArabic.toLowerCase().includes(searchTerm) ||
        (item.description && item.description.toLowerCase().includes(searchTerm)) ||
        (item.descriptionArabic && item.descriptionArabic.toLowerCase().includes(searchTerm));

      if (!matchesSearch) return false;

      if (filters?.type && item.type !== filters.type) return false;
      if (filters?.year && item.year !== parseInt(filters.year)) return false;
      if (filters?.language && item.language !== filters.language) return false;

      return true;
    });
  }

  async getStats() {
    await this.initialize();
    const content = this.data.content || [];
    const activeContent = content.filter((item: any) => item.isActive);
    
    return {
      totalContent: activeContent.length,
      totalUsers: (this.data.users || []).length,
      totalCategories: (this.data.categories || []).length,
      totalGenres: (this.data.genres || []).length,
      movieCount: activeContent.filter((item: any) => item.type === 'movies').length,
      seriesCount: activeContent.filter((item: any) => item.type === 'series').length,
      tvCount: activeContent.filter((item: any) => item.type === 'tv').length,
      miscCount: activeContent.filter((item: any) => item.type === 'misc').length
    };
  }

  async getFeaturedContent() {
    await this.initialize();
    const content = this.data.content || [];
    return content
      .filter((item: any) => item.isActive && parseFloat(item.rating || '0') >= 8.0)
      .slice(0, 6);
  }

  async getTrendingContent() {
    await this.initialize();
    const content = this.data.content || [];
    return content
      .filter((item: any) => item.isActive && item.year >= 2020)
      .sort((a: any, b: any) => parseFloat(b.rating || '0') - parseFloat(a.rating || '0'))
      .slice(0, 6);
  }
}

// إنشاء مثيل واحد للاستخدام في التطبيق
export const fileStorage = new SimpleFileStorage();