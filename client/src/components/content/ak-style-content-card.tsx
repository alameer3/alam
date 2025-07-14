import { useState } from "react";
import { Link } from "wouter";
import { Star, Play, Download, Share2, Heart, Calendar, Clock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Content } from "@shared/schema";

interface AkStyleContentCardProps {
  content: Content;
  onClick?: (content: Content) => void;
  showType?: boolean;
  variant?: "grid" | "list";
}

function QualityBadge({ quality, resolution }: { quality?: string; resolution?: string }) {
  const getQualityColor = (qual: string) => {
    switch (qual?.toLowerCase()) {
      case '4k':
      case 'uhd': return 'bg-purple-600 text-white';
      case 'hd':
      case '1080p': return 'bg-blue-600 text-white';
      case '720p': return 'bg-green-600 text-white';
      case '480p':
      case 'sd': return 'bg-orange-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const displayQuality = resolution || quality || 'HD';
  return (
    <Badge className={`${getQualityColor(displayQuality)} absolute top-2 left-2 z-10 font-bold`}>
      {displayQuality}
    </Badge>
  );
}

function RatingBadge({ rating }: { rating?: number | string }) {
  if (!rating) return null;
  
  const numRating = typeof rating === 'string' ? parseFloat(rating) : rating;
  const color = numRating >= 8 ? 'text-green-400' : numRating >= 6 ? 'text-yellow-400' : 'text-red-400';
  
  return (
    <div className="absolute top-2 right-2 z-10 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
      <Star className={`w-4 h-4 fill-current ${color}`} />
      <span className="text-white font-bold text-sm">{numRating.toFixed(1)}</span>
    </div>
  );
}

export function AkStyleContentCard({ content, onClick, showType = true, variant = "grid" }: AkStyleContentCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const handleCardClick = () => {
    onClick?.(content);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  const posterUrl = content.posterUrl || 'https://via.placeholder.com/300x450?text=' + encodeURIComponent(content.title || 'No Image');

  if (variant === "list") {
    return (
      <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group">
        <div className="flex">
          <div className="relative w-32 h-48 flex-shrink-0">
            <img 
              src={posterUrl}
              alt={content.title || content.titleArabic}
              className="w-full h-full object-cover"
            />
            <QualityBadge quality={content.quality} resolution={content.resolution} />
            <RatingBadge rating={content.rating} />
          </div>
          <div className="flex-1 p-4 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
                {content.titleArabic || content.title}
              </h3>
              <p className="text-gray-400 text-sm mb-2 line-clamp-3">
                {content.descriptionArabic || content.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="secondary" className="text-xs">
                  <Calendar className="w-3 h-3 mr-1" />
                  {content.year}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  {content.duration} دقيقة
                </Badge>
                {showType && (
                  <Badge variant="outline" className="text-xs">
                    {content.type === 'movies' ? 'فيلم' : 
                     content.type === 'series' ? 'مسلسل' :
                     content.type === 'tv' ? 'تلفزيون' : 'منوع'}
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Play className="w-4 h-4 mr-1" />
                مشاهدة
              </Button>
              <Button size="sm" variant="outline">
                <Download className="w-4 h-4 mr-1" />
                تحميل
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link href={`/content/${content.id}`}>
      <div 
        className="relative bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
      >
        {/* Poster Image */}
        <div className="relative aspect-[2/3] overflow-hidden">
          <img 
            src={posterUrl}
            alt={content.title || content.titleArabic}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Quality Badge */}
          <QualityBadge quality={content.quality} resolution={content.resolution} />
          
          {/* Rating Badge */}
          <RatingBadge rating={content.rating} />
          
          {/* Hover Overlay */}
          <div className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'} flex flex-col justify-center items-center gap-3`}>
            <Button 
              size="sm" 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <Play className="w-4 h-4 mr-2" />
              مشاهدة
            </Button>
            
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline"
                className="bg-black/50 border-white/20 text-white hover:bg-white/10"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <Download className="w-4 h-4" />
              </Button>
              
              <Button 
                size="sm" 
                variant="outline"
                className={`bg-black/50 border-white/20 hover:bg-white/10 ${isFavorited ? 'text-red-500' : 'text-white'}`}
                onClick={handleFavoriteClick}
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
              </Button>
              
              <Button 
                size="sm" 
                variant="outline"
                className="bg-black/50 border-white/20 text-white hover:bg-white/10"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Content Info */}
        <div className="p-4">
          <h3 className="text-white font-bold text-sm mb-2 line-clamp-2 leading-tight">
            {content.titleArabic || content.title}
          </h3>
          
          <div className="flex flex-wrap gap-1 mb-2">
            <Badge variant="secondary" className="text-xs">
              {content.year}
            </Badge>
            {showType && (
              <Badge variant="outline" className="text-xs">
                {content.type === 'movies' ? 'فيلم' : 
                 content.type === 'series' ? 'مسلسل' :
                 content.type === 'tv' ? 'تلفزيون' : 'منوع'}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {content.duration} د
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {Math.floor(Math.random() * 1000)}
            </span>
          </div>
        </div>
        
        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-900 to-transparent pointer-events-none"></div>
      </div>
    </Link>
  );
}