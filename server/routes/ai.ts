import express from "express";
import { RecommendationEngine } from "../ai/recommendation-engine";
import { DatabaseStorage } from "../storage";
import { z } from "zod";

const router = express.Router();

// Initialize recommendation engine
const storage = new DatabaseStorage();
const recommendationEngine = new RecommendationEngine(storage);

// Get personalized recommendations
router.get("/recommendations/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const limit = parseInt(req.query.limit as string) || 10;
    
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const recommendations = await recommendationEngine.generateRecommendations(userId, limit);
    
    // Get full content details for recommendations
    const contentDetails = await Promise.all(
      recommendations.map(async (rec) => {
        const content = await storage.getContent(rec.contentId);
        return {
          ...content,
          recommendationScore: rec.score,
          recommendationReasons: rec.reasons
        };
      })
    );

    res.json({
      recommendations: contentDetails.filter(Boolean),
      userId,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error getting recommendations:", error);
    res.status(500).json({ 
      error: "Failed to generate recommendations", 
      details: "System is using fallback recommendations due to API limitations"
    });
  }
});

// Analyze sentiment of text
router.post("/sentiment", async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: "Text is required" });
    }

    const analysis = await recommendationEngine.analyzeSentiment(text);
    res.json(analysis);
  } catch (error) {
    console.error("Error analyzing sentiment:", error);
    res.status(500).json({ 
      error: "Failed to analyze sentiment", 
      details: "System is using basic sentiment analysis due to API limitations"
    });
  }
});

// Semantic search
router.post("/search", async (req, res) => {
  try {
    const searchSchema = z.object({
      query: z.string().min(1),
      type: z.string().optional(),
      limit: z.number().min(1).max(50).optional()
    });

    const { query, type, limit = 10 } = searchSchema.parse(req.body);
    
    const results = await recommendationEngine.semanticSearch(query, type, limit);
    
    res.json({
      query,
      type,
      results,
      totalFound: results.length,
      searchedAt: new Date().toISOString()
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error in semantic search:", error);
    res.status(500).json({ 
      error: "Failed to perform semantic search", 
      details: "System is using basic search due to API limitations"
    });
  }
});

// Auto-categorize content
router.post("/categorize/:contentId", async (req, res) => {
  try {
    const contentId = parseInt(req.params.contentId);
    
    if (isNaN(contentId)) {
      return res.status(400).json({ error: "Invalid content ID" });
    }

    const content = await storage.getContent(contentId);
    if (!content) {
      return res.status(404).json({ error: "Content not found" });
    }

    const categorization = await recommendationEngine.autoCategorizeCcontent(content);
    
    res.json({
      contentId,
      content: {
        id: content.id,
        title: content.title,
        type: content.type
      },
      categorization,
      analyzedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error auto-categorizing content:", error);
    res.status(500).json({ error: "Failed to auto-categorize content" });
  }
});

// Get user preferences insight
router.get("/preferences/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const favorites = await storage.getUserFavorites(userId);
    const watchHistory = await storage.getUserWatchHistory(userId);
    
    // Extract insights
    const favoriteGenres = [...new Set(favorites.flatMap(c => c.genres?.map(g => g.name) || []))];
    const favoriteCategories = [...new Set(favorites.flatMap(c => c.categories?.map(cat => cat.name) || []))];
    const avgRating = favorites.reduce((sum, c) => sum + (c.rating || 0), 0) / favorites.length || 0;
    
    const typePreferences = favorites.reduce((acc, content) => {
      acc[content.type] = (acc[content.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    res.json({
      userId,
      insights: {
        favoriteGenres,
        favoriteCategories,
        averageRating: Math.round(avgRating * 10) / 10,
        typePreferences,
        totalFavorites: favorites.length,
        totalWatched: watchHistory.length
      },
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error getting user preferences:", error);
    res.status(500).json({ error: "Failed to get user preferences" });
  }
});

// Batch analyze content sentiments
router.post("/analyze-batch", async (req, res) => {
  try {
    const { contentIds } = req.body;
    
    if (!Array.isArray(contentIds) || contentIds.length === 0) {
      return res.status(400).json({ error: "Content IDs array is required" });
    }

    const analyses = await Promise.all(
      contentIds.map(async (id: number) => {
        try {
          const content = await storage.getContent(id);
          if (!content) return null;
          
          const categorization = await recommendationEngine.autoCategorizeCcontent(content);
          return {
            contentId: id,
            title: content.title,
            categorization
          };
        } catch (error) {
          console.error(`Error analyzing content ${id}:`, error);
          return null;
        }
      })
    );

    res.json({
      analyses: analyses.filter(Boolean),
      processedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error in batch analysis:", error);
    res.status(500).json({ error: "Failed to perform batch analysis" });
  }
});

export default router;