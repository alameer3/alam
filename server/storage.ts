import { 
  users, content, genres, categories, contentGenres, contentCategories, userRatings,
  type User, type InsertUser, type Content, type InsertContent, 
  type Genre, type InsertGenre, type Category, type InsertCategory
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, ilike, sql } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
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
  
  // Stats
  getContentStats(): Promise<{ movies: number, series: number, tv: number, misc: number }>;
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

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getContent(id: number): Promise<Content | undefined> {
    const [foundContent] = await db.select().from(content).where(eq(content.id, id));
    return foundContent || undefined;
  }

  async getContentByType(type: string, page: number = 1, limit: number = 20, filters?: any): Promise<{ content: Content[], total: number }> {
    const baseCondition = and(
      eq(content.type, type),
      eq(content.isActive, true)
    );

    // Build conditions array
    const conditions = [baseCondition];
    
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

    const finalCondition = conditions.length > 1 ? and(...conditions) : conditions[0];
    
    const offset = (page - 1) * limit;
    const contentItems = await db.select().from(content)
      .where(finalCondition)
      .orderBy(desc(content.createdAt))
      .limit(limit)
      .offset(offset);

    const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(content)
      .where(finalCondition);

    return {
      content: contentItems,
      total: count
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
    const stats = await db.select({
      type: content.type,
      count: sql<number>`count(*)`
    }).from(content)
      .where(eq(content.isActive, true))
      .groupBy(content.type);

    const result = { movies: 0, series: 0, tv: 0, misc: 0 };
    stats.forEach(stat => {
      if (stat.type === 'movie') result.movies = stat.count;
      else if (stat.type === 'series') result.series = stat.count;
      else if (stat.type === 'tv') result.tv = stat.count;
      else if (stat.type === 'misc') result.misc = stat.count;
    });

    return result;
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

  async createUser(user: InsertUser): Promise<User> {
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
}

// Database connection is now working - using real database
export const storage = new DatabaseStorage();

// For testing purposes, you can switch back to temporary storage:
// export const storage = new TemporaryMemoryStorage();
