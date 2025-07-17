import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize,
  Settings,
  ExternalLink,
  AlertTriangle,
  Download
} from "lucide-react";

export default function Watch() {
  const { id, episodeId, title } = useParams<{
    id: string;
    episodeId?: string;
    title?: string;
  }>();

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportData, setReportData] = useState({
    url: "",
    email: "",
    reason: "",
    description: ""
  });

  const { data: content, isLoading } = useQuery({
    queryKey: [`/api/content/${id}`],
    queryFn: async () => {
      const response = await fetch(`/api/content/${id}`);
      if (!response.ok) throw new Error('Failed to fetch content');
      return response.json();
    }
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setReportData(prev => ({ ...prev, url: window.location.href }));
    }
  }, []);

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // إرسال التبليغ إلى API
      await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...reportData,
          contentId: id,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      // Handle silently in production
    }
    
    setShowReportModal(false);
    setReportData({
      url: typeof window !== 'undefined' ? window.location.href : "",
      email: "",
      reason: "",
      description: ""
    });
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-black/90 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/movies" className="text-blue-400 hover:text-blue-300">
                ← العودة للأفلام
              </Link>
              <h1 className="text-xl font-bold">
                مشاهدة فيلم {content?.title || title}
              </h1>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowReportModal(true)}
                className="bg-red-600 hover:bg-red-700 border-red-600"
              >
                <AlertTriangle className="w-4 h-4 ml-2" />
                التبليغ عن خطأ
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Video Player */}
      <div className="relative bg-black">
        <div className="aspect-video bg-slate-900 flex items-center justify-center">
          {/* Video Player Interface */}
          <div className="relative w-full h-full">
            {/* Placeholder for video */}
            <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
              <div className="text-center">
                <Play className="w-16 h-16 mx-auto mb-4 text-white/60" />
                <p className="text-white/60">مشغل الفيديو</p>
                <p className="text-sm text-white/40 mt-2">
                  {content?.title || title}
                </p>
              </div>
            </div>

            {/* Video Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="text-white hover:bg-white/20"
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6" />
                    ) : (
                      <Play className="w-6 h-6" />
                    )}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMuted(!isMuted)}
                    className="text-white hover:bg-white/20"
                  >
                    {isMuted ? (
                      <VolumeX className="w-5 h-5" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </Button>
                  
                  <div className="text-sm text-white/80">
                    00:00 / 00:00
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                  >
                    <Settings className="w-5 h-5" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="text-white hover:bg-white/20"
                  >
                    {isFullscreen ? (
                      <Minimize className="w-5 h-5" />
                    ) : (
                      <Maximize className="w-5 h-5" />
                    )}
                  </Button>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full h-1 bg-white/20 rounded-full mt-3">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* External Player Links */}
      <div className="bg-slate-900 p-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              className="bg-orange-600 hover:bg-orange-700 border-orange-600"
              onClick={() => window.open(`vlc://example.com/video.mp4`, '_blank')}
            >
              <ExternalLink className="w-4 h-4 ml-2" />
              فتح في VLC
            </Button>
            
            <Button
              variant="outline"
              className="bg-blue-600 hover:bg-blue-700 border-blue-600"
              onClick={() => window.open(`intent://example.com/video.mp4#Intent;package=com.mxtech.videoplayer.ad;S.title=${content?.title};end`, '_blank')}
            >
              <ExternalLink className="w-4 h-4 ml-2" />
              فتح في MX Player
            </Button>
            
            <Button
              variant="outline"
              className="bg-green-600 hover:bg-green-700 border-green-600"
            >
              <Download className="w-4 h-4 ml-2" />
              تحميل مباشر
            </Button>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <h3 className="text-lg font-semibold">التبليغ عن خطأ</h3>
            </div>
            
            <form onSubmit={handleReport} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  رابط الصفحة
                </label>
                <Input
                  type="url"
                  value={reportData.url}
                  onChange={(e) => setReportData(prev => ({ ...prev, url: e.target.value }))}
                  className="bg-slate-700 border-slate-600 text-white"
                  readOnly
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  البريد الإلكتروني (اختياري)
                </label>
                <Input
                  type="email"
                  value={reportData.email}
                  onChange={(e) => setReportData(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  السبب
                </label>
                <select
                  value={reportData.reason}
                  onChange={(e) => setReportData(prev => ({ ...prev, reason: e.target.value }))}
                  className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                  required
                >
                  <option value="">اختر السبب</option>
                  {reportReasons.map(reason => (
                    <option key={reason} value={reason}>{reason}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  بيانات إضافية / برجاء توضيح المشكلة بالضبط ليتم التعامل معها باسرع وقت
                </label>
                <Textarea
                  value={reportData.description}
                  onChange={(e) => setReportData(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-slate-700 border-slate-600 text-white"
                  rows={3}
                  placeholder="وصف المشكلة..."
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  إرسال
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowReportModal(false)}
                  className="flex-1 bg-slate-700 border-slate-600 hover:bg-slate-600"
                >
                  إلغاء
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Content Info */}
      <div className="bg-slate-900 p-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold mb-4">{content?.title}</h2>
              <p className="text-slate-300 mb-4">{content?.description}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">السنة:</span>
                  <span className="mr-2">{content?.year || 'غير محدد'}</span>
                </div>
                <div>
                  <span className="text-slate-400">التقييم:</span>
                  <span className="mr-2">{content?.rating || 'غير محدد'}</span>
                </div>
                <div>
                  <span className="text-slate-400">النوع:</span>
                  <span className="mr-2">{content?.type || 'غير محدد'}</span>
                </div>
                <div>
                  <span className="text-slate-400">الجودة:</span>
                  <span className="mr-2">HD</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-slate-800 rounded-lg p-4">
                <h3 className="font-semibold mb-2">معلومات التحميل</h3>
                <div className="space-y-2 text-sm">
                  <div>الحجم: 1.2 GB</div>
                  <div>الجودة: 1080p</div>
                  <div>الصيغة: MP4</div>
                  <div>الترجمة: عربية</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}