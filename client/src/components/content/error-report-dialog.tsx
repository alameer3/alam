import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Flag, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ErrorReportDialogProps {
  contentId: number;
  contentTitle: string;
  trigger?: React.ReactNode;
}

export function ErrorReportDialog({ contentId, contentTitle, trigger }: ErrorReportDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    email: '',
    reason: '',
    description: '',
    pageUrl: typeof window !== 'undefined' ? window.location.href : ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // API call للإبلاغ عن المشكلة
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contentId,
          contentTitle,
          ...formData,
          timestamp: new Date().toISOString()
        }),
      });

      if (response.ok) {
        toast({
          title: "تم إرسال التبليغ",
          description: "شكراً لك، سيتم مراجعة التبليغ والرد عليك قريباً.",
        });
        setFormData({
          email: '',
          reason: '',
          description: '',
          pageUrl: typeof window !== 'undefined' ? window.location.href : ''
        });
        setOpen(false);
      } else {
        throw new Error('Failed to submit report');
      }
    } catch (error) {
      toast({
        title: "خطأ في الإرسال",
        description: "حدث خطأ أثناء إرسال التبليغ، يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50">
      <Flag className="h-4 w-4 mr-2" />
      التبليغ عن خطأ
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            التبليغ عن خطأ
          </DialogTitle>
          <DialogDescription>
            ساعدنا في تحسين الخدمة بالإبلاغ عن أي مشاكل تواجهها في: {contentTitle}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* رابط الصفحة */}
          <div className="space-y-2">
            <Label htmlFor="pageUrl">رابط الصفحة</Label>
            <Input
              id="pageUrl"
              value={formData.pageUrl}
              readOnly
              className="bg-muted"
            />
          </div>

          {/* البريد الإلكتروني */}
          <div className="space-y-2">
            <Label htmlFor="email">البريد الإلكتروني (اختياري)</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>

          {/* السبب */}
          <div className="space-y-2">
            <Label htmlFor="reason">سبب التبليغ</Label>
            <Select
              value={formData.reason}
              onValueChange={(value) => setFormData(prev => ({ ...prev, reason: value }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر السبب" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="download-link">مشكلة في رابط التحميل المباشر</SelectItem>
                <SelectItem value="watch-link">مشكلة في رابط المشاهدة المباشرة</SelectItem>
                <SelectItem value="subtitle">مشكلة عدم توافق الترجمة</SelectItem>
                <SelectItem value="audio-video">مشكلة تقنية في الصوت أو الصورة</SelectItem>
                <SelectItem value="content-error">مشكلة تحريرية في الموضوع أو الصور</SelectItem>
                <SelectItem value="quality-update">طلب تحديث جودة</SelectItem>
                <SelectItem value="broken-links">روابط معطلة أو لا تعمل</SelectItem>
                <SelectItem value="wrong-content">محتوى خاطئ أو مختلف</SelectItem>
                <SelectItem value="missing-episodes">حلقات مفقودة أو ناقصة</SelectItem>
                <SelectItem value="other">مشكلة أخرى</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* وصف المشكلة */}
          <div className="space-y-2">
            <Label htmlFor="description">بيانات إضافية</Label>
            <Textarea
              id="description"
              placeholder="برجاء توضيح المشكلة بالضبط ليتم التعامل معها بأسرع وقت"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              required
            />
          </div>

          {/* أزرار الإجراءات */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || !formData.reason || !formData.description}
              className="flex-1"
            >
              {isSubmitting ? "جاري الإرسال..." : "إرسال التبليغ"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              إلغاء
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}