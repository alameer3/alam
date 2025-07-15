import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { User, Clock, Play, Pause, SkipForward, Search, Filter, Share2, Download, Heart, MessageCircle } from 'lucide-react';

interface UserBehaviorData {
  sessionId: string;
  userId: number;
  actions: {
    timestamp: string;
    action: string;
    contentId?: number;
    duration?: number;
    metadata?: Record<string, unknown>;
  }[];
  totalDuration: number;
  deviceType: string;
  platform: string;
  location: string;
}

const UserBehaviorTracking: React.FC = () => {
  const behaviorData = {
    topActions: [
      { action: 'مشاهدة', count: 15000, icon: Play, color: '#8884d8' },
      { action: 'بحث', count: 8500, icon: Search, color: '#82ca9d' },
      { action: 'تشغيل', count: 7200, icon: Play, color: '#ffc658' },
      { action: 'إيقاف مؤقت', count: 6800, icon: Pause, color: '#ff7300' },
      { action: 'تخطي', count: 3200, icon: SkipForward, color: '#8dd1e1' },
      { action: 'مشاركة', count: 2100, icon: Share2, color: '#d084d0' },
      { action: 'تحميل', count: 1800, icon: Download, color: '#ffb347' },
      { action: 'إضافة للمفضلة', count: 1500, icon: Heart, color: '#ff8a95' }
    ],
    watchPatterns: [
      { hour: '06:00', views: 450, completion: 65 },
      { hour: '07:00', views: 680, completion: 70 },
      { hour: '08:00', views: 920, completion: 75 },
      { hour: '09:00', views: 1200, completion: 80 },
      { hour: '10:00', views: 1500, completion: 85 },
      { hour: '11:00', views: 1800, completion: 82 },
      { hour: '12:00', views: 2200, completion: 78 },
      { hour: '13:00', views: 2800, completion: 75 },
      { hour: '14:00', views: 3200, completion: 72 },
      { hour: '15:00', views: 3800, completion: 70 },
      { hour: '16:00', views: 4200, completion: 68 },
      { hour: '17:00', views: 4800, completion: 65 },
      { hour: '18:00', views: 5500, completion: 62 },
      { hour: '19:00', views: 6200, completion: 60 },
      { hour: '20:00', views: 7800, completion: 58 },
      { hour: '21:00', views: 8500, completion: 55 },
      { hour: '22:00', views: 6800, completion: 52 },
      { hour: '23:00', views: 4200, completion: 50 }
    ],
    contentInteraction: [
      { contentType: 'أفلام عربية', avgWatchTime: 85, engagementRate: 78, skipRate: 15 },
      { contentType: 'مسلسلات تركية', avgWatchTime: 92, engagementRate: 85, skipRate: 8 },
      { contentType: 'أفلام أجنبية', avgWatchTime: 72, engagementRate: 65, skipRate: 25 },
      { contentType: 'مسلسلات يمنية', avgWatchTime: 95, engagementRate: 92, skipRate: 3 },
      { contentType: 'أفلام هندية', avgWatchTime: 68, engagementRate: 58, skipRate: 32 }
    ],
    deviceAnalytics: [
      { device: 'هاتف محمول', users: 4500, avgSession: 28, bounceRate: 25 },
      { device: 'كمبيوتر', users: 3200, avgSession: 45, bounceRate: 15 },
      { device: 'تابلت', users: 1800, avgSession: 35, bounceRate: 20 },
      { device: 'تلفزيون ذكي', users: 1200, avgSession: 65, bounceRate: 8 }
    ],
    userJourney: [
      { step: 'الصفحة الرئيسية', users: 10000, dropoff: 15 },
      { step: 'تصفح المحتوى', users: 8500, dropoff: 12 },
      { step: 'مشاهدة التفاصيل', users: 7480, dropoff: 18 },
      { step: 'بدء المشاهدة', users: 6134, dropoff: 25 },
      { step: 'إكمال المشاهدة', users: 4600, dropoff: 0 }
    ],
    searchBehavior: {
      popularQueries: [
        { query: 'أفلام عربية', count: 2500 },
        { query: 'مسلسلات تركية', count: 2200 },
        { query: 'أفلام أكشن', count: 1800 },
        { query: 'كوميديا', count: 1500 },
        { query: 'دراما', count: 1200 }
      ],
      searchSuccess: 78,
      avgSearchTime: 12,
      filtersUsed: 65
    }
  };

  const getActionIcon = (action: string) => {
    const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
      'مشاهدة': Play,
      'بحث': Search,
      'تشغيل': Play,
      'إيقاف مؤقت': Pause,
      'تخطي': SkipForward,
      'مشاركة': Share2,
      'تحميل': Download,
      'إضافة للمفضلة': Heart
    };
    return iconMap[action] || Play;
  };

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
            تتبع سلوك المستخدمين
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mt-1">
            تحليل مفصل لسلوك المستخدمين وأنماط التفاعل مع المحتوى
          </p>
        </div>
        <Button variant="outline" size="sm">
          تصدير التقرير
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="patterns">أنماط المشاهدة</TabsTrigger>
          <TabsTrigger value="content">تفاعل المحتوى</TabsTrigger>
          <TabsTrigger value="devices">الأجهزة</TabsTrigger>
          <TabsTrigger value="journey">رحلة المستخدم</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {behaviorData.topActions.slice(0, 4).map((action, index) => {
              const IconComponent = action.icon;
              return (
                <Card key={`action-${index}`} className="border-l-4" style={{ borderLeftColor: action.color }}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{action.action}</p>
                        <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                          {action.count.toLocaleString()}
                        </p>
                      </div>
                      <IconComponent className="w-8 h-8" style={{ color: action.color }} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>الإجراءات الأكثر شيوعاً</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {behaviorData.topActions.map((action, index) => {
                    const IconComponent = action.icon;
                    const maxCount = Math.max(...behaviorData.topActions.map(a => a.count));
                    const percentage = (action.count / maxCount) * 100;
                    
                    return (
                      <div key={`interaction-${index}`} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <IconComponent className="w-5 h-5" style={{ color: action.color }} />
                          <span className="text-sm font-medium">{action.action}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={percentage} className="w-20" />
                          <span className="text-sm text-slate-600 min-w-[60px] text-right">
                            {action.count.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>إحصائيات البحث</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">
                        {behaviorData.searchBehavior.searchSuccess}%
                      </p>
                      <p className="text-sm text-slate-600">نجاح البحث</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">
                        {behaviorData.searchBehavior.avgSearchTime}ث
                      </p>
                      <p className="text-sm text-slate-600">متوسط وقت البحث</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">
                        {behaviorData.searchBehavior.filtersUsed}%
                      </p>
                      <p className="text-sm text-slate-600">استخدام الفلاتر</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">الكلمات الأكثر بحثاً:</h4>
                    <div className="flex flex-wrap gap-2">
                      {behaviorData.searchBehavior.popularQueries.map((query, index) => (
                        <Badge key={`badge-${index}`} variant="secondary" className="text-xs">
                          {query.query} ({query.count})
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>أنماط المشاهدة حسب الوقت</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={behaviorData.watchPatterns}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="views" stroke="#8884d8" name="المشاهدات" />
                  <Line type="monotone" dataKey="completion" stroke="#82ca9d" name="معدل الإكمال %" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>تفاعل المستخدمين مع المحتوى</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {behaviorData.contentInteraction.map((content, index) => (
                  <div key={`device-${index}`} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-medium text-lg">{content.contentType}</h4>
                      <Badge variant="outline" className="text-xs">
                        {content.avgWatchTime}% متوسط المشاهدة
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">معدل التفاعل</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Progress value={content.engagementRate} className="flex-1" />
                          <span className="text-sm font-medium">{content.engagementRate}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">وقت المشاهدة</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Progress value={content.avgWatchTime} className="flex-1" />
                          <span className="text-sm font-medium">{content.avgWatchTime}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">معدل التخطي</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Progress value={content.skipRate} className="flex-1" />
                          <span className="text-sm font-medium">{content.skipRate}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>تحليل الأجهزة والمنصات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {behaviorData.deviceAnalytics.map((device, index) => (
                  <div key={`journey-${index}`} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-medium">{device.device}</h4>
                      <Badge variant="secondary">{device.users} مستخدم</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">متوسط الجلسة</span>
                        <span className="font-medium">{device.avgSession} دقيقة</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">معدل الارتداد</span>
                        <span className="font-medium">{device.bounceRate}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="journey" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>رحلة المستخدم</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {behaviorData.userJourney.map((step, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-medium">{step.step}</h4>
                        <span className="text-sm text-slate-600">{step.users.toLocaleString()} مستخدم</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={step.users / behaviorData.userJourney[0].users * 100} className="flex-1" />
                        {step.dropoff > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            -{step.dropoff}%
                          </Badge>
                        )}
                      </div>
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

export default UserBehaviorTracking;