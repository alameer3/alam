import { Request, Response, NextFunction } from 'express';
import { db } from '../db';
import { auditLogs, securityLogs } from '@shared/schema';

export interface AuditLogEntry {
  userId?: number;
  action: string;
  resource: string;
  resourceId?: string;
  details?: any;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  errorMessage?: string;
}

export interface SecurityLogEntry {
  ipAddress: string;
  eventType: 'failed_login' | 'suspicious_activity' | 'blocked_ip' | 'security_violation';
  details?: any;
  severity: 'low' | 'medium' | 'high' | 'critical';
  userAgent?: string;
  userId?: number;
}

class AuditLogger {
  private static instance: AuditLogger;

  static getInstance(): AuditLogger {
    if (!AuditLogger.instance) {
      AuditLogger.instance = new AuditLogger();
    }
    return AuditLogger.instance;
  }

  async logAction(entry: AuditLogEntry): Promise<void> {
    try {
      await db.insert(auditLogs).values({
        userId: entry.userId,
        action: entry.action,
        resource: entry.resource,
        resourceId: entry.resourceId,
        details: entry.details ? JSON.stringify(entry.details) : null,
        ipAddress: entry.ipAddress,
        userAgent: entry.userAgent,
        success: entry.success,
        errorMessage: entry.errorMessage,
        timestamp: new Date()
      });
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`📝 Audit Log: ${entry.action} on ${entry.resource} by ${entry.userId || 'anonymous'} - ${entry.success ? 'SUCCESS' : 'FAILED'}`);
      }
    } catch (error) {
      console.error('Failed to log audit entry:', error);
    }
  }

  async logSecurity(entry: SecurityLogEntry): Promise<void> {
    try {
      await db.insert(securityLogs).values({
        ipAddress: entry.ipAddress,
        eventType: entry.eventType,
        details: entry.details ? JSON.stringify(entry.details) : null,
        severity: entry.severity,
        userAgent: entry.userAgent,
        userId: entry.userId,
        timestamp: new Date()
      });

      const severityEmoji = {
        low: '🟡',
        medium: '🟠', 
        high: '🔴',
        critical: '🚨'
      };

      if (process.env.NODE_ENV === 'development') {
        console.log(`${severityEmoji[entry.severity]} Security Log: ${entry.eventType} from ${entry.ipAddress} - ${entry.severity.toUpperCase()}`);
      }
    } catch (error) {
      console.error('Failed to log security entry:', error);
    }
  }

  async getAuditLogs(filters: {
    userId?: number;
    action?: string;
    resource?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }) {
    try {
      let query = db.select().from(auditLogs);
      
      // Apply filters (simplified - in real implementation, use proper where conditions)
      const logs = await query.limit(filters.limit || 100);
      return logs;
    } catch (error) {
      console.error('Failed to get audit logs:', error);
      return [];
    }
  }

  async getSecurityLogs(filters: {
    ipAddress?: string;
    eventType?: string;
    severity?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }) {
    try {
      let query = db.select().from(securityLogs);
      
      // Apply filters (simplified - in real implementation, use proper where conditions)
      const logs = await query.limit(filters.limit || 100);
      return logs;
    } catch (error) {
      console.error('Failed to get security logs:', error);
      return [];
    }
  }
}

export const auditLogger = AuditLogger.getInstance();

// Middleware to automatically log actions
export const auditMiddleware = (action: string, resource: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const originalSend = res.send;
    const originalJson = res.json;

    res.send = function(data) {
      logAction(req, res, action, resource, data);
      return originalSend.call(this, data);
    };

    res.json = function(data) {
      logAction(req, res, action, resource, data);
      return originalJson.call(this, data);
    };

    next();
  };
};

function logAction(req: Request, res: Response, action: string, resource: string, responseData: any) {
  const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
  const userAgent = req.get('User-Agent') || 'unknown';
  const userId = (req as any).user?.id;
  
  const success = res.statusCode >= 200 && res.statusCode < 400;
  let errorMessage;
  
  if (!success && responseData) {
    try {
      const parsed = typeof responseData === 'string' ? JSON.parse(responseData) : responseData;
      errorMessage = parsed.error || parsed.message;
    } catch (e) {
      errorMessage = 'Unknown error';
    }
  }

  auditLogger.logAction({
    userId,
    action,
    resource,
    resourceId: req.params.id,
    details: {
      method: req.method,
      url: req.originalUrl,
      body: req.body,
      query: req.query,
      params: req.params
    },
    ipAddress: clientIP,
    userAgent,
    success,
    errorMessage
  });
}

// Security event logging middleware
export const securityEventLogger = (eventType: SecurityLogEntry['eventType'], severity: SecurityLogEntry['severity'] = 'medium') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
    const userAgent = req.get('User-Agent') || 'unknown';
    const userId = (req as any).user?.id;

    auditLogger.logSecurity({
      ipAddress: clientIP,
      eventType,
      severity,
      userAgent,
      userId,
      details: {
        method: req.method,
        url: req.originalUrl,
        timestamp: new Date().toISOString()
      }
    });

    next();
  };
};

// Middleware for critical operations
export const auditCriticalOperation = (operation: string) => {
  return auditMiddleware(`critical_${operation}`, 'system');
};

// Enhanced logging for authentication events
export const auditAuthEvent = (event: 'login' | 'logout' | 'register' | 'password_change') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const originalSend = res.send;
    const originalJson = res.json;

    res.send = function(data) {
      logAuthEvent(req, res, event, data);
      return originalSend.call(this, data);
    };

    res.json = function(data) {
      logAuthEvent(req, res, event, data);
      return originalJson.call(this, data);
    };

    next();
  };
};

function logAuthEvent(req: Request, res: Response, event: string, responseData: any) {
  const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
  const userAgent = req.get('User-Agent') || 'unknown';
  const success = res.statusCode >= 200 && res.statusCode < 400;
  
  // Log to audit
  auditLogger.logAction({
    userId: (req as any).user?.id || req.body?.userId,
    action: event,
    resource: 'authentication',
    details: {
      email: req.body?.email,
      username: req.body?.username,
      success
    },
    ipAddress: clientIP,
    userAgent,
    success
  });

  // Log security event for failed attempts
  if (!success) {
    auditLogger.logSecurity({
      ipAddress: clientIP,
      eventType: 'failed_login',
      severity: 'medium',
      userAgent,
      details: {
        event,
        attempted_email: req.body?.email,
        attempted_username: req.body?.username
      }
    });
  }
}

export default {
  auditLogger,
  auditMiddleware,
  securityEventLogger,
  auditCriticalOperation,
  auditAuthEvent
};