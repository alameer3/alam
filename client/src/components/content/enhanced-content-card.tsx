import React, { useState } from 'react';
import { 
  Play, 
  Heart, 
  Star, 
  Eye, 
  Clock, 
  Calendar,
  Monitor,
  Languages,
  MoreVertical,
  Share2,
  Bookmark,
  Info
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { Content } from '@shared/schema';
import { cn } from '@/lib/utils';

interface EnhancedContentCardProps {
  content: Content;
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
  progress?: number;
  onPlay?: () => void;
  onFavorite?: () => void;
  onShare?: () => void;
  isFavorite?: boolean;
  className?: string;
}

export function EnhancedContentCard({
  content,
  size = 'md',
  showProgress = false,
  progress = 0,
  onPlay,
  onFavorite,
  onShare,
  isFavorite = false,
  className
}: EnhancedContentCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { toast } = useToast();

  const sizeClasses = {
    sm: 'w-48 h-72',
    md: 'w-64 h-96',
    lg: 'w-80 h-[28rem]'
  };

  const imageSizeClasses = {
    sm: 'h-36',
    md: 'h-48',
    lg: 'h-64'
  };

  const getTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      movie: 'فيلم',
      series: 'مسلسل',
      tv: 'برنامج تلفزيوني',
      misc: 'متنوع'
    };
    return types[type] || type;
  };

  const getLanguageLabel = (language: string) => {
    const languages: { [key: string]: string } = {
      Arabic: 'عربي',
      English: 'إنجليزي',
      Hindi: 'هندي',
      Turkish: 'تركي'
    };
    return languages[language] || language;
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: content.titleArabic || content.title,
          text: content.descriptionArabic || content.description,
          url: window.location.href
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: 'تم النسخ',
          description: 'تم نسخ الرابط إلى الحافظة'
        });
      }
      onShare?.();
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours > 0) {
      return `${hours}س ${remainingMinutes}د`;
    }
    return `${minutes}د`;
  };

  const formatRating = (rating: number) => {
    return rating.toFixed(1);
  };

  return (
    <Card 
      className={cn(
        'group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105',
        sizeClasses[size],
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0 h-full">
        {/* Poster Image */}
        <div className={cn('relative overflow-hidden', imageSizeClasses[size])}>
          <img
            src={content.posterUrl || '/api/placeholder/400/600'}
            alt={content.titleArabic || content.title}
            className={cn(
              'w-full h-full object-cover transition-all duration-300',
              imageLoaded ? 'opacity-100' : 'opacity-0',
              isHovered && 'scale-110'
            )}
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Loading Skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}

          {/* Overlay */}
          <div className={cn(
            'absolute inset-0 bg-black/60 transition-opacity duration-300',
            isHovered ? 'opacity-100' : 'opacity-0'
          )}>
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                size="lg"
                onClick={onPlay}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-white/30"
              >
                <Play className="h-6 w-6 mr-2" />
                تشغيل
              </Button>
            </div>
          </div>

          {/* Top Right Actions */}
          <div className={cn(
            'absolute top-2 right-2 flex flex-col gap-1 transition-opacity duration-300',
            isHovered ? 'opacity-100' : 'opacity-0'
          )}>
            <Button
              size="sm"
              variant="secondary"
              onClick={onFavorite}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-white/30 p-2"
            >
              <Heart className={cn('h-4 w-4', isFavorite && 'fill-red-500 text-red-500')} />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="secondary"
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-white/30 p-2"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  مشاركة
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bookmark className="h-4 w-4 mr-2" />
                  إضافة لقائمة المشاهدة
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Info className="h-4 w-4 mr-2" />
                  تفاصيل أكثر
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Quality Badge */}
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="bg-black/60 text-white">
              {content.quality}
            </Badge>
          </div>

          {/* Progress Bar */}
          {showProgress && progress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 p-2">
              <Progress value={progress} className="h-1 bg-white/20" />
            </div>
          )}
        </div>

        {/* Content Info */}
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-lg line-clamp-2">
              {content.titleArabic || content.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {content.descriptionArabic || content.description}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="outline" className="text-xs">
              {getTypeLabel(content.type)}
            </Badge>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {content.year}
            </span>
            {content.duration > 0 && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDuration(content.duration)}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{formatRating(content.rating)}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Languages className="h-3 w-3" />
                {getLanguageLabel(content.language)}
              </div>
            </div>
            
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Monitor className="h-3 w-3" />
              {content.resolution}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default EnhancedContentCard;