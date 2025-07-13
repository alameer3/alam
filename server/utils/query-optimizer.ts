import { performance } from 'perf_hooks';

export class QueryOptimizer {
  private static queryCache = new Map<string, { result: any, timestamp: number, ttl: number }>();
  private static readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  static async withCache<T>(
    key: string,
    queryFn: () => Promise<T>,
    ttl: number = this.DEFAULT_TTL
  ): Promise<T> {
    const cached = this.queryCache.get(key);
    
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      console.log(`💾 Cache hit: ${key}`);
      return cached.result;
    }

    const startTime = performance.now();
    const result = await queryFn();
    const endTime = performance.now();

    this.queryCache.set(key, {
      result,
      timestamp: Date.now(),
      ttl
    });

    console.log(`🗃️ Cache miss: ${key} (${(endTime - startTime).toFixed(2)}ms)`);
    return result;
  }

  static clearCache(pattern?: string): void {
    if (pattern) {
      const regex = new RegExp(pattern);
      for (const [key] of this.queryCache) {
        if (regex.test(key)) {
          this.queryCache.delete(key);
        }
      }
    } else {
      this.queryCache.clear();
    }
  }

  static getCacheStats(): { size: number, keys: string[] } {
    return {
      size: this.queryCache.size,
      keys: Array.from(this.queryCache.keys())
    };
  }

  static async measureQuery<T>(
    name: string,
    queryFn: () => Promise<T>
  ): Promise<T> {
    const startTime = performance.now();
    const result = await queryFn();
    const endTime = performance.now();
    
    const duration = endTime - startTime;
    
    if (duration > 100) {
      console.warn(`⚠️ Slow query: ${name} - ${duration.toFixed(2)}ms`);
    } else {
      console.log(`⚡ Query: ${name} - ${duration.toFixed(2)}ms`);
    }
    
    return result;
  }
}

export default QueryOptimizer;