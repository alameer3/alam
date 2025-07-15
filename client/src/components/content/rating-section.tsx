import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Star, ThumbsUp, ThumbsDown, MessageSquare, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RatingSectionProps {
  contentId: string;
  contentTitle?: string;
}

interface Review {
  id: number;
  user_name: string;
  rating: number;
  comment: string;
  likes: number;
  dislikes: number;
  created_at: string;
  user_liked: boolean;
  user_disliked: boolean;
}

export function RatingSection({ contentId, contentTitle }: RatingSectionProps) {
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState("");
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // جلب التقييمات والمراجعات
  const { data: reviews, isLoading } = useQuery({
    queryKey: [`/api/content/${contentId}/reviews`],
    enabled: !!contentId,
  });

  // إضافة مراجعة جديدة
  const addReviewMutation = useMutation({
    mutationFn: async (reviewData: { rating: number; comment: string }) => {
      const response = await fetch(`/api/content/${contentId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });
      if (!response.ok) throw new Error('فشل في إضافة المراجعة');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/content/${contentId}/reviews`] });
      setUserRating(0);
      setUserComment("");
      setIsReviewDialogOpen(false);
      toast({
        title: "تم إضافة المراجعة",
        description: "شكراً لك على مراجعتك، تم إضافتها بنجاح",
      });
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "حدث خطأ في إضافة المراجعة، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    },
  });

  // تقييم المراجعة (إعجاب/عدم إعجاب)
  const likeReviewMutation = useMutation({
    mutationFn: async ({ reviewId, action }: { reviewId: number; action: 'like' | 'dislike' }) => {
      const response = await fetch(`/api/reviews/${reviewId}/${action}`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('فشل في التقييم');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/content/${contentId}/reviews`] });
    },
  });

  const handleStarClick = (rating: number) => {
    setUserRating(rating);
  };

  const handleSubmitReview = () => {
    if (userRating === 0) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار تقييم بالنجوم",
        variant: "destructive",
      });
      return;
    }

    if (userComment.trim().length < 10) {
      toast({
        title: "خطأ",
        description: "يرجى كتابة تعليق لا يقل عن 10 أحرف",
        variant: "destructive",
      });
      return;
    }

    addReviewMutation.mutate({
      rating: userRating,
      comment: userComment.trim(),
    });
  };

  const handleLikeReview = (reviewId: number, action: 'like' | 'dislike') => {
    likeReviewMutation.mutate({ reviewId, action });
  };

  const averageRating = reviews?.length > 0 
    ? (reviews.reduce((sum: number, review: Review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const totalReviews = reviews?.length || 0;

  // توزيع النجوم
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => {
    const count = reviews?.filter((review: Review) => review.rating === rating).length || 0;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { rating, count, percentage };
  });

  if (isLoading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-slate-700 rounded w-1/3"></div>
            <div className="h-4 bg-slate-700 rounded w-1/2"></div>
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-slate-700 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Star className="h-6 w-6 text-yellow-500" />
            <span>التقييمات والمراجعات</span>
            <Badge variant="secondary" className="bg-orange-500 text-white">
              {totalReviews} مراجعة
            </Badge>
          </div>
          <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                <MessageSquare className="h-4 w-4 mr-2" />
                أضف مراجعة
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700 text-white">
              <DialogHeader>
                <DialogTitle>إضافة مراجعة - {contentTitle}</DialogTitle>
                <DialogDescription className="text-slate-400">
                  شاركنا رأيك في هذا المحتوى وساعد الآخرين في اتخاذ قرارهم
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-white mb-2 block">
                    تقييمك بالنجوم
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleStarClick(star)}
                        className="transition-colors"
                      >
                        <Star
                          className={`h-8 w-8 ${
                            star <= userRating
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-gray-400"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-white mb-2 block">
                    تعليقك (اختياري)
                  </label>
                  <Textarea
                    placeholder="شاركنا رأيك التفصيلي..."
                    value={userComment}
                    onChange={(e) => setUserComment(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white min-h-[100px]"
                  />
                </div>
                <Button
                  onClick={handleSubmitReview}
                  disabled={addReviewMutation.isPending}
                  className="w-full bg-orange-500 hover:bg-orange-600"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {addReviewMutation.isPending ? "جاري الإرسال..." : "إرسال المراجعة"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* معلومات التقييم العامة */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-500">{averageRating}</div>
              <div className="flex justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= parseFloat(averageRating.toString())
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-gray-400"
                    }`}
                  />
                ))}
              </div>
              <div className="text-sm text-slate-400">من أصل 5 نجوم</div>
            </div>
            <div className="text-slate-400">
              <div>بناءً على {totalReviews} مراجعة</div>
            </div>
          </div>
          
          {/* توزيع النجوم */}
          <div className="space-y-1">
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center gap-2 text-sm">
                <span className="text-slate-400 w-8">{rating}★</span>
                <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-500 transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="text-slate-400 text-xs w-8">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* المراجعات */}
        {totalReviews > 0 ? (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">آراء المشاهدين</h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {reviews?.map((review: Review) => (
                <div key={review.id} className="bg-slate-700/30 p-4 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{review.user_name}</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-3 w-3 ${
                              star <= review.rating
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-gray-400"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-slate-400">
                        {new Date(review.created_at).toLocaleDateString('ar-EG')}
                      </span>
                    </div>
                  </div>
                  <p className="text-slate-300 mb-3">{review.comment}</p>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleLikeReview(review.id, 'like')}
                      className={`flex items-center gap-1 text-sm transition-colors ${
                        review.user_liked ? 'text-green-500' : 'text-slate-400 hover:text-green-500'
                      }`}
                      disabled={likeReviewMutation.isPending}
                    >
                      <ThumbsUp className="h-4 w-4" />
                      {review.likes}
                    </button>
                    <button
                      onClick={() => handleLikeReview(review.id, 'dislike')}
                      className={`flex items-center gap-1 text-sm transition-colors ${
                        review.user_disliked ? 'text-red-500' : 'text-slate-400 hover:text-red-500'
                      }`}
                      disabled={likeReviewMutation.isPending}
                    >
                      <ThumbsDown className="h-4 w-4" />
                      {review.dislikes}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-400 mb-4">لا توجد مراجعات حتى الآن</p>
            <p className="text-slate-500 text-sm">كن أول من يشارك رأيه في هذا المحتوى</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}