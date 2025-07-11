import React, { useEffect, useState } from 'react';
import { useAddToWatchHistory } from '@/hooks/useUserInteractions';
import { useAuth } from '@/hooks/useAuth';

interface WatchProgressTrackerProps {
  contentId: number;
  currentTime: number;
  duration: number;
  title: string;
}

export function WatchProgressTracker({ 
  contentId, 
  currentTime, 
  duration, 
  title 
}: WatchProgressTrackerProps) {
  const { user } = useAuth();
  const addToWatchHistory = useAddToWatchHistory(user?.id);
  const [lastSavedTime, setLastSavedTime] = useState(0);

  useEffect(() => {
    // حفظ التقدم كل 30 ثانية أو عند تغيير الوقت بشكل كبير
    if (Math.abs(currentTime - lastSavedTime) >= 30 && user) {
      const progressMinutes = Math.floor(currentTime / 60);
      const progressPercentage = (currentTime / duration) * 100;

      // حفظ التقدم فقط إذا شاهد أكثر من 5% وأقل من 95% من المحتوى
      if (progressPercentage > 5 && progressPercentage < 95) {
        addToWatchHistory.mutate({
          contentId,
          progressMinutes,
          progressPercentage
        });
        
        setLastSavedTime(currentTime);
        
        // حفظ في التخزين المحلي للاستمرار
        localStorage.setItem(`watch_progress_${contentId}`, JSON.stringify({
          currentTime,
          duration,
          title,
          timestamp: Date.now()
        }));
      }
    }
  }, [currentTime, duration, contentId, user, addToWatchHistory, lastSavedTime, title]);

  return null; // مكون غير مرئي لتتبع التقدم فقط
}

// هوك للحصول على التقدم المحفوظ
export function useWatchProgress(contentId: number) {
  const [savedProgress, setSavedProgress] = useState<{
    currentTime: number;
    duration: number;
    title: string;
    timestamp: number;
  } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(`watch_progress_${contentId}`);
    if (saved) {
      try {
        const progress = JSON.parse(saved);
        // إزالة التقدم المحفوظ إذا كان أقدم من 30 يوماً
        if (Date.now() - progress.timestamp < 30 * 24 * 60 * 60 * 1000) {
          setSavedProgress(progress);
        } else {
          localStorage.removeItem(`watch_progress_${contentId}`);
        }
      } catch (error) {
        localStorage.removeItem(`watch_progress_${contentId}`);
      }
    }
  }, [contentId]);

  const clearProgress = () => {
    localStorage.removeItem(`watch_progress_${contentId}`);
    setSavedProgress(null);
  };

  return { savedProgress, clearProgress };
}