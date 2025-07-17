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
    <div className="bg-gray-50">
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
      <div className={`py-8 ${isEven ? 'bg-white' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 aspect-[2/3] rounded-lg mb-3"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-2 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const displayContent = Array.isArray(content) ? content.slice(0, 16) : [];

  return (
    <div className={`py-8 ${isEven ? 'bg-white' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4">
        {/* ak.sv Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-reverse space-x-3">
            <div className={`p-2 rounded-lg bg-blue-600 shadow-sm`}>
              <IconComponent className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {title}
              </h2>
              <p className="text-gray-600 text-sm">
                اكتشف أفضل المحتوى المتاح
              </p>
            </div>
          </div>
          {viewAllLink && (
            <Link to={viewAllLink}>
              <Button 
                size="sm" 
                variant="outline" 
                className="border-blue-200 text-blue-600 hover:bg-blue-50 px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg"
              >
                عرض الكل
                <MoreHorizontal className="h-4 w-4 mr-2" />
              </Button>
            </Link>
          )}
        </div>

        {/* ak.sv Content Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          {displayContent.map((item: any) => (
            <Card 
              key={item.id} 
              className="bg-white border border-gray-200 hover:border-blue-300 transition-all duration-200 group shadow-sm hover:shadow-md rounded-lg overflow-hidden"
            >
              <CardContent className="p-0">
                <Link to={getDetailLink(item)}>
                  <div className="relative overflow-hidden">
                    {/* Poster Image */}
                    <img
                      src={item.poster ? `/serverdata/images/${item.poster}` : "/api/placeholder/300/450"}
                      alt={item.titleAr || item.title}
                      className="w-full aspect-[2/3] object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.src = '/api/placeholder/300/450';
                      }}
                    />

                    {/* Quality Badge */}
                    {item.quality && (
                      <Badge className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-medium px-2 py-1 shadow-sm rounded">
                        {item.quality}
                      </Badge>
                    )}

                    {/* Rating */}
                    {item.rating && (
                      <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded flex items-center space-x-reverse space-x-1 shadow-sm">
                        <Star className="h-3 w-3 text-white fill-current" />
                        <span className="font-medium">{item.rating}</span>
                      </div>
                    )}

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center">
                      <div className="p-3 rounded-full bg-blue-600 shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-200">
                        <Play className="h-6 w-6 text-white" />
                      </div>
                    </div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  </div>
                </Link>

                {/* Content Info */}
                <div className="p-3">
                  <Link to={getDetailLink(item)}>
                    <h3 className="text-gray-800 font-medium text-sm mb-2 line-clamp-2 hover:text-blue-600 transition-colors leading-relaxed">
                      {item.titleAr || item.title}
                    </h3>
                  </Link>
                  
                  <div className="flex items-center justify-between text-gray-500 text-xs">
                    <div className="flex items-center space-x-reverse space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{item.year || "2024"}</span>
                    </div>
                    <div className="flex items-center space-x-reverse space-x-1">
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