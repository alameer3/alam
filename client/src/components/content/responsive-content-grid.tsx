import { useState, useEffect } from "react";
import { Content } from "@shared/schema";
import ResponsiveContentCard from "./responsive-content-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Grid3X3, 
  List, 
  SlidersHorizontal,
  ArrowUp,
  ArrowDown,
  Calendar,
  Star,
  Eye,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ResponsiveContentGridProps {
  content: Content[];
  isLoading?: boolean;
  error?: string;
  onContentClick?: (content: Content) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  showFilters?: boolean;
  initialViewMode?: 'grid' | 'list';
}

type SortOption = 'title' | 'releaseDate' | 'rating' | 'views' | 'createdAt';
type ViewMode = 'grid' | 'list';

export default function ResponsiveContentGrid({
  content,
  isLoading,
  error,
  onContentClick,
  onLoadMore,
  hasMore,
  showFilters = true,
  initialViewMode = 'grid'
}: ResponsiveContentGridProps) {
  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode);
  const [sortBy, setSortBy] = useState<SortOption>('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showSortOptions, setShowSortOptions] = useState(false);

  // Sort content based on selected option
  const sortedContent = [...content].sort((a, b) => {
    let aValue: any, bValue: any;
    
    switch (sortBy) {
      case 'title':
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case 'releaseDate':
        aValue = new Date(a.releaseDate);
        bValue = new Date(b.releaseDate);
        break;
      case 'rating':
        aValue = a.rating || 0;
        bValue = b.rating || 0;
        break;
      case 'views':
        aValue = a.views || 0;
        bValue = b.views || 0;
        break;
      case 'createdAt':
        aValue = new Date(a.createdAt);
        bValue = new Date(b.createdAt);
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className={cn(
      "grid gap-6",
      viewMode === 'grid' 
        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5" 
        : "grid-cols-1"
    )}>
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <div className="aspect-[3/4] bg-muted animate-pulse" />
          <CardContent className="p-4">
            <div className="h-4 bg-muted rounded animate-pulse mb-2" />
            <div className="h-3 bg-muted rounded animate-pulse w-3/4 mb-2" />
            <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-lg mb-4">حدث خطأ أثناء تحميل المحتوى</div>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  // Empty state
  if (!isLoading && content.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground text-lg mb-4">لا يوجد محتوى للعرض</div>
        <p className="text-muted-foreground">جرب تعديل الفلاتر أو البحث عن شيء آخر</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      {showFilters && (
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {content.length} عنصر
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Sort Options */}
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSortOptions(!showSortOptions)}
                className="flex items-center gap-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                ترتيب
              </Button>
              
              {showSortOptions && (
                <div className="absolute top-full left-0 mt-2 bg-popover border border-border rounded-md shadow-lg z-10 min-w-[200px]">
                  <div className="p-2 space-y-1">
                    {[
                      { value: 'title', label: 'الاسم', icon: null },
                      { value: 'releaseDate', label: 'تاريخ الإصدار', icon: Calendar },
                      { value: 'rating', label: 'التقييم', icon: Star },
                      { value: 'views', label: 'المشاهدات', icon: Eye },
                      { value: 'createdAt', label: 'تاريخ الإضافة', icon: Clock }
                    ].map(option => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value as SortOption);
                          setShowSortOptions(false);
                        }}
                        className={cn(
                          "w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                          sortBy === option.value 
                            ? "bg-primary text-primary-foreground" 
                            : "hover:bg-muted"
                        )}
                      >
                        {option.icon && <option.icon className="w-4 h-4" />}
                        {option.label}
                      </button>
                    ))}
                    
                    <div className="border-t border-border pt-2 mt-2">
                      <button
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-muted"
                      >
                        {sortOrder === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                        {sortOrder === 'asc' ? 'تصاعدي' : 'تنازلي'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center border border-border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-none rounded-r-md"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-none rounded-l-md"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Content Grid */}
      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <div className={cn(
          "grid gap-6",
          viewMode === 'grid' 
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5" 
            : "grid-cols-1 md:grid-cols-2"
        )}>
          {sortedContent.map((item) => (
            <ResponsiveContentCard
              key={item.id}
              content={item}
              onClick={onContentClick}
              size={viewMode === 'grid' ? 'md' : 'lg'}
              showDetails={true}
              showActions={true}
            />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {hasMore && onLoadMore && (
        <div className="text-center pt-8">
          <Button
            onClick={onLoadMore}
            variant="outline"
            size="lg"
            disabled={isLoading}
            className="min-w-[200px]"
          >
            {isLoading ? 'جاري التحميل...' : 'تحميل المزيد'}
          </Button>
        </div>
      )}
    </div>
  );
}