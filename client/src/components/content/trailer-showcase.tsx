import { useState } from "react";
import { Play, Pause, Volume2, VolumeX, Star, Clock, Eye, ThumbsUp, Share2, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { TrailerPlayer } from "@/components/content/trailer-player";
import { useTrailerPlayer } from "@/hooks/useTrailers";

interface TrailerInfo {
  id: string;
  title: string;
  description: string;
  duration: string;
  url: string;
  thumbnail: string;
  releaseDate: string;
  rating: number;
  viewCount: number;
  cast: string[];
  genre: string[];
  type: 'teaser' | 'trailer' | 'behind-scenes' | 'interview';
}

interface TrailerShowcaseProps {
  contentId: number;
  contentTitle: string;
  trailers: TrailerInfo[];
}

export function TrailerShowcase({ contentId, contentTitle, trailers }: TrailerShowcaseProps) {
  const [selectedTrailer, setSelectedTrailer] = useState<TrailerInfo | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { playTrailer } = useTrailerPlayer();

  const handlePlayTrailer = (trailer: TrailerInfo) => {
    setSelectedTrailer(trailer);
    setIsDialogOpen(true);
    playTrailer(trailer.id);
  };

  const groupedTrailers = trailers.reduce((acc, trailer) => {
    if (!acc[trailer.type]) {
      acc[trailer.type] = [];
    }
    acc[trailer.type].push(trailer);
    return acc;
  }, {} as Record<string, TrailerInfo[]>);

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'trailer': return 'مقاطع دعائية';
      case 'teaser': return 'إعلانات تشويقية';
      case 'behind-scenes': return 'كواليس';
      case 'interview': return 'مقابلات';
      default: return type;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'trailer': return 'bg-red-500 text-white';
      case 'teaser': return 'bg-blue-500 text-white';
      case 'behind-scenes': return 'bg-green-500 text-white';
      case 'interview': return 'bg-purple-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  if (trailers.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <div className="text-gray-500 dark:text-gray-400">
            <Play className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium" dir="rtl">لا توجد مقاطع دعائية متاحة حالياً</p>
            <p className="text-sm mt-2" dir="rtl">سيتم إضافة المقاطع الدعائية قريباً</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2" dir="rtl">
            <Play className="h-5 w-5" />
            المقاطع الدعائية - {contentTitle}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={Object.keys(groupedTrailers)[0]} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              {Object.keys(groupedTrailers).map((type) => (
                <TabsTrigger key={type} value={type} className="text-xs">
                  {getTypeLabel(type)} ({groupedTrailers[type].length})
                </TabsTrigger>
              ))}
            </TabsList>
            
            {Object.entries(groupedTrailers).map(([type, typeTrailers]) => (
              <TabsContent key={type} value={type} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {typeTrailers.map((trailer) => (
                    <TrailerCard
                      key={trailer.id}
                      trailer={trailer}
                      onPlay={() => handlePlayTrailer(trailer)}
                      typeColor={getTypeBadgeColor(trailer.type)}
                    />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Dialog for playing trailer */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle dir="rtl">
              {selectedTrailer?.title}
            </DialogTitle>
            <DialogDescription dir="rtl">
              {selectedTrailer?.description}
            </DialogDescription>
          </DialogHeader>
          {selectedTrailer && (
            <TrailerPlayer
              trailerUrl={selectedTrailer.url}
              thumbnailUrl={selectedTrailer.thumbnail}
              title={selectedTrailer.title}
              autoPlay
              onEnded={() => setIsDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TrailerCard({ 
  trailer, 
  onPlay, 
  typeColor 
}: { 
  trailer: TrailerInfo; 
  onPlay: () => void; 
  typeColor: string; 
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onPlay}
    >
      <div className="relative aspect-video overflow-hidden rounded-t-lg">
        <img
          src={trailer.thumbnail}
          alt={trailer.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        
        {/* Play button overlay */}
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            size="icon"
            variant="ghost"
            className="bg-white/20 hover:bg-white/30 text-white rounded-full w-16 h-16"
          >
            <Play className="h-8 w-8" />
          </Button>
        </div>
        
        {/* Type badge */}
        <Badge className={`absolute top-2 left-2 ${typeColor} text-xs`}>
          {trailer.type === 'trailer' ? 'مقطع دعائي' :
           trailer.type === 'teaser' ? 'إعلان تشويقي' :
           trailer.type === 'behind-scenes' ? 'كواليس' :
           trailer.type === 'interview' ? 'مقابلة' : trailer.type}
        </Badge>
        
        {/* Duration badge */}
        <Badge className="absolute bottom-2 right-2 bg-black/70 text-white text-xs">
          {trailer.duration}
        </Badge>
      </div>
      
      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-blue-600 transition-colors" dir="rtl">
            {trailer.title}
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2" dir="rtl">
            {trailer.description}
          </p>
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 text-yellow-400 fill-current" />
              <span>{trailer.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span>{trailer.viewCount.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{new Date(trailer.releaseDate).toLocaleDateString('ar-EG')}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1">
          {trailer.genre.slice(0, 2).map((genre, index) => (
            <Badge key={index} variant="outline" className="text-xs px-2 py-1">
              {genre}
            </Badge>
          ))}
          {trailer.genre.length > 2 && (
            <Badge variant="outline" className="text-xs px-2 py-1">
              +{trailer.genre.length - 2}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onPlay();
              }}
            >
              <Play className="h-3 w-3 mr-1" />
              تشغيل
            </Button>
          </div>
          
          <div className="flex items-center gap-1">
            <Button size="sm" variant="ghost" className="p-1">
              <ThumbsUp className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="ghost" className="p-1">
              <Share2 className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="ghost" className="p-1">
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Quick trailer preview component
export function QuickTrailerPreview({ 
  trailer, 
  onPlay 
}: { 
  trailer: TrailerInfo; 
  onPlay: () => void; 
}) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer" onClick={onPlay}>
      <div className="relative flex-shrink-0">
        <img
          src={trailer.thumbnail}
          alt={trailer.title}
          className="w-16 h-10 object-cover rounded"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded">
          <Play className="h-4 w-4 text-white" />
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm truncate" dir="rtl">
          {trailer.title}
        </h4>
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>{trailer.duration}</span>
          <span>•</span>
          <span>{trailer.viewCount.toLocaleString()} مشاهدة</span>
        </div>
      </div>
    </div>
  );
}