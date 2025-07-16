import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, X } from "lucide-react";

interface AdvancedFiltersProps {
  onFiltersChange: (filters: any) => void;
  contentType: string;
  categories?: any[];
  genres?: any[];
}

export default function AdvancedFilters({ 
  onFiltersChange, 
  contentType, 
  categories = [], 
  genres = [] 
}: AdvancedFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    section: "",
    category: "",
    genre: "",
    year: "",
    language: "",
    quality: "",
    resolution: "",
    rating: ""
  });

  // القسم (Section) - حسب المحتوى
  const sections = {
    movies: [
      { value: "29", label: "عربي" },
      { value: "30", label: "أجنبي" },
      { value: "31", label: "هندي" },
      { value: "32", label: "تركي" },
      { value: "33", label: "آسيوي" }
    ],
    series: [
      { value: "29", label: "عربي" },
      { value: "30", label: "أجنبي" },
      { value: "31", label: "هندي" },
      { value: "32", label: "تركي" },
      { value: "33", label: "آسيوي" }
    ],
    programs: [
      { value: "programs", label: "البرامج" },
      { value: "tablets", label: "الأجهزة اللوحية" },
      { value: "courses", label: "الكورسات التعليمية" }
    ]
  };

  // التصنيف (Genre)
  const allGenres = [
    "رمضان", "انمي", "اكشن", "مدبلج", "NETFLIX", "كوميديا", "اثارة", "غموض", 
    "عائلي", "اطفال", "حربي", "رياضي", "قصير", "فانتازيا", "خيال علمي", 
    "موسيقى", "سيرة ذاتية", "وثائقي", "رومانسي", "تاريخي", "درامي", "رعب", 
    "جريمة", "مغامرة", "غربي"
  ];

  const programGenres = [
    "انظمة التشغيل", "برامج المالتيميديا", "برامج التصميم و الصور", 
    "برامج التصفح و التحميل", "برامج التنظيف و الصيانة", "برامج الحماية"
  ];

  // التقييم
  const ratings = Array.from({ length: 9 }, (_, i) => ({
    value: `${i + 1}`,
    label: `+${i + 1}`
  }));

  // سنة الإنتاج
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1924 }, (_, i) => ({
    value: `${currentYear - i}`,
    label: `${currentYear - i}`
  }));

  // اللغة
  const languages = [
    "العربية", "الإنجليزية", "الهندية", "الاسبانية", "الصينية", "البرتغالية",
    "الفرنسية", "الروسية", "اليابانية", "الألمانية", "الكورية", "الفارسية",
    "الفيتنامية", "الإيطالية", "التركية", "البولندية", "الأوكرانية", "الفلندية",
    "التايلاندية", "الدنماركية", "السويدية", "الإندونيسية", "الماليزية",
    "النرويجية", "الهولندية", "الاردية", "المجرية"
  ];

  // الجودة
  const qualities = [
    "BluRay", "WebRip", "BRRIP", "DVDrip", "DVDSCR", "HD", "HDTS", 
    "HDTV", "CAM", "WEB-DL", "HDTC", "BDRIP", "HDRIP", "HC HDRIP"
  ];

  // الدقة
  const resolutions = [
    "240p", "360p", "480p", "720p", "1080p", "3D", "4K"
  ];

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      section: "",
      category: "",
      genre: "",
      year: "",
      language: "",
      quality: "",
      resolution: "",
      rating: ""
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  return (
    <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
      {/* Toggle Button */}
      <Button
        variant="outline"
        onClick={() => setShowFilters(!showFilters)}
        className="mb-4 bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
      >
        <Filter className="w-4 h-4 ml-2" />
        {showFilters ? "إخفاء الفلاتر" : "إظهار الفلاتر المتقدمة"}
      </Button>

      {/* Filters */}
      {showFilters && (
        <div className="space-y-6">
          {/* Filter Row 1 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Section */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">القسم</label>
              <select
                value={filters.section}
                onChange={(e) => handleFilterChange("section", e.target.value)}
                className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-white text-sm"
              >
                <option value="">جميع الأقسام</option>
                {sections[contentType as keyof typeof sections]?.map(section => (
                  <option key={section.value} value={section.value}>
                    {section.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">الفئة</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-white text-sm"
              >
                <option value="">جميع الفئات</option>
                {categories?.map((category: any) => (
                  <option key={category.id} value={category.id}>
                    {category.nameArabic || category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Genre */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">التصنيف</label>
              <select
                value={filters.genre}
                onChange={(e) => handleFilterChange("genre", e.target.value)}
                className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-white text-sm"
              >
                <option value="">جميع التصنيفات</option>
                {(contentType === "programs" ? programGenres : allGenres).map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">التقييم</label>
              <select
                value={filters.rating}
                onChange={(e) => handleFilterChange("rating", e.target.value)}
                className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-white text-sm"
              >
                <option value="">جميع التقييمات</option>
                {ratings.map(rating => (
                  <option key={rating.value} value={rating.value}>
                    {rating.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Filter Row 2 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Year */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">سنة الإنتاج</label>
              <select
                value={filters.year}
                onChange={(e) => handleFilterChange("year", e.target.value)}
                className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-white text-sm"
              >
                <option value="">جميع السنوات</option>
                {years.map(year => (
                  <option key={year.value} value={year.value}>
                    {year.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Language */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">اللغة</label>
              <select
                value={filters.language}
                onChange={(e) => handleFilterChange("language", e.target.value)}
                className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-white text-sm"
              >
                <option value="">جميع اللغات</option>
                {languages.map(language => (
                  <option key={language} value={language}>{language}</option>
                ))}
              </select>
            </div>

            {/* Quality */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">الجودة</label>
              <select
                value={filters.quality}
                onChange={(e) => handleFilterChange("quality", e.target.value)}
                className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-white text-sm"
              >
                <option value="">جميع الجودات</option>
                {qualities.map(quality => (
                  <option key={quality} value={quality}>{quality}</option>
                ))}
              </select>
            </div>

            {/* Resolution */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">الدقة</label>
              <select
                value={filters.resolution}
                onChange={(e) => handleFilterChange("resolution", e.target.value)}
                className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-white text-sm"
              >
                <option value="">جميع الدقات</option>
                {resolutions.map(resolution => (
                  <option key={resolution} value={resolution}>{resolution}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Clear Filters Button */}
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={clearFilters}
              className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
            >
              <X className="w-4 h-4 ml-2" />
              إلغاء جميع الفلاتر
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}