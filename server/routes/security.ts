import { Request, Response, Router } from 'express';
import { auditLogger } from '../middleware/audit';
import { securityMonitor, SecurePassword, validatePasswordStrength } from '../middleware/security';
import { db } from '../db';
import { users, auditLogs, securityLogs, userSessions, passwordResets } from '@shared/schema';
import { eq, desc, gte, count } from 'drizzle-orm';
import { generateSecureToken, hashToken } from '../middleware/security';

const router = Router();

// Security Dashboard
export async function getSecurityDashboard(req: Request, res: Response) {
  try {
    const stats = securityMonitor.getSecurityStats();
    
    // Get recent security events
    const recentSecurityLogs = await db
      .select()
      .from(securityLogs)
      .orderBy(desc(securityLogs.timestamp))
      .limit(10);

    // Get failed login attempts in the last 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentFailedLogins = await db
      .select()
      .from(securityLogs)
      .where(eq(securityLogs.eventType, 'failed_login'))
      .where(gte(securityLogs.timestamp, oneDayAgo));

    // Get active sessions count
    const activeSessionsCount = await db
      .select({ count: count() })
      .from(userSessions)
      .where(eq(userSessions.isActive, true));

    // Get audit log summary
    const auditSummary = await db
      .select()
      .from(auditLogs)
      .orderBy(desc(auditLogs.timestamp))
      .limit(5);

    res.json({
      securityStats: stats,
      recentSecurityEvents: recentSecurityLogs,
      failedLoginsToday: recentFailedLogins.length,
      activeSessions: activeSessionsCount[0]?.count || 0,
      recentAuditLogs: auditSummary
    });
  } catch (error) {
    console.error('Security dashboard error:', error);
    res.status(500).json({ 
      error: 'خطأ في تحميل لوحة الأمان',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Get audit logs with filtering
export async function getAuditLogs(req: Request, res: Response) {
  try {
    const { userId, action, resource, page = '1', limit = '50' } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    let query = db.select().from(auditLogs);
    
    // Apply filters
    if (userId) {
      query = query.where(eq(auditLogs.userId, parseInt(userId as string)));
    }
    if (action) {
      query = query.where(eq(auditLogs.action, action as string));
    }
    if (resource) {
      query = query.where(eq(auditLogs.resource, resource as string));
    }

    const logs = await query
      .orderBy(desc(auditLogs.timestamp))
      .limit(parseInt(limit as string))
      .offset(offset);

    res.json({ logs, page: parseInt(page as string), limit: parseInt(limit as string) });
  } catch (error) {
    console.error('Audit logs error:', error);
    res.status(500).json({ error: 'خطأ في تحميل سجلات التدقيق' });
  }
}

// Get security logs with filtering
export async function getSecurityLogs(req: Request, res: Response) {
  try {
    const { eventType, severity, ipAddress, page = '1', limit = '50' } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    let query = db.select().from(securityLogs);
    
    // Apply filters
    if (eventType) {
      query = query.where(eq(securityLogs.eventType, eventType as string));
    }
    if (severity) {
      query = query.where(eq(securityLogs.severity, severity as string));
    }
    if (ipAddress) {
      query = query.where(eq(securityLogs.ipAddress, ipAddress as string));
    }

    const logs = await query
      .orderBy(desc(securityLogs.timestamp))
      .limit(parseInt(limit as string))
      .offset(offset);

    res.json({ logs, page: parseInt(page as string), limit: parseInt(limit as string) });
  } catch (error) {
    console.error('Security logs error:', error);
    res.status(500).json({ error: 'خطأ في تحميل سجلات الأمان' });
  }
}

// Change password with enhanced security
export async function changePassword(req: Request, res: Response) {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'غير مصرح' });
    }

    // Validate new password strength
    const passwordValidation = validatePasswordStrength(newPassword);
    if (!passwordValidation.valid) {
      return res.status(400).json({ 
        error: 'كلمة المرور الجديدة غير قوية بما فيه الكفاية',
        details: passwordValidation.errors
      });
    }

    // Get user and verify current password
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user || !SecurePassword.verify(currentPassword, user.password)) {
      const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
      securityMonitor.logFailedAttempt(clientIP, 'wrong_current_password');
      
      await auditLogger.logSecurity({
        ipAddress: clientIP,
        eventType: 'suspicious_activity',
        severity: 'medium',
        userId,
        details: { action: 'failed_password_change', reason: 'wrong_current_password' }
      });

      return res.status(400).json({ error: 'كلمة المرور الحالية غير صحيحة' });
    }

    // Hash new password and update
    const hashedNewPassword = SecurePassword.hash(newPassword);
    await db.update(users)
      .set({ password: hashedNewPassword, updatedAt: new Date() })
      .where(eq(users.id, userId));

    // Log successful password change
    await auditLogger.logAction({
      userId,
      action: 'password_change',
      resource: 'user_account',
      resourceId: userId.toString(),
      ipAddress: req.ip || 'unknown',
      userAgent: req.get('User-Agent') || 'unknown',
      success: true
    });

    // Invalidate all user sessions except current one
    const currentSessionToken = req.cookies?.sessionToken || req.headers.authorization?.replace('Bearer ', '');
    if (currentSessionToken) {
      await db.update(userSessions)
        .set({ isActive: false })
        .where(eq(userSessions.userId, userId));
    }

    res.json({ message: 'تم تغيير كلمة المرور بنجاح' });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ error: 'خطأ في تغيير كلمة المرور' });
  }
}

