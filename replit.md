# AK.SV Clone - Movie & Series Platform

## Overview

This is a comprehensive media platform inspired by the original AK.SV website, featuring Arabic content including movies, series, TV shows, and various entertainment media. The application is built with modern web technologies and follows a full-stack architecture with React frontend and Express backend.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: 
  - Tailwind CSS for modern utility-first styling
  - Custom CSS for AK.SV-specific design elements
  - Original AK.SV fonts (STC-Bold, STC-Regular, STC-Light)
- **State Management**: React Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Radix UI components with shadcn/ui styling
- **Language Support**: Full Arabic RTL support with English fallback

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript for type safety
- **Database**: JSON-based file system with potential PostgreSQL migration
- **Authentication**: JWT-based authentication system
- **API Design**: RESTful API with structured error handling

## Key Components

### 1. Content Management System
- **Content Types**: Movies, Series, TV Shows, Programs, Games, Applications, Theater, Wrestling, Sports
- **Metadata**: Title (Arabic/English), descriptions, ratings, release dates, quality, language, country
- **Media Assets**: Poster images, backdrop images, trailers
- **Categories**: Arabic, Foreign, Hindi, Turkish, Korean, Yemeni, Egyptian, Gulf, Syrian, Lebanese
- **Genres**: Action, Comedy, Drama, Romance, Horror, Thriller, Documentary, Animation, etc.

### 2. User System
- **Authentication**: Login/logout functionality with JWT tokens
- **User Profiles**: Personal information, preferences, avatar
- **User Features**: Favorites, watch history, comments, reviews
- **Roles**: Admin, User, Moderator with appropriate permissions

### 3. Search & Discovery
- **Advanced Search**: Multi-criteria filtering by type, category, genre, year, rating, quality
- **Real-time Search**: Dynamic search suggestions with Arabic support
- **Sorting Options**: By date, rating, popularity, alphabetical
- **Pagination**: Efficient content browsing with load-more functionality

### 4. Media Streaming & Downloads
- **Streaming Links**: Direct video streaming with multiple quality options
- **Download Links**: Multiple download options with various quality levels
- **Episode Management**: Series with season and episode organization
- **Quality Options**: HD, Full HD, 4K support

### 5. Admin Dashboard
- **Content Management**: Add, edit, delete content with rich metadata
- **User Management**: User administration and moderation tools
- **Analytics**: Site statistics, user engagement metrics
- **Site Settings**: Configuration management for site-wide settings

## Data Flow

### 1. Content Delivery
1. User requests content from frontend
2. Frontend queries backend API endpoints
3. Backend retrieves data from JSON database
4. Data is filtered, sorted, and paginated
5. Response sent back to frontend with proper Arabic localization
6. Frontend renders content with appropriate RTL styling

### 2. User Authentication
1. User submits login credentials
2. Backend validates credentials against user database
3. JWT token generated and sent to client
4. Token stored in client for subsequent requests
5. Protected routes validate token on each request

### 3. Search Process
1. User enters search query in Arabic or English
2. Frontend debounces input and sends query to backend
3. Backend performs full-text search across content titles and descriptions
4. Results filtered by active filters (type, category, genre, etc.)
5. Paginated results returned with metadata

## External Dependencies

### Production Dependencies
- **Core Framework**: React, Express, TypeScript
- **Database**: Potential Neon Database (PostgreSQL) integration
- **Authentication**: JWT handling with bcrypt for password security
- **UI Components**: Radix UI ecosystem for accessible components
- **Styling**: Tailwind CSS with custom Arabic font integration
- **Media Processing**: Support for various image and video formats

### Development Dependencies
- **Build Tools**: Vite for fast development and building
- **Code Quality**: ESLint, TypeScript compiler
- **Database Tools**: Drizzle ORM for database management

### Third-party Integrations
- **Media Storage**: File system based with potential cloud storage migration
- **External APIs**: TMDB/IMDB integration for movie metadata
- **Social Features**: Social media sharing capabilities
- **Payment Processing**: Stripe integration for potential premium features

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with hot reloading
- **Database**: Local JSON file with automatic backups
- **File Serving**: Express static file serving for media assets

### Production Deployment
- **Platform**: Optimized for Replit deployment
- **Database**: Automatic migration to PostgreSQL when needed
- **Static Assets**: Efficient serving of CSS, fonts, and images
- **Performance**: Optimized bundle size and loading strategies

### Security Considerations
- **Rate Limiting**: Implemented for API endpoints and authentication
- **Input Validation**: Server-side validation for all user inputs
- **CORS**: Proper cross-origin resource sharing configuration
- **Authentication**: Secure JWT token handling with proper expiration

### Scalability Features
- **Database**: Designed for easy migration from JSON to PostgreSQL
- **Caching**: Efficient caching strategies for frequently accessed content
- **Media Optimization**: Image and video optimization for faster loading
- **API Design**: RESTful architecture supporting future mobile apps

The application maintains the authentic AK.SV experience while providing a modern, maintainable codebase that can scale with growing user demands and content requirements.