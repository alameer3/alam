import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/layout/ui/card";
import { Badge } from "@/components/layout/ui/badge";
import { Button } from "@/components/layout/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/layout/ui/tabs";
import { 
  Settings, 
  Users, 
  FileText, 
  BarChart3, 
  Shield, 
  Upload,
  Film,
  Tv,
  Monitor,
  PlayCircle,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Eye,
  MessageSquare,
  Star,
  Calendar,
  Activity
} from "lucide-react";
import AdvancedContentManager from "@/components/admin/advanced-content-manager";
import CategoryGenreManager from "@/components/admin/category-genre-manager";
import FileUploadManager from "@/components/admin/file-upload-manager";
import ContentApprovalSystem from "@/components/admin/content-approval-system";
import { PerformanceDashboard } from "@/components/admin/PerformanceDashboard";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch dashboard statistics
  const { data: stats } = useQuery({
    queryKey: ['/api/admin/stats'],
    queryFn: async () => {
      // محاكاة البيانات الإحصائية
      return {
        totalContent: 1245,
        totalUsers: 8932,
        pendingApproval: 23,
        totalViews: 2847392,
        contentByType: {
          movies: 456,
          series: 234,
          tv: 123,
          misc: 89
        },
        recentActivity: [
          {
            id: 1,
            type: 'content_added',
            title: 'تم إضافة فيلم جديد',
            description: 'The Batman (2022)',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            user: 'أحمد محمد'
          },
          {
            id: 2,
            type: 'content_approved',
            title: 'تم الموافقة على محتوى',
            description: 'مسلسل قيامة أرطغرل',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
            user: 'سارة أحمد'
          },
          {
            id: 3,
            type: 'user_registered',
            title: 'مستخدم جديد',
            description: 'تسجيل مستخدم جديد',
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
            user: 'محمد علي'
          }
        ],
        monthlyViews: [
          { month: 'يناير', views: 245000 },
          { month: 'فبراير', views: 298000 },
          { month: 'مارس', views: 332000 },
          { month: 'أبريل', views: 287000 },
          { month: 'مايو', views: 354000 },
          { month: 'يونيو', views: 398000 }
        ]
      };
    }
  });

  const StatCard = ({ title, value, icon: Icon, change, changeType }: {
    title: string;
    value: string | number;
    icon: any;
    change?: string;
    changeType?: 'positive' | 'negative' | 'neutral';
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value.toLocaleString()}</p>
            {change && (
              <div className={`flex items-center gap-1 text-sm ${
                changeType === 'positive' ? 'text-green-600' : 
                changeType === 'negative' ? 'text-red-600' : 'text-muted-foreground'
              }`}>
                <TrendingUp className="w-3 h-3" />
                <span>{change}</span>
              </div>
            )}
          </div>
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Icon className="w-6 h-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">لوحة التحكم الإدارية</h1>
          <p className="text-muted-foreground">
            إدارة شاملة لمنصة 𝐘𝐄𝐌𝐄𝐍 🇾🇪 𝐅𝐋𝐈𝐗
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-50 text-green-800">
            <Activity className="w-3 h-3 mr-1" />
            النظام يعمل بشكل طبيعي
          </Badge>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            نظرة عامة
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            إدارة المحتوى
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            الفئات والأنواع
          </TabsTrigger>
          <TabsTrigger value="approval" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            الموافقة على المحتوى
          </TabsTrigger>
          <TabsTrigger value="files" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            رفع الملفات
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            الأداء والأمان
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="إجمالي المحتوى"
              value={stats?.totalContent || 0}
              icon={FileText}
              change="+12% من الشهر الماضي"
              changeType="positive"
            />
            <StatCard
              title="إجمالي المستخدمين"
              value={stats?.totalUsers || 0}
              icon={Users}
              change="+8% من الشهر الماضي"
              changeType="positive"
            />
            <StatCard
              title="في انتظار الموافقة"
              value={stats?.pendingApproval || 0}
              icon={Clock}
              change="يتطلب مراجعة"
              changeType="neutral"
            />
            <StatCard
              title="إجمالي المشاهدات"
              value={stats?.totalViews || 0}
              icon={Eye}
              change="+15% من الشهر الماضي"
              changeType="positive"
            />
          </div>

          {/* Content Distribution */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  توزيع المحتوى
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Film className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">أفلام</span>
                  </div>
                  <span className="font-semibold">{stats?.contentByType.movies || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PlayCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">مسلسلات</span>
                  </div>
                  <span className="font-semibold">{stats?.contentByType.series || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tv className="w-4 h-4 text-purple-500" />
                    <span className="text-sm">تلفزيون</span>
                  </div>
                  <span className="font-semibold">{stats?.contentByType.tv || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-orange-500" />
                    <span className="text-sm">منوعات</span>
                  </div>
                  <span className="font-semibold">{stats?.contentByType.misc || 0}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  النشاطات الأخيرة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {stats?.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.timestamp.toLocaleString('ar-EG')}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  إحصائيات المشاهدة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {stats?.monthlyViews.slice(-3).map((month) => (
                  <div key={month.month} className="flex items-center justify-between">
                    <span className="text-sm">{month.month}</span>
                    <span className="font-semibold">{month.views.toLocaleString()}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>الإجراءات السريعة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={() => setActiveTab("content")}
                  className="flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  إضافة محتوى جديد
                </Button>
                <Button
                  onClick={() => setActiveTab("approval")}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Shield className="w-4 h-4" />
                  مراجعة المحتوى ({stats?.pendingApproval || 0})
                </Button>
                <Button
                  onClick={() => setActiveTab("categories")}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  إدارة الفئات
                </Button>
                <Button
                  onClick={() => setActiveTab("files")}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  رفع الملفات
                </Button>
                <Button
                  onClick={() => setActiveTab("performance")}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Activity className="w-4 h-4" />
                  الأداء والأمان
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Management Tab */}
        <TabsContent value="content">
          <AdvancedContentManager />
        </TabsContent>

        {/* Categories & Genres Tab */}
        <TabsContent value="categories">
          <CategoryGenreManager />
        </TabsContent>

        {/* Content Approval Tab */}
        <TabsContent value="approval">
          <ContentApprovalSystem />
        </TabsContent>

        {/* File Upload Tab */}
        <TabsContent value="files">
          <FileUploadManager />
        </TabsContent>

        {/* Performance & Security Tab */}
        <TabsContent value="performance">
          <PerformanceDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}