import { dbManager } from '../database/database-manager.js';
import type { Content, SearchFilters, ApiResponse } from '../../shared/types.js';

export class ContentService {
  async getContent(filters: SearchFilters = {}): Promise<ApiResponse<{ content: Content[], total: number }>> {
    try {
      console.log('🔍 ContentService.getContent called with filters:', filters);
      const result = await dbManager.getContent(filters);
      
      console.log('📊 ContentService results:', result.content.length, 'items,', result.total, 'total');
      
      // لا نُرجع خطأ إذا لم يكن هناك محتوى - نُرجع مصفوفة فارغة
      return {
        success: true,
        data: result,
        pagination: {
          page: filters.page || 1,
          limit: filters.limit || 24,
          total: result.total,
          totalPages: Math.ceil(result.total / (filters.limit || 24))
        }
      };
    } catch (error) {
      console.error('خطأ في الحصول على المحتوى:', error);
      return {
        success: false,
        error: 'خطأ في الحصول على المحتوى'
      };
    }
  }

  async getContentById(id: number): Promise<ApiResponse<Content>> {
    try {
      const content = await dbManager.getContentById(id);
      
      if (!content) {
        return {
          success: false,
          error: 'المحتوى غير موجود'
        };
      }
      
      return {
        success: true,
        data: content
      };
    } catch (error) {
      console.error('خطأ في الحصول على المحتوى:', error);
      return {
        success: false,
        error: 'خطأ في الحصول على المحتوى'
      };
    }
  }

  async getMovies(filters: SearchFilters = {}): Promise<ApiResponse<{ content: Content[], total: number }>> {
    return this.getContent({ ...filters, type: 'movie' });
  }

  async getSeries(filters: SearchFilters = {}): Promise<ApiResponse<{ content: Content[], total: number }>> {
    return this.getContent({ ...filters, type: 'series' });
  }

  async getPrograms(filters: SearchFilters = {}): Promise<ApiResponse<{ content: Content[], total: number }>> {
    return this.getContent({ ...filters, type: 'program' });
  }

  async getGames(filters: SearchFilters = {}): Promise<ApiResponse<{ content: Content[], total: number }>> {
    return this.getContent({ ...filters, type: 'game' });
  }

  async getApplications(filters: SearchFilters = {}): Promise<ApiResponse<{ content: Content[], total: number }>> {
    return this.getContent({ ...filters, type: 'application' });
  }

  async getTheater(filters: SearchFilters = {}): Promise<ApiResponse<{ content: Content[], total: number }>> {
    return this.getContent({ ...filters, type: 'theater' });
  }

  async getWrestling(filters: SearchFilters = {}): Promise<ApiResponse<{ content: Content[], total: number }>> {
    return this.getContent({ ...filters, type: 'wrestling' });
  }

  async getSports(filters: SearchFilters = {}): Promise<ApiResponse<{ content: Content[], total: number }>> {
    return this.getContent({ ...filters, type: 'sports' });
  }

  async getFeaturedContent(): Promise<ApiResponse<Content[]>> {
    try {
      const result = await dbManager.getContent({ limit: 10, sortBy: 'rating', sortOrder: 'desc' });
      
      return {
        success: true,
        data: result.content
      };
    } catch (error) {
      console.error('خطأ في الحصول على المحتوى المميز:', error);
      return {
        success: false,
        error: 'خطأ في الحصول على المحتوى المميز'
      };
    }
  }

  async getTrendingContent(): Promise<ApiResponse<Content[]>> {
    try {
      const result = await dbManager.getContent({ limit: 10, sortBy: 'view_count', sortOrder: 'desc' });
      
      return {
        success: true,
        data: result.content
      };
    } catch (error) {
      console.error('خطأ في الحصول على المحتوى الرائج:', error);
      return {
        success: false,
        error: 'خطأ في الحصول على المحتوى الرائج'
      };
    }
  }

  async getRecentContent(filters: SearchFilters = {}): Promise<ApiResponse<{ content: Content[], total: number }>> {
    return this.getContent({ 
      ...filters, 
      sortBy: 'created_at', 
      sortOrder: 'desc' 
    });
  }

  async searchContent(query: string, filters: SearchFilters = {}): Promise<ApiResponse<{ content: Content[], total: number }>> {
    return this.getContent({ 
      ...filters, 
      query 
    });
  }

  async incrementViewCount(id: number): Promise<ApiResponse<void>> {
    try {
      // سيتم إضافة هذه الطريقة لاحقاً في DatabaseManager
      return {
        success: true
      };
    } catch (error) {
      console.error('خطأ في تحديث عدد المشاهدات:', error);
      return {
        success: false,
        error: 'خطأ في تحديث عدد المشاهدات'
      };
    }
  }
}

export const contentService = new ContentService();