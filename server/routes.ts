import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.js";
import { body, validationResult } from "express-validator";

export async function registerRoutes(app: Express): Promise<Server> {
  // Content stats route
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json({
        totalContent: stats.totalContent,
        totalMovies: stats.totalContent,
        totalSeries: stats.totalContent,
        totalUsers: stats.totalUsers,
        totalCategories: stats.totalCategories,
        totalGenres: stats.totalGenres
      });
    } catch (error) {
      console.error('Stats error:', error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // Categories route
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error('Categories error:', error);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  // Genres route
  app.get("/api/genres", async (req, res) => {
    try {
      const genres = await storage.getGenres();
      res.json(genres);
    } catch (error) {
      console.error('Genres error:', error);
      res.status(500).json({ error: "Failed to fetch genres" });
    }
  });

  // All content route
  app.get("/api/content", async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 24;
      const type = req.query.type as string;
      const category = req.query.category ? parseInt(req.query.category as string) : undefined;
      const genre = req.query.genre ? parseInt(req.query.genre as string) : undefined;
      const search = req.query.search as string;
      
      const filters = {
        type,
        category,
        genre,
        search,
        page,
        limit
      };
      
      const result = await storage.getContent(filters);
      res.json(result);
    } catch (error) {
      console.error('Content error:', error);
      res.status(500).json({ error: "Failed to fetch content" });
    }
  });

  // Content by type route
  app.get("/api/content/:type", async (req, res) => {
    try {
      const { type } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 24;
      
      const filters = {
        type,
        page,
        limit
      };
      
      const result = await storage.getContent(filters);
      res.json(result);
    } catch (error) {
      console.error('Content by type error:', error);
      res.status(500).json({ error: "Failed to fetch content by type" });
    }
  });

  // Recent content route
  app.get("/api/content/recent", async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 12;
      
      const filters = {
        page,
        limit
      };
      
      const result = await storage.getContent(filters);
      res.json({ success: true, data: result.data });
    } catch (error) {
      console.error('Recent content error:', error);
      res.status(500).json({ success: false, error: "خطأ في الخادم" });
    }
  });

  // Featured content route
  app.get("/api/content/featured", async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 12;
      
      const filters = {
        page,
        limit
      };
      
      const result = await storage.getContent(filters);
      res.json({ success: true, data: result.data });
    } catch (error) {
      console.error('Featured content error:', error);
      res.status(500).json({ success: false, error: "خطأ في الخادم" });
    }
  });

  // Content detail route
  app.get("/api/content/detail/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const content = await storage.getContentById(id);
      
      if (!content) {
        return res.status(404).json({ error: "Content not found" });
      }
      
      res.json(content);
    } catch (error) {
      console.error('Content detail error:', error);
      res.status(500).json({ error: "Failed to fetch content detail" });
    }
  });

  // Search route
  app.get("/api/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 24;
      
      const filters = {
        query,
        page,
        limit
      };
      
      const result = await storage.searchContent(query, filters);
      res.json(result);
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ error: "Failed to search content" });
    }
  });

  // Episodes route
  app.get("/api/content/:id/episodes", async (req, res) => {
    try {
      const contentId = parseInt(req.params.id);
      const episodes = await storage.getEpisodes(contentId);
      res.json(episodes);
    } catch (error) {
      console.error('Episodes error:', error);
      res.status(500).json({ error: "Failed to fetch episodes" });
    }
  });

  // Create content route
  app.post("/api/content", 
    [
      body('title').notEmpty().withMessage('Title is required'),
      body('titleAr').notEmpty().withMessage('Arabic title is required'),
      body('type').isIn(['movie', 'series', 'program', 'game', 'application', 'theater', 'wrestling', 'sports']).withMessage('Invalid content type'),
    ],
    async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        
        const content = await storage.createContent(req.body);
        res.status(201).json(content);
      } catch (error) {
        console.error('Create content error:', error);
        res.status(500).json({ error: "Failed to create content" });
      }
    }
  );

  // Update content route
  app.put("/api/content/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const content = await storage.updateContent(id, req.body);
      res.json(content);
    } catch (error) {
      console.error('Update content error:', error);
      res.status(500).json({ error: "Failed to update content" });
    }
  });

  // Delete content route
  app.delete("/api/content/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteContent(id);
      
      if (!success) {
        return res.status(404).json({ error: "Content not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error('Delete content error:', error);
      res.status(500).json({ error: "Failed to delete content" });
    }
  });

  const server = createServer(app);
  return server;
}