import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Heart, 
  Star, 
  Eye, 
  Calendar, 
  Clock, 
  Download,
  Share2,
  MoreHorizontal,
  Info
} from "lucide-react";
import { Content } from "@shared/schema";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useAddToFavorites, useRemoveFromFavorites, useFavorites } from "@/hooks/useUserInteractions";
import { useToast } from "@/hooks/use-toast";

interface ResponsiveContentCardProps {
  content: Content;
  onClick?: (content: Content) => void;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  showActions?: boolean;
}

export default function ResponsiveContentCard({ 
  content, 
  onClick, 
  size = 'md',
  showDetails = true,
  showActions = true
}: ResponsiveContentCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const { data: favorites } = useFavorites(user?.id);
  const addToFavoritesMutation = useAddToFavorites(user?.id);
  const removeFromFavoritesMutation = useRemoveFromFavorites(user?.id);

  const isFavorite = favorites?.content?.some(fav => fav.id === content.id);

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "تسجيل الدخول مطلوب",
        description: "يرجى تسجيل الدخول لإضافة العناصر إلى المفضلة",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isFavorite) {
        await removeFromFavoritesMutation.mutateAsync({ contentId: content.id });
        toast({
          title: "تم الحذف من المفضلة",
          description: `تم حذف "${content.title}" من المفضلة`,
        });
      } else {
        await addToFavoritesMutation.mutateAsync({ contentId: content.id });
        toast({
          title: "تم الإضافة للمفضلة",
          description: `تم إضافة "${content.title}" للمفضلة`,
        });
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث المفضلة",
        variant: "destructive",
      });
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: content.title,
          text: content.description,
          url: window.location.origin + `/content/${content.id}`,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(window.location.origin + `/content/${content.id}`);
      toast({
        title: "تم نسخ الرابط",
        description: "تم نسخ رابط المحتوى إلى الحافظة",
      });
    }
  };

  const sizeClasses = {
    sm: "w-48 h-64",
    md: "w-64 h-80",
    lg: "w-80 h-96"
  };

  const imageClasses = {
    sm: "h-32",
    md: "h-48",
    lg: "h-64"
  };

  const getQualityColor = (quality: string) => {
    switch (quality?.toLowerCase()) {
      case '4k':
        return 'bg-purple-500';
      case 'fhd':
      case '1080p':
        return 'bg-blue-500';
      case 'hd':
      case '720p':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'movie':
        return 'bg-orange-500';
      case 'series':
        return 'bg-purple-500';
      case 'tv':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card 
      className={cn(
        "group relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl",
        "bg-card border-border",
        sizeClasses[size]
      )}
      onClick={() => onClick?.(content)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className={cn("relative overflow-hidden", imageClasses[size])}>
        {/* Placeholder while loading */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
            <div className="w-8 h-8 text-muted-foreground">
              <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
        )}
        
        {/* Content Image */}
        <img
          src={content.posterUrl || "/api/placeholder/400/600"}
          alt={content.title}
          className={cn(
            "w-full h-full object-cover transition-transform duration-300 group-hover:scale-110",
            imageLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(true)}
        />

        {/* Overlay */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent",
          "transition-opacity duration-300",
          isHovered ? "opacity-100" : "opacity-0"
        )} />

        {/* Quality Badge */}
        <Badge 
          className={cn(
            "absolute top-2 right-2 text-xs font-bold text-white",
            getQualityColor(content.quality)
          )}
        >
          {content.quality}
        </Badge>

        {/* Type Badge */}
        <Badge 
          className={cn(
            "absolute top-2 left-2 text-xs font-bold text-white",
            getTypeColor(content.type)
          )}
        >
          {content.type === 'movie' ? 'فيلم' : 
           content.type === 'series' ? 'مسلسل' : 
           content.type === 'tv' ? 'تلفزيون' : 'منوع'}
        </Badge>

        {/* Play Button */}
        <div className={cn(
          "absolute inset-0 flex items-center justify-center transition-opacity duration-300",
          isHovered ? "opacity-100" : "opacity-0"
        )}>
          <Button 
            size="icon" 
            className="w-16 h-16 rounded-full bg-primary/90 hover:bg-primary text-primary-foreground backdrop-blur-sm"
          >
            <Play className="w-8 h-8 ml-1" />
          </Button>
        </div>

        {/* Action Buttons */}
        {showActions && (
          <div className={cn(
            "absolute bottom-2 right-2 flex gap-2 transition-opacity duration-300",
            isHovered ? "opacity-100" : "opacity-0"
          )}>
            <Button
              size="icon"
              variant="ghost"
              className="w-8 h-8 bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm"
              onClick={handleFavoriteToggle}
            >
              <Heart className={cn("w-4 h-4", isFavorite && "fill-red-500 text-red-500")} />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="w-8 h-8 bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm"
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Content Details */}
      {showDetails && (
        <CardContent className="p-4 h-full flex flex-col">
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-2 line-clamp-2 text-foreground">
              {content.title}
            </h3>
            
            <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{new Date(content.releaseDate).getFullYear()}</span>
              
              <Clock className="w-4 h-4 ml-2" />
              <span>{content.duration} دقيقة</span>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium">
                  {content.rating ? content.rating.toFixed(1) : 'N/A'}
                </span>
              </div>
              
              <div className="flex items-center gap-1 text-muted-foreground">
                <Eye className="w-4 h-4" />
                <span className="text-sm">{content.views || 0}</span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground line-clamp-3">
              {content.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-1 mt-3">
            <Badge variant="secondary" className="text-xs">
              {content.language}
            </Badge>
            {content.genres?.slice(0, 2).map((genre, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {genre}
              </Badge>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}