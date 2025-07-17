import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Redirect } from 'wouter';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminDashboard } from '@/components/admin/admin-dashboard';
import { SiteSettingsComponent } from '@/components/admin/site-settings';
import UserManagement from '@/components/admin/user-management';
import AdvancedContentManager from '@/components/admin/advanced-content-manager';
import { PerformanceDashboard } from '@/components/admin/PerformanceDashboard';
import DatabaseManagement from '@/components/admin/database-management';
import NotificationsManagement from '@/components/admin/notifications-management';
import ReportsManagement from '@/components/admin/reports-management';
import { 
  Home, 
  Settings, 
  Users, 
  Film, 
  BarChart3, 
  Database,
  Shield,
  Bell,
  FileText
} from 'lucide-react';

export default function AdminPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  // عرض مؤشر التحميل أثناء التحقق من المصادقة
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  // التأكد من تسجيل الدخول وكون المستخدم مدير
  if (!isAuthenticated || !user || user.role !== 'admin') {
    return <Redirect to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-3" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                لوحة التحكم الإدارية
              </h1>
            </div>
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                مرحباً، {user.firstName || user.username}
              </span>
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
                {(user.firstName || user.username).charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 mb-8">
            <TabsTrigger value="dashboard" className="flex items-center">
              <Home className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">الرئيسية</span>
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center">
              <Film className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">المحتوى</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">المستخدمون</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center">
              <Settings className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">الإعدادات</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center">
              <BarChart3 className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">التحليلات</span>
            </TabsTrigger>
            <TabsTrigger value="database" className="flex items-center">
              <Database className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">قاعدة البيانات</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center">
              <Bell className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">الإشعارات</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">التقارير</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <AdminDashboard />
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <AdvancedContentManager />
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <UserManagement />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <SiteSettingsComponent />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <PerformanceDashboard />
          </TabsContent>

          <TabsContent value="database" className="space-y-6">
            <DatabaseManagement />
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <NotificationsManagement />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <ReportsManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}