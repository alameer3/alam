import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose,
  DialogDescription
} from '@/components/ui/dialog';
import { 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  Plus, 
  Edit2, 
  Trash2,
  User 
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { 
  useContentReviews, 
  useAddReview, 
  useUpdateReview, 
  useDeleteReview, 
  useLikeReview,
  useUserReviewForContent
} from '@/hooks/useReviews';
import { UserReview, InsertUserReview } from '@shared/schema';
import { cn } from '@/lib/utils';

interface ReviewsSectionProps {
  contentId: number;
}

interface ReviewFormData {
  rating: number;
  title: string;
  review: string;
}

export default function ReviewsSection({ contentId }: ReviewsSectionProps) {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<UserReview | null>(null);
  const [formData, setFormData] = useState<ReviewFormData>({
    rating: 5,
    title: '',
    review: ''
  });

  const { data: reviews, isLoading } = useContentReviews(contentId);
  const { data: userReview } = useUserReviewForContent(user?.id || 0, contentId);
  const addReviewMutation = useAddReview(contentId);
  const updateReviewMutation = useUpdateReview(user?.id || 0, contentId);
  const deleteReviewMutation = useDeleteReview(user?.id || 0, contentId);
  const likeReviewMutation = useLikeReview(contentId);

  const averageRating = reviews?.length 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    const reviewData: InsertUserReview = {
      userId: user.id,
      contentId,
      rating: formData.rating,
      title: formData.title,
      review: formData.review
    };

    try {
      if (editingReview) {
        await updateReviewMutation.mutateAsync({
          reviewId: editingReview.id,
          reviewData: {
            rating: formData.rating,
            title: formData.title,
            review: formData.review
          }
        });
      } else {
        await addReviewMutation.mutateAsync(reviewData);
      }

      setIsDialogOpen(false);
      setEditingReview(null);
      setFormData({ rating: 5, title: '', review: '' });
    } catch (error) {
      // Handle error silently or show user-friendly message
    }
  };

  const handleEditReview = (review: UserReview) => {
    setEditingReview(review);
    setFormData({
      rating: review.rating,
      title: review.title || '',
      review: review.review || ''
    });
    setIsDialogOpen(true);
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (window.confirm('هل أنت متأكد من حذف هذه المراجعة؟')) {
      try {
        await deleteReviewMutation.mutateAsync(reviewId);
      } catch (error) {
        // Handle error silently or show user-friendly message
      }
    }
  };

  const handleLikeReview = async (reviewId: number, isLike: boolean) => {
    if (!user) return;

    try {
      await likeReviewMutation.mutateAsync({
        reviewId,
        userId: user.id,
        isLike
      });
    } catch (error) {
      // Handle error silently or show user-friendly message
    }
  };

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={interactive ? 24 : 16}
            className={cn(
              interactive ? 'cursor-pointer' : '',
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            )}
            onClick={() => interactive && onRatingChange?.(star)}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold mb-2">المراجعات والتقييمات</h2>
          {reviews && reviews.length > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {renderStars(Math.round(averageRating))}
                <span className="font-semibold">{averageRating.toFixed(1)}</span>
              </div>
              <Badge variant="outline">
                {reviews.length} مراجعة
              </Badge>
            </div>
          )}
        </div>
        
        {user && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingReview(null);
                  setFormData({ rating: 5, title: '', review: '' });
                }}
              >
                <Plus className="h-4 w-4 ml-2" />
                {userReview ? 'تعديل مراجعتي' : 'إضافة مراجعة'}
              </Button>
            </DialogTrigger>
            
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingReview ? 'تعديل المراجعة' : 'إضافة مراجعة جديدة'}
                </DialogTitle>
                <DialogDescription>
                  {editingReview ? 'قم بتحديث مراجعتك وتقييمك' : 'شارك رأيك وقيم المحتوى'}
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">التقييم</label>
                  {renderStars(formData.rating, true, (rating) => 
                    setFormData(prev => ({ ...prev, rating }))
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">عنوان المراجعة</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="اكتب عنوان مراجعتك هنا..."
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">نص المراجعة</label>
                  <textarea
                    value={formData.review}
                    onChange={(e) => setFormData(prev => ({ ...prev, review: e.target.value }))}
                    placeholder="اكتب مراجعتك التفصيلية هنا..."
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-md resize-none"
                    required
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={addReviewMutation.isPending || updateReviewMutation.isPending}
                  >
                    {editingReview ? 'تحديث المراجعة' : 'نشر المراجعة'}
                  </Button>
                  
                  <DialogClose asChild>
                    <Button type="button" variant="outline">
                      إلغاء
                    </Button>
                  </DialogClose>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews && reviews.length > 0 ? (
          reviews.map((review) => (
            <Card key={review.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="bg-gray-100 rounded-full p-2">
                    <User className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-600">
                        {new Date(review.createdAt).toLocaleDateString('ar-SA')}
                      </span>
                    </div>
                    <h4 className="font-semibold">{review.title}</h4>
                  </div>
                </div>
                
                {user && user.id === review.userId && (
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditReview(review)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteReview(review.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              
              <p className="text-gray-700 mb-3 leading-relaxed">
                {review.review}
              </p>
              
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <button
                  onClick={() => handleLikeReview(review.id, true)}
                  className="flex items-center gap-1 hover:text-green-600"
                >
                  <ThumbsUp className="h-4 w-4" />
                  <span>{review.likes || 0}</span>
                </button>
                
                <button
                  onClick={() => handleLikeReview(review.id, false)}
                  className="flex items-center gap-1 hover:text-red-600"
                >
                  <ThumbsDown className="h-4 w-4" />
                  <span>{review.dislikes || 0}</span>
                </button>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-8 text-center">
            <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">لا توجد مراجعات بعد</h3>
            <p className="text-gray-600 mb-4">
              كن أول من يكتب مراجعة لهذا المحتوى
            </p>
            {user && (
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 ml-2" />
                إضافة مراجعة
              </Button>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}