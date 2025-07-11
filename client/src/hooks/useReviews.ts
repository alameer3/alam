import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { UserReview, InsertUserReview } from '@shared/schema';

export function useContentReviews(contentId: number) {
  return useQuery({
    queryKey: ['/api/content', contentId, 'reviews'],
    queryFn: async () => {
      const response = await apiRequest(`/api/content/${contentId}/reviews`);
      return response as UserReview[];
    }
  });
}

export function useUserReviewForContent(userId: number, contentId: number) {
  return useQuery({
    queryKey: ['/api/users', userId, 'reviews', 'content', contentId],
    queryFn: async () => {
      try {
        const response = await apiRequest(`/api/users/${userId}/reviews/content/${contentId}`);
        return response as UserReview;
      } catch (error) {
        return null;
      }
    },
    enabled: !!userId
  });
}

export function useAddReview(contentId: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (reviewData: InsertUserReview) => {
      return apiRequest(`/api/content/${contentId}/reviews`, {
        method: 'POST',
        body: reviewData
      });
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/content', contentId, 'reviews'] });
      queryClient.invalidateQueries({ 
        queryKey: ['/api/users', variables.userId, 'reviews', 'content', contentId] 
      });
    }
  });
}

export function useUpdateReview(userId: number, contentId: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ reviewId, reviewData }: { reviewId: number; reviewData: Partial<InsertUserReview> }) => {
      return apiRequest(`/api/reviews/${reviewId}`, {
        method: 'PUT',
        body: { ...reviewData, userId }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/content', contentId, 'reviews'] });
      queryClient.invalidateQueries({ 
        queryKey: ['/api/users', userId, 'reviews', 'content', contentId] 
      });
    }
  });
}

export function useDeleteReview(userId: number, contentId: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (reviewId: number) => {
      return apiRequest(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
        body: { userId }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/content', contentId, 'reviews'] });
      queryClient.invalidateQueries({ 
        queryKey: ['/api/users', userId, 'reviews', 'content', contentId] 
      });
    }
  });
}

export function useLikeReview(contentId: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ reviewId, userId, isLike }: { reviewId: number; userId: number; isLike: boolean }) => {
      return apiRequest(`/api/reviews/${reviewId}/like`, {
        method: 'POST',
        body: { userId, isLike }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/content', contentId, 'reviews'] });
    }
  });
}