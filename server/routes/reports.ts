import express from 'express';
import { z } from 'zod';
import { validateRequest } from '../middleware/validation';

const router = express.Router();

// Schema للتحقق من صحة تقرير الخطأ
const reportSchema = z.object({
  contentId: z.number(),
  contentTitle: z.string(),
  email: z.string().email().optional(),
  reason: z.string().min(1, 'يجب اختيار سبب التبليغ'),
  description: z.string().min(10, 'يجب كتابة وصف المشكلة بتفصيل أكثر'),
  pageUrl: z.string().url(),
  timestamp: z.string()
});

// إنشاء تقرير جديد
router.post('/', validateRequest(reportSchema), async (req, res) => {
  try {
    const { contentId, contentTitle, email, reason, description, pageUrl, timestamp } = req.body;

    // معلومات إضافية للتقرير
    const report = {
      id: Date.now(), // معرف مؤقت
      contentId,
      contentTitle,
      email: email || 'غير محدد',
      reason,
      description,
      pageUrl,
      timestamp,
      userAgent: req.headers['user-agent'] || '',
      ip: req.ip || req.connection.remoteAddress || '',
      status: 'جديد',
      createdAt: new Date().toISOString()
    };

    // في الإنتاج، يتم حفظ التقرير في قاعدة البيانات
    // أو إرساله عبر البريد الإلكتروني للمطورين
    
    // عرض التقرير في console للمطورين في بيئة التطوير
    if (process.env.NODE_ENV === 'development') {
      console.log('📝 تقرير خطأ جديد:', {
        ...report,
        reason: getReasonsArabic(reason)
      });
    }

    // إرسال استجابة إيجابية
    res.status(201).json({
      success: true,
      message: 'تم إرسال التبليغ بنجاح. شكراً لك على مساعدتنا في تحسين الخدمة.',
      reportId: report.id
    });

  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ خطأ في معالجة التقرير:', error);
    }
    
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء إرسال التبليغ. يرجى المحاولة مرة أخرى.'
    });
  }
});

// الحصول على جميع التقارير (للإدارة)
router.get('/', async (req, res) => {
  try {
    // في المستقبل، سيتم جلب التقارير من قاعدة البيانات
    res.json({
      reports: [],
      total: 0,
      message: 'نظام التقارير قيد التطوير'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب التقارير'
    });
  }
});

// تحويل أسباب التبليغ إلى العربية
function getReasonsArabic(reason: string): string {
  const reasons: { [key: string]: string } = {
    'download-link': 'مشكلة في رابط التحميل المباشر',
    'watch-link': 'مشكلة في رابط المشاهدة المباشرة',
    'subtitle': 'مشكلة عدم توافق الترجمة',
    'audio-video': 'مشكلة تقنية في الصوت أو الصورة',
    'content-error': 'مشكلة تحريرية في الموضوع أو الصور',
    'quality-update': 'طلب تحديث جودة',
    'broken-links': 'روابط معطلة أو لا تعمل',
    'wrong-content': 'محتوى خاطئ أو مختلف',
    'missing-episodes': 'حلقات مفقودة أو ناقصة',
    'other': 'مشكلة أخرى'
  };
  
  return reasons[reason] || reason;
}

export default router;