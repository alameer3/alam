import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Play, Download, Share2, Heart, Clock, Calendar, Eye, MessageCircle, UserCheck, Shield } from "lucide-react";
import { Link } from "wouter";

interface Content {
  id: number;
  title: string;
  titleArabic?: string;
  description: string;
  type: string;
  poster_url: string;
  release_year: number;
  language: string;
  quality: string;
  rating: number;
  genres: string[];
  view_count?: number;
  duration?: number;
  director?: string;
  cast?: string[];
  country?: string;
  imdb_rating?: number;
  age_rating?: string;
  status?: string;
  seasons?: number;
  episodes?: number;
}

interface ContentDetailProps {
  content: Content;
}

export default function AkContentDetail({ content }: ContentDetailProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isFavorited, setIsFavorited] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: content.titleArabic || content.title,
        text: content.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img 
          src={content.poster_url || '/api/placeholder/1920/1080'} 
          alt={content.titleArabic || content.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <div className="flex items-end gap-8">
              {/* Poster */}
              <div className="hidden md:block">
                <img 
                  src={content.poster_url || '/api/placeholder/260/380'} 
                  alt={content.titleArabic || content.title}
                  className="w-64 h-96 object-cover rounded-lg shadow-2xl"
                />
              </div>
              
              {/* Info */}
              <div className="flex-1 text-white">
                <div className="flex items-center gap-4 mb-4">
                  <Badge className="bg-red-600 text-white px-4 py-2 text-lg">
                    {content.quality}
                  </Badge>
                  <Badge className="bg-blue-600 text-white px-4 py-2 text-lg">
                    {content.age_rating || 'PG-13'}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                    <span className="text-2xl font-bold">{content.rating}</span>
                    <span className="text-lg text-gray-300">/10</span>
                  </div>
                </div>
                
                <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">
                  {content.titleArabic || content.title}
                </h1>
                
                <div className="flex items-center gap-6 mb-6 text-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span>{content.release_year}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span>{content.duration || 120} دقيقة</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    <span>{content.view_count || 0} مشاهدة</span>
                  </div>
                </div>
                
                <p className="text-xl text-gray-200 mb-8 leading-relaxed max-w-3xl">
                  {content.description}
                </p>
                
                {/* Action Buttons */}
                <div className="flex items-center gap-4">
                  <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg rounded-full shadow-lg">
                    <Play className="w-5 h-5 mr-2" />
                    مشاهدة الآن
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-white text-white hover:bg-white hover:text-black px-8 py-4 text-lg rounded-full"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    تحميل
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleFavorite}
                    className={`border-white hover:bg-white hover:text-black px-4 py-4 rounded-full ${
                      isFavorited ? 'bg-red-600 text-white border-red-600' : 'text-white'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleShare}
                    className="border-white text-white hover:bg-white hover:text-black px-4 py-4 rounded-full"
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-white shadow-lg rounded-xl p-2">
            <TabsTrigger 
              value="overview" 
              className="flex items-center gap-2 text-lg py-4 data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-lg"
            >
              <UserCheck className="w-5 h-5" />
              نظرة عامة
            </TabsTrigger>
            <TabsTrigger 
              value="details" 
              className="flex items-center gap-2 text-lg py-4 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg"
            >
              <Shield className="w-5 h-5" />
              التفاصيل
            </TabsTrigger>
            <TabsTrigger 
              value="reviews" 
              className="flex items-center gap-2 text-lg py-4 data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-lg"
            >
              <MessageCircle className="w-5 h-5" />
              التقييمات
            </TabsTrigger>
            <TabsTrigger 
              value="related" 
              className="flex items-center gap-2 text-lg py-4 data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-lg"
            >
              <Star className="w-5 h-5" />
              محتوى مشابه
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card className="mb-8">
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-4 text-right">القصة</h2>
                    <p className="text-gray-700 leading-relaxed text-right">
                      {content.description}
                    </p>
                  </CardContent>
                </Card>
                
                {/* Genres */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4 text-right">التصنيفات</h3>
                    <div className="flex flex-wrap gap-2">
                      {content.genres?.map((genre, index) => (
                        <Badge key={index} variant="outline" className="text-sm px-3 py-1">
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4 text-right">معلومات المحتوى</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">النوع:</span>
                        <span className="font-medium">{content.type}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">سنة الإنتاج:</span>
                        <span className="font-medium">{content.release_year}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">اللغة:</span>
                        <span className="font-medium">{content.language}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">الجودة:</span>
                        <span className="font-medium">{content.quality}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">المدة:</span>
                        <span className="font-medium">{content.duration || 120} دقيقة</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">المشاهدات:</span>
                        <span className="font-medium">{content.view_count || 0}</span>
                      </div>
                      {content.director && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">المخرج:</span>
                          <span className="font-medium">{content.director}</span>
                        </div>
                      )}
                      {content.country && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">الدولة:</span>
                          <span className="font-medium">{content.country}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value="details">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6 text-right">التفاصيل الكاملة</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-right">معلومات أساسية</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">العنوان الأصلي:</span>
                        <span>{content.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">العنوان العربي:</span>
                        <span>{content.titleArabic || content.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">تصنيف الأعمار:</span>
                        <span>{content.age_rating || 'PG-13'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">حالة العرض:</span>
                        <span>{content.status || 'متاح'}</span>
                      </div>
                    </div>
                  </div>
                  
                  {content.cast && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-right">طاقم التمثيل</h3>
                      <div className="space-y-1 text-sm">
                        {content.cast.map((actor, index) => (
                          <div key={index} className="text-gray-700">
                            {actor}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6 text-right">التقييمات والمراجعات</h2>
                <div className="text-center py-12">
                  <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">لا توجد تقييمات حتى الآن</p>
                  <p className="text-gray-500 mt-2">كن أول من يترك تقييماً لهذا المحتوى</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Related Content Tab */}
          <TabsContent value="related">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6 text-right">محتوى مشابه</h2>
                <div className="text-center py-12">
                  <Star className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">لا يوجد محتوى مشابه حالياً</p>
                  <p className="text-gray-500 mt-2">تحقق لاحقاً للمزيد من المحتوى المشابه</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}