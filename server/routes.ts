import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContentSchema, insertGenreSchema, insertCategorySchema, insertUserSchema, insertUserCommentSchema, insertUserReviewSchema, insertReviewLikeSchema, insertUserFavoriteSchema, insertUserWatchHistorySchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Content routes
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

      const result = await storage.getContentByType(type, page, limit, filters);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch content" });
    }
  });

  app.get("/api/content/item/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const content = await storage.getContent(id);
      
      if (!content) {
        return res.status(404).json({ error: "Content not found" });
      }

      res.json(content);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch content" });
    }
  });

  app.post("/api/content", async (req, res) => {
    try {
      const validatedData = insertContentSchema.parse(req.body);
      const content = await storage.createContent(validatedData);
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
      const query = req.query.q as string;
      const type = req.query.type as string;
      
      if (!query) {
        return res.json({ content: [] });
      }

      const results = await storage.searchContent(query, type);
      res.json({ content: results });
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

  const httpServer = createServer(app);
  return httpServer;
}
