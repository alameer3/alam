import React, { useState } from 'react';
import { Star, StarHalf } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface EnhancedRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  showValue?: boolean;
  onRate?: (rating: number) => void;
  className?: string;
}

export function EnhancedRating({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  showValue = true,
  onRate,
  className
}: EnhancedRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(rating);

  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const handleStarClick = (starRating: number) => {
    if (!interactive) return;
    
    setSelectedRating(starRating);
    onRate?.(starRating);
  };

  const handleStarHover = (starRating: number) => {
    if (!interactive) return;
    setHoverRating(starRating);
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setHoverRating(0);
  };

  const displayRating = hoverRating || selectedRating;
  const stars = [];

  for (let i = 1; i <= maxRating; i++) {
    const filled = i <= displayRating;
    const halfFilled = i - 0.5 <= displayRating && i > displayRating;
    
    stars.push(
      <div
        key={i}
        className={cn(
          'relative cursor-pointer transition-all duration-200',
          interactive && 'hover:scale-110'
        )}
        onClick={() => handleStarClick(i)}
        onMouseEnter={() => handleStarHover(i)}
        onMouseLeave={handleMouseLeave}
      >
        {halfFilled ? (
          <div className="relative">
            <Star 
              className={cn(
                sizeClasses[size],
                'text-gray-300'
              )}
            />
            <StarHalf 
              className={cn(
                sizeClasses[size],
                'absolute top-0 left-0 text-yellow-400 fill-yellow-400'
              )}
            />
          </div>
        ) : (
          <Star 
            className={cn(
              sizeClasses[size],
              filled 
                ? 'text-yellow-400 fill-yellow-400' 
                : 'text-gray-300',
              interactive && filled && 'drop-shadow-sm'
            )}
          />
        )}
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="flex items-center gap-1">
        {stars}
      </div>
      {showValue && (
        <span className={cn(
          'font-medium text-muted-foreground',
          textSizeClasses[size]
        )}>
          {displayRating.toFixed(1)}
        </span>
      )}
      {interactive && (
        <span className={cn(
          'text-xs text-muted-foreground',
          textSizeClasses[size]
        )}>
          ({maxRating} نجوم)
        </span>
      )}
    </div>
  );
}

interface RatingInputProps {
  onSubmit: (rating: number, comment: string) => void;
  initialRating?: number;
  initialComment?: string;
  className?: string;
}

export function RatingInput({
  onSubmit,
  initialRating = 0,
  initialComment = '',
  className
}: RatingInputProps) {
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);
  const [showComment, setShowComment] = useState(false);

  const handleSubmit = () => {
    if (rating > 0) {
      onSubmit(rating, comment);
      setRating(0);
      setComment('');
      setShowComment(false);
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="space-y-2">
        <label className="text-sm font-medium">تقييمك</label>
        <EnhancedRating
          rating={rating}
          interactive={true}
          size="lg"
          onRate={setRating}
          showValue={false}
        />
      </div>
      
      {rating > 0 && (
        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowComment(!showComment)}
          >
            {showComment ? 'إخفاء التعليق' : 'إضافة تعليق'}
          </Button>
          
          {showComment && (
            <div className="space-y-2">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="اكتب تعليقك هنا..."
                className="w-full p-3 border rounded-lg resize-none"
                rows={3}
              />
            </div>
          )}
          
          <Button 
            onClick={handleSubmit}
            className="w-full"
            disabled={rating === 0}
          >
            إرسال التقييم
          </Button>
        </div>
      )}
    </div>
  );
}

export default EnhancedRating;