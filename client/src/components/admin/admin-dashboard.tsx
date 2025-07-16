import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Film, 
  Eye, 
  Download, 
  Star, 
  MessageSquare,
  Settings,
  Database,
  Activity,
  TrendingUp,
  Clock,
  Shield
} from 'lucide-react';
import type { DashboardStats } from '../../../shared/types';

interface AdminDashboardProps {
  className?: string;
}

export function AdminDashboard({ className }: AdminDashboardProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/dashboard');
      const result = await response.json();
      
      if (result.success) {
        setStats(result.data);
      } else {
        setError(result.error || 'خطأ في الحصول على البيانات');
      }
    } catch (err) {
      setError('خطأ في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 p-6 ${className}`}>
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 p-6 ${className}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="text-red-500 text-lg mb-4">{error}</div>
            <Button onClick={fetchDashboardStats} variant="outline">
              <Activity className="w-4 h-4 mr-2" />
              إعادة المحاولة
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 p-6 ${className}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            لوحة التحكم الإدارية
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            مرحباً بك في لوحة إدارة موقع AK.SV
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي المحتوى</CardTitle>
              <Film className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalContent}</div>
              <p className="text-xs text-muted-foreground">
                أفلام ومسلسلات وبرامج
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي المستخدمين</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                +{stats.activeUsers} مستخدم نشط
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي المشاهدات</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(stats.totalViews || 0).toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                مشاهدة هذا الشهر
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي التحميلات</CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(stats.totalDownloads || 0).toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                تحميل هذا الشهر
              </p>
            </CardContent>
          </Card>
        </div>

        {/* System Health */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              حالة النظام
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <div className={`w-3 h-3 rounded-full ${getHealthColor(stats.systemHealth?.status || 'unknown')}`}></div>
                <span className="text-sm font-medium">
                  {stats.systemHealth?.status === 'healthy' ? 'سليم' : 
                   stats.systemHealth?.status === 'warning' ? 'تحذير' : 'حرج'}
                </span>
              </div>
              <div className="text-sm">
                <span className="font-medium">وقت التشغيل:</span> {stats.systemHealth?.uptime || 0}%
              </div>
              <div className="text-sm">
                <span className="font-medium">القرص:</span> {stats.systemHealth?.diskUsage || 0}%
              </div>
              <div className="text-sm">
                <span className="font-medium">الذاكرة:</span> {stats.systemHealth?.memoryUsage || 0}%
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                أحدث المحتوى
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(stats.recentContent || []).map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="flex-shrink-0">
                      <img 
                        src={item.poster || '/api/placeholder/50/75'} 
                        alt={item.titleAr}
                        className="w-12 h-16 object-cover rounded"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {item.titleAr}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {item.type === 'movie' ? 'فيلم' : 
                         item.type === 'series' ? 'مسلسل' : 
                         item.type === 'program' ? 'برنامج' : item.type}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1 rtl:space-x-reverse">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm">{item.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                الأكثر مشاهدة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(stats.mostViewed || []).map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="flex-shrink-0">
                      <img 
                        src={item.poster || '/api/placeholder/50/75'} 
                        alt={item.titleAr}
                        className="w-12 h-16 object-cover rounded"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {item.titleAr}
                      </p>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse text-xs text-gray-500 dark:text-gray-400">
                        <Eye className="w-3 h-3" />
                        <span>{(item.viewCount || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              إجراءات سريعة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="justify-start">
                <Film className="w-4 h-4 mr-2" />
                إضافة محتوى جديد
              </Button>
              <Button variant="outline" className="justify-start">
                <Users className="w-4 h-4 mr-2" />
                إدارة المستخدمين
              </Button>
              <Button variant="outline" className="justify-start">
                <Database className="w-4 h-4 mr-2" />
                نسخ احتياطي
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}