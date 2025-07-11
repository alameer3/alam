import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Settings, Maximize, SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import { Button } from './button';
import { Slider } from './slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Badge } from './badge';
import { cn } from '@/lib/utils';

interface VideoQuality {
  label: string;
  value: string;
  url: string;
}

interface Subtitle {
  label: string;
  language: string;
  url: string;
}

interface AdvancedVideoPlayerProps {
  src: string;
  poster?: string;
  title: string;
  qualities?: VideoQuality[];
  subtitles?: Subtitle[];
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  initialTime?: number;
  className?: string;
}

export function AdvancedVideoPlayer({
  src,
  poster,
  title,
  qualities = [],
  subtitles = [],
  onTimeUpdate,
  initialTime = 0,
  className
}: AdvancedVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [currentQuality, setCurrentQuality] = useState('auto');
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [currentSubtitle, setCurrentSubtitle] = useState('off');
  const [buffered, setBuffered] = useState(0);

  const playbackSpeeds = [
    { label: '0.5x', value: 0.5 },
    { label: '0.75x', value: 0.75 },
    { label: 'عادي', value: 1 },
    { label: '1.25x', value: 1.25 },
    { label: '1.5x', value: 1.5 },
    { label: '2x', value: 2 }
  ];

  useEffect(() => {
    if (videoRef.current && initialTime > 0) {
      videoRef.current.currentTime = initialTime;
    }
  }, [initialTime]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => {
      setCurrentTime(video.currentTime);
      onTimeUpdate?.(video.currentTime, video.duration);
    };

    const updateDuration = () => setDuration(video.duration);
    const updateBuffered = () => {
      if (video.buffered.length > 0) {
        setBuffered(video.buffered.end(video.buffered.length - 1));
      }
    };

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('progress', updateBuffered);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('progress', updateBuffered);
    };
  }, [onTimeUpdate]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume;
        setIsMuted(false);
      } else {
        videoRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const skipTime = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  const handleSpeedChange = (speed: string) => {
    const speedValue = parseFloat(speed);
    setPlaybackSpeed(speedValue);
    if (videoRef.current) {
      videoRef.current.playbackRate = speedValue;
    }
  };

  const handleQualityChange = (quality: string) => {
    setCurrentQuality(quality);
    const currentTimeBackup = videoRef.current?.currentTime || 0;
    
    if (quality === 'auto') {
      if (videoRef.current) {
        videoRef.current.src = src;
      }
    } else {
      const selectedQuality = qualities.find(q => q.value === quality);
      if (selectedQuality && videoRef.current) {
        videoRef.current.src = selectedQuality.url;
        videoRef.current.currentTime = currentTimeBackup;
      }
    }
  };

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className={cn("relative bg-black rounded-lg overflow-hidden group", className)}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-contain"
        onClick={togglePlay}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Overlay Controls */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 transition-opacity duration-300",
        showControls ? "opacity-100" : "opacity-0"
      )}>
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center">
          <h3 className="text-white font-semibold text-lg">{title}</h3>
          <div className="flex gap-2">
            {currentQuality !== 'auto' && (
              <Badge variant="secondary" className="bg-red-600 text-white">
                {qualities.find(q => q.value === currentQuality)?.label || 'HD'}
              </Badge>
            )}
            {playbackSpeed !== 1 && (
              <Badge variant="secondary" className="bg-blue-600 text-white">
                {playbackSpeed}x
              </Badge>
            )}
          </div>
        </div>

        {/* Center Play Button */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="rounded-full w-20 h-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm"
              onClick={togglePlay}
            >
              <Play className="w-8 h-8 text-white" />
            </Button>
          </div>
        )}

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
          {/* Progress Bar */}
          <div className="relative">
            <div className="w-full h-1 bg-white/30 rounded">
              <div 
                className="h-full bg-white/50 rounded"
                style={{ width: `${(buffered / duration) * 100}%` }}
              />
            </div>
            <Slider
              value={[currentTime]}
              max={duration}
              step={1}
              onValueChange={handleSeek}
              className="absolute inset-0 opacity-0 hover:opacity-100"
            />
            <div 
              className="absolute top-0 h-1 bg-red-600 rounded pointer-events-none"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button size="sm" variant="ghost" onClick={togglePlay}>
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-white" />
                ) : (
                  <Play className="w-5 h-5 text-white" />
                )}
              </Button>

              <Button size="sm" variant="ghost" onClick={() => skipTime(-10)}>
                <SkipBack className="w-4 h-4 text-white" />
              </Button>

              <Button size="sm" variant="ghost" onClick={() => skipTime(10)}>
                <SkipForward className="w-4 h-4 text-white" />
              </Button>

              <Button size="sm" variant="ghost" onClick={toggleMute}>
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-white" />
                ) : (
                  <Volume2 className="w-4 h-4 text-white" />
                )}
              </Button>

              <div className="w-20">
                <Slider
                  value={[isMuted ? 0 : volume]}
                  max={1}
                  step={0.1}
                  onValueChange={handleVolumeChange}
                />
              </div>

              <span className="text-white text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => setShowSettings(!showSettings)}
                className="relative"
              >
                <Settings className="w-4 h-4 text-white" />
                
                {/* Settings Panel */}
                {showSettings && (
                  <div className="absolute bottom-full right-0 mb-2 bg-black/90 backdrop-blur-sm rounded-lg p-4 min-w-[200px] border border-white/20">
                    <div className="space-y-4 text-white">
                      {/* Playback Speed */}
                      <div>
                        <label className="text-sm font-medium block mb-2">السرعة</label>
                        <Select value={playbackSpeed.toString()} onValueChange={handleSpeedChange}>
                          <SelectTrigger className="bg-white/10 border-white/20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {playbackSpeeds.map(speed => (
                              <SelectItem key={speed.value} value={speed.value.toString()}>
                                {speed.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Quality */}
                      {qualities.length > 0 && (
                        <div>
                          <label className="text-sm font-medium block mb-2">الجودة</label>
                          <Select value={currentQuality} onValueChange={handleQualityChange}>
                            <SelectTrigger className="bg-white/10 border-white/20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="auto">تلقائي</SelectItem>
                              {qualities.map(quality => (
                                <SelectItem key={quality.value} value={quality.value}>
                                  {quality.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {/* Subtitles */}
                      {subtitles.length > 0 && (
                        <div>
                          <label className="text-sm font-medium block mb-2">الترجمة</label>
                          <Select value={currentSubtitle} onValueChange={setCurrentSubtitle}>
                            <SelectTrigger className="bg-white/10 border-white/20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="off">بلا ترجمة</SelectItem>
                              {subtitles.map(subtitle => (
                                <SelectItem key={subtitle.language} value={subtitle.language}>
                                  {subtitle.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </Button>

              <Button size="sm" variant="ghost" onClick={toggleFullscreen}>
                <Maximize className="w-4 h-4 text-white" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}