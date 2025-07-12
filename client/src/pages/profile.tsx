import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { EnhancedContentCard } from "@/components/content/enhanced-content-card";
import { 
  User, 
  Settings, 
  Heart, 
  Star, 
  Clock, 
  Edit, 
  Camera, 
  Mail, 
  Shield,
  Calendar,
  MapPin,
  Film,
  Tv,
  Trophy,
  Activity,
  Eye,
  MessageCircle,
  Bookmark,
  Download,
  Bell,
  Lock,
  Globe,
  Monitor,
  Smartphone,
  Save
} from "lucide-react";

interface UserProfile {
  id: number;
  username: string;
  email: string;
  avatar: string;
  bio: string;
  location: string;
  joinDate: string;
  isVerified: boolean;
  stats: {
    watchedMovies: number;
    watchedSeries: number;
    favorites: number;
    reviews: number;
    lists: number;
    watchTime: number;
  };
  preferences: {
    language: string;
    theme: string;
    notifications: boolean;
    autoplay: boolean;
    quality: string;
    subtitles: boolean;
  };
  recentActivity: Array<{
    id: number;
    type: string;
    title: string;
    timestamp: string;
  }>;
}

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTab, setSelectedTab] = useState("overview");
  const currentUserId = 1;

  const { data: profile, isLoading } = useQuery<UserProfile>({
    queryKey: [`/api/users/${currentUserId}/profile`],
  });

  // Mock data for demonstration
  const mockProfile: UserProfile = {
    id: 1,
    username: "مستخدم Yemen Flix",
    email: "user@yemenflix.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user",
    bio: "محب للسينما والمسلسلات الجيدة. أستمتع بمشاهدة الأفلام الكلاسيكية والحديثة على حد سواء.",
    location: "صنعاء، اليمن",
    joinDate: "2024-01-15",
    isVerified: true,
    stats: {
      watchedMovies: 127,
      watchedSeries: 43,
      favorites: 25,
      reviews: 18,
      lists: 5,
      watchTime: 2847 // in hours
    },
    preferences: {
      language: "ar",
      theme: "dark",
      notifications: true,
      autoplay: false,
      quality: "1080p",
      subtitles: true
    },
    recentActivity: [
      {
        id: 1,
        type: "watch",
        title: "شاهد فيلم The Dark Knight",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
      },
      {
        id: 2,
        type: "review",
        title: "كتب مراجعة لفيلم Inception",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
      },
      {
        id: 3,
        type: "favorite",
        title: "أضاف Breaking Bad للمفضلة",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString()
      }
    ]
  };

  const updateProfileMutation = useMutation({
    mutationFn: async (data: Partial<UserProfile>) => {
      const response = await fetch(`/api/users/${currentUserId}/profile`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update profile');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${currentUserId}/profile`] });
      setIsEditing(false);
      toast({ title: "تم تحديث الملف الشخصي بنجاح", variant: "default" });
    },
  });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'watch': return Eye;
      case 'review': return MessageCircle;
      case 'favorite': return Heart;
      case 'list': return Bookmark;
      default: return Activity;
    }
  };

  const formatWatchTime = (hours: number) => {
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days} يوم و ${remainingHours} ساعة`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Profile Header */}
        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
          <CardContent className="relative -mt-16 pb-6">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-white dark:border-slate-800 shadow-lg">
                  <AvatarImage src={mockProfile.avatar} alt={mockProfile.username} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl">
                    {mockProfile.username.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <Button 
                  size="sm" 
                  className="absolute bottom-0 right-0 rounded-full h-10 w-10 p-0"
                  disabled={updateProfileMutation.isPending}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      {mockProfile.username}
                      {mockProfile.isVerified && (
                        <Badge variant="secondary" className="gap-1">
                          <Shield className="h-3 w-3" />
                          موثق
                        </Badge>
                      )}
                    </h1>
                    <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {mockProfile.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {mockProfile.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        عضو منذ {new Date(mockProfile.joinDate).toLocaleDateString('ar-EG')}
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="text-slate-700 dark:text-slate-300">
                  {mockProfile.bio}
                </p>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={() => setIsEditing(!isEditing)}
                    className="gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    {isEditing ? "إلغاء التعديل" : "تعديل الملف الشخصي"}
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Settings className="h-4 w-4" />
                    الإعدادات
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <TabsTrigger value="overview" className="gap-2">
              <User className="h-4 w-4" />
              نظرة عامة
            </TabsTrigger>
            <TabsTrigger value="stats" className="gap-2">
              <Trophy className="h-4 w-4" />
              الإحصائيات
            </TabsTrigger>
            <TabsTrigger value="activity" className="gap-2">
              <Activity className="h-4 w-4" />
              النشاط
            </TabsTrigger>
            <TabsTrigger value="preferences" className="gap-2">
              <Settings className="h-4 w-4" />
              التفضيلات
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {isEditing ? (
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle>تعديل الملف الشخصي</CardTitle>
                  <CardDescription>
                    قم بتحديث معلوماتك الشخصية
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="username">اسم المستخدم</Label>
                      <Input id="username" defaultValue={mockProfile.username} />
                    </div>
                    <div>
                      <Label htmlFor="email">البريد الإلكتروني</Label>
                      <Input id="email" type="email" defaultValue={mockProfile.email} />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="location">الموقع</Label>
                    <Input id="location" defaultValue={mockProfile.location} />
                  </div>
                  
                  <div>
                    <Label htmlFor="bio">نبذة شخصية</Label>
                    <Textarea id="bio" defaultValue={mockProfile.bio} rows={4} />
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      إلغاء
                    </Button>
                    <Button onClick={() => updateProfileMutation.mutate({})}>
                      <Save className="h-4 w-4 mr-2" />
                      حفظ التغييرات
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Stats Cards */}
                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
                  <CardContent className="p-6 text-center">
                    <Film className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {mockProfile.stats.watchedMovies}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">أفلام تمت مشاهدتها</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
                  <CardContent className="p-6 text-center">
                    <Tv className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {mockProfile.stats.watchedSeries}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">مسلسلات تمت مشاهدتها</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
                  <CardContent className="p-6 text-center">
                    <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {mockProfile.stats.favorites}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">عناصر مفضلة</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    إحصائيات المشاهدة
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>الأفلام</span>
                      <span>{mockProfile.stats.watchedMovies}</span>
                    </div>
                    <Progress value={(mockProfile.stats.watchedMovies / 200) * 100} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>المسلسلات</span>
                      <span>{mockProfile.stats.watchedSeries}</span>
                    </div>
                    <Progress value={(mockProfile.stats.watchedSeries / 100) * 100} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>المراجعات</span>
                      <span>{mockProfile.stats.reviews}</span>
                    </div>
                    <Progress value={(mockProfile.stats.reviews / 50) * 100} />
                  </div>
                  
                  <Separator />
                  
                  <div className="text-center">
                    <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <h4 className="text-lg font-semibold">إجمالي وقت المشاهدة</h4>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatWatchTime(mockProfile.stats.watchTime)}
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    إنجازات وجوائز
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <Trophy className="h-8 w-8 text-yellow-500" />
                      <div>
                        <h4 className="font-semibold">مشاهد محترف</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          شاهد أكثر من 100 فيلم
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <Star className="h-8 w-8 text-blue-500" />
                      <div>
                        <h4 className="font-semibold">ناقد بارع</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          كتب أكثر من 10 مراجعات
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <Heart className="h-8 w-8 text-purple-500" />
                      <div>
                        <h4 className="font-semibold">جامع مفضلات</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          أضاف أكثر من 20 عنصر للمفضلة
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  النشاط الأخير
                </CardTitle>
                <CardDescription>
                  آخر الأنشطة التي قمت بها على المنصة
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockProfile.recentActivity.map((activity) => {
                    const IconComponent = getActivityIcon(activity.type);
                    return (
                      <div key={activity.id} className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                          <IconComponent className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-slate-900 dark:text-white">
                            {activity.title}
                          </p>
                          <p className="text-sm text-slate-500">
                            {new Date(activity.timestamp).toLocaleString('ar-EG')}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Monitor className="h-5 w-5" />
                    تفضيلات العرض
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>التشغيل التلقائي</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        تشغيل الحلقة التالية تلقائياً
                      </p>
                    </div>
                    <Switch defaultChecked={mockProfile.preferences.autoplay} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>الترجمة</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        إظهار الترجمة افتراضياً
                      </p>
                    </div>
                    <Switch defaultChecked={mockProfile.preferences.subtitles} />
                  </div>
                  
                  <div>
                    <Label>جودة الفيديو الافتراضية</Label>
                    <select className="w-full mt-2 p-2 rounded border" defaultValue={mockProfile.preferences.quality}>
                      <option value="720p">720p HD</option>
                      <option value="1080p">1080p Full HD</option>
                      <option value="4k">4K Ultra HD</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    تفضيلات الإشعارات
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>الإشعارات العامة</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        تلقي جميع الإشعارات
                      </p>
                    </div>
                    <Switch defaultChecked={mockProfile.preferences.notifications} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>إشعارات المحتوى الجديد</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        عند إضافة محتوى جديد
                      </p>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>إشعارات التفاعل</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        عند الإعجاب بمراجعاتك
                      </p>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}