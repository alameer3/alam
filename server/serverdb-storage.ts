import { dbManager } from '../serverdb/database-manager.js';
import type { User, Content, Category, Genre } from '@shared/schema';

export class ServerDBStorage {
  
  async getCategories() {
    const categories = await dbManager.getCategories();
    return categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      nameArabic: cat.name_arabic,
      description: cat.description,
      createdAt: cat.created_at,
      updatedAt: cat.updated_at
    }));
  }

  async getCategoryById(id: number) {
    const category = await dbManager.getCategoryById(id);
    if (!category) return null;
    return {
      id: category.id,
      name: category.name,
      nameArabic: category.name_arabic,
      description: category.description,
      createdAt: category.created_at,
      updatedAt: category.updated_at
    };
  }

  async getGenres() {
    const genres = await dbManager.getGenres();
    return genres.map(genre => ({
      id: genre.id,
      name: genre.name,
      nameArabic: genre.name_arabic,
      description: genre.description,
      createdAt: genre.created_at,
      updatedAt: genre.updated_at
    }));
  }

  async getGenreById(id: number) {
    const genre = await dbManager.getGenreById(id);
    if (!genre) return null;
    return {
      id: genre.id,
      name: genre.name,
      nameArabic: genre.name_arabic,
      description: genre.description,
      createdAt: genre.created_at,
      updatedAt: genre.updated_at
    };
  }

  async getContentByType(type: string, page: number = 1, limit: number = 24) {
    const result = await dbManager.getContent({ type, page, limit });
    return {
      content: result.content.map(this.formatContent),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages
    };
  }

  async getContentById(id: number) {
    const content = await dbManager.getContentById(id);
    if (!content) return null;
    return this.formatContent(content);
  }

  async searchContent(query: string, filters: any = {}) {
    const result = await dbManager.searchContent(query, filters);
    return {
      content: result.content.map(this.formatContent),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages
    };
  }

  async getFeaturedContent() {
    const content = await dbManager.getFeaturedContent();
    return content.map(this.formatContent);
  }

  async getTrendingContent() {
    const content = await dbManager.getTrendingContent();
    return content.map(this.formatContent);
  }

  async getStats() {
    return await dbManager.getStats();
  }

  async createContent(contentData: any) {
    const content = await dbManager.createContent(contentData);
    return this.formatContent(content);
  }

  async updateContent(id: number, contentData: any) {
    const content = await dbManager.updateContent(id, contentData);
    if (!content) return null;
    return this.formatContent(content);
  }

  async deleteContent(id: number) {
    return await dbManager.deleteContent(id);
  }

  async getUserById(id: number) {
    const user = await dbManager.getUserById(id);
    if (!user) return null;
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      profileImageUrl: user.profile_image_url,
      isAdmin: user.is_admin,
      isActive: user.is_active,
      favorites: user.favorites || [],
      watchHistory: user.watch_history || [],
      createdAt: user.created_at,
      updatedAt: user.updated_at
    };
  }

  async getUserByEmail(email: string) {
    const user = await dbManager.getUserByEmail(email);
    if (!user) return null;
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      profileImageUrl: user.profile_image_url,
      isAdmin: user.is_admin,
      isActive: user.is_active,
      favorites: user.favorites || [],
      watchHistory: user.watch_history || [],
      createdAt: user.created_at,
      updatedAt: user.updated_at
    };
  }

  async getUserByUsername(username: string) {
    const user = await dbManager.getUserByUsername(username);
    if (!user) return null;
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      profileImageUrl: user.profile_image_url,
      isAdmin: user.is_admin,
      isActive: user.is_active,
      favorites: user.favorites || [],
      watchHistory: user.watch_history || [],
      createdAt: user.created_at,
      updatedAt: user.updated_at
    };
  }

  private formatContent(content: any) {
    return {
      id: content.id,
      title: content.title,
      titleArabic: content.title_arabic,
      description: content.description,
      descriptionArabic: content.description_arabic,
      type: content.type,
      year: content.year,
      language: content.language,
      quality: content.quality,
      resolution: content.resolution,
      rating: content.rating,
      duration: content.duration,
      episodes: content.episodes,
      posterUrl: content.poster_url,
      videoUrl: content.video_url,
      downloadUrl: content.download_url,
      trailerUrl: content.trailer_url,
      imdbId: content.imdb_id,
      tmdbId: content.tmdb_id,
      rottenTomatoesScore: content.rotten_tomatoes_score,
      metacriticScore: content.metacritic_score,
      country: content.country,
      budget: content.budget,
      boxOffice: content.box_office,
      awards: content.awards,
      isActive: content.is_active,
      createdAt: content.created_at,
      updatedAt: content.updated_at,
      categories: content.categories || [],
      genres: content.genres || []
    };
  }

  // User Favorites
  async addToFavorites(userId: number, contentId: number) {
    return await dbManager.addToFavorites(userId, contentId);
  }

  async removeFromFavorites(userId: number, contentId: number) {
    return await dbManager.removeFromFavorites(userId, contentId);
  }

  async getUserFavorites(userId: number) {
    const favorites = await dbManager.getUserFavorites(userId);
    return favorites.map(f => ({
      ...f,
      content: this.formatContent(f.content)
    }));
  }

  // User Watch History
  async addToWatchHistory(userId: number, contentId: number, progressMinutes: number = 0) {
    return await dbManager.addToWatchHistory(userId, contentId, progressMinutes);
  }

  async getUserWatchHistory(userId: number) {
    const history = await dbManager.getUserWatchHistory(userId);
    return history.map(h => ({
      ...h,
      content: this.formatContent(h.content)
    }));
  }

  // User Comments
  async addComment(commentData: any) {
    return await dbManager.addComment(commentData);
  }

  async getContentComments(contentId: number) {
    return await dbManager.getContentComments(contentId);
  }

  async deleteComment(commentId: number, userId: number) {
    return await dbManager.deleteComment(commentId, userId);
  }

  // User Reviews
  async addReview(reviewData: any) {
    return await dbManager.addReview(reviewData);
  }

  async getContentReviews(contentId: number) {
    return await dbManager.getContentReviews(contentId);
  }

  async updateReview(reviewId: number, userId: number, reviewData: any) {
    return await dbManager.updateReview(reviewId, userId, reviewData);
  }

  async deleteReview(reviewId: number, userId: number) {
    return await dbManager.deleteReview(reviewId, userId);
  }

  async getUserReviewForContent(userId: number, contentId: number) {
    return await dbManager.getUserReviewForContent(userId, contentId);
  }

  // Review Likes
  async likeReview(userId: number, reviewId: number, isLike: boolean) {
    return await dbManager.likeReview(userId, reviewId, isLike);
  }

  // Content Views
  async incrementViewCount(contentId: number) {
    return await dbManager.incrementViewCount(contentId);
  }

  // User Statistics
  async getUserStats(userId: number) {
    return await dbManager.getUserStats(userId);
  }

  // Episodes management
  async getContentEpisodes(contentId: number) {
    const episodes = await dbManager.getContentEpisodes(contentId);
    return episodes.map(episode => ({
      id: episode.id,
      contentId: episode.content_id,
      episodeNumber: episode.episode_number,
      seasonNumber: episode.season_number,
      title: episode.title,
      titleArabic: episode.title_arabic,
      description: episode.description,
      descriptionArabic: episode.description_arabic,
      duration: episode.duration,
      quality: episode.quality,
      resolution: episode.resolution,
      language: episode.language,
      subtitle: episode.subtitle,
      videoUrl: episode.video_url,
      downloadUrl: episode.download_url,
      thumbnailUrl: episode.thumbnail_url,
      isActive: episode.is_active,
      createdAt: episode.created_at,
      updatedAt: episode.updated_at
    }));
  }

  async getEpisodeById(episodeId: number) {
    const episode = await dbManager.getEpisodeById(episodeId);
    if (!episode) return null;
    return {
      id: episode.id,
      contentId: episode.content_id,
      episodeNumber: episode.episode_number,
      seasonNumber: episode.season_number,
      title: episode.title,
      titleArabic: episode.title_arabic,
      description: episode.description,
      descriptionArabic: episode.description_arabic,
      duration: episode.duration,
      quality: episode.quality,
      resolution: episode.resolution,
      language: episode.language,
      subtitle: episode.subtitle,
      videoUrl: episode.video_url,
      downloadUrl: episode.download_url,
      thumbnailUrl: episode.thumbnail_url,
      isActive: episode.is_active,
      createdAt: episode.created_at,
      updatedAt: episode.updated_at
    };
  }

  // Download links management
  async getDownloadLinks(contentId: number, episodeId: number | null = null) {
    const links = await dbManager.getDownloadLinks(contentId, episodeId);
    return links.map(link => ({
      id: link.id,
      contentId: link.content_id,
      episodeId: link.episode_id,
      quality: link.quality,
      resolution: link.resolution,
      fileSize: link.file_size,
      downloadUrl: link.download_url,
      serverName: link.server_name,
      language: link.language,
      subtitle: link.subtitle,
      isActive: link.is_active,
      createdAt: link.created_at
    }));
  }

  // Streaming links management
  async getStreamingLinks(contentId: number, episodeId: number | null = null) {
    const links = await dbManager.getStreamingLinks(contentId, episodeId);
    return links.map(link => ({
      id: link.id,
      contentId: link.content_id,
      episodeId: link.episode_id,
      quality: link.quality,
      resolution: link.resolution,
      streamingUrl: link.streaming_url,
      serverName: link.server_name,
      language: link.language,
      subtitle: link.subtitle,
      isActive: link.is_active,
      createdAt: link.created_at
    }));
  }
}

export const serverDBStorage = new ServerDBStorage();