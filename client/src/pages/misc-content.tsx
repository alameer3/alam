import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, BookOpen, Music, Image, Video, Play, Download, Filter } from 'lucide-react';
import MixedContentGrid from '@/components/content/mixed-content-grid';
import Pagination from '@/components/ui/pagination';

const miscCategories = [
  { id: 'quran', name: 'القرآن الكريم', icon: BookOpen },
  { id: 'islamic', name: 'إسلاميات وأناشيد', icon: Music },
  { id: 'books', name: 'كتب وأبحاث', icon: BookOpen },
  { id: 'sports', name: 'رياضة', icon: Play },
  { id: 'images', name: 'صور وخلفيات', icon: Image },
  { id: 'music', name: 'موسيقى', icon: Music },
  { id: 'radio', name: 'مسلسلات إذاعية', icon: Play },
  { id: 'clip', name: 'فيديو كليب', icon: Video }
];

const qualityOptions = [
  { value: '240p', label: '240p' },
  { value: '360p', label: '360p' },
  { value: '480p', label: '480p' },
  { value: '720p', label: '720p' },
  { value: '1080p', label: '1080p' },
  { value: '3d', label: '3D' },
  { value: '4k', label: '4K' },
  { value: 'hd', label: 'HD 720p' }
];

const yearOptions = Array.from({ length: 2025 - 1952 + 1 }, (_, i) => 2025 - i);

export default function MiscContent() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuality, setSelectedQuality] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [ratingFilter, setRatingFilter] = useState<string>('');

  // Mock data for demonstration
  const mockMiscContent = [
    {
      id: 1,
      title: 'سورة البقرة - مشاري العفاسي',
      type: 'quran' as const,
      thumbnail: '/assets/quran-thumbnail.jpg',
      duration: '2:47:30',
      quality: '320kbps',
      description: 'تلاوة خاشعة لسورة البقرة بصوت الشيخ مشاري العفاسي',
      size: '245 MB',
      uploadDate: '2023-12-01'
    },
    {
      id: 2,
      title: 'نشيد يا مسافر - محمد العدوي',
      type: 'islamic' as const,
      thumbnail: '/assets/islamic-thumbnail.jpg',
      duration: '4:25',
      quality: '320kbps',
      description: 'نشيد إسلامي هادف بصوت محمد العدوي',
      size: '8.5 MB',
      uploadDate: '2023-11-15'
    },
    {
      id: 3,
      title: 'كتاب رياض الصالحين - PDF',
      type: 'books' as const,
      thumbnail: '/assets/book-thumbnail.jpg',
      quality: 'PDF',
      description: 'كتاب رياض الصالحين للإمام النووي - نسخة محققة',
      size: '12 MB',
      uploadDate: '2023-10-20'
    },
    {
      id: 4,
      title: 'مباراة الكلاسيكو - ريال مدريد ضد برشلونة',
      type: 'sports' as const,
      thumbnail: '/assets/sports-thumbnail.jpg',
      duration: '1:45:00',
      quality: '1080p',
      description: 'مباراة الكلاسيكو الأخيرة بين ريال مدريد وبرشلونة',
      size: '2.8 GB',
      uploadDate: '2023-11-28'
    },
    {
      id: 5,
      title: 'خلفيات إسلامية عالية الدقة',
      type: 'images' as const,
      thumbnail: '/assets/wallpaper-thumbnail.jpg',
      quality: '4K',
      description: 'مجموعة من الخلفيات الإسلامية الجميلة بدقة 4K',
      size: '45 MB',
      uploadDate: '2023-12-10'
    },
    {
      id: 6,
      title: 'أغنية لما بدا يتثنى - فيروز',
      type: 'music' as const,
      thumbnail: '/assets/music-thumbnail.jpg',
      duration: '3:45',
      quality: '320kbps',
      description: 'أغنية كلاسيكية بصوت فيروز الخالد',
      size: '9.2 MB',
      uploadDate: '2023-09-15'
    },
    {
      id: 7,
      title: 'مسلسل ألف ليلة وليلة الإذاعي',
      type: 'radio' as const,
      thumbnail: '/assets/radio-thumbnail.jpg',
      duration: '25:30',
      quality: '128kbps',
      description: 'حلقة من المسلسل الإذاعي الشهير ألف ليلة وليلة',
      size: '23 MB',
      uploadDate: '2023-08-10'
    },
    {
      id: 8,
      title: 'فيديو كليب - يا مسافر - محمد عبده',
      type: 'clip' as const,
      thumbnail: '/assets/clip-thumbnail.jpg',
      duration: '4:12',
      quality: '1080p',
      description: 'فيديو كليب أغنية يا مسافر للفنان محمد عبده',
      size: '145 MB',
      uploadDate: '2023-07-25'
    }
  ];

  const filteredContent = mockMiscContent.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.type === activeCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesQuality = !selectedQuality || selectedQuality === "all" || item.quality === selectedQuality;
    const matchesYear = !selectedYear || selectedYear === "all" || item.uploadDate?.includes(selectedYear);
    
    return matchesCategory && matchesSearch && matchesQuality && matchesYear;
  });

  const totalPages = Math.ceil(filteredContent.length / 12);

  const handleItemClick = (item: any) => {
    // Opening item - production ready
    // Here you would typically navigate to the item detail page or open a player
  };

  const resetFilters = () => {
    setActiveCategory('all');
    setSearchTerm('');
    setSelectedQuality('all');
    setSelectedYear('all');
    setRatingFilter('all');
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">منوعات</h1>
        <p className="text-gray-600 dark:text-gray-400">
          مجموعة متنوعة من المحتوى الإسلامي والثقافي والترفيهي
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            البحث والفلاتر
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="البحث في المنوعات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Quality Filter */}
            <Select value={selectedQuality} onValueChange={setSelectedQuality}>
              <SelectTrigger>
                <SelectValue placeholder="الجودة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الجودات</SelectItem>
                {qualityOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Year Filter */}
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger>
                <SelectValue placeholder="سنة الإنتاج" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع السنوات</SelectItem>
                {yearOptions.map(year => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Rating Filter */}
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger>
                <SelectValue placeholder="التقييم" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع التقييمات</SelectItem>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(rating => (
                  <SelectItem key={rating} value={rating.toString()}>
                    +{rating}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between items-center mt-4">
            <Button variant="outline" onClick={resetFilters} size="sm">
              إعادة تعيين الفلاتر
            </Button>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {filteredContent.length} عنصر من أصل {mockMiscContent.length}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-6">
        <TabsList className="grid w-full grid-cols-4 md:grid-cols-8 lg:grid-cols-9">
          <TabsTrigger value="all" className="text-sm">
            الكل
          </TabsTrigger>
          {miscCategories.map(category => {
            const Icon = category.icon;
            return (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="text-sm flex items-center gap-1"
              >
                <Icon className="w-3 h-3" />
                <span className="hidden sm:inline">{category.name}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value={activeCategory} className="mt-6">
          <MixedContentGrid 
            items={filteredContent}
            onItemClick={handleItemClick}
          />
        </TabsContent>
      </Tabs>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}