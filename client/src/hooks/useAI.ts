import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface RecommendationItem {
  id: number;
  title: string;
  type: string;
  rating: number;
  year: number;
  poster?: string;
  description?: string;
  recommendationScore: number;
  recommendationReasons: string[];
}

interface RecommendationResponse {
  recommendations: RecommendationItem[];
  userId: number;
  generatedAt: string;
}

interface SearchResult {
  id: number;
  title: string;
  type: string;
  rating: number;
  year: number;
  poster?: string;
  description?: string;
}

interface SmartSearchResponse {
  query: string;
  type?: string;
  results: SearchResult[];
  totalFound: number;
  searchedAt: string;
}

interface SentimentAnalysis {
  rating: number;
  confidence: number;
  emotions: string[];
  keywords: string[];
}

interface UserPreferences {
  userId: number;
  insights: {
    favoriteGenres: string[];
    favoriteCategories: string[];
    averageRating: number;
    typePreferences: Record<string, number>;
    totalFavorites: number;
    totalWatched: number;
  };
  generatedAt: string;
}

interface ContentCategorization {
  contentId: number;
  content: {
    id: number;
    title: string;
    type: string;
  };
  categorization: {
    suggestedGenres: string[];
    suggestedCategories: string[];
    contentTags: string[];
    ageRating: string;
  };
  analyzedAt: string;
}

export function useRecommendations(userId: number | undefined, enabled: boolean = true) {
  return useQuery<RecommendationResponse>({
    queryKey: [`/api/ai/recommendations/${userId}`],
    enabled: enabled && !!userId,
    staleTime: 30 * 60 * 1000, // 30 minutes
    refetchInterval: 30 * 60 * 1000, // Auto-refresh every 30 minutes
  });
}

export function useSmartSearch() {
  const queryClient = useQueryClient();
  
  return useMutation<SmartSearchResponse, Error, { query: string; type?: string; limit?: number }>({
    mutationFn: async (searchData) => {
      return await apiRequest<SmartSearchResponse>("/api/ai/search", {
        method: "POST",
        body: JSON.stringify(searchData),
      });
    },
    onSuccess: (data) => {
      // Cache the search results
      queryClient.setQueryData(
        [`/api/ai/search`, data.query, data.type], 
        data
      );
    },
  });
}

export function useSentimentAnalysis() {
  return useMutation<SentimentAnalysis, Error, { text: string }>({
    mutationFn: async (data) => {
      return await apiRequest<SentimentAnalysis>("/api/ai/sentiment", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
  });
}

export function useUserPreferences(userId: number | undefined) {
  return useQuery<UserPreferences>({
    queryKey: [`/api/ai/preferences/${userId}`],
    enabled: !!userId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useContentCategorization() {
  return useMutation<ContentCategorization, Error, { contentId: number }>({
    mutationFn: async (data) => {
      return await apiRequest<ContentCategorization>(`/api/ai/categorize/${data.contentId}`, {
        method: "POST",
      });
    },
  });
}

export function useBatchAnalysis() {
  return useMutation<{ analyses: ContentCategorization[] }, Error, { contentIds: number[] }>({
    mutationFn: async (data) => {
      return await apiRequest<{ analyses: ContentCategorization[] }>("/api/ai/analyze-batch", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
  });
}

// Hook for getting cached search results
export function useSearchResults(query: string, type?: string) {
  return useQuery<SmartSearchResponse>({
    queryKey: [`/api/ai/search`, query, type],
    enabled: false, // Only used for caching
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}