import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { EnhancedContentCard } from "@/components/content/enhanced-content-card";
import { User, Heart, Clock, MessageCircle, Star, Settings, Edit, Save, X } from "lucide-react";
import type { Content, User as UserType } from "@shared/schema";

interface UserStats {
  favorites: number;
  watchHistory: number;
  comments: number;
  reviewsCount?: number;
  totalWatchTime?: number;
}

interface UserProfile extends UserType {
  joinedDate?: string;
  lastActive?: string;
  bio?: string;
  favoriteGenres?: string[];
}

export default function Profile() {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    bio: ""
  });

  // Mock current user ID - في التطبيق الحقيقي سيأتي من نظام المصادقة
  const currentUserId = 1;

  const { data: userProfile, isLoading: profileLoading } = useQuery<UserProfile>({
    queryKey: [`/api/users/${currentUserId}/profile`],
  });

  const { data: userStats, isLoading: statsLoading } = useQuery<UserStats>({
    queryKey: [`/api/users/${currentUserId}/stats`],
  });

  const { data: favorites = [], isLoading: favoritesLoading } = useQuery<Content[]>({
    queryKey: [`/api/users/${currentUserId}/favorites`],
  });

  const { data: watchHistory = [], isLoading: historyLoading } = useQuery<Content[]>({
    queryKey: [`/api/users/${currentUserId}/watch-history`],
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: Partial<UserProfile>) => {
      const response = await fetch(`/api/users/${currentUserId}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('فشل في تحديث الملف الشخصي');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${currentUserId}/profile`] });
      toast({ title: "تم تحديث الملف الشخصي بنجاح", variant: "default" });
      setEditMode(false);
    },
    onError: () => {
      toast({ title: "خطأ في تحديث الملف الشخصي", variant: "destructive" });
    },
  });

  const handleEditToggle = () => {
    if (editMode) {
      setEditMode(false);
    } else {
      setFormData({
        username: userProfile?.username || "",
        email: userProfile?.email || "",
        bio: userProfile?.bio || ""
      });
      setEditMode(true);
    }
  };

  const handleSave = () => {
    updateProfileMutation.mutate(formData);
  };

  if (profileLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
            <div className="md:col-span-2 h-64 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const completionPercentage = Math.min(
    ((userStats?.favorites || 0) + (userStats?.watchHistory || 0)) * 10, 100
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Profile Card */}
        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar className="w-24 h-24 ring-4 ring-blue-500/20">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userProfile?.username}`} />
                <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {userProfile?.username?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    {editMode ? (
                      <div className="space-y-2">
                        <Input
                          value={formData.username}
                          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                          className="text-xl font-bold"
                          placeholder="اسم المستخدم"
                        />
                        <Input
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="البريد الإلكتروني"
                        />
                      </div>
                    ) : (
                      <>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                          {userProfile?.username || "مستخدم Yemen Flix"}
                        </h1>
                        <p className="text-slate-600 dark:text-slate-300">
                          {userProfile?.email || "user@yemenflix.com"}
                        </p>
                      </>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    {editMode ? (
                      <>
                        <Button onClick={handleSave} disabled={updateProfileMutation.isPending} size="sm">
                          <Save className="h-4 w-4 mr-2" />
                          حفظ
                        </Button>
                        <Button onClick={handleEditToggle} variant="outline" size="sm">
                          <X className="h-4 w-4 mr-2" />
                          إلغاء
                        </Button>
                      </>
                    ) : (
                      <Button onClick={handleEditToggle} variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        تعديل
                      </Button>
                    )}
                  </div>
                </div>

                {editMode ? (
                  <Textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="نبذة عنك..."
                    className="min-h-20"
                  />
                ) : (
                  <p className="text-slate-600 dark:text-slate-300">
                    {userProfile?.bio || "مرحباً! أنا عضو في منصة Yemen Flix وأحب مشاهدة الأفلام والمسلسلات العربية."}
                  </p>
                )}

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                    <User className="h-3 w-3 mr-1" />
                    عضو منذ {userProfile?.joinedDate || "يناير 2024"}
                  </Badge>
                  <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                    نشط اليوم
                  </Badge>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {userStats?.favorites || 0}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-300">المفضلة</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {userStats?.watchHistory || 0}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-300">المشاهدات</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {userStats?.comments || 0}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-300">التعليقات</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {userStats?.reviewsCount || 0}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-300">المراجعات</div>
              </div>
            </div>

            {/* Progress Section */}
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-300">مستوى النشاط</span>
                <span className="text-slate-600 dark:text-slate-300">{completionPercentage}%</span>
              </div>
              <Progress value={completionPercentage} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Tabs Content */}
        <Tabs defaultValue="favorites" className="space-y-6">
          <TabsList className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <TabsTrigger value="favorites" className="gap-2">
              <Heart className="h-4 w-4" />
              المفضلة ({userStats?.favorites || 0})
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <Clock className="h-4 w-4" />
              سجل المشاهدة ({userStats?.watchHistory || 0})
            </TabsTrigger>
            <TabsTrigger value="activity" className="gap-2">
              <MessageCircle className="h-4 w-4" />
              النشاطات
            </TabsTrigger>
          </TabsList>

          <TabsContent value="favorites">
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  المحتوى المفضل
                </CardTitle>
                <CardDescription>
                  الأفلام والمسلسلات التي أضفتها إلى المفضلة
                </CardDescription>
              </CardHeader>
              <CardContent>
                {favoritesLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="h-48 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : favorites.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favorites.map((content) => (
                      <EnhancedContentCard
                        key={content.id}
                        content={content}
                        showActions={true}
                        className="hover:scale-105 transition-transform duration-200"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Heart className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-300">
                      لا توجد عناصر مفضلة بعد
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400">
                      ابدأ بإضافة أفلام ومسلسلات إلى المفضلة لتظهر هنا
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  سجل المشاهدة
                </CardTitle>
                <CardDescription>
                  المحتوى الذي شاهدته مؤخراً
                </CardDescription>
              </CardHeader>
              <CardContent>
                {historyLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-20 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : watchHistory.length > 0 ? (
                  <div className="space-y-4">
                    {watchHistory.map((content) => (
                      <div key={content.id} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <img
                          src={content.posterUrl || "/placeholder-poster.jpg"}
                          alt={content.title}
                          className="w-16 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900 dark:text-white">
                            {content.title}
                          </h4>
                          <p className="text-sm text-slate-600 dark:text-slate-300">
                            {content.type} • {content.year}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Progress value={Math.random() * 100} className="h-1 flex-1" />
                            <span className="text-xs text-slate-500">
                              {Math.floor(Math.random() * 100)}%
                            </span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          متابعة المشاهدة
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Clock className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-300">
                      لا يوجد سجل مشاهدة
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400">
                      ابدأ بمشاهدة المحتوى ليظهر سجل المشاهدة هنا
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-green-500" />
                  النشاطات الأخيرة
                </CardTitle>
                <CardDescription>
                  تعليقاتك ومراجعاتك الأخيرة
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Sample activity items */}
                  <div className="flex gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        <span className="font-semibold">قمت بإضافة تعليق</span> على فيلم "الفارس الأسود"
                      </p>
                      <p className="text-xs text-slate-500 mt-1">منذ ساعتين</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        <span className="font-semibold">أضفت إلى المفضلة</span> مسلسل "Breaking Bad"
                      </p>
                      <p className="text-xs text-slate-500 mt-1">منذ يوم واحد</p>
                    </div>
                  </div>

                  <div className="flex gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        <span className="font-semibold">قيمت بـ 5 نجوم</span> فيلم "الفارس الأسود"
                      </p>
                      <p className="text-xs text-slate-500 mt-1">منذ 3 أيام</p>
                    </div>
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