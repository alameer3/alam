import type { Express } from "express";
import { createServer, type Server } from "http";
// Storage removed - using fileStorage only
import { fileStorage } from "./file-storage-simple";
import { serverDBStorage } from "./serverdb-storage";
import { insertContentSchema, insertGenreSchema, insertCategorySchema, insertUserSchema, insertUserCommentSchema, insertUserReviewSchema, insertReviewLikeSchema, insertUserFavoriteSchema, insertUserWatchHistorySchema, insertEpisodeSchema } from "@shared/schema";
import { z } from "zod";
import adminRoutes from "./routes/admin";

import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";

import enhancedContentRoutes from "./routes/enhanced-content";
import trailerRoutes from "./routes/trailers";
import analyticsRoutes from "./routes/analytics";

// import { cacheMiddleware, clearCache, trackQueryPerformance } from "./middleware/cache";
// import { QueryOptimizer } from "./middleware/performance";


export async function registerRoutes(app: Express): Promise<Server> {
  // Content stats route - specific for homepage
  app.get("/api/content/stats", async (req, res) => {
    try {
      const stats = await serverDBStorage.getStats();
      
      // Transform stats to match expected format
      const transformedStats = {
        content: [
          { type: 'movies', count: stats.totalMovies },
          { type: 'series', count: stats.totalSeries },
          { type: 'tv', count: stats.totalSeries },
          { type: 'misc', count: stats.totalContent - stats.totalMovies - stats.totalSeries }
        ],
        total: stats.totalContent.toString()
      };
      
      res.json(transformedStats);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Stats fetch error:', error);
      }
      res.status(500).json({ error: "Failed to fetch content stats" });
    }
  });

  // Content routes - simplified without cache
  app.get("/api/content/:type", async (req, res) => {
    try {
      const { type } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const filters = {
        year: req.query.year,
        language: req.query.language,
        quality: req.query.quality,
        resolution: req.query.resolution,
        rating: req.query.rating
      };

      // Map API types to database types
      const typeMapping = {
        'movies': 'movie',
        'series': 'series',
        'tv': 'television',
        'misc': 'miscellaneous'
      };

      const dbType = typeMapping[type as keyof typeof typeMapping] || type;
      const result = await serverDBStorage.getContentByType(dbType, page, limit);
      res.json(result);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Content fetch error:', error);
      }
      res.status(500).json({ error: "Failed to fetch content" });
    }
  });

  // General content route for ?type=movie queries
  app.get("/api/content", async (req, res) => {
    try {
      const type = req.query.type as string || 'movies';
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 24;

      // Map API types to database types
      const typeMapping = {
        'movies': 'movie',
        'series': 'series',
        'tv': 'television',
        'misc': 'miscellaneous'
      };

      const dbType = typeMapping[type as keyof typeof typeMapping] || type;
      const result = await serverDBStorage.getContentByType(dbType, page, limit);
      res.json(result);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Content fetch error:', error);
      }
      res.status(500).json({ error: "Failed to fetch content" });
    }
  });

  app.get("/api/content/item/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const content = await serverDBStorage.getContentById(id);
      
      if (!content) {
        return res.status(404).json({ error: "Content not found" });
      }

      res.json(content);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Content item fetch error:', error);
      }
      res.status(500).json({ error: "Failed to fetch content" });
    }
  });

  app.post("/api/content", async (req, res) => {
    try {
      const validatedData = insertContentSchema.parse(req.body);
      const content = await serverDBStorage.createContent(validatedData);
      
      res.status(201).json(content);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.error('Create content error:', error);
        }
        res.status(500).json({ error: "Failed to create content" });
      }
    }
  });

  app.put("/api/content/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertContentSchema.partial().parse(req.body);
      const content = await serverDBStorage.updateContent(id, validatedData);
      res.json(content);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to update content" });
      }
    }
  });

  app.delete("/api/content/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await serverDBStorage.deleteContent(id);
      
      if (success) {
        res.json({ message: "Content deleted successfully" });
      } else {
        res.status(404).json({ error: "Content not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to delete content" });
    }
  });

  // Search route
  app.get("/api/search", async (req, res) => {
    try {
      const query = req.query.query as string || req.query.q as string;
      const type = req.query.type as string;
      const category = req.query.category as string;
      const genre = req.query.genre as string;
      const language = req.query.language as string;
      const quality = req.query.quality as string;
      const yearFrom = req.query.yearFrom as string;
      const yearTo = req.query.yearTo as string;
      const ratingMin = req.query.ratingMin as string;
      const sortBy = req.query.sortBy as string || 'title';
      const sortOrder = req.query.sortOrder as string || 'asc';
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      
      if (!query) {
        return res.json({ content: [], total: 0 });
      }

      // Build advanced search filters
      const filters = {
        type,
        category,
        genre,
        language,
        quality,
        yearFrom: yearFrom ? parseInt(yearFrom) : undefined,
        yearTo: yearTo ? parseInt(yearTo) : undefined,
        ratingMin: ratingMin ? parseFloat(ratingMin) : undefined,
        sortBy,
        sortOrder,
        page,
        limit
      };

      const results = await serverDBStorage.searchContent(query, filters);
      res.json({ content: results, total: results.length });
    } catch (error) {
      res.status(500).json({ error: "Search failed" });
    }
  });

  // Genres routes
  app.get("/api/genres", async (req, res) => {
    try {
      const genres = await serverDBStorage.getGenres();
      res.json(genres);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch genres" });
    }
  });

  // Categories routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await serverDBStorage.getCategories();
      res.json(categories);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Categories fetch error:', error);
      }
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  // Stats route
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await serverDBStorage.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });



  // Admin cache management
  app.post("/api/admin/clear-cache", async (req, res) => {
    try {
      clearCache('');
      QueryOptimizer.clearQueryCache('');
      res.json({ message: "Cache cleared successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to clear cache" });
    }
  });

  // Auth routes
  app.use("/api/auth", authRoutes);

  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(validatedData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create user" });
      }
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  app.put("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertUserSchema.partial().parse(req.body);
      const user = await storage.updateUser(id, validatedData);
      res.json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to update user" });
      }
    }
  });

  app.get("/api/users/:id/stats", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const stats = await storage.getUserStats(id);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user stats" });
    }
  });

  // User favorites routes
  app.post("/api/users/:id/favorites", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { contentId } = req.body;
      
      await storage.addToFavorites(userId, contentId);
      res.status(201).json({ message: "Added to favorites" });
    } catch (error) {
      res.status(500).json({ error: "Failed to add to favorites" });
    }
  });

  app.delete("/api/users/:id/favorites/:contentId", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const contentId = parseInt(req.params.contentId);
      
      await storage.removeFromFavorites(userId, contentId);
      res.json({ message: "Removed from favorites" });
    } catch (error) {
      res.status(500).json({ error: "Failed to remove from favorites" });
    }
  });

  app.get("/api/users/:id/favorites", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const favorites = await storage.getUserFavorites(userId);
      res.json({ content: favorites });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch favorites" });
    }
  });

  // User watch history routes
  app.post("/api/users/:id/watch-history", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { contentId, progressMinutes } = req.body;
      
      await storage.addToWatchHistory(userId, contentId, progressMinutes);
      res.status(201).json({ message: "Added to watch history" });
    } catch (error) {
      res.status(500).json({ error: "Failed to add to watch history" });
    }
  });

  app.get("/api/users/:id/watch-history", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const history = await storage.getUserWatchHistory(userId);
      res.json({ content: history });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch watch history" });
    }
  });

  // Comments routes
  app.post("/api/content/:id/comments", async (req, res) => {
    try {
      const contentId = parseInt(req.params.id);
      const commentData = {
        ...req.body,
        contentId
      };
      
      const validatedData = insertUserCommentSchema.parse(commentData);
      const comment = await storage.addComment(validatedData);
      res.status(201).json(comment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to add comment" });
      }
    }
  });

  app.get("/api/content/:id/comments", async (req, res) => {
    try {
      const contentId = parseInt(req.params.id);
      const comments = await storage.getContentComments(contentId);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch comments" });
    }
  });

  app.delete("/api/comments/:id", async (req, res) => {
    try {
      const commentId = parseInt(req.params.id);
      const { userId } = req.body;
      
      const success = await storage.deleteComment(commentId, userId);
      
      if (success) {
        res.json({ message: "Comment deleted" });
      } else {
        res.status(404).json({ error: "Comment not found or not authorized" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to delete comment" });
    }
  });

  // Reviews routes
  app.post("/api/content/:id/reviews", async (req, res) => {
    try {
      const contentId = parseInt(req.params.id);
      const reviewData = {
        ...req.body,
        contentId
      };
      
      const validatedData = insertUserReviewSchema.parse(reviewData);
      const review = await storage.addReview(validatedData);
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to add review" });
      }
    }
  });

  app.get("/api/content/:id/reviews", async (req, res) => {
    try {
      const contentId = parseInt(req.params.id);
      const reviews = await storage.getContentReviews(contentId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  });

  app.put("/api/reviews/:id", async (req, res) => {
    try {
      const reviewId = parseInt(req.params.id);
      const { userId, ...reviewData } = req.body;
      
      const validatedData = insertUserReviewSchema.partial().parse(reviewData);
      const review = await storage.updateReview(reviewId, userId, validatedData);
      res.json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to update review" });
      }
    }
  });

  app.delete("/api/reviews/:id", async (req, res) => {
    try {
      const reviewId = parseInt(req.params.id);
      const { userId } = req.body;
      
      const success = await storage.deleteReview(reviewId, userId);
      
      if (success) {
        res.json({ message: "Review deleted" });
      } else {
        res.status(404).json({ error: "Review not found or not authorized" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to delete review" });
    }
  });

  app.post("/api/reviews/:id/like", async (req, res) => {
    try {
      const reviewId = parseInt(req.params.id);
      const { userId, isLike } = req.body;
      
      await storage.likeReview(userId, reviewId, isLike);
      res.json({ message: "Review liked/disliked" });
    } catch (error) {
      res.status(500).json({ error: "Failed to like/dislike review" });
    }
  });

  app.get("/api/users/:userId/reviews/content/:contentId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const contentId = parseInt(req.params.contentId);
      
      const review = await storage.getUserReviewForContent(userId, contentId);
      
      if (review) {
        res.json(review);
      } else {
        res.status(404).json({ error: "Review not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user review" });
    }
  });

  // View counting
  app.post("/api/content/:id/view", async (req, res) => {
    try {
      const contentId = parseInt(req.params.id);
      await storage.incrementViewCount(contentId);
      res.json({ message: "View counted" });
    } catch (error) {
      res.status(500).json({ error: "Failed to count view" });
    }
  });

  // Admin routes
  app.use("/api/admin", adminRoutes);
  


  // Content management routes
  app.get('/api/content/all', async (req, res) => {
    try {
      const movieContent = await storage.getContentByType('movie', 1, 50);
      const seriesContent = await storage.getContentByType('series', 1, 50);
      const tvContent = await storage.getContentByType('tv', 1, 50);
      const miscContent = await storage.getContentByType('misc', 1, 50);
      
      const allContent = [
        ...movieContent.content,
        ...seriesContent.content,
        ...tvContent.content,
        ...miscContent.content
      ];
      
      res.json({
        content: allContent,
        total: allContent.length
      });
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching all content:', error);
      }
      res.status(500).json({ error: 'Failed to fetch content' });
    }
  });
  
  // Initialize backup system

  
  // Register user routes  
  userRoutes(app);
  
  // Enhanced content routes for cast, images, and external ratings
  app.use("/api/enhanced", enhancedContentRoutes);
  
  // Trailer routes
  app.use("/api/trailers", trailerRoutes);

  // Admin routes
  app.get("/api/admin/stats", async (req, res) => {
    try {
      const stats = await storage.getContentStats();
      const totalUsers = 8932; // Mock data - in real app, get from user table
      const pendingApproval = 23; // Mock data - in real app, get from content with pending status
      const totalViews = 2847392; // Mock data - in real app, get from content_views table
      
      res.json({
        totalContent: Object.values(stats).reduce((a, b) => parseInt(a.toString()) + parseInt(b.toString()), 0),
        totalUsers,
        pendingApproval,
        totalViews,
        contentByType: stats
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch admin stats" });
    }
  });

  app.get("/api/content/pending", async (req, res) => {
    try {
      // Mock data for pending content approval
      const pendingContent = [
        {
          id: 1,
          title: "The Matrix",
          titleArabic: "الماتريكس",
          type: "movie",
          submittedBy: "محمد أحمد",
          submittedAt: new Date("2024-01-15"),
          status: "pending",
          priority: "high",
          category: "أجنبي",
          genre: "خيال علمي",
          rating: 8.7,
          posterUrl: "/api/placeholder/300/400",
          description: "فيلم خيال علمي عن الواقع الافتراضي"
        }
      ];
      res.json(pendingContent);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch pending content" });
    }
  });

  app.get("/api/content/approved", async (req, res) => {
    try {
      // Mock data for approved content
      const approvedContent = [
        {
          id: 3,
          title: "Inception",
          titleArabic: "البداية",
          type: "movie",
          approvedBy: "أحمد علي",
          approvedAt: new Date("2024-01-13"),
          status: "approved",
          views: 15420,
          rating: 8.8
        }
      ];
      res.json(approvedContent);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch approved content" });
    }
  });

  app.get("/api/content/rejected", async (req, res) => {
    try {
      // Mock data for rejected content
      const rejectedContent = [
        {
          id: 4,
          title: "Low Quality Movie",
          titleArabic: "فيلم رديء الجودة",
          type: "movie",
          rejectedBy: "أحمد علي",
          rejectedAt: new Date("2024-01-12"),
          status: "rejected",
          rejectionReason: "جودة الفيديو منخفضة جداً"
        }
      ];
      res.json(rejectedContent);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch rejected content" });
    }
  });

  app.post("/api/content/:id/approve", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { adminId } = req.body;
      
      // In a real app, update content status to approved
      // await storage.updateContent(id, { status: 'approved', approvedBy: adminId });
      
      res.json({ message: "Content approved successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to approve content" });
    }
  });

  app.post("/api/content/:id/reject", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { adminId, reason } = req.body;
      
      // In a real app, update content status to rejected
      // await storage.updateContent(id, { status: 'rejected', rejectedBy: adminId, rejectionReason: reason });
      
      res.json({ message: "Content rejected successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to reject content" });
    }
  });

  app.post("/api/content/:id/suspend", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { adminId } = req.body;
      
      // In a real app, update content status to suspended
      // await storage.updateContent(id, { status: 'suspended', suspendedBy: adminId });
      
      res.json({ message: "Content suspended successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to suspend content" });
    }
  });



  // Analytics routes
  app.use("/api/analytics", analyticsRoutes);



  // Episodes routes
  app.get('/api/episodes/:contentId', async (req, res) => {
    try {
      const contentId = parseInt(req.params.contentId);
      const season = parseInt(req.query.season as string) || 1;
      
      if (isNaN(contentId)) {
        return res.status(400).json({ error: 'معرف المحتوى غير صحيح' });
      }

      const episodes = await storage.getEpisodesByContentAndSeason(contentId, season);
      const seasons = await storage.getSeasonsByContent(contentId);
      
      res.json({
        episodes,
        seasons,
        total: episodes.length
      });
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Episodes fetch error:', error);
      }
      res.status(500).json({ error: 'فشل في تحميل الحلقات' });
    }
  });

  app.post('/api/episodes', async (req, res) => {
    try {
      const episodeData = insertEpisodeSchema.parse(req.body);
      const episode = await storage.createEpisode(episodeData);
      res.status(201).json(episode);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'بيانات غير صحيحة', details: error.issues });
      }
      if (process.env.NODE_ENV === 'development') {
        console.error('Episode creation error:', error);
      }
      res.status(500).json({ error: 'فشل في إنشاء الحلقة' });
    }
  });

  app.put('/api/episodes/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'معرف الحلقة غير صحيح' });
      }

      const updates = insertEpisodeSchema.partial().parse(req.body);
      const episode = await storage.updateEpisode(id, updates);
      
      if (!episode) {
        return res.status(404).json({ error: 'الحلقة غير موجودة' });
      }
      
      res.json(episode);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'بيانات غير صحيحة', details: error.issues });
      }
      if (process.env.NODE_ENV === 'development') {
        console.error('Episode update error:', error);
      }
      res.status(500).json({ error: 'فشل في تحديث الحلقة' });
    }
  });

  app.delete('/api/episodes/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'معرف الحلقة غير صحيح' });
      }

      const success = await storage.deleteEpisode(id);
      if (!success) {
        return res.status(404).json({ error: 'الحلقة غير موجودة' });
      }
      
      res.json({ success: true, message: 'تم حذف الحلقة بنجاح' });
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Episode deletion error:', error);
      }
      res.status(500).json({ error: 'فشل في حذف الحلقة' });
    }
  });

  // Error Reports Route - direct implementation
  app.post('/api/reports', async (req, res) => {
    try {
      const { contentId, contentTitle, email, reason, description, pageUrl, timestamp } = req.body;

      // التحقق من البيانات المطلوبة
      if (!contentId || !contentTitle || !reason || !description) {
        return res.status(400).json({
          success: false,
          message: 'البيانات المطلوبة مفقودة'
        });
      }

      // معلومات إضافية للتقرير
      const report = {
        id: Date.now(),
        contentId,
        contentTitle,
        email: email || 'غير محدد',
        reason,
        description,
        pageUrl,
        timestamp,
        userAgent: req.headers['user-agent'] || '',
        ip: req.ip || req.connection.remoteAddress || '',
        status: 'جديد',
        createdAt: new Date().toISOString()
      };

      // عرض التقرير في console للمطورين
      if (process.env.NODE_ENV === 'development') {
        console.log('📝 تقرير خطأ جديد:', report);
      }

      res.status(201).json({
        success: true,
        message: 'تم إرسال التبليغ بنجاح. شكراً لك على مساعدتنا في تحسين الخدمة.',
        reportId: report.id
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'حدث خطأ أثناء إرسال التبليغ. يرجى المحاولة مرة أخرى.'
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
