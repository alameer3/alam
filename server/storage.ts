import type { 
  User, Content, Episode, Category, Genre, Person, Review, Comment, 
  DownloadLink, StreamingLink, UserInteraction, WatchHistory, 
  SiteSettings, Notification, Advertisement, Subscription, 
  ActivityLog, Report, ApiResponse, SearchFilters, DashboardStats 
} from '../shared/types.js';

export interface IStorage {
  // Content methods
  getContent(filters?: SearchFilters): Promise<ApiResponse<Content[]>>;
  getContentById(id: number): Promise<Content | null>;
  createContent(content: Omit<Content, 'id' | 'createdAt' | 'updatedAt'>): Promise<Content>;
  updateContent(id: number, updates: Partial<Content>): Promise<Content>;
  deleteContent(id: number): Promise<boolean>;
  
  // Categories methods
  getCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | null>;
  createCategory(category: Omit<Category, 'id'>): Promise<Category>;
  updateCategory(id: number, updates: Partial<Category>): Promise<Category>;
  deleteCategory(id: number): Promise<boolean>;
  
  // Genres methods
  getGenres(): Promise<Genre[]>;
  getGenreById(id: number): Promise<Genre | null>;
  createGenre(genre: Omit<Genre, 'id'>): Promise<Genre>;
  updateGenre(id: number, updates: Partial<Genre>): Promise<Genre>;
  deleteGenre(id: number): Promise<boolean>;
  
  // User methods
  getUsers(): Promise<User[]>;
  getUserById(id: number): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  getUserByUsername(username: string): Promise<User | null>;
  createUser(user: Omit<User, 'id' | 'joinDate'>): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User>;
  deleteUser(id: number): Promise<boolean>;
  
  // Dashboard stats
  getDashboardStats(): Promise<DashboardStats>;
  
  // Search methods
  searchContent(query: string, filters?: SearchFilters): Promise<ApiResponse<Content[]>>;
  
  // Episode methods
  getEpisodes(contentId: number): Promise<Episode[]>;
  getEpisodeById(id: number): Promise<Episode | null>;
  createEpisode(episode: Omit<Episode, 'id' | 'createdAt' | 'updatedAt'>): Promise<Episode>;
  updateEpisode(id: number, updates: Partial<Episode>): Promise<Episode>;
  deleteEpisode(id: number): Promise<boolean>;
  
  // Settings methods
  getSiteSettings(): Promise<SiteSettings>;
  updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings>;
}

// Memory storage implementation
export class MemoryStorage implements IStorage {
  private content: Content[] = [];
  private categories: Category[] = [];
  private genres: Genre[] = [];
  private users: User[] = [];
  private episodes: Episode[] = [];
  private siteSettings: SiteSettings = {
    id: 1,
    siteName: 'AK.SV',
    siteNameAr: 'أكوام',
    siteDescription: 'الموقع العربي الأول لتحميل ومشاهدة الأفلام والمسلسلات',
    siteKeywords: 'أفلام, مسلسلات, تحميل, مشاهدة',
    adminEmail: 'admin@akwam.com',
    theme: 'modern',
    language: 'ar',
    timezone: 'Asia/Riyadh',
    maxUploadSize: 100,
    allowRegistration: true,
    enableComments: true,
    enableRatings: true,
    enableDownloads: true,
    enableStreaming: true,
    maintenanceMode: false,
    maintenanceMessage: 'الموقع في وضع الصيانة'
  };
  
  private nextId = 1;
  
  constructor() {
    this.initializeDefaultData();
  }
  
