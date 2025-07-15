import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Film, Video, Tv, Globe, Play, Star, TrendingUp, Clock, Award, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

interface Content {
  id: number;
  title: string;
  titleArabic?: string;
  description: string;
  type: string;
  poster_url: string;
  release_year: number;
  language: string;
  quality: string;
  rating: number;
  genres: string[];
  view_count?: number;
  duration?: number;
}

export default function AkHeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const { data: featuredContent, isLoading: featuredLoading } = useQuery({
    queryKey: ['/api/content/featured'],
    queryFn: async () => {
      const response = await fetch('/api/content/featured');
      return response.json();
    }
  });

  const { data: contentStats } = useQuery({
    queryKey: ['/api/content/stats'],
    queryFn: async () => {
      const response = await fetch('/api/content/stats');
      return response.json();
    }
  });

  // Auto-slide functionality
  useEffect(() => {
    if (featuredContent && featuredContent.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % Math.min(featuredContent.length, 5));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [featuredContent]);

  const currentContent = featuredContent?.[currentSlide];

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Hero Background */}
      <div className="absolute inset-0">
        {currentContent && (
          <img 
            src={currentContent.poster_url || '/api/placeholder/1920/1080'} 
            alt={currentContent.titleArabic || currentContent.title}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/90 via-black/70 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full">
          {/* Left Content */}
          <div className="text-white">
            <div className="mb-8">
              <h1 className="text-8xl font-bold mb-4 drop-shadow-2xl">
                <span className="bg-gradient-to-r from-red-400 to-yellow-400 bg-clip-text text-transparent">
                  ak.sv
                </span>
              </h1>
              <p className="text-3xl mb-6 drop-shadow-lg">
                منصة المحتوى العربي الأولى
              </p>
              <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                اكتشف أحدث الأفلام والمسلسلات العربية والأجنبية بجودة عالية
              </p>
            </div>

            {/* Current Content Info */}
            {currentContent && (
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <Badge className="bg-red-600 text-white px-4 py-2 text-lg">
                    {currentContent.quality}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-lg">{currentContent.rating}</span>
                  </div>
                  <span className="text-gray-300">{currentContent.release_year}</span>
                </div>
                <h2 className="text-4xl font-bold mb-4">
                  {currentContent.titleArabic || currentContent.title}
                </h2>
                <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                  {currentContent.description}
                </p>
                <div className="flex gap-4">
                  <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg rounded-full shadow-lg">
                    <Play className="w-5 h-5 mr-2" />
                    مشاهدة الآن
                  </Button>
                  <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black px-8 py-4 text-lg rounded-full">
                    المزيد من التفاصيل
                  </Button>
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
              {contentStats?.content?.map((stat: any, index: number) => {
                const colors = ['text-red-400', 'text-yellow-400', 'text-green-400', 'text-blue-400'];
                const icons = [Film, Video, Tv, Globe];
                const Icon = icons[index % icons.length];
                return (
                  <div key={index} className="text-center">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-all duration-300">
                      <Icon className={`w-6 h-6 mx-auto mb-2 ${colors[index % colors.length]}`} />
                      <div className="text-2xl font-bold text-white">{stat.count}</div>
                      <div className="text-sm text-gray-300">
                        {stat.type === 'movies' ? 'أفلام' : 
                         stat.type === 'series' ? 'مسلسلات' : 
                         stat.type === 'tv' ? 'برامج' : 'منوعات'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Content - Featured Posters */}
          <div className="hidden lg:block">
            <div className="grid grid-cols-3 gap-4">
              {featuredContent?.slice(0, 6).map((content: Content, index: number) => (
                <div key={content.id} className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300">
                  <img 
                    src={content.poster_url || '/api/placeholder/300/450'} 
                    alt={content.titleArabic || content.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h3 className="text-white font-bold text-sm mb-1 line-clamp-2">
                        {content.titleArabic || content.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <Badge className="bg-red-600 text-white text-xs">
                          {content.quality}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-white text-xs">{content.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
        {featuredContent?.slice(0, 5).map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-red-600' : 'bg-white/50'
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}