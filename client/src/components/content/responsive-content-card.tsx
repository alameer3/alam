import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Content } from "@shared/schema";
import { useResponsive } from "@/components/layout/responsive-layout";
import { Play, Heart, Star, Clock, Eye, Calendar } from "lucide-react";

interface ResponsiveContentCardProps {
  content: Content;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'minimal' | 'detailed';
  onPlay?: (content: Content) => void;
  onFavorite?: (content: Content) => void;
  className?: string;
}

export function ResponsiveContentCard({
  content,
  size = 'medium',
  variant = 'default',
  onPlay,
  onFavorite,
  className
}: ResponsiveContentCardProps) {
  const { isMobile, isTablet } = useResponsive();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleClick = () => {
    onPlay?.(content);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    onFavorite?.(content);
  };

  const getCardClasses = () => {
    const base = "group cursor-pointer overflow-hidden transition-all duration-200";
    
    if (isMobile) {
      return {
        small: `${base} rounded-lg shadow-sm hover:shadow-md active:scale-95`,
        medium: `${base} rounded-xl shadow-md hover:shadow-lg active:scale-95`,
        large: `${base} rounded-xl shadow-lg hover:shadow-xl active:scale-95`
      };
    }

    return {
      small: `${base} rounded-lg shadow-sm hover:shadow-md hover:scale-105`,
      medium: `${base} rounded-xl shadow-md hover:shadow-lg hover:scale-105`,
      large: `${base} rounded-xl shadow-lg hover:shadow-xl hover:scale-105`
    };
  };

  const getImageClasses = () => {
    if (isMobile) {
      return {
        small: "h-28",
        medium: "h-36",
        large: "h-44"
      };
    } else if (isTablet) {
      return {
        small: "h-36",
        medium: "h-44",
        large: "h-56"
      };
    }

    return {
      small: "h-40",
      medium: "h-56",
      large: "h-72"
    };
  };

  const getTextSizes = () => {
    if (isMobile) {
      return {
        title: size === 'small' ? "text-xs" : "text-sm",
        subtitle: "text-xs",
        badge: "text-xs px-1 py-0.5"
      };
    }

    return {
      title: size === 'small' ? "text-sm" : size === 'medium' ? "text-base" : "text-lg",
      subtitle: size === 'small' ? "text-xs" : "text-sm",
      badge: size === 'small' ? "text-xs px-1 py-0.5" : "text-sm px-2 py-1"
    };
  };

  const cardClasses = getCardClasses();
  const imageClasses = getImageClasses();
  const textSizes = getTextSizes();

  return (
    <Card 
      className={cn(cardClasses[size], className)}
      onClick={handleClick}
    >
      <CardContent className="p-0">
        {/* صورة المحتوى */}
        <div className={cn("relative overflow-hidden bg-muted", imageClasses[size])}>
          {!imageError ? (
            <img
              src={content.posterUrl || "https://images.unsplash.com/photo-1489599088293-daa0c0f60f0e?w=300&h=400&fit=crop"}
              alt={content.titleArabic || content.title}
              className={cn(
                "w-full h-full object-cover transition-all duration-300",
                imageLoaded ? "opacity-100" : "opacity-0",
                "group-hover:scale-110"
              )}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <Play className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
          
          {/* طبقة التفاعل */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* شارة النوع */}
          <Badge 
            variant="secondary" 
            className={cn(
              "absolute top-2 right-2 bg-black/80 text-white border-none",
              textSizes.badge
            )}
          >
            {content.type === 'movie' ? 'فيلم' : 
             content.type === 'series' ? 'مسلسل' : 
             content.type === 'tv' ? 'تلفزيون' : 'متنوع'}
          </Badge>

          {/* شارة الجودة */}
          {content.quality && (
            <Badge 
              variant="outline" 
              className={cn(
                "absolute top-2 left-2 bg-primary/90 text-primary-foreground border-primary",
                textSizes.badge
              )}
            >
              {content.quality}
            </Badge>
          )}

          {/* أزرار التفاعل */}
          <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              size="sm"
              variant="secondary"
              className="bg-black/80 hover:bg-black/90 text-white"
              onClick={(e) => {
                e.stopPropagation();
                onPlay?.(content);
              }}
            >
              <Play className="h-4 w-4" />
            </Button>
            
            {size !== 'small' && (
              <Button
                size="sm"
                variant="secondary"
                className="bg-black/80 hover:bg-black/90 text-white"
                onClick={handleFavorite}
              >
                <Heart 
                  className={cn(
                    "h-4 w-4",
                    isFavorite ? "fill-red-500 text-red-500" : "text-white"
                  )} 
                />
              </Button>
            )}
          </div>
        </div>

        {/* معلومات المحتوى */}
        <div className={cn("p-2 space-y-1", variant === 'minimal' && "p-1")}>
          <h3 className={cn(
            "font-semibold text-foreground line-clamp-2 leading-tight",
            textSizes.title
          )}>
            {content.titleArabic || content.title}
          </h3>
          
          {variant !== 'minimal' && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                <span className={cn("text-muted-foreground", textSizes.subtitle)}>
                  {content.year}
                </span>
              </div>
              
              {content.rating && (
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className={cn("text-muted-foreground", textSizes.subtitle)}>
                    {content.rating}
                  </span>
                </div>
              )}
            </div>
          )}

          {variant === 'detailed' && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                {content.duration && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className={cn("text-muted-foreground", textSizes.subtitle)}>
                      {content.duration} د
                    </span>
                  </div>
                )}
                
                {content.views && (
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3 text-muted-foreground" />
                    <span className={cn("text-muted-foreground", textSizes.subtitle)}>
                      {content.views.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              {content.description && (
                <p className={cn(
                  "text-muted-foreground line-clamp-2 leading-relaxed",
                  textSizes.subtitle
                )}>
                  {content.description}
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}