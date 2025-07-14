import { useState } from "react";
import { ChevronDown, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterDropdownProps {
  title: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

function FilterDropdown({ title, options, value, onChange, className = "" }: FilterDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className={`bg-black/20 border-gray-600 text-white hover:bg-black/40 hover:border-gray-500 ${className}`}
        >
          {value ? options.find(opt => opt.value === value)?.label || title : title}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-black/90 border-gray-600 text-white">
        <DropdownMenuItem 
          onClick={() => onChange("")}
          className="hover:bg-white/10"
        >
          الكل
        </DropdownMenuItem>
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onChange(option.value)}
            className="hover:bg-white/10"
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface AkStyleFiltersProps {
  onFiltersChange?: (filters: any) => void;
  contentType?: string;
}

export function AkStyleFilters({ onFiltersChange, contentType = "movies" }: AkStyleFiltersProps) {
  const [filters, setFilters] = useState({
    category: "",
    genre: "",
    rating: "",
    year: "",
    language: "", 
    quality: "",
    resolution: ""
  });

  const categories = [
    { value: "arabic", label: "عربي" },
    { value: "foreign", label: "أجنبي" },
    { value: "indian", label: "هندي" },
    { value: "turkish", label: "تركي" },
    { value: "asian", label: "اسيوي" }
  ];

  const genres = [
    { value: "ramadan", label: "رمضان" },
    { value: "anime", label: "انمي" },
    { value: "action", label: "اكشن" },
    { value: "dubbed", label: "مدبلج" },
    { value: "netflix", label: "NETFLIX" },
    { value: "comedy", label: "كوميديا" },
    { value: "thriller", label: "اثارة" },
    { value: "mystery", label: "غموض" },
    { value: "family", label: "عائلي" },
    { value: "kids", label: "اطفال" },
    { value: "war", label: "حربي" },
    { value: "sport", label: "رياضي" },
    { value: "short", label: "قصير" },
    { value: "fantasy", label: "فانتازيا" },
    { value: "scifi", label: "خيال علمي" },
    { value: "musical", label: "موسيقى" },
    { value: "biography", label: "سيرة ذاتية" },
    { value: "documentary", label: "وثائقي" },
    { value: "romance", label: "رومانسي" },
    { value: "historical", label: "تاريخي" },
    { value: "drama", label: "دراما" },
    { value: "horror", label: "رعب" },
    { value: "crime", label: "جريمة" },
    { value: "adventure", label: "مغامرة" },
    { value: "western", label: "غربي" }
  ];

  const ratings = [
    { value: "1", label: "+1" },
    { value: "2", label: "+2" },
    { value: "3", label: "+3" },
    { value: "4", label: "+4" },
    { value: "5", label: "+5" },
    { value: "6", label: "+6" },
    { value: "7", label: "+7" },
    { value: "8", label: "+8" },
    { value: "9", label: "+9" }
  ];

  const years = Array.from({ length: 100 }, (_, i) => ({
    value: (2025 - i).toString(),
    label: (2025 - i).toString()
  }));

  const languages = [
    { value: "arabic", label: "العربية" },
    { value: "english", label: "الإنجليزية" },
    { value: "hindi", label: "الهندية" },
    { value: "spanish", label: "الاسبانية" },
    { value: "chinese", label: "الصينية" },
    { value: "portuguese", label: "البرتغالية" },
    { value: "french", label: "الفرنسية" },
    { value: "russian", label: "الروسية" },
    { value: "japanese", label: "اليابانية" },
    { value: "german", label: "الألمانية" },
    { value: "korean", label: "الكورية" },
    { value: "turkish", label: "التركية" }
  ];

  const qualities = [
    { value: "bluray", label: "BluRay" },
    { value: "webrip", label: "WebRip" },
    { value: "brrip", label: "BRRIP" },
    { value: "dvdrip", label: "DVDrip" },
    { value: "dvdscr", label: "DVDSCR" },
    { value: "hd", label: "HD" },
    { value: "hdts", label: "HDTS" },
    { value: "hdtv", label: "HDTV" },
    { value: "cam", label: "CAM" },
    { value: "webdl", label: "WEB-DL" },
    { value: "hdtc", label: "HDTC" },
    { value: "bdrip", label: "BDRIP" },
    { value: "hdrip", label: "HDRIP" },
    { value: "hc-hdrip", label: "HC HDRIP" }
  ];

  const resolutions = [
    { value: "240p", label: "240p" },
    { value: "360p", label: "360p" },
    { value: "480p", label: "480p" },
    { value: "720p", label: "720p" },
    { value: "1080p", label: "1080p" },
    { value: "3d", label: "3D" },
    { value: "4k", label: "4K" }
  ];

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  return (
    <div className="bg-gradient-to-r from-gray-900 to-black py-6 px-4 border-b border-gray-700">
      <div className="container mx-auto">
        <div className="flex flex-wrap gap-3 items-center justify-center">
          <FilterDropdown
            title="القسم"
            options={categories}
            value={filters.category}
            onChange={(value) => handleFilterChange("category", value)}
          />
          
          <FilterDropdown
            title="التصنيف"
            options={genres}
            value={filters.genre}
            onChange={(value) => handleFilterChange("genre", value)}
          />
          
          <FilterDropdown
            title="التقييم"
            options={ratings}
            value={filters.rating}
            onChange={(value) => handleFilterChange("rating", value)}
          />
          
          <FilterDropdown
            title="سنة الإنتاج"
            options={years}
            value={filters.year}
            onChange={(value) => handleFilterChange("year", value)}
          />
          
          <FilterDropdown
            title="اللغة"
            options={languages}
            value={filters.language}
            onChange={(value) => handleFilterChange("language", value)}
          />
          
          <FilterDropdown
            title="الجودة"
            options={qualities}
            value={filters.quality}
            onChange={(value) => handleFilterChange("quality", value)}
          />
          
          <FilterDropdown
            title="الدقة"
            options={resolutions}
            value={filters.resolution}
            onChange={(value) => handleFilterChange("resolution", value)}
          />
          
          <Button 
            onClick={() => {
              setFilters({
                category: "",
                genre: "",
                rating: "",
                year: "",
                language: "",
                quality: "",
                resolution: ""
              });
              onFiltersChange?.({});
            }}
            variant="outline"
            className="bg-red-600 hover:bg-red-700 border-red-600 text-white"
          >
            <Filter className="ml-2 h-4 w-4" />
            إعادة تعيين
          </Button>
        </div>
      </div>
    </div>
  );
}