import React, { useState } from 'react';
import { Star, MessageCircle, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface ContentRatingProps {
  contentId: number;
  currentRating?: number;
  totalRatings?: number;
  userRating?: number;
  onRatingChange?: (rating: number) => void;
}

const reportReasons = [
  { id: 'download_link', name: 'مشكلة في رابط التحميل المباشر' },
  { id: 'watch_link', name: 'مشكلة في رابط المشاهدة المباشرة' },
  { id: 'subtitle_issue', name: 'مشكلة عدم توافق الترجمة' },
  { id: 'audio_video', name: 'مشكلة تقنية في الصوت او الصورة' },
  { id: 'editorial', name: 'مشكلة تحريرية في الموضوع او الصورة' },
  { id: 'quality_update', name: 'طلب تحديث جودة' },
  { id: 'other', name: 'مشكلة أخرى' }
];

export default function ContentRating({ 
  contentId, 
  currentRating = 0, 
  totalRatings = 0, 
  userRating = 0,
  onRatingChange 
}: ContentRatingProps) {
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedRating, setSelectedRating] = useState(userRating);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportData, setReportData] = useState({
    reason: '',
    email: '',
    details: ''
  });
  const { toast } = useToast();

  const handleStarClick = (rating: number) => {
    setSelectedRating(rating);
    onRatingChange?.(rating);
    toast({
      title: "تم تسجيل تقييمك",
      description: `لقد قيمت هذا المحتوى بـ ${rating} من 10`,
    });
  };

  const handleReportSubmit = () => {
    if (!reportData.reason) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار سبب التبليغ",
        variant: "destructive",
      });
      return;
    }

    // إرسال التبليغ إلى API
    try {
      // Send report to API endpoint
      fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentId,
          ...reportData,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      // Handle silently in production
    }

    toast({
      title: "تم إرسال التبليغ",
      description: "شكراً لك، سيتم مراجعة التبليغ وحل المشكلة في أسرع وقت",
    });

    setShowReportDialog(false);
    setReportData({ reason: '', email: '', details: '' });
  };

  const renderStars = (rating: number, interactive: boolean = false) => {
    return Array.from({ length: 10 }, (_, i) => i + 1).map((star) => (
      <Star
        key={star}
        className={`w-5 h-5 cursor-pointer transition-colors ${
          star <= (interactive ? (hoveredStar || selectedRating) : rating)
            ? 'text-yellow-400 fill-yellow-400'
            : 'text-gray-300 dark:text-gray-600'
        }`}
        onClick={interactive ? () => handleStarClick(star) : undefined}
        onMouseEnter={interactive ? () => setHoveredStar(star) : undefined}
        onMouseLeave={interactive ? () => setHoveredStar(0) : undefined}
      />
    ));
  };

  return (
    <div className="space-y-4">
      {/* Rating Display */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-blue-600">
            {currentRating.toFixed(1)}
          </span>
          <span className="text-gray-600 dark:text-gray-400">/ 10</span>
        </div>
        <div className="flex items-center gap-1">
          {renderStars(currentRating)}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {totalRatings} تقييم
        </div>
      </div>

      {/* User Rating */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">ما رأيك في هذا المحتوى؟</Label>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {renderStars(selectedRating, true)}
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {selectedRating > 0 ? `${selectedRating}/10` : 'لم يتم التقييم'}
          </span>
        </div>
      </div>

      {/* Report Error */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="w-fit">
            <Flag className="w-4 h-4 mr-2" />
            التبليغ عن خطأ
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>التبليغ عن خطأ</DialogTitle>
            <DialogDescription>
              يرجى توضيح المشكلة بالتفصيل ليتم التعامل معها بأسرع وقت ممكن
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="page-url">رابط الصفحة</Label>
              <Input
                id="page-url"
                value={window.location.href}
                readOnly
                className="bg-gray-50 dark:bg-gray-800"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني (اختياري)</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@domain.com"
                value={reportData.email}
                onChange={(e) => setReportData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">السبب</Label>
              <Select value={reportData.reason} onValueChange={(value) => setReportData(prev => ({ ...prev, reason: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر سبب التبليغ" />
                </SelectTrigger>
                <SelectContent>
                  {reportReasons.map(reason => (
                    <SelectItem key={reason.id} value={reason.id}>
                      {reason.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="details">بيانات إضافية / برجاء توضيح المشكلة بالضبط</Label>
              <Textarea
                id="details"
                placeholder="اكتب تفاصيل المشكلة هنا..."
                value={reportData.details}
                onChange={(e) => setReportData(prev => ({ ...prev, details: e.target.value }))}
                rows={4}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowReportDialog(false)}>
                إلغاء
              </Button>
              <Button onClick={handleReportSubmit}>
                إرسال التبليغ
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}