import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Star, Database } from 'lucide-react';

interface ExternalLinksProps {
  imdbId?: string;
  tmdbId?: string;
  rottenTomatoesId?: string;
  imdbRating?: number;
  tmdbRating?: number;
  rottenTomatoesRating?: number;
}

export default function ExternalLinks({
  imdbId,
  tmdbId,
  rottenTomatoesId,
  imdbRating,
  tmdbRating,
  rottenTomatoesRating
}: ExternalLinksProps) {
  const links = [
    {
      name: 'IMDb',
      url: imdbId ? `https://www.imdb.com/title/${imdbId}` : null,
      icon: '/assets/imdb-icon.png',
      rating: imdbRating,
      ratingMax: 10
    },
    {
      name: 'TMDb',
      url: tmdbId ? `https://www.themoviedb.org/movie/${tmdbId}` : null,
      icon: '/assets/tmdb-icon.png',
      rating: tmdbRating,
      ratingMax: 10
    },
    {
      name: 'Rotten Tomatoes',
      url: rottenTomatoesId ? `https://www.rottentomatoes.com/m/${rottenTomatoesId}` : null,
      icon: '/assets/rt-icon.png',
      rating: rottenTomatoesRating,
      ratingMax: 100
    }
  ];

  const availableLinks = links.filter(link => link.url);

  if (availableLinks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Database className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          روابط خارجية:
        </span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {availableLinks.map((link, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            asChild
            className="flex items-center gap-2 h-8"
          >
            <a
              href={link.url!}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <img
                src={link.icon}
                alt={link.name}
                className="w-4 h-4"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <span>{link.name}</span>
              {link.rating && (
                <Badge variant="secondary" className="text-xs">
                  <Star className="w-3 h-3 mr-1" />
                  {link.rating}/{link.ratingMax}
                </Badge>
              )}
              <ExternalLink className="w-3 h-3" />
            </a>
          </Button>
        ))}
      </div>
    </div>
  );
}