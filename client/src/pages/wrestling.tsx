import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AdvancedContentGrid from "@/components/content/advanced-content-grid";

import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";

export default function Wrestling() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedQuality, setSelectedQuality] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);

  const { data: categories } = useQuery({
    queryKey: ['/api/categories'],
  });

  const filters = {
    search: searchQuery,
    category: selectedCategory,
    year: selectedYear,
    quality: selectedQuality
  };

  const { data: contentData, isLoading } = useQuery({
    queryKey: ['/api/content/wrestling', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);
      if (filters.year) params.append('year', filters.year);
      if (filters.quality) params.append('quality', filters.quality);
      
      const response = await fetch(`/api/content/wrestling?${params}`);
      if (!response.ok) throw new Error('Failed to fetch content');
      return response.json();
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // البحث سيتم عبر التصفية
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-900 to-orange-900 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-4">المصارعة</h1>
          <p className="text-center text-white/80 max-w-2xl mx-auto">
            اكتشف أحدث مباريات المصارعة الحرة والبطولات العالمية
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Input
                type="text"
                placeholder="البحث في المصارعة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 pr-4 pl-12 bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
                dir="rtl"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            </div>
          </form>

          {/* Filter Toggle */}
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="h-12 px-6 bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
          >
            <Filter className="w-5 h-5 mr-2" />
            الفلاتر
          </Button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-slate-800 p-4 rounded-lg mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">الفئة</label>
                <select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white"
                >
                  <option value="">كل الفئات</option>
                  {categories?.map((cat: any) => (
                    <option key={cat.id} value={cat.id}>{cat.name_arabic}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">السنة</label>
                <select 
                  value={selectedYear} 
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white"
                >
                  <option value="">كل السنوات</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">الجودة</label>
                <select 
                  value={selectedQuality} 
                  onChange={(e) => setSelectedQuality(e.target.value)}
                  className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white"
                >
                  <option value="">كل الجودات</option>
                  <option value="HD">HD</option>
                  <option value="4K">4K</option>
                  <option value="FHD">FHD</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Content Grid */}
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <AdvancedContentGrid
            content={contentData?.data?.content || []}
            loading={isLoading}
          />
        )}
      </div>
    </div>
  );
}