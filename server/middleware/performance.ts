import type { Request, Response, NextFunction } from "express";

// Performance monitoring middleware
export function performanceMiddleware(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  
  // Log request start
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Started`);
  
  // Override res.end to measure response time
  const originalEnd = res.end;
  res.end = function(chunk?: any, encoding?: any) {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
    
    // Log slow queries (>1000ms)
    if (duration > 1000) {
      console.warn(`🐌 Slow request detected: ${req.method} ${req.url} took ${duration}ms`);
    }
    
    return originalEnd.call(this, chunk, encoding);
  };
  
  next();
}

// Database query optimization utilities
export class QueryOptimizer {
  private static queryCache = new Map<string, any>();
  
  static async optimizeQuery<T>(
    queryKey: string,
    queryFn: () => Promise<T>,
    ttl: number = 300
  ): Promise<T> {
    const cached = this.queryCache.get(queryKey);
    
    if (cached && Date.now() - cached.timestamp < ttl * 1000) {
      console.log(`Query cache hit: ${queryKey}`);
      return cached.data;
    }
    
    const start = Date.now();
    const result = await queryFn();
    const duration = Date.now() - start;
    
    // Log slow database queries
    if (duration > 500) {
      console.warn(`🐌 Slow database query: ${queryKey} took ${duration}ms`);
    }
    
    // Cache the result
    this.queryCache.set(queryKey, {
      data: result,
      timestamp: Date.now()
    });
    
    console.log(`Query executed: ${queryKey} - ${duration}ms`);
    return result;
  }
  
  static clearQueryCache(pattern?: string) {
    if (pattern) {
      for (const key of this.queryCache.keys()) {
        if (key.includes(pattern)) {
          this.queryCache.delete(key);
        }
      }
    } else {
      this.queryCache.clear();
    }
  }
}

// Memory usage monitoring
export function memoryMonitor() {
  const usage = process.memoryUsage();
  console.log(`Memory Usage: RSS=${Math.round(usage.rss / 1024 / 1024)}MB, Heap=${Math.round(usage.heapUsed / 1024 / 1024)}MB`);
  
  // Warn if memory usage is high
  if (usage.heapUsed > 500 * 1024 * 1024) { // 500MB
    console.warn(`⚠️  High memory usage detected: ${Math.round(usage.heapUsed / 1024 / 1024)}MB`);
  }
}

// Schedule memory monitoring every 5 minutes
setInterval(memoryMonitor, 5 * 60 * 1000);