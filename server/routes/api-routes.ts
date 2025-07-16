import { Router } from 'express';
import { contentService } from '../services/content-service.js';
import { adminService } from '../services/admin-service.js';
import { dbManager } from '../database/database-manager.js';
import type { SearchFilters } from '../../shared/types.js';

const router = Router();

// مسارات المحتوى العامة
router.get('/content', async (req, res) => {
  try {
    const filters: SearchFilters = {
      query: req.query.q as string,
      type: req.query.type as string,
      category: req.query.category as string,
      genre: req.query.genre as string,
      year: req.query.year as string,
      rating: req.query.rating as string,
      quality: req.query.quality as string,
      language: req.query.language as string,
      country: req.query.country as string,
      status: req.query.status as string,
      sortBy: req.query.sortBy as string,
      sortOrder: req.query.sortOrder as 'asc' | 'desc',
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 24
    };

    const result = await contentService.getContent(filters);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: 'خطأ في الخادم' });
  }
});

// مسارات المحتوى حسب النوع - يجب أن تكون قبل :id لتجنب التضارب
router.get('/content/movies', async (req, res) => {
  try {
    const filters: SearchFilters = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 24,
      sortBy: req.query.sortBy as string,
      sortOrder: req.query.sortOrder as 'asc' | 'desc'
    };
    
    const result = await contentService.getMovies(filters);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: 'خطأ في الخادم' });
  }
});

router.get('/content/series', async (req, res) => {
  try {
    const filters: SearchFilters = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 24,
      sortBy: req.query.sortBy as string,
      sortOrder: req.query.sortOrder as 'asc' | 'desc'
    };
    
    const result = await contentService.getSeries(filters);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: 'خطأ في الخادم' });
  }
});

router.get('/content/programs', async (req, res) => {
  try {
    const filters: SearchFilters = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 24
    };
    
    const result = await contentService.getPrograms(filters);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: 'خطأ في الخادم' });
  }
});

router.get('/content/games', async (req, res) => {
  try {
    const filters: SearchFilters = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 24
    };
    
    const result = await contentService.getGames(filters);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: 'خطأ في الخادم' });
  }
});

router.get('/content/applications', async (req, res) => {
  try {
    const filters: SearchFilters = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 24
    };
    
    const result = await contentService.getApplications(filters);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: 'خطأ في الخادم' });
  }
});

router.get('/content/theater', async (req, res) => {
  try {
    const filters: SearchFilters = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 24
    };
    
    const result = await contentService.getTheater(filters);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: 'خطأ في الخادم' });
  }
});

router.get('/content/wrestling', async (req, res) => {
  try {
    const filters: SearchFilters = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 24
    };
    
    const result = await contentService.getWrestling(filters);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: 'خطأ في الخادم' });
  }
});

router.get('/content/sports', async (req, res) => {
  try {
    const filters: SearchFilters = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 24
    };
    
    const result = await contentService.getSports(filters);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: 'خطأ في الخادم' });
  }
});

// مسارات المحتوى المميز والأحدث - يجب أن تكون قبل :id
router.get('/content/featured', async (req, res) => {
  try {
    const result = await contentService.getFeaturedContent();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: 'خطأ في الخادم' });
  }
});

router.get('/content/trending', async (req, res) => {
  try {
    const result = await contentService.getTrendingContent();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: 'خطأ في الخادم' });
  }
});

router.get('/content/recent', async (req, res) => {
  try {
    const filters: SearchFilters = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 24,
      type: req.query.type as string,
      category: req.query.category as string,
      genre: req.query.genre as string
    };
    
    const result = await contentService.getRecentContent(filters);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: 'خطأ في الخادم' });
  }
});

// مسار المحتوى حسب الـ ID - يجب أن يكون آخر مسار
router.get('/content/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await contentService.getContentById(id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: 'خطأ في الخادم' });
  }
});

// مسار البحث
router.get('/search', async (req, res) => {
  try {
    const query = req.query.q as string;
    const filters: SearchFilters = {
      type: req.query.type as string,
      category: req.query.category as string,
      genre: req.query.genre as string,
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 24
    };
    
    const result = await contentService.searchContent(query, filters);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: 'خطأ في الخادم' });
  }
});

// مسارات الفئات والأنواع
router.get('/categories', async (req, res) => {
  try {
    const categories = await dbManager.getSiteSettings();
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, error: 'خطأ في الخادم' });
  }
});

router.get('/genres', async (req, res) => {
  try {
    const genres = await dbManager.getSiteSettings();
    res.json({ success: true, data: genres });
  } catch (error) {
    res.status(500).json({ success: false, error: 'خطأ في الخادم' });
  }
});

// مسارات الإحصائيات
router.get('/stats', async (req, res) => {
  try {
    const stats = await dbManager.getDashboardStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: 'خطأ في الخادم' });
  }
});

// مسارات الإدارة (تتطلب تسجيل الدخول)
router.get('/admin/dashboard', async (req, res) => {
  try {
    const result = await adminService.getDashboardStats();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: 'خطأ في الخادم' });
  }
});

router.get('/admin/settings', async (req, res) => {
  try {
    const result = await adminService.getSiteSettings();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: 'خطأ في الخادم' });
  }
});

router.put('/admin/settings', async (req, res) => {
  try {
    const settings = req.body.settings;
    const result = await adminService.updateSiteSettings(settings);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: 'خطأ في الخادم' });
  }
});

router.get('/admin/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 24;
    const result = await adminService.getUsers(page, limit);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: 'خطأ في الخادم' });
  }
});

router.post('/admin/content', async (req, res) => {
  try {
    const contentData = req.body;
    const result = await adminService.createContent(contentData);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: 'خطأ في الخادم' });
  }
});

router.put('/admin/content/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const contentData = req.body;
    const result = await adminService.updateContent(id, contentData);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: 'خطأ في الخادم' });
  }
});

router.delete('/admin/content/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await adminService.deleteContent(id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: 'خطأ في الخادم' });
  }
});

// مسارات النظام
router.get('/system/health', async (req, res) => {
  try {
    const result = await adminService.getSystemHealth();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: 'خطأ في الخادم' });
  }
});

router.post('/system/backup', async (req, res) => {
  try {
    const result = await adminService.backupDatabase();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: 'خطأ في الخادم' });
  }
});

// مسار تحديث عدد المشاهدات
router.post('/content/:id/view', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await contentService.incrementViewCount(id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: 'خطأ في الخادم' });
  }
});

// مسارات التوافق مع النظام القديم
router.get('/placeholder/:width/:height', (req, res) => {
  const { width, height } = req.params;
  
  // إنشاء SVG بسيط
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f0f0f0"/>
      <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-family="Arial" font-size="16" fill="#999">
        ${width}x${height}
      </text>
    </svg>
  `;
  
  res.set('Content-Type', 'image/svg+xml');
  res.send(svg);
});

export default router;