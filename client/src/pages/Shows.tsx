import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Star, Calendar, Clock, Filter, Grid, List, Tv, Radio } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import type { Content } from '@shared/types';

const ShowsAuthentic = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState({
    genre: '',
    year: '',
    type: '',
    sortBy: 'latest'
  });

  const { data: shows, isLoading } = useQuery({
    queryKey: ['/api/content', 'show', filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        type: 'show',
        ...filters
      });
      const response = await fetch(`/api/content?${params}`);
      return response.json();
    }
  });

  const filterOptions = {
    genres: ['رياضة', 'أخبار', 'ترفيه', 'وثائقي', 'تعليمي', 'طبخ'],
    years: ['2024', '2023', '2022', '2021', '2020'],
    types: ['برنامج حواري', 'برنامج رياضي', 'برنامج إذاعي', 'برنامج وثائقي'],
    sortOptions: [
      { value: 'latest', label: 'الأحدث' },
      { value: 'rating', label: 'الأعلى تقييماً' },
      { value: 'popular', label: 'الأكثر مشاهدة' },
      { value: 'alphabetical', label: 'أبجدياً' }
    ]
  };

  const ShowCard = ({ item }: { item: Content }) => (
    <a href={`/show/${item.id}`} className="group cursor-pointer block">
      <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-gray-800">
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
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                برنامج
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
              <div className="flex items-center space-x-1 space-x-reverse">
                <Tv className="h-3 w-3" />
                <span>{item.episodes?.length || 0} حلقة</span>
              </div>
            </div>
          </div>
        </div>

        {/* نوع البرنامج */}
        <div className="absolute top-2 right-2">
          <span className="bg-blue-500/80 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
            برنامج
          </span>
        </div>

        {/* التقييم */}
        <div className="absolute top-2 left-2">
          <div className="flex items-center space-x-1 space-x-reverse bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
            <Star className="h-3 w-3 text-yellow-400 fill-current" />
            <span>{item.rating}</span>
          </div>
        </div>

        {/* أيقونة نوع البرنامج */}
        <div className="absolute bottom-2 left-2">
          <div className="bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
            <Tv className="h-4 w-4" />
          </div>
        </div>
      </div>
    </a>
  );

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      {/* الخلفية مع التأثير */}
      <div 
        className="h-64 bg-cover bg-center relative"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?q=80&w=2070')",
        }}
      >
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">برامج</h1>
            <p className="text-gray-300 text-lg">البرامج التلفزيونية والوثائقية والرياضية</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* شريط الفلاتر */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              {/* فلتر النوع */}
              <select
                value={filters.genre}
                onChange={(e) => setFilters(prev => ({ ...prev, genre: e.target.value }))}
                className="bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-orange-500"
              >
                <option value="">جميع الأنواع</option>
                {filterOptions.genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
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

              {/* فلتر نوع البرنامج */}
              <select
                value={filters.type}
                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                className="bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-orange-500"
              >
                <option value="">جميع الأنواع</option>
                {filterOptions.types.map(type => (
                  <option key={type} value={type}>{type}</option>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, index) => (
              <div key={index} className="aspect-[16/9] bg-gray-800 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
            : "space-y-4"
          }>
            {shows?.data?.map((show: Content) => (
              <ShowCard key={show.id} item={show} />
            ))}
          </div>
        )}

        {/* رسالة عدم وجود نتائج */}
        {!isLoading && (!shows?.data || shows.data.length === 0) && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-4">لا توجد برامج متاحة</div>
            <p className="text-gray-500">جرب تغيير معايير البحث</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ShowsAuthentic;