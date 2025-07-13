import { memo, useMemo, useCallback } from 'react';
import { Content } from '@shared/schema';

// Performance optimization hooks
export const useOptimizedContent = (content: Content[], filters: any) => {
  return useMemo(() => {
    if (!content || !filters) return content;
    
    let filtered = content;

    // Apply filters
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(item => item.category === filters.category);
    }
    
    if (filters.genre && filters.genre !== 'all') {
      filtered = filtered.filter(item => item.genre === filters.genre);
    }
    
    if (filters.year) {
      filtered = filtered.filter(item => item.year === parseInt(filters.year));
    }
    
    if (filters.language && filters.language !== 'all') {
      filtered = filtered.filter(item => item.language === filters.language);
    }
    
    if (filters.quality && filters.quality !== 'all') {
      filtered = filtered.filter(item => item.quality === filters.quality);
    }
    
    if (filters.rating) {
      filtered = filtered.filter(item => item.rating >= parseFloat(filters.rating));
    }

    return filtered;
  }, [content, filters]);
};

// Memoized content card component
export const MemoizedContentCard = memo(({ content, onClick }: { 
  content: Content; 
  onClick: (content: Content) => void 
}) => {
  const handleClick = useCallback(() => {
    onClick(content);
  }, [content, onClick]);

  return (
    <div onClick={handleClick} className="cursor-pointer">
      {/* Content card implementation */}
    </div>
  );
});

// Virtual scrolling hook for large lists
export const useVirtualScroll = (items: any[], containerHeight: number, itemHeight: number) => {
  return useMemo(() => {
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const bufferCount = Math.floor(visibleCount / 3);
    
    return {
      visibleCount,
      bufferCount,
      totalHeight: items.length * itemHeight
    };
  }, [items.length, containerHeight, itemHeight]);
};

// Optimized search function
export const useOptimizedSearch = (items: Content[], query: string) => {
  return useMemo(() => {
    if (!query.trim()) return items;
    
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
    
    return items.filter(item => {
      const searchableText = `${item.title} ${item.description} ${item.genre} ${item.category}`.toLowerCase();
      return searchTerms.every(term => searchableText.includes(term));
    });
  }, [items, query]);
};