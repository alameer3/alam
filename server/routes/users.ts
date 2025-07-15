import type { Express } from "express";
import { fileStorage } from "../file-storage-simple";
import { insertUserSchema, insertUserCommentSchema, insertUserReviewSchema, insertUserFavoriteSchema, insertUserWatchHistorySchema } from "@shared/schema";
import { z } from "zod";
import { cacheMiddleware, clearCache } from "../middleware/cache";

export default function registerUserRoutes(app: Express) {
  // User profile routes
  app.get("/api/users/:id/profile", 
    cacheMiddleware({ 
      ttl: 300,
      keyGenerator: (req) => `user:profile:${req.params.id}`
    }),
    async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        const user = await storage.getUser(id);
        
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        // Extend user with additional profile data
        const profileData = {
          ...user,
          joinedDate: "يناير 2024",
          lastActive: new Date().toISOString(),
          bio: user.bio || "مرحباً! أنا عضو في منصة Yemen Flix وأحب مشاهدة الأفلام والمسلسلات العربية.",
          favoriteGenres: ["حركة", "دراما", "كوميديا"]
        };

        res.json(profileData);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch user profile" });
      }
    }
  );

  app.put("/api/users/:id/profile", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertUserSchema.partial().parse(req.body);
      const user = await storage.updateUser(id, validatedData);
      
      clearCache(`user:profile:${id}`);
      
      res.json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to update user profile" });
      }
    }
  });

  // User statistics
  app.get("/api/users/:id/stats", 
    cacheMiddleware({ 
      ttl: 180,
      keyGenerator: (req) => `user:stats:${req.params.id}`
    }),
    async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        const stats = await storage.getUserStats(id);
        
        // Add additional stats
        const enhancedStats = {
          ...stats,
          reviewsCount: 3,
          totalWatchTime: 1250 // minutes
        };
        
        res.json(enhancedStats);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch user stats" });
      }
    }
  );

  // User favorites
  app.get("/api/users/:id/favorites", 
    cacheMiddleware({ 
      ttl: 300,
      keyGenerator: (req) => `user:favorites:${req.params.id}`
    }),
    async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        const favorites = await storage.getUserFavorites(id);
        res.json(favorites);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch user favorites" });
      }
    }
  );

  // User watch history
  app.get("/api/users/:id/watch-history", 
    cacheMiddleware({ 
      ttl: 300,
      keyGenerator: (req) => `user:history:${req.params.id}`
    }),
    async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        const history = await storage.getUserWatchHistory(id);
        res.json(history);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch user watch history" });
      }
    }
  );

  // Watchlists
  app.get("/api/users/:id/watchlists", 
    cacheMiddleware({ 
      ttl: 300,
      keyGenerator: (req) => `user:watchlists:${req.params.id}`
    }),
    async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        
        // Mock watchlists data for now
        const watchlists = [
          {
            id: 1,
            name: "أفلام الحركة المفضلة",
            description: "مجموعة من أفضل أفلام الحركة",
            isPublic: false,
            itemCount: 5,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
            updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
          },
          {
            id: 2,
            name: "مسلسلات كوريةمشهورة",
            description: "أفضل المسلسلات الكورية",
            isPublic: true,
            itemCount: 8,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
            updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
          }
        ];
        
        res.json(watchlists);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch user watchlists" });
      }
    }
  );

  app.post("/api/users/:id/watchlists", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { name, description, isPublic } = req.body;
      
      if (!name?.trim()) {
        return res.status(400).json({ error: "Watchlist name is required" });
      }

      // Mock create watchlist
      const newWatchlist = {
        id: Date.now(),
        name: name.trim(),
        description: description?.trim() || "",
        isPublic: Boolean(isPublic),
        itemCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      clearCache(`user:watchlists:${id}`);
      
      res.status(201).json(newWatchlist);
    } catch (error) {
      res.status(500).json({ error: "Failed to create watchlist" });
    }
  });

  // Watchlist items
  app.get("/api/watchlists/:id/items", 
    cacheMiddleware({ 
      ttl: 300,
      keyGenerator: (req) => `watchlist:items:${req.params.id}`
    }),
    async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        
        // For predefined watchlists, return mock data
        if (id === -1) { // Favorites
          const favorites = await storage.getUserFavorites(1); // Mock user ID
          return res.json(favorites);
        }
        
        if (id === -2) { // Watch Later
          const history = await storage.getUserWatchHistory(1); // Mock user ID
          return res.json(history.slice(0, 3)); // Recent 3 items
        }
        
        if (id === -3) { // Best this year
          const content = await storage.getContentByType('movie', 1, 10);
          return res.json(content.content.slice(0, 5));
        }
        
        // For user watchlists, return mock items
        const content = await storage.getContentByType('movie', 1, 5);
        res.json(content.content);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch watchlist items" });
      }
    }
  );

  app.delete("/api/watchlists/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Mock delete - in real implementation, would delete from database
      clearCache(`watchlist:items:${id}`);
      clearCache(`user:watchlists:`); // Clear all user watchlists cache
      
      res.json({ message: "Watchlist deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete watchlist" });
    }
  });

  // Notifications
  app.get("/api/users/:id/notifications", 
    cacheMiddleware({ 
      ttl: 60, // Short cache for notifications
      keyGenerator: (req) => `user:notifications:${req.params.id}`
    }),
    async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        
        // Mock notifications data
        const notifications = [
          {
            id: 1,
            type: 'new_content',
            title: 'محتوى جديد متاح',
            message: 'تم إضافة فيلم جديد "الفارس الأسود 2" إلى المنصة',
            isRead: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
            data: { contentId: 5, contentTitle: 'الفارس الأسود 2' }
          },
          {
            id: 2,
            type: 'comment_reply',
            title: 'رد على تعليقك',
            message: 'رد أحمد على تعليقك في فيلم "Breaking Bad"',
            isRead: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
            data: { contentId: 2, contentTitle: 'Breaking Bad', username: 'أحمد' }
          },
          {
            id: 3,
            type: 'review_like',
            title: 'إعجاب بمراجعتك',
            message: 'أعجب 5 أشخاص بمراجعتك لفيلم "الفارس الأسود"',
            isRead: true,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
            data: { contentId: 1, contentTitle: 'الفارس الأسود' }
          },
          {
            id: 4,
            type: 'system',
            title: 'تحديث النظام',
            message: 'تم تحديث منصة Yemen Flix بمزايا جديدة',
            isRead: true,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
          }
        ];
        
        res.json(notifications);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch notifications" });
      }
    }
  );

  app.put("/api/notifications/:id/read", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Mock mark as read
      clearCache(`user:notifications:`);
      
      res.json({ message: "Notification marked as read" });
    } catch (error) {
      res.status(500).json({ error: "Failed to mark notification as read" });
    }
  });

  app.put("/api/users/:id/notifications/mark-all-read", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Mock mark all as read
      clearCache(`user:notifications:${id}`);
      
      res.json({ message: "All notifications marked as read" });
    } catch (error) {
      res.status(500).json({ error: "Failed to mark all notifications as read" });
    }
  });

  app.delete("/api/notifications/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Mock delete notification
      clearCache(`user:notifications:`);
      
      res.json({ message: "Notification deleted" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete notification" });
    }
  });

  // Notification settings
  app.get("/api/users/:id/notification-settings", 
    cacheMiddleware({ 
      ttl: 600,
      keyGenerator: (req) => `user:notification-settings:${req.params.id}`
    }),
    async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        
        // Mock notification settings
        const settings = {
          newContent: true,
          favoriteUpdates: true,
          commentReplies: true,
          reviewLikes: false,
          systemNotifications: true,
          emailNotifications: false,
        };
        
        res.json(settings);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch notification settings" });
      }
    }
  );

  app.put("/api/users/:id/notification-settings", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const settings = req.body;
      
      // Mock update settings
      clearCache(`user:notification-settings:${id}`);
      
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to update notification settings" });
    }
  });
}