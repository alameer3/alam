# AK.SV Clone - Movie & Series Platform

## Overview

This is a comprehensive media platform inspired by the original AK.SV website, featuring Arabic content including movies, series, TV shows, and various entertainment media. The application is built with modern web technologies and follows a full-stack architecture with React frontend and Express backend.

## User Preferences

Preferred communication style: Simple, everyday language.
Development approach: Start with core features and build incrementally.
Priority: Focus on authenticity to original AK.SV design and functionality.
Language: Arabic - user prefers communication in Arabic
Design Preference: Modern 2025 style with blue/green gradients (NOT 2024 style)
Request: Complete AK.SV clone with modern 2025 aesthetic

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

## Recent Changes

- **Migration to Replit Environment (January 2025)**: Successfully migrated project from Replit Agent to standard Replit environment
- **Modern Full-Stack Architecture**: Implemented proper client/server separation with React frontend and Express backend
- **Storage System**: Created in-memory storage system following IStorage interface pattern for easy database migration
- **Component Library**: Integrated shadcn/ui components with Tailwind CSS for modern design system
- **API Routes**: Restructured backend routes to use proper storage interface with validation
- **Security Improvements**: Added input validation, rate limiting, and proper error handling
- **Modern UI Components**: Created reusable Header, Footer, and Layout components
- **React Query Integration**: Set up proper data fetching with TanStack Query
- **Updated design to modern 2025 style with blue/green gradient theme
- **Replaced orange color scheme with contemporary blue (#007bff) and green (#28a745) gradients  
- **Enhanced animations and hover effects with improved visual feedback
- **Updated all logos and UI elements to match modern aesthetic
- **Improved typography with gradient text effects for headings
- **Added more sophisticated backdrop blur and shadow effects

## Extracted Files Analysis

After examining `extracted_files/` and `ak_sv_site_extracted/` directories, key findings include:

### Original Site Structure
- **Homepage**: Clean layout with hero section, search, and category cards
- **Font System**: Uses STC fonts (Bold, Regular, Light) via @font-face
- **Color Scheme**: Originally orange (#f3951e) - now updated to modern blue/green gradients
- **Layout**: Bootstrap-based responsive design with custom CSS
- **Navigation**: Fixed header with menu toggle and social links

### CSS Architecture
- **style.css**: Core styles with extensive responsive utilities
- **akwam.css**: Site-specific customizations and overrides
- **plugins.css**: Third-party plugin styles
- **home.css**: Homepage-specific styling

### Content Structure
- **Movies**: Individual movie pages with metadata, ratings, download links
- **Series**: Season/episode organization with streaming options
- **Shows**: TV shows and programs
- **Mix**: Various content types (games, apps, theater, sports)

### Key Features Identified
- Advanced search with filtering
- User authentication system
- Rating and review system
- Download/streaming links management
- Responsive image handling
- Social media integration
- SEO optimization with structured data

The application maintains the authentic AK.SV experience while providing a modern 2025 aesthetic and maintainable codebase that can scale with growing user demands and content requirements.