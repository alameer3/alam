import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  X, 
  Filter, 
  Calendar,
  Star,
  Clock,
  Play,
  Globe,
  Tag,
  SlidersHorizontal
} from "lucide-react";
import { Content, Category, Genre } from "@shared/schema";
import { AkStyleContentCard } from "@/components/content/ak-style-content-card";

interface AdvancedSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onContentClick: (content: Content) => void;
}

interface SearchFilters {
  query: string;
  type: string;
  category: string;
  genre: string;
  language: string;
  quality: string;
  yearFrom: string;
  yearTo: string;
  ratingMin: string;
  sortBy: string;
  sortOrder: string;
}

const CONTENT_TYPES = [
  { value: '', label: 'جميع الأنواع' },
  { value: 'movie', label: 'أفلام' },
  { value: 'series', label: 'مسلسلات' },
  { value: 'tv', label: 'تلفزيون' },
  { value: 'misc', label: 'منوعات' }
];

const LANGUAGES = [
  { value: '', label: 'جميع اللغات' },
  { value: 'Arabic', label: 'عربي' },
  { value: 'English', label: 'إنجليزي' },
  { value: 'Hindi', label: 'هندي' },
  { value: 'Turkish', label: 'تركي' },
  { value: 'Korean', label: 'كوري' },
  { value: 'French', label: 'فرنسي' },
  { value: 'Spanish', label: 'إسباني' }
];

const QUALITIES = [
  { value: '', label: 'جميع الجودات' },
  { value: 'HD', label: 'HD' },
  { value: 'FHD', label: 'FHD' },
  { value: '4K', label: '4K' },
  { value: 'CAM', label: 'CAM' },
  { value: 'TS', label: 'TS' }
];

const SORT_OPTIONS = [
  { value: 'title', label: 'الاسم' },
  { value: 'releaseDate', label: 'تاريخ الإصدار' },
  { value: 'rating', label: 'التقييم' },
  { value: 'views', label: 'المشاهدات' },
  { value: 'createdAt', label: 'تاريخ الإضافة' }
];

