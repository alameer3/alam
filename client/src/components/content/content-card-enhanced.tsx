import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Play, Heart, MessageCircle, Eye } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { Content, UserReview } from '@shared/schema';
import { cn } from '@/lib/utils';

interface ContentCardEnhancedProps {
  content: Content;
  onClick?: (content: Content) => void;
}

export default function ContentCardEnhanced({ content, onClick }: ContentCardEnhancedProps) {
  // Fetch reviews for this content
  const { data: reviews } = useQuery({
    queryKey: ['/api/content', content.id, 'reviews'],
    queryFn: async () => {
      const response = await apiRequest(`/api/content/${content.id}/reviews`);
      return response as UserReview[];
    }
  });

  const averageRating = reviews?.length 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'movie':
        return 'bg-blue-500';
      case 'series':
        return 'bg-green-500';
      case 'tv':
        return 'bg-purple-500';
      case 'misc':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'movie':
        return 'أفلام';
      case 'series':
        return 'مسلسلات';
      case 'tv':
        return 'تلفزيون';
      case 'misc':
        return 'متنوعة';
      default:
        return type;
    }
  };

  return (
    <Card 
      className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105"
      onClick={() => onClick?.(content)}
    >
      <CardContent className="p-0">
        {/* Poster Image */}
        <div className="relative aspect-[2/3] overflow-hidden">
          {content.posterUrl ? (
            <img
              src={content.posterUrl}
              alt={content.titleArabic || content.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <Play className="h-12 w-12 text-gray-400" />
            </div>
          )}
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Button
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white rounded-full"
            >
              <Play className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Top badges */}
          <div className="absolute top-2 left-2 flex gap-1">
            <Badge className={cn("text-xs", getTypeColor(content.type))}>
              {getTypeName(content.type)}
            </Badge>
            <Badge variant="outline" className="text-xs bg-white/90">
              {content.quality}
            </Badge>
          </div>
          
          {/* Rating badge */}
          {content.rating && (
            <div className="absolute top-2 right-2">
              <Badge className="text-xs bg-yellow-500 text-white">
                <Star className="h-3 w-3 fill-current ml-1" />
                {content.rating}
              </Badge>
            </div>
          )}
        </div>

        {/* Content Info */}
        <div className="p-4">
          <h3 className="font-bold text-lg mb-1 line-clamp-2 leading-tight">
            {content.titleArabic || content.title}
          </h3>
          
          <p className="text-sm text-gray-600 mb-2 line-clamp-1">
            {content.title !== content.titleArabic ? content.title : ''}
          </p>
          
          <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
            <span>{content.year}</span>
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {content.language}
            </span>
          </div>

          {/* Reviews Summary */}
          {reviews && reviews.length > 0 && (
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={14}
                    className={`${
                      star <= Math.round(averageRating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-600">
                {averageRating.toFixed(1)} ({reviews.length} مراجعة)
              </span>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-red-600 p-1"
              >
                <Heart className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-blue-600 p-1"
              >
                <MessageCircle className="h-4 w-4" />
                <span className="text-xs ml-1">
                  {reviews?.length || 0}
                </span>
              </Button>
            </div>
            
            <Badge variant="outline" className="text-xs">
              {content.episodes && content.episodes > 0 
                ? `${content.episodes} حلقة` 
                : `${content.duration} دقيقة`}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}