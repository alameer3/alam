import type { Express } from "express";
import { createServer, type Server } from "http";
import { dbManager } from "./database/database-manager.js";

export async function registerRoutes(app: Express): Promise<Server> {
  // Content stats route
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await dbManager.getDashboardStats();
      res.json({
        totalContent: stats.totalContent,
        totalMovies: stats.totalContent, // تبسيط
        totalSeries: stats.totalContent, // تبسيط
        totalUsers: stats.totalUsers,
        totalCategories: 10, // من البيانات الافتراضية
        totalGenres: 15 // من البيانات الافتراضية
      });
    } catch (error) {
      console.error('Stats error:', error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // Categories route
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await dbManager.getCategories();
      res.json(categories);
    } catch (error) {
      console.error('Categories error:', error);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  // Genres route
  app.get("/api/genres", async (req, res) => {
    try {
      const genres = await dbManager.getGenres();
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
      
      const filters = {
        type,
        page,
        limit
      };
      
      const result = await dbManager.getContent(filters);
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
      
      const result = await dbManager.getContent(filters);
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
      const limit = parseInt(req.query.limit as string) || 24;
      
      const filters = {
        sortBy: 'created_at',
        sortOrder: 'desc' as const,
        page,
        limit
      };
      
      const result = await dbManager.getContent(filters);
      res.json({ success: true, data: result.content });
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
        featured: true,
        page,
        limit
      };
      
      const result = await dbManager.getContent(filters);
      res.json({ success: true, data: result.content });
    } catch (error) {
      console.error('Featured content error:', error);
      res.status(500).json({ success: false, error: "خطأ في الخادم" });
    }
  });

  // Trending content route
  app.get("/api/content/trending", async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 12;
      
      const filters = {
        trending: true,
        page,
        limit
      };
      
      const result = await dbManager.getContent(filters);
      res.json({ success: true, data: result.content });
    } catch (error) {
      console.error('Trending content error:', error);
      res.status(500).json({ success: false, error: "خطأ في الخادم" });
    }
  });

  // Content detail route
  app.get("/api/content/detail/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const content = await dbManager.getContentById(id);
      
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
      
      const result = await dbManager.getContent(filters);
      res.json(result);
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ error: "Failed to search content" });
    }
  });

  // Featured content route
  app.get("/api/content/featured", async (req, res) => {
    try {
      const filters = {
        featured: true,
        sortBy: 'rating',
        sortOrder: 'desc' as const,
        page: 1,
        limit: 10
      };
      
      const result = await dbManager.getContent(filters);
      res.json({ success: true, data: result.content });
    } catch (error) {
      console.error('Featured content error:', error);
      res.status(500).json({ success: false, error: "خطأ في الخادم" });
    }
  });

  // Trending content route
  app.get("/api/content/trending", async (req, res) => {
    try {
      const filters = {
        trending: true,
        sortBy: 'view_count',
        sortOrder: 'desc' as const,
        page: 1,
        limit: 10
      };
      
      const result = await dbManager.getContent(filters);
      res.json({ success: true, data: result.content });
    } catch (error) {
      console.error('Trending content error:', error);
      res.status(500).json({ success: false, error: "خطأ في الخادم" });
    }
  });

  // Episodes route
  app.get("/api/content/:id/episodes", async (req, res) => {
    try {
      const contentId = parseInt(req.params.id);
      const content = await dbManager.getContentById(contentId);
      
      if (!content) {
        return res.status(404).json({ error: "Content not found" });
      }
      
      res.json(content.episodes || []);
    } catch (error) {
      console.error('Episodes error:', error);
      res.status(500).json({ error: "Failed to fetch episodes" });
    }
  });

  // Download links route
  app.get("/api/content/:id/download-links", async (req, res) => {
    try {
      const contentId = parseInt(req.params.id);
      const episodeId = req.query.episode_id ? parseInt(req.query.episode_id as string) : null;
      
      const content = await dbManager.getContentById(contentId);
      
      if (!content) {
        return res.status(404).json({ error: "Content not found" });
      }
      
      // فلترة روابط التحميل بناءً على الحلقة إذا كانت محددة
      let downloadLinks = content.downloadLinks || [];
      if (episodeId) {
        downloadLinks = downloadLinks.filter(link => link.episodeId === episodeId);
      }
      
      res.json(downloadLinks);
    } catch (error) {
      console.error('Download links error:', error);
      res.status(500).json({ error: "Failed to fetch download links" });
    }
  });

  // Streaming links route
  app.get("/api/content/:id/streaming-links", async (req, res) => {
    try {
      const contentId = parseInt(req.params.id);
      const episodeId = req.query.episode_id ? parseInt(req.query.episode_id as string) : null;
      
      const content = await dbManager.getContentById(contentId);
      
      if (!content) {
        return res.status(404).json({ error: "Content not found" });
      }
      
      // فلترة روابط المشاهدة بناءً على الحلقة إذا كانت محددة
      let streamingLinks = content.streamingLinks || [];
      if (episodeId) {
        streamingLinks = streamingLinks.filter(link => link.episodeId === episodeId);
      }
      
      res.json(streamingLinks);
    } catch (error) {
      console.error('Streaming links error:', error);
      res.status(500).json({ error: "Failed to fetch streaming links" });
    }
  });

  const server = createServer(app);
  return server;
}