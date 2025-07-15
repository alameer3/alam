import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Download, Music, BookOpen, Image, Video } from 'lucide-react';

interface MixedContentItem {
  id: number;
  title: string;
  type: 'quran' | 'islamic' | 'books' | 'sports' | 'images' | 'music' | 'radio' | 'clip';
  thumbnail?: string;
  duration?: string;
  quality?: string;
  description?: string;
  size?: string;
  uploadDate?: string;
}

interface MixedContentGridProps {
  items: MixedContentItem[];
  onItemClick?: (item: MixedContentItem) => void;
}

const typeConfig = {
  quran: {
    name: 'القرآن الكريم',
    icon: BookOpen,
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  },
  islamic: {
    name: 'إسلاميات وأناشيد',
    icon: Music,
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
  },
  books: {
    name: 'كتب وأبحاث',
    icon: BookOpen,
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
  },
  sports: {
    name: 'رياضة',
    icon: Play,
    color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
  },
  images: {
    name: 'صور وخلفيات',
    icon: Image,
    color: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
  },
  music: {
    name: 'موسيقى',
    icon: Music,
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  },
  radio: {
    name: 'مسلسلات إذاعية',
    icon: Play,
    color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
  },
  clip: {
    name: 'فيديو كليب',
    icon: Video,
    color: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200'
  }
};

export default function MixedContentGrid({ items, onItemClick }: MixedContentGridProps) {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">
          لا توجد عناصر في قسم المنوعات حالياً
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((item) => {
        const config = typeConfig[item.type];
        const Icon = config.icon;

        return (
          <Card
            key={item.id}
            className="hover:shadow-lg transition-shadow cursor-pointer group"
            onClick={() => onItemClick?.(item)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge className={`${config.color} text-xs`}>
                  <Icon className="w-3 h-3 mr-1" />
                  {config.name}
                </Badge>
                {item.quality && (
                  <Badge variant="outline" className="text-xs">
                    {item.quality}
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {/* Thumbnail */}
              {item.thumbnail && (
                <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/placeholder-thumbnail.jpg';
                    }}
                  />
                  {item.duration && (
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {item.duration}
                    </div>
                  )}
                </div>
              )}

              {/* Title and Description */}
              <div className="space-y-2">
                <CardTitle className="text-lg line-clamp-2">
                  {item.title}
                </CardTitle>
                {item.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {item.description}
                  </p>
                )}
              </div>

              {/* Meta Information */}
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-3">
                  {item.size && <span>{item.size}</span>}
                  {item.uploadDate && (
                    <span>
                      {new Date(item.uploadDate).toLocaleDateString('ar-EG')}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button size="sm" className="flex-1">
                  <Play className="w-4 h-4 mr-1" />
                  {item.type === 'images' ? 'عرض' : 'تشغيل'}
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Download className="w-4 h-4 mr-1" />
                  تحميل
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}