import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Play, Clock, Calendar, Eye, TrendingUp, Award, Film, Video, Tv, Globe, ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "wouter";

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
  resolution: string;
  rating: number;
  genres: string[];
  categories: string[];
  view_count?: number;
  duration?: number;
}

interface ContentSection {
  title: string;
  icon: React.ReactNode;
  color: string;
  content: Content[];
}

export default function AkHomepage() {
  const [activeSection, setActiveSection] = useState("featured");
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch data from API
  const { data: featuredContent, isLoading: featuredLoading } = useQuery({
    queryKey: ['/api/content/featured'],
    queryFn: async () => {
      const response = await fetch('/api/content/featured');
      return response.json();
    }
  });

  const { data: trendingContent, isLoading: trendingLoading } = useQuery({
    queryKey: ['/api/content/trending'],
    queryFn: async () => {
      const response = await fetch('/api/content/trending');
      return response.json();
    }
  });

  const { data: latestContent, isLoading: latestLoading } = useQuery({
    queryKey: ['/api/content/latest'],
    queryFn: async () => {
      const response = await fetch('/api/content/latest');
      return response.json();
    }
  });

  const { data: contentStats } = useQuery({
    queryKey: ['/api/content/stats'],
    queryFn: async () => {
      const response = await fetch('/api/content/stats');
      return response.json();
    }
  });

  const sections: ContentSection[] = [
    {
      title: "المحتوى المميز",
      icon: <Award className="w-5 h-5" />,
      color: "from-yellow-500 to-orange-500",
      content: featuredContent || []
    },
    {
      title: "الأكثر مشاهدة",
      icon: <TrendingUp className="w-5 h-5" />,
      color: "from-red-500 to-pink-500",
      content: trendingContent || []
    },
    {
      title: "الأحدث",
      icon: <Clock className="w-5 h-5" />,
      color: "from-blue-500 to-purple-500",
      content: latestContent || []
    }
  ];

  const currentSection = sections.find(s => s.title === activeSection) || sections[0];

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % Math.min(currentSection.content.length, 6));
    }, 5000);
    return () => clearInterval(interval);
  }, [currentSection.content.length]);

  const getContentLink = (content: Content) => {
    const slugTitle = content.titleArabic || content.title;
    switch (content.type) {
      case 'movie':
        return `/movie/${content.id}/${slugTitle}`;
      case 'series':
        return `/series/${content.id}/${slugTitle}`;
      case 'television':
        return `/shows/${content.id}/${slugTitle}`;
      default:
        return `/content/${content.id}/${slugTitle}`;
    }
  };

  const ContentCard = ({ content }: { content: Content }) => (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl">
      <Link to={getContentLink(content)}>
        <div className="aspect-[2/3] relative">
          <img 
            src={content.poster_url || '/api/placeholder/300/450'} 
            alt={content.titleArabic || content.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            onError={(e) => {
              e.currentTarget.src = '/api/placeholder/300/450';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary" className="bg-black/50 text-white">
                  {content.quality}
                </Badge>
                <div className="flex items-center gap-1 text-yellow-400">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm">{content.rating}</span>
                </div>
              </div>
              <Button size="sm" className="w-full bg-red-600 hover:bg-red-700">
                <Play className="w-4 h-4 mr-2" />
                مشاهدة الآن
              </Button>
            </div>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-bold text-lg mb-2 line-clamp-2 text-right">
            {content.titleArabic || content.title}
          </h3>
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>{content.release_year}</span>
            <span>{content.language}</span>
          </div>
          <div className="flex flex-wrap gap-1 mb-2">
            {content.genres?.slice(0, 2).map((genre, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {genre}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Link>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-red-600 via-black to-white overflow-hidden">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-6xl font-bold mb-4">
              🇾🇪 YEMEN FLIX
            </h1>
            <p className="text-xl mb-6">منصة المحتوى العربي الأولى - مطابق لموقع اكوام الأصلي</p>
            <div className="flex justify-center gap-4">
              {contentStats?.content.map((stat: any, index: number) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold">{stat.count}</div>
                  <div className="text-sm opacity-90">{stat.type}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Section Tabs */}
        <Tabs value={activeSection} onValueChange={setActiveSection} className="mb-8">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="featured" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              المحتوى المميز
            </TabsTrigger>
            <TabsTrigger value="trending" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              الأكثر مشاهدة
            </TabsTrigger>
            <TabsTrigger value="latest" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              الأحدث
            </TabsTrigger>
          </TabsList>

          {/* Featured Content Slider */}
          <TabsContent value="featured">
            <div className="relative">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
                {featuredContent?.slice(0, 6).map((content: Content, index: number) => (
                  <ContentCard key={content.id} content={content} />
                ))}
              </div>
              <div className="text-center mt-8">
                <Link to="/ones">
                  <Button variant="outline" size="lg" className="bg-gradient-to-r from-red-600 to-black text-white hover:from-red-700 hover:to-gray-800">
                    عرض المزيد من المحتوى المميز
                    <ArrowLeft className="w-4 h-4 mr-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </TabsContent>

          {/* Trending Content */}
          <TabsContent value="trending">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
              {trendingContent?.slice(0, 6).map((content: Content) => (
                <ContentCard key={content.id} content={content} />
              ))}
            </div>
          </TabsContent>

          {/* Latest Content */}
          <TabsContent value="latest">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
              {latestContent?.slice(0, 6).map((content: Content) => (
                <ContentCard key={content.id} content={content} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
          <Link to="/movies">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-red-50 to-red-100 border-red-200">
              <Film className="w-12 h-12 mx-auto mb-4 text-red-600" />
              <h3 className="font-bold text-lg text-red-800">الأفلام</h3>
              <p className="text-sm text-red-600 mt-2">مجموعة ضخمة من الأفلام</p>
            </Card>
          </Link>
          <Link to="/series">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <Video className="w-12 h-12 mx-auto mb-4 text-green-600" />
              <h3 className="font-bold text-lg text-green-800">المسلسلات</h3>
              <p className="text-sm text-green-600 mt-2">أحدث المسلسلات العربية والأجنبية</p>
            </Card>
          </Link>
          <Link to="/shows">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <Tv className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <h3 className="font-bold text-lg text-blue-800">البرامج التلفزيونية</h3>
              <p className="text-sm text-blue-600 mt-2">برامج تلفزيونية متنوعة</p>
            </Card>
          </Link>
          <Link to="/misc">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <Globe className="w-12 h-12 mx-auto mb-4 text-purple-600" />
              <h3 className="font-bold text-lg text-purple-800">منوعات</h3>
              <p className="text-sm text-purple-600 mt-2">محتوى متنوع ومميز</p>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}