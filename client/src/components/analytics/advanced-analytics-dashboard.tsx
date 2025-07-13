import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Users, Eye, PlayCircle, TrendingUp, DollarSign, Activity, Target, Award } from 'lucide-react';

const AdvancedAnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [analyticsData, setAnalyticsData] = useState({
    overview: {
      totalUsers: 12500,
      activeUsers: 8900,
      newUsers: 450,
      totalViews: 150000,
      avgWatchTime: 28,
      revenue: 125000,
      subscriptions: 6800,
      churnRate: 2.5
    },
    userActivity: [
      { date: '2025-01-05', users: 8500, views: 25000, watchTime: 450 },
      { date: '2025-01-06', users: 8700, views: 26000, watchTime: 470 },
      { date: '2025-01-07', users: 8900, views: 27000, watchTime: 480 },
      { date: '2025-01-08', users: 8600, views: 25500, watchTime: 460 },
      { date: '2025-01-09', users: 9100, views: 28000, watchTime: 490 },
      { date: '2025-01-10', users: 9300, views: 29000, watchTime: 500 },
      { date: '2025-01-11', users: 9500, views: 30000, watchTime: 510 }
    ],
    contentPerformance: [
      { name: 'أفلام عربية', views: 45000, engagement: 85, revenue: 35000 },
      { name: 'مسلسلات تركية', views: 38000, engagement: 78, revenue: 28000 },
      { name: 'أفلام أجنبية', views: 32000, engagement: 72, revenue: 25000 },
      { name: 'مسلسلات يمنية', views: 28000, engagement: 95, revenue: 22000 },
      { name: 'أفلام هندية', views: 25000, engagement: 68, revenue: 18000 }
    ],
    deviceUsage: [
      { name: 'هاتف محمول', value: 45, color: '#8884d8' },
      { name: 'كمبيوتر', value: 30, color: '#82ca9d' },
      { name: 'تابلت', value: 15, color: '#ffc658' },
      { name: 'تلفزيون ذكي', value: 10, color: '#ff7300' }
    ],
    subscriptionAnalytics: {
      plans: [
        { name: 'أساسي', subscribers: 3500, revenue: 20965, growth: 12 },
        { name: 'مميز', subscribers: 2800, revenue: 27972, growth: 18 },
        { name: 'فائق', subscribers: 500, revenue: 7995, growth: 25 }
      ],
      conversionRate: 15.5,
      churnRate: 2.5,
      ltv: 125.50
    }
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ar-SA').format(num);
  };

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
            التحليلات المتقدمة
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mt-1">
            تحليل شامل لأداء المنصة وسلوك المستخدمين
          </p>
        </div>
        <div className="flex gap-2">
          {['24h', '7d', '30d', '90d'].map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(range)}
              className="text-sm"
            >
              {range === '24h' ? '24 ساعة' : 
               range === '7d' ? '7 أيام' : 
               range === '30d' ? '30 يوم' : '90 يوم'}
            </Button>
          ))}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">إجمالي المستخدمين</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                  {formatNumber(analyticsData.overview.totalUsers)}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+12% من الشهر الماضي</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">المستخدمون النشطون</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                  {formatNumber(analyticsData.overview.activeUsers)}
                </p>
              </div>
              <Activity className="w-8 h-8 text-green-500" />
            </div>
            <div className="flex items-center mt-2">
              <Progress value={71} className="w-20 h-2 mr-2" />
              <span className="text-sm text-slate-600">71% من الإجمالي</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">إجمالي المشاهدات</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                  {formatNumber(analyticsData.overview.totalViews)}
                </p>
              </div>
              <Eye className="w-8 h-8 text-purple-500" />
            </div>
            <div className="flex items-center mt-2">
              <PlayCircle className="w-4 h-4 text-purple-500 mr-1" />
              <span className="text-sm text-slate-600">
                {analyticsData.overview.avgWatchTime} دقيقة متوسط المشاهدة
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">إيرادات الاشتراكات</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                  {formatCurrency(analyticsData.overview.revenue)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-yellow-500" />
            </div>
            <div className="flex items-center mt-2">
              <Target className="w-4 h-4 text-yellow-500 mr-1" />
              <span className="text-sm text-slate-600">
                {formatNumber(analyticsData.overview.subscriptions)} اشتراك نشط
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users">تحليل المستخدمين</TabsTrigger>
          <TabsTrigger value="content">أداء المحتوى</TabsTrigger>
          <TabsTrigger value="devices">الأجهزة</TabsTrigger>
          <TabsTrigger value="subscriptions">الاشتراكات</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                نشاط المستخدمين اليومي
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analyticsData.userActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="users" stroke="#8884d8" name="المستخدمون النشطون" />
                  <Line type="monotone" dataKey="views" stroke="#82ca9d" name="المشاهدات" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlayCircle className="w-5 h-5" />
                أداء المحتوى حسب الفئة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.contentPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="views" fill="#8884d8" name="المشاهدات" />
                  <Bar dataKey="engagement" fill="#82ca9d" name="التفاعل %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                توزيع الأجهزة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analyticsData.deviceUsage}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {analyticsData.deviceUsage.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscriptions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">معدل التحويل</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {analyticsData.subscriptionAnalytics.conversionRate}%
                </div>
                <p className="text-sm text-slate-600 mt-1">من الزوار إلى مشتركين</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">معدل الإلغاء</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">
                  {analyticsData.subscriptionAnalytics.churnRate}%
                </div>
                <p className="text-sm text-slate-600 mt-1">معدل إلغاء الاشتراكات</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">القيمة مدى الحياة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {formatCurrency(analyticsData.subscriptionAnalytics.ltv)}
                </div>
                <p className="text-sm text-slate-600 mt-1">متوسط قيمة المشترك</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>أداء خطط الاشتراك</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.subscriptionAnalytics.plans.map((plan, index) => (
                  <div key={`plan-${plan.name}-${index}`} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Award className="w-5 h-5 text-yellow-500" />
                      <div>
                        <h4 className="font-medium">{plan.name}</h4>
                        <p className="text-sm text-slate-600">
                          {formatNumber(plan.subscribers)} مشترك
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{formatCurrency(plan.revenue)}</p>
                      <Badge variant="secondary" className="text-green-600">
                        +{plan.growth}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAnalyticsDashboard;