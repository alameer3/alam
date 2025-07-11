import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/layout/ui/button";
import { Card, CardContent } from "@/components/layout/ui/card";
import { Badge } from "@/components/layout/ui/badge";
import { 
  Play, 
  Download, 
  Heart, 
  Share2, 
  Star, 
  Clock, 
  Eye, 
  Calendar,
  ArrowLeft,
  Users,
  Globe
} from "lucide-react";
import { Content } from "@shared/schema";
import VideoPlayer from "@/components/content/video-player";
import ContentGrid from "@/components/content/content-grid";

export default function ContentDetail() {
  const { id } = useParams<{ id: string }>();
  const [showPlayer, setShowPlayer] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const { data: content, isLoading, error } = useQuery({
    queryKey: ['/api/content/item', id],
    queryFn: async () => {
      if (!id) throw new Error('Content ID is required');
      const response = await fetch(`/api/content/item/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Content not found');
        }
        throw new Error('Failed to fetch content');
      }
      return response.json();
    },
    enabled: !!id,
  });

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // In a real app, this would save to user's favorites
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: content?.titleArabic || content?.title,
        text: content?.descriptionArabic || content?.description,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/4 mb-4"></div>
            <div className="aspect-video bg-gray-700 rounded mb-6"></div>
            <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="min-h-screen bg-dark text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">المحتوى غير موجود</h1>
          <p className="text-gray-400 mb-4">عذراً، لم يتم العثور على المحتوى المطلوب</p>
          <Button onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 ml-2" />
            العودة
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark text-white">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Button 
          variant="ghost" 
          onClick={() => window.history.back()}
          className="text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 ml-2" />
          العودة
        </Button>
      </div>

      {/* Hero Section */}
      <div className="relative">
        <div className="aspect-video relative overflow-hidden">
          <img
            src={content.posterUrl || "https://images.unsplash.com/photo-1489599088293-daa0c0f60f0e?w=1200&h=675&fit=crop"}
            alt={content.titleArabic || content.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              onClick={() => setShowPlayer(true)}
              size="lg"
              className="w-20 h-20 rounded-full bg-orange-500/80 hover:bg-orange-500 text-white"
            >
              <Play className="w-8 h-8" />
            </Button>
          </div>

          {/* Content Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="container mx-auto">
              <div className="flex items-center space-x-2 space-x-reverse mb-4">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="text-yellow-500 font-semibold">{content.rating}</span>
                <Badge variant="secondary" className="bg-orange-500 text-white">
                  {content.quality}
                </Badge>
              </div>
              
              <h1 className="text-4xl font-bold mb-4">{content.titleArabic || content.title}</h1>
              <p className="text-xl text-gray-200 mb-6 max-w-2xl">
                {content.descriptionArabic || content.description}
              </p>
              
              <div className="flex items-center space-x-6 space-x-reverse text-sm">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Calendar className="w-4 h-4" />
                  <span>{content.year}</span>
                </div>
                
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Clock className="w-4 h-4" />
                  <span>
                    {content.type === 'series' 
                      ? `${content.episodes} حلقة` 
                      : `${content.duration} دقيقة`
                    }
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Globe className="w-4 h-4" />
                  <span>{content.language}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center space-x-4 space-x-reverse">
          <Button 
            onClick={() => setShowPlayer(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            <Play className="w-4 h-4 ml-2" />
            مشاهدة الآن
          </Button>
          
          <Button 
            variant="outline" 
            className="border-gray-600 text-white hover:bg-gray-800"
          >
            <Download className="w-4 h-4 ml-2" />
            تحميل
          </Button>
          
          <Button 
            variant="outline" 
            className="border-gray-600 text-white hover:bg-gray-800"
            onClick={toggleFavorite}
          >
            <Heart className={`w-4 h-4 ml-2 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            {isFavorite ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
          </Button>
          
          <Button 
            variant="outline" 
            className="border-gray-600 text-white hover:bg-gray-800"
            onClick={handleShare}
          >
            <Share2 className="w-4 h-4 ml-2" />
            مشاركة
          </Button>
        </div>
      </div>

      {/* Content Details */}
      <div className="container mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="bg-card border-gray-700 mb-8">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">تفاصيل المحتوى</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-orange-500 mb-2">القصة</h3>
                    <p className="text-gray-300 leading-relaxed">
                      {content.descriptionArabic || content.description}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">النوع:</span>
                      <span className="mr-2">{content.type === 'movie' ? 'فيلم' : content.type === 'series' ? 'مسلسل' : 'برنامج'}</span>
                    </div>
                    
                    <div>
                      <span className="text-gray-400">سنة الإنتاج:</span>
                      <span className="mr-2">{content.year}</span>
                    </div>
                    
                    <div>
                      <span className="text-gray-400">الجودة:</span>
                      <span className="mr-2">{content.quality}</span>
                    </div>
                    
                    <div>
                      <span className="text-gray-400">الدقة:</span>
                      <span className="mr-2">{content.resolution}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-card border-gray-700">
              <CardContent className="p-6">
                <h3 className="font-bold mb-4">معلومات إضافية</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">التقييم:</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span>{content.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">المدة:</span>
                    <span>
                      {content.type === 'series' 
                        ? `${content.episodes} حلقة` 
                        : `${content.duration} دقيقة`
                      }
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">اللغة:</span>
                    <span>{content.language}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">الحالة:</span>
                    <Badge variant={content.isActive ? "default" : "secondary"}>
                      {content.isActive ? 'متاح' : 'غير متاح'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Related Content */}
      <div className="container mx-auto px-4 pb-12">
        <ContentGrid
          contentType={content.type}
          title="محتوى مشابه"
          showViewAll={false}
          onContentClick={(relatedContent) => {
            window.location.href = `/content/${relatedContent.id}`;
          }}
        />
      </div>

      {/* Video Player Modal */}
      {showPlayer && (
        <VideoPlayer
          content={content}
          onClose={() => setShowPlayer(false)}
        />
      )}
    </div>
  );
}