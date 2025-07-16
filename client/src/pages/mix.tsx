import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Star, Calendar, Clock, Eye, Filter, Grid, List, Music, BookOpen, Image, Radio } from "lucide-react";
import { Link } from "wouter";

export default function Mix() {
  const [filters, setFilters] = useState({
    category: '',
    rating: '',
    year: '',
    quality: '',
    page: 1
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('latest');

  const { data: mixData, isLoading } = useQuery({
    queryKey: ['/api/content', { type: 'mix', ...filters }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: filters.page.toString(),
        limit: '24',
        ...(filters.category && { category: filters.category }),
        ...(filters.rating && { rating: filters.rating }),
        ...(filters.year && { year: filters.year }),
        ...(filters.quality && { quality: filters.quality }),
        sort: sortBy
      });
      
      const response = await fetch(`/api/content?type=mix&${params}`);
      if (!response.ok) throw new Error('Failed to fetch mix content');
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

  const mixContent = mixData?.data?.content || [];
  const totalPages = mixData?.totalPages || 1;
  const currentPage = mixData?.page || 1;

  // Reset page when filters change
  useEffect(() => {
    setFilters(prev => ({ ...prev, page: 1 }));
  }, [filters.category, filters.rating, filters.year, filters.quality]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === 'all' ? '' : value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      rating: '',
      year: '',
      quality: '',
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
      {/* Header Background with Mix/Miscellaneous Theme */}
      <div className="relative h-80 overflow-hidden">
        {/* Digital/Tech Background Pattern */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-blue-900"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M0 0h40v40H0V0zm40 40h40v40H40V40zm0-40h2v40h-2V0zm18 0h2v40h-2V0zM2 0h36v2H2V0zm0 18h36v2H2v-2zm40 0h36v2H40v-2zm0-18h36v2H40V0z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>

        {/* Digital grid effect in background */}
        <div className="absolute inset-0 opacity-20">
          <div className="grid grid-cols-8 grid-rows-6 gap-1 h-full p-8">
            {Array.from({ length: 48 }).map((_, i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded animate-pulse"
                style={{
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: '4s'
                }}
              />
            ))}
          </div>
        </div>

        {/* Mixed content icons floating */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-1/4 opacity-10 animate-bounce">
            <Music className="w-16 h-16 text-cyan-400" />
          </div>
          <div className="absolute top-32 right-1/3 opacity-10 animate-pulse">
            <BookOpen className="w-12 h-12 text-green-400" />
          </div>
          <div className="absolute bottom-32 left-1/3 opacity-10 animate-bounce" style={{ animationDelay: '1s' }}>
            <Image className="w-14 h-14 text-yellow-400" />
          </div>
          <div className="absolute bottom-20 right-1/4 opacity-10 animate-pulse" style={{ animationDelay: '2s' }}>
            <Radio className="w-10 h-10 text-purple-400" />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-300 via-white to-purple-300 bg-clip-text text-transparent">
              منوعات
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              اكتشف مجموعة متنوعة من المحتوى: القرآن الكريم، الموسيقى، الكتب، الرياضة والمزيد
            </p>
            <div className="flex items-center gap-4 text-gray-400">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                <span>{mixContent.length} عنصر</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span>محتوى متنوع</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section - ak.sv Style */}
      <div className="sticky top-0 z-40 bg-black/95 backdrop-blur border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            
            {/* Category Filter */}
            <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
              <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                <SelectValue placeholder="الأقسام" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="all">جميع الأقسام</SelectItem>
                <SelectItem value="quran">القران الكريم</SelectItem>
                <SelectItem value="islamic">اسلاميات و اناشيد</SelectItem>
                <SelectItem value="books">الكتب و الابحاث</SelectItem>
                <SelectItem value="sports">رياضة</SelectItem>
                <SelectItem value="images">الصور و الخلفيات</SelectItem>
                <SelectItem value="clips">فيديو كليب</SelectItem>
                <SelectItem value="music">موسيقى</SelectItem>
                <SelectItem value="radio">المسلسلات الاذاعية</SelectItem>
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
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
                <SelectItem value="2021">2021</SelectItem>
                <SelectItem value="2020">2020</SelectItem>
                <SelectItem value="2019">2019</SelectItem>
                <SelectItem value="2018">2018</SelectItem>
                <SelectItem value="2017">2017</SelectItem>
                <SelectItem value="2013">2013</SelectItem>
                <SelectItem value="2012">2012</SelectItem>
                <SelectItem value="2010">2010</SelectItem>
                <SelectItem value="2008">2008</SelectItem>
                <SelectItem value="2007">2007</SelectItem>
                <SelectItem value="1990">1990</SelectItem>
                <SelectItem value="1952">1952</SelectItem>
              </SelectContent>
            </Select>

            {/* Quality Filter */}
            <Select value={filters.quality} onValueChange={(value) => handleFilterChange('quality', value)}>
              <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                <SelectValue placeholder="الجودة" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="all">جميع الجودات</SelectItem>
                <SelectItem value="240p">240p</SelectItem>
                <SelectItem value="360p">360p</SelectItem>
                <SelectItem value="480p">480p</SelectItem>
                <SelectItem value="720p">720p</SelectItem>
                <SelectItem value="1080p">1080p</SelectItem>
                <SelectItem value="3D">3D</SelectItem>
                <SelectItem value="4K">4K</SelectItem>
                <SelectItem value="HD 720p">HD 720p</SelectItem>
              </SelectContent>
            </Select>

            {/* View Toggle */}
            <div className="flex items-center gap-2 bg-gray-900 rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'bg-cyan-600 hover:bg-cyan-700' : 'text-gray-400 hover:text-white'}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'bg-cyan-600 hover:bg-cyan-700' : 'text-gray-400 hover:text-white'}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Filter Actions */}
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

            {/* Active Filters */}
            <div className="flex flex-wrap gap-2">
              {Object.entries(filters).map(([key, value]) => {
                if (!value || key === 'page') return null;
                return (
                  <Badge
                    key={key}
                    variant="secondary"
                    className="bg-cyan-600/20 text-cyan-400 border-cyan-600/30"
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
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">المحتوى المتنوع</h2>
            <p className="text-gray-400">
              عرض {mixContent.length} عنصر من المنوعات
            </p>
          </div>
        </div>

        {/* Content Grid */}
        {mixContent.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎭</div>
            <h3 className="text-xl font-semibold mb-2">لا توجد منوعات</h3>
            <p className="text-gray-400 mb-4">لم يتم العثور على محتوى متنوع يطابق الفلاتر المحددة</p>
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
            {mixContent.map((item: any) => (
              <Link
                key={item.id}
                href={`/mix/${item.id}/${encodeURIComponent(item.title?.replace(/\s+/g, '-') || '')}`}
                className="group"
              >
                <Card className="bg-gray-900 border-gray-700 overflow-hidden hover:scale-105 hover:border-cyan-600/50 transition-all duration-300">
                  <div className="relative">
                    {/* Content Image/Poster */}
                    <div className={`${viewMode === 'grid' ? 'aspect-[2/3]' : 'aspect-[16/9]'} relative overflow-hidden`}>
                      <img
                        src={item.poster || '/api/placeholder/300/450'}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      
                      {/* Category Badge */}
                      {item.category && (
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-purple-600 text-white text-xs">
                            {item.category}
                          </Badge>
                        </div>
                      )}

                      {/* Quality Badge */}
                      {item.quality && (
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-blue-600 text-white text-xs">
                            {item.quality}
                          </Badge>
                        </div>
                      )}

                      {/* Rating */}
                      {item.rating && (
                        <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/70 rounded px-2 py-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-white text-xs">{item.rating}</span>
                        </div>
                      )}

                      {/* Content Type Icon Overlay */}
                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="text-center text-white">
                          {item.type === 'music' && <Music className="w-8 h-8 mx-auto mb-2" />}
                          {item.type === 'book' && <BookOpen className="w-8 h-8 mx-auto mb-2" />}
                          {item.type === 'image' && <Image className="w-8 h-8 mx-auto mb-2" />}
                          {item.type === 'radio' && <Radio className="w-8 h-8 mx-auto mb-2" />}
                          {!['music', 'book', 'image', 'radio'].includes(item.type) && <Play className="w-8 h-8 mx-auto mb-2" />}
                          <p className="text-sm">عرض</p>
                        </div>
                      </div>
                    </div>

                    {/* Content Info */}
                    <CardContent className="p-3">
                      <h3 className="text-white font-medium text-sm mb-1 line-clamp-2">
                        {item.title}
                      </h3>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>{item.year || 'غير محدد'}</span>
                        <span>{item.type}</span>
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