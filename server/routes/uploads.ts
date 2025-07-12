import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { storage } from '../storage';

const router = Router();

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), 'uploads');

// Ensure upload directory exists
fs.mkdir(uploadDir, { recursive: true }).catch(console.error);

const multerStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error, uploadDir);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: multerStorage,
  limits: {
    fileSize: 500 * 1024 * 1024 // 500MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow specific file types
    const allowedTypes = /\.(mp4|avi|mkv|mov|wmv|flv|webm|jpg|jpeg|png|gif|bmp|webp|mp3|wav|flac|aac|ogg|pdf|doc|docx|txt)$/i;
    if (allowedTypes.test(file.originalname)) {
      cb(null, true);
    } else {
      cb(new Error('نوع الملف غير مدعوم'));
    }
  }
});

// Simple file upload
router.post('/simple', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'لم يتم اختيار ملف' });
    }

    const userId = 1; // Get from auth middleware

    const uploadRecord = await storage.createUpload({
      userId,
      filename: req.file.filename,
      originalFilename: req.file.originalname,
      filePath: req.file.path,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      status: 'completed',
      progress: 100
    });

    res.json({
      success: true,
      upload: uploadRecord,
      message: 'تم رفع الملف بنجاح'
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: 'خطأ في رفع الملف',
      details: error instanceof Error ? error.message : 'خطأ غير معروف'
    });
  }
});

// Initialize chunked upload
router.post('/init', async (req, res) => {
  try {
    const { filename, fileSize, mimeType, totalChunks } = req.body;
    const userId = 1; // Get from auth middleware

    if (!filename || !fileSize || !mimeType) {
      return res.status(400).json({ error: 'بيانات مفقودة' });
    }

    const uniqueFilename = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(filename);
    const filePath = path.join(uploadDir, uniqueFilename);

    const uploadRecord = await storage.createUpload({
      userId,
      filename: uniqueFilename,
      originalFilename: filename,
      filePath,
      fileSize,
      mimeType,
      status: 'pending',
      progress: 0
    });

    // Create chunk records
    const chunkPromises = [];
    for (let i = 0; i < totalChunks; i++) {
      chunkPromises.push(
        storage.createUploadChunk({
          uploadId: uploadRecord.id,
          chunkNumber: i,
          chunkSize: i === totalChunks - 1 ? fileSize % (1024 * 1024) : 1024 * 1024,
          isUploaded: false
        })
      );
    }

    await Promise.all(chunkPromises);

    res.json({
      success: true,
      uploadId: uploadRecord.id,
      message: 'تم تهيئة رفع الملف'
    });

  } catch (error) {
    console.error('Init upload error:', error);
    res.status(500).json({ 
      error: 'خطأ في تهيئة رفع الملف',
      details: error instanceof Error ? error.message : 'خطأ غير معروف'
    });
  }
});

// Upload chunk
router.post('/chunk', upload.single('chunk'), async (req, res) => {
  try {
    const { uploadId, chunkIndex } = req.body;
    
    if (!req.file || !uploadId || chunkIndex === undefined) {
      return res.status(400).json({ error: 'بيانات مفقودة' });
    }

    const uploadRecord = await storage.getUpload(parseInt(uploadId));
    if (!uploadRecord) {
      return res.status(404).json({ error: 'عملية الرفع غير موجودة' });
    }

    // Get chunk record
    const chunks = await storage.getUploadChunks(uploadRecord.id);
    const chunk = chunks.find(c => c.chunkNumber === parseInt(chunkIndex));
    
    if (!chunk) {
      return res.status(404).json({ error: 'القطعة غير موجودة' });
    }

    // Save chunk to temporary location
    const tempChunkPath = req.file.path;
    const finalChunkPath = path.join(uploadDir, 'chunks', `${uploadId}_${chunkIndex}`);
    
    // Ensure chunks directory exists
    await fs.mkdir(path.dirname(finalChunkPath), { recursive: true });
    
    // Move chunk to final location
    await fs.rename(tempChunkPath, finalChunkPath);

    // Mark chunk as uploaded
    await storage.markChunkAsUploaded(chunk.id);

    // Update upload progress
    const updatedChunks = await storage.getUploadChunks(uploadRecord.id);
    const uploadedCount = updatedChunks.filter(c => c.isUploaded).length;
    const progress = Math.round((uploadedCount / updatedChunks.length) * 100);

    await storage.updateUploadProgress(uploadRecord.id, progress);

    res.json({
      success: true,
      chunkIndex: parseInt(chunkIndex),
      progress,
      message: 'تم رفع القطعة بنجاح'
    });

  } catch (error) {
    console.error('Chunk upload error:', error);
    res.status(500).json({ 
      error: 'خطأ في رفع القطعة',
      details: error instanceof Error ? error.message : 'خطأ غير معروف'
    });
  }
});

