import { useQuery } from "@tanstack/react-query";

export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  isAdmin: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export function useAuth() {
  // For demonstration purposes, we'll use a mock user
  // In production, this would fetch from your authentication API
  const mockUser: User = {
    id: 1,
    username: "test_user",
    email: "test@example.com",
    firstName: "محمد",
    lastName: "أحمد",
    profileImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    isAdmin: false,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    queryFn: async () => {
      // Return mock user for demonstration
      return mockUser;
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    user: user as User | undefined,
    isLoading,
    isAuthenticated: !!user,
    error,
  };
}

export function useUserStats(userId?: number) {
  return useQuery({
    queryKey: ["/api/user/stats", userId],
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}