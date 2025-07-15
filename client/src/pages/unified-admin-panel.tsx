import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { 
  Users, Film, TrendingUp, Eye, Star, MessageSquare, Heart, Download,
  Plus, Edit, Trash2, Search, Filter, Grid, List, Calendar, Clock, LogOut, 
  Shield, Lock, Settings, AlertTriangle, Activity, Monitor, Database,
  UserCheck, FileText, BarChart3, Cog, Server
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import AdminGuard from '@/components/admin/admin-guard';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import AdvancedContentManager from '@/components/admin/advanced-content-manager';
import UserManagement from '@/components/admin/user-management';
import SettingsManagement from '@/components/admin/settings-management';
import SecurityDashboard from '@/components/security/security-dashboard';
import PasswordStrengthChecker from '@/components/security/password-strength-checker';
import { PerformanceDashboard } from '@/components/admin/PerformanceDashboard';
import AdvancedAnalyticsDashboard from '@/components/analytics/advanced-analytics-dashboard';
import SubscriptionManagement from '@/components/subscription/subscription-management';

// Mock data for admin dashboard
const statsData = [
  { name: 'أفلام', value: 245, color: '#8884d8' },
  { name: 'مسلسلات', value: 89, color: '#82ca9d' },
  { name: 'برامج تلفزيونية', value: 156, color: '#ffc658' },
  { name: 'متنوعة', value: 67, color: '#ff7c7c' }
];

const viewsData = [
  { month: 'يناير', views: 4000, users: 2400 },
  { month: 'فبراير', views: 3000, users: 1398 },
  { month: 'مارس', views: 2000, users: 9800 },
  { month: 'أبريل', views: 2780, users: 3908 },
  { month: 'مايو', views: 1890, users: 4800 },
  { month: 'يونيو', views: 2390, users: 3800 }
];

const topContent = [
  { id: 1, title: 'فيلم الحركة الجديد', views: 15420, rating: 4.8, type: 'فيلم' },
  { id: 2, title: 'المسلسل الدرامي', views: 12350, rating: 4.6, type: 'مسلسل' },
  { id: 3, title: 'البرنامج الكوميدي', views: 9870, rating: 4.4, type: 'برنامج' },
  { id: 4, title: 'الوثائقي الجديد', views: 8420, rating: 4.7, type: 'وثائقي' }
];

function UnifiedAdminPanelContent() {
  const [, setLocation] = useLocation();
  const [selectedView, setSelectedView] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { logout } = useAdminAuth();
  const { toast } = useToast();

  const { data: stats } = useQuery({
    queryKey: ['/api/admin/stats'],
    queryFn: () => ({
      totalContent: 557,
      totalUsers: 12480,
      totalViews: 89340,
      totalRatings: 4567,
      avgRating: 4.3,
      newUsersThisMonth: 234,
      popularContent: topContent
    })
  });

  const StatCard = ({ title, value, icon: Icon, description, trend }: any) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend && (
          <div className="flex items-center text-xs text-green-600 mt-1">
            <TrendingUp className="h-3 w-3 mr-1" />
            {trend}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const handleLogout = () => {
    logout();
    setLocation('/');
  };

  const securityFeatures = [
    {
      icon: Shield,
      title: 'حماية متقدمة',
      description: 'نظام حماية شامل ضد التهديدات الأمنية المختلفة',
      status: 'active'
    },
    {
      icon: Lock,
      title: 'تشفير البيانات',
      description: 'تشفير جميع البيانات الحساسة باستخدام أحدث معايير التشفير',
      status: 'active'
    },
    {
      icon: Eye,
      title: 'مراقبة الأنشطة',
      description: 'مراقبة مستمرة لجميع الأنشطة المشبوهة والتحركات غير المعتادة',
      status: 'active'
    },
    {
      icon: Settings,
      title: 'إعدادات مخصصة',
      description: 'إعدادات أمان قابلة للتخصيص حسب احتياجاتك',
      status: 'active'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-3" dir="rtl">
              <Shield className="w-10 h-10 text-primary" />
              مركز التحكم الإداري الموحد
            </h1>
            <p className="text-muted-foreground mt-2 text-lg" dir="rtl">
              إدارة شاملة لجميع أنظمة منصة 𝐘𝐄𝐌𝐄𝐍 🇾🇪 𝐅𝐋𝐈𝐗
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              تسجيل الخروج
            </Button>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              إضافة محتوى جديد
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              نظرة عامة
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <Film className="w-4 h-4" />
              إدارة المحتوى
            </TabsTrigger>
            <TabsTrigger value="enhanced" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              المحتوى المتطور
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              إدارة المستخدمين
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              الأمان والحماية
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <Monitor className="w-4 h-4" />
              الأداء والمراقبة
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              التحليلات
            </TabsTrigger>
            <TabsTrigger value="subscriptions" className="flex items-center gap-2">
              <UserCheck className="w-4 h-4" />
              الاشتراكات
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Cog className="w-4 h-4" />
              الإعدادات
            </TabsTrigger>
          </TabsList>

          {/* نظرة عامة */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="إجمالي المحتوى"
                value={stats?.totalContent || 0}
                icon={Film}
                description="عدد كل المحتوى المتاح"
                trend="+12% من الشهر الماضي"
              />
              <StatCard
                title="إجمالي المستخدمين"
                value={stats?.totalUsers || 0}
                icon={Users}
                description="عدد المستخدمين المسجلين"
                trend="+8% من الشهر الماضي"
              />
              <StatCard
                title="إجمالي المشاهدات"
                value={stats?.totalViews || 0}
                icon={Eye}
                description="عدد المشاهدات الإجمالي"
                trend="+23% من الشهر الماضي"
              />
              <StatCard
                title="متوسط التقييم"
                value={stats?.avgRating || 0}
                icon={Star}
                description="متوسط تقييم المحتوى"
                trend="+0.2 من الشهر الماضي"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle dir="rtl">توزيع المحتوى</CardTitle>
                  <CardDescription dir="rtl">توزيع المحتوى حسب النوع</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={statsData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {statsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle dir="rtl">المشاهدات والمستخدمين</CardTitle>
                  <CardDescription dir="rtl">إحصائيات الشهور الماضية</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={viewsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="views" fill="#8884d8" />
                      <Bar dataKey="users" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* إدارة المحتوى */}
          <TabsContent value="content">
            <AdvancedContentManager />
          </TabsContent>

          {/* إدارة المحتوى المتطور */}
          <TabsContent value="enhanced">
            <AdvancedContentManager />
          </TabsContent>

          {/* إدارة المستخدمين */}
          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          {/* الأمان والحماية */}
          <TabsContent value="security" className="space-y-6">
            <div className="text-center mb-8" dir="rtl">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-3">
                <Shield className="h-8 w-8 text-blue-600" />
                نظام الأمان والحماية المتقدم
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                نظام أمان متقدم وشامل لحماية منصة اليمن فليكس من جميع التهديدات الأمنية
              </p>
              <div className="flex justify-center gap-2 mt-4">
                <Badge variant="outline" className="text-green-600 border-green-600">
                  نشط
                </Badge>
                <Badge variant="outline" className="text-blue-600 border-blue-600">
                  محدث
                </Badge>
                <Badge variant="outline" className="text-purple-600 border-purple-600">
                  آمن
                </Badge>
              </div>
            </div>

            {/* Security Features Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {securityFeatures.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <feature.icon className="h-8 w-8 text-blue-600" />
                      <Badge 
                        variant={feature.status === 'active' ? 'default' : 'secondary'}
                        className={feature.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                      >
                        {feature.status === 'active' ? 'نشط' : 'غير نشط'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <h3 className="font-semibold text-lg mb-2" dir="rtl">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm" dir="rtl">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Security Tabs */}
            <Tabs defaultValue="dashboard" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
                <TabsTrigger value="dashboard" className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  لوحة التحكم
                </TabsTrigger>
                <TabsTrigger value="password" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  كلمة المرور
                </TabsTrigger>
                <TabsTrigger value="monitoring" className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  المراقبة
                </TabsTrigger>
                <TabsTrigger value="securitySettings" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  إعدادات الأمان
                </TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard">
                <SecurityDashboard />
              </TabsContent>

              <TabsContent value="password">
                <div className="max-w-4xl mx-auto">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold mb-4" dir="rtl">إدارة كلمات المرور</h3>
                    <p className="text-gray-600 dark:text-gray-300" dir="rtl">
                      أدوات متقدمة لإدارة وفحص قوة كلمات المرور
                    </p>
                  </div>
                  <PasswordStrengthChecker />
                </div>
              </TabsContent>

              <TabsContent value="monitoring">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2" dir="rtl">
                      <Eye className="h-5 w-5" />
                      نظام المراقبة والتتبع
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Activity className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h4 className="text-xl font-semibold mb-2" dir="rtl">نظام المراقبة النشط</h4>
                      <p className="text-gray-600 dark:text-gray-300 mb-6" dir="rtl">
                        نظام مراقبة متقدم يعمل على مدار الساعة لحماية المنصة
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <h5 className="font-medium text-blue-900 dark:text-blue-100" dir="rtl">
                            مراقبة الدخول
                          </h5>
                          <p className="text-sm text-blue-700 dark:text-blue-300" dir="rtl">
                            تتبع جميع محاولات الدخول
                          </p>
                        </div>
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <h5 className="font-medium text-green-900 dark:text-green-100" dir="rtl">
                            مراقبة الأنشطة
                          </h5>
                          <p className="text-sm text-green-700 dark:text-green-300" dir="rtl">
                            تتبع أنشطة المستخدمين
                          </p>
                        </div>
                        <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                          <h5 className="font-medium text-orange-900 dark:text-orange-100" dir="rtl">
                            كشف التهديدات
                          </h5>
                          <p className="text-sm text-orange-700 dark:text-orange-300" dir="rtl">
                            اكتشاف التهديدات تلقائياً
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="securitySettings">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2" dir="rtl">
                      <Settings className="h-5 w-5" />
                      إعدادات الأمان المتقدمة
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h4 className="font-medium text-lg" dir="rtl">إعدادات التشفير</h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                              <span className="text-sm" dir="rtl">تشفير البيانات</span>
                              <Badge variant="outline" className="text-green-600 border-green-600">
                                مُفعل
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                              <span className="text-sm" dir="rtl">تشفير الاتصالات</span>
                              <Badge variant="outline" className="text-green-600 border-green-600">
                                مُفعل
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                              <span className="text-sm" dir="rtl">تشفير كلمات المرور</span>
                              <Badge variant="outline" className="text-green-600 border-green-600">
                                مُفعل
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <h4 className="font-medium text-lg" dir="rtl">إعدادات المراقبة</h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                              <span className="text-sm" dir="rtl">مراقبة تسجيل الدخول</span>
                              <Badge variant="outline" className="text-green-600 border-green-600">
                                مُفعل
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                              <span className="text-sm" dir="rtl">مراقبة الأنشطة</span>
                              <Badge variant="outline" className="text-green-600 border-green-600">
                                مُفعل
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                              <span className="text-sm" dir="rtl">تنبيهات الأمان</span>
                              <Badge variant="outline" className="text-green-600 border-green-600">
                                مُفعل
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* الأداء والمراقبة */}
          <TabsContent value="performance">
            <PerformanceDashboard />
          </TabsContent>

          {/* التحليلات */}
          <TabsContent value="analytics">
            <AdvancedAnalyticsDashboard />
          </TabsContent>

          {/* الاشتراكات */}
          <TabsContent value="subscriptions">
            <SubscriptionManagement />
          </TabsContent>

          {/* الإعدادات */}
          <TabsContent value="settings">
            <SettingsManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function UnifiedAdminPanel() {
  return (
    <AdminGuard>
      <UnifiedAdminPanelContent />
    </AdminGuard>
  );
}