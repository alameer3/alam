import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QuickStats } from "@/components/dashboard/quick-stats";
import { EnhancedContentCard } from "@/components/content/enhanced-content-card";
import { Link } from "wouter";
import { 
  Plus, 
  TrendingUp, 
  Clock, 
  Heart, 
  Star, 
  Play,
  BookOpen,
  Film,
  Tv,
  Calendar,
  Settings,
  Bell,
  User
} from "lucide-react";
import type { Content } from "@shared/schema";

interface RecentActivity {
  id: number;
  type: 'watched' | 'favorited' | 'reviewed' | 'commented';
  content: Content;
  timestamp: string;
  description: string;
}

interface Recommendation {
  id: number;
  content: Content;
  reason: string;
  confidence: number;
}

export default function Dashboard() {
  const [selectedTab, setSelectedTab] = useState("overview");
  const currentUserId = 1;

  const { data: recentActivity = [], isLoading: activityLoading } = useQuery<RecentActivity[]>({
    queryKey: [`/api/users/${currentUserId}/recent-activity`],
  });

  const { data: recommendations = [], isLoading: recommendationsLoading } = useQuery<Recommendation[]>({
    queryKey: [`/api/users/${currentUserId}/recommendations`],
  });

  const { data: continueWatching = [], isLoading: continueLoading } = useQuery<Content[]>({
    queryKey: [`/api/users/${currentUserId}/continue-watching`],
  });

  const { data: newReleases = [], isLoading: newReleasesLoading } = useQuery<Content[]>({
    queryKey: ['/api/content/new-releases'],
  });

  // Mock data for demonstration
  const mockRecentActivity: RecentActivity[] = [
    {
      id: 1,
      type: 'watched',
      content: { id: 1, title: 'The Dark Knight', type: 'movie', posterUrl: '/placeholder-poster.jpg' } as Content,
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      description: 'شاهدت 45 دقيقة'
    },
    {
      id: 2,
      type: 'favorited',
      content: { id: 2, title: 'Breaking Bad', type: 'series', posterUrl: '/placeholder-poster.jpg' } as Content,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      description: 'أضيف إلى المفضلة'
    },
    {
      id: 3,
      type: 'reviewed',
      content: { id: 3, title: 'Inception', type: 'movie', posterUrl: '/placeholder-poster.jpg' } as Content,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      description: 'قيمت بـ 5 نجوم'
    }
  ];

  const mockRecommendations: Recommendation[] = [
    {
      id: 1,
      content: { id: 4, title: 'Interstellar', type: 'movie', posterUrl: '/placeholder-poster.jpg' } as Content,
      reason: 'بناءً على إعجابك بأفلام الخيال العلمي',
      confidence: 95
    },
    {
      id: 2,
      content: { id: 5, title: 'Better Call Saul', type: 'series', posterUrl: '/placeholder-poster.jpg' } as Content,
      reason: 'مرتبط بـ Breaking Bad',
      confidence: 90
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'watched': return Play;
      case 'favorited': return Heart;
      case 'reviewed': return Star;
      case 'commented': return BookOpen;
      default: return Clock;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'watched': return 'text-blue-500';
      case 'favorited': return 'text-red-500';
      case 'reviewed': return 'text-yellow-500';
      case 'commented': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const quickActions = [
    {
      icon: Film,
      label: "تصفح الأفلام",
      href: "/movies",
      description: "اكتشف أحدث الأفلام",
      color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
    },
    {
      icon: Tv,
      label: "تصفح المسلسلات",
      href: "/series",
      description: "شاهد أفضل المسلسلات",
      color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
    },
    {
      icon: Heart,
      label: "قوائم المشاهدة",
      href: "/watchlists",
      description: "إدارة قوائمك المخصصة",
      color: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
    },
    {
      icon: Bell,
      label: "الإشعارات",
      href: "/notifications",
      description: "تحقق من آخر التحديثات",
      color: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              لوحة التحكم
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mt-2">
              مرحباً بك مرة أخرى! إليك ملخص نشاطك
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/profile">
              <Button variant="outline" className="gap-2">
                <User className="h-4 w-4" />
                الملف الشخصي
              </Button>
            </Link>
            <Link href="/notifications">
              <Button className="gap-2">
                <Bell className="h-4 w-4" />
                الإشعارات
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle>إجراءات سريعة</CardTitle>
            <CardDescription>الوصول السريع للمزايا الأساسية</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action) => {
                const IconComponent = action.icon;
                return (
                  <Link key={action.href} href={action.href}>
                    <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105">
                      <CardContent className="flex flex-col items-center text-center p-4 space-y-3">
                        <div className={`p-3 rounded-lg ${action.color}`}>
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm">{action.label}</h3>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                            {action.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <TabsTrigger value="overview" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              نظرة عامة
            </TabsTrigger>
            <TabsTrigger value="activity" className="gap-2">
              <Clock className="h-4 w-4" />
              النشاط الأخير
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="gap-2">
              <Star className="h-4 w-4" />
              التوصيات
            </TabsTrigger>
            <TabsTrigger value="continue" className="gap-2">
              <Play className="h-4 w-4" />
              متابعة المشاهدة
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <QuickStats />
          </TabsContent>

          <TabsContent value="activity">
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle>النشاط الأخير</CardTitle>
                <CardDescription>آخر أنشطتك على المنصة</CardDescription>
              </CardHeader>
              <CardContent>
                {mockRecentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {mockRecentActivity.map((activity) => {
                      const IconComponent = getActivityIcon(activity.type);
                      const iconColor = getActivityColor(activity.type);
                      
                      return (
                        <div key={activity.id} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                          <div className={`p-2 rounded-lg bg-slate-100 dark:bg-slate-600`}>
                            <IconComponent className={`h-5 w-5 ${iconColor}`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-slate-900 dark:text-white">
                                {activity.content.title}
                              </h4>
                              <span className="text-xs bg-slate-200 dark:bg-slate-600 px-2 py-1 rounded">
                                {activity.content.type}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-300">
                              {activity.description}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              {new Date(activity.timestamp).toLocaleString('ar-EG', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          <Link href={`/content/${activity.content.id}`}>
                            <Button variant="outline" size="sm">
                              عرض
                            </Button>
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Clock className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-300">
                      لا يوجد نشاط حديث
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400">
                      ابدأ بمشاهدة المحتوى ليظهر نشاطك هنا
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations">
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle>توصيات مخصصة لك</CardTitle>
                <CardDescription>محتوى مقترح بناءً على تفضيلاتك</CardDescription>
              </CardHeader>
              <CardContent>
                {mockRecommendations.length > 0 ? (
                  <div className="space-y-6">
                    {mockRecommendations.map((rec) => (
                      <div key={rec.id} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <img
                          src={rec.content.posterUrl || "/placeholder-poster.jpg"}
                          alt={rec.content.title}
                          className="w-16 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900 dark:text-white">
                            {rec.content.title}
                          </h4>
                          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                            {rec.reason}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                              {rec.confidence}% توافق
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/content/${rec.content.id}`}>
                            <Button variant="outline" size="sm">
                              عرض
                            </Button>
                          </Link>
                          <Button size="sm">
                            شاهد الآن
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    <div className="text-center">
                      <Button variant="outline" className="gap-2">
                        <TrendingUp className="h-4 w-4" />
                        عرض المزيد من التوصيات
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Star className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-300">
                      لا توجد توصيات حالياً
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400">
                      تفاعل مع المحتوى أكثر للحصول على توصيات مخصصة
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="continue">
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle>متابعة المشاهدة</CardTitle>
                <CardDescription>أكمل ما بدأت مشاهدته</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Play className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-300">
                    لا يوجد محتوى لمتابعة المشاهدة
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-4">
                    ابدأ بمشاهدة شيء جديد
                  </p>
                  <Link href="/movies">
                    <Button className="gap-2">
                      <Film className="h-4 w-4" />
                      تصفح الأفلام
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}