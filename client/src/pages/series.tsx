import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Star, Play, Plus } from "lucide-react";

export default function Series() {
  const [filters, setFilters] = useState({
    category: '',
    genre: '',
    rating: '',
    year: '',
    language: '',
    quality: '',
    resolution: ''
  });
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['/api/content/series', currentPage, filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v))
      });
      const response = await fetch(`/api/content/series?${params}`);
      if (!response.ok) throw new Error('Failed to fetch series');
      return response.json();
    }
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilter = (key: string) => {
    setFilters(prev => ({ ...prev, [key]: '' }));
  };

  const clearAllFilters = () => {
    setFilters({
      category: '',
      genre: '',
      rating: '',
      year: '',
      language: '',
      quality: '',
      resolution: ''
    });
    setCurrentPage(1);
  };

  const totalPages = Math.ceil((data?.data?.total || 0) / 12);

  // ak.sv exact filter options
  const categories = ['عربي', 'اجنبي', 'هندي', 'تركي', 'اسيوي'];
  const genres = ['رمضان', 'انمي', 'اكشن', 'مدبلج', 'NETFLIX', 'كوميديا', 'اثارة', 'غموض', 'عائلي', 'اطفال', 'حربي', 'رياضي', 'قصير', 'فانتازيا', 'خيال علمي', 'موسيقى', 'سيرة ذاتية', 'وثائقي', 'رومانسي', 'تاريخي', 'دراما', 'رعب', 'جريمة', 'مغامرة', 'غربي'];
  const ratings = ['+1', '+2', '+3', '+4', '+5', '+6', '+7', '+8', '+9'];
  const years = Array.from({length: 66}, (_, i) => (2025 - i).toString());
  const languages = ['العربية', 'الإنجليزية', 'الهندية', 'الاسبانية', 'الصينية', 'البرتغالية', 'الفرنسية', 'الروسية', 'اليابانية', 'الألمانية', 'الكوريية', 'الإيطالية', 'التركية', 'البولندية', 'الأوكرانية', 'الفلندية', 'التايلاندية', 'الدنماركية', 'الإندونيسية', 'النرويجية', 'السويدية', 'الهولندية', 'المجرية'];
  const qualities = ['BluRay', 'WebRip', 'BRRIP', 'DVDrip', 'DVDSCR', 'HD', 'HDTS', 'HDTV', 'CAM', 'WEB-DL', 'HDTC', 'BDRIP', 'HDRIP', 'HC HDRIP'];
  const resolutions = ['240p', '360p', '480p', '720p', '1080p', '3D', '4K'];

  return (
    <div className="min-h-screen relative">
      {/* Background with traditional lanterns */}
      <div 
        className="fixed inset-0 z-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23d4af37' fill-opacity='0.1'%3E%3Cpath d='M60 15c-8.3 0-15 6.7-15 15v30c0 8.3 6.7 15 15 15s15-6.7 15-15V30c0-8.3-6.7-15-15-15zm0 10c2.8 0 5 2.2 5 5v30c0 2.8-2.2 5-5 5s-5-2.2-5-5V30c0-2.8 2.2-5 5-5z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '120px 120px'
        }}
      />
      
      {/* Main content */}
      <div className="relative z-10 bg-black/90 min-h-screen">
        <div className="container mx-auto px-4 py-6">
          
          {/* Header with title and icon */}
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-red-600 to-yellow-500 rounded-lg">
                <Play className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white">مسلسلات</h1>
            </div>
          </div>

          {/* ak.sv Style Filters */}
          <div className="bg-gray-900 rounded-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Category Filter */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">القسم</label>
                <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="اختر القسم" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat} className="text-white hover:bg-gray-700">
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Genre Filter */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">التصنيف</label>
                <Select value={filters.genre} onValueChange={(value) => handleFilterChange('genre', value)}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="اختر التصنيف" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 max-h-60">
                    {genres.map((genre) => (
                      <SelectItem key={genre} value={genre} className="text-white hover:bg-gray-700">
                        {genre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">التقييم</label>
                <Select value={filters.rating} onValueChange={(value) => handleFilterChange('rating', value)}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="اختر التقييم" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {ratings.map((rating) => (
                      <SelectItem key={rating} value={rating} className="text-white hover:bg-gray-700">
                        {rating}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Year Filter */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">سنة الإنتاج</label>
                <Select value={filters.year} onValueChange={(value) => handleFilterChange('year', value)}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="اختر السنة" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 max-h-60">
                    {years.map((year) => (
                      <SelectItem key={year} value={year} className="text-white hover:bg-gray-700">
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Language Filter */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">اللغة</label>
                <Select value={filters.language} onValueChange={(value) => handleFilterChange('language', value)}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="اختر اللغة" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 max-h-60">
                    {languages.map((lang) => (
                      <SelectItem key={lang} value={lang} className="text-white hover:bg-gray-700">
                        {lang}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Quality Filter */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">الجودة</label>
                <Select value={filters.quality} onValueChange={(value) => handleFilterChange('quality', value)}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="اختر الجودة" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 max-h-60">
                    {qualities.map((quality) => (
                      <SelectItem key={quality} value={quality} className="text-white hover:bg-gray-700">
                        {quality}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Resolution Filter */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">الجودة</label>
                <Select value={filters.resolution} onValueChange={(value) => handleFilterChange('resolution', value)}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="اختر الدقة" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {resolutions.map((res) => (
                      <SelectItem key={res} value={res} className="text-white hover:bg-gray-700">
                        {res}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters Button */}
              <div className="flex items-end">
                <Button
                  onClick={clearAllFilters}
                  variant="outline"
                  className="w-full bg-red-600 border-red-600 text-white hover:bg-red-700"
                >
                  مسح الفلاتر
                </Button>
              </div>
            </div>

            {/* Active Filters Display */}
            <div className="mt-4 flex flex-wrap gap-2">
              {Object.entries(filters).map(([key, value]) => value && (
                <Badge
                  key={key}
                  variant="secondary"
                  className="bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                  onClick={() => clearFilter(key)}
                >
                  {value} ×
                </Badge>
              ))}
            </div>
          </div>

          {/* Series Grid - ak.sv Style */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
            {isLoading ? (
              Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="bg-gray-800 rounded-lg aspect-[2/3] animate-pulse" />
              ))
            ) : (
              data?.data?.content?.map((series: any) => (
                <div
                  key={series.id}
                  className="group relative bg-gray-900 rounded-lg overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer"
                  onClick={() => window.location.href = `/series/${series.id}/${encodeURIComponent(series.title)}`}
                >
                  {/* Poster */}
                  <div className="aspect-[2/3] relative overflow-hidden">
                    <img
                      src={series.poster || `/api/placeholder/300/450`}
                      alt={series.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    
                    {/* Quality and Rating Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {series.quality && (
                        <Badge className="bg-green-600 text-white text-xs">
                          {series.quality}
                        </Badge>
                      )}
                      {series.resolution && (
                        <Badge className="bg-blue-600 text-white text-xs">
                          {series.resolution}
                        </Badge>
                      )}
                    </div>

                    {/* Rating */}
                    {series.rating && (
                      <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 rounded px-2 py-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-white text-xs">{series.rating}</span>
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

                  {/* Series Info */}
                  <div className="p-3">
                    <h3 className="text-white font-medium text-sm mb-1 line-clamp-2">
                      {series.title}
                    </h3>
                    <p className="text-gray-400 text-xs">
                      {series.year} • {series.genre}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination - ak.sv Style */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
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
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="flex items-center gap-2 bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
              >
                التالي »
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}