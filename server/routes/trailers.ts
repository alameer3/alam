import { Router } from 'express';
import { fileStorage } from '../file-storage-simple';
import { z } from 'zod';
import { body, validationResult } from 'express-validator';

const router = Router();

// Schema for trailer data
const trailerSchema = z.object({
  contentId: z.number(),
  title: z.string().min(1),
  description: z.string().optional(),
  duration: z.string(),
  url: z.string().url(),
  thumbnail: z.string().url().optional(),
  type: z.enum(['teaser', 'trailer', 'behind-scenes', 'interview']),
  releaseDate: z.string(),
  rating: z.number().min(0).max(10),
  viewCount: z.number().default(0),
  cast: z.array(z.string()).default([]),
  genre: z.array(z.string()).default([])
});

// Get trailers for specific content
router.get('/:contentId', async (req, res) => {
  try {
    const contentId = parseInt(req.params.contentId);
    
    if (isNaN(contentId)) {
      return res.status(400).json({ error: 'Invalid content ID' });
    }

    // For now, return mock data - in production, this would fetch from database
    const mockTrailers = [
      {
        id: `trailer-${contentId}-1`,
        contentId,
        title: `الإعلان الدعائي الرسمي`,
        description: 'الإعلان الدعائي الرسمي الذي يكشف عن القصة المثيرة والأحداث الدرامية',
        duration: '2:30',
        url: '/api/placeholder/trailer.mp4',
        thumbnail: `/api/placeholder/854/480`,
        type: 'trailer' as const,
        releaseDate: '2024-01-15',
        rating: 8.5,
        viewCount: 1250000,
        cast: ['محمد رمضان', 'نيللي كريم', 'أحمد مالك'],
        genre: ['دراما', 'إثارة', 'أكشن']
      },
      {
        id: `teaser-${contentId}-1`,
        contentId,
        title: `الإعلان التشويقي الأول`,
        description: 'إعلان تشويقي قصير يكشف عن الأجواء العامة للعمل',
        duration: '1:15',
        url: '/api/placeholder/teaser.mp4',
        thumbnail: `/api/placeholder/854/480`,
        type: 'teaser' as const,
        releaseDate: '2023-12-01',
        rating: 7.8,
        viewCount: 890000,
        cast: ['محمد رمضان', 'نيللي كريم'],
        genre: ['دراما', 'إثارة']
      },
      {
        id: `behind-${contentId}-1`,
        contentId,
        title: `كواليس التصوير`,
        description: 'لقطات من كواليس التصوير ومقابلات مع فريق العمل',
        duration: '5:45',
        url: '/api/placeholder/behind.mp4',
        thumbnail: `/api/placeholder/854/480`,
        type: 'behind-scenes' as const,
        releaseDate: '2024-02-01',
        rating: 8.2,
        viewCount: 456000,
        cast: ['محمد رمضان', 'نيللي كريم', 'أحمد مالك', 'مها أحمد'],
        genre: ['وثائقي', 'كواليس']
      }
    ];

    res.json(mockTrailers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trailers' });
  }
});

// Get featured trailer for homepage
router.get('/featured/latest', async (req, res) => {
  try {
    // In production, this would fetch the latest/most popular trailer
    const featuredTrailer = {
      contentId: 1,
      title: 'الرسالة',
      description: 'فيلم ملحمي عن سيرة الرسول محمد صلى الله عليه وسلم، يحكي قصة انتشار الإسلام في شبه الجزيرة العربية',
      trailerUrl: '/api/placeholder/featured-trailer.mp4',
      thumbnailUrl: '/api/placeholder/1920/1080',
      rating: 9.2,
      year: 1976,
      genres: ['دراما', 'تاريخي', 'ديني'],
      duration: '3:12'
    };

    res.json(featuredTrailer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch featured trailer' });
  }
});

// Get trending trailers
router.get('/trending/week', async (req, res) => {
  try {
    const trendingTrailers = [
      {
        title: 'الإعلان الدعائي - باب الحارة',
        trailerUrl: '/api/placeholder/trending1.mp4',
        thumbnailUrl: '/api/placeholder/400/225',
        duration: '2:15'
      },
      {
        title: 'الإعلان التشويقي - الهيبة',
        trailerUrl: '/api/placeholder/trending2.mp4',
        thumbnailUrl: '/api/placeholder/400/225',
        duration: '1:45'
      },
      {
        title: 'كواليس التصوير - وجدة',
        trailerUrl: '/api/placeholder/trending3.mp4',
        thumbnailUrl: '/api/placeholder/400/225',
        duration: '3:30'
      },
      {
        title: 'الإعلان الدعائي - ذيب',
        trailerUrl: '/api/placeholder/trending4.mp4',
        thumbnailUrl: '/api/placeholder/400/225',
        duration: '2:00'
      }
    ];

    res.json(trendingTrailers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trending trailers' });
  }
});

// Add new trailer (Admin only)
router.post('/', [
  body('contentId').isInt({ min: 1 }),
  body('title').trim().isLength({ min: 1 }),
  body('url').isURL(),
  body('type').isIn(['teaser', 'trailer', 'behind-scenes', 'interview']),
  body('duration').matches(/^\d{1,2}:\d{2}$/),
  body('rating').isFloat({ min: 0, max: 10 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const trailerData = trailerSchema.parse(req.body);
    
    // In production, this would save to database
    const newTrailer = {
      id: `trailer-${trailerData.contentId}-${Date.now()}`,
      ...trailerData,
      createdAt: new Date().toISOString()
    };

    res.status(201).json(newTrailer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add trailer' });
  }
});

// Update trailer view count
router.patch('/:trailerId/views', async (req, res) => {
  try {
    const trailerId = req.params.trailerId;
    
    // In production, this would increment view count in database
    res.json({ 
      success: true, 
      message: 'View count updated',
      trailerId 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update trailer views' });
  }
});

// Delete trailer (Admin only)
router.delete('/:trailerId', async (req, res) => {
  try {
    const trailerId = req.params.trailerId;
    
    // In production, this would delete from database
    res.json({ 
      success: true, 
      message: 'Trailer deleted successfully',
      trailerId 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete trailer' });
  }
});

export default router;