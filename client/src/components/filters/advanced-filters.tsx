import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export interface FilterOptions {
  section?: string;
  category?: string;
  rating?: string;
  year?: string;
  language?: string;
  quality?: string;
  resolution?: string;
}

interface AdvancedFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  contentType: 'movies' | 'series' | 'tv' | 'misc';
}

// تصنيفات ak.sv المطابقة
const SECTIONS = [
  { value: 'arabic', label: 'عربي' },
  { value: 'foreign', label: 'أجنبي' },
  { value: 'hindi', label: 'هندي' },
  { value: 'turkish', label: 'تركي' },
  { value: 'asian', label: 'آسيوي' }
];

const CATEGORIES = [
  { value: 'ramadan', label: 'رمضان' },
  { value: 'anime', label: 'أنمي' },
  { value: 'action', label: 'أكشن' },
  { value: 'dubbed', label: 'مدبلج' },
  { value: 'netflix', label: 'NETFLIX' },
  { value: 'comedy', label: 'كوميديا' },
  { value: 'thriller', label: 'إثارة' },
  { value: 'mystery', label: 'غموض' },
  { value: 'family', label: 'عائلي' },
  { value: 'kids', label: 'أطفال' },
  { value: 'war', label: 'حربي' },
  { value: 'sports', label: 'رياضي' },
  { value: 'short', label: 'قصير' },
  { value: 'fantasy', label: 'فانتازيا' },
  { value: 'sci-fi', label: 'خيال علمي' },
  { value: 'music', label: 'موسيقى' },
  { value: 'biography', label: 'سيرة ذاتية' },
  { value: 'documentary', label: 'وثائقي' },
  { value: 'romance', label: 'رومانسي' },
  { value: 'historical', label: 'تاريخي' },
  { value: 'drama', label: 'دراما' },
  { value: 'horror', label: 'رعب' },
  { value: 'crime', label: 'جريمة' },
  { value: 'adventure', label: 'مغامرة' },
  { value: 'western', label: 'غربي' }
];

const RATINGS = [
  { value: '1', label: '+1' },
  { value: '2', label: '+2' },
  { value: '3', label: '+3' },
  { value: '4', label: '+4' },
  { value: '5', label: '+5' },
  { value: '6', label: '+6' },
  { value: '7', label: '+7' },
  { value: '8', label: '+8' },
  { value: '9', label: '+9' }
];

const LANGUAGES = [
  { value: 'ar', label: 'العربية' },
  { value: 'en', label: 'الإنجليزية' },
  { value: 'hi', label: 'الهندية' },
  { value: 'es', label: 'الاسبانية' },
  { value: 'zh', label: 'الصينية' },
  { value: 'pt', label: 'البرتغالية' },
  { value: 'fr', label: 'الفرنسية' },
  { value: 'ru', label: 'الروسية' },
  { value: 'ja', label: 'اليابانية' },
  { value: 'de', label: 'الألمانية' },
  { value: 'ko', label: 'الكورية' },
  { value: 'fa', label: 'الفارسية' },
  { value: 'vi', label: 'الفيتنامية' },
  { value: 'it', label: 'الإيطالية' },
  { value: 'tr', label: 'التركية' },
  { value: 'pl', label: 'البولندية' },
  { value: 'uk', label: 'الأوكرانية' },
  { value: 'fi', label: 'الفلندية' },
  { value: 'th', label: 'التايلاندية' },
  { value: 'da', label: 'الدنماركية' },
  { value: 'sv', label: 'السويدية' },
  { value: 'id', label: 'الإندونيسية' },
  { value: 'ms', label: 'الماليزية' },
  { value: 'no', label: 'النرويجية' },
  { value: 'nl', label: 'الهولندية' },
  { value: 'ur', label: 'الأردية' },
  { value: 'hu', label: 'المجرية' }
];

const QUALITIES = [
  { value: 'bluray', label: 'BluRay' },
  { value: 'webrip', label: 'WebRip' },
  { value: 'brrip', label: 'BRRIP' },
  { value: 'dvdrip', label: 'DVDrip' },
  { value: 'dvdscr', label: 'DVDSCR' },
  { value: 'hd', label: 'HD' },
  { value: 'hdts', label: 'HDTS' },
  { value: 'hdtv', label: 'HDTV' },
  { value: 'cam', label: 'CAM' },
  { value: 'web-dl', label: 'WEB-DL' },
  { value: 'hdtc', label: 'HDTC' },
  { value: 'bdrip', label: 'BDRIP' },
  { value: 'hdrip', label: 'HDRIP' },
  { value: 'hc-hdrip', label: 'HC HDRIP' }
];

