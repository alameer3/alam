import { useState, useEffect, useRef } from "react";
import { Search, X, Filter, Mic, Keyboard } from "lucide-react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SearchResult {
  id: number;
  title: string;
  titleArabic?: string;
  type: string;
  year?: number;
  poster?: string;
  rating?: number;
}

interface EnhancedSearchProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  showResults?: boolean;
  showTyped?: boolean;
}

export default function EnhancedSearch({ 
  placeholder = "ابحث عن فيلم، مسلسل، برنامج...", 
  onSearch,
  showResults = true,
  showTyped = true
}: EnhancedSearchProps) {
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [typedText, setTypedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const searchTexts = [
    "ابحث عن فيلم...",
    "ابحث عن مسلسل...",
    "ابحث عن برنامج...",
    "ابحث عن حلقة...",
    "ابحث عن لعبة...",
    "ابحث عن تطبيق..."
  ];

  // تأثير الكتابة المتحركة
  useEffect(() => {
    if (!showTyped) return;
    
    const text = searchTexts[currentIndex];
    let charIndex = 0;
    
    const typingInterval = setInterval(() => {
      if (charIndex < text.length) {
        setTypedText(text.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => {
          const deletingInterval = setInterval(() => {
            if (charIndex > 0) {
              setTypedText(text.slice(0, charIndex - 1));
              charIndex--;
            } else {
              clearInterval(deletingInterval);
              setCurrentIndex((prev) => (prev + 1) % searchTexts.length);
            }
          }, 50);
        }, 2000);
      }
    }, 100);

    return () => clearInterval(typingInterval);
  }, [currentIndex, showTyped]);

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['/api/search', query],
    queryFn: async () => {
      if (!query.trim()) return { results: [] };
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      return response.json();
    },
    enabled: query.length > 2 && isOpen
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // إضافة للبحث السابق
      setRecentSearches(prev => {
        const newSearches = [query, ...prev.filter(s => s !== query)].slice(0, 5);
        localStorage.setItem('recentSearches', JSON.stringify(newSearches));
        return newSearches;
      });
      
      setLocation(`/search?q=${encodeURIComponent(query)}`);
      setIsOpen(false);
      onSearch?.(query);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    setQuery(result.titleArabic || result.title);
    setIsOpen(false);
    
    if (result.type === 'movie') {
      setLocation(`/movie/${result.id}/${encodeURIComponent(result.title)}`);
    } else if (result.type === 'series') {
      setLocation(`/series/${result.id}/${encodeURIComponent(result.title)}`);
    } else {
      setLocation(`/content/${result.id}/${encodeURIComponent(result.title)}`);
    }
  };

  const handleRecentSearch = (recentQuery: string) => {
    setQuery(recentQuery);
    setLocation(`/search?q=${encodeURIComponent(recentQuery)}`);
    setIsOpen(false);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const results = searchResults?.results || [];

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className="relative">
          <Input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            placeholder={showTyped ? typedText : placeholder}
            className="w-full bg-gray-800 border-gray-700 text-white placeholder-gray-400 pr-12 pl-4 py-3 rounded-full text-lg"
            dir="rtl"
          />
          
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          
          {query && (
            <Button
              type="button"
              onClick={() => setQuery("")}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 p-1 h-auto bg-transparent hover:bg-gray-700 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </form>

      {/* نتائج البحث */}
      {isOpen && showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
          {/* عمليات البحث السابقة */}
          {recentSearches.length > 0 && !query && (
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-300">عمليات البحث السابقة</h4>
                <Button
                  onClick={clearRecentSearches}
                  className="text-xs text-gray-400 hover:text-white bg-transparent hover:bg-gray-700 p-1 h-auto"
                >
                  مسح الكل
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((recent, index) => (
                  <Badge
                    key={index}
                    onClick={() => handleRecentSearch(recent)}
                    className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white"
                  >
                    {recent}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* نتائج البحث الحالية */}
          {query && (
            <div className="p-2">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-2">
                  {results.slice(0, 6).map((result: SearchResult) => (
                    <div
                      key={result.id}
                      onClick={() => handleResultClick(result)}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors"
                    >
                      <img
                        src={result.poster || "/api/placeholder/60/80"}
                        alt={result.titleArabic || result.title}
                        className="w-12 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="text-white font-medium text-sm">
                          {result.titleArabic || result.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {result.type === 'movie' ? 'فيلم' : 
                             result.type === 'series' ? 'مسلسل' : 'محتوى'}
                          </Badge>
                          {result.year && (
                            <span className="text-xs text-gray-400">{result.year}</span>
                          )}
                          {result.rating && (
                            <div className="flex items-center gap-1 text-xs text-orange-400">
                              <span>★</span>
                              <span>{result.rating}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {results.length > 6 && (
                    <div className="p-3 text-center">
                      <Button
                        onClick={() => setLocation(`/search?q=${encodeURIComponent(query)}`)}
                        className="text-orange-400 hover:text-orange-300 bg-transparent hover:bg-gray-700"
                      >
                        عرض جميع النتائج ({results.length})
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>لا توجد نتائج لـ "{query}"</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}