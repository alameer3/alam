import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface TrailerInfo {
  id: string;
  contentId: number;
  title: string;
  description: string;
  duration: string;
  url: string;
  thumbnail: string;
  releaseDate: string;
  rating: number;
  viewCount: number;
  cast: string[];
  genre: string[];
  type: 'teaser' | 'trailer' | 'behind-scenes' | 'interview';
}

interface FeaturedTrailer {
  contentId: number;
  title: string;
  description: string;
  trailerUrl: string;
  thumbnailUrl: string;
  rating: number;
  year: number;
  genres: string[];
  duration: string;
}

interface TrendingTrailer {
  title: string;
  trailerUrl: string;
  thumbnailUrl: string;
  duration: string;
}

// Hook لجلب المقاطع الدعائية لمحتوى معين
export function useTrailers(contentId: number) {
  return useQuery<TrailerInfo[]>({
    queryKey: ['/api/trailers', contentId],
    queryFn: () => apiRequest(`/api/trailers/${contentId}`),
    enabled: !!contentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
  });
}

// Hook لجلب المقطع الدعائي المميز للصفحة الرئيسية
export function useFeaturedTrailer() {
  return useQuery<FeaturedTrailer>({
    queryKey: ['/api/trailers/featured/latest'],
    queryFn: () => apiRequest('/api/trailers/featured/latest'),
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 60 * 60 * 1000, // 1 hour
  });
}

// Hook لجلب المقاطع الدعائية الرائجة
export function useTrendingTrailers() {
  return useQuery<TrendingTrailer[]>({
    queryKey: ['/api/trailers/trending/week'],
    queryFn: () => apiRequest('/api/trailers/trending/week'),
    staleTime: 15 * 60 * 1000, // 15 minutes
    cacheTime: 60 * 60 * 1000, // 1 hour
  });
}

// Hook لإضافة مقطع دعائي جديد (للإداريين)
export function useAddTrailer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (trailerData: Omit<TrailerInfo, 'id'>) => 
      apiRequest('/api/trailers', {
        method: 'POST',
        body: trailerData,
      }),
    onSuccess: (newTrailer: TrailerInfo) => {
      // تحديث cache للمقاطع الدعائية للمحتوى المحدد
      queryClient.invalidateQueries({
        queryKey: ['/api/trailers', newTrailer.contentId]
      });
      
      // تحديث cache للمقاطع الرائجة
      queryClient.invalidateQueries({
        queryKey: ['/api/trailers/trending/week']
      });
    },
  });
}

// Hook لتحديث عدد المشاهدات
export function useUpdateTrailerViews() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (trailerId: string) => 
      apiRequest(`/api/trailers/${trailerId}/views`, {
        method: 'PATCH',
      }),
    onSuccess: (_, trailerId) => {
      // تحديث cache للمقاطع الدعائية
      queryClient.invalidateQueries({
        queryKey: ['/api/trailers']
      });
    },
  });
}

// Hook لحذف مقطع دعائي (للإداريين)
export function useDeleteTrailer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (trailerId: string) => 
      apiRequest(`/api/trailers/${trailerId}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      // تحديث جميع المقاطع الدعائية
      queryClient.invalidateQueries({
        queryKey: ['/api/trailers']
      });
    },
  });
}

// Hook مخصص لإدارة تشغيل المقاطع الدعائية
export function useTrailerPlayer() {
  const { mutate: updateViews } = useUpdateTrailerViews();
  
  const playTrailer = (trailerId: string) => {
    // تحديث عدد المشاهدات عند تشغيل المقطع
    updateViews(trailerId);
  };
  
  return {
    playTrailer,
  };
}

// Hook لإحصائيات المقاطع الدعائية
export function useTrailerStats(contentId?: number) {
  return useQuery({
    queryKey: ['/api/trailers/stats', contentId],
    queryFn: async () => {
      const trailers = await apiRequest(
        contentId ? `/api/trailers/${contentId}` : '/api/trailers/all'
      );
      
      const stats = {
        totalTrailers: trailers.length,
        totalViews: trailers.reduce((sum: number, trailer: TrailerInfo) => sum + trailer.viewCount, 0),
        averageRating: trailers.length > 0 
          ? trailers.reduce((sum: number, trailer: TrailerInfo) => sum + trailer.rating, 0) / trailers.length
          : 0,
        typeDistribution: trailers.reduce((acc: Record<string, number>, trailer: TrailerInfo) => {
          acc[trailer.type] = (acc[trailer.type] || 0) + 1;
          return acc;
        }, {}),
      };
      
      return stats;
    },
    enabled: true,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}