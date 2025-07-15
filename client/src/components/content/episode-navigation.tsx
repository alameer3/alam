import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Play, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'wouter';

interface Episode {
  id: number;
  number: number;
  title: string;
  duration?: string;
  releaseDate?: string;
  quality?: string;
  language?: string;
}

interface EpisodeNavigationProps {
  currentEpisode: Episode;
  previousEpisode?: Episode;
  nextEpisode?: Episode;
  seriesId: number;
  seriesTitle: string;
}

export default function EpisodeNavigation({
  currentEpisode,
  previousEpisode,
  nextEpisode,
  seriesId,
  seriesTitle
}: EpisodeNavigationProps) {
  const navigate = useNavigate();

  const handleEpisodeClick = (episodeId: number) => {
    navigate(`/series/${seriesId}/episode/${episodeId}`);
  };

  return (
    <div className="space-y-4">
      {/* Current Episode Info */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {seriesTitle} - الحلقة {currentEpisode.number}
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              {currentEpisode.language && (
                <span>اللغة: {currentEpisode.language}</span>
              )}
              {currentEpisode.quality && (
                <>
                  <span>-</span>
                  <Badge variant="secondary">{currentEpisode.quality}</Badge>
                </>
              )}
              {currentEpisode.duration && (
                <>
                  <span>-</span>
                  <span>مدة الحلقة: {currentEpisode.duration}</span>
                </>
              )}
            </div>
            {currentEpisode.releaseDate && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                تـ الإضافة: {new Date(currentEpisode.releaseDate).toLocaleDateString('ar-EG', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              <Play className="w-4 h-4 mr-2" />
              مشاهدة
            </Button>
            <Button size="sm" variant="outline">
              <Download className="w-4 h-4 mr-2" />
              تحميل
            </Button>
          </div>
        </div>
      </div>

      {/* Episode Navigation */}
      <div className="flex items-center justify-between">
        {previousEpisode ? (
          <Button
            variant="outline"
            onClick={() => handleEpisodeClick(previousEpisode.id)}
            className="flex items-center gap-2"
          >
            <ChevronRight className="w-4 h-4" />
            <div className="text-right">
              <div className="font-medium">الحلقة السابقة</div>
              <div className="text-sm text-gray-500">
                {previousEpisode.number}
              </div>
            </div>
          </Button>
        ) : (
          <div></div>
        )}

        {nextEpisode ? (
          <Button
            variant="outline"
            onClick={() => handleEpisodeClick(nextEpisode.id)}
            className="flex items-center gap-2"
          >
            <div className="text-left">
              <div className="font-medium">الحلقة التالية</div>
              <div className="text-sm text-gray-500">
                {nextEpisode.number}
              </div>
            </div>
            <ChevronLeft className="w-4 h-4" />
          </Button>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}