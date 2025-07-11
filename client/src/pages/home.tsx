import { useState } from "react";
import { Film, Tv, Monitor, Music, Heart, User, Star, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useFavorites } from "@/hooks/useUserInteractions";
import { useQuery } from "@tanstack/react-query";

import Footer from "@/components/layout/footer";
import ContentGrid from "@/components/content/content-grid";
import EnhancedContentCard from "@/components/content/enhanced-content-card";
import { VideoPlayerDemo } from "@/components/ui/video-player-demo";
import FavoritesModal from "@/components/user/favorites-modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/layout/ui/card";
import { Button } from "@/components/layout/ui/button";
import { Badge } from "@/components/layout/ui/badge";
import { CONTENT_TYPES } from "@/lib/constants";
import { Content } from "@shared/schema";

export default function Home() {
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const { user } = useAuth();
  const { data: favoritesData } = useFavorites(user?.id);
  const { data: statsData } = useQuery({
    queryKey: ["/api/stats"],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Get recent content for featured sections
  const { data: recentMovies } = useQuery({
    queryKey: ["/api/content/movie"],
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const { data: recentSeries } = useQuery({
    queryKey: ["/api/content/series"],
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const handleContentClick = (content: Content) => {
    setSelectedContent(content);
  };

  return (
    <div className="min-h-screen">
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay" />
        
        {/* Background decorative elements */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl" />

        {/* Central content */}
        <div className="relative z-10 text-center">
          <div className="hero-logo">
            <div className="hero-logo-inner">
              <svg className="w-16 h-16 text-accent" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4 gradient-text">
            أكاديمية السينما
          </h1>
          
          <p className="text-xl text-muted mb-8 max-w-2xl mx-auto">
            استمتع بمشاهدة أحدث الأفلام والمسلسلات العربية والأجنبية بجودة عالية
          </p>
          
          {/* Quick Navigation */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <Link href="/movies" className="quick-nav-card">
              <Film className="w-8 h-8 text-accent mb-3 mx-auto" />
              <p className="font-semibold">الأفلام</p>
            </Link>
            
            <Link href="/series" className="quick-nav-card">
              <Tv className="w-8 h-8 text-accent mb-3 mx-auto" />
              <p className="font-semibold">المسلسلات</p>
            </Link>
            
            <Link href="/television" className="quick-nav-card">
              <Monitor className="w-8 h-8 text-accent mb-3 mx-auto" />
              <p className="font-semibold">التلفزيون</p>
            </Link>
            
            <Link href="/miscellaneous" className="quick-nav-card">
              <Music className="w-8 h-8 text-accent mb-3 mx-auto" />
              <p className="font-semibold">المنوعات</p>
            </Link>
          </div>
        </div>
      </section>



      {/* Video Player Demo Section */}
      <section className="section-bg py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 gradient-text">
              مشغل الفيديو المتقدم الجديد
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              استمتع بتجربة مشاهدة محسنة مع إعدادات الجودة المتعددة وخيارات السرعة والترجمة
            </p>
          </div>
          
          <VideoPlayerDemo
            contentId={999}
            title="Big Buck Bunny - Demo Video"
            titleArabic="فيديو تجريبي - أرنب الدولارات الكبير"
            posterUrl="https://images.unsplash.com/photo-1489599088293-daa0c0f60f0e?w=800&h=450&fit=crop"
            videoUrl="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
            <div className="text-center p-6 bg-card rounded-lg border">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">جودة متعددة</h3>
              <p className="text-sm text-muted-foreground">
                اختر من بين 480p، 720p، 1080p، و 4K
              </p>
            </div>
            
            <div className="text-center p-6 bg-card rounded-lg border">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">متابعة المشاهدة</h3>
              <p className="text-sm text-muted-foreground">
                احفظ تقدمك وتابع من حيث توقفت
              </p>
            </div>
            
            <div className="text-center p-6 bg-card rounded-lg border">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">ترجمات متعددة</h3>
              <p className="text-sm text-muted-foreground">
                دعم للترجمة العربية والإنجليزية
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Movies */}
      <section className="section-bg">
        <div className="container mx-auto px-4">
          <ContentGrid
            contentType={CONTENT_TYPES.MOVIE}
            title="أحدث الأفلام"
            showViewAll={true}
            onContentClick={handleContentClick}
          />
        </div>
      </section>

      {/* Featured Series */}
      <section className="section-bg-alt">
        <div className="container mx-auto px-4">
          <ContentGrid
            contentType={CONTENT_TYPES.SERIES}
            title="أحدث المسلسلات"
            showViewAll={true}
            onContentClick={handleContentClick}
          />
        </div>
      </section>

      {/* TV Shows */}
      <section className="section-bg">
        <div className="container mx-auto px-4">
          <ContentGrid
            contentType={CONTENT_TYPES.TV}
            title="برامج التلفزيون"
            showViewAll={true}
            onContentClick={handleContentClick}
          />
        </div>
      </section>

      {/* Miscellaneous */}
      <section className="section-bg-alt">
        <div className="container mx-auto px-4">
          <ContentGrid
            contentType={CONTENT_TYPES.MISC}
            title="المنوعات"
            showViewAll={true}
            onContentClick={handleContentClick}
          />
        </div>
      </section>

      <Footer />
      
      {/* Video Player Modal (will be replaced with new Advanced Player) */}
      {selectedContent && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <div className="relative w-full h-full max-w-6xl">
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
              onClick={() => setSelectedContent(null)}
            >
              ✕
            </Button>
            <p className="text-white text-center mt-20">
              مشغل الفيديو التجريبي - استخدم القسم التجريبي أعلاه لاختبار المشغل المتقدم
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