export default function AdvancedSearch({ isOpen, onClose, onContentClick }: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    type: '',
    category: '',
    genre: '',
    language: '',
    quality: '',
    yearFrom: '',
    yearTo: '',
    ratingMin: '',
    sortBy: 'title',
    sortOrder: 'asc'
  });

  const [showFilters, setShowFilters] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // Load search history from localStorage
  useEffect(() => {
    const history = localStorage.getItem('searchHistory');
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);

  // Save search to history
  const saveSearchToHistory = (query: string) => {
    if (query.trim() && !searchHistory.includes(query)) {
      const newHistory = [query, ...searchHistory].slice(0, 10);
      setSearchHistory(newHistory);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    }
  };

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['/api/search', filters],
    queryFn: async () => {
      if (!filters.query.trim()) return { content: [], total: 0 };
      
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      const response = await fetch(`/api/search?${params}`);
      if (!response.ok) throw new Error('فشل في البحث');
      return response.json();
    },
    enabled: !!filters.query.trim(),
  });

  const { data: categories } = useQuery({
    queryKey: ['/api/categories'],
    queryFn: async () => {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('فشل في تحميل الفئات');
      return response.json();
    },
  });

  const { data: genres } = useQuery({
    queryKey: ['/api/genres'],
    queryFn: async () => {
      const response = await fetch('/api/genres');
      if (!response.ok) throw new Error('فشل في تحميل الأنواع');
      return response.json();
    },
  });

  const handleSearch = (query: string) => {
    setFilters(prev => ({ ...prev, query }));
    if (query.trim()) {
      saveSearchToHistory(query);
    }
  };

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      query: filters.query, // Keep search query
      type: '',
      category: '',
      genre: '',
      language: '',
      quality: '',
      yearFrom: '',
      yearTo: '',
      ratingMin: '',
      sortBy: 'title',
      sortOrder: 'asc'
    });
  };

  const handleContentClick = (content: Content) => {
    onContentClick(content);
    onClose();
  };

  const currentYear = new Date().getFullYear();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            البحث المتقدم
          </DialogTitle>
          <DialogDescription>
            ابحث في جميع المحتوى باستخدام فلاتر متقدمة وخيارات متنوعة للعثور على الأفلام والمسلسلات المطلوبة
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col h-full">
          {/* Search Bar */}
          <div className="flex gap-2 mb-4">
            <div className="flex-1 relative">
              <Input
                placeholder="ابحث عن الأفلام والمسلسلات..."
                value={filters.query}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              فلاتر
            </Button>
          </div>

          {/* Search History */}
          {!filters.query && searchHistory.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-600 mb-2">عمليات البحث الأخيرة:</h3>
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((term, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    onClick={() => handleSearch(term)}
                  >
                    {term}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Filters Panel */}
          {showFilters && (
            <Card className="mb-4">
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Content Type */}
                  <div>
                    <label className="block text-sm font-medium mb-1">نوع المحتوى</label>
                    <select
                      value={filters.type}
                      onChange={(e) => handleFilterChange('type', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 bg-background"
                    >
                      {CONTENT_TYPES.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium mb-1">الفئة</label>
                    <select
                      value={filters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 bg-background"
                    >
                      <option value="">جميع الفئات</option>
                      {categories?.map((category: Category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Genre */}
                  <div>
                    <label className="block text-sm font-medium mb-1">النوع</label>
                    <select
                      value={filters.genre}
                      onChange={(e) => handleFilterChange('genre', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 bg-background"
                    >
                      <option value="">جميع الأنواع</option>
                      {genres?.map((genre: Genre) => (
                        <option key={genre.id} value={genre.id}>
                          {genre.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Language */}
                  <div>
                    <label className="block text-sm font-medium mb-1">اللغة</label>
                    <select
                      value={filters.language}
                      onChange={(e) => handleFilterChange('language', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 bg-background"
                    >
                      {LANGUAGES.map(lang => (
                        <option key={lang.value} value={lang.value}>
                          {lang.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Quality */}
                  <div>
                    <label className="block text-sm font-medium mb-1">الجودة</label>
                    <select
                      value={filters.quality}
                      onChange={(e) => handleFilterChange('quality', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 bg-background"
                    >
                      {QUALITIES.map(quality => (
                        <option key={quality.value} value={quality.value}>
                          {quality.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Year Range */}
                  <div>
                    <label className="block text-sm font-medium mb-1">سنة الإصدار</label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="من"
                        value={filters.yearFrom}
                        onChange={(e) => handleFilterChange('yearFrom', e.target.value)}
                        min="1900"
                        max={currentYear}
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        placeholder="إلى"
                        value={filters.yearTo}
                        onChange={(e) => handleFilterChange('yearTo', e.target.value)}
                        min="1900"
                        max={currentYear}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-medium mb-1">التقييم الأدنى</label>
                    <select
                      value={filters.ratingMin}
                      onChange={(e) => handleFilterChange('ratingMin', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 bg-background"
                    >
                      <option value="">جميع التقييمات</option>
                      <option value="1">1+ نجوم</option>
                      <option value="2">2+ نجوم</option>
                      <option value="3">3+ نجوم</option>
                      <option value="4">4+ نجوم</option>
                      <option value="5">5 نجوم</option>
                    </select>
                  </div>

                  {/* Sort By */}
                  <div>
                    <label className="block text-sm font-medium mb-1">ترتيب حسب</label>
                    <div className="flex gap-2">
                      <select
                        value={filters.sortBy}
                        onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 bg-background"
                      >
                        {SORT_OPTIONS.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <select
                        value={filters.sortOrder}
                        onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2 bg-background"
                      >
                        <option value="asc">تصاعدي</option>
                        <option value="desc">تنازلي</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={clearFilters}>
                    مسح الفلاتر
                  </Button>
                  <Button onClick={() => setShowFilters(false)}>
                    تطبيق
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Search Results */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-gray-500">جاري البحث...</div>
              </div>
            ) : searchResults?.content?.length > 0 ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    نتائج البحث ({searchResults.total})
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {searchResults.content.map((content: Content) => (
                    <AkStyleContentCard
                      key={content.id}
                      content={content}
                      onClick={() => handleContentClick(content)}
                      showType={true}
                      variant="grid"
                    />
                  ))}
                </div>
              </div>
            ) : filters.query.trim() ? (
              <div className="text-center py-8">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">لا توجد نتائج للبحث "{filters.query}"</p>
                <p className="text-sm text-gray-400 mt-2">
                  جرب استخدام كلمات مختلفة أو تعديل الفلاتر
                </p>
              </div>
            ) : (
              <div className="text-center py-8">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">ابدأ بكتابة اسم الفيلم أو المسلسل</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}