// مخططات البيانات للتحقق والتصدير
import { z } from 'zod';

// إعادة تصدير الأنواع من types.ts
export * from './types';

// مخططات التحقق من البيانات باستخدام Zod
export const userSchema = z.object({
  id: z.number(),
  username: z.string().min(3).max(50),
  email: z.string().email(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  avatar: z.string().optional(),
  role: z.enum(['admin', 'user', 'moderator']),
  isActive: z.boolean(),
  lastLogin: z.string().optional(),
  joinDate: z.string(),
  preferences: z.object({
    language: z.string(),
    theme: z.enum(['light', 'dark']),
    notifications: z.boolean(),
  }).optional(),
});

export const contentSchema = z.object({
  id: z.number(),
  title: z.string().min(1),
  titleAr: z.string().min(1),
  description: z.string(),
  descriptionAr: z.string(),
  type: z.enum(['movie', 'series', 'program', 'game', 'application', 'theater', 'wrestling', 'sports']),
  poster: z.string(),
  backdrop: z.string().optional(),
  trailer: z.string().optional(),
  releaseDate: z.string(),
  rating: z.number().min(0).max(5),
  ratingCount: z.number().min(0),
  duration: z.number().optional(),
  language: z.string(),
  country: z.string(),
  quality: z.string(),
  status: z.enum(['completed', 'ongoing', 'cancelled']),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  viewCount: z.number().min(0),
  downloadCount: z.number().min(0),
  categories: z.array(z.number()),
  genres: z.array(z.number()),
  cast: z.array(z.number()),
  crew: z.array(z.number()),
});

export const insertContentSchema = contentSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  viewCount: true,
  downloadCount: true,
  ratingCount: true,
});

export const categorySchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  nameAr: z.string().min(1),
  description: z.string().optional(),
  icon: z.string().optional(),
  isActive: z.boolean(),
  order: z.number(),
});

export const insertCategorySchema = categorySchema.omit({ id: true });

export const genreSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  nameAr: z.string().min(1),
  description: z.string().optional(),
  color: z.string().optional(),
  isActive: z.boolean(),
});

export const insertGenreSchema = genreSchema.omit({ id: true });

export const episodeSchema = z.object({
  id: z.number(),
  contentId: z.number(),
  title: z.string().min(1),
  titleAr: z.string().min(1),
  description: z.string().optional(),
  episodeNumber: z.number().min(1),
  seasonNumber: z.number().min(1),
  duration: z.number().min(0),
  releaseDate: z.string(),
  thumbnail: z.string().optional(),
  isActive: z.boolean(),
});

export const insertEpisodeSchema = episodeSchema.omit({ id: true });

// أنواع TypeScript مشتقة من المخططات
export type InsertContent = z.infer<typeof insertContentSchema>;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type InsertGenre = z.infer<typeof insertGenreSchema>;
export type InsertEpisode = z.infer<typeof insertEpisodeSchema>;