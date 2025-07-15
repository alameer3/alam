import { Link } from "wouter";
import { Play, Calendar, Star, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AkOriginalContentCardProps {
  id: number;
  title: string;
  titleAr?: string;
  image: string;
  type: string;
  year?: string;
  rating?: number;
  views?: number;
  quality?: string;
  duration?: string;
}

export default function AkOriginalContentCard({
  id,
  title,
  titleAr,
  image,
  type,
  year,
  rating,
  views,
  quality,
  duration
}: AkOriginalContentCardProps) {
  
  const getDetailLink = () => {
    const slug = (titleAr || title).toLowerCase().replace(/\s+/g, '-');
    switch (type) {
      case 'movie':
        return `/movie/${id}/${slug}`;
      case 'series':
        return `/series/${id}/${slug}`;
      case 'tv':
        return `/shows/${id}/${slug}`;
      default:
        return `/mix/${id}/${slug}`;
    }
  };

  return (
    <div className="ak-card group relative">
      <Link to={getDetailLink()}>
        <div className="relative overflow-hidden">
          <img
            src={image}
            alt={titleAr || title}
            className="ak-poster transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Quality Badge */}
          {quality && (
            <Badge className="absolute top-2 right-2 ak-badge">
              {quality}
            </Badge>
          )}
          
          {/* Rating */}
          {rating && (
            <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center space-x-reverse space-x-1">
              <Star className="h-3 w-3 text-yellow-400 fill-current" />
              <span>{rating}</span>
            </div>
          )}
          
          {/* Duration */}
          {duration && (
            <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              {duration}
            </div>
          )}
          
          {/* Play Overlay */}
          <div className="ak-overlay">
            <button className="ak-play-btn">
              <Play className="h-6 w-6" />
            </button>
          </div>
        </div>
      </Link>
      
      {/* Content Info */}
      <div className="p-3">
        <Link to={getDetailLink()}>
          <h3 className="ak-title line-clamp-2 hover:text-primary transition-colors">
            {titleAr || title}
          </h3>
        </Link>
        
        <div className="flex items-center justify-between ak-meta">
          <div className="flex items-center space-x-reverse space-x-2">
            <Calendar className="h-3 w-3" />
            <span>{year || "2024"}</span>
          </div>
          
          {views && (
            <div className="flex items-center space-x-reverse space-x-2">
              <Eye className="h-3 w-3" />
              <span>{views.toLocaleString()}</span>
            </div>
          )}
        </div>
        
        {/* Type Badge */}
        <div className="mt-2">
          <Badge variant="outline" className="text-xs">
            {type === 'movie' && 'فيلم'}
            {type === 'series' && 'مسلسل'}
            {type === 'tv' && 'تلفزيون'}
            {type === 'misc' && 'منوعات'}
          </Badge>
        </div>
      </div>
    </div>
  );
}