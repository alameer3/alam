import { useState, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Info, Plus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface AutoTrailerHeroProps {
  contentId: number;
  title: string;
  description: string;
  trailerUrl: string;
  thumbnailUrl: string;
  rating: number;
  year: number;
  genres: string[];
  duration: string;
  onWatchNow?: () => void;
  onAddToList?: () => void;
  onMoreInfo?: () => void;
  className?: string;
}

export function AutoTrailerHero({
  contentId,
  title,
  description,
  trailerUrl,
  thumbnailUrl,
  rating,
  year,
  genres,
  duration,
  onWatchNow,
  onAddToList,
  onMoreInfo,
  className = ""
}: AutoTrailerHeroProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    // تشغيل المقطع الدعائي تلقائياً بعد 3 ثوانٍ
    const timer = setTimeout(() => {
      if (trailerUrl && !isPlaying) {
        setShowVideo(true);
        setIsPlaying(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [trailerUrl, isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVideoLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div className={`relative min-h-[70vh] overflow-hidden ${className}`}>
      {/* Background Video/Image */}
      <div className="absolute inset-0">
        {showVideo && trailerUrl ? (
          <video
            className="w-full h-full object-cover"
            autoPlay
            muted={isMuted}
            playsInline
            onLoadedData={handleVideoLoad}
            poster={thumbnailUrl}
          >
            <source src={trailerUrl} type="video/mp4" />
            متصفحك لا يدعم تشغيل الفيديو
          </video>
        ) : (
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${thumbnailUrl})` }}
          />
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center min-h-[70vh] px-4 md:px-8 lg:px-12">
        <div className="max-w-2xl">
          
          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight" dir="rtl">
            {title}
          </h1>

          {/* Details */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <span className="text-white font-medium">{rating}</span>
            </div>
            <Badge className="bg-white/20 text-white">
              {year}
            </Badge>
            <Badge className="bg-red-600 text-white">
              {duration}
            </Badge>
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-2 mb-6">
            {genres.map((genre, index) => (
              <Badge key={index} variant="outline" className="bg-black/50 text-white border-white/30">
                {genre}
              </Badge>
            ))}
          </div>

          {/* Description */}
          <p className="text-lg text-white/90 mb-8 leading-relaxed" dir="rtl">
            {description}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-8">
            <Button
              size="lg"
              onClick={onWatchNow}
              className="bg-white text-black hover:bg-white/90 font-medium px-8"
            >
              <Play className="h-5 w-5 mr-2" />
              شاهد الآن
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              onClick={onAddToList}
              className="bg-black/50 text-white border-white/30 hover:bg-black/70 font-medium px-8"
            >
              <Plus className="h-5 w-5 mr-2" />
              إضافة لقائمتي
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              onClick={onMoreInfo}
              className="bg-black/50 text-white border-white/30 hover:bg-black/70 font-medium px-8"
            >
              <Info className="h-5 w-5 mr-2" />
              معلومات أكثر
            </Button>
          </div>

          {/* Trailer Info */}
          <div className="flex items-center gap-4 text-white/80">
            <Badge className="bg-red-600 text-white">
              مقطع دعائي
            </Badge>
            <span className="text-sm">
              يتم التشغيل التلقائي للمقطع الدعائي
            </span>
          </div>
        </div>
      </div>

      {/* Video Controls */}
      {showVideo && (
        <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={togglePlay}
            className="bg-black/50 text-white hover:bg-black/70"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          
          <Button
            size="icon"
            variant="ghost"
            onClick={toggleMute}
            className="bg-black/50 text-white hover:bg-black/70"
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
        </div>
      )}

      {/* Loading Indicator */}
      {showVideo && !isLoaded && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-30">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      )}
    </div>
  );
}