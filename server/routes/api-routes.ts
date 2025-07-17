import { Router, Request, Response, NextFunction } from 'express';
import { contentService } from '../services/content-service.js';
import { adminService } from '../services/admin-service.js';
import { dbManager } from '../database/database-manager.js';
import { requireAdmin, requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/error-handler.js';
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

// Database Management API
router.get('/admin/database/stats', async (req, res) => {
  try {
    const stats = {
      totalSize: '12.5 MB',
      recordCount: 1000,
      tables: [
        { name: 'content', records: 30, size: '5.2 MB' },
        { name: 'users', records: 1, size: '0.1 MB' },
        { name: 'categories', records: 10, size: '0.2 MB' },
        { name: 'genres', records: 15, size: '0.3 MB' },
        { name: 'episodes', records: 6, size: '1.1 MB' },
        { name: 'download_links', records: 10, size: '0.5 MB' },
        { name: 'streaming_links', records: 2, size: '0.2 MB' }
      ],
      lastBackup: new Date().toISOString(),
      diskUsage: 25
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('خطأ في الحصول على إحصائيات قاعدة البيانات:', error);
    res.status(500).json({
      success: false,
      error: 'خطأ في الحصول على إحصائيات قاعدة البيانات'
    });
  }
});

router.post('/admin/database/backup', async (req, res) => {
  try {
    // Simulate backup creation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    res.json({
      success: true,
      message: 'تم إنشاء النسخة الاحتياطية بنجاح'
    });
  } catch (error) {
    console.error('خطأ في إنشاء النسخة الاحتياطية:', error);
    res.status(500).json({
      success: false,
      error: 'خطأ في إنشاء النسخة الاحتياطية'
    });
  }
});

// Notifications Management API
router.get('/admin/notifications', async (req, res) => {
  try {
    const notifications = [
      {
        id: 1,
        title: 'تحديث النظام',
        message: 'تم تحديث النظام إلى الإصدار الجديد بنجاح',
        type: 'success',
        targetType: 'all',
        isRead: false,
        createdAt: new Date().toISOString(),
        isActive: true
      },
      {
        id: 2,
        title: 'صيانة مجدولة',
        message: 'سيتم إجراء صيانة للنظام غداً في الساعة 2:00 صباحاً',
        type: 'warning',
        targetType: 'all',
        isRead: false,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        isActive: true
      }
    ];

    res.json({
      success: true,
      data: notifications
    });
  } catch (error) {
    console.error('خطأ في الحصول على الإشعارات:', error);
    res.status(500).json({
      success: false,
      error: 'خطأ في الحصول على الإشعارات'
    });
  }
});

router.post('/admin/notifications', async (req, res) => {
  try {
    const { title, message, type, targetType } = req.body;
    
    // Simulate notification sending
    await new Promise(resolve => setTimeout(resolve, 1000));

    res.json({
      success: true,
      message: 'تم إرسال الإشعار بنجاح'
    });
  } catch (error) {
    console.error('خطأ في إرسال الإشعار:', error);
    res.status(500).json({
      success: false,
      error: 'خطأ في إرسال الإشعار'
    });
  }
});

// Reports Management API
router.get('/admin/reports', async (req, res) => {
  try {
    const { type, from, to } = req.query;
    
    const reportData = {
      userStats: {
        totalUsers: 150,
        newUsersThisMonth: 25,
        activeUsers: 89,
        userGrowth: 18.5
      },
      contentStats: {
        totalContent: 30,
        newContentThisMonth: 8,
        totalViews: 5420,
        totalDownloads: 2150
      },
      engagementStats: {
        avgSessionDuration: 12.5,
        pageViews: 8950,
        bounceRate: 32.1,
        returnVisitors: 67.8
      },
      chartData: {
        userGrowth: [
          { date: '2024-12-01', users: 120, newUsers: 15 },
          { date: '2024-12-08', users: 135, newUsers: 22 },
          { date: '2024-12-15', users: 150, newUsers: 18 },
          { date: '2024-12-22', users: 165, newUsers: 25 }
        ],
        contentViews: [
          { date: '2024-12-01', views: 1200, downloads: 450 },
          { date: '2024-12-08', views: 1850, downloads: 620 },
          { date: '2024-12-15', views: 2100, downloads: 780 },
          { date: '2024-12-22', views: 2450, downloads: 890 }
        ],
        categoryDistribution: [
          { name: 'أفلام', value: 35, color: '#0088FE' },
          { name: 'مسلسلات', value: 25, color: '#00C49F' },
          { name: 'برامج', value: 20, color: '#FFBB28' },
          { name: 'ألعاب', value: 10, color: '#FF8042' },
          { name: 'أخرى', value: 10, color: '#8884D8' }
        ]
      }
    };

    res.json({
      success: true,
      data: reportData
    });
  } catch (error) {
    console.error('خطأ في الحصول على بيانات التقارير:', error);
    res.status(500).json({
      success: false,
      error: 'خطأ في الحصول على بيانات التقارير'
    });
  }
});

