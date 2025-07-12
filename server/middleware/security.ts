import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'crypto';

// Rate limiting configurations
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Maximum 5 login attempts per 15 minutes
  message: {
    error: 'تم تجاوز عدد محاولات تسجيل الدخول المسموح. حاول مرة أخرى خلال 15 دقيقة.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true
});

export const apiRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // Maximum 100 requests per minute
  message: {
    error: 'تم تجاوز الحد المسموح من الطلبات. حاول مرة أخرى لاحقاً.',
    retryAfter: '1 minute'
  },
  standardHeaders: true,
  legacyHeaders: false
});

export const strictRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // Maximum 10 requests per 5 minutes for sensitive operations
  message: {
    error: 'تم تجاوز الحد المسموح للعمليات الحساسة. حاول مرة أخرى خلال 5 دقائق.',
    retryAfter: '5 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Enhanced password hashing with salt
export class SecurePassword {
  static hash(password: string): string {
    const salt = randomBytes(32).toString('hex');
    const hashedPassword = scryptSync(password, salt, 64).toString('hex');
    return `${salt}:${hashedPassword}`;
  }

  static verify(password: string, hashedPassword: string): boolean {
    try {
      const [salt, hash] = hashedPassword.split(':');
      const hashedPasswordBuffer = Buffer.from(hash, 'hex');
      const suppliedPasswordBuffer = scryptSync(password, salt, 64);
      return timingSafeEqual(hashedPasswordBuffer, suppliedPasswordBuffer);
    } catch (error) {
      return false;
    }
  }
}

// Security headers middleware
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      connectSrc: ["'self'", "ws:", "wss:"],
      mediaSrc: ["'self'", "blob:", "data:"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'none'"]
    }
  },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
});

// Input validation and sanitization
export const validateInput = (req: Request, res: Response, next: NextFunction) => {
  // Remove potentially dangerous characters
  const sanitize = (str: string) => {
    if (typeof str !== 'string') return str;
    return str
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim();
  };

  // Sanitize request body
  if (req.body && typeof req.body === 'object') {
    const sanitizeObject = (obj: any): any => {
      if (Array.isArray(obj)) {
        return obj.map(sanitizeObject);
      }
      if (obj && typeof obj === 'object') {
        const sanitized: any = {};
        for (const [key, value] of Object.entries(obj)) {
          if (typeof value === 'string') {
            sanitized[key] = sanitize(value);
          } else if (typeof value === 'object') {
            sanitized[key] = sanitizeObject(value);
          } else {
            sanitized[key] = value;
          }
        }
        return sanitized;
      }
      return obj;
    };
    req.body = sanitizeObject(req.body);
  }

  next();
};

// Session security
export const generateSecureToken = (): string => {
  return randomBytes(32).toString('hex');
};

export const hashToken = (token: string): string => {
  return createHash('sha256').update(token).digest('hex');
};

// IP-based security monitoring
interface SecurityLog {
  ip: string;
  attempts: number;
  lastAttempt: Date;
  blocked: boolean;
  reason?: string;
}

class SecurityMonitor {
  private static instance: SecurityMonitor;
  private suspiciousIPs: Map<string, SecurityLog> = new Map();
  private readonly MAX_FAILED_ATTEMPTS = 10;
  private readonly BLOCK_DURATION = 30 * 60 * 1000; // 30 minutes

  static getInstance(): SecurityMonitor {
    if (!SecurityMonitor.instance) {
      SecurityMonitor.instance = new SecurityMonitor();
    }
    return SecurityMonitor.instance;
  }

  logFailedAttempt(ip: string, reason: string = 'failed_login') {
    const log = this.suspiciousIPs.get(ip) || {
      ip,
      attempts: 0,
      lastAttempt: new Date(),
      blocked: false
    };

    log.attempts++;
    log.lastAttempt = new Date();
    log.reason = reason;

    if (log.attempts >= this.MAX_FAILED_ATTEMPTS) {
      log.blocked = true;
      console.warn(`🚨 Security Alert: IP ${ip} blocked due to ${log.attempts} failed attempts. Reason: ${reason}`);
    }

    this.suspiciousIPs.set(ip, log);
  }

  isBlocked(ip: string): boolean {
    const log = this.suspiciousIPs.get(ip);
    if (!log || !log.blocked) return false;

    // Check if block duration has expired
    const timeSinceLastAttempt = Date.now() - log.lastAttempt.getTime();
    if (timeSinceLastAttempt > this.BLOCK_DURATION) {
      log.blocked = false;
      log.attempts = 0;
      this.suspiciousIPs.set(ip, log);
      return false;
    }

    return true;
  }

  clearAttempts(ip: string) {
    this.suspiciousIPs.delete(ip);
  }

  getSecurityStats() {
    const stats = {
      totalMonitoredIPs: this.suspiciousIPs.size,
      blockedIPs: 0,
      suspiciousIPs: 0
    };

    for (const log of this.suspiciousIPs.values()) {
      if (log.blocked) stats.blockedIPs++;
      else if (log.attempts > 3) stats.suspiciousIPs++;
    }

    return stats;
  }
}

export const securityMonitor = SecurityMonitor.getInstance();

// Security middleware
export const checkSecurityStatus = (req: Request, res: Response, next: NextFunction) => {
  const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
  
  if (securityMonitor.isBlocked(clientIP)) {
    console.warn(`🚨 Blocked request from IP: ${clientIP}`);
    return res.status(429).json({
      error: 'عذراً، تم حظر عنوان IP الخاص بك مؤقتاً بسبب النشاط المشبوه. حاول مرة أخرى لاحقاً.',
      code: 'IP_BLOCKED',
      retryAfter: '30 minutes'
    });
  }

  next();
};

// Enhanced authentication middleware
export const enhancedAuth = (req: Request, res: Response, next: NextFunction) => {
  const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
  
  try {
    // Check for authentication token
    const token = req.headers.authorization?.replace('Bearer ', '') || req.cookies?.authToken;
    
    if (!token) {
      securityMonitor.logFailedAttempt(clientIP, 'missing_token');
      return res.status(401).json({
        error: 'غير مصرح. يرجى تسجيل الدخول.',
        code: 'MISSING_TOKEN'
      });
    }

    // Verify token (implement your token verification logic here)
    // For now, we'll add a placeholder
    req.user = { id: 1, role: 'user' }; // Replace with actual token verification
    
    next();
  } catch (error) {
    securityMonitor.logFailedAttempt(clientIP, 'invalid_token');
    return res.status(401).json({
      error: 'رمز المصادقة غير صحيح.',
      code: 'INVALID_TOKEN'
    });
  }
};

// Password strength validation
export const validatePasswordStrength = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل');
  }
  
  if (!/\d/.test(password)) {
    errors.push('كلمة المرور يجب أن تحتوي على رقم واحد على الأقل');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('كلمة المرور يجب أن تحتوي على رمز خاص واحد على الأقل');
  }

  // Check for common weak passwords
  const commonPasswords = [
    'password', '123456', '123456789', 'qwerty', 'abc123', 
    'password123', 'admin', 'letmein', 'welcome', '123123'
  ];
  
  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push('كلمة المرور هذه شائعة جداً وغير آمنة');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

export default {
  securityHeaders,
  validateInput,
  checkSecurityStatus,
  enhancedAuth,
  authRateLimit,
  apiRateLimit,
  strictRateLimit,
  SecurePassword,
  validatePasswordStrength,
  securityMonitor,
  generateSecureToken,
  hashToken
};