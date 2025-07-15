import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X, Filter, RotateCcw } from 'lucide-react';

interface EnhancedFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  initialFilters?: FilterState;
}

export interface FilterState {
  category?: string;
  genre?: string;
  rating?: [number, number];
  year?: number;
  language?: string;
  quality?: string;
  resolution?: string;
  duration?: [number, number];
  country?: string;
}

const categories = [
  { id: 'arabic', name: 'عربي' },
  { id: 'foreign', name: 'أجنبي' },
  { id: 'hindi', name: 'هندي' },
  { id: 'turkish', name: 'تركي' },
  { id: 'korean', name: 'كوري' },
  { id: 'asian', name: 'آسيوي' },
  { id: 'egyptian', name: 'مصري' },
  { id: 'gulf', name: 'خليجي' },
  { id: 'documentary', name: 'وثائقي' },
  { id: 'animated', name: 'أنيمي' }
];

const genres = [
  { id: 'action', name: 'أكشن' },
  { id: 'comedy', name: 'كوميديا' },
  { id: 'drama', name: 'دراما' },
  { id: 'thriller', name: 'إثارة' },
  { id: 'horror', name: 'رعب' },
  { id: 'romance', name: 'رومانسي' },
  { id: 'crime', name: 'جريمة' },
  { id: 'family', name: 'عائلي' },
  { id: 'war', name: 'حربي' },
  { id: 'historical', name: 'تاريخي' },
  { id: 'biography', name: 'سيرة ذاتية' },
  { id: 'music', name: 'موسيقى' },
  { id: 'mystery', name: 'غموض' },
  { id: 'adventure', name: 'مغامرة' },
  { id: 'sci-fi', name: 'خيال علمي' },
  { id: 'fantasy', name: 'فانتازيا' },
  { id: 'western', name: 'غربي' },
  { id: 'sport', name: 'رياضي' },
  { id: 'short', name: 'قصير' },
  { id: 'netflix', name: 'NETFLIX' },
  { id: 'dubbed', name: 'مدبلج' },
  { id: 'ramadan', name: 'رمضان' }
];

const languages = [
  { id: 'arabic', name: 'العربية' },
  { id: 'english', name: 'الإنجليزية' },
  { id: 'hindi', name: 'الهندية' },
  { id: 'spanish', name: 'الإسبانية' },
  { id: 'chinese', name: 'الصينية' },
  { id: 'portuguese', name: 'البرتغالية' },
  { id: 'french', name: 'الفرنسية' },
  { id: 'russian', name: 'الروسية' },
  { id: 'japanese', name: 'اليابانية' },
  { id: 'german', name: 'الألمانية' },
  { id: 'korean', name: 'الكورية' },
  { id: 'turkish', name: 'التركية' },
  { id: 'italian', name: 'الإيطالية' },
  { id: 'urdu', name: 'الأردية' }
];

const qualities = [
  { id: 'bluray', name: 'BluRay' },
  { id: 'webrip', name: 'WebRip' },
  { id: 'brrip', name: 'BRRIP' },
  { id: 'dvdrip', name: 'DVDrip' },
  { id: 'dvdscr', name: 'DVDSCR' },
  { id: 'hd', name: 'HD' },
  { id: 'hdts', name: 'HDTS' },
  { id: 'hdtv', name: 'HDTV' },
  { id: 'cam', name: 'CAM' },
  { id: 'webdl', name: 'WEB-DL' },
  { id: 'hdtc', name: 'HDTC' },
  { id: 'bdrip', name: 'BDRIP' },
  { id: 'hdrip', name: 'HDRIP' },
  { id: 'hc_hdrip', name: 'HC HDRIP' }
];

const resolutions = [
  { id: '240p', name: '240p' },
  { id: '360p', name: '360p' },
  { id: '480p', name: '480p' },
  { id: '720p', name: '720p' },
  { id: '1080p', name: '1080p' },
  { id: '3d', name: '3D' },
  { id: '4k', name: '4K' }
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1920 + 1 }, (_, i) => currentYear - i);

