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
  type: text("type").notNull(), // movie, series, tv, misc
});

export const genres = pgTable("genres", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameArabic: text("name_arabic").notNull(),
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

// Relations
export const contentRelations = relations(content, ({ many, one }) => ({
  contentGenres: many(contentGenres),
  contentCategories: many(contentCategories),
  userRatings: many(userRatings),
  comments: many(userComments),
  favorites: many(userFavorites),
  watchHistory: many(userWatchHistory),
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

export const insertContentViewSchema = createInsertSchema(contentViews).omit({
  id: true,
  lastViewedAt: true,
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

export type UserFavorite = typeof userFavorites.$inferSelect;
export type InsertUserFavorite = z.infer<typeof insertUserFavoriteSchema>;

export type UserWatchHistory = typeof userWatchHistory.$inferSelect;
export type InsertUserWatchHistory = z.infer<typeof insertUserWatchHistorySchema>;

export type ContentView = typeof contentViews.$inferSelect;
export type InsertContentView = z.infer<typeof insertContentViewSchema>;
