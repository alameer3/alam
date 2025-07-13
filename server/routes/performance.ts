import { Router } from 'express';
import { performanceMonitor } from '../middleware/performance-monitor';
import { QueryOptimizer } from '../utils/query-optimizer';

const router = Router();

// Performance dashboard endpoint
router.get('/dashboard', (req, res) => {
  try {
    const metrics = performanceMonitor.getMetrics();
    const avgResponseTime = performanceMonitor.getAverageResponseTime();
    const slowRequests = performanceMonitor.getSlowRequests();
    const cacheStats = QueryOptimizer.getCacheStats();
    
    res.json({
      success: true,
      data: {
        metrics: metrics.slice(-100), // Last 100 requests
        avgResponseTime: Math.round(avgResponseTime * 100) / 100,
        slowRequests: slowRequests.length,
        cacheHitRate: cacheStats.size > 0 ? (cacheStats.size / metrics.length * 100).toFixed(1) : 0,
        memoryUsage: process.memoryUsage(),
        uptime: process.uptime()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب بيانات الأداء',
      error: error.message
    });
  }
});

// Clear performance metrics
router.post('/clear-metrics', (req, res) => {
  try {
    performanceMonitor.clearMetrics();
    QueryOptimizer.clearCache();
    
    res.json({
      success: true,
      message: 'تم مسح بيانات الأداء بنجاح'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في مسح بيانات الأداء',
      error: error.message
    });
  }
});

// Get slow requests
router.get('/slow-requests', (req, res) => {
  try {
    const threshold = parseInt(req.query.threshold as string) || 1000;
    const slowRequests = performanceMonitor.getSlowRequests(threshold);
    
    res.json({
      success: true,
      data: slowRequests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب الطلبات البطيئة',
      error: error.message
    });
  }
});

// Cache statistics
router.get('/cache-stats', (req, res) => {
  try {
    const stats = QueryOptimizer.getCacheStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب إحصائيات الكاش',
      error: error.message
    });
  }
});

export default router;