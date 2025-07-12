import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useFavorites } from "@/hooks/useUserInteractions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Heart, X, Play, Clock, Star } from "lucide-react";
import { Content } from "@shared/schema";
import { cn } from "@/lib/utils";

interface FavoritesModalProps {
  onContentSelect?: (content: Content) => void;
  children?: React.ReactNode;
}

export default function FavoritesModal({ onContentSelect, children }: FavoritesModalProps) {
  const { user } = useAuth();
  const { data: favoritesData, isLoading } = useFavorites(user?.id);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const favorites = favoritesData?.content || [];
  const filteredFavorites = selectedType 
    ? favorites.filter((content: Content) => content.type === selectedType)
    : favorites;

  const getTypeCount = (type: string) => {
    return favorites.filter((content: Content) => content.type === type).length;
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'movie': return 'أفلام';
      case 'series': return 'مسلسلات';
      case 'tv': return 'تلفزيون';
      case 'misc': return 'متنوع';
      default: return type;
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

  const types = ['movie', 'series', 'tv', 'misc'];

  if (!user) {
    return null;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            المفضلة ({favorites.length})
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            المفضلة ({favorites.length})
          </DialogTitle>
          <DialogDescription>
            قائمة المحتوى المفضل لديك
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* Type Filters */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedType === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType(null)}
              className="text-sm"
            >
              الكل ({favorites.length})
            </Button>
            {types.map(type => {
              const count = getTypeCount(type);
              return count > 0 ? (
                <Button
                  key={type}
                  variant={selectedType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType(type)}
                  className="text-sm"
                >
                  {getTypeName(type)} ({count})
                </Button>
              ) : null;
            })}
          </div>

          {/* Content */}
          <ScrollArea className="h-[400px] pr-4">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex gap-4 p-4 animate-pulse">
                    <div className="w-24 h-36 bg-gray-200 rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredFavorites.length > 0 ? (
              <div className="space-y-4">
                {filteredFavorites.map((content: Content) => (
                  <div
                    key={content.id}
                    className="flex gap-4 p-4 rounded-lg border hover:shadow-md transition-shadow cursor-pointer group"
                    onClick={() => onContentSelect?.(content)}
                  >
                    <div className="relative">
                      <div className="w-24 h-36 bg-gray-200 rounded overflow-hidden">
                        {content.posterUrl ? (
                          <img
                            src={content.posterUrl}
                            alt={content.titleArabic || content.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-300">
                            <Play className="h-8 w-8 text-gray-500" />
                          </div>
                        )}
                      </div>
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                        <Play className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge className={cn("text-xs", getTypeColor(content.type))}>
                            {getTypeName(content.type)}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {content.quality}
                          </Badge>
                          {content.rating && (
                            <Badge className="text-xs bg-yellow-500">
                              <Star className="h-3 w-3 fill-current ml-1" />
                              {content.rating}
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-medium text-lg">
                          {content.titleArabic || content.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {content.title}
                        </p>
                      </div>
                      
                      {content.description && (
                        <p className="text-sm text-gray-500 line-clamp-2">
                          {content.descriptionArabic || content.description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{content.year}</span>
                        <span>•</span>
                        <span>{content.language}</span>
                        {content.duration && (
                          <>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{content.duration} دقيقة</span>
                            </div>
                          </>
                        )}
                        {content.episodes && content.episodes > 0 && (
                          <>
                            <span>•</span>
                            <span>{content.episodes} حلقة</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {selectedType ? `لا توجد ${getTypeName(selectedType)} في المفضلة` : "لا توجد مفضلة بعد"}
                </h3>
                <p className="text-gray-500">
                  {selectedType 
                    ? `ابدأ بإضافة ${getTypeName(selectedType)} إلى قائمة المفضلة`
                    : "ابدأ بإضافة محتوى إلى قائمة المفضلة لديك"
                  }
                </p>
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}