// Complete chunked upload
router.post('/complete', async (req, res) => {
  try {
    const { uploadId } = req.body;

    if (!uploadId) {
      return res.status(400).json({ error: 'معرف الرفع مفقود' });
    }

    const uploadRecord = await storage.getUpload(parseInt(uploadId));
    if (!uploadRecord) {
      return res.status(404).json({ error: 'عملية الرفع غير موجودة' });
    }

    const chunks = await storage.getUploadChunks(uploadRecord.id);
    const allUploaded = chunks.every(c => c.isUploaded);

    if (!allUploaded) {
      return res.status(400).json({ error: 'لم يتم رفع جميع القطع' });
    }

    // Combine chunks into final file
    const finalPath = uploadRecord.filePath;
    const writeStream = await fs.open(finalPath, 'w');

    try {
      for (let i = 0; i < chunks.length; i++) {
        const chunkPath = path.join(uploadDir, 'chunks', `${uploadId}_${i}`);
        const chunkData = await fs.readFile(chunkPath);
        await writeStream.write(chunkData);
        
        // Clean up chunk file
        await fs.unlink(chunkPath).catch(console.error);
      }
    } finally {
      await writeStream.close();
    }

    // Update upload status
    await storage.updateUploadStatus(uploadRecord.id, 'completed');
    await storage.updateUploadProgress(uploadRecord.id, 100);

    res.json({
      success: true,
      upload: await storage.getUpload(uploadRecord.id),
      message: 'تم إكمال رفع الملف بنجاح'
    });

  } catch (error) {
    console.error('Complete upload error:', error);
    res.status(500).json({ 
      error: 'خطأ في إكمال رفع الملف',
      details: error instanceof Error ? error.message : 'خطأ غير معروف'
    });
  }
});

// Get user uploads
router.get('/user', async (req, res) => {
  try {
    const userId = 1; // Get from auth middleware
    const uploads = await storage.getUserUploads(userId);

    res.json(uploads);

  } catch (error) {
    console.error('Get uploads error:', error);
    res.status(500).json({ 
      error: 'خطأ في جلب الملفات',
      details: error instanceof Error ? error.message : 'خطأ غير معروف'
    });
  }
});

// Get upload statistics
router.get('/stats', async (req, res) => {
  try {
    const userId = 1; // Get from auth middleware
    const uploads = await storage.getUserUploads(userId);

    const stats = {
      totalUploads: uploads.length,
      totalSize: uploads.reduce((sum, upload) => sum + upload.fileSize, 0),
      videoFiles: uploads.filter(u => u.mimeType.startsWith('video/')).length,
      imageFiles: uploads.filter(u => u.mimeType.startsWith('image/')).length,
      audioFiles: uploads.filter(u => u.mimeType.startsWith('audio/')).length,
      otherFiles: uploads.filter(u => 
        !u.mimeType.startsWith('video/') && 
        !u.mimeType.startsWith('image/') && 
        !u.mimeType.startsWith('audio/')
      ).length,
      videoSize: uploads
        .filter(u => u.mimeType.startsWith('video/'))
        .reduce((sum, upload) => sum + upload.fileSize, 0),
      imageSize: uploads
        .filter(u => u.mimeType.startsWith('image/'))
        .reduce((sum, upload) => sum + upload.fileSize, 0),
      audioSize: uploads
        .filter(u => u.mimeType.startsWith('audio/'))
        .reduce((sum, upload) => sum + upload.fileSize, 0),
      otherSize: uploads
        .filter(u => 
          !u.mimeType.startsWith('video/') && 
          !u.mimeType.startsWith('image/') && 
          !u.mimeType.startsWith('audio/')
        )
        .reduce((sum, upload) => sum + upload.fileSize, 0),
      completedUploads: uploads.filter(u => u.status === 'completed').length,
      pendingUploads: uploads.filter(u => u.status === 'pending').length,
      failedUploads: uploads.filter(u => u.status === 'error').length
    };

    res.json(stats);

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ 
      error: 'خطأ في جلب الإحصائيات',
      details: error instanceof Error ? error.message : 'خطأ غير معروف'
    });
  }
});

// Delete upload
router.delete('/:id', async (req, res) => {
  try {
    const uploadId = parseInt(req.params.id);
    const upload = await storage.getUpload(uploadId);

    if (!upload) {
      return res.status(404).json({ error: 'الملف غير موجود' });
    }

    // Delete file from disk
    try {
      await fs.unlink(upload.filePath);
    } catch (error) {
      console.error('Error deleting file:', error);
    }

    // Delete from database
    const deleted = await storage.deleteUpload(uploadId);

    if (deleted) {
      res.json({ success: true, message: 'تم حذف الملف بنجاح' });
    } else {
      res.status(500).json({ error: 'خطأ في حذف الملف' });
    }

  } catch (error) {
    console.error('Delete upload error:', error);
    res.status(500).json({ 
      error: 'خطأ في حذف الملف',
      details: error instanceof Error ? error.message : 'خطأ غير معروف'
    });
  }
});

// Download file
router.get('/download/:id', async (req, res) => {
  try {
    const uploadId = parseInt(req.params.id);
    const upload = await storage.getUpload(uploadId);

    if (!upload) {
      return res.status(404).json({ error: 'الملف غير موجود' });
    }

    // Check if file exists
    try {
      await fs.access(upload.filePath);
    } catch (error) {
      return res.status(404).json({ error: 'الملف غير موجود على الخادم' });
    }

    res.setHeader('Content-Disposition', `attachment; filename="${upload.originalFilename}"`);
    res.setHeader('Content-Type', upload.mimeType);
    res.sendFile(path.resolve(upload.filePath));

  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ 
      error: 'خطأ في تحميل الملف',
      details: error instanceof Error ? error.message : 'خطأ غير معروف'
    });
  }
});

export { router as uploadsRouter };