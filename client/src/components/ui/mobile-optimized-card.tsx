import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Content } from "@shared/schema";
import { Play, Heart, Star, Clock, Eye } from "lucide-react";

interface MobileOptimizedCardProps {
  content: Content;
  onClick?: (content: Content) => void;
  onFavorite?: (content: Content) => void;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

export function MobileOptimizedCard({
  content,
  onClick,
  onFavorite,
  className,
  size = 'medium'
}: MobileOptimizedCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleClick = () => {
    onClick?.(content);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    onFavorite?.(content);
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return {
          card: "w-full max-w-[140px]",
          image: "h-32",
          title: "text-xs",
          subtitle: "text-xs",
          badge: "text-xs px-1 py-0.5"
        };
      case 'medium':
        return {
          card: "w-full max-w-[180px]",
          image: "h-40",
          title: "text-sm",
          subtitle: "text-xs",
          badge: "text-xs px-2 py-0.5"
        };
      case 'large':
        return {
          card: "w-full max-w-[220px]",
          image: "h-48",
          title: "text-base",
          subtitle: "text-sm",
          badge: "text-sm px-2 py-1"
        };
      default:
        return {
          card: "w-full max-w-[180px]",
          image: "h-40",
          title: "text-sm",
          subtitle: "text-xs",
          badge: "text-xs px-2 py-0.5"
        };
    }
  };

  const sizeClasses = getSizeClasses();

  return (
    <Card 
      className={cn(
        "group cursor-pointer overflow-hidden transition-all duration-200 hover:shadow-lg active:scale-95",
        sizeClasses.card,
        className
      )}
      onClick={handleClick}
    >
      <CardContent className="p-0">
        {/* صورة المحتوى */}
        <div className={cn("relative overflow-hidden bg-muted", sizeClasses.image)}>
          {!imageError ? (
            <img
              src={content.posterUrl || "https://images.unsplash.com/photo-1489599088293-daa0c0f60f0e?w=300&h=400&fit=crop"}
              alt={content.titleArabic || content.title}
              className={cn(
                "w-full h-full object-cover transition-all duration-200",
                imageLoaded ? "opacity-100" : "opacity-0",
                "group-hover:scale-105"
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
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
          
          {/* شارة النوع */}
          <Badge 
            variant="secondary" 
            className={cn(
              "absolute top-2 right-2 bg-black/70 text-white",
              sizeClasses.badge
            )}
          >
            {content.type === 'movie' ? 'فيلم' : 
             content.type === 'series' ? 'مسلسل' : 
             content.type === 'tv' ? 'تلفزيون' : 'متنوع'}
          </Badge>

          {/* أزرار التفاعل */}
          <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              size="sm"
              variant="secondary"
              className="h-7 w-7 p-0 bg-black/70 hover:bg-black/80"
              onClick={handleFavorite}
            >
              <Heart 
                className={cn(
                  "h-3 w-3",
                  isFavorite ? "fill-red-500 text-red-500" : "text-white"
                )} 
              />
            </Button>
          </div>

          {/* شارة الجودة */}
          {content.quality && (
            <Badge 
              variant="outline" 
              className={cn(
                "absolute top-2 left-2 bg-primary/90 text-primary-foreground border-primary",
                sizeClasses.badge
              )}
            >
              {content.quality}
            </Badge>
          )}
        </div>

        {/* معلومات المحتوى */}
        <div className="p-2 space-y-1">
          <h3 className={cn(
            "font-semibold text-foreground line-clamp-2 leading-tight",
            sizeClasses.title
          )}>
            {content.titleArabic || content.title}
          </h3>
          
          <div className="flex items-center justify-between">
            <span className={cn(
              "text-muted-foreground",
              sizeClasses.subtitle
            )}>
              {content.year}
            </span>
            
            {content.rating && (
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className={cn(
                  "text-muted-foreground",
                  sizeClasses.subtitle
                )}>
                  {content.rating}
                </span>
              </div>
            )}
          </div>

          {/* معلومات إضافية */}
          <div className="flex items-center justify-between">
            {content.duration && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span className={cn(
                  "text-muted-foreground",
                  sizeClasses.subtitle
                )}>
                  {content.duration} د
                </span>
              </div>
            )}
            
            {content.views && (
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3 text-muted-foreground" />
                <span className={cn(
                  "text-muted-foreground",
                  sizeClasses.subtitle
                )}>
                  {content.views.toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}