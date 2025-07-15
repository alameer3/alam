import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImageUrl: text("profile_image_url"),
  isAdmin: boolean("is_admin").default(false).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  favorites: integer("favorites").array().default([]),
  watchHistory: integer("watch_history").array().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameArabic: text("name_arabic").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const genres = pgTable("genres", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameArabic: text("name_arabic").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const content = pgTable("content", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  titleArabic: text("title_arabic").notNull(),
  description: text("description"),
  descriptionArabic: text("description_arabic"),
  type: text("type").notNull(), // movie, series, tv, misc
  year: integer("year").notNull(),
  language: text("language").notNull(),
  quality: text("quality").notNull(),
  resolution: text("resolution").notNull(),
  rating: decimal("rating", { precision: 3, scale: 1 }).default("0.0"),
  duration: integer("duration"), // in minutes
  episodes: integer("episodes"), // for series
  posterUrl: text("poster_url"),
  videoUrl: text("video_url"),
  downloadUrl: text("download_url"),
  // تطوير المحتوى الجديد
  trailerUrl: text("trailer_url"), // رابط المقطع الدعائي
  imdbId: text("imdb_id"), // معرف IMDb
  tmdbId: text("tmdb_id"), // معرف The Movie Database
  rottenTomatoesScore: integer("rotten_tomatoes_score"), // تقييم الطماطم المتعفنة
  metacriticScore: integer("metacritic_score"), // تقييم Metacritic
  country: text("country"), // بلد الإنتاج
  budget: text("budget"), // الميزانية
  boxOffice: text("box_office"), // إيرادات شباك التذاكر
  awards: text("awards"), // الجوائز
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const contentGenres = pgTable("content_genres", {
  id: serial("id").primaryKey(),
  contentId: integer("content_id").notNull(),
  genreId: integer("genre_id").notNull(),
});

export const contentCategories = pgTable("content_categories", {
  id: serial("id").primaryKey(),
  contentId: integer("content_id").notNull(),
  categoryId: integer("category_id").notNull(),
});

export const userRatings = pgTable("user_ratings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  contentId: integer("content_id").notNull(),
  rating: integer("rating").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userComments = pgTable("user_comments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  contentId: integer("content_id").notNull(),
  comment: text("comment").notNull(),
  parentId: integer("parent_id"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const userReviews = pgTable("user_reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  contentId: integer("content_id").notNull(),
  rating: integer("rating").notNull(), // 1-5 stars
  title: text("title").notNull(),
  review: text("review").notNull(),
  likes: integer("likes").default(0).notNull(),
  dislikes: integer("dislikes").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const reviewLikes = pgTable("review_likes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  reviewId: integer("review_id").notNull(),
  isLike: boolean("is_like").notNull(), // true for like, false for dislike
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// نظام الحلقات للمسلسلات والمحتوى التلفزيوني
export const episodes = pgTable("episodes", {
  id: serial("id").primaryKey(),
  contentId: integer("content_id").notNull(),
  episodeNumber: integer("episode_number").notNull(),
  seasonNumber: integer("season_number").default(1).notNull(),
  title: text("title").notNull(),
  titleArabic: text("title_arabic"),
  description: text("description"),
  descriptionArabic: text("description_arabic"),
  duration: integer("duration"), // مدة الحلقة بالدقائق
  quality: text("quality").notNull(),
  resolution: text("resolution").notNull(),
  language: text("language").notNull(),
  subtitle: text("subtitle"), // الترجمة المتوفرة
  videoUrl: text("video_url"),
  downloadUrl: text("download_url"),
  thumbnailUrl: text("thumbnail_url"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// نظام التبليغ عن الأخطاء
export const errorReports = pgTable("error_reports", {
  id: serial("id").primaryKey(),
  contentId: integer("content_id"),
  episodeId: integer("episode_id"),
  reporterEmail: text("reporter_email"),
  errorType: text("error_type").notNull(), // "download_link", "streaming_link", "subtitle_issue", "audio_video_issue", "content_issue", "quality_request", "other"
  description: text("description").notNull(),
  pageUrl: text("page_url").notNull(),
  status: text("status").default("pending").notNull(), // "pending", "in_progress", "resolved", "rejected"
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// نظام تصنيف الأعمار
export const ageRatings = pgTable("age_ratings", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(), // "G", "PG", "PG13", "R", "NC17"
  name: text("name").notNull(),
  nameArabic: text("name_arabic").notNull(),
  description: text("description"),
  descriptionArabic: text("description_arabic"),
  minAge: integer("min_age"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// إضافة تصنيف الأعمار للمحتوى
export const contentAgeRatings = pgTable("content_age_ratings", {
  id: serial("id").primaryKey(),
  contentId: integer("content_id").notNull(),
  ageRatingId: integer("age_rating_id").notNull(),
});

// جداول نظام الاشتراكات والتحليلات المتقدمة
export const subscriptionPlans = pgTable("subscription_plans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameArabic: text("name_arabic").notNull(),
  description: text("description"),
  descriptionArabic: text("description_arabic"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default("USD").notNull(),
  duration: integer("duration").notNull(), // in days
  features: text("features").array().default([]),
  featuresArabic: text("features_arabic").array().default([]),
  maxStreams: integer("max_streams").default(1).notNull(),
  maxDownloads: integer("max_downloads").default(0).notNull(),
  hasHDAccess: boolean("has_hd_access").default(false).notNull(),
  has4KAccess: boolean("has_4k_access").default(false).notNull(),
  hasOfflineAccess: boolean("has_offline_access").default(false).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const userSubscriptions = pgTable("user_subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  planId: integer("plan_id").notNull(),
  status: text("status").notNull(), // active, canceled, expired, pending
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  autoRenew: boolean("auto_renew").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const userAnalytics = pgTable("user_analytics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  sessionId: text("session_id").notNull(),
  contentId: integer("content_id"),
  action: text("action").notNull(), // view, play, pause, stop, complete, skip, search, filter
  platform: text("platform"), // web, mobile, desktop
  deviceType: text("device_type"), // phone, tablet, desktop
  browser: text("browser"),
  ipAddress: text("ip_address"),
  location: text("location"),
  watchDuration: integer("watch_duration").default(0), // in seconds
  quality: text("quality"), // 480p, 720p, 1080p, 4K
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  metadata: text("metadata"), // JSON string for additional data
});

export const contentAnalytics = pgTable("content_analytics", {
  id: serial("id").primaryKey(),
  contentId: integer("content_id").notNull(),
  date: timestamp("date").notNull(),
  views: integer("views").default(0).notNull(),
  uniqueViews: integer("unique_views").default(0).notNull(),
  totalWatchTime: integer("total_watch_time").default(0).notNull(), // in seconds
  completionRate: decimal("completion_rate", { precision: 5, scale: 2 }).default("0.00").notNull(),
  avgRating: decimal("avg_rating", { precision: 3, scale: 1 }).default("0.0").notNull(),
  shares: integer("shares").default(0).notNull(),
  downloads: integer("downloads").default(0).notNull(),
  comments: integer("comments").default(0).notNull(),
  likes: integer("likes").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const systemAnalytics = pgTable("system_analytics", {
  id: serial("id").primaryKey(),
  date: timestamp("date").notNull(),
  totalUsers: integer("total_users").default(0).notNull(),
  activeUsers: integer("active_users").default(0).notNull(),
  newUsers: integer("new_users").default(0).notNull(),
  totalContent: integer("total_content").default(0).notNull(),
  totalViews: integer("total_views").default(0).notNull(),
  totalWatchTime: integer("total_watch_time").default(0).notNull(),
  subscriptionRevenue: decimal("subscription_revenue", { precision: 10, scale: 2 }).default("0.00").notNull(),
  activeSubscriptions: integer("active_subscriptions").default(0).notNull(),
  churnRate: decimal("churn_rate", { precision: 5, scale: 2 }).default("0.00").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userFavorites = pgTable("user_favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  contentId: integer("content_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userWatchHistory = pgTable("user_watch_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  contentId: integer("content_id").notNull(),
  watchedAt: timestamp("watched_at").defaultNow().notNull(),
  progressMinutes: integer("progress_minutes").default(0),
});



export const contentViews = pgTable("content_views", {
  id: serial("id").primaryKey(),
  contentId: integer("content_id").notNull(),
  viewCount: integer("view_count").default(0).notNull(),
  lastViewedAt: timestamp("last_viewed_at").defaultNow().notNull(),
});

// جدول فريق العمل
export const castMembers = pgTable("cast_members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameArabic: text("name_arabic"),
  role: text("role").notNull(), // actor, director, writer, producer, etc.
  biography: text("biography"),
  birthDate: text("birth_date"),
  nationality: text("nationality"),
  imageUrl: text("image_url"),
  imdbId: text("imdb_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// جدول ربط المحتوى بفريق العمل
export const contentCast = pgTable("content_cast", {
  id: serial("id").primaryKey(),
  contentId: integer("content_id").notNull(),
  castMemberId: integer("cast_member_id").notNull(),
  character: text("character"), // الشخصية التي يلعبها في هذا المحتوى
  order: integer("order").default(0), // ترتيب الظهور
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// جدول الصور الإضافية
export const contentImages = pgTable("content_images", {
  id: serial("id").primaryKey(),
  contentId: integer("content_id").notNull(),
  imageUrl: text("image_url").notNull(),
  type: text("type").notNull(), // poster, backdrop, still, behind_scenes
  description: text("description"),
  descriptionArabic: text("description_arabic"),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// جدول التقييمات الخارجية
export const externalRatings = pgTable("external_ratings", {
  id: serial("id").primaryKey(),
  contentId: integer("content_id").notNull(),
  source: text("source").notNull(), // imdb, rotten_tomatoes, metacritic, etc.
  rating: text("rating").notNull(),
  maxRating: text("max_rating"),
  url: text("url"),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
});

// Relations
export const contentRelations = relations(content, ({ many, one }) => ({
  contentGenres: many(contentGenres),
  contentCategories: many(contentCategories),
  userRatings: many(userRatings),
  comments: many(userComments),
  reviews: many(userReviews),
  cast: many(contentCast),
  images: many(contentImages),
  externalRatings: many(externalRatings),
  favorites: many(userFavorites),
  watchHistory: many(userWatchHistory),
  episodes: many(episodes),
  errorReports: many(errorReports),
  contentAgeRatings: many(contentAgeRatings),
  views: one(contentViews, {
    fields: [content.id],
    references: [contentViews.contentId],
  }),
}));

export const genreRelations = relations(genres, ({ many }) => ({
  contentGenres: many(contentGenres),
}));

export const categoryRelations = relations(categories, ({ many }) => ({
  contentCategories: many(contentCategories),
}));

export const contentGenreRelations = relations(contentGenres, ({ one }) => ({
  content: one(content, {
    fields: [contentGenres.contentId],
    references: [content.id],
  }),
  genre: one(genres, {
    fields: [contentGenres.genreId],
    references: [genres.id],
  }),
}));

export const contentCategoryRelations = relations(contentCategories, ({ one }) => ({
  content: one(content, {
    fields: [contentCategories.contentId],
    references: [content.id],
  }),
  category: one(categories, {
    fields: [contentCategories.categoryId],
    references: [categories.id],
  }),
}));

export const userRatingRelations = relations(userRatings, ({ one }) => ({
  user: one(users, {
    fields: [userRatings.userId],
    references: [users.id],
  }),
  content: one(content, {
    fields: [userRatings.contentId],
    references: [content.id],
  }),
}));

export const userRelations = relations(users, ({ many }) => ({
  ratings: many(userRatings),
  comments: many(userComments),
  reviews: many(userReviews),
  reviewLikes: many(reviewLikes),
  favorites: many(userFavorites),
  watchHistory: many(userWatchHistory),
}));

export const userCommentRelations = relations(userComments, ({ one, many }) => ({
  user: one(users, {
    fields: [userComments.userId],
    references: [users.id],
  }),
  content: one(content, {
    fields: [userComments.contentId],
    references: [content.id],
  }),
  parent: one(userComments, {
    fields: [userComments.parentId],
    references: [userComments.id],
  }),
  replies: many(userComments),
}));

export const userFavoriteRelations = relations(userFavorites, ({ one }) => ({
  user: one(users, {
    fields: [userFavorites.userId],
    references: [users.id],
  }),
  content: one(content, {
    fields: [userFavorites.contentId],
    references: [content.id],
  }),
}));

export const userWatchHistoryRelations = relations(userWatchHistory, ({ one }) => ({
  user: one(users, {
    fields: [userWatchHistory.userId],
    references: [users.id],
  }),
  content: one(content, {
    fields: [userWatchHistory.contentId],
    references: [content.id],
  }),
}));

export const contentViewRelations = relations(contentViews, ({ one }) => ({
  content: one(content, {
    fields: [contentViews.contentId],
    references: [content.id],
  }),
}));

export const userReviewRelations = relations(userReviews, ({ one, many }) => ({
  user: one(users, {
    fields: [userReviews.userId],
    references: [users.id],
  }),
  content: one(content, {
    fields: [userReviews.contentId],
    references: [content.id],
  }),
  reviewLikes: many(reviewLikes),
}));

export const reviewLikeRelations = relations(reviewLikes, ({ one }) => ({
  user: one(users, {
    fields: [reviewLikes.userId],
    references: [users.id],
  }),
  review: one(userReviews, {
    fields: [reviewLikes.reviewId],
    references: [userReviews.id],
  }),
}));

// العلاقات الجديدة
export const episodeRelations = relations(episodes, ({ one }) => ({
  content: one(content, {
    fields: [episodes.contentId],
    references: [content.id],
  }),
}));

export const errorReportRelations = relations(errorReports, ({ one }) => ({
  content: one(content, {
    fields: [errorReports.contentId],
    references: [content.id],
  }),
  episode: one(episodes, {
    fields: [errorReports.episodeId],
    references: [episodes.id],
  }),
}));

export const ageRatingRelations = relations(ageRatings, ({ many }) => ({
  contentAgeRatings: many(contentAgeRatings),
}));

export const contentAgeRatingRelations = relations(contentAgeRatings, ({ one }) => ({
  content: one(content, {
    fields: [contentAgeRatings.contentId],
    references: [content.id],
  }),
  ageRating: one(ageRatings, {
    fields: [contentAgeRatings.ageRatingId],
    references: [ageRatings.id],
  }),
}));

export const castMemberRelations = relations(castMembers, ({ many }) => ({
  contentCast: many(contentCast),
}));

export const contentCastRelations = relations(contentCast, ({ one }) => ({
  content: one(content, {
    fields: [contentCast.contentId],
    references: [content.id],
  }),
  castMember: one(castMembers, {
    fields: [contentCast.castMemberId],
    references: [castMembers.id],
  }),
}));

export const contentImageRelations = relations(contentImages, ({ one }) => ({
  content: one(content, {
    fields: [contentImages.contentId],
    references: [content.id],
  }),
}));

export const externalRatingRelations = relations(externalRatings, ({ one }) => ({
  content: one(content, {
    fields: [externalRatings.contentId],
    references: [content.id],
  }),
}));

// أنواع البيانات الجديدة
export type Episode = typeof episodes.$inferSelect;
export type ErrorReport = typeof errorReports.$inferSelect;
export type AgeRating = typeof ageRatings.$inferSelect;



// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertContentSchema = createInsertSchema(content).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGenreSchema = createInsertSchema(genres).omit({
  id: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

export const insertUserRatingSchema = createInsertSchema(userRatings).omit({
  id: true,
  createdAt: true,
});

export const insertUserCommentSchema = createInsertSchema(userComments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserFavoriteSchema = createInsertSchema(userFavorites).omit({
  id: true,
  createdAt: true,
});

export const insertUserWatchHistorySchema = createInsertSchema(userWatchHistory).omit({
  id: true,
  watchedAt: true,
});

// Insert schemas - الأنواع الجديدة المطلوبة
export const insertEpisodeSchema = createInsertSchema(episodes).omit({ id: true, createdAt: true, updatedAt: true });
export const insertErrorReportSchema = createInsertSchema(errorReports).omit({ id: true, createdAt: true, updatedAt: true });
export const insertAgeRatingSchema = createInsertSchema(ageRatings).omit({ id: true, createdAt: true });
export const insertContentAgeRatingSchema = createInsertSchema(contentAgeRatings).omit({ id: true });
export const insertCastMemberSchema = createInsertSchema(castMembers).omit({ id: true, createdAt: true, updatedAt: true });
export const insertContentCastSchema = createInsertSchema(contentCast).omit({ id: true, createdAt: true });
export const insertContentImageSchema = createInsertSchema(contentImages).omit({ id: true, createdAt: true });
export const insertExternalRatingSchema = createInsertSchema(externalRatings).omit({ id: true, lastUpdated: true });

export const insertContentViewSchema = createInsertSchema(contentViews).omit({
  id: true,
  lastViewedAt: true,
});

export const insertUserReviewSchema = createInsertSchema(userReviews).omit({
  id: true,
  likes: true,
  dislikes: true,
  createdAt: true,
  updatedAt: true,
});

// Insert schemas للجداول الجديدة
export const insertSubscriptionPlanSchema = createInsertSchema(subscriptionPlans).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserSubscriptionSchema = createInsertSchema(userSubscriptions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserAnalyticsSchema = createInsertSchema(userAnalytics).omit({
  id: true,
  timestamp: true,
});

export const insertContentAnalyticsSchema = createInsertSchema(contentAnalytics).omit({
  id: true,
  createdAt: true,
});

export const insertSystemAnalyticsSchema = createInsertSchema(systemAnalytics).omit({
  id: true,
  createdAt: true,
});

// Types للجداول الجديدة
export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
export type InsertSubscriptionPlan = z.infer<typeof insertSubscriptionPlanSchema>;

export type UserSubscription = typeof userSubscriptions.$inferSelect;
export type InsertUserSubscription = z.infer<typeof insertUserSubscriptionSchema>;

export type UserAnalytics = typeof userAnalytics.$inferSelect;
export type InsertUserAnalytics = z.infer<typeof insertUserAnalyticsSchema>;

export type ContentAnalytics = typeof contentAnalytics.$inferSelect;
export type InsertContentAnalytics = z.infer<typeof insertContentAnalyticsSchema>;

export type SystemAnalytics = typeof systemAnalytics.$inferSelect;
export type InsertSystemAnalytics = z.infer<typeof insertSystemAnalyticsSchema>;

export const insertReviewLikeSchema = createInsertSchema(reviewLikes).omit({
  id: true,
  createdAt: true,
});

// أنواع البيانات للجداول الجديدة
export type InsertEpisode = z.infer<typeof insertEpisodeSchema>;
export type InsertErrorReport = z.infer<typeof insertErrorReportSchema>;
export type InsertAgeRating = z.infer<typeof insertAgeRatingSchema>;
export type InsertContentAgeRating = z.infer<typeof insertContentAgeRatingSchema>;
export type InsertCastMember = z.infer<typeof insertCastMemberSchema>;
export type InsertContentCast = z.infer<typeof insertContentCastSchema>;
export type InsertContentImage = z.infer<typeof insertContentImageSchema>;
export type InsertExternalRating = z.infer<typeof insertExternalRatingSchema>;

export type CastMember = typeof castMembers.$inferSelect;
export type ContentCast = typeof contentCast.$inferSelect;
export type ContentImage = typeof contentImages.$inferSelect;
export type ExternalRating = typeof externalRatings.$inferSelect;
export type ContentAgeRating = typeof contentAgeRatings.$inferSelect;

// Security and Audit Tables
export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  action: text("action").notNull(),
  resource: text("resource").notNull(),
  resourceId: text("resource_id"),
  details: text("details"), // JSON string
  ipAddress: text("ip_address").notNull(),
  userAgent: text("user_agent"),
  success: boolean("success").notNull(),
  errorMessage: text("error_message"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const securityLogs = pgTable("security_logs", {
  id: serial("id").primaryKey(),
  ipAddress: text("ip_address").notNull(),
  eventType: text("event_type").notNull(), // failed_login, suspicious_activity, etc.
  details: text("details"), // JSON string
  severity: text("severity").notNull(), // low, medium, high, critical
  userAgent: text("user_agent"),
  userId: integer("user_id").references(() => users.id),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const loginAttempts = pgTable("login_attempts", {
  id: serial("id").primaryKey(),
  ipAddress: text("ip_address").notNull(),
  email: text("email"),
  attempts: integer("attempts").notNull().default(1),
  lastAttempt: timestamp("last_attempt").defaultNow().notNull(),
  blocked: boolean("blocked").notNull().default(false),
  blockedUntil: timestamp("blocked_until"),
});

export const userSessions = pgTable("user_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  sessionToken: text("session_token").notNull().unique(),
  ipAddress: text("ip_address").notNull(),
  userAgent: text("user_agent"),
  expiresAt: timestamp("expires_at").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastUsed: timestamp("last_used").defaultNow().notNull(),
});

export const passwordResets = pgTable("password_resets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  used: boolean("used").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Security Relations
export const auditLogRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, { fields: [auditLogs.userId], references: [users.id] }),
}));

export const securityLogRelations = relations(securityLogs, ({ one }) => ({
  user: one(users, { fields: [securityLogs.userId], references: [users.id] }),
}));

export const loginAttemptRelations = relations(loginAttempts, ({ one }) => ({
  // No direct user relation since we track by IP and email
}));

export const userSessionRelations = relations(userSessions, ({ one }) => ({
  user: one(users, { fields: [userSessions.userId], references: [users.id] }),
}));

export const passwordResetRelations = relations(passwordResets, ({ one }) => ({
  user: one(users, { fields: [passwordResets.userId], references: [users.id] }),
}));

// Security Schema Types
export const insertAuditLogSchema = createInsertSchema(auditLogs, {
  details: z.string().optional(),
}).omit({
  id: true,
  timestamp: true,
});

export const insertSecurityLogSchema = createInsertSchema(securityLogs, {
  details: z.string().optional(),
}).omit({
  id: true,
  timestamp: true,
});

export const insertLoginAttemptSchema = createInsertSchema(loginAttempts).omit({
  id: true,
  lastAttempt: true,
});

export const insertUserSessionSchema = createInsertSchema(userSessions).omit({
  id: true,
  createdAt: true,
  lastUsed: true,
});

export const insertPasswordResetSchema = createInsertSchema(passwordResets).omit({
  id: true,
  createdAt: true,
});



// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Content = typeof content.$inferSelect;
export type InsertContent = z.infer<typeof insertContentSchema>;

export type Genre = typeof genres.$inferSelect;
export type InsertGenre = z.infer<typeof insertGenreSchema>;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type UserRating = typeof userRatings.$inferSelect;
export type InsertUserRating = z.infer<typeof insertUserRatingSchema>;

export type UserComment = typeof userComments.$inferSelect;
export type InsertUserComment = z.infer<typeof insertUserCommentSchema>;

export type UserReview = typeof userReviews.$inferSelect;
export type InsertUserReview = z.infer<typeof insertUserReviewSchema>;

export type ReviewLike = typeof reviewLikes.$inferSelect;
export type InsertReviewLike = z.infer<typeof insertReviewLikeSchema>;

export type UserFavorite = typeof userFavorites.$inferSelect;
export type InsertUserFavorite = z.infer<typeof insertUserFavoriteSchema>;

export type UserWatchHistory = typeof userWatchHistory.$inferSelect;
export type InsertUserWatchHistory = z.infer<typeof insertUserWatchHistorySchema>;

export type ContentView = typeof contentViews.$inferSelect;
export type InsertContentView = z.infer<typeof insertContentViewSchema>;

// Security Types
export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;

export type SecurityLog = typeof securityLogs.$inferSelect;
export type InsertSecurityLog = z.infer<typeof insertSecurityLogSchema>;

export type LoginAttempt = typeof loginAttempts.$inferSelect;
export type InsertLoginAttempt = z.infer<typeof insertLoginAttemptSchema>;

export type UserSession = typeof userSessions.$inferSelect;
export type InsertUserSession = z.infer<typeof insertUserSessionSchema>;

export type PasswordReset = typeof passwordResets.$inferSelect;
export type InsertPasswordReset = z.infer<typeof insertPasswordResetSchema>;

// نهاية الملف