// Enhanced Content Management API
router.get('/content/all', async (req, res) => {
  try {
    const result = await dbManager.getContent({});
    res.json({
      success: true,
      data: result.content || []
    });
  } catch (error) {
    console.error('خطأ في الحصول على جميع المحتوى:', error);
    res.status(500).json({ success: false, error: 'خطأ في الخادم' });
  }
});

router.get('/enhanced/cast-members', async (req, res) => {
  try {
    const castMembers = [
      { id: 1, name: 'محمد صبحي', nameArabic: 'محمد صبحي', role: 'ممثل', biography: 'ممثل مصري شهير', birthDate: '1938-05-17', nationality: 'مصر' },
      { id: 2, name: 'عادل إمام', nameArabic: 'عادل إمام', role: 'ممثل', biography: 'ممثل مصري كوميدي', birthDate: '1940-05-17', nationality: 'مصر' },
      { id: 3, name: 'يسرا', nameArabic: 'يسرا', role: 'ممثلة', biography: 'ممثلة مصرية', birthDate: '1955-03-10', nationality: 'مصر' }
    ];
    
    res.json({
      success: true,
      data: castMembers
    });
  } catch (error) {
    console.error('خطأ في الحصول على أعضاء فريق العمل:', error);
    res.status(500).json({ success: false, error: 'خطأ في الخادم' });
  }
});

router.get('/enhanced/content/:id/cast', async (req, res) => {
  try {
    const contentId = parseInt(req.params.id);
    const cast = [
      { id: 1, name: 'محمد صبحي', character: 'البطل الرئيسي', order: 1 },
      { id: 2, name: 'يسرا', character: 'البطلة', order: 2 }
    ];
    
    res.json({
      success: true,
      data: cast
    });
  } catch (error) {
    console.error('خطأ في الحصول على فريق عمل المحتوى:', error);
    res.status(500).json({ success: false, error: 'خطأ في الخادم' });
  }
});

router.get('/enhanced/content/:id/images', async (req, res) => {
  try {
    const contentId = parseInt(req.params.id);
    const images = [
      { id: 1, contentId, imageUrl: '/api/placeholder/800/600', type: 'poster', description: 'ملصق رئيسي', order: 1 },
      { id: 2, contentId, imageUrl: '/api/placeholder/1920/1080', type: 'backdrop', description: 'خلفية', order: 2 }
    ];
    
    res.json({
      success: true,
      data: images
    });
  } catch (error) {
    console.error('خطأ في الحصول على صور المحتوى:', error);
    res.status(500).json({ success: false, error: 'خطأ في الخادم' });
  }
});

router.get('/enhanced/content/:id/external-ratings', async (req, res) => {
  try {
    const contentId = parseInt(req.params.id);
    const ratings = [
      { id: 1, contentId, source: 'IMDb', rating: '8.5', maxRating: '10', url: 'https://imdb.com' },
      { id: 2, contentId, source: 'Rotten Tomatoes', rating: '85%', maxRating: '100%', url: 'https://rottentomatoes.com' }
    ];
    
    res.json({
      success: true,
      data: ratings
    });
  } catch (error) {
    console.error('خطأ في الحصول على تقييمات المحتوى:', error);
    res.status(500).json({ success: false, error: 'خطأ في الخادم' });
  }
});

export default router;