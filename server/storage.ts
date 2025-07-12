import { 
  users, content, genres, categories, contentGenres, contentCategories, userRatings,
  userComments, userReviews, reviewLikes, userFavorites, userWatchHistory, contentViews,
  castMembers, contentCast, contentImages, externalRatings,
  type User, type InsertUser, type Content, type InsertContent, 
  type Genre, type InsertGenre, type Category, type InsertCategory,
  type UserComment, type InsertUserComment, type UserReview, type InsertUserReview,
  type ReviewLike, type InsertReviewLike, type UserFavorite, type InsertUserFavorite,
  type UserWatchHistory, type InsertUserWatchHistory, type ContentView, type InsertContentView,
  type CastMember, type InsertCastMember, type ContentCast, type InsertContentCast,
  type ContentImage, type InsertContentImage, type ExternalRating, type InsertExternalRating
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
  
  // Cast and crew operations (تطوير المحتوى الجديد)
  getAllCastMembers(): Promise<CastMember[]>;
  getCastMemberById(id: number): Promise<CastMember | undefined>;
  createCastMember(castMember: InsertCastMember): Promise<CastMember>;
  updateCastMember(id: number, castMember: Partial<InsertCastMember>): Promise<CastMember>;
  deleteCastMember(id: number): Promise<boolean>;
  
  // Content cast operations
  getContentCast(contentId: number): Promise<(ContentCast & { castMember: CastMember })[]>;
  addContentCast(contentCast: InsertContentCast): Promise<ContentCast>;
  removeContentCast(contentId: number, castMemberId: number): Promise<boolean>;
  
  // Content images operations
  getContentImages(contentId: number, type?: string): Promise<ContentImage[]>;
  addContentImage(image: InsertContentImage): Promise<ContentImage>;
  updateContentImage(id: number, image: Partial<InsertContentImage>): Promise<ContentImage>;
  deleteContentImage(id: number): Promise<boolean>;
  
  // External ratings operations
  getContentExternalRatings(contentId: number): Promise<ExternalRating[]>;
  addExternalRating(rating: InsertExternalRating): Promise<ExternalRating>;
  updateExternalRating(id: number, rating: Partial<InsertExternalRating>): Promise<ExternalRating>;
  deleteExternalRating(id: number): Promise<boolean>;
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
    // Build efficient conditions
    const conditions = [
      eq(content.type, type),
      eq(content.isActive, true)
    ];
    
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

    const finalCondition = and(...conditions);
    const offset = (page - 1) * limit;
    
    // Use parallel queries for better performance
    const [contentResult, countResult] = await Promise.all([
      db.select().from(content)
        .where(finalCondition)
        .orderBy(desc(content.createdAt))
        .limit(limit)
        .offset(offset),
      
      db.select({ count: sql<number>`count(*)` }).from(content)
        .where(finalCondition)
    ]);

    return {
      content: contentResult,
      total: countResult[0].count
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
    const stats = await db.execute(sql`
      SELECT type, COUNT(*) as count 
      FROM content 
      WHERE "is_active" = true 
      GROUP BY type
    `);

    const result = { movies: 0, series: 0, tv: 0, misc: 0 };
    const rows = Array.isArray(stats) ? stats : stats.rows || [];
    
    rows.forEach((stat: any) => {
      if (stat.type === 'movie') result.movies = Number(stat.count);
      else if (stat.type === 'series') result.series = Number(stat.count);
      else if (stat.type === 'tv') result.tv = Number(stat.count);
      else if (stat.type === 'misc') result.misc = Number(stat.count);
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

  // ================= طرق المحتوى المتطور الجديدة =================
  
  // Cast Members operations
  async getAllCastMembers(): Promise<CastMember[]> {
    return await db.select().from(castMembers).orderBy(castMembers.name);
  }

  async getCastMemberById(id: number): Promise<CastMember | undefined> {
    const [castMember] = await db.select().from(castMembers).where(eq(castMembers.id, id));
    return castMember || undefined;
  }

  async createCastMember(insertCastMember: InsertCastMember): Promise<CastMember> {
    const [castMember] = await db.insert(castMembers).values(insertCastMember).returning();
    return castMember;
  }

  async updateCastMember(id: number, updateCastMember: Partial<InsertCastMember>): Promise<CastMember> {
    const [castMember] = await db
      .update(castMembers)
      .set({ ...updateCastMember, updatedAt: new Date() })
      .where(eq(castMembers.id, id))
      .returning();
    return castMember;
  }

  async deleteCastMember(id: number): Promise<boolean> {
    const result = await db.delete(castMembers).where(eq(castMembers.id, id));
    return result.rowCount > 0;
  }

  // Content Cast operations
  async getContentCast(contentId: number): Promise<(ContentCast & { castMember: CastMember })[]> {
    const result = await db
      .select({
        contentCast: contentCast,
        castMember: castMembers
      })
      .from(contentCast)
      .innerJoin(castMembers, eq(contentCast.castMemberId, castMembers.id))
      .where(eq(contentCast.contentId, contentId))
      .orderBy(contentCast.order, castMembers.name);
    
    return result.map(r => ({ ...r.contentCast, castMember: r.castMember }));
  }

  async addContentCast(insertContentCast: InsertContentCast): Promise<ContentCast> {
    const [newContentCast] = await db.insert(contentCast).values(insertContentCast).returning();
    return newContentCast;
  }

  async removeContentCast(contentId: number, castMemberId: number): Promise<boolean> {
    const result = await db
      .delete(contentCast)
      .where(and(eq(contentCast.contentId, contentId), eq(contentCast.castMemberId, castMemberId)));
    return result.rowCount > 0;
  }

  // Content Images operations
  async getContentImages(contentId: number, type?: string): Promise<ContentImage[]> {
    const whereConditions = [eq(contentImages.contentId, contentId)];
    if (type) {
      whereConditions.push(eq(contentImages.type, type));
    }
    
    return await db
      .select()
      .from(contentImages)
      .where(and(...whereConditions))
      .orderBy(contentImages.order, contentImages.createdAt);
  }

  async addContentImage(insertContentImage: InsertContentImage): Promise<ContentImage> {
    const [newImage] = await db.insert(contentImages).values(insertContentImage).returning();
    return newImage;
  }

  async updateContentImage(id: number, updateContentImage: Partial<InsertContentImage>): Promise<ContentImage> {
    const [image] = await db
      .update(contentImages)
      .set(updateContentImage)
      .where(eq(contentImages.id, id))
      .returning();
    return image;
  }

  async deleteContentImage(id: number): Promise<boolean> {
    const result = await db.delete(contentImages).where(eq(contentImages.id, id));
    return result.rowCount > 0;
  }

  // External Ratings operations
  async getContentExternalRatings(contentId: number): Promise<ExternalRating[]> {
    return await db
      .select()
      .from(externalRatings)
      .where(eq(externalRatings.contentId, contentId))
      .orderBy(externalRatings.source);
  }

  async addExternalRating(insertExternalRating: InsertExternalRating): Promise<ExternalRating> {
    const [rating] = await db.insert(externalRatings).values(insertExternalRating).returning();
    return rating;
  }

  async updateExternalRating(id: number, updateExternalRating: Partial<InsertExternalRating>): Promise<ExternalRating> {
    const [rating] = await db
      .update(externalRatings)
      .set({ ...updateExternalRating, lastUpdated: new Date() })
      .where(eq(externalRatings.id, id))
      .returning();
    return rating;
  }

  async deleteExternalRating(id: number): Promise<boolean> {
    const result = await db.delete(externalRatings).where(eq(externalRatings.id, id));
    return result.rowCount > 0;
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

  // المحتوى المتطور - طرق وهمية للتخزين المؤقت
  async getAllCastMembers(): Promise<CastMember[]> {
    return [];
  }
  
  async getCastMemberById(id: number): Promise<CastMember | undefined> {
    return undefined;
  }
  
  async createCastMember(castMember: InsertCastMember): Promise<CastMember> {
    const newCastMember: CastMember = {
      id: Date.now(),
      ...castMember,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return newCastMember;
  }
  
  async updateCastMember(id: number, castMember: Partial<InsertCastMember>): Promise<CastMember> {
    const updated: CastMember = {
      id,
      name: castMember.name || "",
      nameArabic: castMember.nameArabic || null,
      role: castMember.role || "",
      biography: castMember.biography || null,
      birthDate: castMember.birthDate || null,
      nationality: castMember.nationality || null,
      imageUrl: castMember.imageUrl || null,
      imdbId: castMember.imdbId || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return updated;
  }
  
  async deleteCastMember(id: number): Promise<boolean> {
    return true;
  }
  
  async getContentCast(contentId: number): Promise<(ContentCast & { castMember: CastMember })[]> {
    return [];
  }
  
  async addContentCast(contentCast: InsertContentCast): Promise<ContentCast> {
    const newContentCast: ContentCast = {
      id: Date.now(),
      ...contentCast,
      createdAt: new Date()
    };
    return newContentCast;
  }
  
  async removeContentCast(contentId: number, castMemberId: number): Promise<boolean> {
    return true;
  }
  
  async getContentImages(contentId: number, type?: string): Promise<ContentImage[]> {
    return [];
  }
  
  async addContentImage(image: InsertContentImage): Promise<ContentImage> {
    const newImage: ContentImage = {
      id: Date.now(),
      ...image,
      createdAt: new Date()
    };
    return newImage;
  }
  
  async updateContentImage(id: number, image: Partial<InsertContentImage>): Promise<ContentImage> {
    const updated: ContentImage = {
      id,
      contentId: image.contentId || 0,
      imageUrl: image.imageUrl || "",
      type: image.type || "",
      description: image.description || null,
      descriptionArabic: image.descriptionArabic || null,
      order: image.order || 0,
      createdAt: new Date()
    };
    return updated;
  }
  
  async deleteContentImage(id: number): Promise<boolean> {
    return true;
  }
  
  async getContentExternalRatings(contentId: number): Promise<ExternalRating[]> {
    return [];
  }
  
  async addExternalRating(rating: InsertExternalRating): Promise<ExternalRating> {
    const newRating: ExternalRating = {
      id: Date.now(),
      ...rating,
      lastUpdated: new Date()
    };
    return newRating;
  }
  
  async updateExternalRating(id: number, rating: Partial<InsertExternalRating>): Promise<ExternalRating> {
    const updated: ExternalRating = {
      id,
      contentId: rating.contentId || 0,
      source: rating.source || "",
      rating: rating.rating || "",
      maxRating: rating.maxRating || null,
      url: rating.url || null,
      lastUpdated: new Date()
    };
    return updated;
  }
  
  async deleteExternalRating(id: number): Promise<boolean> {
    return true;
  }

}

// Check if DATABASE_URL is available, use appropriate storage
console.log("🔧 Checking database availability...");
const isDatabaseAvailable = Boolean(process.env.DATABASE_URL);

let storage: IStorage;

if (isDatabaseAvailable) {
  console.log("✅ Using DatabaseStorage with PostgreSQL");
  storage = new DatabaseStorage();
} else {
  console.log("⚠️ Using TemporaryMemoryStorage (no database available)");
  storage = new TemporaryMemoryStorage();
}

export { storage };
