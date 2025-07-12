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
            loop
            playsInline
            onLoadedData={handleVideoLoad}
          >
            <source src={trailerUrl} type="video/mp4" />
          </video>
        ) : (
          <img
            src={thumbnailUrl || `/api/placeholder/1920/1080`}
            alt={title}
            className="w-full h-full object-cover"
          />
        )}
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center min-h-[70vh] px-4 md:px-8 lg:px-12">
        <div className="max-w-4xl">
          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg" dir="rtl">
            {title}
          </h1>

          {/* Meta Info */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <span className="text-white font-medium">{rating}</span>
            </div>
            <span className="text-white">{year}</span>
            <span className="text-white">{duration}</span>
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-2 mb-6">
            {genres.slice(0, 4).map((genre, index) => (
              <Badge key={index} variant="secondary" className="bg-white/20 text-white border-white/30">
                {genre}
              </Badge>
            ))}
          </div>

          {/* Description */}
          <p className="text-white text-lg md:text-xl mb-8 max-w-2xl leading-relaxed drop-shadow-sm" dir="rtl">
            {description}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              size="lg"
              className="bg-white text-black hover:bg-white/90 px-8 py-3 text-lg font-medium"
              onClick={onWatchNow}
            >
              <Play className="h-5 w-5 mr-2" />
              مشاهدة الآن
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="bg-white/20 text-white border-white/30 hover:bg-white/30 px-6 py-3"
              onClick={onAddToList}
            >
              <Plus className="h-5 w-5 mr-2" />
              إضافة للقائمة
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="bg-white/20 text-white border-white/30 hover:bg-white/30 px-6 py-3"
              onClick={onMoreInfo}
            >
              <Info className="h-5 w-5 mr-2" />
              معلومات أكثر
            </Button>
          </div>
        </div>
      </div>

      {/* Video Controls */}
      {showVideo && trailerUrl && (
        <div className="absolute bottom-4 right-4 z-20">
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="outline"
              className="bg-black/50 text-white border-white/30 hover:bg-black/70"
              onClick={togglePlay}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            
            <Button
              size="icon"
              variant="outline"
              className="bg-black/50 text-white border-white/30 hover:bg-black/70"
              onClick={toggleMute}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      )}

      {/* Trailer Info Badge */}
      {showVideo && trailerUrl && (
        <div className="absolute top-4 left-4 z-20">
          <Badge className="bg-red-600 text-white px-3 py-1">
            مقطع دعائي
          </Badge>
        </div>
      )}
    </div>
  );
}

// مكون المقطع الدعائي المصغر للكروت
export function MiniTrailerCard({
  title,
  trailerUrl,
  thumbnailUrl,
  duration,
  className = ""
}: {
  title: string;
  trailerUrl: string;
  thumbnailUrl: string;
  duration: string;
  className?: string;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isHovered && trailerUrl) {
      timer = setTimeout(() => {
        setIsPlaying(true);
      }, 1000);
    } else {
      setIsPlaying(false);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isHovered, trailerUrl]);

  return (
    <Card 
      className={`relative overflow-hidden cursor-pointer group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-video relative">
        {isPlaying && trailerUrl ? (
          <video
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src={trailerUrl} type="video/mp4" />
          </video>
        ) : (
          <img
            src={thumbnailUrl || `/api/placeholder/400/225`}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant="ghost"
            className="bg-white/20 text-white hover:bg-white/30 rounded-full"
          >
            <Play className="h-6 w-6" />
          </Button>
        </div>

        {/* Duration Badge */}
        <Badge className="absolute bottom-2 right-2 bg-black/70 text-white text-xs">
          {duration}
        </Badge>

        {/* Trailer Badge */}
        <Badge className="absolute top-2 left-2 bg-red-600 text-white text-xs">
          مقطع دعائي
        </Badge>
      </div>

      <CardContent className="p-3">
        <h4 className="font-medium text-sm line-clamp-2" dir="rtl">
          {title}
        </h4>
      </CardContent>
    </Card>
  );
}