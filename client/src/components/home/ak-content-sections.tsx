import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Play, Clock, Calendar, Eye, TrendingUp, Award, Film, Video, Tv, Globe, ArrowLeft } from "lucide-react";
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
  rating: number;
  genres: string[];
  view_count?: number;
  duration?: number;
}

export default function AkContentSections() {
  const [activeSection, setActiveSection] = useState("featured");

  const { data: featuredContent } = useQuery({
    queryKey: ['/api/content/featured'],
    queryFn: async () => {
      const response = await fetch('/api/content/featured');
      return response.json();
    }
  });

  const { data: trendingContent } = useQuery({
    queryKey: ['/api/content/trending'],
    queryFn: async () => {
      const response = await fetch('/api/content/trending');
      return response.json();
    }
  });

  const { data: latestContent } = useQuery({
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
            onError={(e) => {
              e.currentTarget.src = '/api/placeholder/300/450';
            }}
          />
          
          {/* Quality Badge */}
          {content.quality && (
            <Badge 
              variant="secondary" 
              className="absolute top-2 right-2 bg-red-600 text-white border-0 shadow-lg"
            >
              {content.quality}
            </Badge>
          )}

          {/* Rating */}
          {content.rating && (
            <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/80 text-white px-2 py-1 rounded-full text-sm">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span>{content.rating}</span>
            </div>
          )}

          {/* Hover Overlay */}
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

  const sections = [
    {
      id: "featured",
      title: "المحتوى المميز",
      icon: <Award className="w-5 h-5" />,
      color: "from-yellow-500 to-orange-500",
      content: featuredContent || [],
      link: "/ones"
    },
    {
      id: "trending",
      title: "الأكثر مشاهدة",
      icon: <TrendingUp className="w-5 h-5" />,
      color: "from-red-500 to-pink-500",
      content: trendingContent || [],
      link: "/trending"
    },
    {
      id: "latest",
      title: "الأحدث",
      icon: <Clock className="w-5 h-5" />,
      color: "from-blue-500 to-purple-500",
      content: latestContent || [],
      link: "/latest"
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        {/* Enhanced Section Tabs */}
        <Tabs value={activeSection} onValueChange={setActiveSection} className="mb-12">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-white shadow-lg rounded-xl p-2">
            {sections.map((section) => (
              <TabsTrigger 
                key={section.id}
                value={section.id} 
                className="flex items-center gap-2 text-lg py-4 data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
              >
                {section.icon}
                {section.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {sections.map((section) => (
            <TabsContent key={section.id} value={section.id}>
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                    <div className={`p-3 rounded-full bg-gradient-to-r ${section.color}`}>
                      {section.icon}
                    </div>
                    {section.title}
                  </h2>
                  <Link to={section.link}>
                    <Button 
                      variant="outline" 
                      className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white px-6 py-3 text-lg rounded-full"
                    >
                      عرض الكل
                      <ArrowLeft className="w-4 h-4 mr-2" />
                    </Button>
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
                  {section.content.slice(0, 12).map((content: Content) => (
                    <ContentCard key={content.id} content={content} />
                  ))}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Quick Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          <Link to="/movies">
            <Card className="group p-8 text-center hover:shadow-xl transition-all duration-300 cursor-pointer bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:scale-105">
              <div className="bg-red-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Film className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-2xl text-red-800 mb-2">الأفلام</h3>
              <p className="text-red-600 text-lg">مجموعة ضخمة من الأفلام</p>
            </Card>
          </Link>
          
          <Link to="/series">
            <Card className="group p-8 text-center hover:shadow-xl transition-all duration-300 cursor-pointer bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:scale-105">
              <div className="bg-green-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Video className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-2xl text-green-800 mb-2">المسلسلات</h3>
              <p className="text-green-600 text-lg">أحدث المسلسلات العربية والأجنبية</p>
            </Card>
          </Link>
          
          <Link to="/shows">
            <Card className="group p-8 text-center hover:shadow-xl transition-all duration-300 cursor-pointer bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:scale-105">
              <div className="bg-blue-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Tv className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-2xl text-blue-800 mb-2">البرامج</h3>
              <p className="text-blue-600 text-lg">برامج تلفزيونية متنوعة</p>
            </Card>
          </Link>
          
          <Link to="/mix">
            <Card className="group p-8 text-center hover:shadow-xl transition-all duration-300 cursor-pointer bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:scale-105">
              <div className="bg-purple-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-2xl text-purple-800 mb-2">منوعات</h3>
              <p className="text-purple-600 text-lg">محتوى متنوع ومميز</p>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}