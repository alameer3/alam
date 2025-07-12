import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX, Maximize, Download, Heart, Share2, Star, Clock, Eye, Calendar } from "lucide-react";
import { Content } from "@shared/schema";

interface VideoPlayerProps {
  content: Content;
  onClose: () => void;
}

export default function VideoPlayer({ content, onClose }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Mock video player since we don't have actual video URLs
  const mockDuration = content.duration || 120; // minutes
  const mockCurrentTime = 0;

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying) {
        setCurrentTime(prev => Math.min(prev + 1, mockDuration * 60));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, mockDuration]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = (currentTime / (mockDuration * 60)) * 100;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>مشغل الفيديو - {content.titleArabic || content.title}</DialogTitle>
          <DialogDescription>
            مشاهدة {content.titleArabic || content.title} - {content.year}
          </DialogDescription>
        </DialogHeader>
        <div className="relative bg-black">
          {/* Video Area */}
          <div className="relative aspect-video bg-black flex items-center justify-center">
            <img
              src={content.posterUrl || "https://images.unsplash.com/photo-1489599088293-daa0c0f60f0e?w=800&h=450&fit=crop"}
              alt={content.titleArabic || content.title}
              className="w-full h-full object-cover"
            />
            
            {/* Play/Pause Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <Button
                onClick={togglePlay}
                variant="ghost"
                size="lg"
                className="w-20 h-20 rounded-full bg-orange-500/80 hover:bg-orange-500 text-white"
              >
                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
              </Button>
            </div>

            {/* Video Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              {/* Progress Bar */}
              <div className="w-full bg-gray-600 rounded-full h-2 mb-4">
                <div 
                  className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <Button onClick={togglePlay} variant="ghost" size="sm" className="text-white">
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </Button>
                  
                  <Button onClick={toggleMute} variant="ghost" size="sm" className="text-white">
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </Button>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-white text-sm">{formatTime(currentTime)}</span>
                    <span className="text-gray-400 text-sm">/</span>
                    <span className="text-white text-sm">{formatTime(mockDuration * 60)}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 space-x-reverse">
                  <Button onClick={toggleFavorite} variant="ghost" size="sm" className="text-white">
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  
                  <Button variant="ghost" size="sm" className="text-white">
                    <Share2 className="w-5 h-5" />
                  </Button>
                  
                  <Button variant="ghost" size="sm" className="text-white">
                    <Download className="w-5 h-5" />
                  </Button>
                  
                  <Button variant="ghost" size="sm" className="text-white">
                    <Maximize className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Content Information */}
          <div className="p-6 bg-card text-white">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold mb-2">{content.titleArabic || content.title}</h1>
                <p className="text-gray-400 mb-4">{content.descriptionArabic || content.description}</p>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="text-yellow-500 font-semibold">{content.rating}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>{content.year}</span>
              </div>
              
              <div className="flex items-center space-x-2 space-x-reverse">
                <Eye className="w-4 h-4 text-gray-400" />
                <span>{content.quality}</span>
              </div>
              
              <div className="flex items-center space-x-2 space-x-reverse">
                <Clock className="w-4 h-4 text-gray-400" />
                <span>
                  {content.type === 'series' 
                    ? `${content.episodes} حلقة` 
                    : `${content.duration} دقيقة`
                  }
                </span>
              </div>
              
              <div className="flex items-center space-x-2 space-x-reverse">
                <span className="text-gray-400">اللغة:</span>
                <span>{content.language}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4 space-x-reverse mt-6">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                <Play className="w-4 h-4 ml-2" />
                مشاهدة الآن
              </Button>
              
              <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                <Download className="w-4 h-4 ml-2" />
                تحميل
              </Button>
              
              <Button 
                variant="outline" 
                className="border-gray-600 text-white hover:bg-gray-800"
                onClick={toggleFavorite}
              >
                <Heart className={`w-4 h-4 ml-2 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                {isFavorite ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}