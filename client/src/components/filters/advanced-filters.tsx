import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Filter, RotateCcw } from "lucide-react";

interface AdvancedFiltersProps {
  onFilterChange: (filters: any) => void;
  contentType?: string;
}

export function AdvancedFilters({ onFilterChange, contentType }: AdvancedFiltersProps) {
  const [filters, setFilters] = useState({
    category: '',
    genre: '',
    rating: '',
    year: '',
    language: '',
    quality: '',
    resolution: '',
    country: ''
  });

  const { data: categories } = useQuery({
    queryKey: ['/api/categories'],
  });

  const { data: genres } = useQuery({
    queryKey: ['/api/genres'],
  });

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      genre: '',
      rating: '',
      year: '',
      language: '',
      quality: '',
      resolution: '',
      country: ''
    });
    onFilterChange({});
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const categories_list = [
    { id: 1, name: "عربي", nameArabic: "عربي" },
    { id: 2, name: "أجنبي", nameArabic: "أجنبي" },
    { id: 3, name: "هندي", nameArabic: "هندي" },
    { id: 4, name: "تركي", nameArabic: "تركي" },
    { id: 5, name: "آسيوي", nameArabic: "آسيوي" },
    { id: 6, name: "يمني", nameArabic: "يمني" },
    { id: 7, name: "مصري", nameArabic: "مصري" },
    { id: 8, name: "خليجي", nameArabic: "خليجي" },
    { id: 9, name: "وثائقي", nameArabic: "وثائقي" },
    { id: 10, name: "رسوم متحركة", nameArabic: "رسوم متحركة" }
  ];

  const genres_list = [
    { id: 1, name: "أكشن", nameArabic: "أكشن" },
    { id: 2, name: "كوميدي", nameArabic: "كوميدي" },
    { id: 3, name: "دراما", nameArabic: "دراما" },
    { id: 4, name: "رومانسي", nameArabic: "رومانسي" },
    { id: 5, name: "إثارة", nameArabic: "إثارة" },
    { id: 6, name: "رعب", nameArabic: "رعب" },
    { id: 7, name: "جريمة", nameArabic: "جريمة" },
    { id: 8, name: "عائلي", nameArabic: "عائلي" },
    { id: 9, name: "تاريخي", nameArabic: "تاريخي" },
    { id: 10, name: "سيرة ذاتية", nameArabic: "سيرة ذاتية" },
    { id: 11, name: "مغامرة", nameArabic: "مغامرة" },
    { id: 12, name: "خيال", nameArabic: "خيال" },
    { id: 13, name: "خيال علمي", nameArabic: "خيال علمي" },
    { id: 14, name: "حروب", nameArabic: "حروب" },
    { id: 15, name: "موسيقي", nameArabic: "موسيقي" }
  ];

  const years = Array.from({ length: 76 }, (_, i) => 2025 - i);
  
  const languages = [
    "العربية", "الإنجليزية", "الهندية", "الإسبانية", "الصينية", "البرتغالية", 
    "الفرنسية", "الروسية", "اليابانية", "الألمانية", "الكورية", "الإيطالية", 
    "التركية", "الفارسية"
  ];
  
  const qualities = [
    "BluRay", "WebRip", "BRRIP", "DVDrip", "DVDSCR", "HD", "HDTS", 
    "HDTV", "CAM", "WEB-DL", "HDTC", "BDRIP", "HDRIP", "HC HDRIP"
  ];
  
  const resolutions = ["240p", "360p", "480p", "720p", "1080p", "3D", "4K"];

  return (
    <Card className="bg-slate-800/50 border-slate-700 mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Filter className="h-5 w-5" />
            الفلاتر المتقدمة
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="bg-orange-500 text-white">
                {activeFilterCount}
              </Badge>
            )}
          </CardTitle>
          {activeFilterCount > 0 && (
            <Button 
              onClick={clearFilters} 
              variant="outline" 
              size="sm"
              className="text-white border-slate-600 hover:bg-slate-700"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              مسح الفلاتر
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* القسم */}
          <div className="space-y-2">
            <Label className="text-white text-sm font-medium">القسم</Label>
            <Select onValueChange={(value) => handleFilterChange('category', value)} value={filters.category}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="اختر القسم" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="">جميع الأقسام</SelectItem>
                {categories_list.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.nameArabic}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* التصنيف */}
          <div className="space-y-2">
            <Label className="text-white text-sm font-medium">التصنيف</Label>
            <Select onValueChange={(value) => handleFilterChange('genre', value)} value={filters.genre}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="اختر التصنيف" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="">جميع التصنيفات</SelectItem>
                {genres_list.map((genre) => (
                  <SelectItem key={genre.id} value={genre.id.toString()}>
                    {genre.nameArabic}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* التقييم */}
          <div className="space-y-2">
            <Label className="text-white text-sm font-medium">التقييم</Label>
            <Select onValueChange={(value) => handleFilterChange('rating', value)} value={filters.rating}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="اختر التقييم" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="">جميع التقييمات</SelectItem>
                {[1,2,3,4,5,6,7,8,9].map((rating) => (
                  <SelectItem key={rating} value={`${rating}`}>
                    +{rating}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* سنة الإنتاج */}
          <div className="space-y-2">
            <Label className="text-white text-sm font-medium">سنة الإنتاج</Label>
            <Select onValueChange={(value) => handleFilterChange('year', value)} value={filters.year}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="اختر السنة" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="">جميع السنوات</SelectItem>
                <ScrollArea className="h-32">
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>
          </div>

          {/* اللغة */}
          <div className="space-y-2">
            <Label className="text-white text-sm font-medium">اللغة</Label>
            <Select onValueChange={(value) => handleFilterChange('language', value)} value={filters.language}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="اختر اللغة" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="">جميع اللغات</SelectItem>
                {languages.map((language) => (
                  <SelectItem key={language} value={language}>
                    {language}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* الجودة */}
          <div className="space-y-2">
            <Label className="text-white text-sm font-medium">الجودة</Label>
            <Select onValueChange={(value) => handleFilterChange('quality', value)} value={filters.quality}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="اختر الجودة" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="">جميع الجودات</SelectItem>
                {qualities.map((quality) => (
                  <SelectItem key={quality} value={quality}>
                    {quality}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* الدقة */}
          <div className="space-y-2">
            <Label className="text-white text-sm font-medium">الدقة</Label>
            <Select onValueChange={(value) => handleFilterChange('resolution', value)} value={filters.resolution}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="اختر الدقة" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="">جميع الدقات</SelectItem>
                {resolutions.map((resolution) => (
                  <SelectItem key={resolution} value={resolution}>
                    {resolution}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* البلد */}
          <div className="space-y-2">
            <Label className="text-white text-sm font-medium">البلد</Label>
            <Input
              placeholder="اكتب اسم البلد..."
              value={filters.country}
              onChange={(e) => handleFilterChange('country', e.target.value)}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
            />
          </div>
        </div>
        
        {/* عرض الفلاتر النشطة */}
        {activeFilterCount > 0 && (
          <>
            <Separator className="bg-slate-600" />
            <div className="space-y-2">
              <Label className="text-white text-sm font-medium">الفلاتر النشطة:</Label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(filters).map(([key, value]) => {
                  if (!value) return null;
                  
                  let displayValue = value;
                  let displayKey = key;
                  
                  // ترجمة المفاتيح للعربية
                  const keyTranslations: { [key: string]: string } = {
                    category: "القسم",
                    genre: "التصنيف", 
                    rating: "التقييم",
                    year: "السنة",
                    language: "اللغة",
                    quality: "الجودة",
                    resolution: "الدقة",
                    country: "البلد"
                  };
                  
                  displayKey = keyTranslations[key] || key;
                  
                  // ترجمة القيم للتصنيفات والأقسام
                  if (key === 'category') {
                    const category = categories_list.find(c => c.id.toString() === value);
                    displayValue = category?.nameArabic || value;
                  } else if (key === 'genre') {
                    const genre = genres_list.find(g => g.id.toString() === value);
                    displayValue = genre?.nameArabic || value;
                  } else if (key === 'rating') {
                    displayValue = `+${value}`;
                  }
                  
                  return (
                    <Badge 
                      key={key} 
                      variant="secondary" 
                      className="bg-orange-500 text-white hover:bg-orange-600 cursor-pointer"
                      onClick={() => handleFilterChange(key, '')}
                    >
                      {displayKey}: {displayValue}
                      <X className="h-3 w-3 ml-1" />
                    </Badge>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}