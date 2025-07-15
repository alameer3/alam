import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Star, Clock, Calendar, TrendingUp, Crown, Fire } from "lucide-react";
import { Link } from "wouter";
import AdvancedContentGrid from "@/components/content/advanced-content-grid";
import { useState } from "react";

export default function AkStyleHeroNew() {
  const [selectedSection, setSelectedSection] = useState('featured');

  // Fetch featured content
  const { data: featuredContent } = useQuery({
    queryKey: ['/api/content/featured'],
  });

  // Fetch latest content
  const { data: latestContent } = useQuery({
    queryKey: ['/api/content/latest'],
  });

  // Fetch trending content
  const { data: trendingContent } = useQuery({
    queryKey: ['/api/content/trending'],
  });

  // Fetch content stats
  const { data: stats } = useQuery({
    queryKey: ['/api/content/stats'],
  });

  const getCurrentContent = () => {
    switch (selectedSection) {
      case 'featured':
        return featuredContent || [];
      case 'latest':
        return latestContent || [];
      case 'trending':
        return trendingContent || [];
      default:
        return [];
    }
  };

  const getSectionTitle = () => {
    switch (selectedSection) {
      case 'featured':
        return 'المحتوى المميز';
      case 'latest':
        return 'أحدث الإضافات';
      case 'trending':
        return 'الأكثر مشاهدة';
      default:
        return 'المحتوى المميز';
    }
  };

  const getSectionIcon = () => {
    switch (selectedSection) {
      case 'featured':
        return <Crown className="w-5 h-5" />;
      case 'latest':
        return <Clock className="w-5 h-5" />;
      case 'trending':
        return <TrendingUp className="w-5 h-5" />;
      default:
        return <Crown className="w-5 h-5" />;
    }
  };

  return (
    <div className="bg-gray-50">
      {/* Hero Section - ak.sv style */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2 text-gray-800">
              مرحباً بكم في اكوام
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              استمتع بأفضل الأفلام والمسلسلات العربية والأجنبية
            </p>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {stats?.content?.map((stat: any) => (
                <Card key={stat.type} className="bg-white border border-gray-200 shadow-sm">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-gray-800 mb-1">{stat.count}</div>
                    <div className="text-sm text-gray-600">
                      {stat.type === 'movies' && 'فيلم'}
                      {stat.type === 'series' && 'مسلسل'}
                      {stat.type === 'tv' && 'برنامج تلفزيوني'}
                      {stat.type === 'misc' && 'منوعات'}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-6">
        <div className="container mx-auto px-4">
          {/* Section Tabs */}
          <div className="flex flex-wrap gap-3 mb-6 justify-center">
            <Button
              variant={selectedSection === 'featured' ? 'default' : 'outline'}
              onClick={() => setSelectedSection('featured')}
              className="flex items-center gap-2 text-sm"
            >
              <Crown className="w-4 h-4" />
              المحتوى المميز
            </Button>
            <Button
              variant={selectedSection === 'latest' ? 'default' : 'outline'}
              onClick={() => setSelectedSection('latest')}
              className="flex items-center gap-2 text-sm"
            >
              <Clock className="w-4 h-4" />
              أحدث الإضافات
            </Button>
            <Button
              variant={selectedSection === 'trending' ? 'default' : 'outline'}
              onClick={() => setSelectedSection('trending')}
              className="flex items-center gap-2 text-sm"
            >
              <TrendingUp className="w-4 h-4" />
              الأكثر مشاهدة
            </Button>
          </div>

          {/* Section Title */}
          <div className="flex items-center gap-3 mb-6">
            {getSectionIcon()}
            <h3 className="text-xl font-bold text-gray-800">{getSectionTitle()}</h3>
          </div>

          {/* Content Grid */}
          <AdvancedContentGrid
            content={getCurrentContent()}
            loading={false}
            error={undefined}
          />
        </div>
      </section>

      {/* Quick Access Categories */}
      <section className="py-6 bg-gray-50">
        <div className="container mx-auto px-4">
          <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">تصفح حسب الفئة</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: 'عربي', path: '/movies?category=arabic', color: 'bg-green-500' },
              { name: 'أجنبي', path: '/movies?category=foreign', color: 'bg-blue-500' },
              { name: 'هندي', path: '/movies?category=hindi', color: 'bg-orange-500' },
              { name: 'تركي', path: '/movies?category=turkish', color: 'bg-red-500' },
              { name: 'كوري', path: '/movies?category=korean', color: 'bg-purple-500' },
              { name: 'أنمي', path: '/movies?category=anime', color: 'bg-pink-500' }
            ].map((category) => (
              <Link key={category.name} to={category.path}>
                <Card className="hover:shadow-md transition-all duration-200 cursor-pointer group bg-white border border-gray-200">
                  <CardContent className="p-3">
                    <div className={`w-full h-16 ${category.color} rounded-lg mb-2 flex items-center justify-center group-hover:scale-105 transition-transform`}>
                      <span className="text-white font-medium text-sm">{category.name}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}