import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import AdvancedFilters from "@/components/filters/advanced-filters";

interface Movie {
  id: number;
  title: string;
  titleArabic?: string;
  year: number;
  rating: number;
  poster: string;
  quality?: string;
  type: string;
}

export default function AkSvMovies() {
  const [, setLocation] = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    section: "",
    category: "",
    genre: "",
    rating: "",
    year: "",
    language: "",
    quality: "",
    resolution: ""
  });

  const { data: moviesData, isLoading } = useQuery({
    queryKey: ["/api/content/movies", currentPage, filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "12",
        ...Object.fromEntries(Object.entries(filters).filter(([_, value]) => value))
      });
      const response = await fetch(`/api/content/movies?${params}`);
      return response.json();
    }
  });

  const categories = ["عربي", "اجنبي", "هندي", "تركي", "اسيوي"];
  const genres = ["اكشن", "كوميديا", "دراما", "رعب", "رومانسي", "خيال علمي", "مغامرة", "اثارة", "جريمة"];
  const years = Array.from({length: 30}, (_, i) => 2025 - i);
  const languages = ["العربية", "الإنجليزية", "الهندية", "التركية", "الفرنسية"];
  const qualities = ["BluRay", "WebRip", "BRRIP", "DVDrip", "HDrip"];
  const resolutions = ["4K", "1080p", "720p", "480p"];

  return (
    <div className="min-h-screen" style={{
      background: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1920&h=1080&fit=crop')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed"
    }}>
      
      {/* العنوان الرئيسي */}
      <div className="bg-black/60 backdrop-blur-sm py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold text-white flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                🎬
              </div>
              أفلام
            </h1>
            <div className="text-white/70 text-sm">
              عدد الأفلام: {moviesData?.data?.total || 0}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* الفلاتر المتقدمة */}
        <AdvancedFilters 
          onFiltersChange={setFilters}
          contentType="movies"
          categories={[
            { id: "29", name: "Arabic", nameArabic: "عربي" },
            { id: "30", name: "Foreign", nameArabic: "أجنبي" },
            { id: "31", name: "Indian", nameArabic: "هندي" },
            { id: "32", name: "Turkish", nameArabic: "تركي" },
            { id: "33", name: "Asian", nameArabic: "آسيوي" }
          ]}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* الفلاتر الجانبية البسيطة */}
          <div className="lg:col-span-1">
            <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-6 border border-white/10 sticky top-24">
              <h2 className="text-xl font-bold text-white mb-6">تصفية سريعة</h2>
              
              <div className="space-y-4">
                {/* القسم */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">القسم</label>
                  <Select value={filters.category} onValueChange={(value) => setFilters({...filters, category: value})}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="اختر القسم" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* التصنيف */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">التصنيف</label>
                  <Select value={filters.genre} onValueChange={(value) => setFilters({...filters, genre: value})}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="اختر التصنيف" />
                    </SelectTrigger>
                    <SelectContent>
                      {genres.map(genre => (
                        <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* التقييم */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">التقييم</label>
                  <Select value={filters.rating} onValueChange={(value) => setFilters({...filters, rating: value})}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="اختر التقييم" />
                    </SelectTrigger>
                    <SelectContent>
                      {[9, 8, 7, 6, 5, 4, 3, 2, 1].map(rating => (
                        <SelectItem key={rating} value={rating.toString()}>+{rating}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* سنة الإنتاج */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">سنة الإنتاج</label>
                  <Select value={filters.year} onValueChange={(value) => setFilters({...filters, year: value})}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="اختر السنة" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map(year => (
                        <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* اللغة */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">اللغة</label>
                  <Select value={filters.language} onValueChange={(value) => setFilters({...filters, language: value})}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="اختر اللغة" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map(lang => (
                        <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* الجودة */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">الجودة</label>
                  <Select value={filters.quality} onValueChange={(value) => setFilters({...filters, quality: value})}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="اختر الجودة" />
                    </SelectTrigger>
                    <SelectContent>
                      {qualities.map(quality => (
                        <SelectItem key={quality} value={quality}>{quality}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* الدقة */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">الدقة</label>
                  <Select value={filters.resolution} onValueChange={(value) => setFilters({...filters, resolution: value})}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="اختر الدقة" />
                    </SelectTrigger>
                    <SelectContent>
                      {resolutions.map(res => (
                        <SelectItem key={res} value={res}>{res}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={() => setFilters({category: "", genre: "", rating: "", year: "", language: "", quality: "", resolution: ""})}
                  variant="outline" 
                  className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  إعادة تعيين الفلاتر
                </Button>
              </div>
            </div>
          </div>

          {/* شبكة الأفلام */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({length: 12}).map((_, index) => (
                  <div key={index} className="bg-black/40 backdrop-blur-sm rounded-xl h-80 animate-pulse" />
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                  {moviesData?.data?.content?.map((movie: Movie) => (
                    <div 
                      key={movie.id} 
                      className="group cursor-pointer"
                      onClick={() => setLocation(`/movie/${movie.id}/${encodeURIComponent(movie.title)}`)}
                    >
                      <div className="bg-black/60 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-orange-500/50 transition-all duration-300 hover:scale-105">
                        <div className="aspect-[2/3] relative overflow-hidden">
                          <img
                            src={movie.poster || "/api/placeholder/300/450"}
                            alt={movie.titleArabic || movie.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          {movie.quality && (
                            <Badge className="absolute top-2 right-2 bg-orange-500 text-white text-xs">
                              {movie.quality}
                            </Badge>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <div className="p-3">
                          <h3 className="text-white font-medium text-sm mb-1 line-clamp-1">
                            {movie.titleArabic || movie.title}
                          </h3>
                          <div className="flex items-center justify-between">
                            <span className="text-white/60 text-xs">{movie.year}</span>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-yellow-400 text-xs font-medium">
                                {movie.rating?.toFixed(1) || "N/A"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* نظام الصفحات */}
                <div className="flex items-center justify-center gap-4">
                  <Button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    variant="outline"
                    size="sm"
                    className="bg-black/40 border-white/20 text-white hover:bg-black/60"
                  >
                    <ChevronRight className="w-4 h-4 ml-1" />
                    السابق
                  </Button>
                  
                  <span className="text-white/80 text-sm">
                    صفحة {currentPage} من {Math.ceil((moviesData?.data?.total || 0) / 12)}
                  </span>
                  
                  <Button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={!moviesData?.hasMore}
                    variant="outline"
                    size="sm"
                    className="bg-black/40 border-white/20 text-white hover:bg-black/60"
                  >
                    التالي
                    <ChevronLeft className="w-4 h-4 mr-1" />
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}