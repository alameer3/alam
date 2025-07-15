import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FilterIcon, X } from "lucide-react";

interface AdvancedFiltersProps {
  onFiltersChange: (filters: any) => void;
  initialFilters?: any;
}

export default function AdvancedFilters({ onFiltersChange, initialFilters = {} }: AdvancedFiltersProps) {
  const [filters, setFilters] = useState(initialFilters);
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { value: 'arabic', label: 'عربي' },
    { value: 'foreign', label: 'أجنبي' },
    { value: 'hindi', label: 'هندي' },
    { value: 'turkish', label: 'تركي' },
    { value: 'asian', label: 'آسيوي' },
    { value: 'korean', label: 'كوري' },
    { value: 'anime', label: 'أنمي' }
  ];

  const genres = [
    { value: 'action', label: 'أكشن' },
    { value: 'comedy', label: 'كوميديا' },
    { value: 'drama', label: 'دراما' },
    { value: 'thriller', label: 'إثارة' },
    { value: 'horror', label: 'رعب' },
    { value: 'romance', label: 'رومانسي' },
    { value: 'family', label: 'عائلي' },
    { value: 'documentary', label: 'وثائقي' },
    { value: 'mystery', label: 'غموض' },
    { value: 'crime', label: 'جريمة' },
    { value: 'adventure', label: 'مغامرة' },
    { value: 'fantasy', label: 'فانتازيا' },
    { value: 'sci-fi', label: 'خيال علمي' },
    { value: 'history', label: 'تاريخي' },
    { value: 'war', label: 'حربي' },
    { value: 'sport', label: 'رياضي' },
    { value: 'music', label: 'موسيقى' },
    { value: 'biography', label: 'سيرة ذاتية' },
    { value: 'western', label: 'غربي' }
  ];

  const ratings = [
    { value: '1+', label: '+1' },
    { value: '2+', label: '+2' },
    { value: '3+', label: '+3' },
    { value: '4+', label: '+4' },
    { value: '5+', label: '+5' },
    { value: '6+', label: '+6' },
    { value: '7+', label: '+7' },
    { value: '8+', label: '+8' },
    { value: '9+', label: '+9' }
  ];

  const years = Array.from({ length: 100 }, (_, i) => 2025 - i).map(year => ({
    value: year.toString(),
    label: year.toString()
  }));

  const languages = [
    { value: 'arabic', label: 'العربية' },
    { value: 'english', label: 'الإنجليزية' },
    { value: 'hindi', label: 'الهندية' },
    { value: 'spanish', label: 'الاسبانية' },
    { value: 'french', label: 'الفرنسية' },
    { value: 'german', label: 'الألمانية' },
    { value: 'italian', label: 'الإيطالية' },
    { value: 'turkish', label: 'التركية' },
    { value: 'korean', label: 'الكورية' },
    { value: 'japanese', label: 'اليابانية' },
    { value: 'chinese', label: 'الصينية' },
    { value: 'russian', label: 'الروسية' }
  ];

  const qualities = [
    { value: 'BluRay', label: 'BluRay' },
    { value: 'WebRip', label: 'WebRip' },
    { value: 'BRRIP', label: 'BRRIP' },
    { value: 'DVDrip', label: 'DVDrip' },
    { value: 'DVDSCR', label: 'DVDSCR' },
    { value: 'HD', label: 'HD' },
    { value: 'HDTS', label: 'HDTS' },
    { value: 'HDTV', label: 'HDTV' },
    { value: 'CAM', label: 'CAM' },
    { value: 'WEB-DL', label: 'WEB-DL' },
    { value: 'HDTC', label: 'HDTC' },
    { value: 'BDRIP', label: 'BDRIP' },
    { value: 'HDRIP', label: 'HDRIP' },
    { value: 'HC HDRIP', label: 'HC HDRIP' }
  ];

  const resolutions = [
    { value: '240p', label: '240p' },
    { value: '360p', label: '360p' },
    { value: '480p', label: '480p' },
    { value: '720p', label: '720p' },
    { value: '1080p', label: '1080p' },
    { value: '3D', label: '3D' },
    { value: '4K', label: '4K' }
  ];

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilter = (key: string) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    setFilters({});
    onFiltersChange({});
  };

  const activeFiltersCount = Object.keys(filters).length;

  return (
    <div className="w-full mb-6">
      <div className="flex items-center gap-4 mb-4">
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <FilterIcon className="w-4 h-4" />
          فلترة متقدمة
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="mr-2">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
        
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            onClick={clearAllFilters}
            className="text-red-500 hover:text-red-700"
          >
            مسح جميع الفلاتر
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.entries(filters).map(([key, value]) => (
            <Badge key={key} variant="secondary" className="flex items-center gap-1">
              {value as string}
              <X
                className="w-3 h-3 cursor-pointer hover:text-red-500"
                onClick={() => clearFilter(key)}
              />
            </Badge>
          ))}
        </div>
      )}

      {showFilters && (
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">القسم</label>
                <Select value={filters.category || ''} onValueChange={(value) => handleFilterChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر القسم" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Genre Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">التصنيف</label>
                <Select value={filters.genre || ''} onValueChange={(value) => handleFilterChange('genre', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر التصنيف" />
                  </SelectTrigger>
                  <SelectContent>
                    {genres.map((genre) => (
                      <SelectItem key={genre.value} value={genre.value}>
                        {genre.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">التقييم</label>
                <Select value={filters.rating || ''} onValueChange={(value) => handleFilterChange('rating', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر التقييم" />
                  </SelectTrigger>
                  <SelectContent>
                    {ratings.map((rating) => (
                      <SelectItem key={rating.value} value={rating.value}>
                        {rating.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Year Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">سنة الإنتاج</label>
                <Select value={filters.year || ''} onValueChange={(value) => handleFilterChange('year', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر السنة" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year.value} value={year.value}>
                        {year.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Language Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">اللغة</label>
                <Select value={filters.language || ''} onValueChange={(value) => handleFilterChange('language', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر اللغة" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Quality Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">الجودة</label>
                <Select value={filters.quality || ''} onValueChange={(value) => handleFilterChange('quality', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الجودة" />
                  </SelectTrigger>
                  <SelectContent>
                    {qualities.map((quality) => (
                      <SelectItem key={quality.value} value={quality.value}>
                        {quality.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Resolution Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">الدقة</label>
                <Select value={filters.resolution || ''} onValueChange={(value) => handleFilterChange('resolution', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الدقة" />
                  </SelectTrigger>
                  <SelectContent>
                    {resolutions.map((res) => (
                      <SelectItem key={res.value} value={res.value}>
                        {res.label}
                      </SelectItem>
                    ))}
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