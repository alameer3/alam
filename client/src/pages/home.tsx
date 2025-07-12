import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Content } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";

import Footer from "@/components/layout/footer";
import { ResponsiveGrid, ResponsiveSpacing, useResponsive } from "@/components/layout/responsive-layout";
import { EnhancedContentCard } from "@/components/ui/enhanced-content-card";
import { VideoPlayerDemo } from "@/components/ui/video-player-demo";
import { EnhancedHeroSection } from "@/components/ui/enhanced-hero-section";

export default function Home() {
  const { isMobile } = useResponsive();
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);

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
      
      {/* Enhanced Hero Section */}
      <EnhancedHeroSection 
        title="𝐘𝐄𝐌𝐄𝐍 🇾🇪 𝐅𝐋𝐈𝐗"
        subtitle="منصة السينما اليمنية الرائدة"
        description="اكتشف أفضل الأفلام والمسلسلات اليمنية والعربية والعالمية بجودة عالية. تمتع بتجربة مشاهدة لا تُنسى مع مجموعة واسعة من المحتوى المتميز."
        stats={statsData}
      />

      {/* Content Sections */}
      <section className="py-16">
        <ResponsiveSpacing 
          padding={{ mobile: "px-4", tablet: "px-6", desktop: "px-8" }}
        >
          {/* Featured Movies Section */}
          {recentMovies?.content?.length > 0 && (
            <div className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className={`font-bold gradient-text ${
                  isMobile ? "text-2xl" : "text-3xl"
                }`}>
                  أحدث الأفلام
                </h2>
                <Button variant="outline" size="sm">
                  عرض الكل
                </Button>
              </div>
              
              <ResponsiveGrid
                columns={{ mobile: 1, tablet: 2, desktop: 4 }}
                gap={{ mobile: "gap-4", tablet: "gap-6", desktop: "gap-6" }}
                className="mb-8"
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
            </div>
          )}

          {/* Featured Series Section */}
          {recentSeries?.content?.length > 0 && (
            <div className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className={`font-bold gradient-text ${
                  isMobile ? "text-2xl" : "text-3xl"
                }`}>
                  أحدث المسلسلات
                </h2>
                <Button variant="outline" size="sm">
                  عرض الكل
                </Button>
              </div>
              
              <ResponsiveGrid
                columns={{ mobile: 1, tablet: 2, desktop: 4 }}
                gap={{ mobile: "gap-4", tablet: "gap-6", desktop: "gap-6" }}
                className="mb-8"
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
            </div>
          )}
        </ResponsiveSpacing>
      </section>

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