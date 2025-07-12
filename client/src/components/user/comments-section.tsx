import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useContentComments, useAddComment, useDeleteComment } from "@/hooks/useUserInteractions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageSquare, 
  Send, 
  Trash2, 
  User, 
  Calendar,
  Shield,
  MoreHorizontal
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { UserComment } from "@shared/schema";

interface CommentsSectionProps {
  contentId: number;
  contentTitle: string;
  className?: string;
}

export default function CommentsSection({ contentId, contentTitle, className }: CommentsSectionProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { data: comments, isLoading, refetch } = useContentComments(contentId);
  const addCommentMutation = useAddComment(contentId);
  const deleteCommentMutation = useDeleteComment();

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "تسجيل الدخول مطلوب",
        description: "يجب تسجيل الدخول لإضافة تعليق",
        variant: "destructive",
      });
      return;
    }

    if (!newComment.trim()) {
      toast({
        title: "تعليق فارغ",
        description: "يرجى كتابة تعليق قبل الإرسال",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await addCommentMutation.mutateAsync({
        contentId,
        userId: user.id,
        comment: newComment.trim(),
      });
      setNewComment("");
      refetch();
      toast({
        title: "تم إضافة التعليق",
        description: "تم إضافة تعليقك بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ في إضافة التعليق",
        description: "حدث خطأ أثناء إضافة التعليق. يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!user) return;

    try {
      await deleteCommentMutation.mutateAsync(commentId);
      refetch();
      toast({
        title: "تم حذف التعليق",
        description: "تم حذف التعليق بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ في حذف التعليق",
        description: "حدث خطأ أثناء حذف التعليق. يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    }
  };

  const getInitials = (firstName?: string, lastName?: string, username?: string) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`;
    }
    if (username) {
      return username.substring(0, 2).toUpperCase();
    }
    return "المستخدم";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return "منذ لحظات";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `منذ ${minutes} دقيقة`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `منذ ${hours} ساعة`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `منذ ${days} يوم`;
    }
  };

  return (
    <Card className={className} dir="rtl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          التعليقات ({comments?.length || 0})
        </CardTitle>
        <p className="text-sm text-gray-600">{contentTitle}</p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Add Comment Form */}
        {user ? (
          <form onSubmit={handleSubmitComment} className="space-y-4">
            <div className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.profileImageUrl} alt={user.username} />
                <AvatarFallback className="text-sm bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {getInitials(user.firstName, user.lastName, user.username)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  placeholder="اكتب تعليقك هنا..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[100px] resize-none"
                  disabled={isSubmitting}
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">
                    {newComment.length}/500 حرف
                  </span>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!newComment.trim() || isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {isSubmitting ? "جاري الإرسال..." : "إرسال"}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-2">تسجيل الدخول مطلوب</p>
            <p className="text-sm text-gray-500">يجب تسجيل الدخول لإضافة تعليق</p>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-3 p-4 animate-pulse">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : comments && comments.length > 0 ? (
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {comments.map((comment: UserComment) => (
                  <div key={comment.id} className="flex gap-3 p-4 rounded-lg border hover:shadow-sm transition-shadow">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={comment.user?.profileImageUrl} alt={comment.user?.username} />
                      <AvatarFallback className="text-sm bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        {getInitials(comment.user?.firstName, comment.user?.lastName, comment.user?.username)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-sm">
                          {comment.user?.firstName && comment.user?.lastName
                            ? `${comment.user.firstName} ${comment.user.lastName}`
                            : comment.user?.username
                          }
                        </span>
                        {comment.user?.isAdmin && (
                          <Badge className="bg-purple-600 text-white text-xs">
                            <Shield className="h-3 w-3 mr-1" />
                            مدير
                          </Badge>
                        )}
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      
                      <p className="text-gray-700 leading-relaxed">
                        {comment.comment}
                      </p>
                      
                      <div className="flex items-center gap-2 mt-3">
                        {user && (user.id === comment.userId || user.isAdmin) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            disabled={deleteCommentMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">لا توجد تعليقات بعد</h3>
              <p className="text-gray-500">كن أول من يعلق على هذا المحتوى</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}