import { useState } from "react";
import { Film, Tv, Monitor, Music, Heart, User, Star, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useFavorites } from "@/hooks/useUserInteractions";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import ContentGrid from "@/components/content/content-grid";
import EnhancedContentCard from "@/components/content/enhanced-content-card";
import AdvancedVideoPlayer from "@/components/content/advanced-video-player";
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
      <Header />
      <Navigation />
      
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

      {/* User Dashboard (if logged in) */}
      {user && (
        <section className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Welcome Card */}
            <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  مرحباً، {user.firstName || user.username}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-100 mb-3">
                  {user.isAdmin ? "مدير المنصة" : "مستخدم مميز"}
                </p>
                <div className="flex gap-2">
                  <FavoritesModal onContentSelect={handleContentClick}>
                    <Button variant="outline" size="sm" className="text-white border-white hover:bg-white hover:text-blue-600">
                      <Heart className="h-4 w-4 ml-1" />
                      المفضلة ({favoritesData?.content?.length || 0})
                    </Button>
                  </FavoritesModal>
                </div>
              </CardContent>
            </Card>

            {/* Platform Stats */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  إحصائيات المنصة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{statsData?.movies || 0}</div>
                    <div className="text-sm text-gray-600">أفلام</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{statsData?.series || 0}</div>
                    <div className="text-sm text-gray-600">مسلسلات</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{statsData?.tv || 0}</div>
                    <div className="text-sm text-gray-600">تلفزيون</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{statsData?.misc || 0}</div>
                    <div className="text-sm text-gray-600">متنوع</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  الإجراءات السريعة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Link href="/movies" className="w-full">
                    <Button variant="outline" className="w-full justify-start">
                      <Film className="h-4 w-4 ml-2" />
                      تصفح الأفلام
                    </Button>
                  </Link>
                  <Link href="/series" className="w-full">
                    <Button variant="outline" className="w-full justify-start">
                      <Tv className="h-4 w-4 ml-2" />
                      تصفح المسلسلات
                    </Button>
                  </Link>
                  {user.isAdmin && (
                    <Link href="/admin" className="w-full">
                      <Button variant="outline" className="w-full justify-start">
                        <User className="h-4 w-4 ml-2" />
                        لوحة الإدارة
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

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
      
      {/* Enhanced Video Player Modal */}
      {selectedContent && (
        <AdvancedVideoPlayer
          content={selectedContent}
          onClose={() => setSelectedContent(null)}
          autoPlay={true}
        />
      )}
    </div>
  );
}
