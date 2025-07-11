import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function useFavorites(userId?: number) {
  return useQuery({
    queryKey: ["/api/users", userId, "favorites"],
    enabled: !!userId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

export function useWatchHistory(userId?: number) {
  return useQuery({
    queryKey: ["/api/users", userId, "watch-history"],
    enabled: !!userId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

export function useAddToFavorites(userId?: number) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (contentId: number) => {
      if (!userId) throw new Error("User ID is required");
      return await apiRequest(`/api/users/${userId}/favorites`, {
        method: "POST",
        body: { contentId },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", userId, "favorites"] });
      toast({
        title: "تمت الإضافة",
        description: "تم إضافة المحتوى إلى المفضلة بنجاح",
      });
    },
    onError: (error) => {
      toast({
        title: "خطأ",
        description: "فشل في إضافة المحتوى إلى المفضلة",
        variant: "destructive",
      });
    },
  });
}

export function useRemoveFromFavorites(userId?: number) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (contentId: number) => {
      if (!userId) throw new Error("User ID is required");
      return await apiRequest(`/api/users/${userId}/favorites/${contentId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", userId, "favorites"] });
      toast({
        title: "تم الحذف",
        description: "تم حذف المحتوى من المفضلة بنجاح",
      });
    },
    onError: (error) => {
      toast({
        title: "خطأ",
        description: "فشل في حذف المحتوى من المفضلة",
        variant: "destructive",
      });
    },
  });
}

export function useAddToWatchHistory(userId?: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ contentId, progressMinutes }: { contentId: number; progressMinutes?: number }) => {
      if (!userId) throw new Error("User ID is required");
      return await apiRequest(`/api/users/${userId}/watch-history`, {
        method: "POST",
        body: { contentId, progressMinutes },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", userId, "watch-history"] });
    },
  });
}

export function useContentComments(contentId?: number) {
  return useQuery({
    queryKey: ["/api/content", contentId, "comments"],
    enabled: !!contentId,
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useAddComment(contentId?: number) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (commentData: { userId: number; comment: string; parentId?: number }) => {
      if (!contentId) throw new Error("Content ID is required");
      return await apiRequest(`/api/content/${contentId}/comments`, {
        method: "POST",
        body: commentData,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content", contentId, "comments"] });
      toast({
        title: "تم إضافة التعليق",
        description: "تم إضافة تعليقك بنجاح",
      });
    },
    onError: (error) => {
      toast({
        title: "خطأ",
        description: "فشل في إضافة التعليق",
        variant: "destructive",
      });
    },
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ commentId, userId }: { commentId: number; userId: number }) => {
      return await apiRequest(`/api/comments/${commentId}`, {
        method: "DELETE",
        body: { userId },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      toast({
        title: "تم حذف التعليق",
        description: "تم حذف التعليق بنجاح",
      });
    },
    onError: (error) => {
      toast({
        title: "خطأ",
        description: "فشل في حذف التعليق",
        variant: "destructive",
      });
    },
  });
}

export function useIncrementViewCount() {
  return useMutation({
    mutationFn: async (contentId: number) => {
      return await apiRequest(`/api/content/${contentId}/view`, {
        method: "POST",
      });
    },
  });
}