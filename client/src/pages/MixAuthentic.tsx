import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Star, Calendar, Clock, Filter, Grid, List, Gamepad2, Download, Music, Book } from 'lucide-react';
import AuthenticHeader from '../components/layout/AuthenticHeader';
import AuthenticFooter from '../components/layout/AuthenticFooter';
import type { Content } from '@shared/types';

const MixAuthentic = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState({
    category: '',
    year: '',
    platform: '',
    sortBy: 'latest'
  });

  const { data: mixContent, isLoading } = useQuery({
    queryKey: ['/api/content', 'mix', filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        type: 'mix',
        ...filters
      });
      const response = await fetch(`/api/content?${params}`);
      return response.json();
    }
  });

  const filterOptions = {
    categories: ['ألعاب', 'تطبيقات', 'مسرحيات', 'موسيقى', 'كتب', 'برامج كمبيوتر'],
    years: ['2024', '2023', '2022', '2021', '2020'],
    platforms: ['Android', 'iOS', 'Windows', 'Mac', 'PlayStation', 'Xbox'],
    sortOptions: [
      { value: 'latest', label: 'الأحدث' },
      { value: 'rating', label: 'الأعلى تقييماً' },
      { value: 'popular', label: 'الأكثر تحميلاً' },
      { value: 'alphabetical', label: 'أبجدياً' }
    ]
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ألعاب':
        return Gamepad2;
      case 'موسيقى':
        return Music;
      case 'كتب':
        return Book;
      default:
        return Download;
    }
  };

  const MixCard = ({ item }: { item: Content }) => {
    const IconComponent = getCategoryIcon(item.category || 'ألعاب');
    
    return (
      <a href={`/mix/${item.id}`} className="group cursor-pointer block">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-800">
          <img
            src={item.poster}
            alt={item.titleAr}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          
          {/* تراكب المعلومات */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="flex items-center space-x-2 space-x-reverse mb-2">
                <span 
                  className="text-white text-xs px-2 py-1 rounded"
                  style={{ backgroundColor: '#f3951e' }}
                >
                  {item.category || 'منوعات'}
                </span>
                <div className="flex items-center space-x-1 space-x-reverse">
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                  <span className="text-white text-xs">{item.rating}</span>
                </div>
              </div>
              <h3 className="text-white font-medium text-sm mb-1 line-clamp-2">{item.titleAr}</h3>
              <div className="flex items-center space-x-3 space-x-reverse text-xs text-gray-300">
                <div className="flex items-center space-x-1 space-x-reverse">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(item.releaseDate).getFullYear()}</span>
                </div>
                {item.size && (
                  <div className="flex items-center space-x-1 space-x-reverse">
                    <Download className="h-3 w-3" />
                    <span>{item.size}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* فئة المحتوى */}
          <div className="absolute top-2 right-2">
            <span 
              className="text-white text-xs px-2 py-1 rounded backdrop-blur-sm"
              style={{ backgroundColor: 'rgba(243, 149, 30, 0.8)' }}
            >
              {item.category || 'منوعات'}
            </span>
          </div>

          {/* التقييم */}
          <div className="absolute top-2 left-2">
            <div className="flex items-center space-x-1 space-x-reverse bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
              <Star className="h-3 w-3 text-yellow-400 fill-current" />
              <span>{item.rating}</span>
            </div>
          </div>

          {/* أيقونة الفئة */}
          <div className="absolute bottom-2 left-2">
            <div 
              className="p-2 rounded backdrop-blur-sm"
              style={{ backgroundColor: 'rgba(243, 149, 30, 0.8)' }}
            >
              <IconComponent className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>
      </a>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <AuthenticHeader />
      
      {/* الخلفية مع التأثير */}
      <div 
        className="h-64 bg-cover bg-center relative"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2070')",
        }}
      >
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">منوعات</h1>
            <p className="text-gray-300 text-lg">ألعاب، تطبيقات، مسرحيات ومحتوى متنوع</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* شريط الفلاتر */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              {/* فلتر الفئة */}
              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-orange-500"
              >
                <option value="">جميع الفئات</option>
                {filterOptions.categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              {/* فلتر السنة */}
              <select
                value={filters.year}
                onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
                className="bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-orange-500"
              >
                <option value="">جميع السنوات</option>
                {filterOptions.years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>

              {/* فلتر المنصة */}
              <select
                value={filters.platform}
                onChange={(e) => setFilters(prev => ({ ...prev, platform: e.target.value }))}
                className="bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-orange-500"
              >
                <option value="">جميع المنصات</option>
                {filterOptions.platforms.map(platform => (
                  <option key={platform} value={platform}>{platform}</option>
                ))}
              </select>

              {/* ترتيب */}
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                className="bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-orange-500"
              >
                {filterOptions.sortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* أزرار العرض */}
            <div className="flex items-center space-x-2 space-x-reverse">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* المحتوى */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="aspect-square bg-gray-800 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6" 
            : "space-y-4"
          }>
            {mixContent?.data?.map((item: Content) => (
              <MixCard key={item.id} item={item} />
            ))}
          </div>
        )}

        {/* رسالة عدم وجود نتائج */}
        {!isLoading && (!mixContent?.data || mixContent.data.length === 0) && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-4">لا يوجد محتوى متاح</div>
            <p className="text-gray-500">جرب تغيير معايير البحث</p>
          </div>
        )}
      </div>

      <AuthenticFooter />
    </div>
  );
};

export default MixAuthentic;