import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdvancedAnalyticsDashboard from '@/components/analytics/advanced-analytics-dashboard';
import UserBehaviorTracking from '@/components/analytics/user-behavior-tracking';
import { BarChart3, Users, Activity, TrendingUp, Eye, Clock, Target, DollarSign } from 'lucide-react';

const AnalyticsPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('dashboard');

  const quickStats = [
    {
      title: 'المستخدمون النشطون',
      value: '8,900',
      change: '+12%',
      trend: 'up',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'إجمالي المشاهدات',
      value: '150,000',
      change: '+8%',
      trend: 'up',
      icon: Eye,
      color: 'text-green-600'
    },
    {
      title: 'متوسط وقت المشاهدة',
      value: '28 دقيقة',
      change: '+5%',
      trend: 'up',
      icon: Clock,
      color: 'text-purple-600'
    },
    {
      title: 'معدل التحويل',
      value: '15.5%',
      change: '+2.3%',
      trend: 'up',
      icon: Target,
      color: 'text-orange-600'
    },
    {
      title: 'إيرادات الاشتراكات',
      value: '$125,000',
      change: '+18%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-yellow-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                مركز التحليلات
              </h1>
              <p className="text-slate-600 dark:text-slate-300">
                تحليل شامل لأداء المنصة وسلوك المستخدمين
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            {quickStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <IconComponent className={`w-5 h-5 ${stat.color}`} />
                      <span className="text-sm text-green-600 font-medium">
                        {stat.change}
                      </span>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                        {stat.value}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {stat.title}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Main Analytics Interface */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              لوحة التحليلات
            </TabsTrigger>
            <TabsTrigger value="behavior" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              سلوك المستخدمين
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            <AdvancedAnalyticsDashboard />
          </TabsContent>

          <TabsContent value="behavior" className="space-y-4">
            <UserBehaviorTracking />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AnalyticsPage;