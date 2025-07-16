import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Play, Download, Clock, Eye, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useLocation } from "wouter";

interface EpisodesListProps {
  contentId: number;
  contentType: string;
}

export default function EpisodesList({ contentId, contentType }: EpisodesListProps) {
  const [, setLocation] = useLocation();
  
  // Only show episodes for series content
  if (contentType !== "series") {
    return null;
  }

  const { data: episodes, isLoading } = useQuery({
    queryKey: [`/api/content/${contentId}/episodes`],
    queryFn: async () => {
      const response = await fetch(`/api/content/${contentId}/episodes`);
      if (!response.ok) throw new Error('Failed to fetch episodes');
      return response.json();
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">الحلقات</h3>
        <LoadingSpinner />
      </div>
    );
  }

  if (!episodes || episodes.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">الحلقات</h3>
        <p className="text-gray-400">لا توجد حلقات متاحة حالياً</p>
      </div>
    );
  }

  // Group episodes by season
  const episodesBySeason = episodes.reduce((acc: any, episode: any) => {
    const season = episode.seasonNumber || episode.season_number;
    if (!acc[season]) {
      acc[season] = [];
    }
    acc[season].push(episode);
    return acc;
  }, {});

  const handleWatchEpisode = (episodeId: number, title: string) => {
    setLocation(`/watch/${contentId}/${episodeId}/${encodeURIComponent(title)}`);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white">الحلقات</h3>
      
      {Object.entries(episodesBySeason).map(([season, seasonEpisodes]: [string, any]) => (
        <div key={season} className="space-y-4">
          <h4 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
            الموسم {season}
          </h4>
          
          <div className="grid gap-4">
            {seasonEpisodes.map((episode: any) => (
              <Card key={episode.id} className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4 space-x-reverse">
                    {/* Episode thumbnail */}
                    <div className="relative w-24 h-16 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                      {episode.thumbnailUrl ? (
                        <img 
                          src={episode.thumbnailUrl} 
                          alt={episode.titleArabic || episode.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Play className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    {/* Episode details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h5 className="font-semibold text-white truncate">
                            الحلقة {episode.episodeNumber || episode.episode_number}: {episode.titleArabic || episode.title}
                          </h5>
                          <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                            {episode.descriptionArabic || episode.description}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-2 space-x-reverse flex-shrink-0 ml-4">
                          <Badge variant="outline" className="text-xs">
                            {episode.quality}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {episode.resolution}
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Episode metadata */}
                      <div className="flex items-center space-x-4 space-x-reverse mt-2 text-sm text-gray-400">
                        <div className="flex items-center space-x-1 space-x-reverse">
                          <Clock className="w-4 h-4" />
                          <span>{episode.duration} دقيقة</span>
                        </div>
                        <div className="flex items-center space-x-1 space-x-reverse">
                          <Eye className="w-4 h-4" />
                          <span>{episode.language}</span>
                        </div>
                        {episode.subtitle && (
                          <Badge variant="secondary" className="text-xs">
                            ترجمة: {episode.subtitle}
                          </Badge>
                        )}
                      </div>
                      
                      {/* Action buttons */}
                      <div className="flex items-center space-x-2 space-x-reverse mt-4">
                        <Button
                          onClick={() => handleWatchEpisode(episode.id, episode.titleArabic || episode.title)}
                          size="sm"
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          <Play className="w-4 h-4 ml-2" />
                          مشاهدة
                        </Button>
                        
                        <EpisodeDownloadButton 
                          contentId={contentId}
                          episodeId={episode.id}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Component for episode download options
function EpisodeDownloadButton({ contentId, episodeId }: { contentId: number; episodeId: number }) {
  const [showDownloads, setShowDownloads] = useState(false);

  const { data: downloadLinks, isLoading } = useQuery({
    queryKey: [`/api/content/${contentId}/download`, episodeId],
    queryFn: async () => {
      const response = await fetch(`/api/content/${contentId}/download?episode=${episodeId}`);
      if (!response.ok) throw new Error('Failed to fetch download links');
      return response.json();
    },
    enabled: showDownloads
  });

  const handleDownload = (link: any) => {
    // In a real app, this would handle the download
    window.open(link.downloadUrl, '_blank');
  };

  return (
    <div className="relative">
      <Button
        onClick={() => setShowDownloads(!showDownloads)}
        variant="outline"
        size="sm"
        className="border-gray-600 hover:bg-gray-700"
      >
        <Download className="w-4 h-4 ml-2" />
        تحميل
      </Button>
      
      {showDownloads && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10">
          <div className="p-3">
            <h6 className="font-semibold text-white mb-2">خيارات التحميل</h6>
            
            {isLoading ? (
              <LoadingSpinner size="sm" />
            ) : downloadLinks && downloadLinks.length > 0 ? (
              <div className="space-y-2">
                {downloadLinks.map((link: any) => (
                  <div key={link.id} className="flex items-center justify-between p-2 bg-gray-700 rounded">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <Badge variant="outline" className="text-xs">
                          {link.quality}
                        </Badge>
                        <span className="text-sm text-gray-300">{link.serverName}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {link.fileSize} • {link.resolution}
                      </p>
                    </div>
                    <Button
                      onClick={() => handleDownload(link)}
                      size="sm"
                      variant="ghost"
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">لا توجد روابط تحميل متاحة</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}