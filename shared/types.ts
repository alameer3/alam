// أنواع البيانات المشتركة بين الواجهة والخادم
export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  role: 'admin' | 'user' | 'moderator';
  isActive: boolean;
  lastLogin?: string;
  joinDate: string;
  preferences?: {
    language: string;
    theme: 'light' | 'dark';
    notifications: boolean;
  };
}

export interface Content {
  id: number;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  type: 'movie' | 'series' | 'program' | 'game' | 'application' | 'theater' | 'wrestling' | 'sports';
  poster: string;
  backdrop?: string;
  trailer?: string;
  releaseDate: string;
  rating: number;
  ratingCount: number;
  duration?: number; // بالدقائق
  language: string;
  country: string;
  quality: string;
  status: 'completed' | 'ongoing' | 'cancelled';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  downloadCount: number;
  // العلاقات
  categories: number[];
  genres: number[];
  cast: number[];
  crew: number[];
  episodes?: Episode[];
  downloadLinks?: DownloadLink[];
  streamingLinks?: StreamingLink[];
}

export interface Episode {
  id: number;
  contentId: number;
  title: string;
  titleAr: string;
  description?: string;
  episodeNumber: number;
  seasonNumber: number;
  duration: number;
  releaseDate: string;
  thumbnail?: string;
  isActive: boolean;
  downloadLinks?: DownloadLink[];
  streamingLinks?: StreamingLink[];
}

export interface Category {
  id: number;
  name: string;
  nameAr: string;
  description?: string;
  icon?: string;
  isActive: boolean;
  order: number;
}

export interface Genre {
  id: number;
  name: string;
  nameAr: string;
  description?: string;
  color?: string;
  isActive: boolean;
}

export interface Person {
  id: number;
  name: string;
  nameAr: string;
  biography?: string;
  photo?: string;
  birthDate?: string;
  birthPlace?: string;
  roles: ('actor' | 'director' | 'writer' | 'producer')[];
  isActive: boolean;
}

export interface Review {
  id: number;
  userId: number;
  contentId: number;
  rating: number;
  comment?: string;
  isRecommended: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  likes: number;
  dislikes: number;
}

export interface Comment {
  id: number;
  userId: number;
  contentId: number;
  parentId?: number; // للردود
  text: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  likes: number;
  dislikes: number;
}

export interface DownloadLink {
  id: number;
  contentId: number;
  episodeId?: number;
  quality: string;
  size: string;
  url: string;
  server: string;
  isActive: boolean;
  downloadCount: number;
  createdAt: string;
}

export interface StreamingLink {
  id: number;
  contentId: number;
  episodeId?: number;
  quality: string;
  url: string;
  server: string;
  isActive: boolean;
  viewCount: number;
  createdAt: string;
}

export interface UserInteraction {
  id: number;
  userId: number;
  contentId: number;
  type: 'favorite' | 'watchlist' | 'watched' | 'rating' | 'like' | 'dislike';
  value?: number; // للتقييم
  createdAt: string;
  updatedAt: string;
}

export interface WatchHistory {
  id: number;
  userId: number;
  contentId: number;
  episodeId?: number;
  progress: number; // بالثواني
  watchedAt: string;
  isCompleted: boolean;
}

export interface SiteSettings {
  id: number;
  key: string;
  value: string;
  type: 'string' | 'number' | 'boolean' | 'json';
  category: 'general' | 'appearance' | 'social' | 'advanced';
  description?: string;
  isActive: boolean;
  updatedAt: string;
}

export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
  expiresAt?: string;
}

export interface Advertisement {
  id: number;
  title: string;
  description?: string;
  image?: string;
  url?: string;
  position: 'header' | 'sidebar' | 'footer' | 'content' | 'popup';
  isActive: boolean;
  startDate: string;
  endDate?: string;
  clickCount: number;
  viewCount: number;
  createdAt: string;
}

export interface Subscription {
  id: number;
  userId: number;
  plan: 'free' | 'premium' | 'vip';
  startDate: string;
  endDate?: string;
  isActive: boolean;
  features: string[];
  price?: number;
  paymentMethod?: string;
  renewalDate?: string;
}

export interface ActivityLog {
  id: number;
  userId?: number;
  action: string;
  target: string;
  targetId?: number;
  ip?: string;
  userAgent?: string;
  createdAt: string;
  details?: any;
}

export interface Report {
  id: number;
  userId: number;
  contentId?: number;
  commentId?: number;
  reviewId?: number;
  reason: string;
  description?: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: number;
}

// أنواع API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SearchFilters {
  query?: string;
  type?: string;
  category?: string;
  genre?: string;
  year?: string;
  rating?: string;
  quality?: string;
  language?: string;
  country?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  featured?: boolean;
  trending?: boolean;
}

export interface DashboardStats {
  totalContent: number;
  totalUsers: number;
  totalViews: number;
  totalDownloads: number;
  totalReviews: number;
  totalComments: number;
  activeUsers: number;
  recentContent: Content[];
  topRated: Content[];
  mostViewed: Content[];
  recentUsers: User[];
  systemHealth: {
    status: 'healthy' | 'warning' | 'critical';
    uptime: number;
    diskUsage: number;
    memoryUsage: number;
  };
}