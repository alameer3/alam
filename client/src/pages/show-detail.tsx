import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Play, 
  Share2, 
  Star, 
  Clock, 
  Calendar,
  Globe,
  Download,
  Flag,
  Heart,
  Bookmark,
  Eye,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Send
} from "lucide-react";

export default function ShowDetail() {
  const params = useParams();
  const contentId = params.id as string;
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const { data: content, isLoading } = useQuery({
    queryKey: ['/api/content', contentId],
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
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
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

  const handleReport = () => {
    // Handle report submission
    // تم إرسال التقرير - في الإنتاج سيتم إرساله للخادم
    if (process.env.NODE_ENV === 'development') {
      console.log('Report submitted:', { reportReason, reportDetails, userEmail });
    }
    setShowReportDialog(false);
    setReportReason('');
    setReportDetails('');
    setUserEmail('');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header Background */}
      <div className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 py-4">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-gray-400 mb-4">
            <span>الرئيسية</span>
            <span>/</span>
            <span>تلفزيون</span>
            <span>/</span>
            <span className="text-white">{content.title}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Poster */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {/* Poster */}
              <div className="relative group mb-6">
                <img
                  src={content.poster || '/api/placeholder/260/380'}
                  alt={content.title}
                  className="w-full rounded-lg shadow-2xl"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                  <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
                    <Play className="w-5 h-5 mr-2" />
                    مشاهدة
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 mb-6">
                <Button className="w-full bg-orange-600 hover:bg-orange-700">
                  <Play className="w-5 h-5 mr-2" />
                  مشاهدة
                </Button>
                <Button variant="outline" className="w-full border-gray-600 text-white hover:bg-gray-800">
                  <Share2 className="w-5 h-5 mr-2" />
                  شارك
                </Button>
              </div>

              {/* Rating Section */}
              <Card className="bg-gray-900 border-gray-700 mb-6">
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-3">ما رأيك في هذا الموضوع ؟</h3>
                  <div className="flex justify-center gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 border-red-600 text-red-400 hover:bg-red-600/20"
                    >
                      <ThumbsDown className="w-4 h-4" />
                      <span className="text-lg">0</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 border-green-600 text-green-400 hover:bg-green-600/20"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span className="text-lg">0</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Report Error Button */}
              <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    <Flag className="w-4 h-4 mr-2" />
                    التبليغ عن خطأ
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border-gray-700 text-white">
                  <DialogHeader>
                    <DialogTitle>التبليغ عن خطأ</DialogTitle>
                    <DialogDescription className="text-gray-400">
                      برجاء توضيح المشكلة بالضبط ليتم التعامل معها بأسرع وقت
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">رابط الصفحة</label>
                      <input
                        type="text"
                        value={window.location.href}
                        readOnly
                        className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-gray-300"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">البريد الإلكتروني (اختياري)</label>
                      <input
                        type="email"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white"
                        placeholder="your@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">السبب</label>
                      <Select value={reportReason} onValueChange={setReportReason}>
                        <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                          <SelectValue placeholder="اختر السبب" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          <SelectItem value="direct-download">مشكلة في رابط التحميل المباشر</SelectItem>
                          <SelectItem value="direct-watch">مشكلة في رابط المشاهدة المباشرة</SelectItem>
                          <SelectItem value="subtitle-issue">مشكلة عدم توافق الترجمة</SelectItem>
                          <SelectItem value="audio-video">مشكلة تقنية في الصوت او الصورة</SelectItem>
                          <SelectItem value="content-edit">مشكلة تحريرية في الموضوع او الصور</SelectItem>
                          <SelectItem value="quality-update">طلب تحديث جودة</SelectItem>
                          <SelectItem value="other">مشكلة اخرى</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        بيانات إضافية / برجاء توضيح المشكلة بالضبط
                      </label>
                      <Textarea
                        value={reportDetails}
                        onChange={(e) => setReportDetails(e.target.value)}
                        className="bg-gray-800 border-gray-600 text-white min-h-[100px]"
                        placeholder="اكتب تفاصيل المشكلة هنا..."
                      />
                    </div>

                    <Button
                      onClick={handleReport}
                      className="w-full bg-red-600 hover:bg-red-700"
                      disabled={!reportReason}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      ارسال
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and Basic Info */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-4 text-orange-400">
                {content.title}
              </h1>
              
              {/* Meta Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">اللغة :</span>
                    <span className="text-white">{content.language || 'الإنجليزية'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">الترجمة :</span>
                    <span className="text-white">العربية</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">الجودة :</span>
                    <span className="text-white">{content.quality || 'WEB-DL'} - {content.resolution || '720p'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">انتاج :</span>
                    <span className="text-white">{content.country || 'الولايات المتحدة الأمريكية'}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">السنة :</span>
                    <span className="text-white">{content.year || '2025'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">مدة البرنامج :</span>
                    <span className="text-white">{content.duration || '94 دقيقة'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">تـ الإضافة :</span>
                    <span className="text-white">الأربعاء 16 07 2025 - 05:44 مساءاً</span>
                  </div>
                </div>
              </div>

              {/* Categories and Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge className="bg-blue-600 text-white hover:bg-blue-700">
                  NETFLIX
                </Badge>
                <Badge className="bg-green-600 text-white hover:bg-green-700">
                  مسابقات
                </Badge>
                {content.genres?.map((genre: string, index: number) => (
                  <Badge key={index} variant="outline" className="border-gray-600 text-gray-300">
                    {genre}
                  </Badge>
                ))}
              </div>

              {/* Tags Section */}
              <div className="mb-6">
                <span className="text-gray-400">وسوم : </span>
                <a href="#" className="text-blue-400 hover:text-blue-300">
                  #عرض WWE NXT 2025.07.08 مترجم
                </a>
              </div>
            </div>

            {/* Description */}
            {content.description && (
              <Card className="bg-gray-900 border-gray-700">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3">القصة</h3>
                  <p className="text-gray-300 leading-relaxed">{content.description}</p>
                </CardContent>
              </Card>
            )}

            {/* Related Content Section */}
            <div>
              <h3 className="text-xl font-semibold mb-4">تفاصيل</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400 mb-1">
                    {content.title || 'WWE NXT 2025.07.15 مترجم'}
                  </div>
                  <div className="text-sm text-gray-400">عنوان البرنامج</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400 mb-1">
                    {content.rating || '8.5'}
                  </div>
                  <div className="text-sm text-gray-400">التقييم</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400 mb-1">
                    {content.views || '1.2M'}
                  </div>
                  <div className="text-sm text-gray-400">المشاهدات</div>
                </div>
              </div>
            </div>

            {/* Additional Show Info */}
            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">معلومات إضافية</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-orange-400 mb-2">نوع البرنامج</h4>
                    <p className="text-gray-300">برنامج رياضي - مصارعة حرة</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-orange-400 mb-2">الفئة العمرية</h4>
                    <p className="text-gray-300">+13 سنة</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-orange-400 mb-2">الموسم</h4>
                    <p className="text-gray-300">2025</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-orange-400 mb-2">الحلقة</h4>
                    <p className="text-gray-300">15 يوليو 2025</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Download/Watch Section */}
            <Card className="bg-gradient-to-r from-orange-900/30 to-red-900/30 border-orange-600/50">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-orange-400">مشاهدة وتحميل</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button className="bg-orange-600 hover:bg-orange-700">
                    <Play className="w-5 h-5 mr-2" />
                    مشاهدة مباشرة
                  </Button>
                  <Button variant="outline" className="border-orange-600 text-orange-400 hover:bg-orange-600/20">
                    <Download className="w-5 h-5 mr-2" />
                    تحميل مباشر
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}