  private initializeDefaultData(): void {
    // Initialize categories
    this.categories = [
      { id: 1, name: 'Arabic', nameAr: 'عربي', description: 'المحتوى العربي', icon: '🇸🇦', isActive: true, order: 1 },
      { id: 2, name: 'Foreign', nameAr: 'أجنبي', description: 'المحتوى الأجنبي', icon: '🌍', isActive: true, order: 2 },
      { id: 3, name: 'Turkish', nameAr: 'تركي', description: 'المحتوى التركي', icon: '🇹🇷', isActive: true, order: 3 },
      { id: 4, name: 'Korean', nameAr: 'كوري', description: 'المحتوى الكوري', icon: '🇰🇷', isActive: true, order: 4 },
      { id: 5, name: 'Hindi', nameAr: 'هندي', description: 'المحتوى الهندي', icon: '🇮🇳', isActive: true, order: 5 },
    ];
    
    // Initialize genres
    this.genres = [
      { id: 1, name: 'Action', nameAr: 'أكشن', description: 'أفلام ومسلسلات الأكشن', icon: '💥', isActive: true, order: 1 },
      { id: 2, name: 'Drama', nameAr: 'دراما', description: 'الأعمال الدرامية', icon: '🎭', isActive: true, order: 2 },
      { id: 3, name: 'Comedy', nameAr: 'كوميديا', description: 'الأعمال الكوميدية', icon: '😂', isActive: true, order: 3 },
      { id: 4, name: 'Romance', nameAr: 'رومانسي', description: 'الأعمال الرومانسية', icon: '💕', isActive: true, order: 4 },
      { id: 5, name: 'Horror', nameAr: 'رعب', description: 'أفلام الرعب', icon: '😱', isActive: true, order: 5 },
    ];
    
    // Initialize sample content
    this.content = [
      {
        id: 1,
        title: 'Sample Movie',
        titleAr: 'فيلم تجريبي',
        description: 'A sample movie description',
        descriptionAr: 'وصف فيلم تجريبي',
        type: 'movie',
        poster: '/serverdb/images/default-poster.svg',
        backdrop: '/serverdb/images/default-backdrop.svg',
        trailer: '',
        releaseDate: '2024-01-01',
        rating: 4.5,
        ratingCount: 100,
        duration: 120,
        language: 'Arabic',
        country: 'Saudi Arabia',
        quality: 'HD',
        status: 'completed',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        viewCount: 1500,
        downloadCount: 500,
        categories: [1],
        genres: [1, 2],
        cast: [],
        crew: []
      }
    ];
    
    this.nextId = Math.max(...this.content.map(c => c.id), ...this.categories.map(c => c.id), ...this.genres.map(g => g.id)) + 1;
  }
  
  async getContent(filters?: SearchFilters): Promise<ApiResponse<Content[]>> {
    let filteredContent = [...this.content];
    
    if (filters?.type) {
      filteredContent = filteredContent.filter(c => c.type === filters.type);
    }
    
    if (filters?.category) {
      filteredContent = filteredContent.filter(c => c.categories.includes(filters.category!));
    }
    
    if (filters?.genre) {
      filteredContent = filteredContent.filter(c => c.genres.includes(filters.genre!));
    }
    
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      filteredContent = filteredContent.filter(c => 
        c.title.toLowerCase().includes(searchLower) ||
        c.titleAr.toLowerCase().includes(searchLower) ||
        c.description.toLowerCase().includes(searchLower) ||
        c.descriptionAr.toLowerCase().includes(searchLower)
      );
    }
    
    // Pagination
    const page = filters?.page || 1;
    const limit = filters?.limit || 24;
    const offset = (page - 1) * limit;
    
    const paginatedContent = filteredContent.slice(offset, offset + limit);
    
