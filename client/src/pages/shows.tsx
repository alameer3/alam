import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Star, Calendar, Clock, Eye, Filter, Grid, List } from "lucide-react";
import { Link } from "wouter";

export default function Shows() {
  const [filters, setFilters] = useState({
    category: '',
    genre: '',
    rating: '',
    year: '',
    quality: '',
    resolution: '',
    page: 1
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('latest');

  const { data: showsData, isLoading } = useQuery({
    queryKey: ['/api/content', { type: 'show', ...filters }],
    queryFn: async () => {
      const params = new URLSearchParams({
        type: 'show',
        page: filters.page.toString(),
        limit: '24',
        ...(filters.category && { category: filters.category }),
        ...(filters.genre && { genre: filters.genre }),
        ...(filters.rating && { rating: filters.rating }),
        ...(filters.year && { year: filters.year }),
        ...(filters.quality && { quality: filters.quality }),
        ...(filters.resolution && { resolution: filters.resolution }),
        sort: sortBy
      });
      
      const response = await fetch(`/api/content?${params}`);
      if (!response.ok) throw new Error('Failed to fetch shows');
      return response.json();
    }
  });

  const { data: categories } = useQuery({
    queryKey: ['/api/categories'],
    queryFn: async () => {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      return response.json();
    }
  });

  const { data: genres } = useQuery({
    queryKey: ['/api/genres'],
    queryFn: async () => {
      const response = await fetch('/api/genres');
      if (!response.ok) throw new Error('Failed to fetch genres');
      return response.json();
    }
  });

  const shows = showsData?.content || [];
  const totalPages = showsData?.totalPages || 1;
  const currentPage = showsData?.page || 1;

  // Reset page when filters change
  useEffect(() => {
    setFilters(prev => ({ ...prev, page: 1 }));
  }, [filters.category, filters.genre, filters.rating, filters.year, filters.quality, filters.resolution]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === 'all' ? '' : value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      genre: '',
      rating: '',
      year: '',
      quality: '',
      resolution: '',
      page: 1
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header Background with TV Shows Theme */}
      <div className="relative h-80 overflow-hidden">
        {/* Background with TV/Shows collage effect */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Crect x='0' y='0' width='30' height='30'/%3E%3Crect x='30' y='30' width='30' height='30'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>

        {/* TV screens effect in background */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-6 gap-2 h-full p-8">
            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-blue-500 via-purple-500 to-red-500 rounded-lg animate-pulse"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '3s'
                }}
              />
            ))}
          </div>
        </div>

        {/* Silhouette */}
        <div className="absolute bottom-0 right-1/4 w-64 h-64 opacity-20">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <path
              d="M100 20 C120 20, 140 40, 140 60 L140 120 C140 140, 120 160, 100 160 C80 160, 60 140, 60 120 L60 60 C60 40, 80 20, 100 20 Z M80 80 L80 100 L90 100 L90 110 L110 110 L110 100 L120 100 L120 80 L80 80 Z"
              fill="currentColor"
            />
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-red-200 to-white bg-clip-text text-transparent">
              تلفزيون
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              اكتشف أحدث البرامج التلفزيونية، البرامج الوثائقية، المسرحيات والمزيد
            </p>
            <div className="flex items-center gap-4 text-gray-400">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                <span>{shows.length} برنامج</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span>أعلى التقييمات</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section - ak.sv Style */}
      <div className="sticky top-0 z-40 bg-black/95 backdrop-blur border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            
            {/* Category Filter */}
            <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
              <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                <SelectValue placeholder="الأقسام" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="all">جميع الأقسام</SelectItem>
                <SelectItem value="tv-programs">البرامج التلفزيونية</SelectItem>
                <SelectItem value="documentaries">البرامج الوثائقية</SelectItem>
                <SelectItem value="theater">المسرحيات</SelectItem>
                <SelectItem value="wrestling">المصارعة الحرة</SelectItem>
                <SelectItem value="talk-shows">برامج حوارية</SelectItem>
                <SelectItem value="entertainment">ترفيهي</SelectItem>
              </SelectContent>
            </Select>

            {/* Genre Filter */}
            <Select value={filters.genre} onValueChange={(value) => handleFilterChange('genre', value)}>
              <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                <SelectValue placeholder="التصنيف" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="all">جميع التصنيفات</SelectItem>
                <SelectItem value="ramadan">رمضان</SelectItem>
                <SelectItem value="netflix">NETFLIX</SelectItem>
                <SelectItem value="talk-show">Talk show</SelectItem>
                <SelectItem value="stand-up">Stand Up</SelectItem>
                <SelectItem value="comedy">كوميدي</SelectItem>
                <SelectItem value="entertainment">ترفيهي</SelectItem>
                <SelectItem value="social">اجتماعي</SelectItem>
                <SelectItem value="crime">جريمة</SelectItem>
                <SelectItem value="conversation">حواري</SelectItem>
                <SelectItem value="drama">دراما</SelectItem>
                <SelectItem value="art">فني</SelectItem>
                <SelectItem value="religious">ديني</SelectItem>
                <SelectItem value="hidden-camera">كاميرا خفية</SelectItem>
                <SelectItem value="biography">سيرة ذاتية</SelectItem>
                <SelectItem value="historical">تاريخي</SelectItem>
                <SelectItem value="competitions">مسابقات</SelectItem>
              </SelectContent>
            </Select>

            {/* Rating Filter */}
            <Select value={filters.rating} onValueChange={(value) => handleFilterChange('rating', value)}>
              <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                <SelectValue placeholder="التقييم" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="all">جميع التقييمات</SelectItem>
                {[9, 8, 7, 6, 5, 4, 3, 2, 1].map(rating => (
                  <SelectItem key={rating} value={`${rating}+`}>
                    +{rating}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Year Filter */}
            <Select value={filters.year} onValueChange={(value) => handleFilterChange('year', value)}>
              <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                <SelectValue placeholder="سنة الإنتاج" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700 max-h-60">
                <SelectItem value="all">جميع السنوات</SelectItem>
                {Array.from({ length: 2025 - 1940 + 1 }, (_, i) => 2025 - i).map(year => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Quality Filter */}
            <Select value={filters.quality} onValueChange={(value) => handleFilterChange('quality', value)}>
              <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                <SelectValue placeholder="الجودة" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="all">جميع الجودات</SelectItem>
                <SelectItem value="BluRay">BluRay</SelectItem>
                <SelectItem value="WebRip">WebRip</SelectItem>
                <SelectItem value="BRRIP">BRRIP</SelectItem>
                <SelectItem value="DVDrip">DVDrip</SelectItem>
                <SelectItem value="DVDSCR">DVDSCR</SelectItem>
                <SelectItem value="HD">HD</SelectItem>
                <SelectItem value="HDTS">HDTS</SelectItem>
                <SelectItem value="HDTV">HDTV</SelectItem>
                <SelectItem value="CAM">CAM</SelectItem>
                <SelectItem value="WEB-DL">WEB-DL</SelectItem>
                <SelectItem value="HDTC">HDTC</SelectItem>
                <SelectItem value="BDRIP">BDRIP</SelectItem>
                <SelectItem value="HDRIP">HDRIP</SelectItem>
                <SelectItem value="HC HDRIP">HC HDRIP</SelectItem>
              </SelectContent>
            </Select>

            {/* Resolution Filter */}
            <Select value={filters.resolution} onValueChange={(value) => handleFilterChange('resolution', value)}>
              <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                <SelectValue placeholder="الدقة" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="all">جميع الدقات</SelectItem>
                <SelectItem value="240p">240p</SelectItem>
                <SelectItem value="360p">360p</SelectItem>
                <SelectItem value="480p">480p</SelectItem>
                <SelectItem value="720p">720p</SelectItem>
                <SelectItem value="1080p">1080p</SelectItem>
                <SelectItem value="3D">3D</SelectItem>
                <SelectItem value="4K">4K</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filter Actions & View Options */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                <Filter className="w-4 h-4 mr-2" />
                مسح الفلاتر
              </Button>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 bg-gray-900 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="latest">الأحدث</SelectItem>
                  <SelectItem value="rating">الأعلى تقييماً</SelectItem>
                  <SelectItem value="views">الأكثر مشاهدة</SelectItem>
                  <SelectItem value="title">الاسم</SelectItem>
                  <SelectItem value="year">السنة</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2 bg-gray-900 rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'bg-red-600 hover:bg-red-700' : 'text-gray-400 hover:text-white'}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'bg-red-600 hover:bg-red-700' : 'text-gray-400 hover:text-white'}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">البرامج التلفزيونية</h2>
            <p className="text-gray-400">
              عرض {shows.length} برنامج من إجمالي النتائج
            </p>
          </div>
          
          {/* Active Filters */}
          <div className="flex flex-wrap gap-2">
            {Object.entries(filters).map(([key, value]) => {
              if (!value || key === 'page') return null;
              return (
                <Badge
                  key={key}
                  variant="secondary"
                  className="bg-red-600/20 text-red-400 border-red-600/30"
                >
                  {value}
                  <button
                    onClick={() => handleFilterChange(key, '')}
                    className="ml-2 hover:text-white"
                  >
                    ×
                  </button>
                </Badge>
              );
            })}
          </div>
        </div>

        {/* Content Grid */}
        {shows.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📺</div>
            <h3 className="text-xl font-semibold mb-2">لا توجد برامج</h3>
            <p className="text-gray-400 mb-4">لم يتم العثور على برامج تلفزيونية تطابق الفلاتر المحددة</p>
            <Button
              variant="outline"
              onClick={clearFilters}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              مسح الفلاتر والبحث مرة أخرى
            </Button>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6' 
              : 'grid-cols-1'
          }`}>
            {shows.map((show: any) => (
              <Link
                key={show.id}
                href={`/shows/${show.id}/${encodeURIComponent(show.title?.replace(/\s+/g, '-') || '')}`}
                className="group"
              >
                <Card className="bg-gray-900 border-gray-700 overflow-hidden hover:scale-105 hover:border-red-600/50 transition-all duration-300">
                  <div className="relative">
                    {/* Poster */}
                    <div className={`${viewMode === 'grid' ? 'aspect-[2/3]' : 'aspect-[16/9]'} relative overflow-hidden`}>
                      <img
                        src={show.poster || '/api/placeholder/300/450'}
                        alt={show.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      
                      {/* Quality & Resolution Badges */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {show.quality && (
                          <Badge className="bg-green-600 text-white text-xs">
                            {show.quality}
                          </Badge>
                        )}
                        {show.resolution && (
                          <Badge className="bg-blue-600 text-white text-xs">
                            {show.resolution}
                          </Badge>
                        )}
                      </div>

                      {/* Rating */}
                      {show.rating && (
                        <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 rounded px-2 py-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-white text-xs">{show.rating}</span>
                        </div>
                      )}

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="text-center text-white">
                          <Play className="w-8 h-8 mx-auto mb-2" />
                          <p className="text-sm">مشاهدة</p>
                        </div>
                      </div>
                    </div>

                    {/* Show Info */}
                    <CardContent className="p-3">
                      <h3 className="text-white font-medium text-sm mb-1 line-clamp-2">
                        {show.title}
                      </h3>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>{show.year} • {show.genre}</span>
                        {show.episodes && (
                          <span>{show.episodes} حلقة</span>
                        )}
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination - ak.sv Style */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
              className="flex items-center gap-2 bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
            >
              « السابق
            </Button>

            <span className="text-white">
              صفحة {currentPage} من {totalPages}
            </span>

            <Button
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
              className="flex items-center gap-2 bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
            >
              التالي »
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}