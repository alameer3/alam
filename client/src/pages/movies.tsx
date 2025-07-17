import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Play, Star, Filter, Search, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import FeaturedContentWidget from "@/components/content/featured-content-widget";

interface Movie {
  id: number;
  title: string;
  titleArabic?: string;
  year?: number;
  rating?: number;
  quality?: string;
  poster?: string;
  genre?: string[];
  duration?: string;
  views?: number;
  language?: string;
  country?: string;
}

export default function MoviesPage() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedQuality, setSelectedQuality] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("recent");

  // Meta tags for SEO
  useEffect(() => {
    document.title = "أفلام | اكوام";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'شاهد أحدث الأفلام العربية والأجنبية مجاناً على اكوام - الموقع العربي الأول للأفلام');
    }
  }, []);

  const { data: moviesData, isLoading, error } = useQuery({
    queryKey: ['/api/content/movies', searchQuery, selectedYear, selectedGenre, selectedQuality, sortBy],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append('q', searchQuery);
      if (selectedYear) params.append('year', selectedYear);
      if (selectedGenre) params.append('genre', selectedGenre);
      if (selectedQuality) params.append('quality', selectedQuality);
      if (sortBy) params.append('sortBy', sortBy);
      
      const response = await fetch(`/api/content/movies?${params}`);
      return response.json();
    }
  });

  const movies = moviesData?.data?.content || [];

  const handleWatch = (movie: Movie) => {
    setLocation(`/watch/${movie.id}/1/${encodeURIComponent(movie.title)}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const years = Array.from({length: 25}, (_, i) => 2025 - i);
  const genres = ["أكشن", "كوميدي", "دراما", "رومانسي", "إثارة", "خيال علمي", "رعب", "مغامرة"];
  const qualities = ["HD", "Full HD", "4K", "CAM", "WEB-DL"];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gray-900 py-6 mb-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-white">أفلام</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded ${viewMode === "grid" ? "bg-orange-500 text-white" : "bg-gray-700 text-gray-300"}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded ${viewMode === "list" ? "bg-orange-500 text-white" : "bg-gray-700 text-gray-300"}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <form onSubmit={handleSearch} className="lg:col-span-2">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="ابحث عن فيلم..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 pr-10"
                  dir="rtl"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </form>

            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="السنة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">جميع السنوات</SelectItem>
                {years.map(year => (
                  <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedGenre} onValueChange={setSelectedGenre}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="النوع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">جميع الأنواع</SelectItem>
                {genres.map(genre => (
                  <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedQuality} onValueChange={setSelectedQuality}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="الجودة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">جميع الجودات</SelectItem>
                {qualities.map(quality => (
                  <SelectItem key={quality} value={quality}>{quality}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="ترتيب" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">الأحدث</SelectItem>
                <SelectItem value="popular">الأكثر مشاهدة</SelectItem>
                <SelectItem value="rating">التقييم</SelectItem>
                <SelectItem value="title">العنوان</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Featured Movies */}
      <FeaturedContentWidget 
        title="أفلام مميزة" 
        apiEndpoint="/api/content/movies?featured=true" 
      />

      {/* Movies Grid */}
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">حدث خطأ في تحميل الأفلام</p>
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">لا توجد أفلام متاحة</p>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === "grid" 
              ? "grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8" 
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          }`}>
            {movies.map((movie: Movie) => (
              <div key={movie.id} className={`group relative ${
                viewMode === "list" ? "flex gap-4 bg-gray-800 rounded-lg p-4" : ""
              }`}>
                <div className={`relative overflow-hidden rounded-lg bg-slate-800 ${
                  viewMode === "list" ? "w-32 h-48 flex-shrink-0" : "aspect-[3/4]"
                }`}>
                  <img
                    src={movie.poster || "/api/placeholder/270/400"}
                    alt={movie.titleArabic || movie.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  
                  {/* شارة التقييم */}
                  {movie.rating && (
                    <div className="absolute top-2 left-2 bg-black/70 text-orange-400 px-2 py-1 rounded text-sm font-bold flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      {movie.rating}
                    </div>
                  )}
                  
                  {/* شارة الجودة */}
                  {movie.quality && (
                    <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">
                      {movie.quality}
                    </div>
                  )}
                  
                  {/* أزرار التفاعل */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button
                      onClick={() => handleWatch(movie)}
                      className="bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      <Play className="w-4 h-4 mr-1" />
                      مشاهدة
                    </Button>
                  </div>
                </div>
                
                {/* معلومات الفيلم */}
                <div className={`${viewMode === "list" ? "flex-1" : "mt-2 text-center"}`}>
                  <h3 className="text-white text-sm font-medium line-clamp-2 mb-1">
                    {movie.titleArabic || movie.title}
                  </h3>
                  <div className="flex items-center justify-center gap-2 text-xs text-white/60">
                    <span>{movie.year || 2025}</span>
                    {movie.genre && movie.genre.length > 0 && (
                      <>
                        <span>•</span>
                        <span>{movie.genre[0]}</span>
                      </>
                    )}
                    {movie.duration && (
                      <>
                        <span>•</span>
                        <span>{movie.duration}</span>
                      </>
                    )}
                  </div>
                  
                  {viewMode === "list" && (
                    <div className="mt-2 text-xs text-gray-400">
                      {movie.views && `${movie.views.toLocaleString()} مشاهدة`}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}