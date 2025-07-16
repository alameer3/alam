import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import AdvancedContentGrid from "@/components/content/advanced-content-grid";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Calendar, Clock } from "lucide-react";

export default function Recent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);

  const { data: categories } = useQuery({
    queryKey: ['/api/categories'],
  });

  const filters = {
    search: searchQuery,
    category: selectedCategory,
    type: selectedType
  };

  const { data: contentData, isLoading } = useQuery({
    queryKey: ['/api/content/recent', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);
      if (filters.type) params.append('type', filters.type);
      
      const response = await fetch(`/api/content?${params}`);
      if (!response.ok) throw new Error('Failed to fetch content');
      return response.json();
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // البحث سيتم عبر التصفية
  };

  const contentTypes = [
    { value: "movie", label: "أفلام" },
    { value: "series", label: "مسلسلات" },
    { value: "television", label: "تلفزيون" },
    { value: "programs", label: "البرامج" },
    { value: "games", label: "الألعاب" },
    { value: "applications", label: "التطبيقات" },
    { value: "theater", label: "المسرحيات" },
    { value: "wrestling", label: "المصارعة" },
    { value: "sports", label: "الرياضة" },
    { value: "misc", label: "منوعات" }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-900 to-red-900 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Clock className="w-8 h-8 text-orange-400" />
            <h1 className="text-4xl font-bold text-center">أُضيف حديثاً</h1>
          </div>
          <p className="text-center text-white/80 max-w-2xl mx-auto">
            آخر المحتويات المضافة حديثاً في جميع الأقسام
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
                placeholder="البحث في المحتوى المضاف حديثاً..."
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
            <Filter className="w-5 h-5 ml-2" />
            الفلاتر
          </Button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-slate-800 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Content Type Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  نوع المحتوى
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full h-10 px-3 bg-slate-700 border border-slate-600 rounded-md text-white"
                >
                  <option value="">جميع الأنواع</option>
                  {contentTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  الفئة
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full h-10 px-3 bg-slate-700 border border-slate-600 rounded-md text-white"
                >
                  <option value="">جميع الفئات</option>
                  {categories?.map((category: any) => (
                    <option key={category.id} value={category.id}>
                      {category.nameArabic || category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedType("");
                    setSelectedCategory("");
                    setSearchQuery("");
                  }}
                  className="h-10 px-4 bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                >
                  إلغاء الفلاتر
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Content Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
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