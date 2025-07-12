import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/layout/ui/skeleton";
import { 
  Sparkles, 
  Star, 
  Eye, 
  Calendar, 
  RefreshCw,
  TrendingUp,
  Brain,
  Target
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface RecommendationItem {
  id: number;
  title: string;
  type: string;
  rating: number;
  year: number;
  poster?: string;
  description?: string;
  recommendationScore: number;
  recommendationReasons: string[];
}

interface RecommendationResponse {
  recommendations: RecommendationItem[];
  userId: number;
  generatedAt: string;
}

export function RecommendationSection() {
  const { user } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: recommendations, isLoading, refetch } = useQuery<RecommendationResponse>({
    queryKey: [`/api/ai/recommendations/${user?.id}`],
    enabled: !!user?.id,
    refetchInterval: 30 * 60 * 1000, // Refresh every 30 minutes
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      toast({
        title: "تم تحديث التوصيات",
        description: "تم إنشاء توصيات جديدة مخصصة لك",
      });
    } catch (error) {
      toast({
        title: "خطأ في التحديث",
        description: "حدث خطأ أثناء تحديث التوصيات",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
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

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (!user) {
    return (
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
        <CardContent className="p-8 text-center">
          <Brain className="h-12 w-12 mx-auto mb-4 text-purple-500" />
          <h3 className="text-xl font-semibold mb-2">توصيات ذكية مخصصة</h3>
          <p className="text-muted-foreground mb-4">
            سجل الدخول للحصول على توصيات مخصصة بناءً على تفضيلاتك
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-500" />
            <h2 className="text-2xl font-bold">توصيات ذكية مخصصة</h2>
          </div>
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            <Brain className="h-3 w-3 mr-1" />
            مدعوم بالذكاء الاصطناعي
          </Badge>
        </div>
        
        <Button 
          onClick={handleRefresh}
          disabled={isRefreshing || isLoading}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          تحديث التوصيات
        </Button>
      </div>

      {/* Loading State */}
      {isLoading && (
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

      {/* Recommendations */}
      {recommendations && recommendations.recommendations.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              تم إنشاء {recommendations.recommendations.length} توصية مخصصة لك
            </p>
            <p className="text-xs text-muted-foreground">
              آخر تحديث: {new Date(recommendations.generatedAt).toLocaleString('ar-SA')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.recommendations.map((item) => (
              <Card key={item.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
                  {item.poster ? (
                    <img 
                      src={item.poster} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                      {getTypeIcon(item.type)}
                    </div>
                  )}
                  
                  {/* Recommendation Score */}
                  <div className="absolute top-2 right-2">
                    <Badge className={`${getScoreColor(item.recommendationScore)} text-white`}>
                      <Target className="h-3 w-3 mr-1" />
                      {Math.round(item.recommendationScore)}%
                    </Badge>
                  </div>
                  
                  {/* Type Badge */}
                  <div className="absolute bottom-2 left-2">
                    <Badge variant="secondary" className="bg-black/50 text-white">
                      {getTypeLabel(item.type)}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg line-clamp-1">{item.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{item.year}</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{item.rating}</span>
                      </div>
                    </div>
                  </div>
                  
                  {item.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {item.description}
                    </p>
                  )}
                  
                  {/* Recommendation Reasons */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-3 w-3 text-green-500" />
                      <span className="text-xs font-medium text-green-600">أسباب التوصية:</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {item.recommendationReasons.slice(0, 2).map((reason, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {reason}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    size="sm"
                    onClick={() => {
                      // Navigate to content detail
                      window.location.href = `/content/${item.id}`;
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    مشاهدة
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* No Recommendations */}
      {recommendations && recommendations.recommendations.length === 0 && (
        <Card className="p-8 text-center">
          <Sparkles className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">لا توجد توصيات متاحة</h3>
          <p className="text-muted-foreground mb-4">
            تفاعل مع المحتوى أكثر للحصول على توصيات مخصصة
          </p>
          <Button onClick={handleRefresh} variant="outline">
            إنشاء توصيات جديدة
          </Button>
        </Card>
      )}
    </div>
  );
}