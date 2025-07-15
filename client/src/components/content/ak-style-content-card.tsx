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
    <Card className="group relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl bg-white">
      <Link to={finalHref}>
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
              className="absolute top-2 right-2 bg-black/80 text-white border-0"
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

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-white text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>{content.release_year}</span>
                </div>
                {content.view_count && (
                  <div className="flex items-center gap-1 text-white text-sm">
                    <Eye className="w-4 h-4" />
                    <span>{content.view_count.toLocaleString()}</span>
                  </div>
                )}
              </div>
              <Button size="sm" className="w-full bg-red-600 hover:bg-red-700 text-white">
                <Play className="w-4 h-4 mr-2" />
                مشاهدة الآن
              </Button>
            </div>
          </div>
        </div>
      </Link>

      <CardContent className="p-4">
        <h3 className="font-bold text-lg mb-2 line-clamp-2 text-right text-gray-800">
          {content.titleArabic || content.title}
        </h3>
        
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>{content.release_year}</span>
          <span className="capitalize">{content.type}</span>
        </div>

        {content.genres && content.genres.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {content.genres.slice(0, 2).map((genre, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="text-xs border-red-200 text-red-600"
              >
                {genre}
              </Badge>
            ))}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center justify-between mt-3">
          <Button 
            variant="ghost" 
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Heart className="w-4 h-4" />
          </Button>
          <Link to={finalHref}>
            <Button 
              variant="outline" 
              size="sm"
              className="border-red-200 text-red-600 hover:bg-red-50"
            >
              المزيد
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}