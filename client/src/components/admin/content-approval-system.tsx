import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription
} from "@/components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  MessageSquare,
  Calendar,
  User,
  Flag,
  Shield,
  PlayCircle,
  Pause,
  Ban,
  CheckCheck
} from "lucide-react";
import { Content } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

interface ContentApprovalSystemProps {
  adminId?: number;
}

interface ApprovalAction {
  id: string;
  contentId: number;
  adminId: number;
  action: 'approve' | 'reject' | 'suspend' | 'request_changes';
  reason?: string;
  timestamp: Date;
  adminName: string;
}

export default function ContentApprovalSystem({ adminId = 1 }: ContentApprovalSystemProps) {
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch content awaiting approval
  const { data: pendingContent = [], isLoading: isPendingLoading } = useQuery({
    queryKey: ['/api/content/pending'],
    queryFn: async () => {
      // محاكاة البيانات - في التطبيق الحقيقي سيكون هذا API call
      return [
        {
          id: 1,
          title: "The Matrix",
          titleArabic: "الماتريكس",
          type: "movie",
          submittedBy: "محمد أحمد",
          submittedAt: new Date("2024-01-15"),
          status: "pending",
          priority: "high",
          category: "أجنبي",
          genre: "خيال علمي",
          rating: 8.7,
          posterUrl: "/api/placeholder/300/400",
          description: "فيلم خيال علمي عن الواقع الافتراضي"
        },
        {
          id: 2,
          title: "Omar Series",
          titleArabic: "مسلسل عمر",
          type: "series",
          submittedBy: "سارة محمد",
          submittedAt: new Date("2024-01-14"),
          status: "pending",
          priority: "medium",
          category: "عربي",
          genre: "تاريخي",
          rating: 9.2,
          posterUrl: "/api/placeholder/300/400",
          description: "مسلسل تاريخي عن الخليفة عمر بن الخطاب"
        }
      ];
    }
  });

  // Fetch approved content
  const { data: approvedContent = [], isLoading: isApprovedLoading } = useQuery({
    queryKey: ['/api/content/approved'],
    queryFn: async () => {
      return [
        {
          id: 3,
          title: "Inception",
          titleArabic: "البداية",
          type: "movie",
          approvedBy: "أحمد علي",
          approvedAt: new Date("2024-01-13"),
          status: "approved",
          views: 15420,
          rating: 8.8
        }
      ];
    }
  });

  // Fetch rejected content
  const { data: rejectedContent = [], isLoading: isRejectedLoading } = useQuery({
    queryKey: ['/api/content/rejected'],
    queryFn: async () => {
      return [
        {
          id: 4,
          title: "Low Quality Movie",
          titleArabic: "فيلم رديء الجودة",
          type: "movie",
          rejectedBy: "أحمد علي",
          rejectedAt: new Date("2024-01-12"),
          status: "rejected",
          rejectionReason: "جودة الفيديو منخفضة جداً"
        }
      ];
    }
  });

  // Approve content mutation
  const approveMutation = useMutation({
    mutationFn: async (contentId: number) => {
      return await apiRequest(`/api/content/${contentId}/approve`, {
        method: 'POST',
        body: JSON.stringify({ adminId })
      });
    },
    onSuccess: () => {
      toast({
        title: "تم الموافقة على المحتوى",
        description: "تم نشر المحتوى بنجاح"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/content'] });
    },
    onError: (error) => {
      toast({
        title: "خطأ في الموافقة",
        description: error.message || "حدث خطأ أثناء الموافقة على المحتوى",
        variant: "destructive"
      });
    }
  });

  // Reject content mutation
  const rejectMutation = useMutation({
    mutationFn: async ({ contentId, reason }: { contentId: number; reason: string }) => {
      return await apiRequest(`/api/content/${contentId}/reject`, {
        method: 'POST',
        body: JSON.stringify({ adminId, reason })
      });
    },
    onSuccess: () => {
      toast({
        title: "تم رفض المحتوى",
        description: "تم رفض المحتوى مع إرسال السبب للمرسل"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/content'] });
      setIsRejectDialogOpen(false);
      setRejectionReason("");
    },
    onError: (error) => {
      toast({
        title: "خطأ في الرفض",
        description: error.message || "حدث خطأ أثناء رفض المحتوى",
        variant: "destructive"
      });
    }
  });

  // Suspend content mutation
  const suspendMutation = useMutation({
    mutationFn: async (contentId: number) => {
      return await apiRequest(`/api/content/${contentId}/suspend`, {
        method: 'POST',
        body: JSON.stringify({ adminId })
      });
    },
    onSuccess: () => {
      toast({
        title: "تم إيقاف المحتوى",
        description: "تم إيقاف المحتوى مؤقتاً"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/content'] });
    },
    onError: (error) => {
      toast({
        title: "خطأ في الإيقاف",
        description: error.message || "حدث خطأ أثناء إيقاف المحتوى",
        variant: "destructive"
      });
    }
  });

  const handleApprove = (contentId: number) => {
    approveMutation.mutate(contentId);
  };

  const handleReject = (contentId: number) => {
    if (!rejectionReason.trim()) {
      toast({
        title: "سبب الرفض مطلوب",
        description: "يرجى إدخال سبب رفض المحتوى",
        variant: "destructive"
      });
      return;
    }
    rejectMutation.mutate({ contentId, reason: rejectionReason });
  };

  const handleSuspend = (contentId: number) => {
    suspendMutation.mutate(contentId);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'approved':
        return 'bg-green-500';
      case 'rejected':
        return 'bg-red-500';
      case 'suspended':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      case 'suspended':
        return <Pause className="w-4 h-4" />;
      default:
        return <Flag className="w-4 h-4" />;
    }
  };

  const ContentCard = ({ content, showActions = true }: { content: Content; showActions?: boolean }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={content.posterUrl || "/api/placeholder/300/400"}
          alt={content.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="absolute top-2 right-2 flex gap-1">
          <Badge className={cn("text-white", getStatusColor(content.status))}>
            {getStatusIcon(content.status)}
            <span className="ml-1">
              {content.status === 'pending' ? 'قيد المراجعة' :
               content.status === 'approved' ? 'مُوافق عليه' :
               content.status === 'rejected' ? 'مرفوض' :
               content.status === 'suspended' ? 'موقوف' : 'غير محدد'}
            </span>
          </Badge>
          {content.priority && (
            <Badge className={cn("text-white", getPriorityColor(content.priority))}>
              {content.priority === 'high' ? 'عالي' :
               content.priority === 'medium' ? 'متوسط' : 'منخفض'}
            </Badge>
          )}
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg line-clamp-1">{content.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {content.titleArabic}
            </p>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>
                {content.submittedAt ? 
                  `تم الإرسال: ${content.submittedAt.toLocaleDateString('ar-EG')}` :
                  content.approvedAt ? 
                    `تم الموافقة: ${content.approvedAt.toLocaleDateString('ar-EG')}` :
                    `تم الرفض: ${content.rejectedAt?.toLocaleDateString('ar-EG')}`
                }
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span>
                {content.submittedBy || content.approvedBy || content.rejectedBy}
              </span>
            </div>
          </div>

          {content.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {content.description}
            </p>
          )}

          {content.rejectionReason && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-800">
                <strong>سبب الرفض:</strong> {content.rejectionReason}
              </p>
            </div>
          )}

          {showActions && content.status === 'pending' && (
            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                onClick={() => {
                  setSelectedContent(content);
                  setIsPreviewOpen(true);
                }}
                variant="outline"
              >
                <Eye className="w-3 h-3 mr-1" />
                معاينة
              </Button>
              
              <Button
                size="sm"
                onClick={() => handleApprove(content.id)}
                disabled={approveMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-3 h-3 mr-1" />
                موافقة
              </Button>
              
              <Button
                size="sm"
                onClick={() => {
                  setSelectedContent(content);
                  setIsRejectDialogOpen(true);
                }}
                variant="destructive"
              >
                <XCircle className="w-3 h-3 mr-1" />
                رفض
              </Button>
              
              <Button
                size="sm"
                onClick={() => handleSuspend(content.id)}
                disabled={suspendMutation.isPending}
                variant="outline"
                className="border-orange-300 text-orange-600 hover:bg-orange-50"
              >
                <Pause className="w-3 h-3 mr-1" />
                إيقاف
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">نظام الموافقة على المحتوى</h1>
          <p className="text-muted-foreground">
            مراجعة وموافقة المحتوى المرسل من المستخدمين
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-yellow-50 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            {pendingContent.length} في الانتظار
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            {approvedContent.length} مُوافق عليه
          </Badge>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            قيد المراجعة ({pendingContent.length})
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            مُوافق عليه ({approvedContent.length})
          </TabsTrigger>
          <TabsTrigger value="rejected" className="flex items-center gap-2">
            <XCircle className="w-4 h-4" />
            مرفوض ({rejectedContent.length})
          </TabsTrigger>
        </TabsList>

        {/* Pending Content Tab */}
        <TabsContent value="pending" className="space-y-4">
          {isPendingLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-muted rounded-t-lg" />
                  <CardContent className="p-4 space-y-3">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                    <div className="h-3 bg-muted rounded w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : pendingContent.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="flex flex-col items-center gap-4">
                  <CheckCheck className="w-16 h-16 text-muted-foreground" />
                  <div>
                    <h3 className="text-lg font-semibold">لا يوجد محتوى قيد المراجعة</h3>
                    <p className="text-muted-foreground">
                      جميع المحتوى تم مراجعته
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pendingContent.map((content) => (
                <ContentCard key={content.id} content={content} showActions={true} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Approved Content Tab */}
        <TabsContent value="approved" className="space-y-4">
          {isApprovedLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-muted rounded-t-lg" />
                  <CardContent className="p-4 space-y-3">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                    <div className="h-3 bg-muted rounded w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {approvedContent.map((content) => (
                <ContentCard key={content.id} content={content} showActions={false} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Rejected Content Tab */}
        <TabsContent value="rejected" className="space-y-4">
          {isRejectedLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-muted rounded-t-lg" />
                  <CardContent className="p-4 space-y-3">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                    <div className="h-3 bg-muted rounded w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {rejectedContent.map((content) => (
                <ContentCard key={content.id} content={content} showActions={false} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Preview Dialog */}
      {selectedContent && (
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>معاينة المحتوى</DialogTitle>
              <DialogDescription>
                مراجعة تفاصيل المحتوى قبل الموافقة أو الرفض
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={selectedContent.posterUrl || "/api/placeholder/300/400"}
                    alt={selectedContent.title}
                    className="w-full rounded-lg"
                  />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold">{selectedContent.title}</h3>
                    <p className="text-xl text-muted-foreground">{selectedContent.titleArabic}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge>{selectedContent.type}</Badge>
                      <Badge variant="outline">{selectedContent.category}</Badge>
                      <Badge variant="outline">{selectedContent.genre}</Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>تقييم: {selectedContent.rating}/10</span>
                      <span>مرسل من: {selectedContent.submittedBy}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">الوصف:</h4>
                    <p className="text-muted-foreground">{selectedContent.description}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        handleApprove(selectedContent.id);
                        setIsPreviewOpen(false);
                      }}
                      disabled={approveMutation.isPending}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      موافقة
                    </Button>
                    
                    <Button
                      onClick={() => {
                        setIsPreviewOpen(false);
                        setIsRejectDialogOpen(true);
                      }}
                      variant="destructive"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      رفض
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Reject Dialog */}
      <AlertDialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>رفض المحتوى</AlertDialogTitle>
            <AlertDialogDescription>
              يرجى تحديد سبب رفض المحتوى. سيتم إرسال السبب إلى الشخص الذي أرسل المحتوى.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="space-y-4">
            <Textarea
              placeholder="اكتب سبب رفض المحتوى..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
            />
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedContent && handleReject(selectedContent.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              رفض المحتوى
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}