import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Play, Eye, Calendar, Clock } from 'lucide-react';
import { Content } from '@shared/schema';
import { cn } from '@/lib/utils';

interface SearchResultsGridProps {
  results: Content[];
  isLoading?: boolean;
  onContentClick: (content: Content) => void;
  viewMode?: 'grid' | 'list';
  className?: string;
}

export function SearchResultsGrid({
  results,
  isLoading = false,
  onContentClick,
  viewMode = 'grid',
  className
}: SearchResultsGridProps) {
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

  if (isLoading) {
    return (
      <div className={cn("space-y-4", className)}>
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardContent className="p-0">
                  <div className="aspect-[2/3] bg-muted rounded-t-lg" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-muted rounded" />
                    <div className="h-3 bg-muted rounded w-3/4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="w-24 h-36 bg-muted rounded" />
                    <div className="flex-1 space-y-3">
                      <div className="h-6 bg-muted rounded w-1/2" />
                      <div className="h-4 bg-muted rounded" />
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="flex gap-2">
                        <div className="h-6 w-16 bg-muted rounded" />
                        <div className="h-6 w-16 bg-muted rounded" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className={cn("text-center py-12", className)}>
        <div className="mb-4">
          <div className="w-24 h-24 bg-muted rounded-full mx-auto flex items-center justify-center">
            <Eye className="w-12 h-12 text-muted-foreground" />
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2">لم يتم العثور على نتائج</h3>
        <p className="text-muted-foreground mb-4">
          جرب تعديل كلمات البحث أو الفلاتر للحصول على نتائج أفضل
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          <Badge variant="outline">جرب البحث بالعربية</Badge>
          <Badge variant="outline">استخدم كلمات أقل</Badge>
          <Badge variant="outline">قلل الفلاتر</Badge>
        </div>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className={cn("space-y-4", className)}>
        {results.map((item) => (
          <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onContentClick(item)}>
            <CardContent className="p-0">
              <div className="flex gap-4 p-4">
                {/* Poster */}
                <div className="relative w-24 h-36 flex-shrink-0">
                  {item.posterUrl ? (
                    <img
                      src={item.posterUrl}
                      alt={item.titleArabic || item.title}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted rounded flex items-center justify-center">
                      <Play className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                  <Button
                    size="sm"
                    className="absolute inset-0 bg-black/50 text-white opacity-0 hover:opacity-100 transition-opacity"
                  >
                    <Play className="w-6 h-6" />
                  </Button>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold line-clamp-1">
                      {item.titleArabic || item.title}
                    </h3>
                    <div className="flex gap-2 flex-shrink-0 mr-3">
                      <Badge className={cn("text-xs", getTypeColor(item.type))}>
                        {getTypeName(item.type)}
                      </Badge>
                      {item.quality && (
                        <Badge variant="outline" className="text-xs">
                          {item.quality}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {item.descriptionArabic || item.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    {item.year && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{item.year}</span>
                      </div>
                    )}
                    
                    {item.duration && item.duration > 0 && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{item.duration} دقيقة</span>
                      </div>
                    )}
                    
                    {item.episodes && item.episodes > 0 && (
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{item.episodes} حلقة</span>
                      </div>
                    )}
                    
                    {item.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{item.rating}</span>
                      </div>
                    )}
                    
                    {item.language && (
                      <Badge variant="secondary" className="text-xs">
                        {item.language}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4", className)}>
      {results.map((item) => (
        <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => onContentClick(item)}>
          <CardContent className="p-0">
            <div className="relative aspect-[2/3]">
              {item.posterUrl ? (
                <img
                  src={item.posterUrl}
                  alt={item.titleArabic || item.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <Play className="w-12 h-12 text-muted-foreground" />
                </div>
              )}
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button size="lg" className="rounded-full">
                  <Play className="w-6 h-6" />
                </Button>
              </div>

              {/* Type Badge */}
              <Badge className={cn("absolute top-2 right-2 text-xs", getTypeColor(item.type))}>
                {getTypeName(item.type)}
              </Badge>

              {/* Quality Badge */}
              {item.quality && (
                <Badge variant="secondary" className="absolute top-2 left-2 text-xs">
                  {item.quality}
                </Badge>
              )}

              {/* Rating */}
              {item.rating && (
                <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/70 text-white px-2 py-1 rounded text-xs">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span>{item.rating}</span>
                </div>
              )}
            </div>

            <div className="p-3">
              <h3 className="font-semibold text-sm line-clamp-2 mb-1">
                {item.titleArabic || item.title}
              </h3>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{item.year}</span>
                {item.language && (
                  <Badge variant="outline" className="text-xs">
                    {item.language}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}