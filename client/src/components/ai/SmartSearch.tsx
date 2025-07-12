import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/layout/ui/skeleton";
import { 
  Search, 
  Brain, 
  Sparkles, 
  Star, 
  Calendar, 
  Eye,
  Loader2,
  Filter,
  Mic
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";

interface SearchResult {
  id: number;
  title: string;
  type: string;
  rating: number;
  year: number;
  poster?: string;
  description?: string;
}

interface SmartSearchResponse {
  query: string;
  type?: string;
  results: SearchResult[];
  totalFound: number;
  searchedAt: string;
}

export function SmartSearch() {
  const [query, setQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [isListening, setIsListening] = useState(false);

  const searchMutation = useMutation({
    mutationFn: async (searchData: { query: string; type?: string; limit?: number }) => {
      return await apiRequest<SmartSearchResponse>("/api/ai/search", {
        method: "POST",
        body: JSON.stringify(searchData),
      });
    },
    onSuccess: (data) => {
      toast({
        title: "تم البحث بنجاح",
        description: `تم العثور على ${data.totalFound} نتيجة`,
      });
    },
    onError: (error) => {
      toast({
        title: "خطأ في البحث",
        description: "حدث خطأ أثناء البحث الذكي",
        variant: "destructive",
      });
    },
  });

  const handleSearch = () => {
    if (!query.trim()) {
      toast({
        title: "أدخل كلمة البحث",
        description: "يجب إدخال كلمة أو عبارة للبحث",
        variant: "destructive",
      });
      return;
    }

    searchMutation.mutate({
      query: query.trim(),
      type: selectedType || undefined,
      limit: 12,
    });
  };

  const handleVoiceSearch = async () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "البحث الصوتي غير مدعوم",
        description: "المتصفح لا يدعم البحث الصوتي",
        variant: "destructive",
      });
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'ar-SA';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      toast({
        title: "يتم الاستماع...",
        description: "تحدث الآن لبدء البحث",
      });
    };

    recognition.onresult = (event) => {
      const voiceQuery = event.results[0][0].transcript;
      setQuery(voiceQuery);
      setIsListening(false);
      
      // Auto-search after voice input
      searchMutation.mutate({
        query: voiceQuery,
        type: selectedType || undefined,
        limit: 12,
      });
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      toast({
        title: "خطأ في البحث الصوتي",
        description: "حدث خطأ أثناء الاستماع للصوت",
        variant: "destructive",
      });
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'movie': return '🎬';
      case 'series': return '📺';
      case 'tv': return '📻';
      default: return '🎭';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'movie': return 'فيلم';
      case 'series': return 'مسلسل';
      case 'tv': return 'تلفزيون';
      default: return 'منوعات';
    }
  };

  const contentTypes = [
    { value: "", label: "جميع الأنواع" },
    { value: "movie", label: "أفلام" },
    { value: "series", label: "مسلسلات" },
    { value: "tv", label: "تلفزيون" },
    { value: "misc", label: "منوعات" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-blue-500" />
          <h2 className="text-2xl font-bold">البحث الذكي</h2>
        </div>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <Sparkles className="h-3 w-3 mr-1" />
          بحث دلالي متقدم
        </Badge>
      </div>

      {/* Search Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            البحث الذكي في المحتوى
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="ابحث عن فيلم، مسلسل، أو أي محتوى... (مثل: أفلام الأكشن المثيرة)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="text-right"
              />
            </div>
            <Button
              onClick={handleVoiceSearch}
              disabled={isListening}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Mic className={`h-4 w-4 ${isListening ? 'text-red-500' : ''}`} />
              {isListening ? 'يستمع...' : 'صوتي'}
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {contentTypes.map((type) => (
              <Button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                variant={selectedType === type.value ? "default" : "outline"}
                size="sm"
                className="flex items-center gap-1"
              >
                <Filter className="h-3 w-3" />
                {type.label}
              </Button>
            ))}
          </div>

          <Button
            onClick={handleSearch}
            disabled={searchMutation.isPending || !query.trim()}
            className="w-full"
          >
            {searchMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                يبحث...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                بحث ذكي
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Loading State */}
      {searchMutation.isPending && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-video bg-gray-100 dark:bg-gray-800">
                <Skeleton className="w-full h-full" />
              </div>
              <CardContent className="p-4">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2 mb-2" />
                <Skeleton className="h-3 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Search Results */}
      {searchMutation.data && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              نتائج البحث عن: "{searchMutation.data.query}"
            </h3>
            <Badge variant="outline">
              {searchMutation.data.totalFound} نتيجة
            </Badge>
          </div>

          {searchMutation.data.results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchMutation.data.results.map((result) => (
                <Card key={result.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300">
                  <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
                    {result.poster ? (
                      <img 
                        src={result.poster} 
                        alt={result.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">
                        {getTypeIcon(result.type)}
                      </div>
                    )}
                    
                    {/* Type Badge */}
                    <div className="absolute bottom-2 left-2">
                      <Badge variant="secondary" className="bg-black/50 text-white">
                        {getTypeLabel(result.type)}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg line-clamp-1">{result.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{result.year}</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>{result.rating}</span>
                        </div>
                      </div>
                    </div>
                    
                    {result.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {result.description}
                      </p>
                    )}
                    
                    <Button 
                      className="w-full" 
                      size="sm"
                      onClick={() => {
                        // Navigate to content detail
                        window.location.href = `/content/${result.id}`;
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      مشاهدة
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <Search className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">لا توجد نتائج</h3>
              <p className="text-muted-foreground">
                لم يتم العثور على نتائج لبحثك. جرب كلمات أخرى أو اختر نوع محتوى مختلف.
              </p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}