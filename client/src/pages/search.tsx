import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Grid, List, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import Footer from '@/components/layout/footer';
import AdvancedSearch from '@/components/search/advanced-search';
import { SearchResultsGrid } from '@/components/search/search-results-grid';
import AdvancedVideoPlayer from '@/components/content/advanced-video-player';
import { Content } from '@shared/schema';

interface SearchFilters {
  query: string;
  type: string;
  category: string;
  genre: string;
  year: [number, number];
  rating: [number];
  language: string;
  quality: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export default function SearchPage() {
  const [searchFilters, setSearchFilters] = useState<SearchFilters | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [searchResults, setSearchResults] = useState<Content[]>([]);

  // Get search results
  const { data: searchData, isLoading: isSearching } = useQuery({
    queryKey: ['/api/search', searchFilters],
    enabled: !!searchFilters,
    staleTime: 1 * 60 * 1000, // 1 minute
  });

  // Get content for different types to show in suggestions
  const { data: moviesData } = useQuery({
    queryKey: ['/api/content/movie'],
    staleTime: 5 * 60 * 1000,
  });

  const { data: seriesData } = useQuery({
    queryKey: ['/api/content/series'],
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (searchData) {
      setSearchResults(searchData);
    }
  }, [searchData]);

  const handleSearch = async (filters: SearchFilters) => {
    setSearchFilters(filters);
    
    // Simulate search API call
    try {
      const params = new URLSearchParams();
      if (filters.query) params.append('q', filters.query);
      if (filters.type !== 'all') params.append('type', filters.type);
      if (filters.language !== 'all') params.append('language', filters.language);
      if (filters.quality !== 'all') params.append('quality', filters.quality);
      
      // For now, filter locally from existing content
      let results: Content[] = [];
      
      if (moviesData?.content) results = [...results, ...moviesData.content];
      if (seriesData?.content) results = [...results, ...seriesData.content];
      
      // Apply filters
      if (filters.query) {
        const query = filters.query.toLowerCase();
        results = results.filter(item => 
          item.title.toLowerCase().includes(query) ||
          item.titleArabic?.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query) ||
          item.descriptionArabic?.toLowerCase().includes(query)
        );
      }
      
      if (filters.type !== 'all') {
        results = results.filter(item => item.type === filters.type);
      }
      
      if (filters.language !== 'all') {
        results = results.filter(item => item.language === filters.language);
      }
      
      if (filters.quality !== 'all') {
        results = results.filter(item => item.quality === filters.quality);
      }
      
      // Apply year filter
      results = results.filter(item => 
        item.year >= filters.year[0] && item.year <= filters.year[1]
      );
      
      // Apply rating filter
      if (filters.rating[0] > 0) {
        results = results.filter(item => 
          item.rating && parseFloat(item.rating) >= filters.rating[0]
        );
      }
      
      // Apply sorting
      results.sort((a, b) => {
        let compareValue = 0;
        
        switch (filters.sortBy) {
          case 'title':
            compareValue = (a.titleArabic || a.title).localeCompare(b.titleArabic || b.title);
            break;
          case 'year':
            compareValue = a.year - b.year;
            break;
          case 'rating':
            compareValue = parseFloat(a.rating || '0') - parseFloat(b.rating || '0');
            break;
          case 'date':
          default:
            compareValue = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            break;
        }
        
        return filters.sortOrder === 'desc' ? -compareValue : compareValue;
      });
      
      setSearchResults(results);
    } catch (error) {
      // معالجة خطأ البحث بصمت
      setSearchResults([]);
    }
  };

  const handleContentClick = (content: Content) => {
    setSelectedContent(content);
  };

