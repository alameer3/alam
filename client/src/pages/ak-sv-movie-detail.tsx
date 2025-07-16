import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Star, Play, Download, Share2, Heart, Flag, ChevronLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import EpisodesList from "@/components/episodes/episodes-list";
import DownloadLinks from "@/components/download/download-links";

export default function AkSvMovieDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [reportData, setReportData] = useState({
    reason: "",
    details: "",
    email: ""
  });

  const { data: movie, isLoading } = useQuery({
    queryKey: [`/api/content/${id}`],
    queryFn: async () => {
      const response = await fetch(`/api/content/${id}`);
      if (!response.ok) throw new Error('فشل في تحميل بيانات الفيلم');
      return response.json();
    }
  });

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "تم النسخ",
      description: "تم نسخ رابط الفيلم إلى الحافظة"
    });
  };

  const handleAddToWatchlist = () => {
    toast({
      title: "تمت الإضافة",
      description: "تم إضافة الفيلم إلى قائمة المشاهدة"
    });
  };

  const handleReport = () => {
    toast({
      title: "تم الإرسال",
      description: "تم إرسال التبليغ وسيتم مراجعته قريباً"
    });
    setReportData({ reason: "", details: "", email: "" });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black/90">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <div className="w-full h-96 bg-gray-700 rounded-xl" />
              </div>
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  <div className="h-8 bg-gray-700 rounded w-3/4" />
                  <div className="h-4 bg-gray-700 rounded w-1/2" />
                  <div className="h-4 bg-gray-700 rounded w-2/3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-black/90 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">الفيلم غير موجود</h1>
          <Button onClick={() => setLocation("/movies")} variant="outline">
            العودة للأفلام
          </Button>
        </div>
      </div>
    );
  }

  const cast = [
    { name: "Nick Frost", character: "Stoick", image: "/api/placeholder/80/80" },
    { name: "Gerard Butler", character: "Hiccup", image: "/api/placeholder/80/80" },
    { name: "Nico Parker", character: "Astrid", image: "/api/placeholder/80/80" },
    { name: "Mason Thames", character: "Toothless", image: "/api/placeholder/80/80" }
  ];

  const movieImages = [
    "/api/placeholder/200/120",
    "/api/placeholder/200/120",
    "/api/placeholder/200/120",
    "/api/placeholder/200/120"
  ];

  return (
    <div 
      className="min-h-screen"
      style={{
        background: "linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1920&h=1080&fit=crop')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >
      {/* شريط التنقل العلوي */}
      <div className="bg-black/60 backdrop-blur-sm py-4 border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Button 
              onClick={() => setLocation("/movies")}
              variant="ghost" 
              className="text-white hover:text-orange-400"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              العودة للأفلام
            </Button>
            <div className="text-white/70 text-sm">
              الرئيسية / أفلام / {movie.titleArabic || movie.title}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* معلومات الفيلم الرئيسية */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          
          {/* بوستر الفيلم */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <img
                src={movie.poster || "/api/placeholder/260/380"}
                alt={movie.titleArabic || movie.title}
                className="w-full max-w-sm mx-auto rounded-xl shadow-2xl border border-white/20"
              />
            </div>
          </div>

          {/* تفاصيل الفيلم */}
          <div className="lg:col-span-2">
            <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              
              {/* العنوان والتقييمات */}
              <div className="mb-6">
                <h1 className="text-4xl font-bold text-white mb-4">
                  {movie.titleArabic || movie.title}
                </h1>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <img src="/api/placeholder/24/24" alt="TMDB" className="w-6 h-6" />
                    <span className="text-orange-400 font-bold text-lg">{movie.rating || "8.1"}</span>
                    <span className="text-white/60">/ 10</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({length: 5}).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-5 h-5 ${i < Math.floor((movie.rating || 8.1) / 2) ? 'fill-yellow-400 text-yellow-400' : 'text-white/30'}`} 
                      />
                    ))}
                  </div>
                  <Badge className="bg-green-600 text-white">PG13 إشراف عائلي</Badge>
                </div>
              </div>

              {/* معلومات الفيلم */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-white">
                <div>
                  <span className="text-white/60">اللغة: </span>
                  <span>الإنجليزية</span>
                </div>
                <div>
                  <span className="text-white/60">الترجمة: </span>
                  <span>العربية</span>
                </div>
                <div>
                  <span className="text-white/60">جودة الفيلم: </span>
                  <span className="text-orange-400">WEB-DL - 1080p</span>
                </div>
                <div>
                  <span className="text-white/60">الإنتاج: </span>
                  <span>الولايات المتحدة الأمريكية</span>
                </div>
                <div>
                  <span className="text-white/60">السنة: </span>
                  <span>{movie.year || 2025}</span>
                </div>
                <div>
                  <span className="text-white/60">مدة الفيلم: </span>
                  <span>125 دقيقة</span>
                </div>
              </div>

              {/* الأنواع */}
              <div className="flex flex-wrap gap-2 mb-6">
                {['اكشن', 'عائلي', 'فانتازيا'].map((genre) => (
                  <Badge key={genre} variant="outline" className="text-orange-400 border-orange-400">
                    {genre}
                  </Badge>
                ))}
              </div>

              {/* تاريخ الإضافة */}
              <div className="text-white/60 text-sm mb-6">
                تـ الإضافة: الثلاثاء 15 07 2025 - 10:51 مساءاً
              </div>

              {/* أزرار الإجراءات */}
              <div className="flex flex-wrap gap-4 mb-6">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Play className="w-4 h-4 mr-2" />
                  الإعلان
                </Button>
                <Button 
                  onClick={() => setLocation(`/watch/${movie.id}/1/${encodeURIComponent(movie.title)}`)}
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                  <Play className="w-4 h-4 mr-2" />
                  مشاهدة
                </Button>
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <Download className="w-4 h-4 mr-2" />
                  تحميل
                </Button>
                <Button 
                  onClick={handleShare}
                  variant="outline" 
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  شارك
                </Button>
                <Button 
                  onClick={handleAddToWatchlist}
                  variant="outline" 
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  قائمتي
                </Button>
              </div>

              {/* التقييم */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-white">ما رأيك في هذا الموضوع؟</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="w-10 h-10 p-0 bg-red-600 border-red-600 text-white hover:bg-red-700">
                    👎
                  </Button>
                  <Button size="sm" variant="outline" className="w-10 h-10 p-0 bg-green-600 border-green-600 text-white hover:bg-green-700">
                    👍
                  </Button>
                </div>
                <span className="text-white/60">0 تقييمات</span>
              </div>

              {/* الوسوم */}
              <div className="mb-6">
                <span className="text-white/60 mb-2 block">وسوم:</span>
                <div className="flex flex-wrap gap-2">
                  {['How to Train Your Dragon', 'مشاهدة و تحميل فيلم How to Train Your Dragon', 'كيفية تدريب التنين الخاص بك'].map((tag) => (
                    <Badge key={tag} variant="outline" className="text-blue-400 border-blue-400 cursor-pointer hover:bg-blue-400/10">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* التبليغ عن خطأ */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="border-red-500 text-red-400 hover:bg-red-500/10">
                    <Flag className="w-4 h-4 mr-2" />
                    التبليغ عن خطأ
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-black/90 border-white/20 text-white">
                  <DialogHeader>
                    <DialogTitle>التبليغ عن خطأ</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">رابط الصفحة</label>
                      <Input 
                        value={window.location.href} 
                        readOnly 
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">البريد الإلكتروني (اختياري)</label>
                      <Input 
                        type="email"
                        value={reportData.email}
                        onChange={(e) => setReportData({...reportData, email: e.target.value})}
                        className="bg-white/10 border-white/20 text-white"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">السبب</label>
                      <Select value={reportData.reason} onValueChange={(value) => setReportData({...reportData, reason: value})}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="اختر السبب" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="download">مشكلة في رابط التحميل المباشر</SelectItem>
                          <SelectItem value="watch">مشكلة في رابط المشاهدة المباشرة</SelectItem>
                          <SelectItem value="subtitle">مشكلة عدم توافق الترجمة</SelectItem>
                          <SelectItem value="quality">مشكلة تقنية في الصوت أو الصورة</SelectItem>
                          <SelectItem value="content">مشكلة تحريرية في الموضوع أو الصور</SelectItem>
                          <SelectItem value="update">طلب تحديث جودة</SelectItem>
                          <SelectItem value="other">مشكلة أخرى</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">بيانات إضافية</label>
                      <Textarea 
                        value={reportData.details}
                        onChange={(e) => setReportData({...reportData, details: e.target.value})}
                        className="bg-white/10 border-white/20 text-white"
                        placeholder="برجاء توضيح المشكلة بالضبط ليتم التعامل معها بأسرع وقت"
                        rows={4}
                      />
                    </div>
                    <Button onClick={handleReport} className="w-full bg-red-600 hover:bg-red-700">
                      إرسال
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* قصة الفيلم */}
        <Card className="bg-black/60 backdrop-blur-sm border-white/10 mb-8">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-white mb-4">قصة الفيلم</h2>
            <p className="text-white/80 text-lg leading-relaxed">
              مشاهدة و تحميل فيلم How to Train Your Dragon حيث يحكي قصة الفتى هيكوب، وعالم مليء بالفايكنغ والتنانين أثناء توحيدهم بشكل مميز. 
              في عرض يمزج بين الدراما والقصة، حيث في المغامرات والأنس أجمل قائدة تكون لقبائل المحيط والبحيرة، ويتحدى القرويون العصر المريب. 
              يكشف رحلته عبر المملكة عن الطبيعة الخفية للتنانين، ويحدق أحرس مجتمع المغامرين.
            </p>
          </CardContent>
        </Card>

        {/* نظام التحميل والمشاهدة */}
        <div className="mb-8">
          <DownloadLinks 
            contentId={parseInt(id)}
            title={movie.titleArabic || movie.title}
          />
        </div>

        {/* عرض الحلقات للمسلسلات */}
        {movie.type === 'series' && (
          <div className="mb-8">
            <EpisodesList 
              contentId={parseInt(id)}
              contentType={movie.type}
            />
          </div>
        )}

        {/* صور من الفيلم */}
        <Card className="bg-black/60 backdrop-blur-sm border-white/10 mb-8">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-white mb-6">صور من الفيلم</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {movieImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`صورة ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border border-white/20 hover:scale-105 transition-transform cursor-pointer"
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* فريق العمل */}
        <Card className="bg-black/60 backdrop-blur-sm border-white/10">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-white mb-6">فريق العمل</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {cast.map((actor, index) => (
                <div key={index} className="text-center">
                  <img
                    src={actor.image}
                    alt={actor.name}
                    className="w-20 h-20 rounded-full mx-auto mb-3 border-2 border-white/20"
                  />
                  <h3 className="text-white font-medium text-sm">{actor.name}</h3>
                  <p className="text-white/60 text-xs">{actor.character}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}