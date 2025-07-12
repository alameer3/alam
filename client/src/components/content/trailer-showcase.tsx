import { useState } from "react";
import { Play, Filter, Search, Calendar, Eye, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrailerPlayer, MiniTrailerPlayer } from "./trailer-player";

interface TrailerInfo {
  id: string;
  contentId: number;
  title: string;
  description: string;
  duration: string;
  url: string;
  thumbnail: string;
  releaseDate: string;
  rating: number;
  viewCount: number;
  cast: string[];
  genre: string[];
  type: 'teaser' | 'trailer' | 'behind-scenes' | 'interview';
}

interface TrailerShowcaseProps {
  trailers: TrailerInfo[];
  isLoading?: boolean;
  onTrailerSelect?: (trailer: TrailerInfo) => void;
  showFilters?: boolean;
  className?: string;
}

export function TrailerShowcase({
  trailers = [],
  isLoading = false,
  onTrailerSelect,
  showFilters = true,
  className = ""
}: TrailerShowcaseProps) {
  const [selectedTrailer, setSelectedTrailer] = useState<TrailerInfo | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [sortBy, setSortBy] = useState("newest");

  // Filter trailers based on search and type
  const filteredTrailers = trailers.filter(trailer => {
    const matchesSearch = trailer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trailer.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || trailer.type === selectedType;
    return matchesSearch && matchesType;
  });

  // Sort trailers
  const sortedTrailers = [...filteredTrailers].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
      case "oldest":
        return new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime();
      case "rating":
        return b.rating - a.rating;
      case "views":
        return b.viewCount - a.viewCount;
      default:
        return 0;
    }
  });

  // Group trailers by type
  const trailersByType = {
    trailer: sortedTrailers.filter(t => t.type === 'trailer'),
    teaser: sortedTrailers.filter(t => t.type === 'teaser'),
    'behind-scenes': sortedTrailers.filter(t => t.type === 'behind-scenes'),
    interview: sortedTrailers.filter(t => t.type === 'interview')
  };

  const handleTrailerClick = (trailer: TrailerInfo) => {
    setSelectedTrailer(trailer);
    onTrailerSelect?.(trailer);
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'trailer': return 'إعلان دعائي';
      case 'teaser': return 'إعلان تشويقي';
      case 'behind-scenes': return 'كواليس';
      case 'interview': return 'مقابلة';
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'trailer': return 'bg-red-600';
      case 'teaser': return 'bg-blue-600';
      case 'behind-scenes': return 'bg-green-600';
      case 'interview': return 'bg-purple-600';
      default: return 'bg-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Main Player */}
      {selectedTrailer && (
        <div className="mb-8">
          <TrailerPlayer
            trailerUrl={selectedTrailer.url}
            thumbnailUrl={selectedTrailer.thumbnail}
            title={selectedTrailer.title}
            autoPlay={true}
            className="w-full max-w-4xl mx-auto"
          />
          
          <div className="mt-4 text-center">
            <h3 className="text-2xl font-bold mb-2" dir="rtl">
              {selectedTrailer.title}
            </h3>
            <p className="text-muted-foreground mb-4" dir="rtl">
              {selectedTrailer.description}
            </p>
            
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{formatViews(selectedTrailer.viewCount)} مشاهدة</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span>{selectedTrailer.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{selectedTrailer.duration}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث في المقاطع الدعائية..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
                dir="rtl"
              />
            </div>
          </div>
          
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="نوع المقطع" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الأنواع</SelectItem>
              <SelectItem value="trailer">إعلان دعائي</SelectItem>
              <SelectItem value="teaser">إعلان تشويقي</SelectItem>
              <SelectItem value="behind-scenes">كواليس</SelectItem>
              <SelectItem value="interview">مقابلة</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="ترتيب حسب" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">الأحدث</SelectItem>
              <SelectItem value="oldest">الأقدم</SelectItem>
              <SelectItem value="rating">التقييم</SelectItem>
              <SelectItem value="views">المشاهدات</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Tabbed View */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">الكل ({sortedTrailers.length})</TabsTrigger>
          <TabsTrigger value="trailer">دعائي ({trailersByType.trailer.length})</TabsTrigger>
          <TabsTrigger value="teaser">تشويقي ({trailersByType.teaser.length})</TabsTrigger>
          <TabsTrigger value="behind-scenes">كواليس ({trailersByType['behind-scenes'].length})</TabsTrigger>
          <TabsTrigger value="interview">مقابلات ({trailersByType.interview.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <TrailerGrid trailers={sortedTrailers} onTrailerClick={handleTrailerClick} />
        </TabsContent>

        <TabsContent value="trailer" className="space-y-4">
          <TrailerGrid trailers={trailersByType.trailer} onTrailerClick={handleTrailerClick} />
        </TabsContent>

        <TabsContent value="teaser" className="space-y-4">
          <TrailerGrid trailers={trailersByType.teaser} onTrailerClick={handleTrailerClick} />
        </TabsContent>

        <TabsContent value="behind-scenes" className="space-y-4">
          <TrailerGrid trailers={trailersByType['behind-scenes']} onTrailerClick={handleTrailerClick} />
        </TabsContent>

        <TabsContent value="interview" className="space-y-4">
          <TrailerGrid trailers={trailersByType.interview} onTrailerClick={handleTrailerClick} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Component for rendering trailer grid
function TrailerGrid({ 
  trailers, 
  onTrailerClick 
}: { 
  trailers: TrailerInfo[], 
  onTrailerClick: (trailer: TrailerInfo) => void 
}) {
  if (trailers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">لا توجد مقاطع دعائية متاحة</p>
      </div>
    );
  }

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'trailer': return 'إعلان دعائي';
      case 'teaser': return 'إعلان تشويقي';
      case 'behind-scenes': return 'كواليس';
      case 'interview': return 'مقابلة';
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'trailer': return 'bg-red-600';
      case 'teaser': return 'bg-blue-600';
      case 'behind-scenes': return 'bg-green-600';
      case 'interview': return 'bg-purple-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {trailers.map((trailer) => (
        <Card 
          key={trailer.id} 
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => onTrailerClick(trailer)}
        >
          <CardContent className="p-0">
            <div className="relative">
              <MiniTrailerPlayer
                trailerUrl={trailer.url}
                thumbnailUrl={trailer.thumbnail}
                title={trailer.title}
                className="w-full"
              />
              
              <Badge 
                className={`absolute top-2 right-2 ${getTypeColor(trailer.type)} text-white`}
              >
                {getTypeLabel(trailer.type)}
              </Badge>
              
              <div className="absolute bottom-2 left-2 flex items-center gap-2">
                <Badge variant="secondary" className="bg-black/70 text-white">
                  {trailer.duration}
                </Badge>
              </div>
            </div>
            
            <div className="p-4">
              <h4 className="font-semibold mb-2 line-clamp-2" dir="rtl">
                {trailer.title}
              </h4>
              
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2" dir="rtl">
                {trailer.description}
              </p>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>{formatViews(trailer.viewCount)}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                  <span>{trailer.rating}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(trailer.releaseDate).toLocaleDateString('ar-SA')}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}