import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Play, Calendar, Eye, Award, TrendingUp, Clock, Film, Video, Tv, Globe } from "lucide-react";
import { Link } from "wouter";
import AkHeader from "@/components/layout/ak-header";

interface Content {
  id: number;
  title: string;
  titleArabic?: string;
  description: string;
  type: string;
  poster_url: string;
  release_year: number;
  language: string;
  quality: string;
  rating: number;
  genres: string[];
  view_count?: number;
  duration?: number;
}

export default function Ones() {
  const [activeTab, setActiveTab] = useState("featured");

  const { data: featuredContent } = useQuery({
    queryKey: ['/api/content/featured'],
    queryFn: async () => {
      const response = await fetch('/api/content/featured');
      return response.json();
    }
  });

  const { data: topRatedContent } = useQuery({
    queryKey: ['/api/content/top-rated'],
    queryFn: async () => {
      const response = await fetch('/api/content/featured');
      return response.json();
    }
  });

  const { data: recentContent } = useQuery({
    queryKey: ['/api/content/latest'],
    queryFn: async () => {
      const response = await fetch('/api/content/latest');
      return response.json();
    }
  });

  const getContentLink = (content: Content) => {
    const slugTitle = content.titleArabic || content.title;
    switch (content.type) {
      case 'movie':
        return `/movie/${content.id}/${slugTitle}`;
      case 'series':
        return `/series/${content.id}/${slugTitle}`;
      case 'television':
        return `/shows/${content.id}/${slugTitle}`;
      case 'misc':
        return `/mix/${content.id}/${slugTitle}`;
      default:
        return `/content/${content.id}/${slugTitle}`;
    }
  };

  const ContentCard = ({ content }: { content: Content }) => (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-white">
      <Link to={getContentLink(content)}>
        <div className="aspect-[2/3] relative">
          <img 
            src={content.poster_url || '/api/placeholder/300/450'} 
            alt={content.titleArabic || content.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          
          <Badge 
            variant="secondary" 
            className="absolute top-2 right-2 bg-red-600 text-white border-0 shadow-lg"
          >
            {content.quality}
          </Badge>

          <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/80 text-white px-2 py-1 rounded-full text-sm">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span>{content.rating}</span>
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-white text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>{content.release_year}</span>
                </div>
                <div className="flex items-center gap-2 text-white text-sm">
                  <Eye className="w-4 h-4" />
                  <span>{content.view_count || 0}</span>
                </div>
              </div>
              <Button size="sm" className="w-full bg-red-600 hover:bg-red-700 text-white">
                <Play className="w-4 h-4 mr-2" />
                مشاهدة الآن
              </Button>
            </div>
          </div>
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-bold text-lg mb-2 line-clamp-2 text-right text-gray-800">
            {content.titleArabic || content.title}
          </h3>
          <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
            <span>{content.language}</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {content.duration || 120} دقيقة
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {content.genres?.slice(0, 2).map((genre, index) => (
              <Badge key={index} variant="outline" className="text-xs border-red-200 text-red-600">
                {genre}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Link>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <AkHeader />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3">
            <div className="p-3 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500">
              <Award className="w-8 h-8 text-white" />
            </div>
            المحتوى المميز
          </h1>
          <p className="text-xl text-gray-600">اكتشف أفضل المحتوى العربي والأجنبي المختار بعناية</p>
        </div>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-white shadow-lg rounded-xl p-2">
            <TabsTrigger 
              value="featured" 
              className="flex items-center gap-2 text-lg py-4 data-[state=active]:bg-yellow-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
            >
              <Award className="w-5 h-5" />
              المحتوى المميز
            </TabsTrigger>
            <TabsTrigger 
              value="top-rated" 
              className="flex items-center gap-2 text-lg py-4 data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
            >
              <TrendingUp className="w-5 h-5" />
              الأعلى تقييماً
            </TabsTrigger>
            <TabsTrigger 
              value="recent" 
              className="flex items-center gap-2 text-lg py-4 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
            >
              <Clock className="w-5 h-5" />
              المضاف حديثاً
            </TabsTrigger>
          </TabsList>

          {/* Featured Content */}
          <TabsContent value="featured">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">المحتوى المميز</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
                {featuredContent?.map((content: Content) => (
                  <ContentCard key={content.id} content={content} />
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Top Rated Content */}
          <TabsContent value="top-rated">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">الأعلى تقييماً</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
                {topRatedContent?.map((content: Content) => (
                  <ContentCard key={content.id} content={content} />
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Recent Content */}
          <TabsContent value="recent">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">المضاف حديثاً</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
                {recentContent?.map((content: Content) => (
                  <ContentCard key={content.id} content={content} />
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Categories Quick Access */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">تصفح حسب الفئة</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link to="/movies">
              <Card className="group p-6 text-center hover:shadow-xl transition-all duration-300 cursor-pointer bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:scale-105">
                <div className="bg-red-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Film className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-xl text-red-800 mb-2">الأفلام</h3>
                <p className="text-red-600">أفلام مميزة ومختارة</p>
              </Card>
            </Link>
            
            <Link to="/series">
              <Card className="group p-6 text-center hover:shadow-xl transition-all duration-300 cursor-pointer bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:scale-105">
                <div className="bg-green-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Video className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-xl text-green-800 mb-2">المسلسلات</h3>
                <p className="text-green-600">مسلسلات عربية وأجنبية</p>
              </Card>
            </Link>
            
            <Link to="/shows">
              <Card className="group p-6 text-center hover:shadow-xl transition-all duration-300 cursor-pointer bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:scale-105">
                <div className="bg-blue-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Tv className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-xl text-blue-800 mb-2">البرامج</h3>
                <p className="text-blue-600">برامج تلفزيونية متنوعة</p>
              </Card>
            </Link>
            
            <Link to="/mix">
              <Card className="group p-6 text-center hover:shadow-xl transition-all duration-300 cursor-pointer bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:scale-105">
                <div className="bg-purple-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-xl text-purple-800 mb-2">منوعات</h3>
                <p className="text-purple-600">محتوى متنوع ومميز</p>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}