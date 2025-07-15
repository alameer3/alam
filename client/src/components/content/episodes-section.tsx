import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Play, Download, Clock, FileVideo, User } from 'lucide-react';
import type { Episode } from '@shared/schema';

interface EpisodesSectionProps {
  contentId: number;
  contentTitle: string;
}

interface EpisodesResponse {
  episodes: Episode[];
  seasons: number[];
  total: number;
}

export function EpisodesSection({ contentId, contentTitle }: EpisodesSectionProps) {
  const [selectedSeason, setSelectedSeason] = useState(1);

  const { data: episodesData, isLoading, error } = useQuery<EpisodesResponse>({
    queryKey: ['/api/episodes', contentId, selectedSeason],
    queryFn: async () => {
      const response = await fetch(`/api/episodes/${contentId}?season=${selectedSeason}`);
      if (!response.ok) throw new Error('فشل في تحميل الحلقات');
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileVideo className="h-5 w-5" />
            حلقات {contentTitle}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !episodesData) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileVideo className="h-5 w-5" />
            حلقات {contentTitle}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            لا توجد حلقات متاحة حالياً
          </p>
        </CardContent>
      </Card>
    );
  }

  const { episodes, seasons } = episodesData;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileVideo className="h-5 w-5" />
          حلقات {contentTitle}
        </CardTitle>
        
        {seasons.length > 1 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {seasons.map((season) => (
              <Button
                key={season}
                variant={selectedSeason === season ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSeason(season)}
              >
                الموسم {season}
              </Button>
            ))}
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        {episodes.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            لا توجد حلقات متاحة في الموسم {selectedSeason}
          </p>
        ) : (
          episodes.map((episode) => (
            <EpisodeCard key={episode.id} episode={episode} />
          ))
        )}
      </CardContent>
    </Card>
  );
}

interface EpisodeCardProps {
  episode: Episode;
}

function EpisodeCard({ episode }: EpisodeCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    if (episode.videoUrl) {
      setIsPlaying(true);
      // يمكن فتح مشغل الفيديو هنا
      window.open(episode.videoUrl, '_blank');
    }
  };

  const handleDownload = () => {
    if (episode.downloadUrl) {
      window.open(episode.downloadUrl, '_blank');
    }
  };

  return (
    <Card className="episode-card hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* صورة مصغرة للحلقة */}
          <div className="flex-shrink-0">
            <div className="w-24 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center relative overflow-hidden">
              {episode.thumbnailUrl ? (
                <img 
                  src={episode.thumbnailUrl} 
                  alt={episode.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Play className="h-6 w-6 text-white" />
              )}
              <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-colors" />
            </div>
          </div>

          {/* معلومات الحلقة */}
          <div className="flex-grow space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-lg leading-tight">
                  الحلقة {episode.episodeNumber}: {episode.title}
                </h4>
                {episode.titleArabic && episode.titleArabic !== episode.title && (
                  <p className="text-sm text-muted-foreground">
                    {episode.titleArabic}
                  </p>
                )}
              </div>
              
              <div className="flex gap-2">
                <Badge variant="secondary" className="text-xs">
                  {episode.quality}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {episode.resolution}
                </Badge>
              </div>
            </div>

            {/* وصف الحلقة */}
            {episode.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {episode.descriptionArabic || episode.description}
              </p>
            )}

            {/* معلومات إضافية */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              {episode.duration && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {episode.duration} دقيقة
                </div>
              )}
              
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {episode.language}
              </div>
              
              {episode.subtitle && (
                <Badge variant="outline" className="text-xs">
                  ترجمة: {episode.subtitle}
                </Badge>
              )}
            </div>

            {/* أزرار الإجراءات */}
            <div className="flex gap-2 pt-2">
              {episode.videoUrl && (
                <Button 
                  size="sm" 
                  onClick={handlePlay}
                  disabled={isPlaying}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Play className="h-4 w-4 mr-1" />
                  مشاهدة
                </Button>
              )}
              
              {episode.downloadUrl && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4 mr-1" />
                  تحميل
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}