/**
 * نظام التسجيل المحسن للتطبيق
 * يوفر logging منظم ومرن للبيئات المختلفة
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private logs: LogEntry[] = [];
  private maxLogs = 100;

  private formatTimestamp(): string {
    return new Date().toISOString();
  }

  private createLogEntry(level: LogLevel, message: string, context?: Record<string, any>): LogEntry {
    return {
      level,
      message,
      timestamp: this.formatTimestamp(),
      context
    };
  }

  private addToHistory(entry: LogEntry): void {
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
  }

  info(message: string, context?: Record<string, any>): void {
    const entry = this.createLogEntry('info', message, context);
    this.addToHistory(entry);
    
    if (this.isDevelopment) {
      console.log(`[INFO] ${message}`, context || '');
    }
  }

  warn(message: string, context?: Record<string, any>): void {
    const entry = this.createLogEntry('warn', message, context);
    this.addToHistory(entry);
    
    if (this.isDevelopment) {
      console.warn(`[WARN] ${message}`, context || '');
    }
  }

  error(message: string, context?: Record<string, any>): void {
    const entry = this.createLogEntry('error', message, context);
    this.addToHistory(entry);
    
    // فقط في بيئة التطوير
    if (this.isDevelopment) {
      console.error(`[ERROR] ${message}`, context || '');
    }
    
    // في الإنتاج، أرسل للخادم بدلاً من console
    if (!this.isDevelopment && typeof window !== 'undefined') {
      this.sendErrorToServer(entry);
    }
  }

  private sendErrorToServer(entry: LogEntry): void {
    // أرسل الخطأ للخادم بدون كشف تفاصيل حساسة
    fetch('/api/logs/error', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: entry.message,
        timestamp: entry.timestamp,
        // لا نرسل السياق الكامل في الإنتاج
        level: entry.level
      })
    }).catch(() => {
      // فشل في الإرسال - لا نفعل شيء لتجنب loops
    });
  }

  debug(message: string, context?: Record<string, any>): void {
    const entry = this.createLogEntry('debug', message, context);
    this.addToHistory(entry);
    
    if (this.isDevelopment) {
      console.debug(`[DEBUG] ${message}`, context || '');
    }
  }

  // الحصول على سجل الأخطاء للتحليل
  getErrorLogs(): LogEntry[] {
    return this.logs.filter(log => log.level === 'error');
  }

  // تنظيف السجل
  clearLogs(): void {
    this.logs = [];
  }

  // تصدير السجل
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

export const logger = new Logger();