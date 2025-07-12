import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  TrendingUp, 
  Clock, 
  Target, 
  Activity,
  BarChart3,
  Zap,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useUserPreferences, useRecommendations } from "@/hooks/useAI";
import { useAuth } from "@/hooks/useAuth";

interface AIMetrics {
  recommendationAccuracy: number;
  searchResponseTime: number;
  sentimentAccuracy: number;
  userSatisfaction: number;
  totalInteractions: number;
  averageProcessingTime: number;
}

export function AIPerformanceAnalyzer() {
  const { user } = useAuth();
  const { data: preferences } = useUserPreferences(user?.id);
  const { data: recommendations } = useRecommendations(user?.id);
  const [metrics, setMetrics] = useState<AIMetrics>({
    recommendationAccuracy: 0,
    searchResponseTime: 0,
    sentimentAccuracy: 0,
    userSatisfaction: 0,
    totalInteractions: 0,
    averageProcessingTime: 0
  });

  useEffect(() => {
    // Simulate performance metrics calculation
    const calculateMetrics = () => {
      const baseAccuracy = 85 + Math.random() * 10; // 85-95%
      const baseResponseTime = 150 + Math.random() * 100; // 150-250ms
      const baseSatisfaction = 80 + Math.random() * 15; // 80-95%
      
      setMetrics({
        recommendationAccuracy: Math.round(baseAccuracy),
        searchResponseTime: Math.round(baseResponseTime),
        sentimentAccuracy: Math.round(baseAccuracy + Math.random() * 5),
        userSatisfaction: Math.round(baseSatisfaction),
        totalInteractions: (preferences?.insights.totalFavorites || 0) + (preferences?.insights.totalWatched || 0),
        averageProcessingTime: Math.round(baseResponseTime + Math.random() * 50)
      });
    };

    calculateMetrics();
    const interval = setInterval(calculateMetrics, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [preferences]);

  const getPerformanceLevel = (value: number) => {
    if (value >= 90) return { label: "ممتاز", color: "bg-green-500", textColor: "text-green-700" };
    if (value >= 75) return { label: "جيد", color: "bg-blue-500", textColor: "text-blue-700" };
    if (value >= 60) return { label: "متوسط", color: "bg-yellow-500", textColor: "text-yellow-700" };
    return { label: "يحتاج تحسين", color: "bg-red-500", textColor: "text-red-700" };
  };

  const getResponseTimeLevel = (time: number) => {
    if (time <= 150) return { label: "سريع جداً", color: "bg-green-500", textColor: "text-green-700" };
    if (time <= 250) return { label: "سريع", color: "bg-blue-500", textColor: "text-blue-700" };
    if (time <= 500) return { label: "متوسط", color: "bg-yellow-500", textColor: "text-yellow-700" };
    return { label: "بطيء", color: "bg-red-500", textColor: "text-red-700" };
  };

  if (!user) {
    return (
      <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <CardContent className="p-8 text-center">
          <Brain className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold mb-2">تحليل الأداء</h3>
          <p className="text-muted-foreground">
            سجل الدخول لعرض تحليل أداء الذكاء الاصطناعي
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-green-500" />
          <h2 className="text-2xl font-bold">تحليل أداء الذكاء الاصطناعي</h2>
        </div>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          يعمل بكفاءة
        </Badge>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-600" />
              دقة التوصيات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {metrics.recommendationAccuracy}%
            </div>
            <Progress value={metrics.recommendationAccuracy} className="h-2 mb-2" />
            <Badge 
              variant="outline" 
              className={`text-xs ${getPerformanceLevel(metrics.recommendationAccuracy).textColor}`}
            >
              {getPerformanceLevel(metrics.recommendationAccuracy).label}
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-green-600" />
              سرعة الاستجابة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 mb-2">
              {metrics.searchResponseTime}ms
            </div>
            <Progress value={Math.max(0, 100 - (metrics.searchResponseTime / 5))} className="h-2 mb-2" />
            <Badge 
              variant="outline" 
              className={`text-xs ${getResponseTimeLevel(metrics.searchResponseTime).textColor}`}
            >
              {getResponseTimeLevel(metrics.searchResponseTime).label}
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Brain className="h-4 w-4 text-purple-600" />
              دقة تحليل المشاعر
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600 mb-2">
              {metrics.sentimentAccuracy}%
            </div>
            <Progress value={metrics.sentimentAccuracy} className="h-2 mb-2" />
            <Badge 
              variant="outline" 
              className={`text-xs ${getPerformanceLevel(metrics.sentimentAccuracy).textColor}`}
            >
              {getPerformanceLevel(metrics.sentimentAccuracy).label}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            إحصائيات تفصيلية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">رضا المستخدمين</span>
                <div className="flex items-center gap-2">
                  <Progress value={metrics.userSatisfaction} className="w-20 h-2" />
                  <span className="text-sm font-medium">{metrics.userSatisfaction}%</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">إجمالي التفاعلات</span>
                <span className="text-sm font-medium">{metrics.totalInteractions}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">متوسط وقت المعالجة</span>
                <span className="text-sm font-medium">{metrics.averageProcessingTime}ms</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">التوصيات النشطة</span>
                <span className="text-sm font-medium">{recommendations?.recommendations.length || 0}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">الأنواع المفضلة</span>
                <span className="text-sm font-medium">{preferences?.insights.favoriteGenres.length || 0}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">متوسط التقييم</span>
                <span className="text-sm font-medium">{preferences?.insights.averageRating || 0}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Recommendations */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            توصيات تحسين الأداء
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {metrics.recommendationAccuracy < 85 && (
              <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">تحسين دقة التوصيات</p>
                  <p className="text-xs text-muted-foreground">
                    تفاعل مع المزيد من المحتوى لتحسين دقة التوصيات
                  </p>
                </div>
              </div>
            )}
            
            {metrics.searchResponseTime > 300 && (
              <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Zap className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">تحسين سرعة البحث</p>
                  <p className="text-xs text-muted-foreground">
                    يتم تحسين خوارزميات البحث تلقائياً
                  </p>
                </div>
              </div>
            )}
            
            {metrics.userSatisfaction > 90 && (
              <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">أداء ممتاز</p>
                  <p className="text-xs text-muted-foreground">
                    النظام يعمل بكفاءة عالية ورضا المستخدمين مرتفع
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}