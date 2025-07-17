import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Play, Star, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Content {
  id: number;
  title: string;
  titleAr: string;
  poster: string;
  rating: number;
  releaseDate: string;
  duration?: number;
  type: string;
}

interface SimpleContentGridProps {
  title: string;
  endpoint: string;
  viewAllLink?: string;
}

export default function SimpleContentGrid({ title, endpoint, viewAllLink }: SimpleContentGridProps) {
  const { data: response, isLoading } = useQuery({
    queryKey: [endpoint],
    queryFn: async () => {
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    }
  });

  const content = response?.data?.content || [];

  if (isLoading) {
    return (
      <section className="spacing-clean">
        <div className="container-clean">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{title}</h2>
          </div>
          <div className="grid-clean grid-clean-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="content-card h-80 loading-skeleton" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="spacing-clean">
      <div className="container-clean">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-clean">{title}</h2>
          {viewAllLink && (
            <Link href={viewAllLink}>
              <Button variant="ghost" className="btn-ghost">
                عرض الكل
              </Button>
            </Link>
          )}
        </div>
        
        <div className="grid-clean grid-clean-4">
          {content.slice(0, 8).map((item: Content) => (
            <Link key={item.id} href={`/content/${item.id}`}>
              <div className="content-card group cursor-pointer">
                <div className="relative aspect-[2/3] overflow-hidden">
                  <img
                    src={item.poster ? `/serverdata/images/${item.poster}` : '/api/placeholder/300/450'}
                    alt={item.titleAr || item.title}
                    className="image-clean w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/api/placeholder/300/450';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Play className="h-12 w-12 text-white" />
                  </div>
                  <div className="absolute top-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs">
                    {item.type === 'movie' ? 'فيلم' : 
                     item.type === 'series' ? 'مسلسل' : 
                     item.type === 'program' ? 'برنامج' :
                     item.type === 'game' ? 'لعبة' :
                     item.type === 'application' ? 'تطبيق' :
                     item.type === 'theater' ? 'مسرح' :
                     item.type === 'wrestling' ? 'مصارعة' :
                     item.type === 'sports' ? 'رياضة' : item.type}
                  </div>
                </div>
                
                <div className="p-3">
                  <h3 className="font-semibold text-sm line-clamp-2 mb-2 text-clean">
                    {item.titleAr || item.title}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-clean mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500" />
                      <span>{item.rating.toFixed(1)}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(item.releaseDate).getFullYear()}</span>
                    </div>
                    
                    {item.duration && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{item.duration}د</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}