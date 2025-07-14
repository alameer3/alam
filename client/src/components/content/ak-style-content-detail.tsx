import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  MonitorSpeaker,
  MessageSquare,
  Film,
  Tv
} from "lucide-react";
import { Content } from "@shared/schema";
import { cn } from "@/lib/utils";

interface AkStyleContentDetailProps {
  contentId: string;
}

export function AkStyleContentDetail({ contentId }: AkStyleContentDetailProps) {
  const [, setLocation] = useLocation();
  const [showPlayer, setShowPlayer] = useState(false);

  const { data: content, isLoading } = useQuery({
    queryKey: ["/api/content", contentId],
    enabled: !!contentId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-white text-2xl mb-4">المحتوى غير موجود</h1>
          <Button onClick={() => setLocation("/")} className="bg-orange-500 hover:bg-orange-600">
            العودة للرئيسية
          </Button>
        </div>
      </div>
    );
  }

  const getQualityBadgeColor = (quality: string) => {
    switch (quality?.toLowerCase()) {
      case '4k': return 'bg-purple-600';
      case 'hd': case '1080p': return 'bg-blue-600';
      case '720p': return 'bg-green-600';
      case 'sd': case '480p': return 'bg-orange-600';
      default: return 'bg-gray-600';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'movie': case 'movies': return Film;
      case 'series': return Tv;
      case 'tv': case 'television': return MonitorSpeaker;
      default: return Film;
    }
  };

  const TypeIcon = getTypeIcon(content.type);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>

      {/* Header with Back Button */}
      <div className="relative z-10 p-6 flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={() => setLocation("/")}
          className="text-white hover:bg-white/10 flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          العودة
        </Button>
        
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            className="text-white hover:bg-white/10"
          >
            <Share2 className="w-5 h-5" />
          </Button>
          <Button 
            variant="ghost" 
            className="text-white hover:bg-white/10"
          >
            <Heart className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Poster */}
          <div className="lg:col-span-1">
            <div className="relative group">
              <img
                src={content.posterUrl || '/assets/placeholder-poster.jpg'}
                alt={content.titleArabic || content.title}
                className="w-full max-w-md mx-auto rounded-2xl shadow-2xl transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button 
                  onClick={() => setShowPlayer(true)}
                  className="bg-orange-500 hover:bg-orange-600 text-white rounded-full p-4 shadow-2xl"
                >
                  <Play className="w-8 h-8" />
                </Button>
              </div>
              
              {/* Quality Badge */}
              {content.quality && (
                <div className={cn(
                  "absolute top-4 right-4 px-3 py-1 rounded-full text-white text-sm font-bold shadow-lg",
                  getQualityBadgeColor(content.quality)
                )}>
                  {content.quality}
                </div>
              )}
            </div>
          </div>

          {/* Content Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Title and Basic Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <TypeIcon className="w-6 h-6 text-orange-500" />
                <span className="text-gray-400 text-sm uppercase tracking-wide">
                  {content.type === 'movie' ? 'فيلم' : 
                   content.type === 'series' ? 'مسلسل' : 
                   content.type === 'tv' ? 'تلفزيون' : 'منوعات'}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                {content.titleArabic || content.title}
              </h1>
              
              {content.titleArabic && content.title && (
                <h2 className="text-xl text-gray-300 font-medium">
                  {content.title}
                </h2>
              )}

              {/* Rating and Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
                {content.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-semibold">{content.rating}</span>
                  </div>
                )}
                
                {content.year && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{content.year}</span>
                  </div>
                )}
                
                {content.duration && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{content.duration} دقيقة</span>
                  </div>
                )}
                
                {content.viewCount && (
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{content.viewCount} مشاهدة</span>
                  </div>
                )}
              </div>

              {/* Genres */}
              {content.genres && content.genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {content.genres.map((genre, index) => (
                    <Badge key={index} variant="secondary" className="bg-white/10 text-white border-white/20">
                      {genre.nameArabic || genre.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={() => setShowPlayer(true)}
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <Play className="w-5 h-5 mr-2" />
                مشاهدة الآن
              </Button>
              
              <Button 
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/10 px-6 py-3 rounded-full"
              >
                <Heart className="w-5 h-5 mr-2" />
                إضافة للمفضلة
              </Button>
              
              <Button 
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/10 px-6 py-3 rounded-full"
              >
                <Download className="w-5 h-5 mr-2" />
                تحميل
              </Button>
            </div>

            {/* Description */}
            {(content.descriptionArabic || content.description) && (
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-white">القصة</h3>
                <p className="text-gray-300 leading-relaxed text-lg">
                  {content.descriptionArabic || content.description}
                </p>
              </div>
            )}

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/10">
              
              {/* Cast & Crew */}
              {content.cast && content.cast.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white">طاقم العمل</h3>
                  <div className="space-y-2">
                    {content.cast.slice(0, 5).map((member, index) => (
                      <div key={index} className="text-gray-300">
                        <span className="font-medium">{member.name}</span>
                        {member.role && <span className="text-gray-400 text-sm"> - {member.role}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Technical Info */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">معلومات تقنية</h3>
                <div className="space-y-2 text-gray-300">
                  {content.language && (
                    <div>
                      <span className="font-medium">اللغة:</span> {content.language}
                    </div>
                  )}
                  {content.country && (
                    <div>
                      <span className="font-medium">البلد:</span> {content.country}
                    </div>
                  )}
                  {content.director && (
                    <div>
                      <span className="font-medium">المخرج:</span> {content.director}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <MessageSquare className="w-6 h-6 text-orange-500" />
            <h3 className="text-2xl font-semibold text-white">التعليقات والمراجعات</h3>
          </div>
          
          <div className="bg-white/5 rounded-2xl p-8 backdrop-blur-sm border border-white/10">
            <p className="text-gray-400 text-center">سيتم إضافة نظام التعليقات قريباً</p>
          </div>
        </div>
      </div>

      {/* Video Player Modal */}
      {showPlayer && content && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl">
            <Button
              onClick={() => setShowPlayer(false)}
              className="absolute -top-12 right-0 text-white hover:bg-white/10 z-10"
              variant="ghost"
            >
              ✕
            </Button>
            <div className="bg-black rounded-lg overflow-hidden">
              <video 
                controls 
                autoPlay
                className="w-full aspect-video"
                poster={content.posterUrl}
              >
                <source src={content.videoUrl || '#'} type="video/mp4" />
                المتصفح لا يدعم تشغيل الفيديو
              </video>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}