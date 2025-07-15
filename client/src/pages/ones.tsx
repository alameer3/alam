import { useQuery } from "@tanstack/react-query";
import { AkStyleContentCard } from "@/components/content/ak-style-content-card";
import { AdvancedFilters } from "@/components/filters/advanced-filters";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, TrendingUp, Award } from "lucide-react";
import { useState } from "react";

interface Content {
  id: number;
  title: string;
  description: string;
  type: string;
  poster_url: string;
  release_year: number;
  language: string;
  quality: string;
  resolution: string;
  rating: number;
  genres: string[];
  categories: string[];
}

export default function Ones() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState({});

  // جلب المحتوى المميز
  const { data: featuredData, isLoading: featuredLoading } = useQuery({
    queryKey: ['/api/content/featured'],
    queryFn: () => fetch('/api/content/featured').then(res => res.json())
  });

  // جلب المحتوى الأعلى تقييماً
  const { data: topRatedData, isLoading: topRatedLoading } = useQuery({
    queryKey: ['/api/content/top-rated'],
    queryFn: () => fetch('/api/content?sort=rating&order=desc&limit=12').then(res => res.json())
  });

  // جلب المحتوى الحديث
  const { data: recentData, isLoading: recentLoading } = useQuery({
    queryKey: ['/api/content/recent'],
    queryFn: () => fetch('/api/content?sort=created_at&order=desc&limit=12').then(res => res.json())
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/content', { featured: true, page: currentPage, limit: 24, ...activeFilters }],
    queryFn: () => {
      const searchParams = new URLSearchParams({ 
        featured: 'true',
        page: currentPage.toString(),
        limit: '24',
        ...Object.fromEntries(Object.entries(activeFilters).filter(([_, value]) => value))
      });
      return fetch(`/api/content?${searchParams}`).then(res => res.json());
    }
  });

  const handleFilterChange = (filters: any) => {
    setActiveFilters(filters);
    setCurrentPage(1);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-black">
        <p className="text-white text-xl">حدث خطأ في تحميل المحتوى المميز</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 bg-clip-text text-transparent">
            المحتوى المميز
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            أفضل الأفلام والمسلسلات المختارة بعناية للمشاهدين المميزين
          </p>
        </div>

        {/* أقسام المحتوى المميز */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* المحتوى المميز */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-500" />
                مميز اليوم
                <Badge variant="secondary" className="bg-yellow-500 text-black">
                  جديد
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {featuredLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full bg-slate-700" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {featuredData?.content?.slice(0, 3).map((item: Content) => (
                    <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors cursor-pointer">
                      <img 
                        src={item.poster_url || "/assets/placeholder-poster.jpg"}
                        alt={item.title}
                        className="w-12 h-16 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-white truncate">{item.title}</h4>
                        <p className="text-xs text-gray-400">{item.type} • {item.release_year}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span className="text-xs text-gray-300">{item.rating || 8.5}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* الأعلى تقييماً */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <Star className="h-5 w-5 text-blue-500" />
                الأعلى تقييماً
                <Badge variant="secondary" className="bg-blue-500 text-white">
                  ⭐ 9+
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {topRatedLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full bg-slate-700" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {topRatedData?.content?.slice(0, 3).map((item: Content) => (
                    <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors cursor-pointer">
                      <img 
                        src={item.poster_url || "/assets/placeholder-poster.jpg"}
                        alt={item.title}
                        className="w-12 h-16 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-white truncate">{item.title}</h4>
                        <p className="text-xs text-gray-400">{item.type} • {item.release_year}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span className="text-xs text-gray-300">{item.rating || 9.2}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* الأحدث */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                أحدث الإضافات
                <Badge variant="secondary" className="bg-green-500 text-white">
                  حديث
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full bg-slate-700" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {recentData?.content?.slice(0, 3).map((item: Content) => (
                    <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors cursor-pointer">
                      <img 
                        src={item.poster_url || "/assets/placeholder-poster.jpg"}
                        alt={item.title}
                        className="w-12 h-16 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-white truncate">{item.title}</h4>
                        <p className="text-xs text-gray-400">{item.type} • {item.release_year}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span className="text-xs text-gray-300">{item.rating || 8.1}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <AdvancedFilters 
          onFilterChange={handleFilterChange}
          contentType="featured"
        />

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-6">
            {Array.from({ length: 24 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[2/3] w-full bg-slate-800" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-6">
              {data?.content?.map((item: Content) => (
                <AkStyleContentCard 
                  key={item.id} 
                  content={item}
                />
              ))}
            </div>

            {data?.content?.length === 0 && (
              <div className="text-center py-12">
                <Award className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">لا يوجد محتوى مميز متاح حالياً</p>
                <p className="text-gray-500 text-sm mt-2">تابعنا للحصول على أحدث المحتوى المميز</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}