import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Play, Plus, Check, Star } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface Content {
  id: number;
  title: string;
  titleArabic?: string;
  type: string;
  year?: number;
  rating?: number;
  quality?: string;
  poster?: string;
  genre?: string[];
  duration?: string;
  views?: number;
  addedDate?: string;
}

interface FeaturedContentWidgetProps {
  title: string;
  apiEndpoint: string;
  showAll?: boolean;
}

export default function FeaturedContentWidget({ 
  title, 
  apiEndpoint, 
  showAll = false 
}: FeaturedContentWidgetProps) {
  const [, setLocation] = useLocation();
  const [favorites, setFavorites] = useState<number[]>([]);

  const { data, isLoading, error } = useQuery({
    queryKey: [apiEndpoint],
    queryFn: async () => {
      const response = await fetch(apiEndpoint);
      const result = await response.json();
      return result.data || result;
    }
  });

  const handleWatch = (content: Content) => {
    setLocation(`/watch/${content.id}/1/${encodeURIComponent(content.title)}`);
  };

  const handleAddToFavorites = (contentId: number) => {
    setFavorites(prev => 
      prev.includes(contentId) 
        ? prev.filter(id => id !== contentId)
        : [...prev, contentId]
    );
  };

  const content = Array.isArray(data?.content) ? data.content : 
                  Array.isArray(data?.data?.content) ? data.data.content :
                  Array.isArray(data) ? data : [];

  if (isLoading) {
    return (
      <div className="widget-3 widget widget-style-1 mb-5">
        <div className="container">
          <header className="widget-header mb-4">
            <h2 className="header-title font-size-18 font-weight-bold mb-0">
              <span className="header-link text-white">{title}</span>
            </h2>
            <img src="/images/icn-w-header.png" className="header-img" alt="icn-w-header" />
          </header>
        </div>
        <div className="container-fluid">
          <div className="widget-body" style={{ height: "400px", overflow: "hidden" }}>
            <div className="flex justify-center items-center h-full">
              <LoadingSpinner />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !content || content.length === 0) {
    return (
      <div className="widget-3 widget widget-style-1 mb-5">
        <div className="container">
          <header className="widget-header mb-4">
            <h2 className="header-title font-size-18 font-weight-bold mb-0">
              <span className="header-link text-white">{title}</span>
            </h2>
            <img src="/images/icn-w-header.png" className="header-img" alt="icn-w-header" />
          </header>
        </div>
        <div className="container-fluid">
          <div className="widget-body" style={{ height: "400px", overflow: "hidden" }}>
            <div className="flex justify-center items-center h-full">
              <p className="text-white text-center">لا توجد بيانات متاحة</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="widget-3 widget widget-style-1 mb-5">
      <div className="container">
        <header className="widget-header mb-4">
          <h2 className="header-title font-size-18 font-weight-bold mb-0">
            <span className="header-link text-white">{title}</span>
          </h2>
          <img src="/images/icn-w-header.png" className="header-img" alt="icn-w-header" />
        </header>
      </div>
      <div className="container-fluid">
        <div className="widget-body" style={{ height: "400px", overflow: "hidden" }}>
          <div className="swiper-container">
            <div className="swiper-wrapper opacity-100 flex gap-4 overflow-x-auto pb-4">
              {content.slice(0, showAll ? content.length : 12).map((item: Content) => (
                <div key={item.id} className="swiper-slide" style={{ width: "auto", minWidth: "200px" }}>
                  <div className="entry-box entry-box-1">
                    <div className="entry-image">
                      <div className="box relative">
                        <picture>
                          <img 
                            src={item.poster || "/api/placeholder/270/400"} 
                            className="w-full h-full object-cover rounded-t-lg" 
                            alt={item.titleArabic || item.title}
                            style={{ aspectRatio: "270/400" }}
                          />
                        </picture>
                        
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
                      </div>
                    </div>
                    
                    <div className="entry-body px-3 pb-3 text-center">
                      <div className="actions d-flex justify-content-center gap-2">
                        <button 
                          onClick={() => handleWatch(item)}
                          className="icn play flex flex-col items-center text-orange-500 hover:text-orange-400 transition-colors"
                        >
                          <Play className="w-5 h-5 mb-1" />
                          <div className="text-xs">مشاهدة</div>
                        </button>
                        
                        <button 
                          onClick={() => handleAddToFavorites(item.id)}
                          className="icn add-to-fav flex flex-col items-center text-white hover:text-orange-400 transition-colors"
                        >
                          {favorites.includes(item.id) ? 
                            <Check className="w-5 h-5 mb-1" /> : 
                            <Plus className="w-5 h-5 mb-1" />
                          }
                          <div className="text-xs">قائمتي</div>
                        </button>
                      </div>
                      
                      <div className="line my-3 h-px bg-gray-600"></div>
                      
                      <h3 className="entry-title font-size-14 m-0">
                        <button 
                          onClick={() => handleWatch(item)}
                          className="text-white hover:text-orange-400 transition-colors text-sm"
                        >
                          {item.titleArabic || item.title}
                        </button>
                      </h3>
                      
                      {item.year && (
                        <div className="text-xs text-gray-400 mt-1">
                          {item.year}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}