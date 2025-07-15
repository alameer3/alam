import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Play, 
  Heart, 
  Share2, 
  Star, 
  Calendar, 
  Clock, 
  Globe,
  MapPin,
  AlertTriangle,
  Film,
  BarChart3
} from "lucide-react";
import { Content } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { RatingSection } from "@/components/content/rating-section";

interface AkStyleContentDetailProps {
  contentId: string;
}

export function AkStyleContentDetail({ contentId }: AkStyleContentDetailProps) {
  const [, setLocation] = useLocation();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportEmail, setReportEmail] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const { toast } = useToast();

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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: content.title,
        text: content.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "تم نسخ الرابط",
        description: "تم نسخ رابط المحتوى إلى الحافظة"
      });
    }
  };

  const handleAddToWatchlist = () => {
    setIsInWatchlist(!isInWatchlist);
    toast({
      title: isInWatchlist ? "تم إزالة من قائمتي" : "تم إضافة إلى قائمتي",
      description: isInWatchlist ? "تم إزالة المحتوى من قائمة المشاهدة" : "تم إضافة المحتوى إلى قائمة المشاهدة"
    });
  };

  const handleReportSubmit = () => {
    if (!reportReason) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار سبب التبليغ",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "تم إرسال التبليغ",
      description: "شكراً لك، سيتم مراجعة التبليغ والتعامل معه في أسرع وقت"
    });
    setIsReportModalOpen(false);
    setReportReason('');
    setReportEmail('');
    setReportDetails('');
  };

  const reportReasons = [
    "مشكلة في رابط التحميل المباشر",
    "مشكلة في رابط المشاهدة المباشرة",
    "مشكلة عدم توافق الترجمة",
    "مشكلة تقنية في الصوت او الصورة",
    "مشكلة تحريرية في الموضوع او الصورة",
    "طلب تحديث جودة",
    "مشكلة اخرى"
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 bg-background">
      <div className="flex flex-col lg:flex-row gap-8 mb-8">
        {/* بوستر المسلسل */}
        <div className="lg:w-1/3">
          <Card className="overflow-hidden">
            <div className="aspect-[260/380] relative">
              <img 
                src={content.posterUrl || "/assets/placeholder-poster.jpg"}
                alt={content.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4">
                <Badge variant="secondary" className="bg-yellow-500 text-black">
                  {content.quality || "HD"}
                </Badge>
              </div>
            </div>
          </Card>
        </div>

        {/* معلومات المسلسل */}
        <div className="lg:w-2/3">
          <div className="space-y-6">
            {/* العنوان والتقييم */}
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-4">{content.title}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <BarChart3 className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-muted-foreground">
                    {content.rating || "8.5"} / 10
                  </span>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  G لجميع الاعمار
                </Badge>
              </div>
            </div>

            {/* تفاصيل المسلسل */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">اللغة:</span>
                <span>{content.language || "العربية"}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">الجودة:</span>
                <span>{content.quality || "WEB-DL - 720p"}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">انتاج:</span>
                <span>{content.country || "مصر"}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">السنة:</span>
                <span>{content.year || "2025"}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">مدة المسلسل:</span>
                <span>{content.duration || "41 دقيقة"}</span>
              </div>
            </div>

            {/* الفئة */}
            <div>
              <Badge className="bg-blue-600 hover:bg-blue-700">
                {content.category || "دراما"}
              </Badge>
            </div>

            {/* تواريخ الإضافة والتحديث */}
            <div className="text-sm text-muted-foreground space-y-1">
              <div>تـ الإضافة: {new Date(content.createdAt || Date.now()).toLocaleDateString('ar-EG', { 
                weekday: 'long', 
                year: 'numeric', 
                month: '2-digit', 
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
              })}</div>
              <div>تـ اخر تحديث: {new Date(content.updatedAt || Date.now()).toLocaleDateString('ar-EG', { 
                weekday: 'long', 
                year: 'numeric', 
                month: '2-digit', 
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
              })}</div>
            </div>

            {/* أزرار الإجراءات */}
            <div className="flex flex-wrap gap-3">
              <Button className="bg-red-600 hover:bg-red-700">
                <Play className="w-4 h-4 mr-2" />
                الاعلان
              </Button>
              <Button variant="outline">
                <Play className="w-4 h-4 mr-2" />
                الحلقات
              </Button>
              <Button variant="outline" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                شارك
              </Button>
              <Button 
                variant="outline" 
                onClick={handleAddToWatchlist}
                className={isInWatchlist ? "bg-red-100 text-red-600" : ""}
              >
                <Heart className={`w-4 h-4 mr-2 ${isInWatchlist ? 'fill-current' : ''}`} />
                {isInWatchlist ? "في قائمتي" : "قائمتي"}
              </Button>
            </div>

            {/* التقييم */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">ما رأيك في هذا الموضوع؟</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className={`w-4 h-4 cursor-pointer hover:scale-110 transition-transform ${
                      star <= userRating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                    }`}
                    onClick={() => setUserRating(star)}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">152</span>
            </div>

            {/* الوسوم */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground">وسوم:</span>
              <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                #{content.title}
              </Badge>
              <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                #مشاهدة و تحميل مسلسل {content.title}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* نظام التقييمات والمراجعات */}
      <div className="mt-8">
        <RatingSection 
          contentId={contentId}
          contentTitle={content.title}
        />
      </div>

      {/* نظام التبليغ عن الأخطاء */}
      <Card className="mt-8 border-red-200 bg-red-50/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h3 className="text-lg font-semibold text-red-700">التبليغ عن خطأ</h3>
          </div>
          
          <Dialog open={isReportModalOpen} onOpenChange={setIsReportModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                <AlertTriangle className="w-4 h-4 mr-2" />
                التبليغ عن خطأ
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white">
              <DialogHeader>
                <DialogTitle className="text-red-600">التبليغ عن خطأ</DialogTitle>
                <DialogDescription>
                  برجاء توضيح المشكلة بالضبط ليتم التعامل معها باسرع وقت
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="report-url" className="text-sm font-medium">رابط الصفحة</Label>
                  <Input 
                    id="report-url"
                    value={window.location.href}
                    readOnly
                    className="bg-gray-100"
                  />
                </div>
                
                <div>
                  <Label htmlFor="report-email" className="text-sm font-medium">البريد الإلكتروني (اختياري)</Label>
                  <Input 
                    id="report-email"
                    type="email"
                    value={reportEmail}
                    onChange={(e) => setReportEmail(e.target.value)}
                    placeholder="البريد الإلكتروني للتواصل معك"
                  />
                </div>
                
                <div>
                  <Label htmlFor="report-reason" className="text-sm font-medium">السبب</Label>
                  <Select onValueChange={setReportReason} value={reportReason}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر سبب التبليغ" />
                    </SelectTrigger>
                    <SelectContent>
                      {reportReasons.map((reason) => (
                        <SelectItem key={reason} value={reason}>
                          {reason}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="report-details" className="text-sm font-medium">
                    بيانات إضافية / برجاء توضيح المشكلة بالضبط
                  </Label>
                  <Textarea 
                    id="report-details"
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    placeholder="اكتب تفاصيل المشكلة هنا..."
                    rows={4}
                  />
                </div>
                
                <Button 
                  onClick={handleReportSubmit}
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                >
                  ارسال التبليغ
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}