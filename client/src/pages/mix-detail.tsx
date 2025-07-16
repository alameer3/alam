import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Download, 
  Share2, 
  Star, 
  Calendar,
  Flag,
  Heart,
  Bookmark,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Send,
  Music,
  BookOpen,
  Image,
  Radio,
  Play
} from "lucide-react";

export default function MixDetail() {
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
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-600"></div>
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
    // تم إرسال التقرير - في الإنتاج سيتم إرساله للخادم
    if (process.env.NODE_ENV === 'development') {
      console.log('Report submitted:', { reportReason, reportDetails, userEmail });
    }
    setShowReportDialog(false);
    setReportReason('');
    setReportDetails('');
    setUserEmail('');
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'music': return <Music className="w-8 h-8" />;
      case 'book': return <BookOpen className="w-8 h-8" />;
      case 'image': return <Image className="w-8 h-8" />;
      case 'radio': return <Radio className="w-8 h-8" />;
      default: return <Play className="w-8 h-8" />;
    }
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
            <span>منوعات</span>
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
                  <div className="text-center text-white">
                    {getContentIcon(content.type)}
                    <p className="text-sm mt-2">عرض المحتوى</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 mb-6">
                <Button className="w-full bg-cyan-600 hover:bg-cyan-700">
                  <Download className="w-5 h-5 mr-2" />
                  تحميل
                </Button>
                <Button variant="outline" className="w-full border-gray-600 text-white hover:bg-gray-800">
                  <Share2 className="w-5 h-5 mr-2" />
                  شارك
                </Button>
                <Button variant="outline" className="w-full border-gray-600 text-white hover:bg-gray-800">
                  <Bookmark className="w-5 h-5 mr-2" />
                  قائمتي
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
                      <span className="text-lg">18</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 border-green-600 text-green-400 hover:bg-green-600/20"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span className="text-lg">36</span>
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
              <h1 className="text-3xl lg:text-4xl font-bold mb-4 text-cyan-400">
                {content.title || 'سيرفر ات Tigers Tv للقنوات المشفرة'}
              </h1>
              
              {/* Date Added */}
              <div className="flex items-center gap-2 text-gray-400 mb-6">
                <Calendar className="w-5 h-5" />
                <span>تاريخ الإضافة : الجمعة 18 08 2023 - 11:30 صباحا</span>
              </div>

              {/* Content Type Badge */}
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge className="bg-purple-600 text-white hover:bg-purple-700">
                  {content.category || 'منوعات'}
                </Badge>
                <Badge className="bg-cyan-600 text-white hover:bg-cyan-700">
                  {content.type || 'محتوى متنوع'}
                </Badge>
              </div>
            </div>

            {/* Main Content Description */}
            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">تفاصيل المحتوى</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-cyan-400 mb-2">وصف المحتوى</h4>
                    <p className="text-gray-300 leading-relaxed">
                      {content.description || 'سيرفر حديث لقنوات Lions Tv للقنوات قائمة Bein Sports فيه قائمة Bplays 220zg فيه وبلوكة القنوات المشفرة والمعتادة'}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-cyan-400 mb-2">تفاصيل إضافية</h4>
                      <ul className="text-gray-300 space-y-1 text-sm">
                        <li>- لخدمة تيجر بول</li>
                        <li>- نيتفليكس ان سيمارن</li>
                        <li>- بروقري الدمريكي/قوريا</li>
                        <li>- شبابيد</li>
                        <li>- اندرويد لولعبت</li>
                        <li>- AppleTv/FireTv,Xbox,MAC,PC,PS5</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-cyan-400 mb-2">معلومات تقنية</h4>
                      <div className="text-gray-300 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>نوع المحتوى:</span>
                          <span>سيرفر IPTV</span>
                        </div>
                        <div className="flex justify-between">
                          <span>التوافق:</span>
                          <span>جميع الأجهزة</span>
                        </div>
                        <div className="flex justify-between">
                          <span>الجودة:</span>
                          <span>HD - 4K</span>
                        </div>
                        <div className="flex justify-between">
                          <span>القنوات:</span>
                          <span>مشفرة ومجانية</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            <div>
              <h3 className="text-xl font-semibold mb-4">تفاصيل</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-400 mb-1">
                    {content.title || 'سيرفر ات Tigers Tv للقنوات المشفرة'}
                  </div>
                  <div className="text-sm text-gray-400">عنوان المحتوى</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-400 mb-1">
                    ★★★★☆
                  </div>
                  <div className="text-sm text-gray-400">التقييم</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-400 mb-1">
                    {content.downloads || '1.5K'}
                  </div>
                  <div className="text-sm text-gray-400">التحميلات</div>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">معلومات إضافية</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-cyan-400 mb-2">نوع المحتوى</h4>
                    <p className="text-gray-300">سيرفر IPTV للقنوات المشفرة</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-cyan-400 mb-2">الحجم</h4>
                    <p className="text-gray-300">ملف تكوين صغير</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-cyan-400 mb-2">اللغة</h4>
                    <p className="text-gray-300">متعدد اللغات</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-cyan-400 mb-2">التحديث</h4>
                    <p className="text-gray-300">دوري</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Download Section */}
            <Card className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border-cyan-600/50">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-cyan-400">تحميل المحتوى</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button className="bg-cyan-600 hover:bg-cyan-700">
                    <Download className="w-5 h-5 mr-2" />
                    تحميل مباشر
                  </Button>
                  <Button variant="outline" className="border-cyan-600 text-cyan-400 hover:bg-cyan-600/20">
                    <Share2 className="w-5 h-5 mr-2" />
                    مشاركة الرابط
                  </Button>
                </div>
                <p className="text-sm text-gray-400 mt-3">
                  * يرجى التأكد من توافق الجهاز قبل التحميل
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}