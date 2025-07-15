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

  // Featured content route
  app.get("/api/content/featured", async (req, res) => {
    try {
      const featured = await serverDBStorage.getFeaturedContent();
      res.json({ content: featured, total: featured.length, page: 1, limit: 20, totalPages: 1 });
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Featured content error:', error);
      }
      res.status(500).json({ error: "Failed to fetch featured content" });
    }
  });

  // Trending content route
  app.get("/api/content/trending", async (req, res) => {
    try {
      const trending = await serverDBStorage.getTrendingContent();
      res.json({ content: trending, total: trending.length, page: 1, limit: 20, totalPages: 1 });
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Trending content error:', error);
      }
      res.status(500).json({ error: "Failed to fetch trending content" });
    }
  });

  // Search route
  app.get("/api/content/search", async (req, res) => {
    try {
      const query = req.query.q as string || req.query.query as string;
      if (!query) {
        return res.json({ content: [], total: 0, page: 1, limit: 20, totalPages: 0 });
      }
      
      const result = await serverDBStorage.searchContent(query);
      res.json(result);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Content search error:', error);
      }
      res.status(500).json({ error: "Failed to search content" });
    }
  });

  // Additional search route for fallback
  app.get("/api/search", async (req, res) => {
    try {
      const query = req.query.query as string || req.query.q as string;
      if (!query) {
        return res.status(400).json({ error: "Query parameter is required" });
      }
      
      const result = await serverDBStorage.searchContent(query);
      res.json(result);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Search error:', error);
      }
      res.status(500).json({ error: "Failed to search content" });
    }
  });

  // CRUD Operations for content
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
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  // Admin routes
  app.use("/api/admin", adminRoutes);

  // Authentication routes
  app.use("/api/auth", authRoutes);

  // User routes
  app.use("/api/users", userRoutes);

  // Enhanced content routes
  app.use("/api/enhanced", enhancedContentRoutes);

  // Trailer routes
  app.use("/api/trailers", trailerRoutes);

  // Analytics routes
  app.use("/api/analytics", analyticsRoutes);

  const httpServer = createServer(app);
  return httpServer;
}