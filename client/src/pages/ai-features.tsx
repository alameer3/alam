import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  Sparkles, 
  Search, 
  TrendingUp, 
  MessageSquare, 
  Target,
  Settings,
  BarChart3
} from "lucide-react";
import { RecommendationSection } from "@/components/ai/RecommendationSection";
import { SmartSearch } from "@/components/ai/SmartSearch";
import { SentimentAnalyzer } from "@/components/ai/SentimentAnalyzer";
import { AIPerformanceAnalyzer } from "@/components/ai/AIPerformanceAnalyzer";
import { useAuth } from "@/hooks/useAuth";
import { useUserPreferences } from "@/hooks/useAI";

export default function AIFeatures() {
  const { user } = useAuth();
  const { data: preferences } = useUserPreferences(user?.id);
  const [activeTab, setActiveTab] = useState("recommendations");

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <Brain className="h-16 w-16 mx-auto mb-6 text-purple-500" />
            <h1 className="text-4xl font-bold mb-4">ميزات الذكاء الاصطناعي</h1>
            <p className="text-xl text-muted-foreground mb-8">
              يرجى تسجيل الدخول للاستفادة من ميزات الذكاء الاصطناعي المتقدمة
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="h-8 w-8 text-purple-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              الذكاء الاصطناعي
            </h1>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              <Sparkles className="h-3 w-3 mr-1" />
              متقدم
            </Badge>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            استكشف عالم الذكاء الاصطناعي مع توصيات مخصصة، بحث ذكي، وتحليل المشاعر
          </p>
        </div>

        {/* User Preferences Overview */}
        {preferences && (
          <Card className="mb-8 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-500" />
                ملفك الشخصي الذكي
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-white/50 dark:bg-gray-900/50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 mb-1">
                    {preferences.insights.totalFavorites}
                  </div>
                  <div className="text-sm text-muted-foreground">المفضلة</div>
                </div>
                <div className="text-center p-4 bg-white/50 dark:bg-gray-900/50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {preferences.insights.totalWatched}
                  </div>
                  <div className="text-sm text-muted-foreground">المشاهدات</div>
                </div>
                <div className="text-center p-4 bg-white/50 dark:bg-gray-900/50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {preferences.insights.averageRating}
                  </div>
                  <div className="text-sm text-muted-foreground">متوسط التقييم</div>
                </div>
                <div className="text-center p-4 bg-white/50 dark:bg-gray-900/50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600 mb-1">
                    {preferences.insights.favoriteGenres.length}
                  </div>
                  <div className="text-sm text-muted-foreground">أنواع مفضلة</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* AI Features Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="recommendations" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              التوصيات الذكية
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              البحث الذكي
            </TabsTrigger>
            <TabsTrigger value="sentiment" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              تحليل المشاعر
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              تحليل الأداء
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recommendations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                  التوصيات المخصصة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RecommendationSection />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="search" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-blue-500" />
                  البحث الدلالي المتقدم
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SmartSearch />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sentiment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-green-500" />
                  تحليل المشاعر والنصوص
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SentimentAnalyzer />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-orange-500" />
                  مراقبة الأداء والإحصائيات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AIPerformanceAnalyzer />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Features Overview */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                <Target className="h-5 w-5" />
                توصيات ذكية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                احصل على توصيات مخصصة بناءً على تفضيلاتك وسجل المشاهدة
              </p>
              <ul className="text-sm space-y-2">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full" />
                  تحليل التفضيلات الشخصية
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full" />
                  توصيات متجددة ذكياً
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full" />
                  نقاط التطابق والأسباب
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                <Search className="h-5 w-5" />
                بحث دلالي
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                ابحث باستخدام اللغة الطبيعية واحصل على نتائج دقيقة
              </p>
              <ul className="text-sm space-y-2">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  فهم السياق والمعنى
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  بحث صوتي متقدم
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  نتائج مرتبة حسب الصلة
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
                <MessageSquare className="h-5 w-5" />
                تحليل المشاعر
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                حلل المشاعر في التعليقات والمراجعات بدقة عالية
              </p>
              <ul className="text-sm space-y-2">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  كشف المشاعر والعواطف
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  تقييم مستوى الثقة
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  استخراج الكلمات المفتاحية
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}