// Block/unblock IP address
export async function toggleIPBlock(req: Request, res: Response) {
  try {
    const { ipAddress, action } = req.body; // action: 'block' or 'unblock'
    const adminUserId = (req as any).user?.id;

    if (action === 'block') {
      securityMonitor.logFailedAttempt(ipAddress, 'manual_admin_block');
      
      await auditLogger.logSecurity({
        ipAddress: req.ip || 'unknown',
        eventType: 'blocked_ip',
        severity: 'high',
        userId: adminUserId,
        details: { blocked_ip: ipAddress, action: 'manual_block' }
      });
    } else if (action === 'unblock') {
      securityMonitor.clearAttempts(ipAddress);
      
      await auditLogger.logAction({
        userId: adminUserId,
        action: 'unblock_ip',
        resource: 'security',
        resourceId: ipAddress,
        ipAddress: req.ip || 'unknown',
        userAgent: req.get('User-Agent') || 'unknown',
        success: true
      });
    }

    res.json({ message: `تم ${action === 'block' ? 'حظر' : 'إلغاء حظر'} عنوان IP بنجاح` });
  } catch (error) {
    console.error('IP block toggle error:', error);
    res.status(500).json({ error: 'خطأ في تغيير حالة حظر IP' });
  }
}

// Validate password strength endpoint
export async function validatePassword(req: Request, res: Response) {
  try {
    const { password } = req.body;
    const validation = validatePasswordStrength(password);
    res.json(validation);
  } catch (error) {
    console.error('Password validation error:', error);
    res.status(500).json({ error: 'خطأ في التحقق من قوة كلمة المرور' });
  }
}

// Security settings
export async function getSecuritySettings(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    
    // Get user's active sessions
    const userActiveSessions = await db
      .select()
      .from(userSessions)
      .where(eq(userSessions.userId, userId))
      .where(eq(userSessions.isActive, true))
      .orderBy(desc(userSessions.lastUsed));

    // Get recent security events for this user
    const userSecurityLogs = await db
      .select()
      .from(securityLogs)
      .where(eq(securityLogs.userId, userId))
      .orderBy(desc(securityLogs.timestamp))
      .limit(10);

    res.json({
      activeSessions: userActiveSessions,
      recentSecurityEvents: userSecurityLogs,
      securityRecommendations: [
        'استخدم كلمة مرور قوية ومعقدة',
        'لا تشارك كلمة المرور مع أي شخص',
        'قم بتسجيل الخروج من الأجهزة التي لا تستخدمها',
        'راجع نشاط حسابك بانتظام',
        'تأكد من تحديث متصفحك باستمرار'
      ]
    });
  } catch (error) {
    console.error('Security settings error:', error);
    res.status(500).json({ error: 'خطأ في تحميل إعدادات الأمان' });
  }
}

// Terminate session
export async function terminateSession(req: Request, res: Response) {
  try {
    const { sessionId } = req.params;
    const userId = (req as any).user?.id;

    // Only allow users to terminate their own sessions
    const [session] = await db
      .select()
      .from(userSessions)
      .where(eq(userSessions.id, parseInt(sessionId)))
      .where(eq(userSessions.userId, userId));

    if (!session) {
      return res.status(404).json({ error: 'الجلسة غير موجودة' });
    }

    await db.update(userSessions)
      .set({ isActive: false })
      .where(eq(userSessions.id, parseInt(sessionId)));

    await auditLogger.logAction({
      userId,
      action: 'terminate_session',
      resource: 'user_session',
      resourceId: sessionId,
      ipAddress: req.ip || 'unknown',
      userAgent: req.get('User-Agent') || 'unknown',
      success: true
    });

    res.json({ message: 'تم إنهاء الجلسة بنجاح' });
  } catch (error) {
    console.error('Session termination error:', error);
    res.status(500).json({ error: 'خطأ في إنهاء الجلسة' });
  }
}

// Security routes
router.get('/dashboard', getSecurityDashboard);
router.get('/audit-logs', getAuditLogs);
router.get('/security-logs', getSecurityLogs);
router.post('/change-password', changePassword);
router.post('/toggle-ip-block', toggleIPBlock);
router.post('/validate-password', validatePassword);
router.get('/settings', getSecuritySettings);
router.delete('/sessions/:sessionId', terminateSession);

export default router;