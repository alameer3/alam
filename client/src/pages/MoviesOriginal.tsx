import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import AuthenticLayout from '../components/layout/AuthenticLayout';
import { Star, Download, Play, Calendar, Eye, Filter, Grid, List } from 'lucide-react';

const MoviesOriginal = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('recent');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedQuality, setSelectedQuality] = useState('all');

  // جلب الأفلام
  const { data: moviesData, isLoading } = useQuery({
    queryKey: ['/api/content', { type: 'movie', limit: 24, sort: sortBy, genre: selectedGenre, quality: selectedQuality }],
  });

  const movies = moviesData?.data || [];

  const genres = [
    'all', 'action', 'comedy', 'drama', 'horror', 'romance', 'sci-fi', 
    'adventure', 'animation', 'documentary', 'war', 'crime', 'family'
  ];

  const qualities = ['all', '4K', '1080p', '720p', 'HD', 'CAM'];

  const sortOptions = [
    { value: 'recent', label: 'الأحدث' },
    { value: 'rating', label: 'التقييم' },
    { value: 'views', label: 'المشاهدات' },
    { value: 'title', label: 'الاسم' },
    { value: 'year', label: 'السنة' }
  ];

  return (
    <AuthenticLayout bodyClass="page-movies">
      <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
        
        {/* Header Section */}
        <section className="py-12 border-b border-gray-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-4">الأفلام</h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                أحدث الأفلام العربية والأجنبية بجودة عالية
              </p>
            </div>

            {/* Breadcrumb */}
            <nav className="mb-8">
              <ol className="flex items-center space-x-2 text-sm">
                <li>
                  <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                    الرئيسية
                  </Link>
                </li>
                <li className="text-gray-600">←</li>
                <li className="text-white">الأفلام</li>
              </ol>
            </nav>
          </div>
        </section>

        {/* Filters Section */}
        <section className="py-8 bg-gray-900 border-b border-gray-800">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              
              {/* Filter Controls */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Filter size={20} className="text-orange-400" />
                  <span className="text-white font-medium">تصفية:</span>
                </div>

                {/* Genre Filter */}
                <select 
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="bg-gray-800 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-orange-400"
                >
                  <option value="all">جميع الأنواع</option>
                  {genres.slice(1).map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>

                {/* Quality Filter */}
                <select 
                  value={selectedQuality}
                  onChange={(e) => setSelectedQuality(e.target.value)}
                  className="bg-gray-800 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-orange-400"
                >
                  <option value="all">جميع الجودات</option>
                  {qualities.slice(1).map(quality => (
                    <option key={quality} value={quality}>{quality}</option>
                  ))}
                </select>

                {/* Sort */}
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-800 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-orange-400"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center space-x-2">
                <span className="text-white font-medium">العرض:</span>
                <div className="flex border border-gray-600 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 transition-colors ${
                      viewMode === 'grid' 
                        ? 'bg-orange-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <Grid size={20} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 transition-colors ${
                      viewMode === 'list' 
                        ? 'bg-orange-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <List size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Movies Grid/List */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-800 aspect-[2/3] rounded-lg mb-3"></div>
                    <div className="bg-gray-800 h-4 rounded mb-2"></div>
                    <div className="bg-gray-800 h-3 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                    {movies.map((movie: any) => (
                      <div key={movie.id} className="group">
                        <Link href={`/movie/${movie.id}`}>
                          <div className="relative overflow-hidden rounded-lg bg-gray-800 aspect-[2/3] mb-3 transition-transform transform group-hover:scale-105">
                            <img
                              src={movie.poster || `/serverdata/images/${movie.image}`}
                              alt={movie.titleAr || movie.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = '/images/placeholder-movie.svg';
                              }}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all flex items-center justify-center">
                              <Play className="text-white opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 transition-all" size={48} />
                            </div>
                            
                            {/* Quality Badge */}
                            <div className="absolute top-2 right-2 bg-orange-600 text-white px-2 py-1 rounded text-xs font-bold">
                              {movie.quality || 'HD'}
                            </div>
                            
                            {/* Rating */}
                            <div className="absolute bottom-2 left-2 flex items-center space-x-1 bg-black bg-opacity-70 px-2 py-1 rounded">
                              <Star className="text-yellow-400 fill-current" size={14} />
                              <span className="text-white text-xs">{movie.rating || '7.5'}</span>
                            </div>
                          </div>
                          <h3 className="font-semibold text-white text-sm mb-1 line-clamp-2 group-hover:text-orange-400 transition-colors">
                            {movie.titleAr || movie.title}
                          </h3>
                          <div className="flex items-center justify-between text-xs text-gray-400">
                            <span>{movie.releaseDate || '2024'}</span>
                            <div className="flex items-center space-x-1">
                              <Eye size={12} />
                              <span>{movie.views || '1.2K'}</span>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {movies.map((movie: any) => (
                      <div key={movie.id} className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors">
                        <Link href={`/movie/${movie.id}`} className="flex items-center space-x-4">
                          <img
                            src={movie.poster || `/serverdata/images/${movie.image}`}
                            alt={movie.titleAr || movie.title}
                            className="w-16 h-24 object-cover rounded"
                            onError={(e) => {
                              e.currentTarget.src = '/images/placeholder-movie.svg';
                            }}
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-white text-lg mb-2 hover:text-orange-400 transition-colors">
                              {movie.titleAr || movie.title}
                            </h3>
                            <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                              {movie.description || 'وصف الفيلم...'}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>{movie.releaseDate || '2024'}</span>
                              <span className="flex items-center space-x-1">
                                <Star className="text-yellow-400 fill-current" size={14} />
                                <span>{movie.rating || '7.5'}</span>
                              </span>
                              <span className="bg-orange-600 text-white px-2 py-1 rounded text-xs">
                                {movie.quality || 'HD'}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col space-y-2">
                            <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded transition-colors flex items-center">
                              <Play size={16} className="ml-2" />
                              مشاهدة
                            </button>
                            <button className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded transition-colors flex items-center">
                              <Download size={16} className="ml-2" />
                              تحميل
                            </button>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}

                {/* No Results */}
                {movies.length === 0 && !isLoading && (
                  <div className="text-center py-16">
                    <div className="text-gray-400 text-xl mb-4">لا توجد أفلام متاحة</div>
                    <Link href="/" className="text-orange-400 hover:text-orange-300 transition-colors">
                      العودة للرئيسية
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* Pagination */}
        {movies.length > 0 && (
          <section className="py-8 border-t border-gray-800">
            <div className="container mx-auto px-4">
              <div className="flex justify-center">
                <div className="flex items-center space-x-2">
                  <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors">
                    السابق
                  </button>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map(page => (
                      <button
                        key={page}
                        className={`px-3 py-2 rounded transition-colors ${
                          page === 1 
                            ? 'bg-orange-600 text-white' 
                            : 'bg-gray-700 hover:bg-gray-600 text-white'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors">
                    التالي
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </AuthenticLayout>
  );
};

export default MoviesOriginal;