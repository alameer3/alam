import { useState } from "react";
import { Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { 
  Heart, 
  Play, 
  Star, 
  Calendar, 
  Clock, 
  Eye,
  Bookmark,
  MoreHorizontal,
  Film,
  Tv,
  Monitor
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Content } from "@shared/schema";

interface EnhancedContentCardProps {
  content: Content;
  showActions?: boolean;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

export function EnhancedContentCard({ 
  content, 
  showActions = true, 
  className = "",
  size = 'medium'
}: EnhancedContentCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const currentUserId = 1; // Mock user ID

  const addToFavoritesMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/users/${currentUserId}/favorites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentId: content.id }),
      });
      if (!response.ok) throw new Error('فشل في إضافة المحتوى للمفضلة');
      return response.json();
    },
    onSuccess: () => {
      setIsFavorited(true);
      queryClient.invalidateQueries({ queryKey: [`/api/users/${currentUserId}/favorites`] });
      toast({ title: "تم إضافة المحتوى للمفضلة", variant: "default" });
    },
    onError: () => {
      toast({ title: "خطأ في إضافة المحتوى للمفضلة", variant: "destructive" });
    },
  });

  const removeFromFavoritesMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/users/${currentUserId}/favorites/${content.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('فشل في إزالة المحتوى من المفضلة');
      return response.json();
    },
    onSuccess: () => {
      setIsFavorited(false);
      queryClient.invalidateQueries({ queryKey: [`/api/users/${currentUserId}/favorites`] });
      toast({ title: "تم إزالة المحتوى من المفضلة", variant: "default" });
    },
    onError: () => {
      toast({ title: "خطأ في إزالة المحتوى من المفضلة", variant: "destructive" });
    },
  });

  const addToWatchHistoryMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/users/${currentUserId}/watch-history`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentId: content.id, progressMinutes: 0 }),
      });
      if (!response.ok) throw new Error('فشل في إضافة المحتوى لسجل المشاهدة');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${currentUserId}/watch-history`] });
      toast({ title: "تم بدء المشاهدة", variant: "default" });
    },
  });

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isFavorited) {
      removeFromFavoritesMutation.mutate();
    } else {
      addToFavoritesMutation.mutate();
    }
  };

  const handleWatch = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToWatchHistoryMutation.mutate();
  };

  const getTypeIcon = () => {
    switch (content.type) {
      case 'movie': return Film;
      case 'series': return Tv;
      case 'tv': return Monitor;
      default: return Play;
    }
  };

  const getTypeLabel = () => {
    switch (content.type) {
      case 'movie': return 'فيلم';
      case 'series': return 'مسلسل';
      case 'tv': return 'تلفزيون';
      default: return 'متنوع';
    }
  };

  const getCardDimensions = () => {
    switch (size) {
      case 'small':
        return 'w-40 h-56';
      case 'large':
        return 'w-72 h-96';
      default:
        return 'w-56 h-80';
    }
  };

  const getPosterDimensions = () => {
    switch (size) {
      case 'small':
        return 'h-32';
      case 'large':
        return 'h-64';
      default:
        return 'h-48';
    }
  };

  const TypeIcon = getTypeIcon();

  return (
    <Card 
      className={`group relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg ${getCardDimensions()} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        {/* Poster Image */}
        <div className={`relative overflow-hidden ${getPosterDimensions()}`}>
          <img
            src={content.posterUrl || "/placeholder-poster.jpg"}
            alt={content.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          
          {/* Overlay */}
          <div className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`} />
          
          {/* Action Buttons */}
          {showActions && isHovered && (
            <div className="absolute inset-0 flex items-center justify-center gap-2">
              <Button
                size="sm"
                onClick={handleWatch}
                disabled={addToWatchHistoryMutation.isPending}
                className="bg-white/90 text-black hover:bg-white transition-all duration-200"
              >
                <Play className="h-4 w-4" />
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={handleFavoriteToggle}
                disabled={addToFavoritesMutation.isPending || removeFromFavoritesMutation.isPending}
                className={`transition-all duration-200 ${
                  isFavorited 
                    ? 'bg-red-500 text-white border-red-500 hover:bg-red-600' 
                    : 'bg-white/90 text-black hover:bg-white'
                }`}
              >
                <Heart className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
              </Button>
            </div>
          )}

          {/* Type Badge */}
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="bg-black/60 text-white border-0">
              <TypeIcon className="h-3 w-3 mr-1" />
              {getTypeLabel()}
            </Badge>
          </div>

          {/* Rating Badge */}
          {content.rating && (
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="bg-yellow-500/90 text-black border-0">
                <Star className="h-3 w-3 mr-1 fill-current" />
                {content.rating}
              </Badge>
            </div>
          )}

          {/* Quality Badge */}
          {content.quality && (
            <div className="absolute bottom-2 left-2">
              <Badge variant="secondary" className="bg-blue-500/90 text-white border-0">
                {content.quality}
              </Badge>
            </div>
          )}
        </div>

        {/* Content Info */}
        <CardContent className="p-4 space-y-2">
          <Link href={`/content/${content.id}`}>
            <h3 className={`font-bold text-slate-900 dark:text-white line-clamp-2 hover:text-primary transition-colors cursor-pointer ${
              size === 'small' ? 'text-sm' : size === 'large' ? 'text-lg' : 'text-base'
            }`}>
              {content.title}
            </h3>
          </Link>
          
          {content.titleArabic && content.titleArabic !== content.title && (
            <p className={`text-slate-600 dark:text-slate-300 line-clamp-1 ${
              size === 'small' ? 'text-xs' : 'text-sm'
            }`}>
              {content.titleArabic}
            </p>
          )}

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{content.year}</span>
            </div>
            
            {content.duration && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{content.duration}د</span>
              </div>
            )}
          </div>

          {/* Language Badge */}
          {content.language && (
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="text-xs">
                {content.language}
              </Badge>
            </div>
          )}

          {/* Views Count */}
          {content.views && (
            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <Eye className="h-3 w-3" />
              <span>{content.views.toLocaleString()} مشاهدة</span>
            </div>
          )}

          {/* Actions Menu */}
          {showActions && (
            <div className="flex items-center justify-between pt-2">
              <Link href={`/content/${content.id}`}>
                <Button variant="outline" size="sm" className="text-xs">
                  عرض التفاصيل
                </Button>
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleWatch}>
                    <Play className="h-4 w-4 mr-2" />
                    مشاهدة الآن
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleFavoriteToggle}>
                    <Heart className={`h-4 w-4 mr-2 ${isFavorited ? 'fill-current text-red-500' : ''}`} />
                    {isFavorited ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bookmark className="h-4 w-4 mr-2" />
                    إضافة لقائمة
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  );
}