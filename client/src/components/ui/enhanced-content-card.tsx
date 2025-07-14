import { useState } from "react";
import { Film, Star, Clock, Eye, Heart, Play, Calendar, Tv } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LazyImage } from "@/components/ui/lazy-image";
import { QualityBadge } from "@/components/ui/quality-badge";
import { useAdvancedTheme } from "@/components/theme/advanced-theme-provider";
import { Content } from "@shared/schema";

interface EnhancedContentCardProps {
  content: Content;
  onClick?: (content: Content) => void;
  variant?: "standard" | "featured" | "compact";
  showDetails?: boolean;
}

export function EnhancedContentCard({ 
  content, 
  onClick, 
  variant = "standard",
  showDetails = true 
}: EnhancedContentCardProps) {
  const { theme } = useAdvancedTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick(content);
    }
  };

  const getThemeCardClass = () => {
    switch (theme) {
      case "yemen": return "border-yemen-red/20 hover:border-yemen-red";
      case "cinema": return "border-cinema-gold/20 hover:border-cinema-gold";
      case "royal": return "border-royal-purple/20 hover:border-royal-purple";
      case "heritage": return "border-heritage-gold/20 hover:border-heritage-gold";
      default: return "border-border hover:border-primary";
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case "featured":
        return "h-[400px] md:h-[500px]";
      case "compact":
        return "h-[250px]";
      default:
        return "h-[350px]";
    }
  };

  return (
    <Card 
      className={`group cursor-pointer transition-all duration-500 hover:scale-[1.02] enhanced-card ${getThemeCardClass()} ${getVariantClasses()}`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0 h-full relative overflow-hidden">
        
        {/* Image Section */}
        <div className="relative h-2/3 overflow-hidden">
          <LazyImage
            src={content.posterUrl || "/placeholder-movie.jpg"}
            alt={`ملصق ${content.title}`}
            className={`w-full h-full object-cover transition-all duration-700 ${
              isHovered ? "scale-110" : "scale-100"
            }`}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent" />
          
          {/* Quality badge */}
          {content.quality && (
            <QualityBadge 
              quality={content.quality}
              className="absolute top-3 right-3 shadow-lg"
            />
          )}

          {/* Resolution badge */}
          {content.resolution && (
            <Badge 
              variant="secondary" 
              className="absolute top-3 left-3"
            >
              {content.resolution}
            </Badge>
          )}

          {/* Play button overlay */}
          <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}>
            <Button 
              size="lg" 
              className={`rounded-full w-16 h-16 ${
                theme === 'yemen' ? 'bg-yemen-red hover:bg-yemen-red/90' :
                theme === 'cinema' ? 'bg-cinema-gold text-cinema-dark hover:bg-cinema-gold/90' :
                theme === 'royal' ? 'bg-royal-purple hover:bg-royal-purple/90' :
                theme === 'heritage' ? 'bg-heritage-gold text-heritage-copper hover:bg-heritage-gold/90' :
                ''
              } shadow-2xl pulse-glow`}
            >
              <Play className="w-6 h-6" />
            </Button>
          </div>

          {/* Rating overlay */}
          {content.rating && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-background/80 backdrop-blur-sm rounded-full px-3 py-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium">{content.rating}</span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4 h-1/3 flex flex-col justify-between">
          <div>
            {/* Title */}
            <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-2">
              {content.titleArabic || content.title}
            </h3>
            
            {/* English title if Arabic exists */}
            {content.titleArabic && content.title && (
              <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                {content.title}
              </p>
            )}

            {/* Details row */}
            {showDetails && (
              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                {content.year && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{content.year}</span>
                  </div>
                )}
                
                {content.language && (
                  <Badge variant="outline" className="text-xs px-2 py-1">
                    {content.language}
                  </Badge>
                )}

                {content.duration && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{content.duration}د</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                <Heart className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                <Eye className="w-4 h-4" />
              </Button>
            </div>

            <Button 
              size="sm" 
              className={`${
                theme === 'yemen' ? 'bg-yemen-red hover:bg-yemen-red/90' :
                theme === 'cinema' ? 'bg-cinema-gold text-cinema-dark hover:bg-cinema-gold/90' :
                theme === 'royal' ? 'bg-royal-purple hover:bg-royal-purple/90' :
                theme === 'heritage' ? 'bg-heritage-gold text-heritage-copper hover:bg-heritage-gold/90' :
                ''
              }`}
            >
              <Play className="w-4 h-4 mr-1" />
              مشاهدة
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}