import type { Express } from "express";
import { createServer, type Server } from "http";
import fs from "fs";
import path from "path";

// Simple database manager using serverdata
class SimpleDatabase {
  private data: any = {};
  private dataPath: string;

  constructor() {
    this.dataPath = path.join(process.cwd(), 'serverdata', 'database.json');
    this.loadData();
  }

  private loadData() {
    try {
      if (fs.existsSync(this.dataPath)) {
        const rawData = fs.readFileSync(this.dataPath, 'utf8');
        this.data = JSON.parse(rawData);
      } else {
        this.data = {
          categories: [],
          genres: [],
          users: [],
          content: [],
          episodes: [],
          downloadLinks: [],
          streamingLinks: [],
          userReviewLikes: []
        };
      }
    } catch (error) {
      console.error('Error loading database:', error);
      this.data = {
        categories: [],
        genres: [],
        users: [],
        content: [],
        episodes: [],
        downloadLinks: [],
        streamingLinks: [],
        userReviewLikes: []
      };
    }
  }

  async getCategories() {
    return this.data.categories || [];
  }

  async getGenres() {
    return this.data.genres || [];
  }

  async getContentByType(type: string, page: number = 1, limit: number = 24) {
    const allContent = this.data.content || [];
    
    // Filter by type if specified
    let filteredContent = allContent;
    if (type && type !== 'all') {
      filteredContent = allContent.filter((item: any) => item.type === type);
    }

    // Sort by created date (newest first)
    filteredContent.sort((a: any, b: any) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    // Paginate
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedContent = filteredContent.slice(startIndex, endIndex);

    // Transform content for API response
    const transformedContent = paginatedContent.map((item: any) => ({
      ...item,
      titleArabic: item.title_arabic,
      descriptionArabic: item.description_arabic,
      posterUrl: item.poster_url,
      videoUrl: item.video_url,
      downloadUrl: item.download_url,
      trailerUrl: item.trailer_url,
      imdbId: item.imdb_id,
      tmdbId: item.tmdb_id,
      rottenTomatoesScore: item.rotten_tomatoes_score,
      metacriticScore: item.metacritic_score,
      boxOffice: item.box_office,
      isActive: item.is_active,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      categories: [],
      genres: []
    }));

    return {
      content: transformedContent,
      total: filteredContent.length,
      page,
      limit,
      totalPages: Math.ceil(filteredContent.length / limit)
    };
  }

  async getContentById(id: number) {
    const allContent = this.data.content || [];
    const item = allContent.find((content: any) => content.id === id);
    
    if (!item) {
      return null;
    }

    return {
      ...item,
      titleArabic: item.title_arabic,
      descriptionArabic: item.description_arabic,
      posterUrl: item.poster_url,
      videoUrl: item.video_url,
      downloadUrl: item.download_url,
      trailerUrl: item.trailer_url,
      imdbId: item.imdb_id,
      tmdbId: item.tmdb_id,
      rottenTomatoesScore: item.rotten_tomatoes_score,
      metacriticScore: item.metacritic_score,
      boxOffice: item.box_office,
      isActive: item.is_active,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      categories: [],
      genres: []
    };
  }

  async searchContent(query: string, filters: any = {}) {
    const allContent = this.data.content || [];
    
    let filteredContent = allContent.filter((item: any) => {
      const titleMatch = item.title.toLowerCase().includes(query.toLowerCase()) ||
                        item.title_arabic.toLowerCase().includes(query.toLowerCase());
      const descMatch = item.description.toLowerCase().includes(query.toLowerCase()) ||
                       item.description_arabic.toLowerCase().includes(query.toLowerCase());
      return titleMatch || descMatch;
    });

    // Apply filters
    if (filters.type) {
      filteredContent = filteredContent.filter((item: any) => item.type === filters.type);
    }
    if (filters.language) {
      filteredContent = filteredContent.filter((item: any) => item.language === filters.language);
    }
    if (filters.year) {
      filteredContent = filteredContent.filter((item: any) => item.year === parseInt(filters.year));
    }

    // Transform content for API response
    const transformedContent = filteredContent.map((item: any) => ({
      ...item,
      titleArabic: item.title_arabic,
      descriptionArabic: item.description_arabic,
      posterUrl: item.poster_url,
      videoUrl: item.video_url,
      downloadUrl: item.download_url,
      trailerUrl: item.trailer_url,
      imdbId: item.imdb_id,
      tmdbId: item.tmdb_id,
      rottenTomatoesScore: item.rotten_tomatoes_score,
      metacriticScore: item.metacritic_score,
      boxOffice: item.box_office,
      isActive: item.is_active,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      categories: [],
      genres: []
    }));

    return {
      content: transformedContent,
      total: transformedContent.length,
      page: 1,
      limit: 100,
      totalPages: 1
    };
  }

  async getStats() {
    const allContent = this.data.content || [];
    const totalMovies = allContent.filter((item: any) => item.type === 'movie').length;
    const totalSeries = allContent.filter((item: any) => item.type === 'series').length;
    
    return {
      totalContent: allContent.length,
      totalMovies,
      totalSeries,
      totalUsers: this.data.users?.length || 0,
      totalCategories: this.data.categories?.length || 0,
      totalGenres: this.data.genres?.length || 0
    };
  }

  async getFeaturedContent() {
    const allContent = this.data.content || [];
    // Get highest rated content
    const featured = allContent
      .filter((item: any) => item.rating >= 8)
      .sort((a: any, b: any) => b.rating - a.rating)
      .slice(0, 10);

    return featured.map((item: any) => ({
      ...item,
      titleArabic: item.title_arabic,
      descriptionArabic: item.description_arabic,
      posterUrl: item.poster_url,
      videoUrl: item.video_url,
      downloadUrl: item.download_url,
      trailerUrl: item.trailer_url,
      imdbId: item.imdb_id,
      tmdbId: item.tmdb_id,
      rottenTomatoesScore: item.rotten_tomatoes_score,
      metacriticScore: item.metacritic_score,
      boxOffice: item.box_office,
      isActive: item.is_active,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      categories: [],
      genres: []
    }));
  }

  async getTrendingContent() {
    const allContent = this.data.content || [];
    // Get recent content with good ratings
    const trending = allContent
      .filter((item: any) => item.rating >= 7)
      .sort((a: any, b: any) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, 10);

    return trending.map((item: any) => ({
      ...item,
      titleArabic: item.title_arabic,
      descriptionArabic: item.description_arabic,
      posterUrl: item.poster_url,
      videoUrl: item.video_url,
      downloadUrl: item.download_url,
      trailerUrl: item.trailer_url,
      imdbId: item.imdb_id,
      tmdbId: item.tmdb_id,
      rottenTomatoesScore: item.rotten_tomatoes_score,
      metacriticScore: item.metacritic_score,
      boxOffice: item.box_office,
      isActive: item.is_active,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      categories: [],
      genres: []
    }));
  }

  async getContentEpisodes(contentId: number) {
    const episodes = this.data.episodes || [];
    return episodes.filter((ep: any) => ep.content_id === contentId);
  }

  async getDownloadLinks(contentId: number, episodeId: number | null = null) {
    const links = this.data.downloadLinks || [];
    return links.filter((link: any) => {
      if (episodeId) {
        return link.content_id === contentId && link.episode_id === episodeId;
      }
      return link.content_id === contentId;
    });
  }

  async getStreamingLinks(contentId: number, episodeId: number | null = null) {
    const links = this.data.streamingLinks || [];
    return links.filter((link: any) => {
      if (episodeId) {
        return link.content_id === contentId && link.episode_id === episodeId;
      }
      return link.content_id === contentId;
    });
  }
}

// Initialize database
const db = new SimpleDatabase();

export async function registerRoutes(app: Express): Promise<Server> {
  // Content stats route
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await db.getStats();
      res.json(stats);
    } catch (error) {
      console.error('Stats error:', error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // Categories route
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await db.getCategories();
      const transformed = categories.map((cat: any) => ({
        ...cat,
        nameArabic: cat.name_arabic,
        createdAt: cat.created_at,
        updatedAt: cat.updated_at
      }));
      res.json(transformed);
    } catch (error) {
      console.error('Categories error:', error);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  // Genres route
  app.get("/api/genres", async (req, res) => {
    try {
      const genres = await db.getGenres();
      const transformed = genres.map((genre: any) => ({
        ...genre,
        nameArabic: genre.name_arabic,
        createdAt: genre.created_at,
        updatedAt: genre.updated_at
      }));
      res.json(transformed);
    } catch (error) {
      console.error('Genres error:', error);
      res.status(500).json({ error: "Failed to fetch genres" });
    }
  });

  // Content by type route
  app.get("/api/content/:type", async (req, res) => {
    try {
      const { type } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 24;
      
      // Map API types to database types
      const typeMapping: { [key: string]: string } = {
        'movies': 'movie',
        'series': 'series',
        'television': 'television',
        'tv': 'television',
        'shows': 'shows',
        'programs': 'programs',
        'games': 'games',
        'applications': 'applications',
        'theater': 'theater',
        'wrestling': 'wrestling',
        'sports': 'sports',
        'misc': 'misc'
      };

      const dbType = typeMapping[type] || type;
      const result = await db.getContentByType(dbType, page, limit);
      res.json(result);
    } catch (error) {
      console.error('Content error:', error);
      res.status(500).json({ error: "Failed to fetch content" });
    }
  });

  // All content route
  app.get("/api/content", async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 24;
      const result = await db.getContentByType('all', page, limit);
      res.json(result);
    } catch (error) {
      console.error('Content error:', error);
      res.status(500).json({ error: "Failed to fetch content" });
    }
  });

