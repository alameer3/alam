import type { Request, Response, NextFunction } from "express";

// In-memory cache for development
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  keyGenerator?: (req: Request) => string;
}

export function cacheMiddleware(options: CacheOptions = {}) {
  const defaultTTL = options.ttl || 300; // 5 minutes default
  
  return (req: Request, res: Response, next: NextFunction) => {
    const key = options.keyGenerator ? options.keyGenerator(req) : `${req.method}:${req.url}`;
    
    // Check cache
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.ttl * 1000) {
      console.log(`Cache hit for: ${key}`);
      return res.json(cached.data);
    }
    
    // Override res.json to cache the response
    const originalJson = res.json;
    res.json = function(data: any) {
      // Cache successful responses
      if (res.statusCode >= 200 && res.statusCode < 300) {
        cache.set(key, {
          data,
          timestamp: Date.now(),
          ttl: defaultTTL
        });
        console.log(`Cached response for: ${key}`);
      }
      return originalJson.call(this, data);
    };
    
    next();
  };
}

// Clear cache by pattern
export function clearCache(pattern?: string) {
  if (pattern) {
    for (const key of cache.keys()) {
      if (key.includes(pattern)) {
        cache.delete(key);
      }
    }
  } else {
    cache.clear();
  }
}

// Clean expired cache entries
export function cleanExpiredCache() {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > value.ttl * 1000) {
      cache.delete(key);
    }
  }
}

// Schedule cache cleanup every 10 minutes
setInterval(cleanExpiredCache, 10 * 60 * 1000);