    return {
      data: paginatedContent,
      pagination: {
        page,
        limit,
        total: filteredContent.length,
        totalPages: Math.ceil(filteredContent.length / limit)
      }
    };
  }
  
  async getContentById(id: number): Promise<Content | null> {
    return this.content.find(c => c.id === id) || null;
  }
  
  async createContent(content: Omit<Content, 'id' | 'createdAt' | 'updatedAt'>): Promise<Content> {
    const newContent: Content = {
      ...content,
      id: this.nextId++,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.content.push(newContent);
    return newContent;
  }
  
  async updateContent(id: number, updates: Partial<Content>): Promise<Content> {
    const index = this.content.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Content not found');
    }
    
    this.content[index] = {
      ...this.content[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return this.content[index];
  }
  
  async deleteContent(id: number): Promise<boolean> {
    const index = this.content.findIndex(c => c.id === id);
    if (index === -1) {
      return false;
    }
    
    this.content.splice(index, 1);
    return true;
  }
  
  async getCategories(): Promise<Category[]> {
    return this.categories.filter(c => c.isActive);
  }
  
  async getCategoryById(id: number): Promise<Category | null> {
    return this.categories.find(c => c.id === id) || null;
  }
  
  async createCategory(category: Omit<Category, 'id'>): Promise<Category> {
    const newCategory: Category = {
      ...category,
      id: this.nextId++
    };
    
    this.categories.push(newCategory);
    return newCategory;
  }
  
  async updateCategory(id: number, updates: Partial<Category>): Promise<Category> {
    const index = this.categories.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Category not found');
    }
    
    this.categories[index] = { ...this.categories[index], ...updates };
    return this.categories[index];
  }
  
  async deleteCategory(id: number): Promise<boolean> {
    const index = this.categories.findIndex(c => c.id === id);
    if (index === -1) {
      return false;
    }
    
    this.categories.splice(index, 1);
    return true;
  }
  
  async getGenres(): Promise<Genre[]> {
    return this.genres.filter(g => g.isActive);
  }
  
  async getGenreById(id: number): Promise<Genre | null> {
    return this.genres.find(g => g.id === id) || null;
  }
  
  async createGenre(genre: Omit<Genre, 'id'>): Promise<Genre> {
    const newGenre: Genre = {
      ...genre,
      id: this.nextId++
    };
    
    this.genres.push(newGenre);
    return newGenre;
  }
  
  async updateGenre(id: number, updates: Partial<Genre>): Promise<Genre> {
    const index = this.genres.findIndex(g => g.id === id);
    if (index === -1) {
      throw new Error('Genre not found');
    }
    
    this.genres[index] = { ...this.genres[index], ...updates };
    return this.genres[index];
  }
  
  async deleteGenre(id: number): Promise<boolean> {
    const index = this.genres.findIndex(g => g.id === id);
    if (index === -1) {
      return false;
    }
    
    this.genres.splice(index, 1);
    return true;
  }
  
  async getUsers(): Promise<User[]> {
    return this.users;
  }
  
  async getUserById(id: number): Promise<User | null> {
    return this.users.find(u => u.id === id) || null;
  }
  
  async getUserByEmail(email: string): Promise<User | null> {
    return this.users.find(u => u.email === email) || null;
  }
  
  async getUserByUsername(username: string): Promise<User | null> {
    return this.users.find(u => u.username === username) || null;
  }
  
  async createUser(user: Omit<User, 'id' | 'joinDate'>): Promise<User> {
    const newUser: User = {
      ...user,
      id: this.nextId++,
      joinDate: new Date().toISOString()
    };
    
    this.users.push(newUser);
    return newUser;
  }
  
  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) {
      throw new Error('User not found');
    }
    
    this.users[index] = { ...this.users[index], ...updates };
    return this.users[index];
  }
  
  async deleteUser(id: number): Promise<boolean> {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) {
      return false;
    }
    
    this.users.splice(index, 1);
    return true;
  }
  
  async getDashboardStats(): Promise<DashboardStats> {
    return {
      totalContent: this.content.length,
      totalUsers: this.users.length,
      totalCategories: this.categories.length,
      totalGenres: this.genres.length,
      totalViews: this.content.reduce((sum, c) => sum + c.viewCount, 0),
      totalDownloads: this.content.reduce((sum, c) => sum + c.downloadCount, 0),
      recentContent: this.content.slice(-10),
      topRatedContent: this.content.sort((a, b) => b.rating - a.rating).slice(0, 10),
      mostViewedContent: this.content.sort((a, b) => b.viewCount - a.viewCount).slice(0, 10)
    };
  }
  
  async searchContent(query: string, filters?: SearchFilters): Promise<ApiResponse<Content[]>> {
    return this.getContent({ ...filters, search: query });
  }
  
  async getEpisodes(contentId: number): Promise<Episode[]> {
    return this.episodes.filter(e => e.contentId === contentId);
  }
  
  async getEpisodeById(id: number): Promise<Episode | null> {
    return this.episodes.find(e => e.id === id) || null;
  }
  
  async createEpisode(episode: Omit<Episode, 'id' | 'createdAt' | 'updatedAt'>): Promise<Episode> {
    const newEpisode: Episode = {
      ...episode,
      id: this.nextId++,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.episodes.push(newEpisode);
    return newEpisode;
  }
  
  async updateEpisode(id: number, updates: Partial<Episode>): Promise<Episode> {
    const index = this.episodes.findIndex(e => e.id === id);
    if (index === -1) {
      throw new Error('Episode not found');
    }
    
    this.episodes[index] = {
      ...this.episodes[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return this.episodes[index];
  }
  
  async deleteEpisode(id: number): Promise<boolean> {
    const index = this.episodes.findIndex(e => e.id === id);
    if (index === -1) {
      return false;
    }
    
    this.episodes.splice(index, 1);
    return true;
  }
  
  async getSiteSettings(): Promise<SiteSettings> {
    return this.siteSettings;
  }
  
  async updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    this.siteSettings = { ...this.siteSettings, ...settings };
    return this.siteSettings;
  }
}

export const storage = new MemoryStorage();