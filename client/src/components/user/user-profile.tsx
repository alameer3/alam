import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useFavorites, useUserStats } from "@/hooks/useUserInteractions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  User, 
  Heart, 
  Clock, 
  MessageSquare, 
  Star, 
  Settings, 
  Calendar,
  Mail,
  Shield,
  Play
} from "lucide-react";
import { Content } from "@shared/schema";

interface UserProfileProps {
  userId?: number;
  onContentSelect?: (content: Content) => void;
}

export default function UserProfile({ userId, onContentSelect }: UserProfileProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  
  const profileUser = userId ? null : user; // For now, only show current user
  const { data: favoritesData } = useFavorites(profileUser?.id);
  const { data: statsData } = useUserStats(profileUser?.id);

  if (!profileUser) {
    return (
      <div className="text-center py-12">
        <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">الملف الشخصي غير متوفر</h2>
        <p className="text-gray-600">يرجى تسجيل الدخول لعرض الملف الشخصي</p>
      </div>
    );
  }

  const getInitials = (firstName?: string, lastName?: string, username?: string) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`;
    }
    if (username) {
      return username.substring(0, 2).toUpperCase();
    }
    return "المستخدم";
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'movie': return 'bg-blue-500';
      case 'series': return 'bg-green-500';
      case 'tv': return 'bg-purple-500';
      case 'misc': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'movie': return 'أفلام';
      case 'series': return 'مسلسلات';
      case 'tv': return 'تلفزيون';
      case 'misc': return 'متنوع';
      default: return type;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6" dir="rtl">
      {/* Profile Header */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profileUser.profileImageUrl} alt={profileUser.username} />
              <AvatarFallback className="text-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {getInitials(profileUser.firstName, profileUser.lastName, profileUser.username)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold">
                  {profileUser.firstName && profileUser.lastName 
                    ? `${profileUser.firstName} ${profileUser.lastName}`
                    : profileUser.username
                  }
                </h1>
                {profileUser.isAdmin && (
                  <Badge className="bg-purple-600 text-white">
                    <Shield className="h-3 w-3 mr-1" />
                    مدير
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {profileUser.email}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  انضم في {new Date(profileUser.createdAt).toLocaleDateString('ar-SA')}
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-500">{statsData?.favorites || 0}</div>
                  <div className="text-sm text-gray-600">المفضلة</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">{statsData?.watchHistory || 0}</div>
                  <div className="text-sm text-gray-600">المشاهدات</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">{statsData?.comments || 0}</div>
                  <div className="text-sm text-gray-600">التعليقات</div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                تعديل الملف الشخصي
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="favorites">المفضلة</TabsTrigger>
          <TabsTrigger value="activity">النشاط</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Favorites Overview */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  المفضلة الحديثة
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setActiveTab("favorites")}>
                  عرض الكل
                </Button>
              </CardHeader>
              <CardContent>
                {favoritesData?.content?.length > 0 ? (
                  <div className="space-y-3">
                    {favoritesData.content.slice(0, 3).map((content: Content) => (
                      <div
                        key={content.id}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                        onClick={() => onContentSelect?.(content)}
                      >
                        <div className="w-12 h-16 bg-gray-200 rounded overflow-hidden">
                          {content.posterUrl ? (
                            <img
                              src={content.posterUrl}
                              alt={content.titleArabic || content.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Play className="h-4 w-4 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">
                            {content.titleArabic || content.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={`text-xs ${getTypeColor(content.type)}`}>
                              {getTypeName(content.type)}
                            </Badge>
                            {content.rating && (
                              <div className="flex items-center gap-1 text-xs">
                                <Star className="h-3 w-3 fill-current text-yellow-500" />
                                {content.rating}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Heart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">لا توجد عناصر مفضلة بعد</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  النشاط الأخير
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                      <Heart className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">أضيف للمفضلة</p>
                      <p className="text-xs text-gray-500">منذ ساعة</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <Play className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">شاهد محتوى جديد</p>
                      <p className="text-xs text-gray-500">منذ 3 ساعات</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <MessageSquare className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">علق على محتوى</p>
                      <p className="text-xs text-gray-500">منذ يوم</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="favorites" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                جميع المفضلة ({favoritesData?.content?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                {favoritesData?.content?.length > 0 ? (
                  <div className="space-y-4">
                    {favoritesData.content.map((content: Content) => (
                      <div
                        key={content.id}
                        className="flex items-center gap-4 p-4 rounded-lg border hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => onContentSelect?.(content)}
                      >
                        <div className="w-20 h-28 bg-gray-200 rounded overflow-hidden">
                          {content.posterUrl ? (
                            <img
                              src={content.posterUrl}
                              alt={content.titleArabic || content.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Play className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge className={`text-xs ${getTypeColor(content.type)}`}>
                              {getTypeName(content.type)}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {content.quality}
                            </Badge>
                            {content.rating && (
                              <Badge className="text-xs bg-yellow-500">
                                <Star className="h-3 w-3 fill-current ml-1" />
                                {content.rating}
                              </Badge>
                            )}
                          </div>
                          
                          <h3 className="font-medium text-lg">
                            {content.titleArabic || content.title}
                          </h3>
                          
                          <p className="text-sm text-gray-600">
                            {content.title}
                          </p>
                          
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>{content.year}</span>
                            <span>•</span>
                            <span>{content.language}</span>
                            {content.duration && (
                              <>
                                <span>•</span>
                                <span>{content.duration} دقيقة</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">لا توجد عناصر مفضلة</h3>
                    <p className="text-gray-500">ابدأ بإضافة محتوى إلى قائمة المفضلة لديك</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                سجل النشاط
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-12">
                  <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">لا يوجد نشاط بعد</h3>
                  <p className="text-gray-500">ابدأ بتصفح المحتوى وسيظهر نشاطك هنا</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}