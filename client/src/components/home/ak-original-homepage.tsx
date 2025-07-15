import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Crown, Clock, TrendingUp, Film, Tv, Monitor, Package } from "lucide-react";
import { Link } from "wouter";
import AkOriginalContentCard from "@/components/content/ak-original-content-card";
import { useState } from "react";

export default function AkOriginalHomepage() {
  const [activeSection, setActiveSection] = useState('featured');

  // Fetch featured content
  const { data: featuredContent } = useQuery({
    queryKey: ['/api/content/featured'],
  });

  // Fetch trending content
  const { data: trendingContent } = useQuery({
    queryKey: ['/api/content/trending'],
  });

  // Fetch latest content
  const { data: latestContent } = useQuery({
    queryKey: ['/api/content/latest'],
  });

  // Fetch content stats
  const { data: stats } = useQuery({
    queryKey: ['/api/content/stats'],
  });

  const getCurrentContent = () => {
    switch (activeSection) {
      case 'featured':
        return featuredContent || [];
      case 'trending':
        return trendingContent || [];
      case 'latest':
        return latestContent || [];
      default:
        return [];
    }
  };

  return (
    <div className="ak-section">
      {/* Hero Section */}
      <section className="ak-section">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              اكوام - شمس المواقع
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              موقع التحميل والمشاهدة العربي الأول
            </p>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {stats?.content?.map((stat: any, index: number) => (
                <Card key={`stat-${index}`} className="ak-card">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl mb-2">
                      {stat.type === 'movies' && <Film className="h-8 w-8 mx-auto text-primary" />}
                      {stat.type === 'series' && <Tv className="h-8 w-8 mx-auto text-primary" />}
                      {stat.type === 'tv' && <Monitor className="h-8 w-8 mx-auto text-primary" />}
                      {stat.type === 'misc' && <Package className="h-8 w-8 mx-auto text-primary" />}
                    </div>
                    <div className="text-2xl font-bold text-foreground">{stat.count}</div>
                    <div className="text-sm text-muted-foreground">
                      {stat.type === 'movies' && 'فيلم'}
                      {stat.type === 'series' && 'مسلسل'}
                      {stat.type === 'tv' && 'برنامج'}
                      {stat.type === 'misc' && 'منوعات'}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Categories */}
      <section className="ak-section">
        <div className="container mx-auto px-4">
          <h2 className="ak-section-title">التصنيفات السريعة</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/movies">
              <Card className="ak-card hover:border-primary transition-colors">
                <CardContent className="p-6 text-center">
                  <Film className="h-12 w-12 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold text-foreground">أفلام</h3>
                  <p className="text-sm text-muted-foreground">أحدث الأفلام</p>
                </CardContent>
              </Card>
            </Link>
            <Link to="/series">
              <Card className="ak-card hover:border-primary transition-colors">
                <CardContent className="p-6 text-center">
                  <Tv className="h-12 w-12 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold text-foreground">مسلسلات</h3>
                  <p className="text-sm text-muted-foreground">أحدث المسلسلات</p>
                </CardContent>
              </Card>
            </Link>
            <Link to="/shows">
              <Card className="ak-card hover:border-primary transition-colors">
                <CardContent className="p-6 text-center">
                  <Monitor className="h-12 w-12 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold text-foreground">تلفزيون</h3>
                  <p className="text-sm text-muted-foreground">البرامج التلفزيونية</p>
                </CardContent>
              </Card>
            </Link>
            <Link to="/mix">
              <Card className="ak-card hover:border-primary transition-colors">
                <CardContent className="p-6 text-center">
                  <Package className="h-12 w-12 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold text-foreground">منوعات</h3>
                  <p className="text-sm text-muted-foreground">محتوى متنوع</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <section className="ak-section">
        <div className="container mx-auto px-4">
          {/* Section Tabs */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-reverse space-x-2 bg-secondary/50 p-1 rounded-lg">
              <Button
                variant={activeSection === 'featured' ? 'default' : 'ghost'}
                onClick={() => setActiveSection('featured')}
                className="flex items-center space-x-reverse space-x-2"
              >
                <Crown className="h-4 w-4" />
                <span>مميز</span>
              </Button>
              <Button
                variant={activeSection === 'trending' ? 'default' : 'ghost'}
                onClick={() => setActiveSection('trending')}
                className="flex items-center space-x-reverse space-x-2"
              >
                <TrendingUp className="h-4 w-4" />
                <span>الأكثر مشاهدة</span>
              </Button>
              <Button
                variant={activeSection === 'latest' ? 'default' : 'ghost'}
                onClick={() => setActiveSection('latest')}
                className="flex items-center space-x-reverse space-x-2"
              >
                <Clock className="h-4 w-4" />
                <span>أحدث الإضافات</span>
              </Button>
            </div>
          </div>

          {/* Section Title */}
          <div className="flex items-center space-x-reverse space-x-3 mb-6">
            {activeSection === 'featured' && <Crown className="h-6 w-6 text-primary" />}
            {activeSection === 'trending' && <TrendingUp className="h-6 w-6 text-primary" />}
            {activeSection === 'latest' && <Clock className="h-6 w-6 text-primary" />}
            <h2 className="text-2xl font-bold text-foreground">
              {activeSection === 'featured' && 'المحتوى المميز'}
              {activeSection === 'trending' && 'الأكثر مشاهدة'}
              {activeSection === 'latest' && 'أحدث الإضافات'}
            </h2>
          </div>

          {/* Content Grid */}
          <div className="ak-responsive-grid">
            {getCurrentContent().map((item: any, index: number) => (
              <AkOriginalContentCard
                key={`content-${index}`}
                id={item.id}
                title={item.title}
                titleAr={item.titleAr}
                image={item.image || `/api/placeholder/300/450`}
                type={item.type}
                year={item.year}
                rating={item.rating}
                views={item.views}
                quality={item.quality}
                duration={item.duration}
              />
            ))}
          </div>

          {/* Show More Button */}
          <div className="text-center mt-8">
            <Link to={`/${activeSection === 'featured' ? 'ones' : activeSection}`}>
              <Button className="ak-button">
                عرض المزيد
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}