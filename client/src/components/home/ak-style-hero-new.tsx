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
    queryFn: async () => {
      const response = await fetch('/api/content/featured');
      if (!response.ok) throw new Error('Failed to fetch featured content');
      return response.json();
    }
  });

  // Fetch latest content
  const { data: latestContent } = useQuery({
    queryKey: ['/api/content/latest'],
    queryFn: async () => {
      const response = await fetch('/api/content/latest');
      if (!response.ok) throw new Error('Failed to fetch latest content');
      return response.json();
    }
  });

  // Fetch trending content
  const { data: trendingContent } = useQuery({
    queryKey: ['/api/content/trending'],
    queryFn: async () => {
      const response = await fetch('/api/content/trending');
      if (!response.ok) throw new Error('Failed to fetch trending content');
      return response.json();
    }
  });

  // Fetch content stats
  const { data: stats } = useQuery({
    queryKey: ['/api/content/stats'],
    queryFn: async () => {
      const response = await fetch('/api/content/stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      return response.json();
    }
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header with Navigation */}
      <header className="bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link to="/">
              <h1 className="text-3xl font-bold">🇾🇪 YEMEN FLIX</h1>
            </Link>
            <nav className="flex items-center gap-6">
              <Link to="/movies" className="hover:text-red-200 transition-colors">أفلام</Link>
              <Link to="/series" className="hover:text-red-200 transition-colors">مسلسلات</Link>
              <Link to="/shows" className="hover:text-red-200 transition-colors">برامج تلفزيونية</Link>
              <Link to="/mix" className="hover:text-red-200 transition-colors">منوعات</Link>
              <Link to="/ones" className="hover:text-red-200 transition-colors">المحتوى المميز</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-red-400 to-yellow-400 bg-clip-text text-transparent">
              اكتشف عالم الترفيه العربي
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              استمتع بأفضل الأفلام والمسلسلات العربية والأجنبية في مكان واحد
            </p>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {stats?.content?.map((stat: any) => (
                <Card key={stat.type} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-white mb-1">{stat.count}</div>
                    <div className="text-sm text-gray-400">
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
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Section Tabs */}
          <div className="flex flex-wrap gap-4 mb-8 justify-center">
            <Button
              variant={selectedSection === 'featured' ? 'default' : 'outline'}
              onClick={() => setSelectedSection('featured')}
              className="flex items-center gap-2"
            >
              <Crown className="w-4 h-4" />
              المحتوى المميز
            </Button>
            <Button
              variant={selectedSection === 'latest' ? 'default' : 'outline'}
              onClick={() => setSelectedSection('latest')}
              className="flex items-center gap-2"
            >
              <Clock className="w-4 h-4" />
              أحدث الإضافات
            </Button>
            <Button
              variant={selectedSection === 'trending' ? 'default' : 'outline'}
              onClick={() => setSelectedSection('trending')}
              className="flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              الأكثر مشاهدة
            </Button>
          </div>

          {/* Section Title */}
          <div className="flex items-center gap-3 mb-8">
            {getSectionIcon()}
            <h3 className="text-2xl font-bold text-white">{getSectionTitle()}</h3>
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
      <section className="py-12 bg-gray-800">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-white mb-8 text-center">تصفح حسب الفئة</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: 'عربي', path: '/movies?category=arabic', color: 'bg-green-600' },
              { name: 'أجنبي', path: '/movies?category=foreign', color: 'bg-blue-600' },
              { name: 'هندي', path: '/movies?category=hindi', color: 'bg-orange-600' },
              { name: 'تركي', path: '/movies?category=turkish', color: 'bg-red-600' },
              { name: 'كوري', path: '/movies?category=korean', color: 'bg-purple-600' },
              { name: 'أنمي', path: '/movies?category=anime', color: 'bg-pink-600' }
            ].map((category) => (
              <Link key={category.name} to={category.path}>
                <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-4">
                    <div className={`w-full h-20 ${category.color} rounded-lg mb-3 flex items-center justify-center group-hover:scale-105 transition-transform`}>
                      <span className="text-white font-bold text-lg">{category.name}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h4 className="text-xl font-bold mb-4">🇾🇪 YEMEN FLIX</h4>
            <p className="text-gray-400 mb-4">
              منصة الترفيه العربية الأولى - استمتع بأفضل المحتوى العربي والأجنبي
            </p>
            <div className="flex justify-center gap-6">
              <Link to="/movies" className="hover:text-red-400 transition-colors">الأفلام</Link>
              <Link to="/series" className="hover:text-red-400 transition-colors">المسلسلات</Link>
              <Link to="/shows" className="hover:text-red-400 transition-colors">البرامج التلفزيونية</Link>
              <Link to="/mix" className="hover:text-red-400 transition-colors">المنوعات</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}