import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Play, Clock, Calendar, Eye } from "lucide-react";
import { Link } from "wouter";

interface Content {
  id: number;
  title: string;
  titleArabic?: string;
  type: string;
  year: number;
  rating: number;
  quality: string;
  resolution: string;
  language: string;
  duration?: number;
  views?: number;
  poster?: string;
  description?: string;
  genres?: string[];
  categories?: string[];
  releaseDate?: string;
}

interface AkStyleContentGridProps {
  content: Content[];
  loading?: boolean;
  error?: string;
}

export default function AkStyleContentGrid({ content, loading, error }: AkStyleContentGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
        {Array.from({ length: 24 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="aspect-[2/3] bg-gray-300 rounded-t-lg" />
            <CardContent className="p-3">
              <div className="h-4 bg-gray-300 rounded mb-2" />
              <div className="h-3 bg-gray-300 rounded w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!content || content.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">لا توجد محتويات للعرض</p>
      </div>
    );
  }

  const getContentLink = (item: Content) => {
    const title = item.titleArabic || item.title;
    const slug = title.replace(/[^a-zA-Z0-9\u0600-\u06FF\s]/g, '').replace(/\s+/g, '-');
    
    switch (item.type) {
      case 'movie':
        return `/movie/${item.id}/${slug}`;
      case 'series':
        return `/series/${item.id}/${slug}`;
      case 'television':
        return `/shows/${item.id}/${slug}`;
      case 'miscellaneous':
        return `/mix/${item.id}/${slug}`;
      default:
        return `/content/${item.id}`;
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality.toLowerCase()) {
      case 'bluray':
      case '4k':
        return 'bg-purple-500';
      case 'hd':
      case '1080p':
        return 'bg-blue-500';
      case '720p':
        return 'bg-green-500';
      case 'dvd':
      case '480p':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'movie':
        return 'فيلم';
      case 'series':
        return 'مسلسل';
      case 'television':
        return 'برنامج تلفزيوني';
      case 'miscellaneous':
        return 'منوعات';
      default:
        return 'محتوى';
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
      {content.map((item) => (
        <Card key={item.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
          <div className="relative aspect-[2/3] overflow-hidden">
            {/* Poster Image */}
            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              {item.poster ? (
                <img
                  src={item.poster}
                  alt={item.titleArabic || item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="text-white text-center p-4">
                  <Play className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm opacity-70">{item.titleArabic || item.title}</p>
                </div>
              )}
            </div>

            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
              <Play className="w-16 h-16 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Quality Badge */}
            <Badge className={`absolute top-2 right-2 ${getQualityColor(item.quality)} text-white text-xs`}>
              {item.quality}
            </Badge>

            {/* Resolution Badge */}
            {item.resolution && (
              <Badge className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs">
                {item.resolution}
              </Badge>
            )}

            {/* Rating */}
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              {item.rating.toFixed(1)}
            </div>
          </div>

          <CardContent className="p-3">
            <Link to={getContentLink(item)}>
              <h3 className="font-semibold text-sm mb-1 line-clamp-2 hover:text-blue-600 transition-colors">
                {item.titleArabic || item.title}
              </h3>
            </Link>
            
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span>{getTypeLabel(item.type)}</span>
              <span>{item.year}</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
              <Calendar className="w-3 h-3" />
              <span>{item.language}</span>
              {item.duration && (
                <>
                  <Clock className="w-3 h-3" />
                  <span>{item.duration} دقيقة</span>
                </>
              )}
            </div>

            {item.views && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Eye className="w-3 h-3" />
                <span>{item.views.toLocaleString()} مشاهدة</span>
              </div>
            )}

            {/* Genres */}
            {item.genres && item.genres.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {item.genres.slice(0, 2).map((genre) => (
                  <Badge key={genre} variant="secondary" className="text-xs px-1 py-0">
                    {genre}
                  </Badge>
                ))}
                {item.genres.length > 2 && (
                  <Badge variant="secondary" className="text-xs px-1 py-0">
                    +{item.genres.length - 2}
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}