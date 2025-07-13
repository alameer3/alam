import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Play, 
  Heart, 
  Eye,
  Calendar,
  Clock,
  Star,
  MessageCircle
} from "lucide-react";

interface UserStats {
  favorites: number;
  watchHistory: number;
  comments: number;
  reviews: number;
  totalWatchTime: number;
  weeklyWatchTime: number;
  monthlyTarget: number;
}

interface PlatformStats {
  totalUsers: number;
  activeToday: number;
  totalContent: number;
  newThisWeek: number;
  totalViews: number;
  averageRating: number;
}

export function QuickStats() {
  const currentUserId = 1;

  const { data: userStats, isLoading: userLoading } = useQuery<UserStats>({
    queryKey: [`/api/users/${currentUserId}/detailed-stats`],
  });

  const { data: platformStats, isLoading: platformLoading } = useQuery<PlatformStats>({
    queryKey: ['/api/platform/stats'],
  });

  // Use real data from API, fallback to defaults if not available
  const actualUserStats = userStats || {
    favorites: 0,
    watchHistory: 0,
    comments: 0,
    reviews: 0,
    totalWatchTime: 0,
    weeklyWatchTime: 0,
    monthlyTarget: 2000
  };

  const actualPlatformStats = platformStats || {
    totalUsers: 0,
    activeToday: 0,
    totalContent: 0,
    newThisWeek: 0,
    totalViews: 0,
    averageRating: 0
  };

  const watchTimeProgress = (actualUserStats.totalWatchTime / actualUserStats.monthlyTarget) * 100;
  const weeklyProgress = (actualUserStats.weeklyWatchTime / (actualUserStats.monthlyTarget / 4)) * 100;

  if (userLoading || platformLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-32 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Personal Stats */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          إحصائياتك الشخصية
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
                المفضلة
              </CardTitle>
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {actualUserStats.favorites}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-blue-600 dark:text-blue-400">
                +2 هذا الأسبوع
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
                المشاهدات
              </CardTitle>
              <div className="flex items-center gap-2">
                <Play className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {actualUserStats.watchHistory}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-green-600 dark:text-green-400">
                +5 هذا الأسبوع
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
                التعليقات
              </CardTitle>
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <span className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {actualUserStats.comments}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-purple-600 dark:text-purple-400">
                +1 هذا الأسبوع
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">
                المراجعات
              </CardTitle>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                <span className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                  {actualUserStats.reviews}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-orange-600 dark:text-orange-400">
                جديد هذا الشهر
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Watch Time Progress */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          تقدم المشاهدة
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                الهدف الشهري
              </CardTitle>
              <CardDescription>
                {Math.floor(actualUserStats.totalWatchTime / 60)} ساعة من {Math.floor(actualUserStats.monthlyTarget / 60)} ساعة
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={watchTimeProgress} className="h-2 mb-2" />
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {watchTimeProgress.toFixed(1)}% مكتمل
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-500" />
                هذا الأسبوع
              </CardTitle>
              <CardDescription>
                {Math.floor(actualUserStats.weeklyWatchTime / 60)} ساعة و {actualUserStats.weeklyWatchTime % 60} دقيقة
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={weeklyProgress} className="h-2 mb-2" />
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {weeklyProgress.toFixed(1)}% من الهدف الأسبوعي
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Platform Stats */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          إحصائيات المنصة
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="text-center">
            <CardHeader className="pb-2">
              <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-2">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-lg">
                {actualPlatformStats.totalUsers.toLocaleString()}
              </CardTitle>
              <CardDescription>إجمالي المستخدمين</CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader className="pb-2">
              <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-2">
                <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-lg">
                {actualPlatformStats.activeToday.toLocaleString()}
              </CardTitle>
              <CardDescription>نشط اليوم</CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader className="pb-2">
              <div className="mx-auto w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-2">
                <Play className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle className="text-lg">
                {actualPlatformStats.totalContent.toLocaleString()}
              </CardTitle>
              <CardDescription>إجمالي المحتوى</CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader className="pb-2">
              <div className="mx-auto w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mb-2">
                <Eye className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <CardTitle className="text-lg">
                {(actualPlatformStats.totalViews / 1000).toFixed(1)}K
              </CardTitle>
              <CardDescription>إجمالي المشاهدات</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Activity Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            ملخص النشاط
          </CardTitle>
          <CardDescription>أداؤك مقارنة بالأسبوع الماضي</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">+15%</div>
              <p className="text-sm text-slate-600 dark:text-slate-400">وقت المشاهدة</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">+23%</div>
              <p className="text-sm text-slate-600 dark:text-slate-400">التفاعل</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">+8%</div>
              <p className="text-sm text-slate-600 dark:text-slate-400">المحتوى المكتشف</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">+12%</div>
              <p className="text-sm text-slate-600 dark:text-slate-400">التقييمات</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}