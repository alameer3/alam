import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class DatabaseManager {
  constructor() {
    this.dataPath = path.join(__dirname, 'database.json');
    this.data = this.loadData();
  }

  loadData() {
    try {
      const data = fs.readFileSync(this.dataPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading database:', error);
      return this.getDefaultData();
    }
  }

  saveData() {
    try {
      fs.writeFileSync(this.dataPath, JSON.stringify(this.data, null, 2));
    } catch (error) {
      console.error('Error saving database:', error);
    }
  }

  getDefaultData() {
    return {
      categories: [],
      genres: [],
      users: [],
      content: [],
      content_categories: [],
      content_genres: []
    };
  }

  // Categories
  async getCategories() {
    return this.data.categories || [];
  }

  async getCategoryById(id) {
    return this.data.categories.find(cat => cat.id === parseInt(id));
  }

  async createCategory(categoryData) {
    const newId = Math.max(...this.data.categories.map(c => c.id), 0) + 1;
    const category = {
      id: newId,
      ...categoryData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.data.categories.push(category);
    this.saveData();
    return category;
  }

  // Genres
  async getGenres() {
    return this.data.genres || [];
  }

  async getGenreById(id) {
    return this.data.genres.find(genre => genre.id === parseInt(id));
  }

  async createGenre(genreData) {
    const newId = Math.max(...this.data.genres.map(g => g.id), 0) + 1;
    const genre = {
      id: newId,
      ...genreData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.data.genres.push(genre);
    this.saveData();
    return genre;
  }

  // Users
  async getUsers() {
    return this.data.users || [];
  }

  async getUserById(id) {
    return this.data.users.find(user => user.id === parseInt(id));
  }

  async getUserByEmail(email) {
    return this.data.users.find(user => user.email === email);
  }

  async getUserByUsername(username) {
    return this.data.users.find(user => user.username === username);
  }

  async createUser(userData) {
    const newId = Math.max(...this.data.users.map(u => u.id), 0) + 1;
    const user = {
      id: newId,
      ...userData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.data.users.push(user);
    this.saveData();
    return user;
  }

  // Content
  async getContent(filters = {}) {
    let content = this.data.content || [];
    
    // Apply filters
    if (filters.type) {
      content = content.filter(c => c.type === filters.type);
    }
    
    if (filters.category) {
      const categoryRelations = this.data.content_categories.filter(cc => 
        cc.category_id === parseInt(filters.category)
      );
      const contentIds = categoryRelations.map(cc => cc.content_id);
      content = content.filter(c => contentIds.includes(c.id));
    }
    
    if (filters.genre) {
      const genreRelations = this.data.content_genres.filter(cg => 
        cg.genre_id === parseInt(filters.genre)
      );
      const contentIds = genreRelations.map(cg => cg.content_id);
      content = content.filter(c => contentIds.includes(c.id));
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      content = content.filter(c => 
        c.title.toLowerCase().includes(searchTerm) || 
        c.title_arabic.toLowerCase().includes(searchTerm) ||
        c.description.toLowerCase().includes(searchTerm) ||
        c.description_arabic.toLowerCase().includes(searchTerm)
      );
    }
    
    if (filters.language) {
      content = content.filter(c => c.language === filters.language);
    }
    
    if (filters.year) {
      content = content.filter(c => c.year === parseInt(filters.year));
    }
    
    if (filters.quality) {
      content = content.filter(c => c.quality === filters.quality);
    }
    
    // Only active content
    content = content.filter(c => c.is_active === true);
    
    // Pagination
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 24;
    const offset = (page - 1) * limit;
    
    const total = content.length;
    const paginatedContent = content.slice(offset, offset + limit);
    
    return {
      content: paginatedContent,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async getContentById(id) {
    const content = this.data.content.find(c => c.id === parseInt(id));
    if (!content) return null;
    
    // Get categories
    const categoryRelations = this.data.content_categories.filter(cc => cc.content_id === content.id);
    const categories = categoryRelations.map(cc => this.data.categories.find(cat => cat.id === cc.category_id));
    
    // Get genres
    const genreRelations = this.data.content_genres.filter(cg => cg.content_id === content.id);
    const genres = genreRelations.map(cg => this.data.genres.find(genre => genre.id === cg.genre_id));
    
    return {
      ...content,
      categories: categories.filter(Boolean),
      genres: genres.filter(Boolean)
    };
  }

  async createContent(contentData) {
    const newId = Math.max(...this.data.content.map(c => c.id), 0) + 1;
    const content = {
      id: newId,
      ...contentData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.data.content.push(content);
    this.saveData();
    return content;
  }

  async updateContent(id, contentData) {
    const index = this.data.content.findIndex(c => c.id === parseInt(id));
    if (index === -1) return null;
    
    this.data.content[index] = {
      ...this.data.content[index],
      ...contentData,
      updated_at: new Date().toISOString()
    };
    this.saveData();
    return this.data.content[index];
  }

  async deleteContent(id) {
    const index = this.data.content.findIndex(c => c.id === parseInt(id));
    if (index === -1) return false;
    
    this.data.content.splice(index, 1);
    
    // Remove relations
    this.data.content_categories = this.data.content_categories.filter(cc => cc.content_id !== parseInt(id));
    this.data.content_genres = this.data.content_genres.filter(cg => cg.content_id !== parseInt(id));
    
    this.saveData();
    return true;
  }

  // Search
  async searchContent(query, filters = {}) {
    return this.getContent({ ...filters, search: query });
  }

  // Featured and trending content
  async getFeaturedContent() {
    const content = this.data.content.filter(c => c.is_active === true);
    return content.slice(0, 8); // Return first 8 as featured
  }

  async getTrendingContent() {
    const content = this.data.content.filter(c => c.is_active === true);
    // Sort by rating and return top 8
    return content.sort((a, b) => b.rating - a.rating).slice(0, 8);
  }

  // Stats
  async getStats() {
    const content = this.data.content || [];
    const users = this.data.users || [];
    const categories = this.data.categories || [];
    const genres = this.data.genres || [];
    
    return {
      totalContent: content.length,
      totalMovies: content.filter(c => c.type === 'movie').length,
      totalSeries: content.filter(c => c.type === 'series').length,
      totalUsers: users.length,
      totalCategories: categories.length,
      totalGenres: genres.length
    };
  }

  // Content relations
  async addContentCategory(contentId, categoryId) {
    const newId = Math.max(...this.data.content_categories.map(cc => cc.id), 0) + 1;
    const relation = {
      id: newId,
      content_id: parseInt(contentId),
      category_id: parseInt(categoryId)
    };
    this.data.content_categories.push(relation);
    this.saveData();
    return relation;
  }

  async addContentGenre(contentId, genreId) {
    const newId = Math.max(...this.data.content_genres.map(cg => cg.id), 0) + 1;
    const relation = {
      id: newId,
      content_id: parseInt(contentId),
      genre_id: parseInt(genreId)
    };
    this.data.content_genres.push(relation);
    this.saveData();
    return relation;
  }

  async removeContentCategory(contentId, categoryId) {
    this.data.content_categories = this.data.content_categories.filter(cc => 
      !(cc.content_id === parseInt(contentId) && cc.category_id === parseInt(categoryId))
    );
    this.saveData();
    return true;
  }

  async removeContentGenre(contentId, genreId) {
    this.data.content_genres = this.data.content_genres.filter(cg => 
      !(cg.content_id === parseInt(contentId) && cg.genre_id === parseInt(genreId))
    );
    this.saveData();
    return true;
  }
}

export const dbManager = new DatabaseManager();