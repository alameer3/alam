import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useAddToFavorites, useRemoveFromFavorites, useFavorites, useIncrementViewCount } from "@/hooks/useUserInteractions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Play, 
  Heart, 
  Download, 
  Share2, 
  Star, 
  Calendar, 
  Clock, 
  Eye,
  ArrowLeft,
  Languages,
  MonitorSpeaker,
  MessageSquare
} from "lucide-react";
import Header from "@/components/layout/header";
import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import { AdvancedVideoPlayer } from "@/components/ui/advanced-video-player";
import { WatchProgressTracker, useWatchProgress } from "@/components/ui/watch-progress-tracker";
import { ContinueWatchingDialog } from "@/components/ui/continue-watching-dialog";
import CommentsSection from "@/components/user/comments-section";
import ReviewsSection from "@/components/reviews/ReviewsSection";
import EnhancedContentDetail from '@/components/content/enhanced-content-detail';
import { Content } from "@shared/schema";
import { cn } from "@/lib/utils";

export default function ContentDetail() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [showComments, setShowComments] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [currentVideoTime, setCurrentVideoTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [showContinueDialog, setShowContinueDialog] = useState(false);
  
  // Get content ID from URL params (would normally come from router)
  const contentId = new URLSearchParams(window.location.search).get('id');
  
  const { data: content, isLoading } = useQuery({
    queryKey: ["/api/content", contentId],
    enabled: !!contentId,
  });

  const { savedProgress, clearProgress } = useWatchProgress(content?.id || 0);

  const { data: favoritesData } = useFavorites(user?.id);
  const addToFavoritesMutation = useAddToFavorites(user?.id);
  const removeFromFavoritesMutation = useRemoveFromFavorites(user?.id);
  const incrementViewMutation = useIncrementViewCount();

  const isFavorite = favoritesData?.content?.some((fav: Content) => fav.id === content?.id);

  const handlePlay = async () => {
    if (content) {
      if (user) {
        await incrementViewMutation.mutateAsync(content.id);
      }
      
      // التحقق من وجود تقدم محفوظ
      if (savedProgress && savedProgress.currentTime > 60) { // أكثر من دقيقة
        setShowContinueDialog(true);
      } else {
        setSelectedContent(content);
        setShowPlayer(true);
      }
    }
  };

  const handleContinueWatching = () => {
    if (content && savedProgress) {
      setSelectedContent(content);
      setCurrentVideoTime(savedProgress.currentTime);
      setShowPlayer(true);
      setShowContinueDialog(false);
    }
  };

  const handleRestartWatching = () => {
    if (content) {
      clearProgress();
      setSelectedContent(content);
      setCurrentVideoTime(0);
      setShowPlayer(true);
      setShowContinueDialog(false);
    }
  };

  const handleVideoTimeUpdate = (currentTime: number, duration: number) => {
    setCurrentVideoTime(currentTime);
    setVideoDuration(duration);
  };

  const handleFavoriteToggle = async () => {
    if (!user || !content) return;

    if (isFavorite) {
      await removeFromFavoritesMutation.mutateAsync(content.id);
    } else {
      await addToFavoritesMutation.mutateAsync(content.id);
    }
  };

  const handleDownload = () => {
    if (content?.downloadUrl) {
      window.open(content.downloadUrl, '_blank');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: content?.titleArabic || content?.title,
          text: content?.descriptionArabic || content?.description,
          url: window.location.href,
        });
      } catch (error) {
        // Handle sharing error silently
      }
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
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
      case 'movie': return 'فيلم';
      case 'series': return 'مسلسل';
      case 'tv': return 'تلفزيون';
      case 'misc': return 'متنوع';
      default: return type;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <Navigation />
        <div className="container mx-auto p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="aspect-video bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-32 bg-gray-200 rounded"></div>
                <div className="h-24 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen">
        <Header />
        <Navigation />
        <div className="container mx-auto p-6">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">المحتوى غير موجود</h1>
            <p className="text-gray-600 mb-4">لم يتم العثور على المحتوى المطلوب</p>
            <Button onClick={() => setLocation('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              العودة للصفحة الرئيسية
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen" dir="rtl">
      <Header />
      <Navigation />
      
      <div className="container mx-auto p-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm text-gray-600">
          <Button variant="ghost" size="sm" onClick={() => setLocation('/')}>
            الصفحة الرئيسية
          </Button>
          <span>/</span>
          <Button variant="ghost" size="sm" onClick={() => setLocation(`/${content.type}s`)}>
            {getTypeName(content.type)}
          </Button>
          <span>/</span>
          <span className="font-medium">{content.titleArabic || content.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Hero Section */}
            <Card className="mb-6">
              <CardContent className="p-0">
                <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
                  {content.posterUrl ? (
                    <img
                      src={content.posterUrl}
                      alt={content.titleArabic || content.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Play className="h-24 w-24 text-gray-400" />
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Button
                      size="lg"
                      className="bg-red-600 hover:bg-red-700 text-white rounded-full p-6"
                      onClick={handlePlay}
                    >
                      <Play className="h-8 w-8" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Content Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Badge className={cn("text-sm", getTypeColor(content.type))}>
                    {getTypeName(content.type)}
                  </Badge>
                  <Badge variant="outline" className="text-sm">
                    {content.quality}
                  </Badge>
                  {content.rating && (
                    <Badge className="text-sm bg-yellow-500 text-white">
                      <Star className="h-3 w-3 fill-current ml-1" />
                      {content.rating}
                    </Badge>
                  )}
                </div>
                
                <h1 className="text-3xl font-bold mb-2">
                  {content.titleArabic || content.title}
                </h1>
                
                <p className="text-lg text-gray-600 mb-4">
                  {content.title}
                </p>
              </div>

              {/* Description */}
              {content.description && (
                <div>
                  <h2 className="text-xl font-semibold mb-3">الوصف</h2>
                  <p className="text-gray-700 leading-relaxed">
                    {content.descriptionArabic || content.description}
                  </p>
                </div>
              )}

              {/* Details */}
              <div>
                <h2 className="text-xl font-semibold mb-3">التفاصيل</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">سنة الإنتاج:</span>
                    <span className="font-medium">{content.year}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Languages className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">اللغة:</span>
                    <span className="font-medium">{content.language}</span>
                  </div>
                  
                  {content.duration && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">المدة:</span>
                      <span className="font-medium">{content.duration} دقيقة</span>
                    </div>
                  )}
                  
                  {content.episodes && content.episodes > 0 && (
                    <div className="flex items-center gap-2">
                      <MonitorSpeaker className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">الحلقات:</span>
                      <span className="font-medium">{content.episodes} حلقة</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Enhanced Content Details */}
              <EnhancedContentDetail contentId={content.id} />

              {/* Reviews Section */}
              <Separator />
              <div>
                <ReviewsSection contentId={content.id} />
              </div>

              {/* Comments Section */}
              <Separator />
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">التعليقات</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowComments(!showComments)}
                  >
                    <MessageSquare className="h-4 w-4 ml-2" />
                    {showComments ? 'إخفاء التعليقات' : 'عرض التعليقات'}
                  </Button>
                </div>
                
                {showComments && (
                  <CommentsSection
                    contentId={content.id}
                    contentTitle={content.titleArabic || content.title}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <Card>
              <CardHeader>
                <CardTitle>الإجراءات</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full bg-red-600 hover:bg-red-700"
                  onClick={handlePlay}
                >
                  <Play className="h-4 w-4 ml-2" />
                  تشغيل الآن
                </Button>
                
                {user && (
                  <Button
                    variant={isFavorite ? "default" : "outline"}
                    className={cn(
                      "w-full",
                      isFavorite && "bg-red-600 hover:bg-red-700"
                    )}
                    onClick={handleFavoriteToggle}
                    disabled={addToFavoritesMutation.isPending || removeFromFavoritesMutation.isPending}
                  >
                    <Heart className={cn("h-4 w-4 ml-2", isFavorite && "fill-current")} />
                    {isFavorite ? "إزالة من المفضلة" : "إضافة للمفضلة"}
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4 ml-2" />
                  مشاركة
                </Button>
                
                {content.downloadUrl && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleDownload}
                  >
                    <Download className="h-4 w-4 ml-2" />
                    تحميل
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Additional Info */}
            <Card>
              <CardHeader>
                <CardTitle>معلومات إضافية</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">الجودة:</span>
                    <Badge variant="outline">{content.quality}</Badge>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">الدقة:</span>
                    <span className="text-sm font-medium">{content.resolution}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">تاريخ الإضافة:</span>
                    <span className="text-sm font-medium">
                      {new Date(content.createdAt).toLocaleDateString('ar-SA')}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">آخر تحديث:</span>
                    <span className="text-sm font-medium">
                      {new Date(content.updatedAt).toLocaleDateString('ar-SA')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Advanced Video Player Modal */}
      {selectedContent && showPlayer && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <div className="relative w-full h-full max-w-6xl">
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
              onClick={() => {
                setSelectedContent(null);
                setShowPlayer(false);
              }}
            >
              ✕
            </Button>
            
            <AdvancedVideoPlayer
              src={selectedContent.videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"}
              poster={selectedContent.posterUrl}
              title={selectedContent.titleArabic || selectedContent.title}
              qualities={[
                { label: "720p HD", value: "720p", url: selectedContent.videoUrl || "" },
                { label: "1080p FHD", value: "1080p", url: selectedContent.videoUrl || "" },
                { label: "4K UHD", value: "4k", url: selectedContent.videoUrl || "" }
              ]}
              subtitles={[
                { label: "العربية", language: "ar", url: "" },
                { label: "English", language: "en", url: "" }
              ]}
              onTimeUpdate={handleVideoTimeUpdate}
              initialTime={currentVideoTime}
              className="w-full h-full"
            />
            
            {/* Watch Progress Tracker */}
            <WatchProgressTracker
              contentId={selectedContent.id}
              currentTime={currentVideoTime}
              duration={videoDuration}
              title={selectedContent.titleArabic || selectedContent.title}
            />
          </div>
        </div>
      )}

      {/* Continue Watching Dialog */}
      <ContinueWatchingDialog
        isOpen={showContinueDialog}
        onClose={() => setShowContinueDialog(false)}
        onContinue={handleContinueWatching}
        onRestart={handleRestartWatching}
        title={content?.titleArabic || content?.title || ""}
        currentTime={savedProgress?.currentTime || 0}
        duration={savedProgress?.duration || 0}
      />

      <Footer />
    </div>
  );
}