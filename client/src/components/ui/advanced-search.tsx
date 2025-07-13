import React, { useState, useEffect } from 'react';
import { Search, Filter, X, Clock, Star, Calendar, Languages, Monitor } from 'lucide-react';
import { Button } from './button';
import { Input } from './input';
import { Badge } from './badge';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Slider } from './slider';
import { Checkbox } from './checkbox';
import { Label } from './label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from './dialog';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';

interface SearchFilters {
  query: string;
  type: string;
  category: string;
  genre: string;
  year: [number, number];
  rating: [number, number];
  language: string;
  quality: string;
  duration: [number, number];
  sortBy: 'newest' | 'oldest' | 'rating' | 'views' | 'title';
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  className?: string;
}

const currentYear = new Date().getFullYear();

const defaultFilters: SearchFilters = {
  query: '',
  type: 'all',
  category: 'all',
  genre: 'all',
  year: [1950, currentYear],
  rating: [0, 10],
  language: 'all',
  quality: 'all',
  duration: [0, 300],
  sortBy: 'newest'
};

export function AdvancedSearch({ onSearch, className }: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
  const [showFilters, setShowFilters] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const { data: categories } = useQuery({
    queryKey: ['/api/categories']
  });

  const { data: genres } = useQuery({
    queryKey: ['/api/genres']
  });

  useEffect(() => {
    const saved = localStorage.getItem('searchHistory');
    if (saved) {
      setSearchHistory(JSON.parse(saved));
    }
  }, []);

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    if (filters.query.trim()) {
      const newHistory = [filters.query, ...searchHistory.filter(h => h !== filters.query)].slice(0, 10);
      setSearchHistory(newHistory);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    }
    
    onSearch(filters);
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
    onSearch(defaultFilters);
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.type !== 'all') count++;
    if (filters.category !== 'all') count++;
    if (filters.genre !== 'all') count++;
    if (filters.year[0] !== 1950 || filters.year[1] !== currentYear) count++;
    if (filters.rating[0] !== 0 || filters.rating[1] !== 10) count++;
    if (filters.language !== 'all') count++;
    if (filters.quality !== 'all') count++;
    if (filters.duration[0] !== 0 || filters.duration[1] !== 300) count++;
    return count;
  };

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          البحث المتقدم
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="ابحث عن أفلام، مسلسلات، برامج..."
            value={filters.query}
            onChange={(e) => updateFilter('query', e.target.value)}
            className="pl-10"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>

        {/* Search History */}
        {searchHistory.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">البحث السابق</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearchHistory}
                className="text-xs"
              >
                مسح الكل
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {searchHistory.slice(0, 5).map((term, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="cursor-pointer hover:bg-secondary/80"
                  onClick={() => {
                    updateFilter('query', term);
                    handleSearch();
                  }}
                >
                  <Clock className="h-3 w-3 mr-1" />
                  {term}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Quick Filters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Select value={filters.type} onValueChange={(value) => updateFilter('type', value)}>
            <SelectTrigger>
              <SelectValue placeholder="نوع المحتوى" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الأنواع</SelectItem>
              <SelectItem value="movie">أفلام</SelectItem>
              <SelectItem value="series">مسلسلات</SelectItem>
              <SelectItem value="tv">برامج تلفزيونية</SelectItem>
              <SelectItem value="misc">متنوع</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)}>
            <SelectTrigger>
              <SelectValue placeholder="الفئة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الفئات</SelectItem>
              {categories?.map((category: any) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.nameArabic}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.genre} onValueChange={(value) => updateFilter('genre', value)}>
            <SelectTrigger>
              <SelectValue placeholder="النوع" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الأنواع</SelectItem>
              {genres?.map((genre: any) => (
                <SelectItem key={genre.id} value={genre.id.toString()}>
                  {genre.nameArabic}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
            <SelectTrigger>
              <SelectValue placeholder="ترتيب حسب" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">الأحدث</SelectItem>
              <SelectItem value="oldest">الأقدم</SelectItem>
              <SelectItem value="rating">التقييم</SelectItem>
              <SelectItem value="views">المشاهدات</SelectItem>
              <SelectItem value="title">الاسم</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Advanced Filters Toggle */}
        <div className="flex items-center justify-between">
          <Dialog open={showFilters} onOpenChange={setShowFilters}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                فلاتر متقدمة
                {getActiveFiltersCount() > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {getActiveFiltersCount()}
                  </Badge>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>فلاتر البحث المتقدمة</DialogTitle>
                <DialogDescription>
                  استخدم هذه الفلاتر لتخصيص نتائج البحث وفقاً لتفضيلاتك
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                {/* Year Range */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    سنة الإنتاج ({filters.year[0]} - {filters.year[1]})
                  </Label>
                  <Slider
                    value={filters.year}
                    onValueChange={(value) => updateFilter('year', value)}
                    min={1950}
                    max={currentYear}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Rating Range */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    التقييم ({filters.rating[0]} - {filters.rating[1]})
                  </Label>
                  <Slider
                    value={filters.rating}
                    onValueChange={(value) => updateFilter('rating', value)}
                    min={0}
                    max={10}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                {/* Duration Range */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    المدة ({filters.duration[0]} - {filters.duration[1]} دقيقة)
                  </Label>
                  <Slider
                    value={filters.duration}
                    onValueChange={(value) => updateFilter('duration', value)}
                    min={0}
                    max={300}
                    step={5}
                    className="w-full"
                  />
                </div>

                {/* Language and Quality */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Languages className="h-4 w-4" />
                      اللغة
                    </Label>
                    <Select value={filters.language} onValueChange={(value) => updateFilter('language', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">كل اللغات</SelectItem>
                        <SelectItem value="Arabic">عربي</SelectItem>
                        <SelectItem value="English">إنجليزي</SelectItem>
                        <SelectItem value="Hindi">هندي</SelectItem>
                        <SelectItem value="Turkish">تركي</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Monitor className="h-4 w-4" />
                      الجودة
                    </Label>
                    <Select value={filters.quality} onValueChange={(value) => updateFilter('quality', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">كل الجودات</SelectItem>
                        <SelectItem value="HD">HD</SelectItem>
                        <SelectItem value="Full HD">Full HD</SelectItem>
                        <SelectItem value="4K">4K</SelectItem>
                        <SelectItem value="8K">8K</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <div className="flex gap-2">
            <Button variant="outline" onClick={clearFilters}>
              مسح الفلاتر
            </Button>
            <Button onClick={handleSearch}>
              بحث
            </Button>
          </div>
        </div>

        {/* Active Filters */}
        {getActiveFiltersCount() > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">الفلاتر النشطة</Label>
            <div className="flex flex-wrap gap-2">
              {filters.type !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  نوع: {filters.type}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => updateFilter('type', 'all')}
                  />
                </Badge>
              )}
              {filters.category !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  فئة: {categories?.find((c: any) => c.id.toString() === filters.category)?.nameArabic}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => updateFilter('category', 'all')}
                  />
                </Badge>
              )}
              {filters.genre !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  نوع: {genres?.find((g: any) => g.id.toString() === filters.genre)?.nameArabic}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => updateFilter('genre', 'all')}
                  />
                </Badge>
              )}
              {(filters.year[0] !== 1950 || filters.year[1] !== currentYear) && (
                <Badge variant="secondary" className="gap-1">
                  سنة: {filters.year[0]} - {filters.year[1]}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => updateFilter('year', [1950, currentYear])}
                  />
                </Badge>
              )}
              {(filters.rating[0] !== 0 || filters.rating[1] !== 10) && (
                <Badge variant="secondary" className="gap-1">
                  تقييم: {filters.rating[0]} - {filters.rating[1]}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => updateFilter('rating', [0, 10])}
                  />
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default AdvancedSearch;