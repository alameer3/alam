import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { storage } from '../storage';
import { insertUploadSchema, insertUploadChunkSchema } from '@shared/schema';
import { z } from 'zod';
import sharp from 'sharp';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';

// Set FFmpeg path
if (ffmpegStatic) {
  ffmpeg.setFfmpegPath(ffmpegStatic);
}

const router = express.Router();

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  }),
  limits: {
    fileSize: 2 * 1024 * 1024 * 1024, // 2GB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept video, image, and subtitle files
    const allowedTypes = [
      'video/mp4', 'video/avi', 'video/mkv', 'video/mov', 'video/wmv',
      'image/jpeg', 'image/png', 'image/webp',
      'text/plain', 'application/x-subrip' // for subtitles
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('نوع الملف غير مدعوم. يرجى رفع ملفات الفيديو، الصور، أو الترجمات فقط.'));
    }
  }
});

// Create new upload
router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'لم يتم رفع أي ملف' });
    }

    const userId = req.body.userId || 1; // Default to user 1 for now
    const uploadData = {
      fileName: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      userId: userId,
      fileType: req.file.mimetype.startsWith('video/') ? 'video' : 
                req.file.mimetype.startsWith('image/') ? 'image' : 'subtitle',
      storageUrl: req.file.path,
      compressionLevel: req.body.compressionLevel || 'medium'
    };

    const upload = await storage.createUpload(uploadData);

    // Process the uploaded file
    processUploadedFile(upload);

    res.status(201).json(upload);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'فشل في رفع الملف' });
  }
});

// Get upload by ID
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const upload = await storage.getUpload(id);

    if (!upload) {
      return res.status(404).json({ error: 'الملف غير موجود' });
    }

    res.json(upload);
  } catch (error) {
    console.error('Get upload error:', error);
    res.status(500).json({ error: 'فشل في جلب معلومات الملف' });
  }
});

// Get user uploads
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const uploads = await storage.getUserUploads(userId);
    res.json(uploads);
  } catch (error) {
    console.error('Get user uploads error:', error);
    res.status(500).json({ error: 'فشل في جلب ملفات المستخدم' });
  }
});

// Update upload progress
router.patch('/:id/progress', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { progress } = req.body;

    if (progress < 0 || progress > 100) {
      return res.status(400).json({ error: 'قيمة التقدم يجب أن تكون بين 0 و 100' });
    }

    await storage.updateUploadProgress(id, progress);
    res.json({ success: true });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ error: 'فشل في تحديث التقدم' });
  }
});

// Update upload status
router.patch('/:id/status', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;

    await storage.updateUploadStatus(id, status);
    res.json({ success: true });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ error: 'فشل في تحديث الحالة' });
  }
});

// Delete upload
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const upload = await storage.getUpload(id);

    if (!upload) {
      return res.status(404).json({ error: 'الملف غير موجود' });
    }

    // Delete physical file
    if (fs.existsSync(upload.storageUrl)) {
      fs.unlinkSync(upload.storageUrl);
    }

    // Delete thumbnail if exists
    if (upload.thumbnailUrl && fs.existsSync(upload.thumbnailUrl)) {
      fs.unlinkSync(upload.thumbnailUrl);
    }

    // Delete processed file if exists
    if (upload.processedUrl && fs.existsSync(upload.processedUrl)) {
      fs.unlinkSync(upload.processedUrl);
    }

    await storage.deleteUpload(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Delete upload error:', error);
    res.status(500).json({ error: 'فشل في حذف الملف' });
  }
});

// Process uploaded file (thumbnail generation, compression, etc.)
async function processUploadedFile(upload: any) {
  try {
    await storage.updateUploadStatus(upload.id, 'processing');

    if (upload.fileType === 'video') {
      // Generate thumbnail
      const thumbnailPath = upload.storageUrl.replace(path.extname(upload.storageUrl), '_thumb.jpg');
      
      ffmpeg(upload.storageUrl)
        .screenshots({
          timestamps: ['10%'],
          filename: path.basename(thumbnailPath),
          folder: path.dirname(thumbnailPath)
        })
        .on('end', async () => {
          await storage.updateUpload(upload.id, { thumbnailUrl: thumbnailPath });
          
          // Get video duration
          ffmpeg.ffprobe(upload.storageUrl, async (err, metadata) => {
            if (!err && metadata.format.duration) {
              await storage.updateUpload(upload.id, { 
                duration: Math.round(metadata.format.duration)
              });
            }
          });
        })
        .on('error', (err) => {
          console.error('Thumbnail generation error:', err);
        });

      // Compress video if needed
      if (upload.compressionLevel !== 'none') {
        const compressedPath = upload.storageUrl.replace(path.extname(upload.storageUrl), '_compressed.mp4');
        
        const compressionSettings = {
          low: { videoBitrate: '500k', audioBitrate: '64k' },
          medium: { videoBitrate: '1000k', audioBitrate: '128k' },
          high: { videoBitrate: '2000k', audioBitrate: '192k' }
        };

        const settings = compressionSettings[upload.compressionLevel as keyof typeof compressionSettings];

        ffmpeg(upload.storageUrl)
          .videoBitrate(settings.videoBitrate)
          .audioBitrate(settings.audioBitrate)
          .format('mp4')
          .on('progress', async (progress) => {
            await storage.updateUploadProgress(upload.id, Math.round(progress.percent || 0));
          })
          .on('end', async () => {
            await storage.updateUpload(upload.id, { 
              processedUrl: compressedPath,
              uploadProgress: 100
            });
            await storage.updateUploadStatus(upload.id, 'completed');
          })
          .on('error', async (err) => {
            console.error('Compression error:', err);
            await storage.updateUploadStatus(upload.id, 'failed');
          })
          .save(compressedPath);
      } else {
        await storage.updateUploadStatus(upload.id, 'completed');
        await storage.updateUploadProgress(upload.id, 100);
      }
    } else if (upload.fileType === 'image') {
      // Compress and generate thumbnail for images
      const thumbnailPath = upload.storageUrl.replace(path.extname(upload.storageUrl), '_thumb.jpg');
      
      await sharp(upload.storageUrl)
        .resize(300, 200, { fit: 'cover' })
        .jpeg({ quality: 80 })
        .toFile(thumbnailPath);

      await storage.updateUpload(upload.id, { thumbnailUrl: thumbnailPath });
      await storage.updateUploadStatus(upload.id, 'completed');
      await storage.updateUploadProgress(upload.id, 100);
    } else {
      // For subtitles and other files, just mark as completed
      await storage.updateUploadStatus(upload.id, 'completed');
      await storage.updateUploadProgress(upload.id, 100);
    }
  } catch (error) {
    console.error('Processing error:', error);
    await storage.updateUploadStatus(upload.id, 'failed');
  }
}

export default router;