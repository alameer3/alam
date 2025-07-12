import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { 
  Users, Film, TrendingUp, Eye, Star, MessageSquare, Heart, Download,
  Plus, Edit, Trash2, Search, Filter, Grid, List, Calendar, Clock, LogOut, Shield
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/layout/header';
import Navigation from '@/components/layout/navigation';
import Footer from '@/components/layout/footer';
import AdminGuard from '@/components/admin/admin-guard';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import ContentManagement from '@/components/admin/content-management';
import UserManagement from '@/components/admin/user-management';
import SettingsManagement from '@/components/admin/settings-management';

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

function AdminDashboardContent() {
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Shield className="w-8 h-8 text-primary" />
              لوحة التحكم الإدارية
            </h1>
            <p className="text-muted-foreground mt-1">إدارة وتحليل منصة أكاديمية السينما</p>
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="content">إدارة المحتوى</TabsTrigger>
            <TabsTrigger value="users">إدارة المستخدمين</TabsTrigger>
            <TabsTrigger value="analytics">التحليلات</TabsTrigger>
            <TabsTrigger value="settings">الإعدادات</TabsTrigger>
          </TabsList>

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
                  <CardTitle>توزيع المحتوى</CardTitle>
                  <CardDescription>توزيع المحتوى حسب النوع</CardDescription>
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
                  <CardTitle>المشاهدات والمستخدمين</CardTitle>
                  <CardDescription>إحصائيات الشهور الماضية</CardDescription>
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

            <Card>
              <CardHeader>
                <CardTitle>المحتوى الأكثر شعبية</CardTitle>
                <CardDescription>المحتوى الأكثر مشاهدة وتقييماً</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topContent.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center space-x-4 space-x-reverse">
                        <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                          <Film className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{item.title}</h3>
                          <p className="text-sm text-muted-foreground">{item.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 space-x-reverse">
                        <div className="text-center">
                          <div className="text-sm font-semibold">{item.views.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">مشاهدة</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-semibold flex items-center">
                            <Star className="w-4 h-4 text-yellow-500 mr-1" />
                            {item.rating}
                          </div>
                          <div className="text-xs text-muted-foreground">تقييم</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content">
            <ContentManagement />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>التحليلات المتقدمة</CardTitle>
                <CardDescription>تحليلات مفصلة للمنصة</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">
                  ستتوفر التحليلات المتقدمة قريباً...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <SettingsManagement />
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <AdminGuard>
      <AdminDashboardContent />
    </AdminGuard>
  );
}