import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Download, 
  TrendingUp, 
  Users, 
  Eye, 
  Star,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Award
} from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

interface ReportData {
  userStats: {
    totalUsers: number;
    newUsersThisMonth: number;
    activeUsers: number;
    userGrowth: number;
  };
  contentStats: {
    totalContent: number;
    newContentThisMonth: number;
    totalViews: number;
    totalDownloads: number;
  };
  engagementStats: {
    avgSessionDuration: number;
    pageViews: number;
    bounceRate: number;
    returnVisitors: number;
  };
  chartData: {
    userGrowth: Array<{ date: string; users: number; newUsers: number }>;
    contentViews: Array<{ date: string; views: number; downloads: number }>;
    categoryDistribution: Array<{ name: string; value: number; color: string }>;
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7300'];

export default function ReportsManagement() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    to: new Date()
  });
  const [reportType, setReportType] = useState('overview');

  // Fetch report data
  const { data: reportData, isLoading } = useQuery({
    queryKey: ['/api/admin/reports', reportType, dateRange],
    queryFn: async () => {
      const params = new URLSearchParams({
        type: reportType,
        from: dateRange.from.toISOString(),
        to: dateRange.to.toISOString()
      });
      const response = await fetch(`/api/admin/reports?${params}`);
      if (!response.ok) throw new Error('Failed to fetch report data');
      return response.json();
    }
  });

  const handleExportReport = () => {
    // Implementation for exporting reports
    console.log('Exporting report...');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">التقارير والإحصائيات</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            تقارير شاملة عن أداء الموقع والمستخدمين
          </p>
        </div>
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overview">نظرة عامة</SelectItem>
              <SelectItem value="users">المستخدمين</SelectItem>
              <SelectItem value="content">المحتوى</SelectItem>
              <SelectItem value="engagement">المشاركة</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExportReport}>
            <Download className="w-4 h-4 mr-2" />
            تصدير التقرير
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المستخدمين</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData?.userStats?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              +{reportData?.userStats?.userGrowth || 0}% من الشهر الماضي
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المحتوى الإجمالي</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData?.contentStats?.totalContent || 0}</div>
            <p className="text-xs text-muted-foreground">
              +{reportData?.contentStats?.newContentThisMonth || 0} هذا الشهر
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المشاهدات</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData?.contentStats?.totalViews || 0}</div>
            <p className="text-xs text-muted-foreground">
              المشاهدات اليوم
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي التحميلات</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData?.contentStats?.totalDownloads || 0}</div>
            <p className="text-xs text-muted-foreground">
              التحميلات اليوم
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="charts" className="space-y-6">
        <TabsList>
          <TabsTrigger value="charts" className="flex items-center">
            <BarChart3 className="w-4 h-4 mr-2" />
            الرسوم البيانية
          </TabsTrigger>
          <TabsTrigger value="detailed" className="flex items-center">
            <FileText className="w-4 h-4 mr-2" />
            التقرير المفصل
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center">
            <TrendingUp className="w-4 h-4 mr-2" />
            الاتجاهات
          </TabsTrigger>
        </TabsList>

        <TabsContent value="charts" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Growth Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  نمو المستخدمين
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={reportData?.chartData?.userGrowth || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="users" stackId="1" stroke="#8884d8" fill="#8884d8" />
                    <Area type="monotone" dataKey="newUsers" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Content Views Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="w-5 h-5 mr-2" />
                  المشاهدات والتحميلات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={reportData?.chartData?.contentViews || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="views" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="downloads" stroke="#82ca9d" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Category Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="w-5 h-5 mr-2" />
                  توزيع الفئات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={reportData?.chartData?.categoryDistribution || []}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {(reportData?.chartData?.categoryDistribution || []).map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  مقاييس الأداء
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">متوسط مدة الجلسة</span>
                    <Badge variant="secondary">
                      {reportData?.engagementStats?.avgSessionDuration || 0} دقيقة
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">معدل الارتداد</span>
                    <Badge variant="secondary">
                      {reportData?.engagementStats?.bounceRate || 0}%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">الزوار العائدون</span>
                    <Badge variant="secondary">
                      {reportData?.engagementStats?.returnVisitors || 0}%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">صفحات المشاهدة</span>
                    <Badge variant="secondary">
                      {reportData?.engagementStats?.pageViews || 0}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>التقرير المفصل</CardTitle>
              <CardDescription>
                تحليل شامل لأداء الموقع خلال الفترة المحددة
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* User Analysis */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    تحليل المستخدمين
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {reportData?.userStats?.totalUsers || 0}
                      </div>
                      <div className="text-sm text-blue-600 dark:text-blue-400">إجمالي المستخدمين</div>
                    </div>
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {reportData?.userStats?.newUsersThisMonth || 0}
                      </div>
                      <div className="text-sm text-green-600 dark:text-green-400">مستخدمين جدد هذا الشهر</div>
                    </div>
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {reportData?.userStats?.activeUsers || 0}
                      </div>
                      <div className="text-sm text-purple-600 dark:text-purple-400">مستخدمين نشطين</div>
                    </div>
                  </div>
                </div>

                {/* Content Analysis */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    تحليل المحتوى
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                        {reportData?.contentStats?.totalContent || 0}
                      </div>
                      <div className="text-sm text-orange-600 dark:text-orange-400">إجمالي المحتوى</div>
                    </div>
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {reportData?.contentStats?.totalViews || 0}
                      </div>
                      <div className="text-sm text-red-600 dark:text-red-400">إجمالي المشاهدات</div>
                    </div>
                    <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                        {reportData?.contentStats?.totalDownloads || 0}
                      </div>
                      <div className="text-sm text-indigo-600 dark:text-indigo-400">إجمالي التحميلات</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                تحليل الاتجاهات
              </CardTitle>
              <CardDescription>
                الاتجاهات والتوقعات بناءً على البيانات التاريخية
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  تحليل الاتجاهات
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  قريباً - تحليل متقدم للاتجاهات والتوقعات
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}