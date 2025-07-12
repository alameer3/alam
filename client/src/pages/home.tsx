import { useState } from "react";
import { Film, Tv, Monitor, Music, Heart, User, Star, TrendingUp, Brain, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useFavorites } from "@/hooks/useUserInteractions";
import { useQuery } from "@tanstack/react-query";

import Footer from "@/components/layout/footer";
import { ResponsiveContentList } from "@/components/content/responsive-content-list";
import { ResponsiveGrid, ResponsiveSpacing, useResponsive } from "@/components/layout/responsive-layout";
import { EnhancedContentCard } from "@/components/content/enhanced-content-card";
import { VideoPlayerDemo } from "@/components/ui/video-player-demo";
import FavoritesModal from "@/components/user/favorites-modal";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CONTENT_TYPES } from "@/lib/constants";
import { Content } from "@shared/schema";

export default function Home() {
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const { user } = useAuth();
  const { isMobile, isTablet } = useResponsive();
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
      <section className="hero-section relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20 py-16 lg:py-24">
        
        {/* Background decorative elements */}
        {!isMobile && (
          <>
            <div className="absolute top-20 left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />
          </>
        )}

        {/* Central content */}
        <ResponsiveSpacing 
          padding={{ mobile: "px-4 py-8", tablet: "px-6 py-12", desktop: "px-8 py-16" }}
          className="relative z-10"
        >
            <div className="text-center max-w-4xl mx-auto">
              <div className="hero-logo mb-6">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center shadow-2xl">
                  <svg className="w-10 h-10 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
              
              <h1 className={`font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent ${
                isMobile ? "text-3xl" : "text-4xl md:text-6xl"
              }`}>
                YEMEN 🇾🇪 FLIX
              </h1>
              
              <p className={`text-muted-foreground mb-8 max-w-2xl mx-auto ${
                isMobile ? "text-lg" : "text-xl"
              }`}>
                استمتع بمشاهدة أحدث الأفلام والمسلسلات العربية والأجنبية من اليمن إلى العالم
              </p>
              
              {/* Quick Navigation */}
              <ResponsiveGrid 
                cols={{ mobile: 2, tablet: 4, desktop: 4 }}
                gap={isMobile ? "gap-3" : "gap-4"}
                className="max-w-2xl mx-auto"
              >
                <Link href="/movies" className="group p-4 bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl hover:bg-card/80 transition-all duration-300 hover:scale-105">
                  <Film className={`text-primary mb-3 mx-auto ${isMobile ? "w-6 h-6" : "w-8 h-8"}`} />
                  <p className="font-semibold text-sm group-hover:text-primary transition-colors">الأفلام</p>
                </Link>
                
                <Link href="/series" className="group p-4 bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl hover:bg-card/80 transition-all duration-300 hover:scale-105">
                  <Tv className={`text-primary mb-3 mx-auto ${isMobile ? "w-6 h-6" : "w-8 h-8"}`} />
                  <p className="font-semibold text-sm group-hover:text-primary transition-colors">المسلسلات</p>
                </Link>
                
                <Link href="/television" className="group p-4 bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl hover:bg-card/80 transition-all duration-300 hover:scale-105">
                  <Monitor className={`text-primary mb-3 mx-auto ${isMobile ? "w-6 h-6" : "w-8 h-8"}`} />
                  <p className="font-semibold text-sm group-hover:text-primary transition-colors">التلفزيون</p>
                </Link>
                
                <Link href="/miscellaneous" className="group p-4 bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl hover:bg-card/80 transition-all duration-300 hover:scale-105">
                  <Music className={`text-primary mb-3 mx-auto ${isMobile ? "w-6 h-6" : "w-8 h-8"}`} />
                  <p className="font-semibold text-sm group-hover:text-primary transition-colors">المنوعات</p>
                </Link>
              </ResponsiveGrid>
            </div>
          </ResponsiveSpacing>
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
      <ResponsiveSpacing className="bg-muted/20">
        <ResponsiveContentList
          content={recentMovies?.content?.slice(0, isMobile ? 4 : 8) || []}
          loading={!recentMovies}
          title="أحدث الأفلام"
          showViewOptions={!isMobile}
          showSortOptions={!isMobile}
          showFilterOptions={false}
        />
      </ResponsiveSpacing>

      {/* Featured Series */}
      <ResponsiveSpacing className="bg-background">
        <ResponsiveContentList
          content={recentSeries?.content?.slice(0, isMobile ? 4 : 8) || []}
          loading={!recentSeries}
          title="أحدث المسلسلات"
          showViewOptions={!isMobile}
          showSortOptions={!isMobile}
          showFilterOptions={false}
        />
      </ResponsiveSpacing>

      {/* Statistics Section */}
      <ResponsiveSpacing className="bg-muted/20">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            إحصائيات المحتوى
          </h2>
          <p className="text-muted-foreground">
            استكشف مكتبتنا الضخمة من المحتوى المتنوع
          </p>
        </div>
        
        <ResponsiveGrid 
          cols={{ mobile: 2, tablet: 4, desktop: 4 }}
          gap={isMobile ? "gap-4" : "gap-6"}
          className="max-w-4xl mx-auto"
        >
          <Card className="text-center p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-0">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Film className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-2">
                {statsData?.movies || "0"}
              </h3>
              <p className="text-sm text-muted-foreground">فيلم</p>
            </CardContent>
          </Card>
          
          <Card className="text-center p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-0">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Tv className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-2">
                {statsData?.series || "0"}
              </h3>
              <p className="text-sm text-muted-foreground">مسلسل</p>
            </CardContent>
          </Card>
          
          <Card className="text-center p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-0">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Monitor className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-2">
                {statsData?.tv || "0"}
              </h3>
              <p className="text-sm text-muted-foreground">برنامج تلفزيوني</p>
            </CardContent>
          </Card>
          
          <Card className="text-center p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-0">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Music className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-2">
                {statsData?.misc || "0"}
              </h3>
              <p className="text-sm text-muted-foreground">متنوع</p>
            </CardContent>
          </Card>
        </ResponsiveGrid>
      </ResponsiveSpacing>

      <Footer />
      
      {/* Video Player Modal */}
      {selectedContent && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative w-full h-full max-w-6xl bg-background rounded-lg overflow-hidden">
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
