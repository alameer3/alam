import { ResponsiveContentCard } from "./responsive-content-card";
import { cn } from "@/lib/utils";

interface Content {
  id: number;
  title: string;
  titleArabic: string;
  description?: string;
  type: string;
  year: number;
  language: string;
  quality: string;
  resolution: string;
  rating: string;
  duration?: number;
  episodes?: number;
  posterUrl?: string;
  createdAt: string;
  views?: number;
}

interface ResponsiveContentGridProps {
  content: Content[];
  loading?: boolean;
  gridSize?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'minimal' | 'detailed';
  maxItems?: number;
  title?: string;
  showMoreLink?: string;
  onContentPlay?: (content: Content) => void;
  onContentFavorite?: (content: Content) => void;
}

export function ResponsiveContentGrid({
  content,
  loading = false,
  gridSize = 'medium',
  variant = 'default',
  maxItems,
  title,
  showMoreLink,
  onContentPlay,
  onContentFavorite
}: ResponsiveContentGridProps) {
  const displayContent = maxItems ? content.slice(0, maxItems) : content;

  const gridClasses = {
    small: "grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10",
    medium: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6",
    large: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {title && (
          <div className="flex items-center justify-between">
            <div className="h-6 w-32 bg-muted animate-pulse rounded" />
            <div className="h-4 w-16 bg-muted animate-pulse rounded" />
          </div>
        )}
        <div className={cn("grid gap-4", gridClasses[gridSize])}>
          {Array(12).fill(0).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className={cn(
                "bg-muted animate-pulse rounded",
                gridSize === 'small' && "h-44",
                gridSize === 'medium' && "h-56", 
                gridSize === 'large' && "h-72"
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
    <div className="space-y-4">
      {title && (
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">{title}</h2>
          {showMoreLink && (
            <a 
              href={showMoreLink} 
              className="text-sm text-primary hover:underline"
            >
              عرض المزيد
            </a>
          )}
        </div>
      )}
      
      <div className={cn("grid gap-4", gridClasses[gridSize])}>
        {displayContent.map((item) => (
          <ResponsiveContentCard
            key={item.id}
            content={item}
            size={gridSize}
            variant={variant}
            onPlay={onContentPlay}
            onFavorite={onContentFavorite}
          />
        ))}
      </div>

      {displayContent.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">لا توجد عناصر للعرض</p>
        </div>
      )}
    </div>
  );
}