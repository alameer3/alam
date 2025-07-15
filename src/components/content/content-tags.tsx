import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Hash } from 'lucide-react';

interface ContentTagsProps {
  tags: string[];
  onTagClick?: (tag: string) => void;
}

export default function ContentTags({ tags, onTagClick }: ContentTagsProps) {
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Hash className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          وسوم:
        </span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="cursor-pointer hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-900 dark:hover:text-blue-300 transition-colors"
            onClick={() => onTagClick?.(tag)}
          >
            #{tag}
          </Badge>
        ))}
      </div>
    </div>
  );
}