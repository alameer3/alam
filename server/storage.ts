import { 
  users, content, genres, categories, contentGenres, contentCategories, userRatings,
  userComments, userReviews, reviewLikes, userFavorites, userWatchHistory, contentViews,
  uploads, uploadChunks,
  type User, type InsertUser, type Content, type InsertContent, 
  type Genre, type InsertGenre, type Category, type InsertCategory,
  type UserComment, type InsertUserComment, type UserReview, type InsertUserReview,
  type ReviewLike, type InsertReviewLike, type UserFavorite, type InsertUserFavorite,
  type UserWatchHistory, type InsertUserWatchHistory, type ContentView, type InsertContentView,
  type Upload, type InsertUpload, type UploadChunk, type InsertUploadChunk
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, ilike, sql } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User>;
  
  // Content operations
  getContent(id: number): Promise<Content | undefined>;
  getContentByType(type: string, page: number, limit: number, filters?: any): Promise<{ content: Content[], total: number }>;
  createContent(content: InsertContent): Promise<Content>;
  updateContent(id: number, content: Partial<InsertContent>): Promise<Content>;
  deleteContent(id: number): Promise<boolean>;
  searchContent(query: string, type?: string): Promise<Content[]>;
  
  // Genre operations
  getAllGenres(): Promise<Genre[]>;
  createGenre(genre: InsertGenre): Promise<Genre>;
  
  // Category operations
  getAllCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Content relationships
  addContentGenre(contentId: number, genreId: number): Promise<void>;
  addContentCategory(contentId: number, categoryId: number): Promise<void>;
  
  // User interactions
  addToFavorites(userId: number, contentId: number): Promise<void>;
  removeFromFavorites(userId: number, contentId: number): Promise<void>;
  getUserFavorites(userId: number): Promise<Content[]>;
  addToWatchHistory(userId: number, contentId: number, progressMinutes?: number): Promise<void>;
  getUserWatchHistory(userId: number): Promise<Content[]>;
  
  // Upload operations
  createUpload(upload: InsertUpload): Promise<Upload>;
  getUpload(id: number): Promise<Upload | undefined>;
  getUserUploads(userId: number): Promise<Upload[]>;
  updateUpload(id: number, upload: Partial<InsertUpload>): Promise<Upload>;
  deleteUpload(id: number): Promise<boolean>;
  updateUploadProgress(id: number, progress: number): Promise<void>;
  updateUploadStatus(id: number, status: string): Promise<void>;
  
  // Upload chunks operations
  createUploadChunk(chunk: InsertUploadChunk): Promise<UploadChunk>;
  getUploadChunks(uploadId: number): Promise<UploadChunk[]>;
  updateUploadChunk(id: number, chunk: Partial<InsertUploadChunk>): Promise<UploadChunk>;
  markChunkAsUploaded(id: number): Promise<void>;
  
  // Comments
  addComment(comment: InsertUserComment): Promise<UserComment>;
  getContentComments(contentId: number): Promise<UserComment[]>;
  deleteComment(commentId: number, userId: number): Promise<boolean>;
  
  // Reviews
  addReview(review: InsertUserReview): Promise<UserReview>;
  getContentReviews(contentId: number): Promise<UserReview[]>;
  updateReview(reviewId: number, userId: number, review: Partial<InsertUserReview>): Promise<UserReview>;
  deleteReview(reviewId: number, userId: number): Promise<boolean>;
  likeReview(userId: number, reviewId: number, isLike: boolean): Promise<void>;
  getUserReviewForContent(userId: number, contentId: number): Promise<UserReview | undefined>;
  
  // Views and stats
  incrementViewCount(contentId: number): Promise<void>;
  getContentStats(): Promise<{ movies: number, series: number, tv: number, misc: number }>;
  getUserStats(userId: number): Promise<{ favorites: number, watchHistory: number, comments: number }>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, updateUser: Partial<InsertUser>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...updateUser, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getContent(id: number): Promise<Content | undefined> {
    const [foundContent] = await db.select().from(content).where(eq(content.id, id));
    return foundContent || undefined;
  }

  async getContentByType(type: string, page: number = 1, limit: number = 20, filters?: any): Promise<{ content: Content[], total: number }> {
    const baseCondition = and(
      eq(content.type, type),
      eq(content.isActive, true)
    );

    // Build conditions array
    const conditions = [baseCondition];
    
    if (filters) {
      if (filters.year) {
        conditions.push(eq(content.year, parseInt(filters.year)));
      }
      if (filters.language) {
        conditions.push(eq(content.language, filters.language));
      }
      if (filters.quality) {
        conditions.push(eq(content.quality, filters.quality));
      }
      if (filters.resolution) {
        conditions.push(eq(content.resolution, filters.resolution));
      }
      if (filters.rating) {
        conditions.push(sql`${content.rating} >= ${filters.rating}`);
      }
    }

    const finalCondition = conditions.length > 1 ? and(...conditions) : conditions[0];
    
    const offset = (page - 1) * limit;
    const contentItems = await db.select().from(content)
      .where(finalCondition)
      .orderBy(desc(content.createdAt))
      .limit(limit)
      .offset(offset);

    const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(content)
      .where(finalCondition);

    return {
      content: contentItems,
      total: count
    };
  }

  async createContent(insertContent: InsertContent): Promise<Content> {
    const [newContent] = await db.insert(content).values(insertContent).returning();
    return newContent;
  }

  async updateContent(id: number, updateContent: Partial<InsertContent>): Promise<Content> {
    const [updatedContent] = await db.update(content)
      .set({ ...updateContent, updatedAt: new Date() })
      .where(eq(content.id, id))
      .returning();
    return updatedContent;
  }

  async deleteContent(id: number): Promise<boolean> {
    const result = await db.update(content)
      .set({ isActive: false })
      .where(eq(content.id, id));
    return (result.rowCount || 0) > 0;
  }

  async searchContent(query: string, type?: string): Promise<Content[]> {
    const conditions = [
      eq(content.isActive, true),
      sql`(${content.title} ILIKE ${`%${query}%`} OR ${content.titleArabic} ILIKE ${`%${query}%`})`
    ];

    if (type) {
      conditions.push(eq(content.type, type));
    }

    const searchResults = await db.select().from(content)
      .where(and(...conditions))
      .orderBy(desc(content.createdAt))
      .limit(50);

    return searchResults;
  }

  async getAllGenres(): Promise<Genre[]> {
    return await db.select().from(genres);
  }

  async createGenre(insertGenre: InsertGenre): Promise<Genre> {
    const [genre] = await db.insert(genres).values(insertGenre).returning();
    return genre;
  }

  async getAllCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await db.insert(categories).values(insertCategory).returning();
    return category;
  }

  async addContentGenre(contentId: number, genreId: number): Promise<void> {
    await db.insert(contentGenres).values({ contentId, genreId });
  }

  async addContentCategory(contentId: number, categoryId: number): Promise<void> {
    await db.insert(contentCategories).values({ contentId, categoryId });
  }

  async getContentStats(): Promise<{ movies: number, series: number, tv: number, misc: number }> {
    const stats = await db.select({
      type: content.type,
      count: sql<number>`count(*)`
    }).from(content)
      .where(eq(content.isActive, true))
      .groupBy(content.type);

    const result = { movies: 0, series: 0, tv: 0, misc: 0 };
    stats.forEach(stat => {
      if (stat.type === 'movie') result.movies = stat.count;
      else if (stat.type === 'series') result.series = stat.count;
      else if (stat.type === 'tv') result.tv = stat.count;
      else if (stat.type === 'misc') result.misc = stat.count;
    });

    return result;
  }

  // User interaction methods
  async addToFavorites(userId: number, contentId: number): Promise<void> {
    await db.insert(userFavorites).values({ userId, contentId }).onConflictDoNothing();
  }

  async removeFromFavorites(userId: number, contentId: number): Promise<void> {
    await db.delete(userFavorites).where(
      and(eq(userFavorites.userId, userId), eq(userFavorites.contentId, contentId))
    );
  }

  async getUserFavorites(userId: number): Promise<Content[]> {
    const result = await db
      .select({ content })
      .from(userFavorites)
      .innerJoin(content, eq(userFavorites.contentId, content.id))
      .where(eq(userFavorites.userId, userId))
      .orderBy(desc(userFavorites.createdAt));
    
    return result.map(r => r.content);
  }

  async addToWatchHistory(userId: number, contentId: number, progressMinutes: number = 0): Promise<void> {
    await db.insert(userWatchHistory).values({ 
      userId, 
      contentId, 
      progressMinutes 
    }).onConflictDoUpdate({
      target: [userWatchHistory.userId, userWatchHistory.contentId],
      set: { 
        progressMinutes,
        watchedAt: new Date()
      }
    });
  }

  async getUserWatchHistory(userId: number): Promise<Content[]> {
    const result = await db
      .select({ content })
      .from(userWatchHistory)
      .innerJoin(content, eq(userWatchHistory.contentId, content.id))
      .where(eq(userWatchHistory.userId, userId))
      .orderBy(desc(userWatchHistory.watchedAt));
    
    return result.map(r => r.content);
  }

  // Comment methods
  async addComment(comment: InsertUserComment): Promise<UserComment> {
    const [newComment] = await db.insert(userComments).values(comment).returning();
    return newComment;
  }

  async getContentComments(contentId: number): Promise<UserComment[]> {
    return await db
      .select()
      .from(userComments)
      .where(and(eq(userComments.contentId, contentId), eq(userComments.isActive, true)))
      .orderBy(desc(userComments.createdAt));
  }

  async deleteComment(commentId: number, userId: number): Promise<boolean> {
    const result = await db
      .update(userComments)
      .set({ isActive: false })
      .where(and(eq(userComments.id, commentId), eq(userComments.userId, userId)))
      .returning();
    
    return result.length > 0;
  }

  // Views and stats
  async incrementViewCount(contentId: number): Promise<void> {
    await db.insert(contentViews).values({ contentId, viewCount: 1 }).onConflictDoUpdate({
      target: contentViews.contentId,
      set: { 
        viewCount: sql`${contentViews.viewCount} + 1`,
        lastViewedAt: new Date()
      }
    });
  }

  // Review methods
  async addReview(review: InsertUserReview): Promise<UserReview> {
    const [newReview] = await db.insert(userReviews).values(review).returning();
    return newReview;
  }

  async getContentReviews(contentId: number): Promise<UserReview[]> {
    return await db
      .select()
      .from(userReviews)
      .where(and(eq(userReviews.contentId, contentId), eq(userReviews.isActive, true)))
      .orderBy(desc(userReviews.createdAt));
  }

  async updateReview(reviewId: number, userId: number, reviewData: Partial<InsertUserReview>): Promise<UserReview> {
    const [updatedReview] = await db
      .update(userReviews)
      .set({ ...reviewData, updatedAt: new Date() })
      .where(and(eq(userReviews.id, reviewId), eq(userReviews.userId, userId)))
      .returning();
    
    if (!updatedReview) throw new Error("Review not found or not owned by user");
    return updatedReview;
  }

  async deleteReview(reviewId: number, userId: number): Promise<boolean> {
    const result = await db
      .update(userReviews)
      .set({ isActive: false })
      .where(and(eq(userReviews.id, reviewId), eq(userReviews.userId, userId)))
      .returning();
    
    return result.length > 0;
  }

  async likeReview(userId: number, reviewId: number, isLike: boolean): Promise<void> {
    // First, remove any existing like/dislike
    await db.delete(reviewLikes).where(
      and(eq(reviewLikes.userId, userId), eq(reviewLikes.reviewId, reviewId))
    );
    
    // Insert new like/dislike
    await db.insert(reviewLikes).values({ userId, reviewId, isLike });
    
    // Update the review's like/dislike count
    const [likesCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(reviewLikes)
      .where(and(eq(reviewLikes.reviewId, reviewId), eq(reviewLikes.isLike, true)));
    
    const [dislikesCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(reviewLikes)
      .where(and(eq(reviewLikes.reviewId, reviewId), eq(reviewLikes.isLike, false)));
    
    await db
      .update(userReviews)
      .set({ 
        likes: likesCount?.count || 0,
        dislikes: dislikesCount?.count || 0
      })
      .where(eq(userReviews.id, reviewId));
  }

  async getUserReviewForContent(userId: number, contentId: number): Promise<UserReview | undefined> {
    const [review] = await db
      .select()
      .from(userReviews)
      .where(and(
        eq(userReviews.userId, userId), 
        eq(userReviews.contentId, contentId),
        eq(userReviews.isActive, true)
      ));
    
    return review || undefined;
  }

  async getUserStats(userId: number): Promise<{ favorites: number, watchHistory: number, comments: number }> {
    const [favoritesCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(userFavorites)
      .where(eq(userFavorites.userId, userId));

    const [watchHistoryCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(userWatchHistory)
      .where(eq(userWatchHistory.userId, userId));

    const [commentsCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(userComments)
      .where(and(eq(userComments.userId, userId), eq(userComments.isActive, true)));

    return {
      favorites: favoritesCount?.count || 0,
      watchHistory: watchHistoryCount?.count || 0,
      comments: commentsCount?.count || 0
    };
  }

  // Upload operations
  async createUpload(insertUpload: InsertUpload): Promise<Upload> {
    const [upload] = await db.insert(uploads).values(insertUpload).returning();
    return upload;
  }

  async getUpload(id: number): Promise<Upload | undefined> {
    const [upload] = await db.select().from(uploads).where(eq(uploads.id, id));
    return upload || undefined;
  }

  async getUserUploads(userId: number): Promise<Upload[]> {
    return await db
      .select()
      .from(uploads)
      .where(eq(uploads.userId, userId))
      .orderBy(desc(uploads.createdAt));
  }

  async updateUpload(id: number, updateUpload: Partial<InsertUpload>): Promise<Upload> {
    const [upload] = await db
      .update(uploads)
      .set({ ...updateUpload, updatedAt: new Date() })
      .where(eq(uploads.id, id))
      .returning();
    return upload;
  }

  async deleteUpload(id: number): Promise<boolean> {
    const result = await db.delete(uploads).where(eq(uploads.id, id));
    return result.rowCount > 0;
  }

  async updateUploadProgress(id: number, progress: number): Promise<void> {
    await db
      .update(uploads)
      .set({ uploadProgress: progress, updatedAt: new Date() })
      .where(eq(uploads.id, id));
  }

  async updateUploadStatus(id: number, status: string): Promise<void> {
    await db
      .update(uploads)
      .set({ uploadStatus: status, updatedAt: new Date() })
      .where(eq(uploads.id, id));
  }

  // Upload chunks operations
  async createUploadChunk(insertChunk: InsertUploadChunk): Promise<UploadChunk> {
    const [chunk] = await db.insert(uploadChunks).values(insertChunk).returning();
    return chunk;
  }

  async getUploadChunks(uploadId: number): Promise<UploadChunk[]> {
    return await db
      .select()
      .from(uploadChunks)
      .where(eq(uploadChunks.uploadId, uploadId))
      .orderBy(uploadChunks.chunkIndex);
  }

  async updateUploadChunk(id: number, updateChunk: Partial<InsertUploadChunk>): Promise<UploadChunk> {
    const [chunk] = await db
      .update(uploadChunks)
      .set(updateChunk)
      .where(eq(uploadChunks.id, id))
      .returning();
    return chunk;
  }

  async markChunkAsUploaded(id: number): Promise<void> {
    await db
      .update(uploadChunks)
      .set({ isUploaded: true, uploadedAt: new Date() })
      .where(eq(uploadChunks.id, id));
  }
}

// Create a temporary in-memory storage for migration purposes
class TemporaryMemoryStorage implements IStorage {
  private content: Content[] = [
    {
      id: 1,
      title: "The Dark Knight",
      titleArabic: "فارس الظلام",
      description: "A superhero movie about Batman",
      descriptionArabic: "فيلم عن باتمان والجوكر",
      type: "movie",
      year: 2008,
      language: "English",
      quality: "HD",
      resolution: "1080p",
      rating: "9.0",
      duration: 152,
      episodes: 0,
      posterUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop",
      videoUrl: "",
      downloadUrl: "",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      title: "Breaking Bad",
      titleArabic: "بريكنغ باد",
      description: "A chemistry teacher becomes a drug dealer",
      descriptionArabic: "مدرس كيمياء يصبح تاجر مخدرات",
      type: "series",
      year: 2008,
      language: "English",
      quality: "HD",
      resolution: "1080p",
      rating: "9.5",
      duration: 0,
      episodes: 62,
      posterUrl: "https://images.unsplash.com/photo-1489599088293-daa0c0f60f0e?w=400&h=600&fit=crop",
      videoUrl: "",
      downloadUrl: "",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3,
      title: "The Office",
      titleArabic: "المكتب",
      description: "A mockumentary about office life",
      descriptionArabic: "كوميديا عن الحياة في المكتب",
      type: "tv",
      year: 2005,
      language: "English",
      quality: "HD",
      resolution: "1080p",
      rating: "8.8",
      duration: 0,
      episodes: 201,
      posterUrl: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=400&h=600&fit=crop",
      videoUrl: "",
      downloadUrl: "",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 4,
      title: "Documentary",
      titleArabic: "وثائقي",
      description: "Educational documentary",
      descriptionArabic: "فيلم وثائقي تعليمي",
      type: "misc",
      year: 2020,
      language: "Arabic",
      quality: "HD",
      resolution: "1080p",
      rating: "8.0",
      duration: 90,
      episodes: 0,
      posterUrl: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=400&h=600&fit=crop",
      videoUrl: "",
      downloadUrl: "",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  async getUser(id: number): Promise<User | undefined> {
    return undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    throw new Error("Not implemented in temporary storage");
  }

  async updateUser(id: number, user: Partial<InsertUser>): Promise<User> {
    throw new Error("Not implemented in temporary storage");
  }

  async getContent(id: number): Promise<Content | undefined> {
    return this.content.find(c => c.id === id);
  }

  async getContentByType(type: string, page: number = 1, limit: number = 20, filters?: any): Promise<{ content: Content[], total: number }> {
    const filtered = this.content.filter(c => c.type === type && c.isActive);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedContent = filtered.slice(startIndex, endIndex);
    
    return {
      content: paginatedContent,
      total: filtered.length
    };
  }

  async createContent(content: InsertContent): Promise<Content> {
    const newContent: Content = {
      id: Math.max(...this.content.map(c => c.id)) + 1,
      ...content,
      description: content.description || null,
      descriptionArabic: content.descriptionArabic || null,
      rating: content.rating || null,
      duration: content.duration || null,
      episodes: content.episodes || null,
      posterUrl: content.posterUrl || null,
      videoUrl: content.videoUrl || null,
      downloadUrl: content.downloadUrl || null,
      isActive: content.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.content.push(newContent);
    return newContent;
  }

  async updateContent(id: number, content: Partial<InsertContent>): Promise<Content> {
    const index = this.content.findIndex(c => c.id === id);
    if (index === -1) throw new Error("Content not found");
    
    this.content[index] = {
      ...this.content[index],
      ...content,
      updatedAt: new Date()
    };
    return this.content[index];
  }

  async deleteContent(id: number): Promise<boolean> {
    const index = this.content.findIndex(c => c.id === id);
    if (index === -1) return false;
    
    this.content.splice(index, 1);
    return true;
  }

  async searchContent(query: string, type?: string): Promise<Content[]> {
    return this.content.filter(c => 
      c.isActive && 
      (c.title.toLowerCase().includes(query.toLowerCase()) || 
       c.titleArabic?.toLowerCase().includes(query.toLowerCase())) &&
      (!type || c.type === type)
    );
  }

  async getAllGenres(): Promise<Genre[]> {
    return [];
  }

  async createGenre(genre: InsertGenre): Promise<Genre> {
    throw new Error("Not implemented in temporary storage");
  }

  async getAllCategories(): Promise<Category[]> {
    return [];
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    throw new Error("Not implemented in temporary storage");
  }

  async addContentGenre(contentId: number, genreId: number): Promise<void> {
    // Not implemented
  }

  async addContentCategory(contentId: number, categoryId: number): Promise<void> {
    // Not implemented
  }

  async getContentStats(): Promise<{ movies: number, series: number, tv: number, misc: number }> {
    const stats = { movies: 0, series: 0, tv: 0, misc: 0 };
    this.content.forEach(c => {
      if (c.type === 'movie') stats.movies++;
      else if (c.type === 'series') stats.series++;
      else if (c.type === 'tv') stats.tv++;
      else if (c.type === 'misc') stats.misc++;
    });
    return stats;
  }

  // User interaction methods - not implemented for temporary storage
  async addToFavorites(userId: number, contentId: number): Promise<void> {
    // Not implemented in temporary storage
  }

  async removeFromFavorites(userId: number, contentId: number): Promise<void> {
    // Not implemented in temporary storage
  }

  async getUserFavorites(userId: number): Promise<Content[]> {
    return [];
  }

  async addToWatchHistory(userId: number, contentId: number, progressMinutes?: number): Promise<void> {
    // Not implemented in temporary storage
  }

  async getUserWatchHistory(userId: number): Promise<Content[]> {
    return [];
  }

  async addComment(comment: InsertUserComment): Promise<UserComment> {
    throw new Error("Not implemented in temporary storage");
  }

  async getContentComments(contentId: number): Promise<UserComment[]> {
    return [];
  }

  async deleteComment(commentId: number, userId: number): Promise<boolean> {
    return false;
  }

  async incrementViewCount(contentId: number): Promise<void> {
    // Not implemented in temporary storage
  }

  // Review methods - not implemented for temporary storage
  async addReview(review: InsertUserReview): Promise<UserReview> {
    throw new Error("Not implemented in temporary storage");
  }

  async getContentReviews(contentId: number): Promise<UserReview[]> {
    return [];
  }

  async updateReview(reviewId: number, userId: number, review: Partial<InsertUserReview>): Promise<UserReview> {
    throw new Error("Not implemented in temporary storage");
  }

  async deleteReview(reviewId: number, userId: number): Promise<boolean> {
    return false;
  }

  async likeReview(userId: number, reviewId: number, isLike: boolean): Promise<void> {
    // Not implemented in temporary storage
  }

  async getUserReviewForContent(userId: number, contentId: number): Promise<UserReview | undefined> {
    return undefined;
  }

  async getUserStats(userId: number): Promise<{ favorites: number, watchHistory: number, comments: number }> {
    return { favorites: 0, watchHistory: 0, comments: 0 };
  }

  // Upload operations - temporary implementation
  async createUpload(upload: InsertUpload): Promise<Upload> {
    throw new Error("Upload operations not implemented in temporary storage");
  }

  async getUpload(id: number): Promise<Upload | undefined> {
    return undefined;
  }

  async getUserUploads(userId: number): Promise<Upload[]> {
    return [];
  }

  async updateUpload(id: number, upload: Partial<InsertUpload>): Promise<Upload> {
    throw new Error("Upload operations not implemented in temporary storage");
  }

  async deleteUpload(id: number): Promise<boolean> {
    return false;
  }

  async updateUploadProgress(id: number, progress: number): Promise<void> {
    // No-op for temporary storage
  }

  async updateUploadStatus(id: number, status: string): Promise<void> {
    // No-op for temporary storage
  }

  // Upload chunks operations - temporary implementation
  async createUploadChunk(chunk: InsertUploadChunk): Promise<UploadChunk> {
    throw new Error("Upload chunk operations not implemented in temporary storage");
  }

  async getUploadChunks(uploadId: number): Promise<UploadChunk[]> {
    return [];
  }

  async updateUploadChunk(id: number, chunk: Partial<InsertUploadChunk>): Promise<UploadChunk> {
    throw new Error("Upload chunk operations not implemented in temporary storage");
  }

  async markChunkAsUploaded(id: number): Promise<void> {
    // No-op for temporary storage
  }
}

// Initialize storage - will try database first, fallback to memory
async function initializeStorage(): Promise<IStorage> {
  try {
    const dbStorage = new DatabaseStorage();
    // Test database connection
    await dbStorage.getContentStats();
    console.log("✓ Connected to PostgreSQL database");
    return dbStorage;
  } catch (error: any) {
    console.log("⚠ Database not available, using in-memory storage:", error.message);
    return new TemporaryMemoryStorage();
  }
}

// Initialize storage asynchronously
let storage: IStorage = new TemporaryMemoryStorage(); // Default fallback

initializeStorage().then(s => {
  storage = s;
}).catch(error => {
  console.error("Failed to initialize storage:", error);
  storage = new TemporaryMemoryStorage();
});

export { storage };
