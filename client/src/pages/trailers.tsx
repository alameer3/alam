import { useState } from "react";
import { Play, Clock, TrendingUp, Search, Filter, Grid, List } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


import { useTrendingTrailers, useFeaturedTrailer } from "@/hooks/useTrailers";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";

interface TrailerFilter {
  type: string;
  genre: string;
  duration: string;
  rating: string;
}

export default function TrailersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<TrailerFilter>({
    type: 'all',
    genre: 'all',
    duration: 'all',
    rating: 'all'
  });

  const { data: trendingTrailers, isLoading: trendingLoading, error: trendingError } = useTrendingTrailers();
  const { data: featuredTrailer, isLoading: featuredLoading, error: featuredError } = useFeaturedTrailer();
  
  // Fix for trailers map error
  const safeTrailers = trendingTrailers || [];

  // Mock data for comprehensive trailer showcase
  const mockTrailersData = [
    {
      id: 'trailer-1',
      title: 'الإعلان الدعائي الرسمي - الرسالة',
      description: 'الإعلان الدعائي الرسمي للفيلم الملحمي الرسالة',
      duration: '3:15',
      url: '/api/placeholder/trailer1.mp4',
      thumbnail: '/api/placeholder/854/480',
      releaseDate: '2024-01-15',
      rating: 9.2,
      viewCount: 2450000,
      cast: ['عبد الله غيث', 'مصطفى العقاد', 'أحمد مظهر'],
      genre: ['دراما', 'تاريخي', 'ديني'],
      type: 'trailer' as const
    },
    {
      id: 'teaser-1',
      title: 'الإعلان التشويقي - باب الحارة',
      description: 'إعلان تشويقي للموسم الجديد من مسلسل باب الحارة',
      duration: '1:45',
      url: '/api/placeholder/teaser1.mp4',
      thumbnail: '/api/placeholder/854/480',
      releaseDate: '2024-02-01',
      rating: 8.7,
      viewCount: 1890000,
      cast: ['أيمن زيدان', 'سلوم حداد', 'أمل عرفة'],
      genre: ['دراما', 'كوميدي', 'شعبي'],
      type: 'teaser' as const
    },
    {
      id: 'behind-1',
      title: 'كواليس التصوير - الهيبة',
      description: 'لقطات من كواليس تصوير مسلسل الهيبة',
      duration: '5:30',
      url: '/api/placeholder/behind1.mp4',
      thumbnail: '/api/placeholder/854/480',
      releaseDate: '2024-01-20',
      rating: 8.4,
      viewCount: 980000,
      cast: ['تيم حسن', 'معتصم النهار', 'نادين نجيم'],
      genre: ['دراما', 'أكشن', 'جريمة'],
      type: 'behind-scenes' as const
    },
    {
      id: 'interview-1',
      title: 'مقابلة مع فريق العمل - وجدة',
      description: 'مقابلة حصرية مع المخرجة هيفاء المنصور وفريق العمل',
      duration: '8:45',
      url: '/api/placeholder/interview1.mp4',
      thumbnail: '/api/placeholder/854/480',
      releaseDate: '2024-01-25',
      rating: 8.1,
      viewCount: 567000,
      cast: ['هيفاء المنصور', 'وجد محمد', 'رضا الحمدانى'],
      genre: ['وثائقي', 'مقابلة'],
      type: 'interview' as const
    }
  ];

  const filteredTrailers = mockTrailersData.filter(trailer => {
    const matchesSearch = trailer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         trailer.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filters.type === 'all' || trailer.type === filters.type;
    const matchesGenre = filters.genre === 'all' || trailer.genre.some(g => g === filters.genre);
    
    // Parse duration more safely (format: "3:15" -> 3 minutes)
    const durationMinutes = parseInt(trailer.duration.split(':')[0]) || 0;
    const matchesDuration = filters.duration === 'all' || 
                           (filters.duration === 'short' && durationMinutes < 3) ||
                           (filters.duration === 'medium' && durationMinutes >= 3 && durationMinutes < 6) ||
                           (filters.duration === 'long' && durationMinutes >= 6);
    const matchesRating = filters.rating === 'all' || 
                         (filters.rating === 'high' && trailer.rating >= 8.5) ||
                         (filters.rating === 'medium' && trailer.rating >= 7 && trailer.rating < 8.5) ||
                         (filters.rating === 'low' && trailer.rating < 7);

    return matchesSearch && matchesType && matchesGenre && matchesDuration && matchesRating;
  }) || [];

  if (trendingLoading || featuredLoading) return <LoadingSpinner />;
  if (trendingError || featuredError) return <ErrorMessage message="حدث خطأ في تحميل المقاطع الدعائية" />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white" dir="rtl">
            المقاطع الدعائية
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto" dir="rtl">
            اكتشف أحدث المقاطع الدعائية والكواليس لأفضل الأفلام والمسلسلات
          </p>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" dir="rtl">
              <Search className="h-5 w-5" />
              البحث والتصفية
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="البحث في المقاطع الدعائية..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="text-right"
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={filters.type} onValueChange={(value) => setFilters({...filters, type: value})}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="النوع" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">كل الأنواع</SelectItem>
                    <SelectItem value="trailer">مقطع دعائي</SelectItem>
                    <SelectItem value="teaser">إعلان تشويقي</SelectItem>
                    <SelectItem value="behind-scenes">كواليس</SelectItem>
                    <SelectItem value="interview">مقابلة</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filters.duration} onValueChange={(value) => setFilters({...filters, duration: value})}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="المدة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">كل المدد</SelectItem>
                    <SelectItem value="short">قصير (أقل من 3 دقائق)</SelectItem>
                    <SelectItem value="medium">متوسط (3-6 دقائق)</SelectItem>
                    <SelectItem value="long">طويل (أكثر من 6 دقائق)</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filters.rating} onValueChange={(value) => setFilters({...filters, rating: value})}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="التقييم" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">كل التقييمات</SelectItem>
                    <SelectItem value="high">عالي (+8.5)</SelectItem>
                    <SelectItem value="medium">متوسط (7-8.5)</SelectItem>
                    <SelectItem value="low">منخفض (-7)</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex gap-1">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for different sections */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">جميع المقاطع</TabsTrigger>
            <TabsTrigger value="trending">الأكثر رواجاً</TabsTrigger>
            <TabsTrigger value="featured">المقاطع المميزة</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white" dir="rtl">
                جميع المقاطع الدعائية
              </h2>
              <div className="text-sm text-slate-600 dark:text-slate-300">
                {mockTrailersData.length} مقطع
              </div>
            </div>
            
            <div className="text-center py-12">
              <p className="text-gray-500">لا توجد إعلانات متاحة حالياً</p>
            </div>
          </TabsContent>
          
          <TabsContent value="trending" className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="h-6 w-6 text-red-500" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white" dir="rtl">
                المقاطع الأكثر رواجاً
              </h2>
            </div>
            
            {trendingLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner size="lg" />
              </div>
            ) : trendingError ? (
              <ErrorMessage 
                message="فشل في تحميل المقاطع الأكثر رواجاً" 
                description="حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى."
              />
            ) : trendingTrailers && Array.isArray(trendingTrailers) && trendingTrailers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {trendingTrailers.map((trailer, index) => (
                  <div key={`trending-${index}`} className="bg-gray-100 p-4 rounded">
                    <p className="text-sm">{trailer.title || "إعلان دعائي"}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-600 dark:text-slate-300">
                لا توجد مقاطع دعائية متاحة حالياً
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="featured" className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <Play className="h-6 w-6 text-blue-500" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white" dir="rtl">
                المقاطع المميزة
              </h2>
            </div>
            
            {featuredTrailer && (
              <Card className="overflow-hidden">
                <div className="aspect-video bg-gray-900 relative">
                  <img
                    src={featuredTrailer.thumbnailUrl || "/api/placeholder/800/450"}
                    alt={featuredTrailer.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Button size="lg" className="bg-white/20 hover:bg-white/30 text-white">
                      <Play className="h-6 w-6 mr-2" />
                      تشغيل المقطع المميز
                    </Button>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white" dir="rtl">
                        {featuredTrailer.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 mt-2" dir="rtl">
                        {featuredTrailer.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{featuredTrailer.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>⭐</span>
                        <span>{featuredTrailer.rating}</span>
                      </div>
                      <span>{featuredTrailer.year}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {featuredTrailer.genres.map((genre, index) => (
                        <Badge key={index} variant="secondary">
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Stats Section */}
        <Card>
          <CardHeader>
            <CardTitle dir="rtl">إحصائيات المقاطع الدعائية</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{filteredTrailers.length}</div>
                <div className="text-sm text-slate-600 dark:text-slate-300">إجمالي المقاطع</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {filteredTrailers.length > 0 ? filteredTrailers.reduce((sum, trailer) => sum + (trailer.viewCount || 0), 0).toLocaleString() : '0'}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-300">إجمالي المشاهدات</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {filteredTrailers.length > 0 ? (filteredTrailers.reduce((sum, trailer) => sum + (trailer.rating || 0), 0) / filteredTrailers.length).toFixed(1) : '0.0'}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-300">متوسط التقييم</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {filteredTrailers.length > 0 ? Math.round(filteredTrailers.reduce((sum, trailer) => {
                    const durationMinutes = parseInt(trailer.duration.split(':')[0]) || 0;
                    return sum + durationMinutes;
                  }, 0) / filteredTrailers.length) : 0} دقيقة
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-300">متوسط المدة</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}