import { Router } from 'express';
import { DatabaseOptimizer } from '../middleware/database';
import { BackupManager } from '../middleware/backup';

const router = Router();

// Performance monitoring dashboard
router.get('/dashboard', async (req, res) => {
  try {
    // Get system performance metrics
    const memoryUsage = process.memoryUsage();
    const uptime = process.uptime();
    
    // Get database health
    const dbHealth = await DatabaseOptimizer.healthCheck();
    
    // Get backup status
    const backupStatus = await BackupManager.getBackupStatus();
    
    const performanceData = {
      system: {
        uptime: Math.floor(uptime),
        memory: {
          rss: Math.round(memoryUsage.rss / 1024 / 1024), // MB
          heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024), // MB
          heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
          external: Math.round(memoryUsage.external / 1024 / 1024), // MB
        },
        nodeVersion: process.version,
        platform: process.platform
      },
      database: {
        healthy: dbHealth.healthy,
        responseTime: dbHealth.responseTime,
        error: dbHealth.error
      },
      backup: backupStatus,
      timestamp: new Date().toISOString()
    };
    
    res.json(performanceData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch performance data' });
  }
});

// Database performance analysis
router.get('/database/analyze', async (req, res) => {
  try {
    await DatabaseOptimizer.analyzePerformance();
    res.json({ message: 'Database analysis completed - check server logs' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to analyze database performance' });
  }
});

// Create manual backup
router.post('/backup/create', async (req, res) => {
  try {
    const dbBackup = await BackupManager.createDatabaseBackup();
    const configBackup = await BackupManager.createConfigBackup();
    
    res.json({
      message: 'Backup created successfully',
      files: {
        database: dbBackup,
        config: configBackup
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create backup' });
  }
});

// Health check endpoint
router.get('/health', async (req, res) => {
  try {
    const dbHealth = await DatabaseOptimizer.healthCheck();
    const memoryUsage = process.memoryUsage();
    
    const health = {
      status: 'healthy',
      database: dbHealth.healthy,
      memory: {
        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
        usage: Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100)
      },
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString()
    };
    
    // Set status based on health checks
    if (!dbHealth.healthy || health.memory.usage > 90) {
      health.status = 'unhealthy';
      res.status(503);
    } else if (dbHealth.responseTime > 1000 || health.memory.usage > 70) {
      health.status = 'degraded';
    }
    
    res.json(health);
  } catch (error) {
    res.status(500).json({ 
      status: 'unhealthy',
      error: error.message 
    });
  }
});

export default router;