  // Generate search suggestions
  const searchSuggestions = [
    { id: '1', text: 'أفلام أكشن', type: 'suggestion' as const, icon: <Grid className="w-4 h-4" /> },
    { id: '2', text: 'مسلسلات عربية', type: 'suggestion' as const, icon: <List className="w-4 h-4" /> },
    { id: '3', text: 'أفلام 2024', type: 'suggestion' as const, icon: <Grid className="w-4 h-4" /> },
    { id: '4', text: 'كوميديا', type: 'suggestion' as const, icon: <Grid className="w-4 h-4" /> },
    { id: '5', text: 'دراما تركية', type: 'suggestion' as const, icon: <List className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen" dir="rtl">
      <Header />
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6 text-center">البحث المتقدم</h1>
          <div className="max-w-4xl mx-auto">
            <div className="bg-card rounded-lg p-6">
              <p className="text-muted-foreground text-center">
                استخدم البحث المتقدم للعثور على المحتوى المفضل لديك
              </p>
            </div>
          </div>
        </div>

        {/* Search Results */}
        {searchFilters && (
          <div className="space-y-6">
            {/* Results Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold">
                  نتائج البحث
                  {searchResults.length > 0 && (
                    <Badge variant="secondary" className="mr-2">
                      {searchResults.length} نتيجة
                    </Badge>
                  )}
                </h2>
                
                {searchFilters.query && (
                  <Badge variant="outline">
                    "{searchFilters.query}"
                  </Badge>
                )}
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Active Filters */}
            {(searchFilters.type !== 'all' || searchFilters.language !== 'all' || searchFilters.quality !== 'all') && (
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-muted-foreground">الفلاتر النشطة:</span>
                {searchFilters.type !== 'all' && (
                  <Badge variant="secondary">
                    نوع: {searchFilters.type === 'movie' ? 'أفلام' : 
                          searchFilters.type === 'series' ? 'مسلسلات' : 
                          searchFilters.type === 'tv' ? 'تلفزيون' : 'منوعات'}
                  </Badge>
                )}
                {searchFilters.language !== 'all' && (
                  <Badge variant="secondary">
                    لغة: {searchFilters.language}
                  </Badge>
                )}
                {searchFilters.quality !== 'all' && (
                  <Badge variant="secondary">
                    جودة: {searchFilters.quality}
                  </Badge>
                )}
              </div>
            )}

            {/* Results Grid */}
            <SearchResultsGrid
              results={searchResults}
              isLoading={isSearching}
              onContentClick={handleContentClick}
              viewMode={viewMode}
            />
          </div>
        )}

        {/* Default Content - Show when no search */}
        {!searchFilters && (
          <div className="space-y-12">
            {/* Demo Section */}
            <section className="text-center">
              <h2 className="text-2xl font-bold mb-4">اكتشف المحتوى</h2>
              <p className="text-muted-foreground mb-8">
                استخدم البحث المتقدم للعثور على المحتوى المفضل لديك
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                <Card className="p-4 cursor-pointer hover:shadow-lg transition-shadow" 
                      onClick={() => handleSearch({ 
                        query: '', type: 'movie', category: 'all', genre: 'all', 
                        year: [1990, 2024], rating: [0], language: 'all', 
                        quality: 'all', sortBy: 'date', sortOrder: 'desc' 
                      })}>
                  <Grid className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                  <h3 className="font-semibold">الأفلام</h3>
                </Card>
                
                <Card className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => handleSearch({ 
                        query: '', type: 'series', category: 'all', genre: 'all', 
                        year: [1990, 2024], rating: [0], language: 'all', 
                        quality: 'all', sortBy: 'date', sortOrder: 'desc' 
                      })}>
                  <List className="w-8 h-8 mx-auto mb-2 text-green-500" />
                  <h3 className="font-semibold">المسلسلات</h3>
                </Card>
                
                <Card className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => handleSearch({ 
                        query: '', type: 'all', category: 'all', genre: 'all', 
                        year: [2020, 2024], rating: [8], language: 'all', 
                        quality: 'all', sortBy: 'rating', sortOrder: 'desc' 
                      })}>
                  <LayoutGrid className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                  <h3 className="font-semibold">الأعلى تقييماً</h3>
                </Card>
                
                <Card className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => handleSearch({ 
                        query: '', type: 'all', category: 'all', genre: 'all', 
                        year: [2024, 2024], rating: [0], language: 'all', 
                        quality: 'all', sortBy: 'date', sortOrder: 'desc' 
                      })}>
                  <Grid className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                  <h3 className="font-semibold">الأحدث</h3>
                </Card>
              </div>
            </section>
          </div>
        )}
      </div>

      {/* Video Player Modal */}
      {selectedContent && (
        <AdvancedVideoPlayer
          content={selectedContent}
          onClose={() => setSelectedContent(null)}
          autoPlay={false}
        />
      )}

      <Footer />
    </div>
  );
}