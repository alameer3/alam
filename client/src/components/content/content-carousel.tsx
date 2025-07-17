import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play, Star, Calendar, Clock } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ContentItem {
  id: number;
  title: string;
  titleArabic?: string;
  type: string;
  year?: number;
  rating?: number;
  quality?: string;
  poster?: string;
  backdrop?: string;
  genre?: string[];
  duration?: string;
  views?: number;
  description?: string;
  trailer?: string;
}

interface ContentCarouselProps {
  items: ContentItem[];
  title?: string;
  autoPlay?: boolean;
  showControls?: boolean;
  itemsPerView?: number;
}

export default function ContentCarousel({ 
  items, 
  title,
  autoPlay = false,
  showControls = true,
  itemsPerView = 6
}: ContentCarouselProps) {
  const [, setLocation] = useLocation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (autoPlay && !isHovered && items.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % Math.ceil(items.length / itemsPerView));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [autoPlay, isHovered, items.length, itemsPerView]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.ceil(items.length / itemsPerView));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.ceil(items.length / itemsPerView)) % Math.ceil(items.length / itemsPerView));
  };

  const handleWatch = (item: ContentItem) => {
    if (item.type === 'movie') {
      setLocation(`/movie/${item.id}/${encodeURIComponent(item.title)}`);
    } else if (item.type === 'series') {
      setLocation(`/series/${item.id}/${encodeURIComponent(item.title)}`);
    } else {
      setLocation(`/watch/${item.id}/1/${encodeURIComponent(item.title)}`);
    }
  };

  const getVisibleItems = () => {
    const start = currentIndex * itemsPerView;
    return items.slice(start, start + itemsPerView);
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="content-carousel mb-8">
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          {showControls && items.length > itemsPerView && (
            <div className="flex items-center gap-2">
              <Button
                onClick={prevSlide}
                className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button
                onClick={nextSlide}
                className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      )}

      <div 
        className="relative overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {Array.from({ length: Math.ceil(items.length / itemsPerView) }).map((_, slideIndex) => (
            <div key={slideIndex} className="flex-none w-full">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 px-2">
                {items.slice(slideIndex * itemsPerView, (slideIndex + 1) * itemsPerView).map((item) => (
                  <div key={item.id} className="group relative">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-800">
                      <img
                        src={item.poster || "/api/placeholder/270/400"}
                        alt={item.titleArabic || item.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      
                      {/* شارة التقييم */}
                      {item.rating && (
                        <div className="absolute top-2 left-2 bg-black/70 text-orange-400 px-2 py-1 rounded text-sm font-bold flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          {item.rating}
                        </div>
                      )}
                      
                      {/* شارة الجودة */}
                      {item.quality && (
                        <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">
                          {item.quality}
                        </div>
                      )}
                      
                      {/* تراكب المعلومات */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="text-white font-medium text-sm mb-2 line-clamp-2">
                            {item.titleArabic || item.title}
                          </h3>
                          
                          <div className="flex items-center gap-2 text-xs text-white/80 mb-3">
                            {item.year && (
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {item.year}
                              </div>
                            )}
                            {item.duration && (
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {item.duration}
                              </div>
                            )}
                          </div>
                          
                          {item.genre && item.genre.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {item.genre.slice(0, 2).map((g) => (
                                <Badge key={g} variant="secondary" className="text-xs px-2 py-1">
                                  {g}
                                </Badge>
                              ))}
                            </div>
                          )}
                          
                          <Button
                            onClick={() => handleWatch(item)}
                            className="w-full bg-orange-600 hover:bg-orange-700 text-white text-sm"
                          >
                            <Play className="w-4 h-4 mr-2" />
                            {item.type === 'movie' ? 'مشاهدة' : 'تشغيل'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* مؤشرات التنقل */}
      {showControls && items.length > itemsPerView && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: Math.ceil(items.length / itemsPerView) }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-orange-500' : 'bg-gray-500'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}