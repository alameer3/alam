import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Grid3X3, 
  Grid2X2, 
  List, 
  SortAsc, 
  Filter,
  Eye,
  Heart,
  Download,
  Play,
  Star,
  Clock,
  Calendar,
  Film
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface Content {
  id: number;
  title: string;
  title_ar: string;
  description?: string;
  description_ar?: string;
  type: string;
  release_date: string;
  language: string;
  quality: string;
  rating: number;
  duration?: number;
  poster?: string;
  created_at: string;
}

interface AdvancedContentGridProps {
  content: Content[];
  loading?: boolean;
  viewMode?: 'grid' | 'list' | 'compact';
  onViewModeChange?: (mode: 'grid' | 'list' | 'compact') => void;
}

export function AdvancedContentGrid({ 
  content, 
  loading = false, 
  viewMode = 'grid',
  onViewModeChange 
}: AdvancedContentGridProps) {
  const [selectedView, setSelectedView] = useState(viewMode);
  const [sortBy, setSortBy] = useState('date');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [, setLocation] = useLocation();

  const handleViewChange = (mode: 'grid' | 'list' | 'compact') => {
    setSelectedView(mode);
    onViewModeChange?.(mode);
  };

  const toggleFavorite = (contentId: number) => {
    setFavorites(prev => 
      prev.includes(contentId) 
        ? prev.filter(id => id !== contentId)
        : [...prev, contentId]
    );
  };

  const sortedContent = [...(content || [])].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'year':
        return new Date(b.release_date).getFullYear() - new Date(a.release_date).getFullYear();
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  const getQualityColor = (quality: string) => {
    switch (quality.toLowerCase()) {
      case '4k':
      case 'uhd':
        return 'bg-purple-500';
      case 'hd':
      case '1080p':
        return 'bg-blue-500';
      case '720p':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getDetailUrl = (item: Content) => {
    const title = encodeURIComponent(item.title_ar.replace(/\s+/g, '-'));
    switch (item.type) {
      case 'movie':
        return `/movie/${item.id}/${title}`;
      case 'series':
        return `/series/${item.id}/${title}`;
      case 'program':
        return `/program/${item.id}/${title}`;
      case 'game':
        return `/game/${item.id}/${title}`;
      case 'application':
        return `/application/${item.id}/${title}`;
      case 'theater':
        return `/theater/${item.id}/${title}`;
      case 'wrestling':
        return `/wrestling/${item.id}/${title}`;
      case 'sports':
        return `/sports/${item.id}/${title}`;
      default:
        return `/content/${item.id}`;
    }
  };

  const ContentCard = ({ item }: { item: Content }) => {
    const isFavorite = favorites.includes(item.id);
    
    if (selectedView === 'list') {
      return (
        <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
          <CardContent className="p-4">
            <div className="flex gap-4">
              {/* الصورة */}
              <div className="relative flex-shrink-0 w-24 h-36 rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5">
                {item.poster ? (
                  <img 
                    src={item.poster ? `/serverdata/images/${item.poster}` : '/api/placeholder/150/200'} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = '/api/placeholder/150/200';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <Play className="h-8 w-8" />
                  </div>
                )}
                {/* شارة الجودة */}
                <Badge className={cn("absolute top-2 right-2 text-xs px-1 py-0.5", getQualityColor(item.quality))}>
                  {item.quality}
                </Badge>
              </div>

              {/* المحتوى */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-lg leading-tight line-clamp-1">{item.title_ar}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">{item.title}</p>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm font-medium">{item.rating}</span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {item.description_ar || item.description || "وصف غير متوفر"}
                </p>

                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="outline" className="text-xs">
                    <Calendar className="h-3 w-3 ml-1" />
                    {new Date(item.release_date).getFullYear()}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {item.language}
                  </Badge>
                  {item.duration && (
                    <Badge variant="outline" className="text-xs">
                      <Clock className="h-3 w-3 ml-1" />
                      {Math.floor(item.duration / 60)}س {item.duration % 60}د
                    </Badge>
                  )}
                  {item.episodes && item.episodes > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {item.episodes} حلقة
                    </Badge>
                  )}
                </div>

                {/* الأزرار */}
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => setLocation(getDetailUrl(item))}
                  >
                    <Play className="h-4 w-4 ml-2" />
                    مشاهدة
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => toggleFavorite(item.id)}
                    className={isFavorite ? "text-red-500 border-red-500" : ""}
                  >
                    <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (selectedView === 'compact') {
      return (
        <Card className="group hover:shadow-md transition-all duration-200 hover:scale-[1.01]">
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <div className="relative w-16 h-20 rounded overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 flex-shrink-0">
                {item.poster ? (
                  <img 
                    src={item.poster ? `/serverdata/images/${item.poster}` : '/api/placeholder/80/100'} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/api/placeholder/80/100';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <Play className="h-4 w-4" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm line-clamp-1">{item.title_ar}</h4>
                <p className="text-xs text-muted-foreground line-clamp-1">{item.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs px-1 py-0.5">{new Date(item.release_date).getFullYear()}</Badge>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="h-3 w-3 fill-current" />
                    <span className="text-xs">{item.rating}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-6 w-6 p-0"
                  onClick={() => setLocation(getDetailUrl(item))}
                >
                  <Play className="h-3 w-3" />
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className={cn("h-6 w-6 p-0", isFavorite && "text-red-500")}
                  onClick={() => toggleFavorite(item.id)}
                >
                  <Heart className={cn("h-3 w-3", isFavorite && "fill-current")} />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    // Grid View (Default)
    return (
      <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden">
        <div className="relative aspect-[2/3] overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5">
          {item.poster ? (
            <img 
              src={item.poster ? `/serverdata/images/${item.poster}` : '/api/placeholder/300/450'} 
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              onError={(e) => {
                e.currentTarget.src = '/api/placeholder/300/450';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <Play className="h-12 w-12" />
            </div>
          )}
          
          {/* العناصر المطلقة */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* شارة الجودة */}
          <Badge className={cn("absolute top-2 right-2 text-xs px-2 py-1", getQualityColor(item.quality))}>
            {item.quality}
          </Badge>
          
          {/* التقييم */}
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/70 text-white px-2 py-1 rounded text-xs">
            <Star className="h-3 w-3 fill-current text-yellow-500" />
            <span>{item.rating}</span>
          </div>

          {/* أزرار التحكم */}
          <div className="absolute bottom-2 left-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button 
              size="sm" 
              className="flex-1 h-8 text-xs"
              onClick={() => setLocation(getDetailUrl(item))}
            >
              <Play className="h-3 w-3 ml-1" />
              مشاهدة
            </Button>
            <Button 
              size="sm" 
              variant="secondary"
              onClick={() => toggleFavorite(item.id)}
              className={cn("h-8 w-8 p-0", isFavorite && "text-red-500")}
            >
              <Heart className={cn("h-3 w-3", isFavorite && "fill-current")} />
            </Button>
          </div>

          {/* عداد المشاهدات */}
          <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center gap-1 bg-black/70 text-white px-2 py-1 rounded text-xs">
              <Eye className="h-3 w-3" />
              <span>1.2k</span>
            </div>
          </div>
        </div>

        <CardContent className="p-3">
          <div 
            className="cursor-pointer"
            onClick={() => setLocation(getDetailUrl(item))}
          >
            <h3 className="font-bold text-sm line-clamp-1 mb-1">{item.title_ar}</h3>
            <p className="text-xs text-muted-foreground line-clamp-1 mb-2">{item.title}</p>
          </div>
          
          <div className="flex flex-wrap gap-1 mb-2">
            <Badge variant="outline" className="text-xs px-1 py-0.5">{new Date(item.release_date).getFullYear()}</Badge>
            <Badge variant="outline" className="text-xs px-1 py-0.5">{item.language}</Badge>
            {item.duration && (
              <Badge variant="outline" className="text-xs px-1 py-0.5">{item.duration}د</Badge>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* أدوات التحكم */}
        <div className="flex items-center justify-between">
          <div className="h-8 w-32 bg-muted animate-pulse rounded" />
          <div className="flex gap-2">
            <div className="h-8 w-24 bg-muted animate-pulse rounded" />
            <div className="h-8 w-24 bg-muted animate-pulse rounded" />
          </div>
        </div>
        
        {/* الشبكة */}
        <div className={cn(
          "grid gap-4",
          selectedView === 'grid' && "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6",
          selectedView === 'list' && "grid-cols-1",
          selectedView === 'compact' && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        )}>
          {Array(12).fill(0).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className={cn(
                "bg-muted animate-pulse rounded",
                selectedView === 'grid' && "aspect-[2/3]",
                selectedView === 'list' && "h-36",
                selectedView === 'compact' && "h-20"
              )} />
              <div className="h-4 bg-muted animate-pulse rounded" />
              <div className="h-3 bg-muted animate-pulse rounded w-3/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* أدوات التحكم */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            {content.length} عنصر
          </span>
          
          {/* مرشح الترتيب */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <SortAsc className="h-4 w-4" />
                ترتيب
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSortBy('date')}>
                الأحدث أولاً
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('rating')}>
                الأعلى تقييماً
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('year')}>
                السنة
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('title')}>
                الاسم
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            فلاتر
          </Button>
        </div>

        {/* أزرار العرض */}
        <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
          <Button
            size="sm"
            variant={selectedView === 'grid' ? 'default' : 'ghost'}
            onClick={() => handleViewChange('grid')}
            className="h-8 w-8 p-0"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant={selectedView === 'list' ? 'default' : 'ghost'}
            onClick={() => handleViewChange('list')}
            className="h-8 w-8 p-0"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant={selectedView === 'compact' ? 'default' : 'ghost'}
            onClick={() => handleViewChange('compact')}
            className="h-8 w-8 p-0"
          >
            <Grid2X2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* الشبكة */}
      <div className={cn(
        "grid gap-4",
        selectedView === 'grid' && "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6",
        selectedView === 'list' && "grid-cols-1 max-w-4xl mx-auto",
        selectedView === 'compact' && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto"
      )}>
        {sortedContent.map((item) => (
          <ContentCard key={item.id} item={item} />
        ))}
      </div>

      {content.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
            <Film className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">لا توجد نتائج</h3>
          <p className="text-muted-foreground">جرب تغيير الفلاتر أو البحث بكلمات أخرى</p>
        </div>
      )}
    </div>
  );
}

export default AdvancedContentGrid;