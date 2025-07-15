import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Play, Calendar, Clock, Eye, MoreHorizontal } from "lucide-react";
import { Link } from "wouter";

interface ContentGridProps {
  title: string;
  endpoint: string;
  viewAllLink?: string;
  type?: "movies" | "series" | "shows" | "mix";
}

export default function AkAuthenticContentGrid({ 
  title, 
  endpoint, 
  viewAllLink,
  type = "movies" 
}: ContentGridProps) {
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
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">{title}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-slate-700 aspect-[2/3] rounded-lg mb-2"></div>
                <div className="h-4 bg-slate-700 rounded mb-1"></div>
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
    <div className="py-12 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
            {title}
          </h2>
          {viewAllLink && (
            <Link to={viewAllLink}>
              <Button variant="outline" size="lg" className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-semibold px-6 py-3 transition-all duration-300">
                عرض الكل
                <MoreHorizontal className="h-5 w-5 mr-2" />
              </Button>
            </Link>
          )}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
          {displayContent.map((item: any) => (
            <Card key={item.id} className="bg-slate-800 border-slate-700 hover:border-red-500 transition-all duration-300 group shadow-lg hover:shadow-2xl hover:shadow-red-500/20">
              <CardContent className="p-0">
                <Link to={getDetailLink(item)}>
                  <div className="relative overflow-hidden rounded-t-lg">
                    {/* Poster Image */}
                    <img
                      src={item.poster || "/api/placeholder/300/450"}
                      alt={item.titleAr || item.title}
                      className="w-full aspect-[2/3] object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Quality Badge */}
                    {item.quality && (
                      <Badge className="absolute top-3 right-3 bg-red-600 text-white text-xs font-semibold px-3 py-1 shadow-lg">
                        {item.quality}
                      </Badge>
                    )}

                    {/* Rating */}
                    {item.rating && (
                      <div className="absolute top-3 left-3 bg-black/80 text-white text-xs px-3 py-1 rounded-full flex items-center space-x-reverse space-x-1 shadow-lg">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="font-semibold">{item.rating}</span>
                      </div>
                    )}

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                      <div className="bg-red-600 p-4 rounded-full shadow-2xl transform scale-75 group-hover:scale-100 transition-transform duration-300">
                        <Play className="h-8 w-8 text-white" />
                      </div>
                    </div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </Link>

                {/* Content Info */}
                <div className="p-4">
                  <Link to={getDetailLink(item)}>
                    <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2 hover:text-red-400 transition-colors leading-relaxed">
                      {item.titleAr || item.title}
                    </h3>
                  </Link>
                  
                  <div className="flex items-center justify-between text-gray-400 text-xs">
                    <div className="flex items-center space-x-reverse space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{item.year || "2024"}</span>
                    </div>
                    
                    {item.duration && (
                      <div className="flex items-center space-x-reverse space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{item.duration}</span>
                      </div>
                    )}
                  </div>

                  {/* Type Badge */}
                  <div className="mt-2">
                    <Badge variant="outline" className="border-slate-600 text-slate-400 text-xs">
                      {item.type === "movie" ? "فيلم" : 
                       item.type === "series" ? "مسلسل" : 
                       item.type === "show" ? "برنامج" : "منوعات"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Show More Button */}
        {Array.isArray(content) && content.length > 16 && viewAllLink && (
          <div className="text-center mt-8">
            <Link to={viewAllLink}>
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                عرض المزيد
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}