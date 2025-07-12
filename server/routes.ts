import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContentSchema, insertGenreSchema, insertCategorySchema, insertUserSchema, insertUserCommentSchema, insertUserReviewSchema, insertReviewLikeSchema, insertUserFavoriteSchema, insertUserWatchHistorySchema } from "@shared/schema";
import { z } from "zod";
import adminRoutes from "./routes/admin";
import performanceRoutes from "./routes/performance";
import { cacheMiddleware, clearCache } from "./middleware/cache";
import { QueryOptimizer } from "./middleware/performance";
import { initializeBackupSystem } from "./middleware/backup";

export async function registerRoutes(app: Express): Promise<Server> {
  // Content routes with caching
  app.get("/api/content/:type", 
    cacheMiddleware({ 
      ttl: 300, // 5 minutes
      keyGenerator: (req) => `content:${req.params.type}:${JSON.stringify(req.query)}`
    }),
    async (req, res) => {
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

        const result = await QueryOptimizer.optimizeQuery(
          `content:${type}:${page}:${limit}:${JSON.stringify(filters)}`,
          () => storage.getContentByType(type, page, limit, filters),
          300
        );
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch content" });
      }
    }
  );

  app.get("/api/content/item/:id", 
    cacheMiddleware({ 
      ttl: 600, // 10 minutes
      keyGenerator: (req) => `content:item:${req.params.id}`
    }),
    async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        const content = await QueryOptimizer.optimizeQuery(
          `content:item:${id}`,
          () => storage.getContent(id),
          600
        );
        
        if (!content) {
          return res.status(404).json({ error: "Content not found" });
        }

        res.json(content);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch content" });
      }
    }
  );

  app.post("/api/content", async (req, res) => {
    try {
      const validatedData = insertContentSchema.parse(req.body);
      const content = await storage.createContent(validatedData);
      
      // Clear content cache when new content is created
      clearCache('content:');
      QueryOptimizer.clearQueryCache('content:');
      
      res.status(201).json(content);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create content" });
      }
    }
  });

  app.put("/api/content/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertContentSchema.partial().parse(req.body);
      const content = await storage.updateContent(id, validatedData);
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
      const success = await storage.deleteContent(id);
      
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

      const results = await storage.searchContent(query, type, filters);
      res.json({ content: results, total: results.length });
    } catch (error) {
      res.status(500).json({ error: "Search failed" });
    }
  });

  // Genres routes
  app.get("/api/genres", async (req, res) => {
    try {
      const genres = await storage.getAllGenres();
      res.json(genres);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch genres" });
    }
  });

  app.post("/api/genres", async (req, res) => {
    try {
      const validatedData = insertGenreSchema.parse(req.body);
      const genre = await storage.createGenre(validatedData);
      res.status(201).json(genre);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create genre" });
      }
    }
  });

  // Categories routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  app.post("/api/categories", async (req, res) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validatedData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create category" });
      }
    }
  });

  // Stats route
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getContentStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // Auth route for mock user
  app.get("/api/auth/user", async (req, res) => {
    // Mock user for demonstration purposes
    const mockUser = {
      id: 1,
      username: "test_user",
      email: "test@example.com",
      firstName: "محمد",
      lastName: "أحمد",
      profileImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      isAdmin: false,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    res.json(mockUser);
  });

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
  
  // Performance routes
  app.use("/api/performance", performanceRoutes);

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
      console.error('Error fetching all content:', error);
      res.status(500).json({ error: 'Failed to fetch content' });
    }
  });
  
  // Initialize backup system
  initializeBackupSystem();

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

  const httpServer = createServer(app);
  return httpServer;
}
