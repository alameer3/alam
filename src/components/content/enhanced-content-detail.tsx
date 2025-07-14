import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Play, Download, Share2, Heart, Calendar, Clock, Globe, 
  Star, ExternalLink, Flag, Plus, Eye, MessageCircle,
  User, MapPin, Award, Film
} from 'lucide-react';
import { Content } from '@shared/schema';

interface EnhancedContentDetailProps {
  contentId: number;
}

interface ContentDetail extends Content {
  externalRatings?: {
    source: string;
    rating: string;
    url?: string;
  }[];
  cast?: {
    name: string;
    role: string;
    character?: string;
    image?: string;
  }[];
  images?: {
    type: string;
    url: string;
    description?: string;
  }[];
  tags?: string[];
  trailerUrl?: string;
  downloadLinks?: {
    quality: string;
    size: string;
    url: string;
  }[];
}

export function EnhancedContentDetail({ contentId }: EnhancedContentDetailProps) {
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  const { data: content, isLoading } = useQuery<ContentDetail>({
    queryKey: ['/api/content', contentId],
    enabled: !!contentId
  });

  const { data: isInFavorites } = useQuery<boolean>({
    queryKey: ['/api/favorites/check', contentId],
    enabled: !!contentId
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-96 bg-gray-200 rounded-lg"></div>
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-muted-foreground">المحتوى غير موجود</h2>
      </div>
    );
  }

  const addToFavorites = async () => {
    // API call to add to favorites
  };

  const shareContent = () => {
    if (navigator.share) {
      navigator.share({
        title: content.title,
        text: content.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Poster */}
        <div className="lg:col-span-1">
          <div className="relative group">
            <img
              src={content.posterUrl || '/placeholder-poster.jpg'}
              alt={content.title}
              className="w-full rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-300"
            />
            {content.quality && (
              <Badge className="absolute top-4 right-4 bg-blue-600 text-white">
                {content.quality}
              </Badge>
            )}
          </div>
        </div>

        {/* Content Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title and External Ratings */}
          <div>
            <h1 className="text-4xl font-bold mb-4">{content.title}</h1>
            
            {/* External Ratings */}
            <div className="flex items-center gap-4 mb-4">
              {content.externalRatings?.map((rating, index) => (
                <a
                  key={index}
                  href={rating.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <img
                    src={`/images/${rating.source.toLowerCase()}.png`}
                    alt={rating.source}
                    className="w-8 h-8"
                  />
                  <span className="font-semibold">{rating.rating}</span>
                </a>
              ))}
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{content.rating || 'غير مقيم'}</span>
              </div>
            </div>

            {/* Age Rating */}
            {content.ageRating && (
              <Badge variant="outline" className="mb-4">
                {content.ageRating} إشراف عائلي
              </Badge>
            )}
          </div>

          {/* Meta Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span>اللغة: {content.language || 'غير محدد'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
                <span>الترجمة: العربية</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-muted-foreground" />
                <span>جودة الفيلم: {content.quality || 'HD'}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>إنتاج: {content.country || 'غير محدد'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>السنة: {content.year}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>مدة الفيلم: {content.duration ? `${content.duration} دقيقة` : 'غير محدد'}</span>
              </div>
            </div>
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-2">
            {content.genres?.map((genre, index) => (
              <Badge key={index} variant="secondary">
                {genre}
              </Badge>
            ))}
          </div>

          {/* Release Date */}
          <div className="text-sm text-muted-foreground">
            تم الإضافة: {new Date(content.createdAt).toLocaleDateString('ar-SA', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            {content.trailerUrl && (
              <Button asChild>
                <a href={content.trailerUrl} target="_blank" rel="noopener noreferrer">
                  <Film className="h-4 w-4 mr-2" />
                  الإعلان
                </a>
              </Button>
            )}
            <Button>
              <Play className="h-4 w-4 mr-2" />
              مشاهدة
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              تحميل
            </Button>
            <Button variant="outline" onClick={shareContent}>
              <Share2 className="h-4 w-4 mr-2" />
              مشاركة
            </Button>
            <Button 
              variant="outline" 
              onClick={addToFavorites}
              className={isInFavorites ? 'text-red-500' : ''}
            >
              <Heart className={`h-4 w-4 mr-2 ${isInFavorites ? 'fill-current' : ''}`} />
              قائمتي
            </Button>
          </div>
        </div>
      </div>

      <Separator />

      {/* Description */}
      {content.description && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">القصة</h3>
            <p className="text-muted-foreground leading-relaxed">
              {content.description}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Cast */}
      {content.cast && content.cast.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">فريق العمل</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {content.cast.map((member, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    {member.image ? (
                      <img src={member.image} alt={member.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <User className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                    {member.character && (
                      <p className="text-xs text-muted-foreground">({member.character})</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tags and Report */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Tags */}
        {content.tags && content.tags.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">وسوم:</span>
            {content.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Report Error */}
        <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50">
              <Flag className="h-4 w-4 mr-2" />
              التبليغ عن خطأ
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>التبليغ عن خطأ</DialogTitle>
              <DialogDescription>
                ساعدنا في تحسين الخدمة بالإبلاغ عن أي مشاكل تواجهها
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">رابط الصفحة</label>
                <Input value={window.location.href} readOnly />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">البريد الإلكتروني (اختياري)</label>
                <Input type="email" placeholder="email@example.com" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">السبب</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر السبب" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="download-link">مشكلة في رابط التحميل المباشر</SelectItem>
                    <SelectItem value="watch-link">مشكلة في رابط المشاهدة المباشرة</SelectItem>
                    <SelectItem value="subtitle">مشكلة عدم توافق الترجمة</SelectItem>
                    <SelectItem value="audio-video">مشكلة تقنية في الصوت او الصورة</SelectItem>
                    <SelectItem value="content-error">مشكلة تحريرية في الموضوع او الصور</SelectItem>
                    <SelectItem value="quality-update">طلب تحديث جودة</SelectItem>
                    <SelectItem value="other">مشكلة أخرى</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">بيانات إضافية</label>
                <Textarea placeholder="برجاء توضيح المشكلة بالضبط ليتم التعامل معها بأسرع وقت" />
              </div>
              <Button className="w-full">إرسال التبليغ</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Eye className="h-4 w-4" />
          <span>{content.views || 0} مشاهدة</span>
        </div>
        <div className="flex items-center gap-1">
          <Heart className="h-4 w-4" />
          <span>{content.favorites || 0} إعجاب</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageCircle className="h-4 w-4" />
          <span>{content.comments || 0} تعليق</span>
        </div>
      </div>
    </div>
  );
}