import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { 
  Bell, 
  Check, 
  Trash2, 
  Settings, 
  Heart, 
  Star, 
  Play, 
  MessageCircle,
  Film,
  Tv,
  Users,
  Clock,
  AlertCircle,
  CheckCircle2,
  X
} from "lucide-react";

interface Notification {
  id: number;
  type: 'like' | 'comment' | 'follow' | 'review' | 'system' | 'content' | 'recommendation';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  senderName?: string;
  senderAvatar?: string;
  contentTitle?: string;
  contentPoster?: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  likes: boolean;
  comments: boolean;
  follows: boolean;
  reviews: boolean;
  newContent: boolean;
  recommendations: boolean;
  systemUpdates: boolean;
}

export default function Notifications() {
  const [selectedTab, setSelectedTab] = useState("all");
  const currentUserId = 1;

  const { data: notifications = [], isLoading: notificationsLoading } = useQuery<Notification[]>({
    queryKey: [`/api/users/${currentUserId}/notifications`],
  });

  const { data: settings, isLoading: settingsLoading } = useQuery<NotificationSettings>({
    queryKey: [`/api/users/${currentUserId}/notification-settings`],
  });

  // Mock data for demonstration
  const mockNotifications: Notification[] = [
    {
      id: 1,
      type: 'like',
      title: 'إعجاب جديد',
      message: 'أعجب أحمد بمراجعتك لفيلم The Dark Knight',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      isRead: false,
      senderName: 'أحمد محمد',
      senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ahmed',
      contentTitle: 'The Dark Knight'
    },
    {
      id: 2,
      type: 'comment',
      title: 'تعليق جديد',
      message: 'علق سارة على مراجعتك: "تحليل رائع للفيلم!"',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      isRead: false,
      senderName: 'سارة أحمد',
      senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sara',
      contentTitle: 'Inception'
    },
    {
      id: 3,
      type: 'content',
      title: 'محتوى جديد',
      message: 'تم إضافة فيلم جديد: "Dune: Part Two" - لا تفوت مشاهدته!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
      isRead: true,
      contentTitle: 'Dune: Part Two',
      contentPoster: '/placeholder-poster.jpg'
    },
    {
      id: 4,
      type: 'recommendation',
      title: 'توصية شخصية',
      message: 'بناءً على مشاهداتك، نوصي بمسلسل "House of the Dragon"',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      isRead: true,
      contentTitle: 'House of the Dragon',
      contentPoster: '/placeholder-poster.jpg'
    },
    {
      id: 5,
      type: 'system',
      title: 'تحديث النظام',
      message: 'تم تحديث تطبيق Yemen Flix بميزات جديدة ومحسنة',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      isRead: true
    }
  ];

  const mockSettings: NotificationSettings = {
    emailNotifications: true,
    pushNotifications: true,
    likes: true,
    comments: true,
    follows: true,
    reviews: false,
    newContent: true,
    recommendations: true,
    systemUpdates: true
  };

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: number) => {
      const response = await fetch(`/api/users/${currentUserId}/notifications/${notificationId}/read`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to mark as read');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${currentUserId}/notifications`] });
      toast({ title: "تم وضع علامة كمقروء", variant: "default" });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/users/${currentUserId}/notifications/read-all`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to mark all as read');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${currentUserId}/notifications`] });
      toast({ title: "تم وضع علامة على جميع الإشعارات كمقروءة", variant: "default" });
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: async (notificationId: number) => {
      const response = await fetch(`/api/users/${currentUserId}/notifications/${notificationId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete notification');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${currentUserId}/notifications`] });
      toast({ title: "تم حذف الإشعار", variant: "default" });
    },
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like': return Heart;
      case 'comment': return MessageCircle;
      case 'follow': return Users;
      case 'review': return Star;
      case 'content': return Film;
      case 'recommendation': return Tv;
      case 'system': return Settings;
      default: return Bell;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'like': return 'text-red-500 bg-red-100 dark:bg-red-900/20';
      case 'comment': return 'text-blue-500 bg-blue-100 dark:bg-blue-900/20';
      case 'follow': return 'text-green-500 bg-green-100 dark:bg-green-900/20';
      case 'review': return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20';
      case 'content': return 'text-purple-500 bg-purple-100 dark:bg-purple-900/20';
      case 'recommendation': return 'text-indigo-500 bg-indigo-100 dark:bg-indigo-900/20';
      case 'system': return 'text-gray-500 bg-gray-100 dark:bg-gray-900/20';
      default: return 'text-gray-500 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const filterNotifications = (notifications: Notification[], filter: string) => {
    if (filter === 'all') return notifications;
    if (filter === 'unread') return notifications.filter(n => !n.isRead);
    return notifications.filter(n => n.type === filter);
  };

  const filteredNotifications = filterNotifications(mockNotifications, selectedTab);
  const unreadCount = mockNotifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Bell className="h-8 w-8 text-primary" />
              {unreadCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs flex items-center justify-center"
                >
                  {unreadCount}
                </Badge>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                الإشعارات
              </h1>
              <p className="text-slate-600 dark:text-slate-300">
                لديك {unreadCount} إشعار جديد
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => markAllAsReadMutation.mutate()}
              disabled={markAllAsReadMutation.isPending || unreadCount === 0}
              className="gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              وضع علامة على الكل كمقروء
            </Button>
          </div>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <TabsTrigger value="all" className="gap-2">
              <Bell className="h-4 w-4" />
              الكل ({mockNotifications.length})
            </TabsTrigger>
            <TabsTrigger value="unread" className="gap-2">
              <AlertCircle className="h-4 w-4" />
              غير مقروء ({unreadCount})
            </TabsTrigger>
            <TabsTrigger value="like" className="gap-2">
              <Heart className="h-4 w-4" />
              الإعجابات
            </TabsTrigger>
            <TabsTrigger value="comment" className="gap-2">
              <MessageCircle className="h-4 w-4" />
              التعليقات
            </TabsTrigger>
            <TabsTrigger value="content" className="gap-2">
              <Film className="h-4 w-4" />
              المحتوى
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab}>
            <div className="space-y-4">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notification) => {
                  const IconComponent = getNotificationIcon(notification.type);
                  const iconColor = getNotificationColor(notification.type);
                  
                  return (
                    <Card 
                      key={notification.id} 
                      className={`transition-all duration-300 hover:shadow-lg ${
                        !notification.isRead 
                          ? 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800' 
                          : 'bg-white/80 dark:bg-slate-800/80'
                      } backdrop-blur-sm border-0 shadow-xl`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className={`p-2 rounded-lg ${iconColor}`}>
                            <IconComponent className="h-5 w-5" />
                          </div>
                          
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold text-slate-900 dark:text-white">
                                {notification.title}
                              </h3>
                              <div className="flex items-center gap-2">
                                {!notification.isRead && (
                                  <Badge variant="secondary" className="text-xs">
                                    جديد
                                  </Badge>
                                )}
                                <span className="text-xs text-slate-500">
                                  {new Date(notification.timestamp).toLocaleString('ar-EG', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    day: 'numeric',
                                    month: 'short'
                                  })}
                                </span>
                              </div>
                            </div>
                            
                            <p className="text-slate-600 dark:text-slate-300">
                              {notification.message}
                            </p>
                            
                            {notification.senderName && (
                              <div className="flex items-center gap-2">
                                <img 
                                  src={notification.senderAvatar} 
                                  alt={notification.senderName}
                                  className="w-6 h-6 rounded-full"
                                />
                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                  {notification.senderName}
                                </span>
                              </div>
                            )}
                            
                            {notification.contentTitle && (
                              <div className="flex items-center gap-2">
                                <Film className="h-4 w-4 text-slate-500" />
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                  {notification.contentTitle}
                                </span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {!notification.isRead && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => markAsReadMutation.mutate(notification.id)}
                                disabled={markAsReadMutation.isPending}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteNotificationMutation.mutate(notification.id)}
                              disabled={deleteNotificationMutation.isPending}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
                  <CardContent className="p-12 text-center">
                    <Bell className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-300 mb-2">
                      لا توجد إشعارات
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400">
                      {selectedTab === 'unread' 
                        ? 'جميع إشعاراتك مقروءة' 
                        : 'لا توجد إشعارات في هذه الفئة'
                      }
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Notification Settings */}
        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              إعدادات الإشعارات
            </CardTitle>
            <CardDescription>
              تحكم في نوع الإشعارات التي تريد تلقيها
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-slate-900 dark:text-white">إعدادات عامة</h4>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">إشعارات البريد الإلكتروني</label>
                    <p className="text-xs text-slate-600 dark:text-slate-400">تلقي الإشعارات عبر البريد الإلكتروني</p>
                  </div>
                  <Switch defaultChecked={mockSettings.emailNotifications} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">الإشعارات الفورية</label>
                    <p className="text-xs text-slate-600 dark:text-slate-400">تلقي إشعارات فورية في المتصفح</p>
                  </div>
                  <Switch defaultChecked={mockSettings.pushNotifications} />
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-slate-900 dark:text-white">أنواع الإشعارات</h4>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">الإعجابات والتفاعلات</label>
                    <p className="text-xs text-slate-600 dark:text-slate-400">عند إعجاب أحد بمراجعاتك</p>
                  </div>
                  <Switch defaultChecked={mockSettings.likes} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">التعليقات الجديدة</label>
                    <p className="text-xs text-slate-600 dark:text-slate-400">عند وجود تعليقات جديدة</p>
                  </div>
                  <Switch defaultChecked={mockSettings.comments} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">المحتوى الجديد</label>
                    <p className="text-xs text-slate-600 dark:text-slate-400">عند إضافة أفلام ومسلسلات جديدة</p>
                  </div>
                  <Switch defaultChecked={mockSettings.newContent} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">التوصيات الشخصية</label>
                    <p className="text-xs text-slate-600 dark:text-slate-400">توصيات بناءً على تفضيلاتك</p>
                  </div>
                  <Switch defaultChecked={mockSettings.recommendations} />
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex justify-end">
              <Button className="gap-2">
                <Settings className="h-4 w-4" />
                حفظ الإعدادات
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}