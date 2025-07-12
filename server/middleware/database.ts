import { sql } from "drizzle-orm";
import { db } from "../db";

// Database optimization utilities
export class DatabaseOptimizer {
  // Create database indexes for better performance
  static async createIndexes() {
    try {
      console.log("Creating database indexes...");
      
      // Content table indexes
      await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_content_type ON content(type)`);
      await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_content_year ON content(year)`);
      await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_content_language ON content(language)`);
      await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_content_quality ON content(quality)`);
      await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_content_rating ON content(rating)`);
      await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_content_active ON content(is_active)`);
      await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_content_created_at ON content(created_at)`);
      
      // Content search index
      await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_content_search ON content USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '')))`);
      
      // User table indexes
      await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)`);
      await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);
      await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active)`);
      
      // Relationship table indexes
      await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_content_genres_content ON content_genres(content_id)`);
      await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_content_genres_genre ON content_genres(genre_id)`);
      await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_content_categories_content ON content_categories(content_id)`);
      await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_content_categories_category ON content_categories(category_id)`);
      
      // User interaction indexes
      await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_user_favorites_user ON user_favorites(user_id)`);
      await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_user_favorites_content ON user_favorites(content_id)`);
      await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_user_watch_history_user ON user_watch_history(user_id)`);
      await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_user_watch_history_content ON user_watch_history(content_id)`);
      
      // Comments and reviews indexes
      await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_user_comments_content ON user_comments(content_id)`);
      await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_user_comments_user ON user_comments(user_id)`);
      await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_user_reviews_content ON user_reviews(content_id)`);
      await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_user_reviews_user ON user_reviews(user_id)`);
      
      console.log("✅ Database indexes created successfully");
    } catch (error) {
      console.error("❌ Error creating database indexes:", error);
    }
  }
  
  // Analyze database performance
  static async analyzePerformance() {
    try {
      console.log("Analyzing database performance...");
      
      // Get table sizes
      const tableSizes = await db.execute(sql`
        SELECT 
          schemaname,
          tablename,
          pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
          pg_total_relation_size(schemaname||'.'||tablename) as size_bytes
        FROM pg_tables 
        WHERE schemaname NOT IN ('information_schema', 'pg_catalog')
        ORDER BY size_bytes DESC
      `);
      
      console.log("📊 Database table sizes:");
      if (Array.isArray(tableSizes)) {
        tableSizes.forEach((row: any) => {
          console.log(`  ${row.tablename}: ${row.size}`);
        });
      } else {
        console.log("  No table size data available");
      }
      
      // Get slow queries (if available)
      const slowQueries = await db.execute(sql`
        SELECT 
          query,
          calls,
          total_time,
          mean_time,
          rows
        FROM pg_stat_statements 
        WHERE mean_time > 100
        ORDER BY mean_time DESC
        LIMIT 10
      `).catch(() => {
        console.log("  pg_stat_statements not available");
        return [];
      });
      
      if (slowQueries.length > 0) {
        console.log("🐌 Slow queries detected:");
        slowQueries.forEach((row: any) => {
          console.log(`  Query: ${row.query.substring(0, 50)}... - Average: ${row.mean_time}ms`);
        });
      }
      
    } catch (error) {
      console.error("❌ Error analyzing database performance:", error);
    }
  }
  
  // Optimize database settings
  static async optimizeSettings() {
    try {
      console.log("Optimizing database settings...");
      
      // Set connection pool settings
      await db.execute(sql`SET statement_timeout = '30s'`);
      await db.execute(sql`SET lock_timeout = '10s'`);
      await db.execute(sql`SET idle_in_transaction_session_timeout = '60s'`);
      
      console.log("✅ Database settings optimized");
    } catch (error) {
      console.error("❌ Error optimizing database settings:", error);
    }
  }
  
  // Database health check
  static async healthCheck() {
    try {
      const start = Date.now();
      await db.execute(sql`SELECT 1`);
      const duration = Date.now() - start;
      
      console.log(`💚 Database health check: ${duration}ms`);
      
      if (duration > 1000) {
        console.warn(`⚠️  Database connection is slow: ${duration}ms`);
      }
      
      return { healthy: true, responseTime: duration };
    } catch (error) {
      console.error("❌ Database health check failed:", error);
      return { healthy: false, error };
    }
  }
}

// Initialize database optimizations
export async function initializeDatabaseOptimizations() {
  await DatabaseOptimizer.createIndexes();
  await DatabaseOptimizer.optimizeSettings();
  await DatabaseOptimizer.analyzePerformance();
  
  // Schedule periodic health checks
  setInterval(async () => {
    await DatabaseOptimizer.healthCheck();
  }, 5 * 60 * 1000); // Every 5 minutes
}