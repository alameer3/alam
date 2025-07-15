import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Play, Calendar, Eye, Globe, Search, Filter } from "lucide-react";
import { Link } from "wouter";
import AkHeader from "@/components/layout/ak-header";

interface Content {
  id: number;
  title: string;
  titleArabic?: string;
  description: string;
  type: string;
  poster_url: string;
  release_year: number;
  language: string;
  quality: string;
  rating: number;
  genres: string[];
  view_count?: number;
  duration?: number;
}

export default function Mix() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");

  const { data: mixContent } = useQuery({
    queryKey: ['/api/content/type/misc'],
    queryFn: async () => {
      const response = await fetch('/api/content/type/misc');
      return response.json();
    }
  });

  const { data: genres } = useQuery({
    queryKey: ['/api/genres'],
    queryFn: async () => {
      const response = await fetch('/api/genres');
      return response.json();
    }
  });

  const getContentLink = (content: Content) => {
    const slugTitle = content.titleArabic || content.title;
    return `/mix/${content.id}/${slugTitle}`;
  };

  const filteredContent = mixContent?.filter((content: Content) => {
    const matchesSearch = !searchTerm || 
      content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.titleArabic?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGenre = !selectedGenre || 
      content.genres?.some(genre => genre === selectedGenre);
    
    const matchesYear = !selectedYear || 
      content.release_year.toString() === selectedYear;
    
    const matchesLanguage = !selectedLanguage || 
      content.language === selectedLanguage;

    return matchesSearch && matchesGenre && matchesYear && matchesLanguage;
  });

  const ContentCard = ({ content }: { content: Content }) => (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-white">
      <Link to={getContentLink(content)}>
        <div className="aspect-[2/3] relative">
          <img 
            src={content.poster_url || '/api/placeholder/300/450'} 
            alt={content.titleArabic || content.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          
          <Badge 
            variant="secondary" 
            className="absolute top-2 right-2 bg-purple-600 text-white border-0 shadow-lg"
          >
            {content.quality}
          </Badge>

          <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/80 text-white px-2 py-1 rounded-full text-sm">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span>{content.rating}</span>
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-white text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>{content.release_year}</span>
                </div>
                <div className="flex items-center gap-2 text-white text-sm">
                  <Eye className="w-4 h-4" />
                  <span>{content.view_count || 0}</span>
                </div>
              </div>
              <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                <Play className="w-4 h-4 mr-2" />
                مشاهدة الآن
              </Button>
            </div>
          </div>
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-bold text-lg mb-2 line-clamp-2 text-right text-gray-800">
            {content.titleArabic || content.title}
          </h3>
          <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
            <span>{content.language}</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {content.release_year}
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {content.genres?.slice(0, 2).map((genre, index) => (
              <Badge key={index} variant="outline" className="text-xs border-purple-200 text-purple-600">
                {genre}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Link>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <AkHeader />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3">
            <div className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
              <Globe className="w-8 h-8 text-white" />
            </div>
            المحتوى المتنوع
          </h1>
          <p className="text-xl text-gray-600">اكتشف محتوى متنوع من الوثائقيات والبرامج الخاصة</p>
        </div>

        {/* Advanced Filters */}
        <Card className="mb-8 p-6 bg-white shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-800">البحث والتصفية</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="ابحث في المحتوى المتنوع..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-right"
              />
            </div>

            {/* Genre Filter */}
            <Select value={selectedGenre} onValueChange={setSelectedGenre}>
              <SelectTrigger>
                <SelectValue placeholder="النوع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">جميع الأنواع</SelectItem>
                {genres?.map((genre: any) => (
                  <SelectItem key={genre.id} value={genre.name}>
                    {genre.name_arabic || genre.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Year Filter */}
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger>
                <SelectValue placeholder="السنة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">جميع السنوات</SelectItem>
                {Array.from({length: 24}, (_, i) => 2024 - i).map(year => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Language Filter */}
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="اللغة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">جميع اللغات</SelectItem>
                <SelectItem value="Arabic">العربية</SelectItem>
                <SelectItem value="English">الإنجليزية</SelectItem>
                <SelectItem value="French">الفرنسية</SelectItem>
                <SelectItem value="Spanish">الإسبانية</SelectItem>
                <SelectItem value="Turkish">التركية</SelectItem>
                <SelectItem value="Korean">الكورية</SelectItem>
                <SelectItem value="Hindi">الهندية</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Results */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              النتائج ({filteredContent?.length || 0})
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>مرتب حسب: الأحدث</span>
            </div>
          </div>
          
          {filteredContent?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
              {filteredContent.map((content: Content) => (
                <ContentCard key={content.id} content={content} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-600 mb-2">لا توجد نتائج</h3>
              <p className="text-gray-500">جرب تعديل خيارات البحث أو المرشحات</p>
            </div>
          )}
        </div>

        {/* Popular Categories */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">الفئات الشائعة</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 text-center hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <h3 className="font-bold text-purple-800">الوثائقيات</h3>
              <p className="text-sm text-purple-600 mt-1">أفلام وثائقية</p>
            </Card>
            <Card className="p-4 text-center hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
              <h3 className="font-bold text-pink-800">البرامج الخاصة</h3>
              <p className="text-sm text-pink-600 mt-1">برامج مميزة</p>
            </Card>
            <Card className="p-4 text-center hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
              <h3 className="font-bold text-indigo-800">المقابلات</h3>
              <p className="text-sm text-indigo-600 mt-1">حوارات ومقابلات</p>
            </Card>
            <Card className="p-4 text-center hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <h3 className="font-bold text-orange-800">المنوعات</h3>
              <p className="text-sm text-orange-600 mt-1">محتوى متنوع</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}