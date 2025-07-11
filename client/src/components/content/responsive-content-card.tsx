import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Heart, 
  Download, 
  Star, 
  Eye, 
  Clock, 
  Calendar,
  MoreVertical,
  Share,
  Bookmark
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface Content {
  id: number;
  title: string;
  titleArabic: string;
  description?: string;
  type: string;
  year: number;
  language: string;
  quality: string;
  resolution: string;
  rating: string;
  duration?: number;
  episodes?: number;
  posterUrl?: string;
  createdAt: string;
  views?: number;
}

interface ResponsiveContentCardProps {
  content: Content;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'minimal' | 'detailed';
  showActions?: boolean;
  onPlay?: (content: Content) => void;
  onFavorite?: (content: Content) => void;
}

export function ResponsiveContentCard({
  content,
  size = 'medium',
  variant = 'default',
  showActions = true,
  onPlay,
  onFavorite
}: ResponsiveContentCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);
    onFavorite?.(content);
  };

  const handlePlayClick = () => {
    onPlay?.(content);
  };

  const getQualityColor = (quality: string) => {
    switch (quality.toLowerCase()) {
      case '4k':
      case 'uhd':
        return 'bg-purple-500 text-white';
      case 'hd':
      case '1080p':
        return 'bg-blue-500 text-white';
      case '720p':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const sizeClasses = {
    small: {
      card: 'w-32',
      image: 'h-44',
      title: 'text-xs',
      subtitle: 'text-xs',
      badge: 'text-xs px-1 py-0.5'
    },
    medium: {
      card: 'w-40',
      image: 'h-56',
      title: 'text-sm',
      subtitle: 'text-xs',
      badge: 'text-xs px-2 py-1'
    },
    large: {
      card: 'w-52',
      image: 'h-72',
      title: 'text-base',
      subtitle: 'text-sm',
      badge: 'text-sm px-2 py-1'
    }
  };

  const currentSize = sizeClasses[size];

  if (variant === 'minimal') {
    return (
      <Card 
        className={cn(
          "group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg overflow-hidden",
          currentSize.card
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handlePlayClick}
      >
        <div className={cn("relative overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5", currentSize.image)}>
          {content.posterUrl ? (
            <img 
              src={content.posterUrl} 
              alt={content.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <Play className="h-8 w-8" />
            </div>
          )}
          
          {/* شارة الجودة */}
          <Badge className={cn("absolute top-2 right-2", currentSize.badge, getQualityColor(content.quality))}>
            {content.quality}
          </Badge>
          
          {/* زر التشغيل */}
          {isHovered && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Button size="sm" className="rounded-full w-12 h-12 p-0">
                <Play className="h-6 w-6 fill-current" />
              </Button>
            </div>
          )}
        </div>
        
        <CardContent className="p-2">
          <h3 className={cn("font-medium line-clamp-1", currentSize.title)}>{content.titleArabic}</h3>
          <p className={cn("text-muted-foreground line-clamp-1", currentSize.subtitle)}>{content.year}</p>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'detailed') {
    return (
      <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
        <div className="flex">
          {/* الصورة */}
          <div className="relative w-32 h-44 flex-shrink-0 overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5">
            {content.posterUrl ? (
              <img 
                src={content.posterUrl} 
                alt={content.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <Play className="h-6 w-6" />
              </div>
            )}
            <Badge className={cn("absolute top-2 right-2 text-xs", getQualityColor(content.quality))}>
              {content.quality}
            </Badge>
          </div>

          {/* المحتوى */}
          <CardContent className="flex-1 p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="font-bold text-lg leading-tight line-clamp-1">{content.titleArabic}</h3>
                <p className="text-sm text-muted-foreground line-clamp-1">{content.title}</p>
              </div>
              <div className="flex items-center gap-1 text-yellow-500">
                <Star className="h-4 w-4 fill-current" />
                <span className="text-sm font-medium">{content.rating}</span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {content.description || "وصف غير متوفر"}
            </p>

            <div className="flex flex-wrap gap-1 mb-3">
              <Badge variant="outline" className="text-xs">
                <Calendar className="h-3 w-3 ml-1" />
                {content.year}
              </Badge>
              <Badge variant="outline" className="text-xs">{content.language}</Badge>
              {content.duration && (
                <Badge variant="outline" className="text-xs">
                  <Clock className="h-3 w-3 ml-1" />
                  {Math.floor(content.duration / 60)}س {content.duration % 60}د
                </Badge>
              )}
              {content.episodes && content.episodes > 0 && (
                <Badge variant="outline" className="text-xs">{content.episodes} حلقة</Badge>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button onClick={handlePlayClick} size="sm">
                  <Play className="h-4 w-4 ml-2" />
                  مشاهدة
                </Button>
                <Button 
                  onClick={handleFavoriteClick}
                  size="sm" 
                  variant="outline"
                  className={isFavorite ? "text-red-500 border-red-500" : ""}
                >
                  <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
                </Button>
              </div>
              
              <div className="flex items-center gap-1 text-muted-foreground text-xs">
                <Eye className="h-3 w-3" />
                <span>{content.views || 0}</span>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    );
  }

  // Default variant
  return (
    <Card 
      className={cn(
        "group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl overflow-hidden",
        currentSize.card
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={cn("relative overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5", currentSize.image)}>
        {content.posterUrl ? (
          <img 
            src={content.posterUrl} 
            alt={content.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <Play className="h-8 w-8" />
          </div>
        )}
        
        {/* طبقة التدرج */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* شارة الجودة */}
        <Badge className={cn("absolute top-2 right-2", currentSize.badge, getQualityColor(content.quality))}>
          {content.quality}
        </Badge>
        
        {/* التقييم */}
        <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/70 text-white px-2 py-1 rounded text-xs">
          <Star className="h-3 w-3 fill-current text-yellow-500" />
          <span>{content.rating}</span>
        </div>

        {/* أزرار التحكم السريعة */}
        {showActions && isHovered && (
          <div className="absolute bottom-2 left-2 right-2 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex gap-2">
              <Button onClick={handlePlayClick} size="sm" className="flex-1 h-8 text-xs">
                <Play className="h-3 w-3 ml-1" />
                مشاهدة
              </Button>
              <Button 
                onClick={handleFavoriteClick}
                size="sm" 
                variant="secondary"
                className={cn("h-8 w-8 p-0", isFavorite && "text-red-500")}
              >
                <Heart className={cn("h-3 w-3", isFavorite && "fill-current")} />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Download className="h-4 w-4 ml-2" />
                    تحميل
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Share className="h-4 w-4 ml-2" />
                    مشاركة
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bookmark className="h-4 w-4 ml-2" />
                    حفظ للمشاهدة لاحقاً
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )}

        {/* عداد المشاهدات */}
        {content.views && (
          <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center gap-1 bg-black/70 text-white px-2 py-1 rounded text-xs">
              <Eye className="h-3 w-3" />
              <span>{content.views > 1000 ? `${(content.views / 1000).toFixed(1)}k` : content.views}</span>
            </div>
          </div>
        )}
      </div>

      <CardContent className="p-3">
        <h3 className={cn("font-bold line-clamp-1 mb-1", currentSize.title)}>{content.titleArabic}</h3>
        <p className={cn("text-muted-foreground line-clamp-1 mb-2", currentSize.subtitle)}>{content.title}</p>
        
        <div className="flex flex-wrap gap-1">
          <Badge variant="outline" className="text-xs px-1 py-0.5">{content.year}</Badge>
          <Badge variant="outline" className="text-xs px-1 py-0.5">{content.language}</Badge>
          {content.episodes && content.episodes > 0 && (
            <Badge variant="outline" className="text-xs px-1 py-0.5">{content.episodes} ح</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}