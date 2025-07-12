import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/layout/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/layout/ui/separator';
import { Star, ExternalLink, Users, Image, Calendar, MapPin, Award } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorMessage } from '@/components/ui/error-message';

interface EnhancedContentDetailProps {
  contentId: number;
}

interface CastMember {
  id: number;
  name: string;
  nameArabic?: string;
  role: string;
  biography?: string;
  birthDate?: string;
  nationality?: string;
  imageUrl?: string;
  imdbId?: string;
}

interface ContentCast {
  id: number;
  contentId: number;
  castMemberId: number;
  character?: string;
  order: number;
  createdAt: string;
  castMember: CastMember;
}

interface ContentImage {
  id: number;
  contentId: number;
  imageUrl: string;
  type: string;
  description?: string;
  descriptionArabic?: string;
  order: number;
  createdAt: string;
}

interface ExternalRating {
  id: number;
  contentId: number;
  source: string;
  rating: string;
  maxRating?: string;
  url?: string;
  lastUpdated: string;
}

export default function EnhancedContentDetail({ contentId }: EnhancedContentDetailProps) {
  const [activeTab, setActiveTab] = useState('cast');

  // جلب فريق العمل
  const { 
    data: castData, 
    isLoading: castLoading, 
    error: castError 
  } = useQuery<ContentCast[]>({
    queryKey: ['/api/enhanced/content', contentId, 'cast'],
    enabled: !!contentId
  });

  // جلب الصور الإضافية
  const { 
    data: imagesData, 
    isLoading: imagesLoading, 
    error: imagesError 
  } = useQuery<ContentImage[]>({
    queryKey: ['/api/enhanced/content', contentId, 'images'],
    enabled: !!contentId
  });

  // جلب التقييمات الخارجية
  const { 
    data: ratingsData, 
    isLoading: ratingsLoading, 
    error: ratingsError 
  } = useQuery<ExternalRating[]>({
    queryKey: ['/api/enhanced/content', contentId, 'external-ratings'],
    enabled: !!contentId
  });

  // تجميع البيانات حسب النوع
  const actors = castData?.filter(cast => 
    cast.castMember.role === 'actor' || cast.castMember.role === 'actress'
  ).sort((a, b) => a.order - b.order) || [];

  const directors = castData?.filter(cast => 
    cast.castMember.role === 'director'
  ) || [];

  const crew = castData?.filter(cast => 
    !['actor', 'actress', 'director'].includes(cast.castMember.role)
  ) || [];

  const posterImages = imagesData?.filter(img => img.type === 'poster') || [];
  const backdropImages = imagesData?.filter(img => img.type === 'backdrop') || [];
  const stillImages = imagesData?.filter(img => img.type === 'still') || [];
  const behindScenesImages = imagesData?.filter(img => img.type === 'behind_scenes') || [];

  const getRatingIcon = (source: string) => {
    switch (source) {
      case 'imdb':
        return '🎭';
      case 'rotten_tomatoes':
        return '🍅';
      case 'metacritic':
        return '📊';
      case 'letterboxd':
        return '📽️';
      default:
        return '⭐';
    }
  };

  const getRatingColor = (source: string, rating: string) => {
    switch (source) {
      case 'imdb':
        return parseFloat(rating) >= 8 ? 'bg-green-500' : parseFloat(rating) >= 7 ? 'bg-yellow-500' : 'bg-red-500';
      case 'rotten_tomatoes':
        return parseInt(rating) >= 80 ? 'bg-green-500' : parseInt(rating) >= 60 ? 'bg-yellow-500' : 'bg-red-500';
      case 'metacritic':
        return parseInt(rating) >= 75 ? 'bg-green-500' : parseInt(rating) >= 60 ? 'bg-yellow-500' : 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  if (castLoading || imagesLoading || ratingsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (castError || imagesError || ratingsError) {
    return (
      <ErrorMessage 
        message="فشل في تحميل معلومات المحتوى المتقدمة" 
        details="تعذر الاتصال بالخادم"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* التقييمات الخارجية */}
      {ratingsData && ratingsData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Star className="h-5 w-5" />
              التقييمات الخارجية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {ratingsData.map((rating) => (
                <div 
                  key={rating.id}
                  className="flex flex-col items-center p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="text-2xl mb-2">{getRatingIcon(rating.source)}</div>
                  <div className="text-sm font-medium capitalize mb-1">
                    {rating.source.replace('_', ' ')}
                  </div>
                  <div className={`px-3 py-1 rounded-full text-white text-sm font-bold ${getRatingColor(rating.source, rating.rating)}`}>
                    {rating.rating}{rating.maxRating && `/${rating.maxRating}`}
                  </div>
                  {rating.url && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 h-6 text-xs"
                      onClick={() => window.open(rating.url, '_blank')}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      زيارة
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* المحتوى الرئيسي مع التبويبات */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="cast" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            فريق العمل
          </TabsTrigger>
          <TabsTrigger value="images" className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            معرض الصور
          </TabsTrigger>
          <TabsTrigger value="crew" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            الطاقم
          </TabsTrigger>
        </TabsList>

        {/* تبويب فريق العمل */}
        <TabsContent value="cast" className="space-y-6">
          {/* المخرجون */}
          {directors.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>الإخراج</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {directors.map((cast) => (
                    <div key={cast.id} className="flex items-center space-x-4 space-x-reverse p-4 bg-muted/50 rounded-lg">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center overflow-hidden">
                        {cast.castMember.imageUrl ? (
                          <img 
                            src={cast.castMember.imageUrl} 
                            alt={cast.castMember.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Users className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 text-right">
                        <h4 className="font-semibold">{cast.castMember.name}</h4>
                        {cast.castMember.nameArabic && (
                          <p className="text-sm text-muted-foreground">{cast.castMember.nameArabic}</p>
                        )}
                        <Badge variant="secondary" className="mt-1">مخرج</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* الممثلون */}
          {actors.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>الممثلون</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {actors.map((cast) => (
                    <div key={cast.id} className="flex items-center space-x-4 space-x-reverse p-4 bg-muted/50 rounded-lg">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center overflow-hidden">
                        {cast.castMember.imageUrl ? (
                          <img 
                            src={cast.castMember.imageUrl} 
                            alt={cast.castMember.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Users className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 text-right">
                        <h4 className="font-semibold">{cast.castMember.name}</h4>
                        {cast.castMember.nameArabic && (
                          <p className="text-sm text-muted-foreground">{cast.castMember.nameArabic}</p>
                        )}
                        {cast.character && (
                          <p className="text-xs text-primary mt-1">{cast.character}</p>
                        )}
                        <div className="flex gap-1 mt-1">
                          <Badge variant="outline" size="sm">
                            {cast.castMember.role === 'actor' ? 'ممثل' : 'ممثلة'}
                          </Badge>
                          {cast.castMember.nationality && (
                            <Badge variant="secondary" size="sm">
                              <MapPin className="h-3 w-3 mr-1" />
                              {cast.castMember.nationality}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* تبويب معرض الصور */}
        <TabsContent value="images" className="space-y-6">
          {posterImages.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>البوسترات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {posterImages.map((image) => (
                    <div key={image.id} className="aspect-[3/4] bg-muted rounded-lg overflow-hidden hover:scale-105 transition-transform cursor-pointer">
                      <img 
                        src={image.imageUrl} 
                        alt={image.description || 'صورة المحتوى'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {backdropImages.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>صور الخلفية</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {backdropImages.map((image) => (
                    <div key={image.id} className="aspect-video bg-muted rounded-lg overflow-hidden hover:scale-105 transition-transform cursor-pointer">
                      <img 
                        src={image.imageUrl} 
                        alt={image.description || 'صورة خلفية'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {stillImages.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>لقطات من العمل</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {stillImages.map((image) => (
                    <div key={image.id} className="aspect-video bg-muted rounded-lg overflow-hidden hover:scale-105 transition-transform cursor-pointer">
                      <img 
                        src={image.imageUrl} 
                        alt={image.description || 'لقطة من العمل'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {behindScenesImages.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>كواليس التصوير</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {behindScenesImages.map((image) => (
                    <div key={image.id} className="aspect-video bg-muted rounded-lg overflow-hidden hover:scale-105 transition-transform cursor-pointer">
                      <img 
                        src={image.imageUrl} 
                        alt={image.description || 'كواليس التصوير'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* تبويب الطاقم */}
        <TabsContent value="crew" className="space-y-6">
          {crew.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>طاقم العمل</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {crew.map((cast) => (
                    <div key={cast.id} className="flex items-center space-x-4 space-x-reverse p-4 bg-muted/50 rounded-lg">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                        {cast.castMember.imageUrl ? (
                          <img 
                            src={cast.castMember.imageUrl} 
                            alt={cast.castMember.name}
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <Users className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 text-right">
                        <h4 className="font-medium">{cast.castMember.name}</h4>
                        {cast.castMember.nameArabic && (
                          <p className="text-sm text-muted-foreground">{cast.castMember.nameArabic}</p>
                        )}
                        <Badge variant="outline" size="sm" className="mt-1">
                          {cast.castMember.role}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">لا توجد معلومات عن طاقم العمل حالياً</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}