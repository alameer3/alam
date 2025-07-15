import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Star, Clock, Calendar, Eye, Heart, Share2, Film, Video, Award } from "lucide-react";
import { Link } from "wouter";

export default function AkEnhancedHero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch featured content for hero slideshow
  const { data: featuredContent = [] } = useQuery({
    queryKey: ["/api/content/featured"],
  });

  // Auto-advance slideshow with smoother transitions
  useEffect(() => {
    if (featuredContent.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % featuredContent.length);
      }, 7000);
      return () => clearInterval(timer);
    }
  }, [featuredContent.length]);

  const currentContent = featuredContent[currentSlide];

  if (!currentContent) {
    return (
      <div className="relative h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
        <div className="relative z-10 text-center text-white max-w-6xl mx-auto px-4">
          <div className="mb-12">
            <div className="bg-gradient-to-r from-red-600 via-white to-black p-6 rounded-3xl shadow-2xl inline-block mb-8 animate-pulse">
              <span className="text-4xl font-bold">🇾🇪</span>
            </div>
            <h1 className="text-8xl font-bold mb-6 bg-gradient-to-r from-red-500 via-white to-black bg-clip-text text-transparent leading-tight">
              اكوام
            </h1>
            <p className="text-2xl text-gray-300 mb-12 leading-relaxed">
              أفضل موقع عربي للأفلام والمسلسلات بجودة عالية
            </p>
            <div className="flex justify-center space-x-reverse space-x-6 mb-8">
              <Badge className="bg-red-600 text-white px-6 py-3 text-base font-semibold">جودة عالية</Badge>
              <Badge className="bg-green-600 text-white px-6 py-3 text-base font-semibold">تحديث يومي</Badge>
              <Badge className="bg-blue-600 text-white px-6 py-3 text-base font-semibold">مجاني</Badge>
            </div>
            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white px-12 py-6 text-xl font-bold rounded-xl shadow-2xl hover:shadow-red-500/25 transition-all duration-300">
              <Play className="h-8 w-8 ml-4" />
              اكتشف الآن
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <div className="absolute inset-0">
        <img
          src={currentContent.backdrop || "/api/placeholder/1920/1080"}
          alt={currentContent.title}
          className="w-full h-full object-cover scale-110 transition-transform duration-20000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
      </div>

      {/* Floating Particles Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
        <div className="max-w-4xl text-right">
          {/* Content Type Badge */}
          <div className="flex items-center space-x-reverse space-x-3 mb-4">
            <Badge className="bg-red-600 text-white px-4 py-2 text-sm font-semibold">
              {currentContent.type === "movies" ? "فيلم" : "مسلسل"}
            </Badge>
            <Badge className="bg-blue-600 text-white px-4 py-2 text-sm font-semibold">
              {currentContent.category || "عام"}
            </Badge>
          </div>

          {/* Title */}
          <h1 className="text-7xl font-bold text-white mb-6 drop-shadow-2xl leading-tight">
            {currentContent.titleAr || currentContent.title}
          </h1>

          {/* English Subtitle */}
          {currentContent.titleEn && currentContent.titleAr && (
            <h2 className="text-3xl text-gray-300 mb-8 font-light drop-shadow-lg">
              {currentContent.titleEn}
            </h2>
          )}

          {/* Rating and Info */}
          <div className="flex items-center space-x-reverse space-x-8 mb-8">
            <div className="flex items-center space-x-reverse space-x-2 bg-black/60 px-6 py-3 rounded-full backdrop-blur-sm">
              <Star className="h-6 w-6 text-yellow-400 fill-current" />
              <span className="text-white font-bold text-xl">
                {currentContent.rating || "8.5"}
              </span>
              <span className="text-gray-400 text-sm">من 10</span>
            </div>
            <Badge className="bg-red-600 text-white px-6 py-3 text-lg font-bold">
              {currentContent.quality || "HD"}
            </Badge>
            <div className="flex items-center space-x-reverse space-x-2 text-gray-300">
              <Calendar className="h-5 w-5" />
              <span className="text-lg">{currentContent.year || "2024"}</span>
            </div>
            <div className="flex items-center space-x-reverse space-x-2 text-gray-300">
              <Clock className="h-5 w-5" />
              <span className="text-lg">{currentContent.duration || "120 دقيقة"}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-200 text-2xl mb-12 leading-relaxed line-clamp-3 drop-shadow-lg max-w-3xl">
            {currentContent.descriptionAr || currentContent.description || "قصة مشوقة ومثيرة تجمع بين الإثارة والتشويق في عمل سينمائي رائع يأخذك في رحلة لا تُنسى مليئة بالمغامرات والأحداث المثيرة."}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center space-x-reverse space-x-8 mb-12">
            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white px-12 py-6 text-xl font-bold shadow-2xl hover:shadow-red-500/25 transition-all duration-300 rounded-xl">
              <Play className="h-8 w-8 ml-4" />
              مشاهدة الآن
            </Button>
            <Button size="lg" variant="outline" className="border-3 border-white text-white hover:bg-white hover:text-black px-12 py-6 text-xl font-bold backdrop-blur-sm rounded-xl">
              <Heart className="h-8 w-8 ml-4" />
              إضافة للمفضلة
            </Button>
            <Button size="lg" variant="outline" className="border-3 border-white text-white hover:bg-white hover:text-black px-12 py-6 text-xl font-bold backdrop-blur-sm rounded-xl">
              <Share2 className="h-8 w-8 ml-4" />
              مشاركة
            </Button>
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-4">
            {currentContent.genres?.slice(0, 5).map((genre: any) => (
              <Badge key={genre.id} variant="outline" className="border-white/50 text-white hover:bg-white/20 px-6 py-3 text-lg backdrop-blur-sm rounded-xl">
                {genre.nameAr || genre.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {featuredContent.map((_: any, index: number) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-4 h-4 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? "bg-red-600 shadow-lg shadow-red-500/50" 
                : "bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>

      {/* Next/Previous Buttons */}
      <div className="absolute bottom-8 right-8 flex space-x-reverse space-x-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentSlide((prev) => (prev - 1 + featuredContent.length) % featuredContent.length)}
          className="border-white/40 text-white hover:bg-white/20 backdrop-blur-sm"
        >
          السابق
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentSlide((prev) => (prev + 1) % featuredContent.length)}
          className="border-white/40 text-white hover:bg-white/20 backdrop-blur-sm"
        >
          التالي
        </Button>
      </div>
    </div>
  );
}