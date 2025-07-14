import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Content } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";

import Footer from "@/components/layout/footer";
import { ResponsiveGrid, ResponsiveSpacing, useResponsive } from "@/components/layout/responsive-layout";
import { EnhancedContentCard } from "@/components/ui/enhanced-content-card";
import { VideoPlayerDemo } from "@/components/ui/video-player-demo";
import { EnhancedHeroSection } from "@/components/ui/enhanced-hero-section";
import { AutoTrailerHero } from "@/components/content/auto-trailer-hero";
import { ContentSection } from "@/components/ui/content-section";
import { useFeaturedTrailer } from "@/hooks/useTrailers";
import { Film, Tv, Star, TrendingUp } from "lucide-react";

export default function Home() {
  const { isMobile } = useResponsive();
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [, setLocation] = useLocation();

  // Fetch recent content
  const { data: recentMovies } = useQuery({
    queryKey: ['/api/content', 'movie'],
    queryFn: () => fetch('/api/content?type=movie&limit=8').then(res => res.json())
  });

  const { data: recentSeries } = useQuery({
    queryKey: ['/api/content', 'series'],
    queryFn: () => fetch('/api/content?type=series&limit=8').then(res => res.json())
  });

  const { data: stats } = useQuery({
    queryKey: ['/api/content/stats'],
    queryFn: () => fetch('/api/content/stats').then(res => res.json())
  });

  const { data: featuredTrailer } = useFeaturedTrailer();

  const statsData = stats ? {
    movies: stats.movies?.toString() || "0",
    series: stats.series?.toString() || "0", 
    tv: stats.tv?.toString() || "0",
    misc: stats.misc?.toString() || "0"
  } : undefined;

  const handleContentClick = (content: Content) => {
    setSelectedContent(content);
  };

  return (
    <div className="min-h-screen">
      
      {/* Featured Trailer Hero - Auto-play */}
      {featuredTrailer && (
        <AutoTrailerHero
          contentId={featuredTrailer.contentId}
          title={featuredTrailer.title}
          description={featuredTrailer.description}
          trailerUrl={featuredTrailer.trailerUrl}
          thumbnailUrl={featuredTrailer.thumbnailUrl}
          rating={featuredTrailer.rating}
          year={featuredTrailer.year}
          genres={featuredTrailer.genres}
          duration={featuredTrailer.duration}
          onWatchNow={() => setLocation(`/content/${featuredTrailer.contentId}`)}
          onAddToList={() => {/* Add to list functionality */}}
          onMoreInfo={() => setLocation(`/content/${featuredTrailer.contentId}`)}
          className="mb-8"
        />
      )}
      
      {/* Enhanced Hero Section */}
      <EnhancedHeroSection 
        title={<img src="/assets/logo_2.png" alt="YEMEN FLIX" className="h-16 mx-auto" />}
        subtitle="منصة السينما اليمنية الرائدة"
        description="اكتشف أفضل الأفلام والمسلسلات اليمنية والعربية والعالمية بجودة عالية. تمتع بتجربة مشاهدة لا تُنسى مع مجموعة واسعة من المحتوى المتميز."
        stats={statsData}
      />

      {/* Featured Movies Section */}
      {recentMovies?.content?.length > 0 && (
        <ContentSection
          title="أحدث الأفلام"
          subtitle="أفضل الأفلام المضافة حديثاً"
          viewAllLink="/movies"
          icon={Film}
          color="text-red-500"
          gradient="from-red-500/20 to-transparent"
        >
          <ResponsiveGrid
            columns={{ mobile: 1, tablet: 2, desktop: 4 }}
            gap={{ mobile: "gap-4", tablet: "gap-6", desktop: "gap-6" }}
          >
            {recentMovies.content.slice(0, 8).map((movie) => (
              <EnhancedContentCard
                key={movie.id}
                content={movie}
                onClick={handleContentClick}
                variant="standard"
              />
            ))}
          </ResponsiveGrid>
        </ContentSection>
      )}

      {/* Featured Series Section */}
      {recentSeries?.content?.length > 0 && (
        <ContentSection
          title="أحدث المسلسلات"
          subtitle="المسلسلات الأكثر مشاهدة"
          viewAllLink="/series"
          icon={Tv}
          color="text-green-500"
          gradient="from-green-500/20 to-transparent"
        >
          <ResponsiveGrid
            columns={{ mobile: 1, tablet: 2, desktop: 4 }}
            gap={{ mobile: "gap-4", tablet: "gap-6", desktop: "gap-6" }}
          >
            {recentSeries.content.slice(0, 8).map((series) => (
              <EnhancedContentCard
                key={series.id}
                content={series}
                onClick={handleContentClick}
                variant="standard"
              />
            ))}
          </ResponsiveGrid>
        </ContentSection>
      )}

      {/* Video Player Demo */}
      {selectedContent && (
        <VideoPlayerDemo 
          content={selectedContent} 
          onClose={() => setSelectedContent(null)} 
        />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}