import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Play, Calendar, Eye, Heart } from "lucide-react";

interface Content {
  id: number;
  title: string;
  titleArabic?: string;
  type: string;
  poster_url?: string;
  rating?: number;
  release_year?: number;
  quality?: string;
  genres?: string[];
  categories?: string[];
  view_count?: number;
  duration?: number;
}

interface AkStyleContentCardProps {
  content: Content;
  href?: string;
}

export function AkStyleContentCard({ content, href }: AkStyleContentCardProps) {
  const getDefaultHref = () => {
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

  const finalHref = href || getDefaultHref();

  return (
    <Card className="group relative overflow-hidden transition-all duration-200 hover:shadow-lg bg-white border border-gray-200">
      <Link to={finalHref}>
        <div className="aspect-[2/3] relative">
          <img 
            src={content.poster ? `/serverdata/images/${content.poster}` : '/api/placeholder/300/450'} 
            alt={content.titleArabic || content.title}
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = '/api/placeholder/300/450';
            }}
          />
          
          {/* Quality Badge */}
          {content.quality && (
            <Badge 
              variant="secondary" 
              className="absolute top-2 right-2 bg-blue-600 text-white border-0 text-xs"
            >
              {content.quality}
            </Badge>
          )}

          {/* Rating */}
          {content.rating && (
            <div className="absolute top-2 left-2 flex items-center gap-1 bg-yellow-500 text-white px-2 py-1 rounded text-xs">
              <Star className="w-3 h-3 fill-white text-white" />
              <span>{content.rating}</span>
            </div>
          )}

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-white text-xs">
                  <Calendar className="w-3 h-3" />
                  <span>{content.release_year}</span>
                </div>
                {content.view_count && (
                  <div className="flex items-center gap-1 text-white text-xs">
                    <Eye className="w-3 h-3" />
                    <span>{content.view_count.toLocaleString()}</span>
                  </div>
                )}
              </div>
              <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs">
                <Play className="w-3 h-3 mr-1" />
                مشاهدة الآن
              </Button>
            </div>
          </div>
        </div>
      </Link>

      <CardContent className="p-3">
        <h3 className="font-semibold text-sm mb-2 line-clamp-2 text-right text-gray-800">
          {content.titleArabic || content.title}
        </h3>
        
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <span>{content.release_year}</span>
          <span className="capitalize">{content.type}</span>
        </div>

        {content.genres && content.genres.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {content.genres.slice(0, 2).map((genre, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="text-xs border-blue-200 text-blue-600 px-2 py-1"
              >
                {genre}
              </Badge>
            ))}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center justify-between mt-2">
          <Button 
            variant="ghost" 
            size="sm"
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-1"
          >
            <Heart className="w-3 h-3" />
          </Button>
          <Link to={finalHref}>
            <Button 
              variant="outline" 
              size="sm"
              className="border-blue-200 text-blue-600 hover:bg-blue-50 text-xs px-3 py-1"
            >
              المزيد
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}