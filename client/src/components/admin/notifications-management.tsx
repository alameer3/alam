import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, 
  BellRing, 
  Send, 
  Users, 
  MessageSquare, 
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  targetType: 'all' | 'users' | 'admins' | 'specific';
  targetUsers?: number[];
  isRead: boolean;
  createdAt: string;
  expiresAt?: string;
  isActive: boolean;
}

interface NotificationForm {
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  targetType: 'all' | 'users' | 'admins' | 'specific';
  targetUsers: number[];
  expiresAt?: string;
}

export default function NotificationsManagement() {
  const [activeTab, setActiveTab] = useState('send');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [formData, setFormData] = useState<NotificationForm>({
    title: '',
    message: '',
    type: 'info',
    targetType: 'all',
    targetUsers: []
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch notifications
  const { data: notifications, isLoading } = useQuery({
    queryKey: ['/api/admin/notifications'],
    queryFn: async () => {
      const response = await fetch('/api/admin/notifications');
      if (!response.ok) throw new Error('Failed to fetch notifications');
      return response.json();
    }
  });

  // Fetch users for targeting
  const { data: users } = useQuery({
    queryKey: ['/api/admin/users'],
    queryFn: async () => {
      const response = await fetch('/api/admin/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      return response.json();
    }
  });

  // Send notification mutation
  const sendNotificationMutation = useMutation({
    mutationFn: async (data: NotificationForm) => {
      return apiRequest('/api/admin/notifications', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/notifications'] });
      toast({
        title: "تم إرسال الإشعار بنجاح",
        description: "تم إرسال الإشعار للمستخدمين المحددين"
      });
      setShowCreateDialog(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "خطأ في إرسال الإشعار",
        description: "حدث خطأ أثناء إرسال الإشعار",
        variant: "destructive"
      });
    }
  });

  const resetForm = () => {
    setFormData({
      title: '',
      message: '',
      type: 'info',
      targetType: 'all',
      targetUsers: []
    });
  };

  const handleSendNotification = () => {
    if (!formData.title.trim() || !formData.message.trim()) {
      toast({
        title: "بيانات مفقودة",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    sendNotificationMutation.mutate(formData);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'warning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'error': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    }
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">إدارة الإشعارات</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            إرسال وإدارة الإشعارات للمستخدمين
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              إشعار جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>إرسال إشعار جديد</DialogTitle>
              <DialogDescription>
                إنشاء وإرسال إشعار للمستخدمين
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">عنوان الإشعار</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="أدخل عنوان الإشعار"
                />
              </div>
              
              <div>
                <Label htmlFor="message">نص الإشعار</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="أدخل نص الإشعار"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="type">نوع الإشعار</Label>
                <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">معلومات</SelectItem>
                    <SelectItem value="success">نجاح</SelectItem>
                    <SelectItem value="warning">تحذير</SelectItem>
                    <SelectItem value="error">خطأ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="targetType">الجمهور المستهدف</Label>
                <Select value={formData.targetType} onValueChange={(value: any) => setFormData({ ...formData, targetType: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع المستخدمين</SelectItem>
                    <SelectItem value="users">المستخدمين فقط</SelectItem>
                    <SelectItem value="admins">المديرين فقط</SelectItem>
                    <SelectItem value="specific">مستخدمين محددين</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleSendNotification} 
                  disabled={sendNotificationMutation.isPending}
                  className="flex-1"
                >
                  {sendNotificationMutation.isPending ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  إرسال
                </Button>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  إلغاء
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="send" className="flex items-center">
            <Send className="w-4 h-4 mr-2" />
            إرسال إشعار
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center">
            <Bell className="w-4 h-4 mr-2" />
            سجل الإشعارات
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center">
            <MessageSquare className="w-4 h-4 mr-2" />
            القوالب
          </TabsTrigger>
        </TabsList>

        <TabsContent value="send" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  إجمالي المستخدمين
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users?.data?.total || 0}</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  مستخدم نشط في النظام
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  الإشعارات المرسلة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{notifications?.data?.length || 0}</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  إشعار تم إرساله
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BellRing className="w-5 h-5 mr-2" />
                  الإشعارات النشطة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {notifications?.data?.filter((n: Notification) => n.isActive).length || 0}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  إشعار نشط حالياً
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>سجل الإشعارات</CardTitle>
              <CardDescription>
                جميع الإشعارات المرسلة سابقاً
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications?.data?.map((notification: Notification) => (
                  <div key={notification.id} className="flex items-start justify-between p-4 border rounded-lg">
                    <div className="flex items-start space-x-3 rtl:space-x-reverse flex-1">
                      {getTypeIcon(notification.type)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse mb-1">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {notification.title}
                          </h4>
                          <Badge className={getTypeColor(notification.type)}>
                            {notification.type === 'info' && 'معلومات'}
                            {notification.type === 'success' && 'نجاح'}
                            {notification.type === 'warning' && 'تحذير'}
                            {notification.type === 'error' && 'خطأ'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center space-x-4 rtl:space-x-reverse text-xs text-gray-500">
                          <span>
                            {new Date(notification.createdAt).toLocaleDateString('ar')}
                          </span>
                          <span>•</span>
                          <span>
                            {notification.targetType === 'all' && 'جميع المستخدمين'}
                            {notification.targetType === 'users' && 'المستخدمين'}
                            {notification.targetType === 'admins' && 'المديرين'}
                            {notification.targetType === 'specific' && 'مستخدمين محددين'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>قوالب الإشعارات</CardTitle>
              <CardDescription>
                قوالب جاهزة للإشعارات الشائعة
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  قوالب الإشعارات
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  قريباً - قوالب جاهزة للإشعارات الشائعة
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}