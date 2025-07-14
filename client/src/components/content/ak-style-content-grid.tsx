import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { AkStyleContentCard } from "./ak-style-content-card";
import { AkStyleFilters } from "../filters/ak-style-filters";
import { Content } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Grid3X3, List } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface FilterOptions {
  section?: string;
  category?: string;
  rating?: string;
  year?: string;
  language?: string;
  quality?: string;
  resolution?: string;
}

interface AkStyleContentGridProps {
  contentType: string;
  title: string;
  onContentClick?: (content: Content) => void;
  filters?: FilterOptions;
}

function ContentSkeleton({ variant = "grid" }: { variant?: "grid" | "list" }) {
  if (variant === "list") {
    return (
      <div className="bg-gray-900 rounded-lg overflow-hidden">
        <div className="flex">
          <Skeleton className="w-32 h-48 bg-gray-800" />
          <div className="flex-1 p-4 space-y-3">
            <Skeleton className="h-6 w-3/4 bg-gray-800" />
            <Skeleton className="h-4 w-full bg-gray-800" />
            <Skeleton className="h-4 w-2/3 bg-gray-800" />
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-8 w-20 bg-gray-800" />
              <Skeleton className="h-8 w-20 bg-gray-800" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden">
      <Skeleton className="aspect-[2/3] w-full bg-gray-800" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4 bg-gray-800" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-12 bg-gray-800" />
          <Skeleton className="h-6 w-16 bg-gray-800" />
        </div>
      </div>
    </div>
  );
}

export function AkStyleContentGrid({ contentType, title, onContentClick, filters: propFilters }: AkStyleContentGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({});
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const itemsPerPage = 24;

  // تحديث الفلاتر عند تغييرها من الخارج
  useEffect(() => {
    if (propFilters) {
      setFilters(propFilters);
      setCurrentPage(1); // إعادة تعيين الصفحة عند تغيير الفلاتر
    }
  }, [propFilters]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/content', contentType, currentPage, filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        type: contentType,
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        ...filters
      });
      const response = await fetch(`/api/content?${params}`);
      if (!response.ok) throw new Error('Failed to fetch content');
      return response.json();
    }
  });

  const content = data?.content || [];
  const totalPages = Math.ceil((parseInt(data?.total) || 0) / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">خطأ في تحميل المحتوى</h2>
            <p className="text-gray-400">حدث خطأ أثناء تحميل المحتوى. يرجى المحاولة مرة أخرى.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-white text-center mb-2">{title}</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-600 mx-auto rounded-full"></div>
        </div>
      </div>

      {/* Filters */}
      <AkStyleFilters 
        onFiltersChange={handleFiltersChange}
        contentType={contentType}
      />

      {/* View Mode Toggle & Stats */}
      <div className="bg-gray-800 py-4 px-4 border-b border-gray-700">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-gray-400">
            {isLoading ? (
              <span>جاري التحميل...</span>
            ) : (
              <span>عرض {content.length} من أصل {data?.total || 0} نتيجة</span>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="bg-gray-700 hover:bg-gray-600"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"} 
              size="sm"
              onClick={() => setViewMode("list")}
              className="bg-gray-700 hover:bg-gray-600"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className={viewMode === "grid" 
            ? "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
            : "space-y-4"
          }>
            {Array.from({ length: 12 }, (_, i) => (
              <ContentSkeleton key={i} variant={viewMode} />
            ))}
          </div>
        ) : content.length > 0 ? (
          <div className={viewMode === "grid" 
            ? "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
            : "space-y-4"
          }>
            {content.map((item: Content) => (
              <AkStyleContentCard
                key={item.id}
                content={item}
                onClick={onContentClick}
                variant={viewMode}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-bold text-white mb-2">لا توجد نتائج</h3>
            <p className="text-gray-400">لم يتم العثور على محتوى مطابق للفلاتر المحددة</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-gray-800 py-6 px-4 border-t border-gray-700">
          <div className="container mx-auto">
            <div className="flex justify-center items-center gap-2 flex-wrap">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
              >
                <ChevronRight className="w-4 h-4 mr-1" />
                السابق
              </Button>
              
              {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    onClick={() => handlePageChange(pageNum)}
                    className={currentPage === pageNum 
                      ? "bg-orange-600 hover:bg-orange-700" 
                      : "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                    }
                  >
                    {pageNum}
                  </Button>
                );
              })}
              
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
              >
                التالي
                <ChevronLeft className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}