  // Recent content route
  app.get("/api/content/recent", async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 24;
      const result = await db.getContentByType('all', page, limit);
      res.json(result);
    } catch (error) {
      console.error('Recent content error:', error);
      res.status(500).json({ error: "Failed to fetch recent content" });
    }
  });

  // Featured content route
  app.get("/api/content/featured", async (req, res) => {
    try {
      const content = await db.getFeaturedContent();
      res.json(content);
    } catch (error) {
      console.error('Featured content error:', error);
      res.status(500).json({ error: "Failed to fetch featured content" });
    }
  });

  // Trending content route
  app.get("/api/content/trending", async (req, res) => {
    try {
      const content = await db.getTrendingContent();
      res.json(content);
    } catch (error) {
      console.error('Trending content error:', error);
      res.status(500).json({ error: "Failed to fetch trending content" });
    }
  });

  // Search route
  app.get("/api/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      const filters = {
        type: req.query.type as string,
        language: req.query.language as string,
        year: req.query.year as string
      };
      
      if (!query) {
        return res.status(400).json({ error: "Search query is required" });
      }

      const result = await db.searchContent(query, filters);
      res.json(result);
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ error: "Failed to search content" });
    }
  });

  // Single content route
  app.get("/api/content/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const content = await db.getContentById(id);
      
      if (!content) {
        return res.status(404).json({ error: "Content not found" });
      }

      res.json(content);
    } catch (error) {
      console.error('Single content error:', error);
      res.status(500).json({ error: "Failed to fetch content" });
    }
  });

  // Episodes route
  app.get("/api/content/:id/episodes", async (req, res) => {
    try {
      const contentId = parseInt(req.params.id);
      const episodes = await db.getContentEpisodes(contentId);
      res.json(episodes);
    } catch (error) {
      console.error('Episodes error:', error);
      res.status(500).json({ error: "Failed to fetch episodes" });
    }
  });

  // Download links route
  app.get("/api/content/:id/download", async (req, res) => {
    try {
      const contentId = parseInt(req.params.id);
      const episodeId = req.query.episode ? parseInt(req.query.episode as string) : null;
      const links = await db.getDownloadLinks(contentId, episodeId);
      res.json(links);
    } catch (error) {
      console.error('Download links error:', error);
      res.status(500).json({ error: "Failed to fetch download links" });
    }
  });

  // Streaming links route
  app.get("/api/content/:id/stream", async (req, res) => {
    try {
      const contentId = parseInt(req.params.id);
      const episodeId = req.query.episode ? parseInt(req.query.episode as string) : null;
      const links = await db.getStreamingLinks(contentId, episodeId);
      res.json(links);
    } catch (error) {
      console.error('Streaming links error:', error);
      res.status(500).json({ error: "Failed to fetch streaming links" });
    }
  });

  // Placeholder image route
  app.get("/api/placeholder/:width/:height", (req, res) => {
    const { width, height } = req.params;
    const color = req.query.color || "cccccc";
    const textColor = req.query.text || "666666";
    
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#${color}"/>
        <text x="50%" y="50%" text-anchor="middle" dy="0.35em" font-family="Arial, sans-serif" font-size="16" fill="#${textColor}">
          ${width}x${height}
        </text>
      </svg>
    `;
    
    res.set('Content-Type', 'image/svg+xml');
    res.send(svg);
  });

  const server = createServer(app);
  return server;
}