const RESOLUTIONS = [
  { value: '240p', label: '240p' },
  { value: '360p', label: '360p' },
  { value: '480p', label: '480p' },
  { value: '720p', label: '720p' },
  { value: '1080p', label: '1080p' },
  { value: '3d', label: '3D' },
  { value: '4k', label: '4K' }
];

// سنوات الإنتاج (من 1925 إلى 2025)
const YEARS = Array.from({ length: 101 }, (_, i) => {
  const year = 2025 - i;
  return { value: year.toString(), label: year.toString() };
});

export function AdvancedFilters({ filters, onFiltersChange, contentType }: AdvancedFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = (key: keyof FilterOptions, value: string) => {
    const newFilters = { ...filters, [key]: value };
    onFiltersChange(newFilters);
  };

  const removeFilter = (key: keyof FilterOptions) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    onFiltersChange({});
  };

  const activeFiltersCount = Object.keys(filters).length;

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <div className="flex items-center justify-between mb-4">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 p-0">
                <Filter className="h-4 w-4" />
                <span className="font-semibold">فلاتر متقدمة</span>
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {activeFiltersCount}
                  </Badge>
                )}
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            
            {activeFiltersCount > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearAllFilters}
                className="text-xs"
              >
                مسح الكل
              </Button>
            )}
          </div>

          {/* عرض الفلاتر النشطة */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {Object.entries(filters).map(([key, value]) => {
                const filterKey = key as keyof FilterOptions;
                let label = value;
                
                // تحويل القيم إلى نصوص عربية
                if (filterKey === 'section') {
                  label = SECTIONS.find(s => s.value === value)?.label || value;
                } else if (filterKey === 'category') {
                  label = CATEGORIES.find(c => c.value === value)?.label || value;
                } else if (filterKey === 'language') {
                  label = LANGUAGES.find(l => l.value === value)?.label || value;
                } else if (filterKey === 'quality') {
                  label = QUALITIES.find(q => q.value === value)?.label || value;
                } else if (filterKey === 'rating') {
                  label = `تقييم ${value}+`;
                }

                return (
                  <Badge 
                    key={key} 
                    variant="secondary" 
                    className="flex items-center gap-1"
                  >
                    {label}
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-red-500" 
                      onClick={() => removeFilter(filterKey)}
                    />
                  </Badge>
                );
              })}
            </div>
          )}

          <CollapsibleContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {/* القسم */}
              <div className="space-y-2">
                <label className="text-sm font-medium">القسم</label>
                <Select value={filters.section || ''} onValueChange={(value) => updateFilter('section', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر القسم" />
                  </SelectTrigger>
                  <SelectContent>
                    {SECTIONS.map(section => (
                      <SelectItem key={section.value} value={section.value}>
                        {section.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* التصنيف */}
              <div className="space-y-2">
                <label className="text-sm font-medium">التصنيف</label>
                <Select value={filters.category || ''} onValueChange={(value) => updateFilter('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر التصنيف" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* التقييم */}
              <div className="space-y-2">
                <label className="text-sm font-medium">التقييم</label>
                <Select value={filters.rating || ''} onValueChange={(value) => updateFilter('rating', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر التقييم" />
                  </SelectTrigger>
                  <SelectContent>
                    {RATINGS.map(rating => (
                      <SelectItem key={rating.value} value={rating.value}>
                        {rating.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* سنة الإنتاج */}
              <div className="space-y-2">
                <label className="text-sm font-medium">سنة الإنتاج</label>
                <Select value={filters.year || ''} onValueChange={(value) => updateFilter('year', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر السنة" />
                  </SelectTrigger>
                  <SelectContent>
                    {YEARS.map(year => (
                      <SelectItem key={year.value} value={year.value}>
                        {year.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* اللغة */}
              <div className="space-y-2">
                <label className="text-sm font-medium">اللغة</label>
                <Select value={filters.language || ''} onValueChange={(value) => updateFilter('language', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر اللغة" />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map(language => (
                      <SelectItem key={language.value} value={language.value}>
                        {language.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* الجودة */}
              <div className="space-y-2">
                <label className="text-sm font-medium">الجودة</label>
                <Select value={filters.quality || ''} onValueChange={(value) => updateFilter('quality', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الجودة" />
                  </SelectTrigger>
                  <SelectContent>
                    {QUALITIES.map(quality => (
                      <SelectItem key={quality.value} value={quality.value}>
                        {quality.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* الدقة */}
              <div className="space-y-2">
                <label className="text-sm font-medium">الدقة</label>
                <Select value={filters.resolution || ''} onValueChange={(value) => updateFilter('resolution', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الدقة" />
                  </SelectTrigger>
                  <SelectContent>
                    {RESOLUTIONS.map(resolution => (
                      <SelectItem key={resolution.value} value={resolution.value}>
                        {resolution.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}