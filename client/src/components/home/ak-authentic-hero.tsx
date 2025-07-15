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
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [featuredContent.length]);

  const currentContent = featuredContent[currentSlide];

  if (!currentContent) {
    return (
      <div className="relative h-[600px] bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">اكوام</h2>
          <p className="text-gray-300">الموقع العربي الأول للمشاهدة والتحميل</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[600px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={currentContent.backdrop || "/api/placeholder/1920/1080"}
          alt={currentContent.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl text-right">
          {/* Title */}
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
            {currentContent.titleAr || currentContent.title}
          </h1>

          {/* Subtitle */}
          {currentContent.titleEn && currentContent.titleAr && (
            <h2 className="text-xl text-gray-300 mb-6 font-light">
              {currentContent.titleEn}
            </h2>
          )}

          {/* Rating and Info */}
          <div className="flex items-center space-x-reverse space-x-4 mb-6">
            <div className="flex items-center space-x-reverse space-x-1">
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <span className="text-white font-semibold">
                {currentContent.rating || "8.5"}
              </span>
            </div>
            <Badge variant="secondary" className="bg-red-600 text-white">
              {currentContent.quality || "HD"}
            </Badge>
            <span className="text-gray-300">{currentContent.year || "2024"}</span>
            <span className="text-gray-300">{currentContent.duration || "120 دقيقة"}</span>
          </div>

          {/* Description */}
          <p className="text-gray-300 text-lg mb-8 leading-relaxed line-clamp-3">
            {currentContent.descriptionAr || currentContent.description || "وصف المحتوى يظهر هنا..."}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center space-x-reverse space-x-4 mb-8">
            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white">
              <Play className="h-5 w-5 ml-2" />
              مشاهدة الآن
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Heart className="h-5 w-5 ml-2" />
              إضافة للمفضلة
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Share2 className="h-5 w-5 ml-2" />
              مشاركة
            </Button>
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-2">
            {currentContent.genres?.slice(0, 3).map((genre: any) => (
              <Badge key={genre.id} variant="outline" className="border-white/30 text-white hover:bg-white/10">
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