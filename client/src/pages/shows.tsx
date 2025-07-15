import { useQuery } from "@tanstack/react-query";
import { AkStyleContentCard } from "@/components/content/ak-style-content-card";
import { AkStyleFilters } from "@/components/filters/ak-style-filters";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

interface Content {
  id: number;
  title: string;
  description: string;
  type: string;
  poster_url: string;
  release_year: number;
  language: string;
  quality: string;
  resolution: string;
  rating: number;
  genres: string[];
  categories: string[];
}

export default function Shows() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState({});

  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/content', { type: 'tv', page: currentPage, limit: 24, ...activeFilters }],
    queryFn: () => {
      const searchParams = new URLSearchParams({ 
        type: 'tv',
        page: currentPage.toString(),
        limit: '24',
        ...Object.fromEntries(Object.entries(activeFilters).filter(([_, value]) => value))
      });
      return fetch(`/api/content?${searchParams}`).then(res => res.json());
    }
  });

  const handleFilterChange = (filters: any) => {
    setActiveFilters(filters);
    setCurrentPage(1);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-black">
        <p className="text-white text-xl">حدث خطأ في تحميل البرامج التلفزيونية</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
          البرامج التلفزيونية
        </h1>
        
        <AkStyleFilters 
          onFilterChange={handleFilterChange}
          contentType="tv"
        />

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-6">
            {Array.from({ length: 24 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[2/3] w-full bg-slate-800" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-6">
              {data?.content?.map((item: Content) => (
                <AkStyleContentCard 
                  key={item.id} 
                  content={item}
                  linkPath={`/shows/${item.id}/${encodeURIComponent(item.title)}`}
                />
              ))}
            </div>
            
            {data?.content?.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">لا توجد برامج تلفزيونية متاحة</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}