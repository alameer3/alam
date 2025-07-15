import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Star, 
  Play, 
  Calendar, 
  Clock, 
  Eye, 
  MoreHorizontal,
  Film,
  Video,
  Tv,
  Globe,
  Award,
  TrendingUp,
  Fire,
  Crown,
  Sparkles
} from "lucide-react";
import { Link } from "wouter";

interface ContentSectionsProps {
  sections: {
    title: string;
    endpoint: string;
    viewAllLink: string;
    type: "movies" | "series" | "shows" | "mix";
    icon: any;
    color: string;
    gradient: string;
  }[];
}

export default function AkEnhancedContentSections({ sections }: ContentSectionsProps) {
  return (
    <div className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {sections.map((section, index) => (
        <ContentSection 
          key={section.endpoint}
          {...section}
          isEven={index % 2 === 0}
        />
      ))}
    </div>
  );
}

interface ContentSectionProps {
  title: string;
  endpoint: string;
  viewAllLink: string;
  type: "movies" | "series" | "shows" | "mix";
  icon: any;
  color: string;
  gradient: string;
  isEven: boolean;
}

function ContentSection({ title, endpoint, viewAllLink, type, icon: IconComponent, color, gradient, isEven }: ContentSectionProps) {
  const { data: content = [], isLoading } = useQuery({
    queryKey: [endpoint],
  });

  const getDetailLink = (item: any) => {
    const slug = item.titleAr || item.title;
    switch (type) {
      case "movies":
        return `/movie/${item.id}/${encodeURIComponent(slug)}`;
      case "series":
        return `/series/${item.id}/${encodeURIComponent(slug)}`;
      case "shows":
        return `/shows/${item.id}/${encodeURIComponent(slug)}`;
      case "mix":
        return `/mix/${item.id}/${encodeURIComponent(slug)}`;
      default:
        return `/content/${item.id}`;
    }
  };

  if (isLoading) {
    return (
      <div className={`py-16 ${isEven ? 'bg-slate-900' : 'bg-slate-800'}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div className="h-8 bg-slate-700 rounded w-48 animate-pulse"></div>
            <div className="h-10 bg-slate-700 rounded w-32 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-slate-700 aspect-[2/3] rounded-xl mb-4"></div>
                <div className="h-4 bg-slate-700 rounded mb-2"></div>
                <div className="h-3 bg-slate-700 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const displayContent = Array.isArray(content) ? content.slice(0, 16) : [];

  return (
    <div className={`py-16 ${isEven ? 'bg-slate-900' : 'bg-slate-800'}`}>
      <div className="container mx-auto px-4">
        {/* Enhanced Section Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center space-x-reverse space-x-4">
            <div className={`p-4 rounded-2xl ${gradient} shadow-2xl`}>
              <IconComponent className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-white mb-2">
                {title}
              </h2>
              <p className="text-gray-400 text-lg">
                اكتشف أفضل المحتوى المتاح
              </p>
            </div>
          </div>
          {viewAllLink && (
            <Link to={viewAllLink}>
              <Button 
                size="lg" 
                variant="outline" 
                className={`border-2 ${color} hover:bg-opacity-10 px-8 py-4 text-lg font-bold transition-all duration-300 rounded-xl`}
              >
                عرض الكل
                <MoreHorizontal className="h-6 w-6 mr-3" />
              </Button>
            </Link>
          )}
        </div>

        {/* Enhanced Content Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
          {displayContent.map((item: any) => (
            <Card 
              key={item.id} 
              className={`bg-slate-800 border-slate-700 hover:border-opacity-50 transition-all duration-300 group shadow-xl hover:shadow-2xl rounded-2xl overflow-hidden ${color.replace('text-', 'hover:border-')}`}
            >
              <CardContent className="p-0">
                <Link to={getDetailLink(item)}>
                  <div className="relative overflow-hidden">
                    {/* Poster Image */}
                    <img
                      src={item.poster || "/api/placeholder/300/450"}
                      alt={item.titleAr || item.title}
                      className="w-full aspect-[2/3] object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Quality Badge */}
                    {item.quality && (
                      <Badge className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-3 py-1 shadow-lg rounded-full">
                        {item.quality}
                      </Badge>
                    )}

                    {/* Rating */}
                    {item.rating && (
                      <div className="absolute top-3 left-3 bg-black/80 text-white text-xs px-3 py-1 rounded-full flex items-center space-x-reverse space-x-1 shadow-lg backdrop-blur-sm">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="font-bold">{item.rating}</span>
                      </div>
                    )}

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                      <div className={`p-6 rounded-full shadow-2xl transform scale-75 group-hover:scale-100 transition-transform duration-300 ${gradient}`}>
                        <Play className="h-12 w-12 text-white" />
                      </div>
                    </div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </Link>

                {/* Content Info */}
                <div className="p-5">
                  <Link to={getDetailLink(item)}>
                    <h3 className="text-white font-bold text-sm mb-3 line-clamp-2 hover:text-opacity-80 transition-colors leading-relaxed">
                      {item.titleAr || item.title}
                    </h3>
                  </Link>
                  
                  <div className="flex items-center justify-between text-gray-400 text-xs">
                    <div className="flex items-center space-x-reverse space-x-2">
                      <Calendar className="h-3 w-3" />
                      <span>{item.year || "2024"}</span>
                    </div>
                    <div className="flex items-center space-x-reverse space-x-2">
                      <Eye className="h-3 w-3" />
                      <span>{item.views || "0"}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}