import { QueryClient } from '@tanstack/react-query';

// Default fetcher function
const defaultFetcher = async (url: string, options?: RequestInit) => {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

// API request function for mutations
export const apiRequest = async (url: string, options?: RequestInit) => {
  return defaultFetcher(url, options);
};

// Create query client with default options
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: ({ queryKey }) => {
        const [url] = queryKey as [string, ...any[]];
        return defaultFetcher(url);
      },
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});