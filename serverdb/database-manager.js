import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class DatabaseManager {
  constructor() {
    this.dataPath = path.join(__dirname, 'database.json');
    this.data = this.loadData();
    
    // Ensure all required collections exist
    if (!this.data.userFavorites) this.data.userFavorites = [];
    if (!this.data.userWatchHistory) this.data.userWatchHistory = [];
    if (!this.data.userComments) this.data.userComments = [];
    if (!this.data.userReviews) this.data.userReviews = [];
    if (!this.data.reviewLikes) this.data.reviewLikes = [];
    if (!this.data.contentViews) this.data.contentViews = [];
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

  // User Favorites
  async addToFavorites(userId, contentId) {
    const newId = Math.max(...(this.data.userFavorites?.map(f => f.id) || [0])) + 1;
    const favorite = {
      id: newId,
      user_id: parseInt(userId),
      content_id: parseInt(contentId),
      added_at: new Date().toISOString()
    };
    this.data.userFavorites.push(favorite);
    this.saveData();
    return favorite;
  }

  async removeFromFavorites(userId, contentId) {
    this.data.userFavorites = this.data.userFavorites.filter(f => 
      !(f.user_id === parseInt(userId) && f.content_id === parseInt(contentId))
    );
    this.saveData();
    return true;
  }

  async getUserFavorites(userId) {
    const favorites = this.data.userFavorites.filter(f => f.user_id === parseInt(userId));
    return favorites.map(f => {
      const content = this.data.content.find(c => c.id === f.content_id);
      return {
        ...f,
        content: content || null
      };
    }).filter(f => f.content);
  }

  // User Watch History
  async addToWatchHistory(userId, contentId, progressMinutes = 0) {
    // Check if entry already exists
    const existingIndex = this.data.userWatchHistory.findIndex(h => 
      h.user_id === parseInt(userId) && h.content_id === parseInt(contentId)
    );

    if (existingIndex !== -1) {
      // Update existing entry
      this.data.userWatchHistory[existingIndex] = {
        ...this.data.userWatchHistory[existingIndex],
        progress_minutes: progressMinutes,
        last_watched: new Date().toISOString()
      };
    } else {
      // Create new entry
      const newId = Math.max(...(this.data.userWatchHistory?.map(h => h.id) || [0])) + 1;
      const history = {
        id: newId,
        user_id: parseInt(userId),
        content_id: parseInt(contentId),
        progress_minutes: progressMinutes,
        first_watched: new Date().toISOString(),
        last_watched: new Date().toISOString()
      };
      this.data.userWatchHistory.push(history);
    }
    this.saveData();
    return true;
  }

  async getUserWatchHistory(userId) {
    const history = this.data.userWatchHistory.filter(h => h.user_id === parseInt(userId));
    return history.map(h => {
      const content = this.data.content.find(c => c.id === h.content_id);
      return {
        ...h,
        content: content || null
      };
    }).filter(h => h.content).sort((a, b) => new Date(b.last_watched) - new Date(a.last_watched));
  }

  // User Comments
  async addComment(commentData) {
    const newId = Math.max(...(this.data.userComments?.map(c => c.id) || [0])) + 1;
    const comment = {
      id: newId,
      ...commentData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.data.userComments.push(comment);
    this.saveData();
    return comment;
  }

  async getContentComments(contentId) {
    return this.data.userComments.filter(c => c.content_id === parseInt(contentId))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  async deleteComment(commentId, userId) {
    const comment = this.data.userComments.find(c => c.id === parseInt(commentId));
    if (!comment || comment.user_id !== parseInt(userId)) {
      return false;
    }
    this.data.userComments = this.data.userComments.filter(c => c.id !== parseInt(commentId));
    this.saveData();
    return true;
  }

  // User Reviews
  async addReview(reviewData) {
    const newId = Math.max(...(this.data.userReviews?.map(r => r.id) || [0])) + 1;
    const review = {
      id: newId,
      ...reviewData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.data.userReviews.push(review);
    this.saveData();
    return review;
  }

  async getContentReviews(contentId) {
    return this.data.userReviews.filter(r => r.content_id === parseInt(contentId))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  async updateReview(reviewId, userId, reviewData) {
    const index = this.data.userReviews.findIndex(r => r.id === parseInt(reviewId) && r.user_id === parseInt(userId));
    if (index === -1) return null;
    
    this.data.userReviews[index] = {
      ...this.data.userReviews[index],
      ...reviewData,
      updated_at: new Date().toISOString()
    };
    this.saveData();
    return this.data.userReviews[index];
  }

  async deleteReview(reviewId, userId) {
    const review = this.data.userReviews.find(r => r.id === parseInt(reviewId));
    if (!review || review.user_id !== parseInt(userId)) {
      return false;
    }
    this.data.userReviews = this.data.userReviews.filter(r => r.id !== parseInt(reviewId));
    this.saveData();
    return true;
  }

  async getUserReviewForContent(userId, contentId) {
    return this.data.userReviews.find(r => 
      r.user_id === parseInt(userId) && r.content_id === parseInt(contentId)
    ) || null;
  }

  // Review Likes
  async likeReview(userId, reviewId, isLike) {
    // Remove existing like/dislike first
    this.data.reviewLikes = this.data.reviewLikes.filter(l => 
      !(l.user_id === parseInt(userId) && l.review_id === parseInt(reviewId))
    );

    // Add new like/dislike
    const newId = Math.max(...(this.data.reviewLikes?.map(l => l.id) || [0])) + 1;
    const like = {
      id: newId,
      user_id: parseInt(userId),
      review_id: parseInt(reviewId),
      is_like: isLike,
      created_at: new Date().toISOString()
    };
    this.data.reviewLikes.push(like);
    this.saveData();
    return like;
  }

  // Content Views
  async incrementViewCount(contentId) {
    const newId = Math.max(...(this.data.contentViews?.map(v => v.id) || [0])) + 1;
    const view = {
      id: newId,
      content_id: parseInt(contentId),
      viewed_at: new Date().toISOString()
    };
    this.data.contentViews.push(view);
    this.saveData();
    return view;
  }

  // User Statistics
  async getUserStats(userId) {
    const favorites = this.data.userFavorites?.filter(f => f.user_id === parseInt(userId)) || [];
    const watchHistory = this.data.userWatchHistory?.filter(h => h.user_id === parseInt(userId)) || [];
    const comments = this.data.userComments?.filter(c => c.user_id === parseInt(userId)) || [];
    const reviews = this.data.userReviews?.filter(r => r.user_id === parseInt(userId)) || [];
    
    return {
      favorites: favorites.length,
      watchHistory: watchHistory.length,
      comments: comments.length,
      reviews: reviews.length,
      totalWatchTime: watchHistory.reduce((sum, h) => sum + (h.progress_minutes || 0), 0)
    };
  }
}

export const dbManager = new DatabaseManager();