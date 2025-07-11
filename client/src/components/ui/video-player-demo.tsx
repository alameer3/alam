import React, { useState } from 'react';
import { AdvancedVideoPlayer } from './advanced-video-player';
import { WatchProgressTracker, useWatchProgress } from './watch-progress-tracker';
import { ContinueWatchingDialog } from './continue-watching-dialog';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { Play } from 'lucide-react';

interface VideoPlayerDemoProps {
  contentId: number;
  title: string;
  titleArabic?: string;
  posterUrl?: string;
  videoUrl?: string;
}

export function VideoPlayerDemo({
  contentId,
  title,
  titleArabic,
  posterUrl,
  videoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
}: VideoPlayerDemoProps) {
  const [showPlayer, setShowPlayer] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showContinueDialog, setShowContinueDialog] = useState(false);

  const { savedProgress, clearProgress } = useWatchProgress(contentId);

  const handlePlay = () => {
    // Check for saved progress
    if (savedProgress && savedProgress.currentTime > 60) {
      setShowContinueDialog(true);
    } else {
      setShowPlayer(true);
    }
  };

  const handleContinueWatching = () => {
    setCurrentTime(savedProgress?.currentTime || 0);
    setShowPlayer(true);
    setShowContinueDialog(false);
  };

  const handleRestartWatching = () => {
    clearProgress();
    setCurrentTime(0);
    setShowPlayer(true);
    setShowContinueDialog(false);
  };

  const handleVideoTimeUpdate = (time: number, dur: number) => {
    setCurrentTime(time);
    setDuration(dur);
  };

  const displayTitle = titleArabic || title;

  return (
    <>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-right">{displayTitle}</CardTitle>
          <div className="flex gap-2 justify-end">
            <Badge>مشغل فيديو متقدم</Badge>
            <Badge variant="outline">تجريبي</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden cursor-pointer" onClick={handlePlay}>
            {posterUrl ? (
              <img
                src={posterUrl}
                alt={displayTitle}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Play className="h-24 w-24 text-gray-400" />
              </div>
            )}
            
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center group hover:bg-black/60 transition-colors">
              <Button
                size="lg"
                className="bg-red-600 hover:bg-red-700 text-white rounded-full p-6 group-hover:scale-110 transition-transform"
              >
                <Play className="h-8 w-8" />
              </Button>
            </div>

            {savedProgress && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
                <div 
                  className="h-full bg-red-600"
                  style={{ 
                    width: `${(savedProgress.currentTime / savedProgress.duration) * 100}%` 
                  }}
                />
              </div>
            )}
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              انقر لتشغيل المحتوى مع المشغل المتقدم الجديد
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Video Player Modal */}
      {showPlayer && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <div className="relative w-full h-full max-w-6xl">
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
              onClick={() => setShowPlayer(false)}
            >
              ✕
            </Button>
            
            <AdvancedVideoPlayer
              src={videoUrl}
              poster={posterUrl}
              title={displayTitle}
              qualities={[
                { label: "480p", value: "480p", url: videoUrl },
                { label: "720p HD", value: "720p", url: videoUrl },
                { label: "1080p FHD", value: "1080p", url: videoUrl },
                { label: "4K UHD", value: "4k", url: videoUrl }
              ]}
              subtitles={[
                { label: "العربية", language: "ar", url: "" },
                { label: "English", language: "en", url: "" },
                { label: "Français", language: "fr", url: "" }
              ]}
              onTimeUpdate={handleVideoTimeUpdate}
              initialTime={currentTime}
              className="w-full h-full"
            />
            
            {/* Watch Progress Tracker */}
            <WatchProgressTracker
              contentId={contentId}
              currentTime={currentTime}
              duration={duration}
              title={displayTitle}
            />
          </div>
        </div>
      )}

      {/* Continue Watching Dialog */}
      <ContinueWatchingDialog
        isOpen={showContinueDialog}
        onClose={() => setShowContinueDialog(false)}
        onContinue={handleContinueWatching}
        onRestart={handleRestartWatching}
        title={displayTitle}
        currentTime={savedProgress?.currentTime || 0}
        duration={savedProgress?.duration || 0}
      />
    </>
  );
}