export default function EnhancedFilters({ onFilterChange, initialFilters = {} }: EnhancedFiltersProps) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateFilter = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const removeFilter = (key: keyof FilterState) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const resetFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  const activeFiltersCount = Object.keys(filters).filter(key => 
    filters[key as keyof FilterState] !== undefined && 
    filters[key as keyof FilterState] !== ''
  ).length;

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            فلاتر البحث المتقدم
          </h3>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="text-sm">
              {activeFiltersCount} فلاتر نشطة
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm"
          >
            {showAdvanced ? 'إخفاء المتقدم' : 'إظهار المتقدم'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={resetFilters}
            className="text-sm"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            إعادة تعيين
          </Button>
        </div>
      </div>

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(filters).map(([key, value]) => {
            if (!value) return null;
            return (
              <Badge
                key={key}
                variant="outline"
                className="flex items-center gap-1 px-3 py-1"
              >
                {key === 'category' && categories.find(c => c.id === value)?.name}
                {key === 'genre' && genres.find(g => g.id === value)?.name}
                {key === 'language' && languages.find(l => l.id === value)?.name}
                {key === 'quality' && qualities.find(q => q.id === value)?.name}
                {key === 'resolution' && resolutions.find(r => r.id === value)?.name}
                {key === 'year' && `سنة ${value}`}
                {key === 'rating' && Array.isArray(value) && `تقييم ${value[0]}-${value[1]}`}
                <X
                  className="w-3 h-3 cursor-pointer hover:text-red-500"
                  onClick={() => removeFilter(key as keyof FilterState)}
                />
              </Badge>
            );
          })}
        </div>
      )}

      {/* Basic Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">القسم</Label>
          <Select value={filters.category || ''} onValueChange={(value) => updateFilter('category', value)}>
            <SelectTrigger>
              <SelectValue placeholder="اختر القسم" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">جميع الأقسام</SelectItem>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="genre">التصنيف</Label>
          <Select value={filters.genre || ''} onValueChange={(value) => updateFilter('genre', value)}>
            <SelectTrigger>
              <SelectValue placeholder="اختر التصنيف" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">جميع التصنيفات</SelectItem>
              {genres.map(genre => (
                <SelectItem key={genre.id} value={genre.id}>
                  {genre.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="year">سنة الإنتاج</Label>
          <Select value={filters.year?.toString() || ''} onValueChange={(value) => updateFilter('year', value ? parseInt(value) : undefined)}>
            <SelectTrigger>
              <SelectValue placeholder="اختر السنة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">جميع السنوات</SelectItem>
              {years.map(year => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="language">اللغة</Label>
          <Select value={filters.language || ''} onValueChange={(value) => updateFilter('language', value)}>
            <SelectTrigger>
              <SelectValue placeholder="اختر اللغة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">جميع اللغات</SelectItem>
              {languages.map(language => (
                <SelectItem key={language.id} value={language.id}>
                  {language.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="space-y-6 border-t border-gray-200 dark:border-gray-700 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quality">الجودة</Label>
              <Select value={filters.quality || ''} onValueChange={(value) => updateFilter('quality', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الجودة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">جميع الجودات</SelectItem>
                  {qualities.map(quality => (
                    <SelectItem key={quality.id} value={quality.id}>
                      {quality.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="resolution">الدقة</Label>
              <Select value={filters.resolution || ''} onValueChange={(value) => updateFilter('resolution', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الدقة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">جميع الدقات</SelectItem>
                  {resolutions.map(resolution => (
                    <SelectItem key={resolution.id} value={resolution.id}>
                      {resolution.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>التقييم</Label>
              <div className="px-3">
                <Slider
                  value={filters.rating || [1, 10]}
                  onValueChange={(value) => updateFilter('rating', value)}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>{filters.rating?.[0] || 1}</span>
                  <span>{filters.rating?.[1] || 10}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}