import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Star, Clock, Calendar, Eye, Heart, Share2 } from "lucide-react";
import { Link } from "wouter";

export default function AkAuthenticHero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch featured content for hero slideshow
  const { data: featuredContent = [] } = useQuery({
    queryKey: ["/api/content/featured"],
  });

  // Auto-advance slideshow
  useEffect(() => {
    if (featuredContent.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % featuredContent.length);
      }, 6000);
      return () => clearInterval(timer);
    }
  }, [featuredContent.length]);

  const currentContent = featuredContent[currentSlide];

  if (!currentContent) {
    return (
      <div className="relative h-[700px] bg-gradient-to-br from-slate-900 via-slate-800 to-black flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <div className="mb-8">
            <div className="bg-gradient-to-r from-red-600 via-white to-black p-4 rounded-2xl shadow-2xl inline-block mb-6">
              <span className="text-3xl font-bold">🇾🇪</span>
            </div>
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-red-500 via-white to-black bg-clip-text text-transparent">
              اكوام
            </h1>
            <p className="text-xl text-gray-300 mb-8">أفضل موقع عربي للأفلام والمسلسلات</p>
            <div className="flex justify-center space-x-reverse space-x-4">
              <Badge className="bg-red-600 text-white px-4 py-2 text-sm">جودة عالية</Badge>
              <Badge className="bg-green-600 text-white px-4 py-2 text-sm">تحديث يومي</Badge>
              <Badge className="bg-blue-600 text-white px-4 py-2 text-sm">مجاني</Badge>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[700px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={currentContent.backdrop || "/api/placeholder/1920/1080"}
          alt={currentContent.title}
          className="w-full h-full object-cover scale-105 transition-transform duration-10000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
        <div className="max-w-3xl text-right">
          {/* Title */}
          <h1 className="text-6xl font-bold text-white mb-6 drop-shadow-2xl leading-tight">
            {currentContent.titleAr || currentContent.title}
          </h1>

          {/* Subtitle */}
          {currentContent.titleEn && currentContent.titleAr && (
            <h2 className="text-2xl text-gray-300 mb-8 font-light drop-shadow-lg">
              {currentContent.titleEn}
            </h2>
          )}

          {/* Rating and Info */}
          <div className="flex items-center space-x-reverse space-x-6 mb-8">
            <div className="flex items-center space-x-reverse space-x-2 bg-black/50 px-4 py-2 rounded-full">
              <Star className="h-6 w-6 text-yellow-400 fill-current" />
              <span className="text-white font-bold text-lg">
                {currentContent.rating || "8.5"}
              </span>
            </div>
            <Badge className="bg-red-600 text-white px-4 py-2 text-sm font-semibold">
              {currentContent.quality || "HD"}
            </Badge>
            <div className="flex items-center space-x-reverse space-x-2 text-gray-300">
              <Calendar className="h-5 w-5" />
              <span>{currentContent.year || "2024"}</span>
            </div>
            <div className="flex items-center space-x-reverse space-x-2 text-gray-300">
              <Clock className="h-5 w-5" />
              <span>{currentContent.duration || "120 دقيقة"}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-200 text-xl mb-10 leading-relaxed line-clamp-3 drop-shadow-lg">
            {currentContent.descriptionAr || currentContent.description || "قصة مشوقة ومثيرة تجمع بين الإثارة والتشويق في عمل سينمائي رائع."}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center space-x-reverse space-x-6 mb-10">
            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-red-500/25 transition-all duration-300">
              <Play className="h-6 w-6 ml-3" />
              مشاهدة الآن
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-4 text-lg font-semibold backdrop-blur-sm">
              <Heart className="h-6 w-6 ml-3" />
              إضافة للمفضلة
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-4 text-lg font-semibold backdrop-blur-sm">
              <Share2 className="h-6 w-6 ml-3" />
              مشاركة
            </Button>
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-3">
            {currentContent.genres?.slice(0, 4).map((genre: any) => (
              <Badge key={genre.id} variant="outline" className="border-white/40 text-white hover:bg-white/20 px-4 py-2 text-sm backdrop-blur-sm">
                {genre.nameAr || genre.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {featuredContent.map((_: any, index: number) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? "bg-red-600" : "bg-white/30"
            }`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/10"
        onClick={() => setCurrentSlide((prev) => (prev - 1 + featuredContent.length) % featuredContent.length)}
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/10"
        onClick={() => setCurrentSlide((prev) => (prev + 1) % featuredContent.length)}
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Button>
    </div>
  );
}