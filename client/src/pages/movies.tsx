import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AdvancedContentGrid from "@/components/content/advanced-content-grid";
import AdvancedFilters from "@/components/filters/advanced-filters";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Movies() {
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('latest');

  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/content/movies', currentPage, filters, sortBy],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '24',
        sort: sortBy,
        ...filters
      });
      const response = await fetch(`/api/content/movies?${params}`);
      if (!response.ok) throw new Error('Failed to fetch movies');
      return response.json();
    }
  });

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPages = Math.ceil((data?.data?.total || 0) / 24);

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">أفلام</h1>
        <p className="text-gray-600">استكشف مجموعة واسعة من الأفلام العربية والأجنبية</p>
      </div>

      {/* Advanced Filters */}
      <AdvancedFilters
        onFiltersChange={handleFiltersChange}
        initialFilters={filters}
      />

      {/* Content Grid */}
      <AdvancedContentGrid
        content={data?.data?.content || []}
        loading={isLoading}
        error={error?.message}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="flex items-center gap-2"
          >
            <ChevronRight className="w-4 h-4" />
            السابق
          </Button>

          <div className="flex items-center gap-2">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNumber = i + 1;
              return (
                <Button
                  key={pageNumber}
                  variant={currentPage === pageNumber ? "default" : "outline"}
                  onClick={() => handlePageChange(pageNumber)}
                  className="w-10 h-10"
                >
                  {pageNumber}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="flex items-center gap-2"
          >
            التالي
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}