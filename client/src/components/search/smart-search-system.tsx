import { useState, useRef, useEffect } from "react";
import { Search, Mic, Camera, Filter, History, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

interface SearchSuggestion {
  text: string;
  type: 'recent' | 'trending' | 'category' | 'genre';
  icon?: React.ReactNode;
}

interface SmartSearchProps {
  onSearch: (query: string, filters?: Record<string, unknown>) => void;
  suggestions?: SearchSuggestion[];
  placeholder?: string;
}

export function SmartSearchSystem({ onSearch, suggestions = [], placeholder = "ابحث عن أفلام، مسلسلات، ممثلين..." }: SmartSearchProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isVoiceSearching, setIsVoiceSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // تحميل البحثات الأخيرة من localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recent-searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // حفظ البحث الجديد
  const saveSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recent-searches', JSON.stringify(updated));
  };

  // تنفيذ البحث
  const handleSearch = (searchQuery: string = query) => {
    if (!searchQuery.trim()) return;
    
    saveSearch(searchQuery);
    onSearch(searchQuery);
    setIsOpen(false);
    setQuery(searchQuery);
  };

  // البحث بالصوت (محاكاة)
  const handleVoiceSearch = () => {
    setIsVoiceSearching(true);
    
    // محاكاة البحث بالصوت
    setTimeout(() => {
      const voiceQuery = "فيلم أكشن عربي جديد";
      setQuery(voiceQuery);
      setIsVoiceSearching(false);
      handleSearch(voiceQuery);
    }, 2000);
  };

  // اقتراحات البحث الافتراضية
  const defaultSuggestions: SearchSuggestion[] = [
    { text: "أفلام عربية", type: "category", icon: "🎭" },
    { text: "مسلسلات تركية", type: "category", icon: "📺" },
    { text: "أكشن", type: "genre", icon: "💥" },
    { text: "كوميديا", type: "genre", icon: "😄" },
    { text: "أفلام 2024", type: "trending", icon: "🔥" },
  ];

  const allSuggestions = [...suggestions, ...defaultSuggestions];

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              type="text"
              placeholder={placeholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
              onFocus={() => setIsOpen(true)}
              className="pl-4 pr-12 h-12 text-lg bg-background/50 backdrop-blur-sm border-2 transition-all duration-300 focus:border-primary rounded-xl"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleVoiceSearch}
                disabled={isVoiceSearching}
                className="h-8 w-8 p-0 hover:bg-accent/50"
              >
                <Mic className={`h-4 w-4 ${isVoiceSearching ? 'text-red-500 animate-pulse' : 'text-muted-foreground'}`} />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 hover:bg-accent/50"
              >
                <Camera className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          </div>
        </PopoverTrigger>
        
        <PopoverContent className="w-full p-0 border-2 border-border/50 backdrop-blur-sm bg-background/95" align="start">
          <div className="p-4">
            {/* البحثات الأخيرة */}
            {recentSearches.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <History className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">البحثات الأخيرة</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setRecentSearches([]);
                      localStorage.removeItem('recent-searches');
                    }}
                    className="mr-auto h-6 px-2 text-xs"
                  >
                    مسح الكل
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer hover:bg-accent transition-colors"
                      onClick={() => handleSearch(search)}
                    >
                      {search}
                      <X
                        className="h-3 w-3 mr-1 hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          const updated = recentSearches.filter((_, i) => i !== index);
                          setRecentSearches(updated);
                          localStorage.setItem('recent-searches', JSON.stringify(updated));
                        }}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Separator className="mb-4" />

            {/* اقتراحات البحث */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">اقتراحات البحث</span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {allSuggestions.map((suggestion, index) => (
                  <Card
                    key={index}
                    className="cursor-pointer hover:bg-accent/50 transition-colors border-0 shadow-none"
                    onClick={() => handleSearch(suggestion.text)}
                  >
                    <CardContent className="p-3 flex items-center gap-3">
                      <span className="text-lg">{suggestion.icon}</span>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{suggestion.text}</span>
                        <span className="text-xs text-muted-foreground">
                          {suggestion.type === 'recent' && 'بحث أخير'}
                          {suggestion.type === 'trending' && 'ترندینگ'}
                          {suggestion.type === 'category' && 'فئة'}
                          {suggestion.type === 'genre' && 'نوع'}
                        </span>
                      </div>
                      <Badge variant="outline" className="mr-auto text-xs">
                        {suggestion.type === 'trending' && '🔥'}
                        {suggestion.type === 'category' && '📂'}
                        {suggestion.type === 'genre' && '🎬'}
                        {suggestion.type === 'recent' && '⏰'}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Separator className="mb-4" />

            {/* فلاتر متقدمة */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">استخدم الفلاتر المتقدمة للبحث الدقيق</span>
              <Button size="sm" variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                فلاتر متقدمة
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* حالة البحث بالصوت */}
      {isVoiceSearching && (
        <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-background/95 backdrop-blur-sm border rounded-lg shadow-lg">
          <div className="flex items-center gap-3">
            <div className="h-4 w-4 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm">جاري الاستماع... تحدث الآن</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsVoiceSearching(false)}
              className="mr-auto"
            >
              إلغاء
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}