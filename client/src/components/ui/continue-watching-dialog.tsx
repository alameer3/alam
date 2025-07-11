import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './dialog';
import { Button } from './button';
import { Play, RotateCcw } from 'lucide-react';

interface ContinueWatchingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  onRestart: () => void;
  title: string;
  currentTime: number;
  duration: number;
}

export function ContinueWatchingDialog({
  isOpen,
  onClose,
  onContinue,
  onRestart,
  title,
  currentTime,
  duration
}: ContinueWatchingDialogProps) {
  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = Math.round((currentTime / duration) * 100);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-right">متابعة المشاهدة</DialogTitle>
          <DialogDescription className="text-right">
            لديك تقدم محفوظ في مشاهدة "{title}"
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 text-center space-y-3">
          <div className="bg-secondary rounded-lg p-4">
            <div className="text-sm text-muted-foreground mb-2">التقدم المحفوظ</div>
            <div className="text-lg font-semibold">{formatTime(currentTime)} من {formatTime(duration)}</div>
            <div className="text-sm text-muted-foreground">({progressPercentage}% مكتمل)</div>
          </div>
          
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <DialogFooter className="flex gap-2 justify-center">
          <Button variant="outline" onClick={onRestart} className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            البدء من جديد
          </Button>
          <Button onClick={onContinue} className="flex items-center gap-2">
            <Play className="w-4 h-4" />
            متابعة المشاهدة
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}