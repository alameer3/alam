import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell, 
  BellOff, 
  Star, 
  Heart, 
  MessageCircle, 
  Play, 
  Settings, 
  Check, 
  Trash2,
  Archive,
  Filter,
  MoreHorizontal
} from "lucide-react";

interface Notification {
  id: number;
  type: 'new_content' | 'favorite_update' | 'comment_reply' | 'review_like' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  data?: {
    contentId?: number;
    contentTitle?: string;
    contentPoster?: string;
    userId?: number;
    username?: string;
  };
}

interface NotificationSettings {
  newContent: boolean;
  favoriteUpdates: boolean;
  commentReplies: boolean;
  reviewLikes: boolean;
  systemNotifications: boolean;
  emailNotifications: boolean;
}

export default function Notifications() {
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const currentUserId = 1;

  const { data: notifications = [], isLoading } = useQuery<Notification[]>({
    queryKey: [`/api/users/${currentUserId}/notifications`],
  });

  const { data: settings, isLoading: settingsLoading } = useQuery<NotificationSettings>({
    queryKey: [`/api/users/${currentUserId}/notification-settings`],
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: number) => {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PUT',
      });
      if (!response.ok) throw new Error('فشل في تحديث الإشعار');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${currentUserId}/notifications`] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/users/${currentUserId}/notifications/mark-all-read`, {
        method: 'PUT',
      });
      if (!response.ok) throw new Error('فشل في تحديث الإشعارات');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${currentUserId}/notifications`] });
      toast({ title: "تم تحديد جميع الإشعارات كمقروءة", variant: "default" });
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: async (notificationId: number) => {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('فشل في حذف الإشعار');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${currentUserId}/notifications`] });
      toast({ title: "تم حذف الإشعار", variant: "default" });
    },
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: NotificationSettings) => {
      const response = await fetch(`/api/users/${currentUserId}/notification-settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });
      if (!response.ok) throw new Error('فشل في تحديث الإعدادات');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${currentUserId}/notification-settings`] });
      toast({ title: "تم تحديث إعدادات الإشعارات", variant: "default" });
    },
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_content': return Play;
      case 'favorite_update': return Heart;
      case 'comment_reply': return MessageCircle;
      case 'review_like': return Star;
      case 'system': return Bell;
      default: return Bell;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'new_content': return 'text-blue-500';
      case 'favorite_update': return 'text-red-500';
      case 'comment_reply': return 'text-green-500';
      case 'review_like': return 'text-yellow-500';
      case 'system': return 'text-purple-500';
      default: return 'text-gray-500';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.isRead;
    if (filter === 'read') return notification.isRead;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Mock notification data for demonstration
  const mockNotifications: Notification[] = [
    {
      id: 1,
      type: 'new_content',
      title: 'محتوى جديد متاح',
      message: 'تم إضافة فيلم جديد "الفارس الأسود 2" إلى المنصة',
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      data: { contentId: 5, contentTitle: 'الفارس الأسود 2' }
    },
    {
      id: 2,
      type: 'comment_reply',
      title: 'رد على تعليقك',
      message: 'رد أحمد على تعليقك في فيلم "Breaking Bad"',
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      data: { contentId: 2, contentTitle: 'Breaking Bad', username: 'أحمد' }
    },
    {
      id: 3,
      type: 'review_like',
      title: 'إعجاب بمراجعتك',
      message: 'أعجب 5 أشخاص بمراجعتك لفيلم "الفارس الأسود"',
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      data: { contentId: 1, contentTitle: 'الفارس الأسود' }
    },
    {
      id: 4,
      type: 'system',
      title: 'تحديث النظام',
      message: 'تم تحديث منصة Yemen Flix بمزايا جديدة',
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    }
  ];

  const mockSettings: NotificationSettings = {
    newContent: true,
    favoriteUpdates: true,
    commentReplies: true,
    reviewLikes: false,
    systemNotifications: true,
    emailNotifications: false,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="h-20 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Bell className="h-8 w-8 text-blue-500" />
                <div>
                  <CardTitle className="text-2xl">الإشعارات</CardTitle>
                  <CardDescription>
                    لديك {unreadCount} إشعار غير مقروء
                  </CardDescription>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => markAllAsReadMutation.mutate()}
                  disabled={markAllAsReadMutation.isPending || unreadCount === 0}
                  className="gap-2"
                >
                  <Check className="h-4 w-4" />
                  تحديد الكل كمقروء
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="notifications" className="space-y-6">
          <TabsList className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              الإشعارات
              {unreadCount > 0 && (
                <Badge variant="destructive" className="h-5 px-2 text-xs">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              الإعدادات
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notifications">
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>جميع الإشعارات</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={filter === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilter('all')}
                    >
                      الكل
                    </Button>
                    <Button
                      variant={filter === 'unread' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilter('unread')}
                    >
                      غير مقروء ({unreadCount})
                    </Button>
                    <Button
                      variant={filter === 'read' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilter('read')}
                    >
                      مقروء
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockNotifications.length > 0 ? (
                  mockNotifications.map((notification) => {
                    const IconComponent = getNotificationIcon(notification.type);
                    const iconColor = getNotificationColor(notification.type);
                    
                    return (
                      <div
                        key={notification.id}
                        className={`flex items-start gap-4 p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                          notification.isRead 
                            ? 'bg-slate-50 dark:bg-slate-700/30 border-slate-200 dark:border-slate-700' 
                            : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${
                          notification.isRead 
                            ? 'bg-slate-100 dark:bg-slate-600' 
                            : 'bg-blue-100 dark:bg-blue-900/50'
                        }`}>
                          <IconComponent className={`h-5 w-5 ${iconColor}`} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <h4 className={`font-semibold ${
                                notification.isRead 
                                  ? 'text-slate-700 dark:text-slate-300' 
                                  : 'text-slate-900 dark:text-white'
                              }`}>
                                {notification.title}
                              </h4>
                              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                {notification.message}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs text-slate-500">
                                  {new Date(notification.createdAt).toLocaleString('ar-EG', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                                {!notification.isRead && (
                                  <Badge variant="secondary" className="text-xs">
                                    جديد
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-1">
                              {!notification.isRead && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsReadMutation.mutate(notification.id)}
                                  className="h-8 w-8 p-0"
                                  title="تحديد كمقروء"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteNotificationMutation.mutate(notification.id)}
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                title="حذف الإشعار"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12">
                    <BellOff className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-300">
                      لا توجد إشعارات
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400">
                      ستظهر إشعاراتك هنا عند توفرها
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle>إعدادات الإشعارات</CardTitle>
                <CardDescription>
                  تحكم في أنواع الإشعارات التي تريد استلامها
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="newContent" className="text-base font-medium">
                        المحتوى الجديد
                      </Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        إشعارات عند إضافة أفلام ومسلسلات جديدة
                      </p>
                    </div>
                    <Switch
                      id="newContent"
                      checked={mockSettings.newContent}
                      onCheckedChange={(checked) => 
                        updateSettingsMutation.mutate({...mockSettings, newContent: checked})
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="favoriteUpdates" className="text-base font-medium">
                        تحديثات المفضلة
                      </Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        إشعارات عند تحديث المحتوى في قائمة المفضلة
                      </p>
                    </div>
                    <Switch
                      id="favoriteUpdates"
                      checked={mockSettings.favoriteUpdates}
                      onCheckedChange={(checked) => 
                        updateSettingsMutation.mutate({...mockSettings, favoriteUpdates: checked})
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="commentReplies" className="text-base font-medium">
                        ردود التعليقات
                      </Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        إشعارات عند الرد على تعليقاتك
                      </p>
                    </div>
                    <Switch
                      id="commentReplies"
                      checked={mockSettings.commentReplies}
                      onCheckedChange={(checked) => 
                        updateSettingsMutation.mutate({...mockSettings, commentReplies: checked})
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="reviewLikes" className="text-base font-medium">
                        إعجابات المراجعات
                      </Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        إشعارات عند الإعجاب بمراجعاتك
                      </p>
                    </div>
                    <Switch
                      id="reviewLikes"
                      checked={mockSettings.reviewLikes}
                      onCheckedChange={(checked) => 
                        updateSettingsMutation.mutate({...mockSettings, reviewLikes: checked})
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="systemNotifications" className="text-base font-medium">
                        إشعارات النظام
                      </Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        إشعارات التحديثات والصيانة
                      </p>
                    </div>
                    <Switch
                      id="systemNotifications"
                      checked={mockSettings.systemNotifications}
                      onCheckedChange={(checked) => 
                        updateSettingsMutation.mutate({...mockSettings, systemNotifications: checked})
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emailNotifications" className="text-base font-medium">
                        إشعارات البريد الإلكتروني
                      </Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        استلام الإشعارات عبر البريد الإلكتروني
                      </p>
                    </div>
                    <Switch
                      id="emailNotifications"
                      checked={mockSettings.emailNotifications}
                      onCheckedChange={(checked) => 
                        updateSettingsMutation.mutate({...mockSettings, emailNotifications: checked})
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}