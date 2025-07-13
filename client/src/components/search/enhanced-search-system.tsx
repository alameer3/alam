import React, { useState, useRef, useEffect } from 'react';
import { Search, Filter, X, Clock, Star, Calendar, Languages, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface SearchFilters {
  query: string;
  type: string;
  category: string;
  genre: string;
  year: [number, number];
  rating: [number];
  language: string;
  quality: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'recent' | 'suggestion' | 'content';
  icon?: React.ReactNode;
}

interface EnhancedSearchSystemProps {
  onSearch: (filters: SearchFilters) => void;
  isSearching?: boolean;
  suggestions?: SearchSuggestion[];
  className?: string;
}

const DEFAULT_FILTERS: SearchFilters = {
  query: '',
  type: 'all',
  category: 'all',
  genre: 'all',
  year: [1990, 2024],
  rating: [0],
  language: 'all',
  quality: 'all',
  sortBy: 'date',
  sortOrder: 'desc'
};

export function EnhancedSearchSystem({
  onSearch,
  isSearching = false,
  suggestions = [],
  className
}: EnhancedSearchSystemProps) {
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);
  const [showFilters, setShowFilters] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Load search history from localStorage
  useEffect(() => {
    const history = localStorage.getItem('cinema_search_history');
    if (history) {
      try {
        setSearchHistory(JSON.parse(history));
      } catch (error) {
        console.warn('خطأ في تحميل تاريخ البحث:', error);
      }
    }
  }, []);

  const saveToSearchHistory = (query: string) => {
    if (query.trim() && !searchHistory.includes(query.trim())) {
      const newHistory = [query.trim(), ...searchHistory].slice(0, 10); // Keep last 10 searches
      setSearchHistory(newHistory);
      localStorage.setItem('cinema_search_history', JSON.stringify(newHistory));
    }
  };

  const handleSearch = () => {
    if (filters.query.trim()) {
      saveToSearchHistory(filters.query);
    }
    onSearch(filters);
    setShowSuggestions(false);
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Auto-search when filters change (except query)
    if (key !== 'query') {
      onSearch(newFilters);
    }
  };

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    onSearch(DEFAULT_FILTERS);
    searchInputRef.current?.focus();
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('cinema_search_history');
  };

  const selectSuggestion = (suggestion: SearchSuggestion) => {
    const newFilters = { ...filters, query: suggestion.text };
    setFilters(newFilters);
    onSearch(newFilters);
    setShowSuggestions(false);
    saveToSearchHistory(suggestion.text);
  };

  const hasActiveFilters = Object.keys(filters).some(key => {
    if (key === 'query') return false;
    const value = filters[key as keyof SearchFilters];
    const defaultValue = DEFAULT_FILTERS[key as keyof SearchFilters];
    return JSON.stringify(value) !== JSON.stringify(defaultValue);
  });

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search Bar */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            ref={searchInputRef}
            placeholder="ابحث عن الأفلام والمسلسلات..."
            value={filters.query}
            onChange={(e) => handleFilterChange('query', e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
            onFocus={() => setShowSuggestions(true)}
            className="pl-12 pr-12 py-3 text-lg border-2 focus:border-primary"
          />
          {filters.query && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleFilterChange('query', '')}
              className="absolute left-2 top-1/2 transform -translate-y-1/2"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Search Suggestions */}
        {showSuggestions && (
          <Card className="absolute top-full left-0 right-0 z-50 mt-2 max-h-96 overflow-y-auto">
            <CardContent className="p-0">
              {/* Recent Searches */}
              {searchHistory.length > 0 && (
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      عمليات البحث الأخيرة
                    </h4>
                    <Button variant="ghost" size="sm" onClick={clearSearchHistory}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {searchHistory.slice(0, 5).map((query, index) => (
                      <button
                        key={index}
                        onClick={() => selectSuggestion({ id: `history-${index}`, text: query, type: 'recent' })}
                        className="block w-full text-right p-2 rounded hover:bg-muted transition-colors"
                      >
                        {query}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestions */}
              {suggestions.length > 0 && (
                <div className="p-4">
                  <h4 className="text-sm font-semibold mb-3">اقتراحات</h4>
                  <div className="space-y-2">
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion.id}
                        onClick={() => selectSuggestion(suggestion)}
                        className="flex items-center gap-3 w-full text-right p-2 rounded hover:bg-muted transition-colors"
                      >
                        {suggestion.icon}
                        <span>{suggestion.text}</span>
                        <Badge variant="outline" className="mr-auto">
                          {suggestion.type === 'content' ? 'محتوى' : 'اقتراح'}
                        </Badge>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Filter Toggle and Active Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <Button
          variant={showFilters ? "default" : "outline"}
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          فلاتر البحث
          {hasActiveFilters && <Badge variant="secondary" className="ml-2">نشط</Badge>}
        </Button>

        {hasActiveFilters && (
          <Button variant="ghost" onClick={clearFilters} className="text-sm">
            مسح الفلاتر
          </Button>
        )}

        <Button
          onClick={handleSearch}
          disabled={isSearching}
          className="mr-auto"
        >
          {isSearching ? 'جارٍ البحث...' : 'بحث'}
        </Button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle>فلاتر البحث المتقدمة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Content Type */}
              <div>
                <label className="text-sm font-medium block mb-2">نوع المحتوى</label>
                <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الأنواع</SelectItem>
                    <SelectItem value="movie">أفلام</SelectItem>
                    <SelectItem value="series">مسلسلات</SelectItem>
                    <SelectItem value="tv">تلفزيون</SelectItem>
                    <SelectItem value="misc">منوعات</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Language */}
              <div>
                <label className="text-sm font-medium block mb-2">اللغة</label>
                <Select value={filters.language} onValueChange={(value) => handleFilterChange('language', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع اللغات</SelectItem>
                    <SelectItem value="Arabic">عربي</SelectItem>
                    <SelectItem value="English">إنجليزي</SelectItem>
                    <SelectItem value="Hindi">هندي</SelectItem>
                    <SelectItem value="Turkish">تركي</SelectItem>
                    <SelectItem value="French">فرنسي</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Quality */}
              <div>
                <label className="text-sm font-medium block mb-2">الجودة</label>
                <Select value={filters.quality} onValueChange={(value) => handleFilterChange('quality', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الجودات</SelectItem>
                    <SelectItem value="HD">HD</SelectItem>
                    <SelectItem value="FHD">FHD</SelectItem>
                    <SelectItem value="4K">4K</SelectItem>
                    <SelectItem value="8K">8K</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Year Range */}
            <div>
              <label className="text-sm font-medium block mb-2">
                سنة الإنتاج: {filters.year[0]} - {filters.year[1]}
              </label>
              <Slider
                value={filters.year}
                onValueChange={(value) => handleFilterChange('year', value)}
                min={1950}
                max={2024}
                step={1}
                className="w-full"
              />
            </div>

            {/* Rating */}
            <div>
              <label className="text-sm font-medium block mb-2">
                التقييم الأدنى: {filters.rating[0]}/10
              </label>
              <Slider
                value={filters.rating}
                onValueChange={(value) => handleFilterChange('rating', value)}
                min={0}
                max={10}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Sort Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium block mb-2">ترتيب حسب</label>
                <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">تاريخ الإضافة</SelectItem>
                    <SelectItem value="rating">التقييم</SelectItem>
                    <SelectItem value="title">العنوان</SelectItem>
                    <SelectItem value="year">سنة الإنتاج</SelectItem>
                    <SelectItem value="views">عدد المشاهدات</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">اتجاه الترتيب</label>
                <Select value={filters.sortOrder} onValueChange={(value) => handleFilterChange('sortOrder', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">تنازلي</SelectItem>
                    <SelectItem value="asc">تصاعدي</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}