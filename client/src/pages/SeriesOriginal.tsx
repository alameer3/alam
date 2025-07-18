import { useState } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import AuthenticLayout from '../components/layout/AuthenticLayout';
import { Star, Download, Play, Calendar, Eye, Filter, Grid, List, Tv, Hash } from 'lucide-react';

const SeriesOriginal = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('recent');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('all');

  // جلب المسلسلات
  const { data: seriesData, isLoading } = useQuery({
    queryKey: ['/api/content', { type: 'series', limit: 24, sort: sortBy, genre: selectedGenre, country: selectedCountry }],
  });

  const series = seriesData?.data || [];

  const genres = [
    'all', 'drama', 'comedy', 'action', 'romance', 'crime', 'historical', 
    'family', 'thriller', 'mystery', 'fantasy', 'documentary'
  ];

  const countries = ['all', 'arabic', 'turkish', 'american', 'korean', 'british', 'spanish'];

  const sortOptions = [
    { value: 'recent', label: 'الأحدث' },
    { value: 'rating', label: 'التقييم' },
    { value: 'views', label: 'المشاهدات' },
    { value: 'title', label: 'الاسم' },
    { value: 'episodes', label: 'عدد الحلقات' }
  ];

  return (
    <AuthenticLayout bodyClass="page-series">
      <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
        
        {/* Header Section */}
        <section className="py-12 border-b border-gray-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-4">المسلسلات</h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                أحدث المسلسلات العربية والتركية والأجنبية
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
                <li className="text-white">المسلسلات</li>
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

                {/* Country Filter */}
                <select 
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="bg-gray-800 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-orange-400"
                >
                  <option value="all">جميع البلدان</option>
                  <option value="arabic">عربي</option>
                  <option value="turkish">تركي</option>
                  <option value="american">أمريكي</option>
                  <option value="korean">كوري</option>
                  <option value="british">بريطاني</option>
                  <option value="spanish">إسباني</option>
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

        {/* Series Grid/List */}
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
                    {series.map((serie: any) => (
                      <div key={serie.id} className="group">
                        <Link href={`/series/${serie.id}`}>
                          <div className="relative overflow-hidden rounded-lg bg-gray-800 aspect-[2/3] mb-3 transition-transform transform group-hover:scale-105">
                            <img
                              src={serie.poster || `/serverdata/images/${serie.image}`}
                              alt={serie.titleAr || serie.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = '/images/placeholder-series.svg';
                              }}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all flex items-center justify-center">
                              <Play className="text-white opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 transition-all" size={48} />
                            </div>
                            
                            {/* Series Badge */}
                            <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold flex items-center">
                              <Tv size={12} className="ml-1" />
                              مسلسل
                            </div>
                            
                            {/* Episodes Count */}
                            <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-bold flex items-center">
                              <Hash size={12} className="ml-1" />
                              {serie.episodeCount || serie.episodes || '12'}
                            </div>
                            
                            {/* Rating */}
                            <div className="absolute bottom-2 left-2 flex items-center space-x-1 bg-black bg-opacity-70 px-2 py-1 rounded">
                              <Star className="text-yellow-400 fill-current" size={14} />
                              <span className="text-white text-xs">{serie.rating || '8.2'}</span>
                            </div>
                          </div>
                          <h3 className="font-semibold text-white text-sm mb-1 line-clamp-2 group-hover:text-orange-400 transition-colors">
                            {serie.titleAr || serie.title}
                          </h3>
                          <div className="flex items-center justify-between text-xs text-gray-400">
                            <span>{serie.releaseDate || '2024'}</span>
                            <div className="flex items-center space-x-1">
                              <Eye size={12} />
                              <span>{serie.views || '2.5K'}</span>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {series.map((serie: any) => (
                      <div key={serie.id} className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors">
                        <Link href={`/series/${serie.id}`} className="flex items-center space-x-4">
                          <img
                            src={serie.poster || `/serverdata/images/${serie.image}`}
                            alt={serie.titleAr || serie.title}
                            className="w-16 h-24 object-cover rounded"
                            onError={(e) => {
                              e.currentTarget.src = '/images/placeholder-series.svg';
                            }}
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-white text-lg mb-2 hover:text-orange-400 transition-colors">
                              {serie.titleAr || serie.title}
                            </h3>
                            <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                              {serie.description || 'وصف المسلسل...'}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>{serie.releaseDate || '2024'}</span>
                              <span className="flex items-center space-x-1">
                                <Star className="text-yellow-400 fill-current" size={14} />
                                <span>{serie.rating || '8.2'}</span>
                              </span>
                              <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs flex items-center">
                                <Hash size={12} className="ml-1" />
                                {serie.episodeCount || serie.episodes || '12'} حلقة
                              </span>
                              <span className="bg-gray-600 text-white px-2 py-1 rounded text-xs">
                                {serie.country || 'عربي'}
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
                {series.length === 0 && !isLoading && (
                  <div className="text-center py-16">
                    <div className="text-gray-400 text-xl mb-4">لا توجد مسلسلات متاحة</div>
                    <Link href="/" className="text-orange-400 hover:text-orange-300 transition-colors">
                      العودة للرئيسية
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* Featured Categories */}
        <section className="py-12 bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">تصنيفات مميزة</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-gray-800 rounded-lg p-6 text-center hover:bg-orange-600 transition-colors cursor-pointer">
                <div className="text-3xl font-bold text-orange-400 mb-2">120+</div>
                <div className="text-gray-300">مسلسلات عربية</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-6 text-center hover:bg-orange-600 transition-colors cursor-pointer">
                <div className="text-3xl font-bold text-orange-400 mb-2">85+</div>
                <div className="text-gray-300">مسلسلات تركية</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-6 text-center hover:bg-orange-600 transition-colors cursor-pointer">
                <div className="text-3xl font-bold text-orange-400 mb-2">200+</div>
                <div className="text-gray-300">مسلسلات أجنبية</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-6 text-center hover:bg-orange-600 transition-colors cursor-pointer">
                <div className="text-3xl font-bold text-orange-400 mb-2">50+</div>
                <div className="text-gray-300">مسلسلات كورية</div>
              </div>
            </div>
          </div>
        </section>

        {/* Pagination */}
        {series.length > 0 && (
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

export default SeriesOriginal;