import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Play, Heart, Star, Clock, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import FeaturedContentWidget from "@/components/content/featured-content-widget";

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

export default function OnesPage() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const typedRef = useRef<HTMLInputElement>(null);

  // إضافة تأثيرات Typed.js للبحث
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '/js/typed.min.js';
    script.onload = () => {
      if (typedRef.current && (window as any).Typed) {
        new (window as any).Typed(typedRef.current, {
          strings: [
            'ابحث عن فيلم او مسلسل او لعبة او برنامج ...',
            'مثال: الجزيرة',
            'مثال آخر: اسم مؤقت',
            'مثال: FIFA',
            'ابحث هنا في اكوام باسم الفيلم او المسلسل او اي لعبة او برنامج ترغب به'
          ],
          typeSpeed: 50,
          backSpeed: 30,
          loop: true,
          backDelay: 2000,
          attr: 'placeholder'
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // جلب المحتوى المميز
  const { data: featuredContent, isLoading: featuredLoading } = useQuery({
    queryKey: ['/api/content/featured'],
    queryFn: async () => {
      const response = await fetch('/api/content/featured');
      return response.json();
    }
  });

  // جلب المحتوى الشائع
  const { data: trendingContent, isLoading: trendingLoading } = useQuery({
    queryKey: ['/api/content/trending'],
    queryFn: async () => {
      const response = await fetch('/api/content/trending');
      return response.json();
    }
  });

  // جلب المحتوى المُضاف حديثاً
  const { data: recentData, isLoading: recentLoading } = useQuery({
    queryKey: ['/api/content/recent'],
    queryFn: async () => {
      const response = await fetch('/api/content/recent');
      return response.json();
    }
  });

  const recentContent = recentData?.content || [];

  const handleWatch = (content: Content) => {
    setLocation(`/watch/${content.id}/1/${encodeURIComponent(content.title)}`);
  };

  const renderContentGrid = (content: Content[] | undefined, title: string, isLoading: boolean) => (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-8 bg-orange-500 rounded-full"></div>
        <h2 className="text-2xl font-bold text-white">{title}</h2>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          {(content && Array.isArray(content) ? content : []).slice(0, 16).map((item) => (
            <div key={item.id} className="group relative">
              <div className="relative overflow-hidden rounded-lg bg-slate-800 aspect-[3/4]">
                <img
                  src={item.poster || "/api/placeholder/178/260"}
                  alt={item.titleArabic || item.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                
                {/* شارة التقييم */}
                {item.rating && (
                  <div className="absolute top-2 left-2 bg-black/70 text-orange-400 px-2 py-1 rounded text-sm font-bold">
                    {item.rating}
                  </div>
                )}
                
                {/* شارة الجودة */}
                {item.quality && (
                  <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">
                    {item.quality}
                  </div>
                )}
                
                {/* أزرار التفاعل */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleWatch(item)}
                      className="bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      <Play className="w-4 h-4 mr-1" />
                      مشاهدة
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      قائمتي
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* معلومات المحتوى */}
              <div className="mt-2 text-center">
                <h3 className="text-white text-sm font-medium line-clamp-2 mb-1">
                  {item.titleArabic || item.title}
                </h3>
                <div className="flex items-center justify-center gap-2 text-xs text-white/60">
                  <span>{item.year || 2025}</span>
                  {item.genre && item.genre.length > 0 && (
                    <>
                      <span>•</span>
                      <span>{item.genre[0]}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // التصنيفات الرئيسية
  const mainCategories = [
    { title: "أفلام", path: "/movies", icon: "icon-video-camera" },
    { title: "مسلسلات", path: "/series", icon: "icon-monitor" },
    { title: "تلفزيون", path: "/shows", icon: "icon-tv" },
    { title: "منوعات", path: "/mix", icon: "icon-mix" }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div style={{ marginBottom: "90px" }}></div>
      
      {/* Widget البحث والتصنيفات */}
      <div className="container mx-auto px-4">
        <div className="widget-2 widget mb-4">
          <div className="widget-body">
            <div className="col-lg-8 mx-auto">
              {/* شريط البحث المحسن */}
              <form onSubmit={handleSearch} className="form d-flex no-gutters mb-5">
                <div className="col pl-3 relative">
                  <input 
                    ref={typedRef}
                    type="text" 
                    className="form-control w-full p-4 bg-gray-800 border border-gray-700 rounded-r-lg text-white placeholder-gray-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ direction: 'rtl' }}
                  />
                </div>
                <div className="col-auto">
                  <button 
                    type="submit" 
                    className="btn btn-orange px-6 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-l-lg"
                  >
                    بحث
                  </button>
                </div>
              </form>
              
              {/* التصنيفات الرئيسية */}
              <div className="main-categories-list">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {mainCategories.map((category) => (
                    <button
                      key={category.path}
                      onClick={() => setLocation(category.path)}
                      className="item d-block text-center text-white py-6 h-100 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <div className="icn mb-2">
                        <i className={`${category.icon} text-3xl text-orange-500`}></i>
                      </div>
                      <div className="font-size-16">{category.title}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="main-categories-list-end mb-8"></div>

      {/* المحتوى المميز بالتصميم الأصلي */}
      <FeaturedContentWidget 
        title="المميزة" 
        apiEndpoint="/api/content/featured" 
      />
      
      {/* المحتوى الشائع */}
      <FeaturedContentWidget 
        title="الأكثر مشاهدة" 
        apiEndpoint="/api/content/trending" 
      />
      
      {/* المحتوى الأحدث */}
      <FeaturedContentWidget 
        title="أضيف حديثاً" 
        apiEndpoint="/api/content/recent" 
      />

      <div className="container mx-auto px-4 py-8">
        {/* المحتوى المميز */}
        {renderContentGrid(featuredContent, "المحتوى المميز", featuredLoading)}
        
        {/* المحتوى الشائع */}
        {renderContentGrid(trendingContent, "الأكثر مشاهدة", trendingLoading)}
        
        {/* المحتوى المُضاف حديثاً */}
        {renderContentGrid(recentContent, "أُضيف حديثاً", recentLoading)}
        
        {/* أقسام سريعة */}
        <div className="mt-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-orange-500 rounded-full"></div>
            <h2 className="text-2xl font-bold text-white">تصفح الأقسام</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: "أفلام", path: "/movies", icon: "🎬", count: "12+" },
              { title: "مسلسلات", path: "/series", icon: "📺", count: "8+" },
              { title: "البرامج", path: "/programs", icon: "📻", count: "24+" },
              { title: "الألعاب", path: "/games", icon: "🎮", count: "8+" }
            ].map((section) => (
              <div
                key={section.path}
                onClick={() => setLocation(section.path)}
                className="bg-slate-800 rounded-lg p-6 cursor-pointer hover:bg-slate-700 transition-colors duration-200 text-center"
              >
                <div className="text-3xl mb-3">{section.icon}</div>
                <h3 className="text-white font-bold text-lg mb-2">{section.title}</h3>
                <p className="text-white/60 text-sm">{section.count}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}