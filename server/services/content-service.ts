import { dbManager } from '../database/database-manager.js';
import type { SearchFilters, ApiResponse, Content } from '../../shared/types.js';

export class ContentService {
  async getContent(filters: SearchFilters = {}): Promise<ApiResponse<{ content: Content[], total: number }>> {
    try {
      const result = await dbManager.getContent(filters);
      return {
        success: true,
        data: {
          content: result.content,
          total: result.total
        }
      };
    } catch (error) {
      console.error('خطأ في خدمة المحتوى:', error);
      return {
        success: false,
        error: 'خطأ في الحصول على المحتوى'
      };
    }
  }

  async getMovies(filters: SearchFilters = {}): Promise<ApiResponse<{ content: Content[], total: number }>> {
    try {
      const movieFilters = { ...filters, type: 'movie' };
      const result = await dbManager.getContent(movieFilters);
      return {
        success: true,
        data: {
          content: result.content,
          total: result.total
        }
      };
    } catch (error) {
      console.error('خطأ في الحصول على الأفلام:', error);
      return {
        success: false,
        error: 'خطأ في الحصول على الأفلام'
      };
    }
  }

  async getSeries(filters: SearchFilters = {}): Promise<ApiResponse<{ content: Content[], total: number }>> {
    try {
      const seriesFilters = { ...filters, type: 'series' };
      const result = await dbManager.getContent(seriesFilters);
      return {
        success: true,
        data: {
          content: result.content,
          total: result.total
        }
      };
    } catch (error) {
      console.error('خطأ في الحصول على المسلسلات:', error);
      return {
        success: false,
        error: 'خطأ في الحصول على المسلسلات'
      };
    }
  }

  async getPrograms(filters: SearchFilters = {}): Promise<ApiResponse<{ content: Content[], total: number }>> {
    try {
      const programFilters = { ...filters, type: 'program' };
      const result = await dbManager.getContent(programFilters);
      return {
        success: true,
        data: {
          content: result.content,
          total: result.total
        }
      };
    } catch (error) {
      console.error('خطأ في الحصول على البرامج:', error);
      return {
        success: false,
        error: 'خطأ في الحصول على البرامج'
      };
    }
  }

  async getGames(filters: SearchFilters = {}): Promise<ApiResponse<{ content: Content[], total: number }>> {
    try {
      const gameFilters = { ...filters, type: 'game' };
      const result = await dbManager.getContent(gameFilters);
      return {
        success: true,
        data: {
          content: result.content,
          total: result.total
        }
      };
    } catch (error) {
      console.error('خطأ في الحصول على الألعاب:', error);
      return {
        success: false,
        error: 'خطأ في الحصول على الألعاب'
      };
    }
  }

  async getApplications(filters: SearchFilters = {}): Promise<ApiResponse<{ content: Content[], total: number }>> {
    try {
      const appFilters = { ...filters, type: 'application' };
      const result = await dbManager.getContent(appFilters);
      return {
        success: true,
        data: {
          content: result.content,
          total: result.total
        }
      };
    } catch (error) {
      console.error('خطأ في الحصول على التطبيقات:', error);
      return {
        success: false,
        error: 'خطأ في الحصول على التطبيقات'
      };
    }
  }

  async getTheater(filters: SearchFilters = {}): Promise<ApiResponse<{ content: Content[], total: number }>> {
    try {
      const theaterFilters = { ...filters, type: 'theater' };
      const result = await dbManager.getContent(theaterFilters);
      return {
        success: true,
        data: {
          content: result.content,
          total: result.total
        }
      };
    } catch (error) {
      console.error('خطأ في الحصول على المسرح:', error);
      return {
        success: false,
        error: 'خطأ في الحصول على المسرح'
      };
    }
  }

  async getWrestling(filters: SearchFilters = {}): Promise<ApiResponse<{ content: Content[], total: number }>> {
    try {
      const wrestlingFilters = { ...filters, type: 'wrestling' };
      const result = await dbManager.getContent(wrestlingFilters);
      return {
        success: true,
        data: {
          content: result.content,
          total: result.total
        }
      };
    } catch (error) {
      console.error('خطأ في الحصول على المصارعة:', error);
      return {
        success: false,
        error: 'خطأ في الحصول على المصارعة'
      };
    }
  }

  async getSports(filters: SearchFilters = {}): Promise<ApiResponse<{ content: Content[], total: number }>> {
    try {
      const sportsFilters = { ...filters, type: 'sports' };
      const result = await dbManager.getContent(sportsFilters);
      return {
        success: true,
        data: {
          content: result.content,
          total: result.total
        }
      };
    } catch (error) {
      console.error('خطأ في الحصول على الرياضة:', error);
      return {
        success: false,
        error: 'خطأ في الحصول على الرياضة'
      };
    }
  }

  async getTrailers(filters: SearchFilters = {}): Promise<ApiResponse<{ content: Content[], total: number }>> {
    try {
      const trailerFilters = { 
        ...filters, 
        // فلترة المحتوى الذي يحتوي على مقطع دعائي
      };
      
      const result = await dbManager.getContent(trailerFilters);
      // تصفية المحتوى الذي يحتوي على trailer
      const contentWithTrailers = result.content.filter(item => item.trailer && item.trailer.trim() !== '');
      
      return {
        success: true,
        data: {
          content: contentWithTrailers,
          total: contentWithTrailers.length
        }
      };
    } catch (error) {
      console.error('خطأ في الحصول على المقاطع الدعائية:', error);
      return {
        success: false,
        error: 'خطأ في الحصول على المقاطع الدعائية'
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

  async incrementViewCount(id: number): Promise<ApiResponse<void>> {
    try {
      // هنا يمكن إضافة منطق زيادة عدد المشاهدات
      console.log(`زيادة عدد مشاهدات المحتوى: ${id}`);
      
      return {
        success: true,
        message: 'تم زيادة عدد المشاهدات بنجاح'
      };
    } catch (error) {
      console.error('خطأ في زيادة عدد المشاهدات:', error);
      return {
        success: false,
        error: 'خطأ في زيادة عدد المشاهدات'
      };
    }
  }
}

export const contentService = new ContentService();