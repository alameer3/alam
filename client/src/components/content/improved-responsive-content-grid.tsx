import { ResponsiveContentCard } from "./responsive-content-card";
import { cn } from "@/lib/utils";
import { useResponsive } from "@/components/layout/responsive-layout";
import { Content } from "@shared/schema";
import { Film } from "lucide-react";
import { Link } from "wouter";

interface ImprovedResponsiveContentGridProps {
  content: Content[];
  loading?: boolean;
  gridSize?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'minimal' | 'detailed';
  maxItems?: number;
  title?: string;
  showMoreLink?: string;
  onContentPlay?: (content: Content) => void;
  onContentFavorite?: (content: Content) => void;
  className?: string;
}

export function ImprovedResponsiveContentGrid({
  content,
  loading = false,
  gridSize = 'medium',
  variant = 'default',
  maxItems,
  title,
  showMoreLink,
  onContentPlay,
  onContentFavorite,
  className
}: ImprovedResponsiveContentGridProps) {
  const { isMobile, isTablet } = useResponsive();
  const displayContent = maxItems ? content.slice(0, maxItems) : content;

  // تخطيط الشبكة المحسن للأجهزة المختلفة
  const getGridClasses = () => {
    if (isMobile) {
      return {
        small: "grid-cols-3 gap-2",
        medium: "grid-cols-2 gap-3",
        large: "grid-cols-1 gap-4"
      };
    } else if (isTablet) {
      return {
        small: "grid-cols-4 gap-3",
        medium: "grid-cols-3 gap-4",
        large: "grid-cols-2 gap-4"
      };
    } else {
      return {
        small: "grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4",
        medium: "grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4",
        large: "grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
      };
    }
  };

  const gridClasses = getGridClasses();

  // حالة التحميل المحسنة
  if (loading) {
    return (
      <div className={cn("space-y-4", className)}>
        {title && (
          <div className="flex items-center justify-between">
            <div className={cn(
              "h-6 bg-muted animate-pulse rounded",
              isMobile ? "w-24" : "w-32"
            )} />
            {showMoreLink && (
              <div className="h-4 w-16 bg-muted animate-pulse rounded" />
            )}
          </div>
        )}
        <div className={cn("grid", gridClasses[gridSize])}>
          {Array(isMobile ? 6 : 12).fill(0).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className={cn(
                "bg-muted animate-pulse rounded",
                gridSize === 'small' && (isMobile ? "h-32" : "h-44"),
                gridSize === 'medium' && (isMobile ? "h-40" : "h-56"), 
                gridSize === 'large' && (isMobile ? "h-48" : "h-72")
              )} />
              {!isMobile && (
                <>
                  <div className="h-4 bg-muted animate-pulse rounded" />
                  <div className="h-3 bg-muted animate-pulse rounded w-3/4" />
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {title && (
        <div className="flex items-center justify-between">
          <h2 className={cn(
            "font-bold text-foreground",
            isMobile ? "text-lg" : "text-xl"
          )}>
            {title}
          </h2>
          {showMoreLink && (
            <Link 
              href={showMoreLink} 
              className={cn(
                "text-primary hover:underline transition-colors",
                isMobile ? "text-sm" : "text-sm"
              )}
            >
              عرض المزيد
            </Link>
          )}
        </div>
      )}
      
      <div className={cn("grid", gridClasses[gridSize])}>
        {displayContent.map((item) => (
          <ResponsiveContentCard
            key={item.id}
            content={item}
            size={gridSize}
            variant={variant}
            onPlay={onContentPlay}
            onFavorite={onContentFavorite}
            className={cn(
              "transition-all duration-200 hover:scale-105",
              isMobile && "hover:scale-102"
            )}
          />
        ))}
      </div>

      {/* رسالة فارغة محسنة */}
      {displayContent.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Film className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-base">
            لا توجد عناصر للعرض حالياً
          </p>
          <p className="text-muted-foreground text-sm mt-2">
            جرب تغيير الفلاتر أو البحث عن شيء آخر
          </p>
        </div>
      )}
    </div>
  );
}