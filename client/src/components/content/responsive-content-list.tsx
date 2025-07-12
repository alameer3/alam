import { useState } from "react";
import { ResponsiveGrid, useResponsive } from "@/components/layout/responsive-layout";
import { EnhancedContentCard } from "./enhanced-content-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Content } from "@shared/schema";
import { 
  Grid, 
  List, 
  SortAsc, 
  SortDesc, 
  Filter,
  Eye,
  Calendar,
  Star
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ResponsiveContentListProps {
  content: Content[];
  loading?: boolean;
  title?: string;
  showViewOptions?: boolean;
  showSortOptions?: boolean;
  showFilterOptions?: boolean;
}

type ViewMode = "grid" | "list";
type SortOption = "title" | "year" | "rating" | "views" | "date";
type SortOrder = "asc" | "desc";

export function ResponsiveContentList({
  content,
  loading = false,
  title,
  showViewOptions = true,
  showSortOptions = true,
  showFilterOptions = true
}: ResponsiveContentListProps) {
  const { isMobile, isTablet } = useResponsive();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortOption>("title");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  // تحديد عدد الأعمدة بناءً على الشاشة ونمط العرض
  const getGridCols = () => {
    if (viewMode === "list") {
      return { mobile: 1, tablet: 1, desktop: 1 };
    }
    
    if (isMobile) {
      return { mobile: 2, tablet: 2, desktop: 2 };
    } else if (isTablet) {
      return { mobile: 2, tablet: 3, desktop: 3 };
    } else {
      return { mobile: 2, tablet: 3, desktop: 4 };
    }
  };

  // ترتيب المحتوى
  const sortedContent = [...content].sort((a, b) => {
    let valueA: any = a[sortBy];
    let valueB: any = b[sortBy];

    // معالجة خاصة للتاريخ والتقييم
    if (sortBy === 'year') {
      valueA = a.year || 0;
      valueB = b.year || 0;
    } else if (sortBy === 'rating') {
      valueA = a.rating || 0;
      valueB = b.rating || 0;
    } else if (sortBy === 'views') {
      valueA = a.views || 0;
      valueB = b.views || 0;
    }

    if (typeof valueA === 'string') {
      valueA = valueA.toLowerCase();
      valueB = valueB.toLowerCase();
    }

    if (sortOrder === 'asc') {
      return valueA > valueB ? 1 : -1;
    } else {
      return valueA < valueB ? 1 : -1;
    }
  });

  const sortOptions = [
    { value: "title", label: "العنوان", icon: SortAsc },
    { value: "year", label: "السنة", icon: Calendar },
    { value: "rating", label: "التقييم", icon: Star },
    { value: "views", label: "المشاهدات", icon: Eye },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        {title && (
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{title}</h2>
            <div className="flex items-center gap-2">
              <div className="w-20 h-8 bg-muted animate-pulse rounded" />
              <div className="w-20 h-8 bg-muted animate-pulse rounded" />
            </div>
          </div>
        )}
        <ResponsiveGrid cols={getGridCols()} gap="gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-muted animate-pulse rounded-lg h-64" />
          ))}
        </ResponsiveGrid>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with title and controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {title && (
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {title}
            </h2>
          )}
          <Badge variant="secondary" className="text-sm">
            {content.length} عنصر
          </Badge>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* View Mode Toggle */}
          {showViewOptions && !isMobile && (
            <div className="flex items-center border rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="p-2"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="p-2"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Sort Options */}
          {showSortOptions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                  {isMobile ? "ترتيب" : `ترتيب حسب ${sortOptions.find(opt => opt.value === sortBy)?.label}`}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>ترتيب حسب</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {sortOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => setSortBy(option.value as SortOption)}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Icon className="h-4 w-4" />
                      {option.label}
                      {sortBy === option.value && (
                        <Badge variant="secondary" className="mr-auto">✓</Badge>
                      )}
                    </DropdownMenuItem>
                  );
                })}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  {sortOrder === "asc" ? <SortDesc className="h-4 w-4" /> : <SortAsc className="h-4 w-4" />}
                  {sortOrder === "asc" ? "تنازلي" : "تصاعدي"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Filter Options */}
          {showFilterOptions && (
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              {isMobile ? "فلتر" : "تصفية"}
            </Button>
          )}
        </div>
      </div>

      {/* Content Grid */}
      <ResponsiveGrid 
        cols={getGridCols()} 
        gap={isMobile ? "gap-3" : "gap-4"}
        className="performance-optimized"
      >
        {sortedContent.map((item) => (
          <EnhancedContentCard
            key={item.id}
            content={item}
            variant={viewMode === "list" ? "horizontal" : "vertical"}
            size={isMobile ? "sm" : "md"}
            showMetadata={!isMobile || viewMode === "list"}
            showActions={!isMobile}
          />
        ))}
      </ResponsiveGrid>

      {/* Empty State */}
      {content.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <Filter className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">لا يوجد محتوى</h3>
          <p className="text-muted-foreground">
            لم يتم العثور على أي محتوى يطابق المعايير المحددة
          </p>
        </div>
      )}
    </div>
  );
}