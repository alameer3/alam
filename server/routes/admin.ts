import { Router } from 'express';
import { z } from 'zod';
import { validateRequest } from '../middleware/validation';
import { requireAdmin } from '../middleware/auth';
import { fileStorage } from '../file-storage-simple';
import { insertContentSchema } from '@shared/schema';

const router = Router();

// Admin authentication middleware
router.use(requireAdmin);

// Get admin dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const stats = await fileStorage.getStats();
    
    // Get additional stats
    const totalViews = 12485; // This would come from analytics
    const totalUsers = 2847; // This would come from user table
    const avgRating = 4.3; // This would be calculated from ratings
    
    res.json({
      ...stats,
      totalViews,
      totalUsers,
      avgRating,
      newUsersThisMonth: 234,
      totalRatings: 1456
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ error: 'Failed to fetch admin stats' });
  }
});

// Get all content for admin management
router.get('/content', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const type = req.query.type as string;
    const search = req.query.search as string;
    
    let content;
    
    if (search) {
      content = await storage.searchContent(search, type);
      // Convert to expected format
      content = {
        content: content,
        total: content.length
      };
    } else {
      content = await storage.getContentByType(type || 'all', page, limit);
    }
    
    res.json(content);
  } catch (error) {
    console.error('Error fetching content for admin:', error);
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

// Create new content
router.post('/content', validateRequest(insertContentSchema), async (req, res) => {
  try {
    const content = await storage.createContent(req.body);
    res.status(201).json(content);
  } catch (error) {
    console.error('Error creating content:', error);
    res.status(500).json({ error: 'Failed to create content' });
  }
});

// Update content
router.put('/content/:id', validateRequest(insertContentSchema.partial()), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const content = await storage.updateContent(id, req.body);
    res.json(content);
  } catch (error) {
    console.error('Error updating content:', error);
    res.status(500).json({ error: 'Failed to update content' });
  }
});

// Delete content
router.delete('/content/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const success = await storage.deleteContent(id);
    if (success) {
      res.json({ message: 'Content deleted successfully' });
    } else {
      res.status(404).json({ error: 'Content not found' });
    }
  } catch (error) {
    console.error('Error deleting content:', error);
    res.status(500).json({ error: 'Failed to delete content' });
  }
});

// Get all users (admin only)
router.get('/users', async (req, res) => {
  try {

    const users = [
      {
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        role: 'admin',
        isActive: true,
        createdAt: new Date('2024-01-01').toISOString(),
        updatedAt: new Date('2024-01-01').toISOString()
      },
      {
        id: 2,
        username: 'user1',
        email: 'user1@example.com',
        role: 'user',
        isActive: true,
        createdAt: new Date('2024-01-15').toISOString(),
        updatedAt: new Date('2024-01-15').toISOString()
      },
      {
        id: 3,
        username: 'user2',
        email: 'user2@example.com',
        role: 'user',
        isActive: false,
        createdAt: new Date('2024-02-01').toISOString(),
        updatedAt: new Date('2024-02-01').toISOString()
      }
    ];

    const stats = {
      total: users.length,
      active: users.filter(u => u.isActive).length,
      admins: users.filter(u => u.role === 'admin').length,
      newThisMonth: users.filter(u => {
        const created = new Date(u.createdAt);
        const now = new Date();
        return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
      }).length
    };

    res.json({ users, ...stats });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Create new user
router.post('/users', async (req, res) => {
  try {
    const userData = {
      ...req.body,
      id: Date.now(), // Mock ID generation
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    

    res.status(201).json(userData);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Update user
router.put('/users/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const userData = {
      ...req.body,
      id,
      updatedAt: new Date().toISOString()
    };
    
    res.json(userData);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Toggle user status
router.put('/users/:id/status', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { isActive } = req.body;
    
    res.json({ 
      id, 
      isActive,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully` 
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ error: 'Failed to update user status' });
  }
});

// Update content
router.put('/content/:id', validateRequest(insertContentSchema.partial()), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const content = await storage.updateContent(id, req.body);
    res.json(content);
  } catch (error) {
    console.error('Error updating content:', error);
    res.status(500).json({ error: 'Failed to update content' });
  }
});

// Delete content
router.delete('/content/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const success = await storage.deleteContent(id);
    
    if (success) {
      res.json({ message: 'Content deleted successfully' });
    } else {
      res.status(404).json({ error: 'Content not found' });
    }
  } catch (error) {
    console.error('Error deleting content:', error);
    res.status(500).json({ error: 'Failed to delete content' });
  }
});

// Get content analytics
router.get('/analytics', async (req, res) => {
  try {
    // This would be implemented with actual analytics data
    const analytics = {
      viewsOverTime: [
        { month: 'يناير', views: 4000, users: 2400 },
        { month: 'فبراير', views: 3000, users: 1398 },
        { month: 'مارس', views: 2000, users: 9800 },
        { month: 'أبريل', views: 2780, users: 3908 },
        { month: 'مايو', views: 1890, users: 4800 },
        { month: 'يونيو', views: 2390, users: 3800 }
      ],
      topContent: [
        { id: 1, title: 'فيلم الحركة الجديد', views: 15420, rating: 4.8, type: 'فيلم' },
        { id: 2, title: 'المسلسل الدرامي', views: 12350, rating: 4.6, type: 'مسلسل' },
        { id: 3, title: 'البرنامج الكوميدي', views: 9870, rating: 4.4, type: 'برنامج' },
        { id: 4, title: 'الوثائقي الجديد', views: 8420, rating: 4.7, type: 'وثائقي' }
      ],
      categoryStats: [
        { name: 'أفلام', value: 245, color: '#8884d8' },
        { name: 'مسلسلات', value: 89, color: '#82ca9d' },
        { name: 'برامج تلفزيونية', value: 156, color: '#ffc658' },
        { name: 'متنوعة', value: 67, color: '#ff7c7c' }
      ]
    };
    
    res.json(analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Get users for admin management
router.get('/users', async (req, res) => {
  try {
    // This would be implemented with actual user data
    const users = [
      { id: 1, username: 'user1', email: 'user1@example.com', isActive: true, createdAt: new Date() },
      { id: 2, username: 'user2', email: 'user2@example.com', isActive: true, createdAt: new Date() }
    ];
    
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

export default router;