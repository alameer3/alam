import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useAddToFavorites, useRemoveFromFavorites, useFavorites, useIncrementViewCount } from "@/hooks/useUserInteractions";
import { Card, CardContent } from "@/components/layout/ui/card";
import { Button } from "@/components/layout/ui/button";
import { Badge } from "@/components/layout/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/layout/ui/tooltip";
import { Heart, Play, Download, Star, Clock, Eye, Calendar, HeartIcon } from "lucide-react";
import { Content } from "@shared/schema";
import { cn } from "@/lib/utils";

interface EnhancedContentCardProps {
  content: Content;
  onClick?: (content: Content) => void;
  showStats?: boolean;
  className?: string;
}

export default function EnhancedContentCard({ 
  content, 
  onClick, 
  showStats = true, 
  className 
}: EnhancedContentCardProps) {
  const { user } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const { data: favoritesData } = useFavorites(user?.id);
  const addToFavoritesMutation = useAddToFavorites(user?.id);
  const removeFromFavoritesMutation = useRemoveFromFavorites(user?.id);
  const incrementViewMutation = useIncrementViewCount();
  
  const isFavorite = favoritesData?.content?.some((fav: Content) => fav.id === content.id);

  const handlePlay = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (user) {
      await incrementViewMutation.mutateAsync(content.id);
    }
    onClick?.(content);
  };

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;

    if (isFavorite) {
      await removeFromFavoritesMutation.mutateAsync(content.id);
    } else {
      await addToFavoritesMutation.mutateAsync(content.id);
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (content.downloadUrl) {
      window.open(content.downloadUrl, '_blank');
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'movie': return 'bg-blue-500';
      case 'series': return 'bg-green-500';
      case 'tv': return 'bg-purple-500';
      case 'misc': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'movie': return 'فيلم';
      case 'series': return 'مسلسل';
      case 'tv': return 'تلفزيون';
      case 'misc': return 'متنوع';
      default: return type;
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality.toLowerCase()) {
      case 'hd': return 'bg-green-600';
      case '4k': return 'bg-purple-600';
      case 'sd': return 'bg-yellow-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <TooltipProvider>
      <Card 
        className={cn(
          "group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 bg-gray-900 border-gray-800",
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => onClick?.(content)}
      >
        <CardContent className="p-0 relative overflow-hidden">
          {/* Poster Image */}
          <div className="relative aspect-[2/3] bg-gray-800">
            {content.posterUrl ? (
              <img
                src={content.posterUrl}
                alt={content.titleArabic || content.title}
                className={cn(
                  "w-full h-full object-cover transition-all duration-300",
                  imageLoaded ? "opacity-100" : "opacity-0"
                )}
                onLoad={() => setImageLoaded(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-gray-700 to-gray-800">
                <Play className="h-16 w-16 text-gray-400" />
              </div>
            )}
            
            {/* Overlay */}
            <div className={cn(
              "absolute inset-0 bg-black/60 transition-opacity duration-300",
              isHovered ? "opacity-100" : "opacity-0"
            )}>
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  size="lg"
                  className="bg-red-600 hover:bg-red-700 text-white rounded-full p-4"
                  onClick={handlePlay}
                >
                  <Play className="h-8 w-8" />
                </Button>
              </div>
            </div>

            {/* Top Badges */}
            <div className="absolute top-2 right-2 flex flex-col gap-1">
              <Badge className={cn("text-xs font-bold", getTypeColor(content.type))}>
                {getTypeName(content.type)}
              </Badge>
              <Badge className={cn("text-xs font-bold", getQualityColor(content.quality))}>
                {content.quality}
              </Badge>
            </div>

            {/* Bottom Action Buttons */}
            <div className={cn(
              "absolute bottom-2 right-2 flex gap-2 transition-all duration-300",
              isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            )}>
              {user && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant={isFavorite ? "default" : "secondary"}
                      className={cn(
                        "rounded-full p-2",
                        isFavorite 
                          ? "bg-red-600 hover:bg-red-700 text-white" 
                          : "bg-white/20 hover:bg-white/30 text-white"
                      )}
                      onClick={handleFavoriteToggle}
                      disabled={addToFavoritesMutation.isPending || removeFromFavoritesMutation.isPending}
                    >
                      <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isFavorite ? "إزالة من المفضلة" : "إضافة للمفضلة"}</p>
                  </TooltipContent>
                </Tooltip>
              )}
              
              {content.downloadUrl && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="rounded-full p-2 bg-white/20 hover:bg-white/30 text-white"
                      onClick={handleDownload}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>تحميل</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>

            {/* Rating Badge */}
            {content.rating && parseFloat(content.rating) > 0 && (
              <div className="absolute top-2 left-2">
                <Badge className="bg-yellow-600 text-white flex items-center gap-1">
                  <Star className="h-3 w-3 fill-current" />
                  {content.rating}
                </Badge>
              </div>
            )}
          </div>

          {/* Content Info */}
          <div className="p-4 space-y-2">
            <div className="space-y-1">
              <h3 className="font-bold text-white text-lg leading-tight line-clamp-1" dir="rtl">
                {content.titleArabic || content.title}
              </h3>
              <p className="text-gray-400 text-sm line-clamp-1">
                {content.title}
              </p>
            </div>

            {content.description && (
              <p className="text-gray-300 text-sm line-clamp-2" dir="rtl">
                {content.descriptionArabic || content.description}
              </p>
            )}

            {showStats && (
              <div className="flex items-center justify-between text-xs text-gray-400 pt-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{content.year}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500">•</span>
                    <span>{content.language}</span>
                  </div>
                  {content.duration && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{content.duration} دقيقة</span>
                    </div>
                  )}
                  {content.episodes && content.episodes > 0 && (
                    <div className="flex items-center gap-1">
                      <span className="text-gray-500">•</span>
                      <span>{content.episodes} حلقة</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}