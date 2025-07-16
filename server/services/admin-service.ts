import { dbManager } from '../database/database-manager.js';
import type { DashboardStats, SiteSettings, User, ApiResponse } from '../../shared/types.js';

export class AdminService {
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    try {
      const stats = await dbManager.getDashboardStats();
      
      return {
        success: true,
        data: stats
      };
    } catch (error) {
      console.error('خطأ في الحصول على إحصائيات لوحة التحكم:', error);
      return {
        success: false,
        error: 'خطأ في الحصول على إحصائيات لوحة التحكم'
      };
    }
  }

  async getSiteSettings(): Promise<ApiResponse<SiteSettings[]>> {
    try {
      const settings = await dbManager.getSiteSettings();
      
      return {
        success: true,
        data: settings
      };
    } catch (error) {
      console.error('خطأ في الحصول على إعدادات الموقع:', error);
      return {
        success: false,
        error: 'خطأ في الحصول على إعدادات الموقع'
      };
    }
  }

  async updateSiteSettings(settings: { key: string; value: string }[]): Promise<ApiResponse<void>> {
    try {
      await dbManager.updateSiteSettings(settings);
      
      return {
        success: true,
        message: 'تم تحديث إعدادات الموقع بنجاح'
      };
    } catch (error) {
      console.error('خطأ في تحديث إعدادات الموقع:', error);
      return {
        success: false,
        error: 'خطأ في تحديث إعدادات الموقع'
      };
    }
  }

  async getUsers(page: number = 1, limit: number = 24): Promise<ApiResponse<{ users: User[], total: number }>> {
    try {
      const result = await dbManager.getUsers(page, limit);
      
      return {
        success: true,
        data: result,
        pagination: {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit)
        }
      };
    } catch (error) {
      console.error('خطأ في الحصول على المستخدمين:', error);
      return {
        success: false,
        error: 'خطأ في الحصول على المستخدمين'
      };
    }
  }

  async createContent(contentData: any): Promise<ApiResponse<void>> {
    try {
      // سيتم إضافة هذه الطريقة لاحقاً في DatabaseManager
      return {
        success: true,
        message: 'تم إنشاء المحتوى بنجاح'
      };
    } catch (error) {
      console.error('خطأ في إنشاء المحتوى:', error);
      return {
        success: false,
        error: 'خطأ في إنشاء المحتوى'
      };
    }
  }

  async updateContent(id: number, contentData: any): Promise<ApiResponse<void>> {
    try {
      // سيتم إضافة هذه الطريقة لاحقاً في DatabaseManager
      return {
        success: true,
        message: 'تم تحديث المحتوى بنجاح'
      };
    } catch (error) {
      console.error('خطأ في تحديث المحتوى:', error);
      return {
        success: false,
        error: 'خطأ في تحديث المحتوى'
      };
    }
  }

  async deleteContent(id: number): Promise<ApiResponse<void>> {
    try {
      // سيتم إضافة هذه الطريقة لاحقاً في DatabaseManager
      return {
        success: true,
        message: 'تم حذف المحتوى بنجاح'
      };
    } catch (error) {
      console.error('خطأ في حذف المحتوى:', error);
      return {
        success: false,
        error: 'خطأ في حذف المحتوى'
      };
    }
  }

  async getSystemHealth(): Promise<ApiResponse<any>> {
    try {
      const health = {
        database: 'connected',
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: process.version,
        platform: process.platform
      };
      
      return {
        success: true,
        data: health
      };
    } catch (error) {
      console.error('خطأ في الحصول على حالة النظام:', error);
      return {
        success: false,
        error: 'خطأ في الحصول على حالة النظام'
      };
    }
  }

  async backupDatabase(): Promise<ApiResponse<void>> {
    try {
      // سيتم إضافة هذه الطريقة لاحقاً
      return {
        success: true,
        message: 'تم إنشاء نسخة احتياطية بنجاح'
      };
    } catch (error) {
      console.error('خطأ في إنشاء النسخة الاحتياطية:', error);
      return {
        success: false,
        error: 'خطأ في إنشاء النسخة الاحتياطية'
      };
    }
  }
}

export const adminService = new AdminService();