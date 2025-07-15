import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useAddToWatchHistory, useIncrementViewCount } from "@/hooks/useUserInteractions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  Settings, 
  X,
  Clock,
  Star,
  Heart,
  Download,
  Share2,
  MessageSquare,
  Eye,
  Calendar
} from "lucide-react";
import { Content } from "@shared/schema";
import { cn } from "@/lib/utils";
import CommentsSection from "@/components/user/comments-section";

interface AdvancedVideoPlayerProps {
  content: Content;
  onClose: () => void;
  autoPlay?: boolean;
}

export default function AdvancedVideoPlayer({ 
  content, 
  onClose, 
  autoPlay = false 
}: AdvancedVideoPlayerProps) {
  const { user } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false);
  
  const addToWatchHistoryMutation = useAddToWatchHistory(user?.id);
  const incrementViewMutation = useIncrementViewCount();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      
      // Update watch history every 30 seconds
      if (user && video.currentTime > 0 && Math.floor(video.currentTime) % 30 === 0) {
        addToWatchHistoryMutation.mutate({
          contentId: content.id,
          progressMinutes: Math.floor(video.currentTime / 60)
        });
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      if (!hasStartedPlaying) {
        setHasStartedPlaying(true);
        // Count view on first play
        incrementViewMutation.mutate(content.id);
      }
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (user) {
        addToWatchHistoryMutation.mutate({
          contentId: content.id,
          progressMinutes: Math.floor(video.duration / 60)
        });
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, [user, content.id, hasStartedPlaying]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const handleSeek = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = value[0];
    setCurrentTime(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = value[0];
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      video.volume = volume;
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isFullscreen) {
      document.exitFullscreen();
      setIsFullscreen(false);
    } else {
      video.requestFullscreen();
      setIsFullscreen(true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: content.titleArabic || content.title,
          text: content.descriptionArabic || content.description,
          url: window.location.href,
        });
      } catch (error) {

      }
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleDownload = () => {
    if (content.downloadUrl) {
      window.open(content.downloadUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-900/90 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-white text-lg font-bold" dir="rtl">
              {content.titleArabic || content.title}
            </h1>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Calendar className="h-4 w-4" />
              <span>{content.year}</span>
              <span>•</span>
              <span>{content.language}</span>
              {content.duration && (
                <>
                  <span>•</span>
                  <Clock className="h-4 w-4" />
                  <span>{content.duration} دقيقة</span>
                </>
              )}
              {content.rating && (
                <>
                  <span>•</span>
                  <Star className="h-4 w-4 fill-current text-yellow-500" />
                  <span>{content.rating}</span>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowComments(!showComments)}
                  className="text-white hover:bg-white/10"
                >
                  <MessageSquare className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>التعليقات</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  className="text-white hover:bg-white/10"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>مشاركة</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {content.downloadUrl && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDownload}
                    className="text-white hover:bg-white/10"
                  >
                    <Download className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>تحميل</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Video Player */}
        <div className={cn("flex-1 relative", showComments ? "w-2/3" : "w-full")}>
          <div className="relative w-full h-full bg-black group">
            {content.videoUrl ? (
              <video
                ref={videoRef}
                className="w-full h-full object-contain"
                src={content.videoUrl}
                autoPlay={autoPlay}
                onMouseEnter={() => setShowControls(true)}
                onMouseLeave={() => setShowControls(false)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-white">
                  <Play className="h-24 w-24 mx-auto mb-4 text-gray-400" />
                  <p className="text-xl">لا يتوفر رابط للفيديو</p>
                  <p className="text-gray-400">الرجاء التحقق من توفر المحتوى</p>
                </div>
              </div>
            )}

            {/* Video Controls */}
            {content.videoUrl && (
              <div className={cn(
                "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 transition-opacity duration-300",
                showControls ? "opacity-100" : "opacity-0"
              )}>
                {/* Progress Bar */}
                <div className="mb-4">
                  <Slider
                    value={[currentTime]}
                    onValueChange={handleSeek}
                    max={duration}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={togglePlayPause}
                      className="text-white hover:bg-white/10"
                    >
                      {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                    </Button>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleMute}
                        className="text-white hover:bg-white/10"
                      >
                        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                      </Button>
                      <div className="w-20">
                        <Slider
                          value={[isMuted ? 0 : volume]}
                          onValueChange={handleVolumeChange}
                          max={1}
                          step={0.1}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/10"
                    >
                      <Settings className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleFullscreen}
                      className="text-white hover:bg-white/10"
                    >
                      {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Comments Sidebar */}
        {showComments && (
          <div className="w-1/3 bg-gray-900 border-l border-gray-800 overflow-y-auto">
            <div className="p-4">
              <CommentsSection 
                contentId={content.id}
                contentTitle={content.titleArabic || content.title}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}