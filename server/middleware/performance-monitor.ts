import { Request, Response, NextFunction } from 'express';
import { performance } from 'perf_hooks';

interface PerformanceMetrics {
  startTime: number;
  endTime: number;
  duration: number;
  memoryUsage: NodeJS.MemoryUsage;
  url: string;
  method: string;
  statusCode: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private readonly MAX_METRICS = 1000;

  middleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      const startTime = performance.now();
      const startMemory = process.memoryUsage();

      // Capture metrics on response finish
      res.on('finish', () => {
        const endTime = performance.now();
        const endMemory = process.memoryUsage();
        
        const metric: PerformanceMetrics = {
          startTime,
          endTime,
          duration: endTime - startTime,
          memoryUsage: endMemory,
          url: req.originalUrl,
          method: req.method,
          statusCode: res.statusCode
        };

        // Store metric
        if (this.metrics.length >= this.MAX_METRICS) {
          this.metrics.shift(); // Remove oldest metric
        }
        this.metrics.push(metric);

        // Log slow requests
        if (metric.duration > 1000) {
          console.warn(`⚠️ Slow request: ${metric.method} ${metric.url} - ${metric.duration.toFixed(2)}ms`);
        }
      });

      next();
    };
  }

  getMetrics(): PerformanceMetrics[] {
    return this.metrics;
  }

  getAverageResponseTime(): number {
    if (this.metrics.length === 0) return 0;
    const total = this.metrics.reduce((sum, metric) => sum + metric.duration, 0);
    return total / this.metrics.length;
  }

  getSlowRequests(threshold: number = 1000): PerformanceMetrics[] {
    return this.metrics.filter(metric => metric.duration > threshold);
  }

  clearMetrics(): void {
    this.metrics = [];
  }
}

export const performanceMonitor = new PerformanceMonitor();
export default performanceMonitor;