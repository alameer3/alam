import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import EpisodesList from "@/components/episodes/episodes-list";
import DownloadLinks from "@/components/download/download-links";
import { 
  Play, 
  Plus, 
  Heart, 
  Share2, 
  Star, 
  Clock, 
  Calendar,
  Globe,
  Film,
  Users,
  Download,
  Bookmark,
  Eye,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  Flag
} from "lucide-react";

export default function SeriesDetail() {
  const params = useParams();
  const contentId = params.id as string;
  const [activeTab, setActiveTab] = useState("episodes");

  const { data: content, isLoading } = useQuery({
    queryKey: [`/api/content/${contentId}`],
    queryFn: async () => {
      const response = await fetch(`/api/content/${contentId}`);
      if (!response.ok) throw new Error('Failed to fetch content');
      return response.json();
    },
    enabled: !!contentId
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">محتوى غير موجود</h1>
          <p>لم يتم العثور على المحتوى المطلوب</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${content.backdrop || content.poster || '/api/placeholder/1920/1080'})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Poster */}
            <div className="lg:col-span-1">
              <div className="relative group">
                <img
                  src={content.poster || '/api/placeholder/400/600'}
                  alt={content.title}
                  className="w-full max-w-sm mx-auto rounded-lg shadow-2xl"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                  <Button size="lg" className="bg-red-600 hover:bg-red-700">
                    <Play className="w-5 h-5 mr-2" />
                    مشاهدة الآن
                  </Button>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title and Basic Info */}
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold mb-4">{content.title}</h1>
                {content.originalTitle && content.originalTitle !== content.title && (
                  <h2 className="text-xl text-gray-300 mb-4">{content.originalTitle}</h2>
                )}
                
                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <Badge className="bg-red-600 text-white">
                    {content.type === 'series' ? 'مسلسل' : 'فيلم'}
                  </Badge>
                  {content.year && (
                    <div className="flex items-center gap-1 text-gray-300">
                      <Calendar className="w-4 h-4" />
                      <span>{content.year}</span>
                    </div>
                  )}
                  {content.duration && (
                    <div className="flex items-center gap-1 text-gray-300">
                      <Clock className="w-4 h-4" />
                      <span>{content.duration}</span>
                    </div>
                  )}
                  {content.rating && (
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span>{content.rating}</span>
                    </div>
                  )}
                  {content.language && (
                    <div className="flex items-center gap-1 text-gray-300">
                      <Globe className="w-4 h-4" />
                      <span>{content.language}</span>
                    </div>
                  )}
                </div>

                {/* Genres */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {content.genres?.map((genre: string, index: number) => (
                    <Badge key={index} variant="outline" className="border-gray-600 text-gray-300">
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button size="lg" className="bg-red-600 hover:bg-red-700">
                  <Play className="w-5 h-5 mr-2" />
                  مشاهدة الآن
                </Button>
                <Button size="lg" variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                  <Plus className="w-5 h-5 mr-2" />
                  إضافة للمفضلة
                </Button>
                <Button size="lg" variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                  <Bookmark className="w-5 h-5 mr-2" />
                  قائمة المشاهدة
                </Button>
                <Button size="lg" variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                  <Share2 className="w-5 h-5 mr-2" />
                  مشاركة
                </Button>
              </div>

              {/* Description */}
              {content.description && (
                <div className="bg-gray-900/70 rounded-lg p-6 backdrop-blur-sm">
                  <h3 className="text-xl font-semibold mb-3">القصة</h3>
                  <p className="text-gray-300 leading-relaxed">{content.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-gray-900">
            <TabsTrigger value="episodes" className="data-[state=active]:bg-red-600">الحلقات</TabsTrigger>
            <TabsTrigger value="download" className="data-[state=active]:bg-red-600">التحميل</TabsTrigger>
            <TabsTrigger value="cast" className="data-[state=active]:bg-red-600">فريق العمل</TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-red-600">المراجعات</TabsTrigger>
            <TabsTrigger value="similar" className="data-[state=active]:bg-red-600">مشابه</TabsTrigger>
          </TabsList>

          {/* Episodes Tab */}
          <TabsContent value="episodes" className="mt-6">
            <EpisodesList 
              contentId={parseInt(contentId)}
              contentType={content.type}
            />
          </TabsContent>
          
          {/* Download Tab */}
          <TabsContent value="download" className="mt-6">
            <DownloadLinks 
              contentId={parseInt(contentId)}
              title={content.titleArabic || content.title}
            />
          </TabsContent>

          {/* Cast Tab */}
          <TabsContent value="cast" className="mt-6">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">فريق العمل</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((actor) => (
                  <Card key={actor} className="bg-gray-900 border-gray-700">
                    <CardContent className="p-4 text-center">
                      <Avatar className="w-20 h-20 mx-auto mb-3">
                        <AvatarImage src={`/api/placeholder/80/80`} />
                        <AvatarFallback>ممثل</AvatarFallback>
                      </Avatar>
                      <h4 className="font-semibold text-white">اسم الممثل {actor}</h4>
                      <p className="text-sm text-gray-400">دور الشخصية</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="mt-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">المراجعات والتقييمات</h3>
                <Button className="bg-red-600 hover:bg-red-700">
                  إضافة مراجعة
                </Button>
              </div>

              {/* Rating Summary */}
              <Card className="bg-gray-900 border-gray-700">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-yellow-400 mb-2">8.5</div>
                      <div className="flex justify-center mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <p className="text-gray-400">من 1,234 تقييم</p>
                    </div>
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center gap-2">
                          <span className="text-sm w-6">{rating}</span>
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <div className="flex-1 bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-yellow-400 h-2 rounded-full" 
                              style={{ width: `${rating * 20}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-400">{rating * 50}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Reviews List */}
              <div className="space-y-4">
                {[1, 2, 3].map((review) => (
                  <Card key={review} className="bg-gray-900 border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Avatar>
                          <AvatarImage src={`/api/placeholder/40/40`} />
                          <AvatarFallback>م</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-white">مستخدم {review}</h4>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} className="w-3 h-3 text-yellow-400 fill-current" />
                              ))}
                            </div>
                            <span className="text-sm text-gray-400">منذ يومين</span>
                          </div>
                          <p className="text-gray-300 mb-3">
                            مسلسل رائع جداً، القصة مشوقة والأداء ممتاز. أنصح بمشاهدته.
                          </p>
                          <div className="flex items-center gap-4">
                            <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                              <ThumbsUp className="w-4 h-4 mr-1" />
                              مفيد (12)
                            </Button>
                            <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                              <ThumbsDown className="w-4 h-4 mr-1" />
                              غير مفيد (2)
                            </Button>
                            <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                              <Flag className="w-4 h-4 mr-1" />
                              إبلاغ
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Similar Content Tab */}
          <TabsContent value="similar" className="mt-6">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">مسلسلات مشابهة</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item) => (
                  <div
                    key={item}
                    className="group relative bg-gray-900 rounded-lg overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer"
                  >
                    <div className="aspect-[2/3] relative overflow-hidden">
                      <img
                        src={`/api/placeholder/300/450`}
                        alt={`مسلسل مشابه ${item}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 rounded px-2 py-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-white text-xs">8.{item}</span>
                      </div>
                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="text-center text-white">
                          <Play className="w-8 h-8 mx-auto mb-2" />
                          <p className="text-sm">مشاهدة</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="text-white font-medium text-sm mb-1 line-clamp-2">
                        عنوان المسلسل {item}
                      </h3>
                      <p className="text-gray-400 text-xs">
                        202{item % 5} • دراما
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}