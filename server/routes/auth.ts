import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { fileStorage } from '../file-storage-simple';
import { hashPassword, verifyPassword, generateToken, authenticateToken, AuthRequest } from '../auth';
import { insertUserSchema } from '@shared/schema';

const router = Router();

// تسجيل مستخدم جديد
router.post('/register', [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('اسم المستخدم يجب أن يكون بين 3-30 حرف')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('اسم المستخدم يجب أن يحتوي على أحرف وأرقام فقط'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('البريد الإلكتروني غير صحيح'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
  body('firstName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('الاسم الأول يجب أن يكون أقل من 50 حرف'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('الاسم الأخير يجب أن يكون أقل من 50 حرف')
], async (req, res) => {
  try {
    // التحقق من صحة البيانات
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'بيانات غير صحيحة',
        errors: errors.array()
      });
    }

    const { username, email, password, firstName, lastName } = req.body;

    // التحقق من وجود المستخدم
    const existingUserByUsername = await storage.getUserByUsername(username);
    if (existingUserByUsername) {
      return res.status(400).json({ message: 'اسم المستخدم موجود بالفعل' });
    }

    const existingUserByEmail = await storage.getUserByEmail(email);
    if (existingUserByEmail) {
      return res.status(400).json({ message: 'البريد الإلكتروني موجود بالفعل' });
    }

    // تشفير كلمة المرور
    const hashedPassword = await hashPassword(password);

    // إنشاء المستخدم
    const newUser = await storage.createUser({
      username,
      email,
      password: hashedPassword,
      firstName: firstName || null,
      lastName: lastName || null,
      isAdmin: false,
      isActive: true
    });

    // إنشاء JWT token
    const token = generateToken(newUser);

    // إرجاع البيانات (بدون كلمة المرور)
    const { password: _, ...userWithoutPassword } = newUser;
    
    res.status(201).json({
      message: 'تم تسجيل المستخدم بنجاح',
      user: userWithoutPassword,
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

// تسجيل الدخول
router.post('/login', [
  body('username').trim().notEmpty().withMessage('اسم المستخدم مطلوب'),
  body('password').notEmpty().withMessage('كلمة المرور مطلوبة')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'بيانات غير صحيحة',
        errors: errors.array()
      });
    }

    const { username, password } = req.body;

    // البحث عن المستخدم (يمكن استخدام اسم المستخدم أو البريد الإلكتروني)
    let user = await storage.getUserByUsername(username);
    if (!user) {
      user = await storage.getUserByEmail(username);
    }

    if (!user) {
      return res.status(400).json({ message: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
    }

    if (!user.isActive) {
      return res.status(400).json({ message: 'الحساب غير نشط' });
    }

    // التحقق من كلمة المرور
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
    }

    // إنشاء JWT token
    const token = generateToken(user);

    // إرجاع البيانات (بدون كلمة المرور)
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'تم تسجيل الدخول بنجاح',
      user: userWithoutPassword,
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

// الحصول على معلومات المستخدم الحالي
router.get('/me', authenticateToken, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'غير مصرح' });
    }

    // إرجاع معلومات المستخدم (بدون كلمة المرور)
    const { password: _, ...userWithoutPassword } = req.user;
    
    res.json({
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

// تحديث معلومات المستخدم
router.put('/profile', [
  authenticateToken,
  body('firstName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('الاسم الأول يجب أن يكون أقل من 50 حرف'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('الاسم الأخير يجب أن يكون أقل من 50 حرف'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('البريد الإلكتروني غير صحيح')
], async (req: AuthRequest, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'بيانات غير صحيحة',
        errors: errors.array()
      });
    }

    if (!req.user) {
      return res.status(401).json({ message: 'غير مصرح' });
    }

    const { firstName, lastName, email } = req.body;
    
    // التحقق من أن البريد الإلكتروني غير مستخدم من مستخدم آخر
    if (email && email !== req.user.email) {
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser && existingUser.id !== req.user.id) {
        return res.status(400).json({ message: 'البريد الإلكتروني موجود بالفعل' });
      }
    }

    // تحديث البيانات
    const updatedUser = await storage.updateUser(req.user.id, {
      firstName: firstName !== undefined ? firstName : req.user.firstName,
      lastName: lastName !== undefined ? lastName : req.user.lastName,
      email: email !== undefined ? email : req.user.email
    });

    // إرجاع البيانات المحدثة (بدون كلمة المرور)
    const { password: _, ...userWithoutPassword } = updatedUser;

    res.json({
      message: 'تم تحديث الملف الشخصي بنجاح',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

// تغيير كلمة المرور
router.put('/change-password', [
  authenticateToken,
  body('currentPassword').notEmpty().withMessage('كلمة المرور الحالية مطلوبة'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل')
], async (req: AuthRequest, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'بيانات غير صحيحة',
        errors: errors.array()
      });
    }

    if (!req.user) {
      return res.status(401).json({ message: 'غير مصرح' });
    }

    const { currentPassword, newPassword } = req.body;

    // التحقق من كلمة المرور الحالية
    const isCurrentPasswordValid = await verifyPassword(currentPassword, req.user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: 'كلمة المرور الحالية غير صحيحة' });
    }

    // تشفير كلمة المرور الجديدة
    const hashedNewPassword = await hashPassword(newPassword);

    // تحديث كلمة المرور
    await storage.updateUser(req.user.id, {
      password: hashedNewPassword
    });

    res.json({
      message: 'تم تغيير كلمة المرور بنجاح'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

// تسجيل الخروج (اختياري - يمكن حذف الـ token من جانب العميل)
router.post('/logout', authenticateToken, async (req: AuthRequest, res) => {
  // في التطبيقات الحقيقية، يمكن إضافة الـ token إلى قائمة سوداء
  res.json({
    message: 'تم تسجيل الخروج بنجاح'
  });
});

export default router;